import test from "node:test";
import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import {empty} from "../src/model.ts";
import {legacyEngSnapshot} from "../src/eng-store.ts";
import {writeEngStreamV4,openEngStreamV4,openEngStreamCompatible} from "../src/eng-stream-v4.ts";
import {openEngStream} from "../src/eng-stream.ts";
const hash=async b=>createHash("sha256").update(b).digest("hex");
const row={id:"r_abc_123",title:"Water",notes:"",dueDate:"2027-01-31",dueTime:"09:00",repeat:"monthly",anchorDay:31,completed:false,createdAt:"2026-10-19T12:00:00Z",updatedAt:"2026-10-19T12:00:00Z"};
test("v4 archive round trip and fail-closed damaged reminder frame",async()=>{
 const snapshot=legacyEngSnapshot(JSON.stringify(empty())),parts=[];
 await writeEngStreamV4(snapshot,{version:1,rows:[row]},async()=>{throw Error("unexpected media")},hash,{write:async b=>parts.push(b.slice())});
 const raw=Buffer.concat(parts.map(b=>Buffer.from(b)));const reader=b=>({size:b.length,read:async(o,n)=>b.subarray(o,o+n)});
 const opened=await openEngStreamV4(reader(raw),hash);assert.equal(opened.source,"Full v4");assert.equal((await openEngStreamCompatible(reader(raw),hash)).reminders.rows.length,1);assert.equal(opened.reminders.rows[0].anchorDay,31);
 await assert.rejects(openEngStream(reader(raw),hash));
 const bad=Buffer.from(raw);bad[10]=255;await assert.rejects(openEngStreamV4(reader(bad),hash));
 await assert.rejects(openEngStreamV4(reader(raw.subarray(0,raw.length-1)),hash));
});

test('legacy full v3 is readable without inventing reminder rows',async()=>{
 const {writeEngStream}=await import('../src/eng-stream.ts');const parts=[];
 await writeEngStream(legacyEngSnapshot(JSON.stringify(empty())),async()=>{throw Error('unexpected media')},hash,{write:async b=>parts.push(b.slice())});
 const raw=Buffer.concat(parts.map(b=>Buffer.from(b)));
 const opened=await openEngStreamCompatible({size:raw.length,read:async(o,n)=>raw.subarray(o,o+n)},hash);
 assert.equal(opened.source,'Full v3');assert.equal(opened.reminders,null);
});

test("Full v4 fails closed for damaged header, frame, reminder JSON, unsupported reminder version, and truncated payload",async()=>{
 const snapshot=legacyEngSnapshot(JSON.stringify(empty())),parts=[];
 await writeEngStreamV4(snapshot,{version:1,rows:[row]},async()=>{throw Error("unexpected media")},hash,{write:async b=>parts.push(b.slice())});
 const original=Buffer.concat(parts.map(b=>Buffer.from(b)));
 const read=b=>({size:b.length,read:async(offset,count)=>b.subarray(offset,offset+count)});
 const damaged=[];
 const badMagic=Buffer.from(original);badMagic[0]=0;damaged.push(badMagic);
 const badLength=Buffer.from(original);badLength.writeUInt32BE(5000001,6);damaged.push(badLength);
 const truncatedReminder=Buffer.from(original.subarray(0,12));damaged.push(truncatedReminder);
 const badJson=Buffer.from(original);badJson[10]=0xff;damaged.push(badJson);
 const wrongVersion=Buffer.from(original);const sectionSize=wrongVersion.readUInt32BE(6);const section=JSON.parse(wrongVersion.subarray(10,10+sectionSize).toString());section.version=2;const versionBytes=Buffer.from(JSON.stringify(section));if(versionBytes.length===sectionSize){versionBytes.copy(wrongVersion,10);damaged.push(wrongVersion);}
 damaged.push(Buffer.from(original.subarray(0,original.length-1)));
 for(const [index,bytes] of damaged.entries())await assert.rejects(openEngStreamV4(read(bytes),hash),undefined,`Corruption case ${index} must reject`);
});
