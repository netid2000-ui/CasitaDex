import test from 'node:test';import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';import fs from 'node:fs';import path from 'node:path';import {tmpdir} from 'node:os';
import {createHash} from 'node:crypto';
import {ENG_E_DATABASE,ENG_E_MEDIA_ROOT} from '../src/sb20-expo-ports.ts';
import {createEngFEBridge} from '../src/sb20-eng-f-e-bridge.ts';
import {saveAsync,inspectAsync} from '../src/sb20-eng-f-d-async.ts';
const bytes=Buffer.from('ENG-F-E synthetic test photo');
const digest={sha256:async b=>createHash('sha256').update(b).digest('hex')};
function fixture(){
 const root=fs.mkdtempSync(path.join(tmpdir(),'SB20-ENG-F-E-SYNTHETIC-'));
 let db=new DatabaseSync(path.join(root,ENG_E_DATABASE));db.exec('PRAGMA foreign_keys=ON');
 const sql={
  execAsync:async x=>db.exec(x),
  runAsync:async(q,...a)=>db.prepare(q).run(...a),
  getFirstAsync:async(q,...a)=>db.prepare(q).get(...a)??null,
  getAllAsync:async(q,...a)=>db.prepare(q).all(...a),
  withExclusiveTransactionAsync:async fn=>{db.exec('BEGIN IMMEDIATE');try{await fn(sql);db.exec('COMMIT')}catch(e){db.exec('ROLLBACK');throw e}}
 };
 const io={
  exists:async p=>fs.existsSync(path.join(root,p)),
  write:async(p,b)=>{const n=path.join(root,p);fs.mkdirSync(path.dirname(n),{recursive:true});fs.writeFileSync(n,b,{flag:'wx'})},
  read:async p=>fs.readFileSync(path.join(root,p))
 };
 const op={token:'try1',memoryId:'memory1',draftId:'draft1',phase:'pending',photos:[{id:'photo1',owner:'draft1',hash:createHash('sha256').update(bytes).digest('hex'),bytes:bytes.length}]};
 return {root,sql,io,op,contents:new Map([['photo1',bytes]]),get db(){return db},
  reopen(){db.close();db=new DatabaseSync(path.join(root,ENG_E_DATABASE))},
  close(){db.close();fs.rmSync(root,{recursive:true,force:true})}};
}
test('guard refuses live/legacy SQLite or media names',async()=>{
 const x=fixture();try{
 await assert.rejects(createEngFEBridge('casitadex-development-v1.db',ENG_E_MEDIA_ROOT,x.sql,x.io),/namespace/);
 await assert.rejects(createEngFEBridge(ENG_E_DATABASE,'casitadex-media-v2',x.sql,x.io),/namespace/);
 }finally{x.close()}
});
test('bridge commits and retries after database reopen without duplicate',async()=>{
 const x=fixture();try{
 let b=await createEngFEBridge(ENG_E_DATABASE,ENG_E_MEDIA_ROOT,x.sql,x.io);
 assert.equal(await saveAsync(b.journal,b.files,digest,x.op,x.contents),'memory1');
 x.reopen();b=await createEngFEBridge(ENG_E_DATABASE,ENG_E_MEDIA_ROOT,x.sql,x.io);
 assert.equal(await saveAsync(b.journal,b.files,digest,x.op,x.contents),'memory1');
 assert.equal(x.db.prepare('SELECT COUNT(*) n FROM f_e_saved').get().n,1);
 assert.equal((await inspectAsync(b.journal,b.files,digest,'try1',new Set(['draft1']))).status,'committed-verified');
 }finally{x.close()}
});
test('promote interruption leaves recovery-needed and original staging bytes',async()=>{
 const x=fixture();try{
 let b=await createEngFEBridge(ENG_E_DATABASE,ENG_E_MEDIA_ROOT,x.sql,x.io);
 await assert.rejects(saveAsync(b.journal,b.files,digest,x.op,x.contents,at=>{if(at==='after-promote')throw Error('fault')}),/fault/);
 x.reopen();b=await createEngFEBridge(ENG_E_DATABASE,ENG_E_MEDIA_ROOT,x.sql,x.io);
 assert.equal((await b.journal.get('try1')).phase,'recovery_needed');
 assert.equal((await b.files.read('photo1')).toString(),bytes.toString());
 assert.equal((await inspectAsync(b.journal,b.files,digest,'try1',new Set())).doNotDelete,true);
 }finally{x.close()}
});
test('SQL commit failure rolls back memory and persists recovery marker',async()=>{
 const x=fixture();try{
 const b=await createEngFEBridge(ENG_E_DATABASE,ENG_E_MEDIA_ROOT,x.sql,x.io);
 x.db.exec("CREATE TRIGGER f_e_fail BEFORE INSERT ON f_e_saved BEGIN SELECT RAISE(ABORT,'fault-sql'); END");
 await assert.rejects(saveAsync(b.journal,b.files,digest,x.op,x.contents),/fault-sql/);
 x.reopen();assert.equal(x.db.prepare('SELECT COUNT(*) n FROM f_e_saved').get().n,0);
 assert.equal((await b.journal.get('try1')).phase,'recovery_needed');
 }finally{x.close()}
});
test('failed recovery marker does not erase promoted synthetic file',async()=>{
 const x=fixture();try{
 const b=await createEngFEBridge(ENG_E_DATABASE,ENG_E_MEDIA_ROOT,x.sql,x.io);
 const broken={...b.journal,transition:async(t,from,to)=>to==='recovery_needed'?false:b.journal.transition(t,from,to)};
 await assert.rejects(saveAsync(broken,b.files,digest,x.op,x.contents,at=>{if(at==='after-promote')throw Error('fault')}),/Failed to persist recovery state/);
 assert.equal((await b.files.read('photo1')).toString(),bytes.toString());
 assert.equal(await b.journal.committed('try1'),null);
 }finally{x.close()}
});
