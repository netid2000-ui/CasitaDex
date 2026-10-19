import test from 'node:test';import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';import {createHash} from 'node:crypto';
import * as fs from 'node:fs';import * as path from 'node:path';import {tmpdir} from 'node:os';
import {guardEngE,ENG_E_DATABASE,ENG_E_MEDIA_ROOT,makeEngESqliteDraftPort,makeEngEFilePort} from '../src/sb20-expo-ports.ts';
import {saveNativeDraft,verifyNativePhoto} from '../src/sb20-native-adapter.ts';
const sha={sha256:async b=>createHash('sha256').update(b).digest('hex')};
function fixture(){
 const root=fs.mkdtempSync(path.join(tmpdir(),'SB20-ENG-E-SYNTHETIC-'));
 const db=new DatabaseSync(path.join(root,ENG_E_DATABASE));
 db.exec('CREATE TABLE eng_e_draft(id TEXT PRIMARY KEY,title TEXT,answer TEXT,checkpoint INTEGER)');
 db.exec('CREATE TABLE eng_e_staged(id TEXT PRIMARY KEY,draftId TEXT,mime TEXT,sha256 TEXT,bytes INTEGER,path TEXT)');
 db.exec('CREATE TABLE eng_e_memories(id TEXT PRIMARY KEY,attempt TEXT UNIQUE,title TEXT,answer TEXT)');
 db.exec('CREATE TABLE eng_e_media(id TEXT PRIMARY KEY,memoryId TEXT,sha256 TEXT,bytes INTEGER,path TEXT)');
 const q={execAsync:async sql=>db.exec(sql),runAsync:async(sql,...a)=>db.prepare(sql).run(...a),
 getFirstAsync:async(sql,...a)=>db.prepare(sql).get(...a)??null,
 getAllAsync:async(sql,...a)=>db.prepare(sql).all(...a),
 withExclusiveTransactionAsync:async fn=>{db.exec('BEGIN IMMEDIATE');try{await fn(q);db.exec('COMMIT')}catch(e){db.exec('ROLLBACK');throw e}}};
 const dirname=path.join(root,ENG_E_MEDIA_ROOT);
 const io={exists:async p=>fs.existsSync(path.join(root,p)),
 write:async(p,bytes)=>{const dest=path.join(root,p);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,bytes)},
 read:async p=>fs.readFileSync(path.join(root,p))};
 const port=makeEngESqliteDraftPort(ENG_E_DATABASE,q),files=makeEngEFilePort(ENG_E_MEDIA_ROOT,io);
 return {root,db,port,files,close(){db.close();fs.rmSync(root,{recursive:true,force:true})}};
}
const bytes=Buffer.from('synthetic-image-data');
async function ready(x){
 await x.port.writeCheckpoint({id:'draft1',title:'Water heater',answer:'',checkpoint:1});
 const rel=await x.files.copyPrivate({id:'photo1',mime:'image/jpeg',bytes});
 await x.port.recordStaged({id:'photo1',draftId:'draft1',mime:'image/jpeg',sha256:await sha.sha256(bytes),bytes:bytes.length,path:rel});
 return rel;
}
test('isolation guards reject original and staging namespaces',()=>{
 assert.throws(()=>guardEngE('casitadex-development-v1.db',ENG_E_MEDIA_ROOT),/namespace guard/);
 assert.throws(()=>guardEngE('casitadex-staging-v1.db',ENG_E_MEDIA_ROOT),/namespace guard/);
 assert.throws(()=>guardEngE(ENG_E_DATABASE,'casitadex-media-v2'),/namespace guard/);
 assert.deepEqual(guardEngE(ENG_E_DATABASE,ENG_E_MEDIA_ROOT),{database:ENG_E_DATABASE,root:ENG_E_MEDIA_ROOT});
});
test('persistent checkpoint permits exactly one draft and monotonic update',async()=>{
 const x=fixture();try{
 await x.port.writeCheckpoint({id:'draft1',title:'First',answer:'',checkpoint:1});
 await assert.rejects(x.port.writeCheckpoint({id:'draft2',title:'Wrong',answer:'',checkpoint:1}),/Existing unfinished draft/);
 await x.port.writeCheckpoint({id:'draft1',title:'Stale',answer:'',checkpoint:0});
 assert.equal((await x.port.readDraft()).title,'First');
 await x.port.writeCheckpoint({id:'draft1',title:'Updated',answer:'',checkpoint:2});
 assert.equal((await x.port.readDraft()).title,'Updated');
 }finally{x.close()}
});
test('private-media copy and verified photo-only save are idempotent',async()=>{
 const x=fixture();try{
 await ready(x);
 const p=(await x.port.readStaged('draft1'))[0];
 assert.equal(await verifyNativePhoto(p,x.files,sha),'verified');
 assert.equal(await saveNativeDraft(x.port,x.files,sha,'attempt1','memory1'),'memory1');
 assert.equal(await saveNativeDraft(x.port,x.files,sha,'attempt1','memory1'),'memory1');
 assert.equal(x.db.prepare('SELECT COUNT(*) n FROM eng_e_memories').get().n,1);
 assert.equal(x.db.prepare('SELECT COUNT(*) n FROM eng_e_media').get().n,1);
 assert.equal(await x.port.readDraft(),null);
 }finally{x.close()}
});
test('corruption fails closed and preserves draft and media metadata',async()=>{
 const x=fixture();try{
 const p=await ready(x);fs.writeFileSync(path.join(x.root,ENG_E_MEDIA_ROOT,p),'corruption');
 await assert.rejects(saveNativeDraft(x.port,x.files,sha,'attempt1','memory1'),/corrupted staged media/);
 assert.equal((await x.port.readDraft()).title,'Water heater');
 assert.equal(x.db.prepare('SELECT COUNT(*) n FROM eng_e_memories').get().n,0);
 }finally{x.close()}
});
test('failed metadata transaction rolls back and preserves staged photo',async()=>{
 const x=fixture();try{
 await ready(x);
 const blocked={...x.port,commitSave:async()=>{throw Error('synthetic interrupted commit')}};
 await assert.rejects(saveNativeDraft(blocked,x.files,sha,'attempt1','memory1'),/interrupted commit/);
 assert.equal(x.db.prepare('SELECT COUNT(*) n FROM eng_e_memories').get().n,0);
 assert.equal(x.db.prepare('SELECT COUNT(*) n FROM eng_e_staged').get().n,1);
 assert.equal(await saveNativeDraft(x.port,x.files,sha,'attempt1','memory1'),'memory1');
 }finally{x.close()}
});
test('unsafe ID, invalid type and path traversal rejected',async()=>{
 const x=fixture();try{
 await assert.rejects(x.files.copyPrivate({id:'../evil',mime:'image/jpeg',bytes}),/Unsafe ID/);
 await assert.rejects(x.files.copyPrivate({id:'photo1',mime:'application/pdf',bytes}),/Invalid photo input/);
 assert.throws(()=>x.files.readPrivate('../evil'),/Unsafe photo path/);
 await assert.rejects(x.port.recordStaged({id:'photo1',draftId:'draft1',mime:'image/jpeg',sha256:'a',bytes:1,path:'../wrong'}),/Unsafe photo path/);
 }finally{x.close()}
});

test('actual SQL trigger failure rolls back attempted Save atomically',async()=>{
 const x=fixture();try{
 await ready(x);
 x.db.exec("CREATE TRIGGER synthetic_fail BEFORE INSERT ON eng_e_media BEGIN SELECT RAISE(ABORT,'synthetic failure'); END");
 await assert.rejects(saveNativeDraft(x.port,x.files,sha,'attempt1','memory1'),/synthetic failure/);
 assert.equal(x.db.prepare('SELECT COUNT(*) n FROM eng_e_memories').get().n,0);
 assert.equal(x.db.prepare('SELECT COUNT(*) n FROM eng_e_media').get().n,0);
 assert.equal(x.db.prepare('SELECT COUNT(*) n FROM eng_e_staged').get().n,1);
 assert.equal((await x.port.readDraft()).id,'draft1');
 x.db.exec('DROP TRIGGER synthetic_fail');
 assert.equal(await saveNativeDraft(x.port,x.files,sha,'attempt1','memory1'),'memory1');
 }finally{x.close()}
});

