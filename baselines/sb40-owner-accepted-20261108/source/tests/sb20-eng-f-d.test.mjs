import test from 'node:test';import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';import {createHash} from 'node:crypto';
import fs from 'node:fs';import path from 'node:path';import {tmpdir} from 'node:os';
import {saveAsync,inspectAsync} from '../src/sb20-eng-f-d-async.ts';
const sha=b=>createHash('sha256').update(b).digest('hex');
const payload=Buffer.from('synthetic-ENG-F-D-image');
function fixture(){
 const root=fs.mkdtempSync(path.join(tmpdir(),'SB20-ENG-F-D-SYNTHETIC-'));
 fs.mkdirSync(path.join(root,'media'));
 let db=new DatabaseSync(path.join(root,'journal.sqlite'));
 db.exec("CREATE TABLE operations(token TEXT PRIMARY KEY,memoryId TEXT,draftId TEXT,phase TEXT,photoJson TEXT)");
 db.exec("CREATE TABLE memories(token TEXT PRIMARY KEY,memoryId TEXT,draftId TEXT)");
 const query={
  get:async token=>{const r=db.prepare('SELECT * FROM operations WHERE token=?').get(token);return r?{token:r.token,memoryId:r.memoryId,draftId:r.draftId,phase:r.phase,photos:JSON.parse(r.photoJson)}:null},
  put:async o=>{db.prepare('INSERT INTO operations VALUES(?,?,?,?,?)').run(o.token,o.memoryId,o.draftId,o.phase,JSON.stringify(o.photos))},
  transition:async(t,from,to)=>db.prepare('UPDATE operations SET phase=? WHERE token=? AND phase=?').run(to,t,from).changes===1,
  committed:async t=>db.prepare('SELECT memoryId FROM memories WHERE token=?').get(t)?.memoryId??null,
  atomicCommit:async(t,m,d)=>{db.exec('BEGIN IMMEDIATE');try{
   db.prepare('INSERT INTO memories VALUES(?,?,?)').run(t,m,d);
   db.prepare("UPDATE operations SET phase='committed' WHERE token=?").run(t);
   db.exec('COMMIT')
  }catch(e){db.exec('ROLLBACK');throw e}}
 };
 const files={
  stage:async(id,b)=>fs.writeFileSync(path.join(root,'media',id+'.part'),b,{flag:'wx'}),
  promote:async id=>fs.renameSync(path.join(root,'media',id+'.part'),path.join(root,'media',id+'.bin')),
  read:async id=>{for(const ext of ['bin','part']){const p=path.join(root,'media',id+'.'+ext);if(fs.existsSync(p))return fs.readFileSync(p)}return null}
 };
 const digest={sha256:async b=>sha(b)};
 const op={token:'attempt1',memoryId:'memory1',draftId:'draft1',phase:'pending',photos:[{id:'photo1',owner:'draft1',hash:sha(payload),bytes:payload.length}]};
 return {root,query,files,digest,op,contents:new Map([['photo1',payload]]),get db(){return db},
 reopen(){db.close();db=new DatabaseSync(path.join(root,'journal.sqlite'))},
 close(){db.close();fs.rmSync(root,{recursive:true,force:true})}};
}
test('async operation commits once and is replayable after DB reopen',async()=>{
 const x=fixture();try{
 assert.equal(await saveAsync(x.query,x.files,x.digest,x.op,x.contents),'memory1');
 x.reopen();assert.equal(await saveAsync(x.query,x.files,x.digest,x.op,x.contents),'memory1');
 assert.equal(x.db.prepare('SELECT COUNT(*) n FROM memories').get().n,1);
 assert.equal((await inspectAsync(x.query,x.files,x.digest,'attempt1',new Set(['draft1']))).status,'committed-verified');
 }finally{x.close()}
});
test('failure after staging durably marks recovery-needed and preserves photo bytes',async()=>{
 const x=fixture();try{
 await assert.rejects(saveAsync(x.query,x.files,x.digest,x.op,x.contents,p=>{if(p==='after-stage-journal')throw Error('halt')}),/halt/);
 x.reopen();assert.equal((await x.query.get('attempt1')).phase,'recovery_needed');
 assert.equal((await x.files.read('photo1')).toString(),payload.toString());
 assert.equal((await inspectAsync(x.query,x.files,x.digest,'attempt1',new Set())).doNotDelete,true);
 }finally{x.close()}
});
test('failure after promotion retains bytes and marks uncertain',async()=>{
 const x=fixture();try{
 await assert.rejects(saveAsync(x.query,x.files,x.digest,x.op,x.contents,p=>{if(p==='after-promote')throw Error('halt')}),/halt/);
 x.reopen();assert.equal((await x.query.get('attempt1')).phase,'recovery_needed');
 assert.equal((await x.files.read('photo1')).toString(),payload.toString());
 await assert.rejects(saveAsync(x.query,x.files,x.digest,x.op,x.contents),/Recovery inspection required/);
 }finally{x.close()}
});
test('failed atomic metadata transaction leaves durable uncertain state',async()=>{
 const x=fixture();try{
 const broken={...x.query,atomicCommit:async()=>{throw Error('SQL fault')}};
 await assert.rejects(saveAsync(broken,x.files,x.digest,x.op,x.contents),/SQL fault/);
 x.reopen();assert.equal((await x.query.get('attempt1')).phase,'recovery_needed');
 assert.equal(await x.query.committed('attempt1'),null);
 assert.equal((await x.files.read('photo1')).toString(),payload.toString());
 }finally{x.close()}
});
test('lost acknowledgement after commit retries once',async()=>{
 const x=fixture();try{
 await assert.rejects(saveAsync(x.query,x.files,x.digest,x.op,x.contents,p=>{if(p==='after-commit')throw Error('lost ack')}),/lost ack/);
 x.reopen();assert.equal(await saveAsync(x.query,x.files,x.digest,x.op,x.contents),'memory1');
 assert.equal(x.db.prepare('SELECT COUNT(*) n FROM memories').get().n,1);
 }finally{x.close()}
});
test('invalid hash fails closed, persists recovery state, retains no false memory',async()=>{
 const x=fixture();try{
 const corrupted=new Map([['photo1',Buffer.from('wrong bytes')]]);
 await assert.rejects(saveAsync(x.query,x.files,x.digest,x.op,corrupted),/Invalid media bytes/);
 x.reopen();assert.equal((await x.query.get('attempt1')).phase,'recovery_needed');
 assert.equal(await x.query.committed('attempt1'),null);
 }finally{x.close()}
});
