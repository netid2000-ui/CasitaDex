import test from 'node:test';import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';import fs from 'node:fs';import path from 'node:path';import {tmpdir} from 'node:os';
import {inventoryOwners,classifyMedia,resolveSave} from '../src/sb20-eng-f-f-ownership.ts';
const day=86400000,now=Date.UTC(2026,9,17);
const refs=["active","archived","recently_deleted","draft","pending","rollback","legacy"].map((kind,i)=>({kind,photoId:'photo'+i,ownerId:'owner'+i,...(kind==="recently_deleted"?{deletedAt:now-3*day}:{})}));
const snapshot=()=>({complete:true,checkedAt:now,deletedRetentionMs:30*day,refs});
function fixture(){
 const root=fs.mkdtempSync(path.join(tmpdir(),'SB20-ENG-F-F-SYNTHETIC-'));
 let db=new DatabaseSync(path.join(root,'journal.sqlite'));
 db.exec("CREATE TABLE operations(token TEXT PRIMARY KEY,memory TEXT,phase TEXT)");
 db.exec("CREATE TABLE memories(token TEXT PRIMARY KEY,memory TEXT)");
 db.exec("CREATE TABLE decisions(token TEXT PRIMARY KEY,verdict TEXT)");
 db.prepare('INSERT INTO operations VALUES(?,?,?)').run('attempt1','memory1','committed');
 db.prepare('INSERT INTO memories VALUES(?,?)').run('attempt1','memory1');
 const port={
 committed:async t=>db.prepare('SELECT memory FROM memories WHERE token=?').get(t)?.memory??null,
 operation:async t=>{const x=db.prepare('SELECT memory,phase FROM operations WHERE token=?').get(t);return x?{memoryId:x.memory,phase:x.phase}:null},
 recordDecision:async(t,v)=>{db.prepare('INSERT INTO decisions VALUES(?,?) ON CONFLICT(token) DO UPDATE SET verdict=excluded.verdict').run(t,v)}
 };
 return {root,port,get db(){return db},reopen(){db.close();db=new DatabaseSync(path.join(root,'journal.sqlite'))},close(){db.close();fs.rmSync(root,{recursive:true,force:true})}};
}
test('all seven owner classes protect synthetic photos',()=>{
 const result=classifyMedia(snapshot(),refs.map(r=>({id:r.photoId,integrity:'valid',attemptState:'committed'})));
 assert.equal(result.length,7);assert.ok(result.every(x=>x.protected&&x.decision==='retain'));
});
test('incomplete owner inventory and short trash retention fail closed',()=>{
 assert.throws(()=>inventoryOwners({...snapshot(),complete:false}),/Incomplete/);
 assert.throws(()=>inventoryOwners({...snapshot(),deletedRetentionMs:7*day}),/Insufficient/);
});
test('orphan, missing, corruption and unknown attempt never authorize deletion',()=>{
 const media=[{id:'orphan',integrity:'valid',attemptState:'committed'},{id:'photo0',integrity:'missing',attemptState:'committed'},{id:'photo1',integrity:'corrupt',attemptState:'committed'},{id:'photo2',integrity:'valid',attemptState:'recovery_needed'}];
 const v=classifyMedia(snapshot(),media);
 assert.deepEqual(v.map(x=>x.decision),['review','integrity_failure','integrity_failure','review']);
 assert.ok(v.every(x=>x.protected));
});
test('committed verified owner can be acknowledged after SQLite reopen',async()=>{
 const x=fixture();try{x.reopen();
 const result=await resolveSave(x.port,'attempt1','memory1',classifyMedia(snapshot(),[{id:'photo0',integrity:'valid',attemptState:'committed'}]));
 assert.deepEqual(result,{verdict:'confirmed',safeToAcknowledge:true});
 }finally{x.close()}
});
test('unconfirmed Save writes inspection verdict durably',async()=>{
 const x=fixture();try{
 const v=await resolveSave(x.port,'attempt1','memory1',classifyMedia(snapshot(),[{id:'orphan',integrity:'valid',attemptState:'unknown'}]),true);
 assert.equal(v.safeToAcknowledge,false);x.reopen();
 assert.equal(x.db.prepare('SELECT verdict FROM decisions').get().verdict,'unconfirmed_write');
 }finally{x.close()}
});
test('failed recovery recording refuses acknowledgment',async()=>{
 const x=fixture();try{
 const broken={...x.port,recordDecision:async()=>{throw Error('disk full')}};
 const result=await resolveSave(broken,'attempt1','memory1',classifyMedia(snapshot(),[{id:'photo0',integrity:'missing',attemptState:'committed'}]));
 assert.deepEqual(result,{verdict:'unconfirmed_write',safeToAcknowledge:false});
 assert.equal(x.db.prepare('SELECT COUNT(*) n FROM decisions').get().n,0);
 }finally{x.close()}
});
test('attempt bound to another memory fails closed and persists integrity decision',async()=>{
 const x=fixture();try{
 const v=await resolveSave(x.port,'attempt1','wrongMemory',classifyMedia(snapshot(),[{id:'photo0',integrity:'valid',attemptState:'committed'}]));
 assert.deepEqual(v,{verdict:'integrity_failure',safeToAcknowledge:false});
 x.reopen();assert.equal(x.db.prepare('SELECT verdict FROM decisions').get().verdict,'integrity_failure');
 }finally{x.close()}
});
test('untrusted owner ID and invalid deleted timestamp reject inventory',()=>{
 assert.throws(()=>inventoryOwners({...snapshot(),refs:[{kind:'active',photoId:'../bad',ownerId:'owner'}]}),/Unsafe/);
 assert.throws(()=>inventoryOwners({...snapshot(),refs:[{kind:'recently_deleted',photoId:'photo',ownerId:'owner'}]}),/Invalid deletion time/);
});
