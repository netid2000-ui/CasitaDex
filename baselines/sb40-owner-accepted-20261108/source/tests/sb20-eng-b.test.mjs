import test from "node:test";
import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import {emptyState,beginDraft,checkpoint,stagePhoto,save,cloneState,reconcile,removeUnreferenced,settleJournal,discardDraft} from "../src/sb20-draft-media.ts";
const digest=b=>createHash("sha256").update(b).digest("hex");
const hash=async b=>digest(b);
const input=(id="p1")=>{const bytes=Uint8Array.from([1,2,3,4]);return {id,mime:"image/jpeg",bytes,sha256:digest(bytes)};};
function draft(){const s=emptyState();beginDraft(s,"draft1");checkpoint(s,{title:"Water heater"});return s;}
async function withPhoto(){const s=draft();await stagePhoto(s,input(),hash);return s;}
test("one private draft, checkpoint and interruption before acknowledgement",()=>{
 const s=draft(),checkpointed=cloneState(s);
 assert.throws(()=>checkpoint(s,{answer:"unfinished"},()=>{throw Error("power cut")}),/power cut/);
 assert.deepEqual(s,checkpointed);assert.throws(()=>beginDraft(s,"new"),/Existing draft/);
 assert.equal(s.draft.checkpoint,1);
});
test("picker failures and invalid hash preserve durable draft",async()=>{
 const s=draft(),before=cloneState(s);
 await assert.rejects(stagePhoto(s,{...input(),sha256:"f".repeat(64)},hash),/hash mismatch/);
 await assert.rejects(stagePhoto(s,input(),hash,()=>{throw Error("picker denied")}),/picker denied/);
 assert.deepEqual(s,before);
});
test("five staged photos, sixth blocked, bytes are copied",async()=>{
 const s=draft();for(let i=0;i<5;i++)await stagePhoto(s,input("p"+i),hash);
 assert.equal(s.draft.photoIds.length,5);
 await assert.rejects(stagePhoto(s,input("p6"),hash),/Five photos/);
 const buffer=input("p0").bytes;buffer[0]=100;
 assert.equal(s.photos.p0.bytes[0],1);
});
test("title or real content required, photo-only valid without false answer",async()=>{
 const s=draft();assert.throws(()=>save(s,"try1","m1"),/Title and content/);
 await stagePhoto(s,input(),hash);const result=save(s,"try1","m1");
 assert.equal(result.answer,"");assert.equal(result.title,"Water heater");
 assert.equal(s.photos.p1.owner,"m1");assert.equal(reconcile(s).problems.length,0);
});
test("failure before promotion leaves original draft/media unchanged",async()=>{
 const s=await withPhoto(),before=cloneState(s);
 assert.throws(()=>save(s,"attempt1","memory1",phase=>{if(phase==="before-promote")throw Error("crash")}),/crash/);
 assert.deepEqual(s,before);
});
test("failure after promotion retains media and allows idempotent retry",async()=>{
 const s=await withPhoto();
 assert.throws(()=>save(s,"attempt1","memory1",phase=>{if(phase==="after-promote")throw Error("crash")}),/crash/);
 assert.equal(s.photos.p1.phase,"promoted");assert.equal(s.draft.id,"draft1");
 assert.equal(save(s,"attempt1","memory1").id,"memory1");
 assert.equal(Object.keys(s.memories).length,1);assert.equal(reconcile(s).problems.length,0);
});
test("failure before transaction preserves draft and promoted bytes",async()=>{
 const s=await withPhoto();
 assert.throws(()=>save(s,"attempt1","memory1",phase=>{if(phase==="before-transaction")throw Error("crash")}),/crash/);
 assert.equal(s.draft.id,"draft1");assert.equal(Object.keys(s.memories).length,0);
 assert.equal(save(s,"attempt1","memory1").id,"memory1");
});
test("failure after commit returns existing memory without duplication",async()=>{
 const s=await withPhoto();
 assert.throws(()=>save(s,"attempt1","memory1",phase=>{if(phase==="after-transaction")throw Error("crash")}),/crash/);
 assert.equal(s.draft,null);
 assert.equal(save(s,"attempt1","memory1").id,"memory1");
 assert.equal(Object.keys(s.memories).length,1);
});
test("saved references cannot be cleaned, journal only settled postcommit",async()=>{
 const s=await withPhoto();assert.throws(()=>settleJournal(s,"p1"),/Uncommitted/);
 save(s,"attempt1","memory1");
 assert.throws(()=>removeUnreferenced(s,"p1"),/still protected/);
 settleJournal(s,"p1");assert.throws(()=>removeUnreferenced(s,"p1"),/still protected/);
});
test("discard does not automatically purge staged bytes",async()=>{
 const s=await withPhoto();assert.deepEqual(discardDraft(s),["p1"]);
 assert.ok(s.photos.p1);assert.equal(removeUnreferenced(s,"p1"),true);
});
