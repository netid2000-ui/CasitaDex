import test from 'node:test';import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';import {createHash} from 'node:crypto';
import * as fs from 'node:fs';import * as path from 'node:path';import {tmpdir} from 'node:os';
import {prepare,perform,reconcile,state,mediaState} from '../src/sb20-eng-f-c-coordinator.mjs';
const sha=b=>createHash('sha256').update(b).digest('hex');
const b=Buffer.from('synthetic-only-image');
function setup(){
 const root=fs.mkdtempSync(path.join(tmpdir(),'SB20-ENG-F-C-SYNTHETIC-'));
 const dir=path.join(root,'private-media');fs.mkdirSync(dir);
 let db=new DatabaseSync(path.join(root,'fc.sqlite'));db.exec('PRAGMA foreign_keys=ON');prepare(db);
 const files={
 async stage(id,bytes){fs.writeFileSync(path.join(dir,id+'.partial'),bytes,{flag:'wx'})},
 async read(id){return fs.readFileSync(path.join(dir,id+'.partial'))},
 async promote(id){fs.renameSync(path.join(dir,id+'.partial'),path.join(dir,id+'.bin'))},
 peek(id){const f=path.join(dir,id+'.bin');const tmp=path.join(dir,id+'.partial');return fs.existsSync(f)?fs.readFileSync(f):fs.existsSync(tmp)?fs.readFileSync(tmp):null}
 };
 const args={token:'attempt1',memoryId:'memory1',draftId:'draft1',photos:[{id:'photo1',bytes:b,hash:sha(b),length:b.length}]};
 return {root,files,args,get db(){return db},reopen(){db.close();db=new DatabaseSync(path.join(root,'fc.sqlite'));db.exec('PRAGMA foreign_keys=ON')},close(){db.close();fs.rmSync(root,{recursive:true,force:true})}};
}
test('successful synthetic commit and idempotent retry',async()=>{
 const x=setup();try{
 assert.equal(await perform(x.db,x.files,x.args),'memory1');
 x.reopen();assert.equal(await perform(x.db,x.files,x.args),'memory1');
 assert.equal(x.db.prepare('SELECT COUNT(*) n FROM fc_memories').get().n,1);
 assert.equal(reconcile(x.db,x.files,'attempt1',new Set(['photo1'])).status,'committed-verified');
 }finally{x.close()}
});
test('interrupted staged operation retains bytes and journal',async()=>{
 const x=setup();try{
 await assert.rejects(perform(x.db,x.files,x.args,p=>{if(p==='after-journal-stage')throw Error('halt')}),/halt/);
 x.reopen();assert.equal(state(x.db,'attempt1').phase,'staged');
 assert.equal(reconcile(x.db,x.files,'attempt1').status,'recovery-needed');
 assert.equal(x.files.peek('photo1').toString(),b.toString());
 }finally{x.close()}
});
test('promotion interruption preserves media and prevents unsafe retry',async()=>{
 const x=setup();try{
 await assert.rejects(perform(x.db,x.files,x.args,p=>{if(p==='after-promote')throw Error('halt')}),/halt/);
 x.reopen();
 assert.equal(state(x.db,'attempt1').phase,'promoted');
 assert.equal(reconcile(x.db,x.files,'attempt1').media[0].status,'unverified-owner');
 await assert.rejects(perform(x.db,x.files,x.args),/requires reconciliation/);
 }finally{x.close()}
});
test('failed SQL commit never inserts memory and protects promoted bytes',async()=>{
 const x=setup();try{
 await assert.rejects(perform(x.db,x.files,x.args,p=>{if(p==='before-sql-commit')throw Error('abort')}),/abort/);
 x.reopen();
 assert.equal(x.db.prepare('SELECT COUNT(*) n FROM fc_memories').get().n,0);
 assert.equal(state(x.db,'attempt1').phase,'promoted');
 assert.equal(x.files.peek('photo1').toString(),b.toString());
 }finally{x.close()}
});
test('lost acknowledgement resolves previously committed attempt once',async()=>{
 const x=setup();try{
 await assert.rejects(perform(x.db,x.files,x.args,p=>{if(p==='after-sql-commit')throw Error('ack lost')}),/ack lost/);
 x.reopen();assert.equal(await perform(x.db,x.files,x.args),'memory1');
 assert.equal(x.db.prepare('SELECT COUNT(*) n FROM fc_memories').get().n,1);
 }finally{x.close()}
});
test('manifest mismatch and duplicate attempt identity fail closed',async()=>{
 const x=setup();try{
 await assert.rejects(perform(x.db,x.files,{...x.args,photos:[{...x.args.photos[0],bytes:Buffer.from('wrong')}] }),/Media hash mismatch/);
 await assert.rejects(perform(x.db,x.files,{...x.args,memoryId:'different'}),/Attempt identity conflict/);
 assert.equal(x.db.prepare('SELECT COUNT(*) n FROM fc_memories').get().n,0);
 }finally{x.close()}
});
