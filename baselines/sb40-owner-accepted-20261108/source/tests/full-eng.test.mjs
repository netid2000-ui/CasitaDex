import {restore} from './eng-fixture.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {DatabaseSync} from 'node:sqlite';
import {createEngStore,newEngDraft,legacyEngSnapshot} from '../src/eng-store.ts';
import {encodeEngBackup,decodeEngBackup} from '../src/eng-backup.ts';
import {empty} from '../src/model.ts';
const png=Uint8Array.from([137,80,78,71,13,10,26,10,1,2,3]);
const hash=async bytes=>createHash('sha256').update(bytes).digest('hex');
function adapter(raw){
 const db={execAsync:async sql=>raw.exec(sql),runAsync:async(sql,...args)=>raw.prepare(sql).run(...args),getFirstAsync:async(sql,...args)=>raw.prepare(sql).get(...args)??null,getAllAsync:async(sql,...args)=>raw.prepare(sql).all(...args),
 withExclusiveTransactionAsync:async task=>{raw.exec('BEGIN IMMEDIATE');try{await task(db);raw.exec('COMMIT');}catch(e){raw.exec('ROLLBACK');throw e;}}};return db;
}
function setup(){
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'casitadex-full-eng-')),dbPath=path.join(root,'collection.sqlite');
 const raw=new DatabaseSync(dbPath),files=new Map();let low=false,failPut=false;
 const port={read:async p=>{if(!files.has(p))throw Error('Missing file');return files.get(p).slice();},put:async(e,b)=>{if(failPut)throw Error('injected partial write');if(files.has(e.path))throw Error('immutable destination exists');files.set(e.path,b.slice());},hash,capacity:async()=>{if(low)throw Error('injected low storage');}};
 const initial=legacyEngSnapshot(JSON.stringify(empty()));
 const store=createEngStore(adapter(raw),port,async()=>initial);
 return {store,raw,port,files,initial,dbPath,low(v){low=v;},failPut(v){failPut=v;},close(){raw.close();fs.rmSync(root,{recursive:true,force:true});}};
}
const checkpoint=async(store,patch={})=>{const draft={...newEngDraft(),checkpoint:1,title:'Water shutoff',answer:'',...patch};await store.checkpoint(draft);return draft;};
test('legacy migration retains full authored metadata and does not mutate migration input',async()=>{
 const x=setup();try{
  x.initial.data.memories.push({id:'old',title:'Filter',answer:'20x25',location:'Closet',notes:'Keep',spaceId:'home',categoryIds:[],legacyContext:'Maintain',confidence:'Verified',source:'Label',verifiedAt:'2026-10-18',due:'2026-11-18',history:[{id:'h1',date:'2026-10-18',action:'Changed'}],lifecycle:'active',mediaIds:[]});
  const before=JSON.stringify(x.initial);assert.deepEqual((await x.store.load()).data.memories,x.initial.data.memories);assert.equal(JSON.stringify(x.initial),before);
 }finally{x.close();}
});
test('new draft uses Unassigned, no category, and resumes across a real database reopen',async()=>{
 const x=setup();try{const d=await checkpoint(x.store);assert.equal(d.spaceId,null);assert.deepEqual(d.categoryIds,[]);assert.equal((await x.store.load()).data.memories.length,0);
 const raw=new DatabaseSync(x.dbPath);try{const reopened=createEngStore(adapter(raw),x.port,async()=>{throw Error('must not remigrate');});assert.deepEqual((await reopened.load()).draft,d);}finally{raw.close();}
 }finally{x.close();}
});
test('photo-only commit preserves truly empty answer, hash, ID, Unknown and duplicate-safe attempt',async()=>{
 const x=setup();try{const d=await checkpoint(x.store);const staged=await x.store.addPhoto(d.id,png);const photo=staged.draft.photos[0];
 const saved=await x.store.saveDraft(d.attempt,d.memoryId);assert.equal(saved.draft,null);assert.equal(saved.data.memories[0].answer,'');assert.equal(saved.data.memories[0].confidence,'Unknown');assert.equal(saved.data.media.media[0].sha256,await hash(png));assert.equal(saved.data.media.media[0].id,photo.id);
 assert.equal((await x.store.saveDraft(d.attempt,d.memoryId)).data.memories.length,1);await assert.rejects(x.store.saveDraft(d.attempt,'other'),/conflict/);await assert.rejects(x.store.checkpoint(d),/already saved/);
 }finally{x.close();}
});
test('title alone fails; sixth photo fails without dropping five durable photos',async()=>{
 const x=setup();try{const d=await checkpoint(x.store);await assert.rejects(x.store.saveDraft(d.attempt,d.memoryId),/answer or a photo/);
 for(let i=0;i<5;i++)await x.store.addPhoto(d.id,png);const before=await x.store.load();await assert.rejects(x.store.addPhoto(d.id,png),/Five photos/);assert.deepEqual(await x.store.load(),before);
 }finally{x.close();}
});
test('low storage, invalid MIME, failed private copy preserve the last confirmed draft',async()=>{
 const x=setup();try{const d=await checkpoint(x.store);const before=await x.store.load();x.low(true);await assert.rejects(x.store.addPhoto(d.id,png),/low storage/);x.low(false);
 await assert.rejects(x.store.addPhoto(d.id,new Uint8Array([0,1])),/JPEG/);x.failPut(true);await assert.rejects(x.store.addPhoto(d.id,png),/partial write/);assert.deepEqual(await x.store.load(),before);assert.equal(x.raw.prepare("SELECT COUNT(*) n FROM eng_media_ops_v2 WHERE phase='pending'").get().n,1);
 }finally{x.close();}
});
test('injected SQLite commit failure rolls back memory, attempt, draft and recovery atomically',async()=>{
 const x=setup();try{const d=await checkpoint(x.store,{answer:'Hall closet'});const before=await x.store.load();
 x.raw.exec("CREATE TRIGGER fail_commit BEFORE UPDATE ON eng_state_v2 BEGIN SELECT RAISE(FAIL,'injected DB commit'); END");await assert.rejects(x.store.saveDraft(d.attempt,d.memoryId),/injected DB commit/);assert.deepEqual(await x.store.load(),before);assert.equal(x.raw.prepare('SELECT COUNT(*) n FROM eng_recovery_v2').get().n,0);
 x.raw.exec('DROP TRIGGER fail_commit');assert.equal((await x.store.saveDraft(d.attempt,d.memoryId)).data.memories.length,1);
 }finally{x.close();}
});
test('stale checkpoints and forged durable-photo metadata cannot replace draft',async()=>{
 const x=setup();try{const d=await checkpoint(x.store);await assert.rejects(x.store.checkpoint({...d,title:'Changed'}),/conflicting/);await assert.rejects(x.store.checkpoint({...d,id:'other',checkpoint:2}),/existing draft/);const withPhoto=await x.store.addPhoto(d.id,png);await assert.rejects(x.store.checkpoint({...withPhoto.draft,checkpoint:3,photos:[]}),/photo operations/);
 }finally{x.close();}
});
test('archive, recently deleted, restore and 30-day expiry retain private bytes and recovery owners',async()=>{
 const x=setup();try{const d=await checkpoint(x.store);await x.store.addPhoto(d.id,png);await x.store.saveDraft(d.attempt,d.memoryId);
 await x.store.lifecycle(d.memoryId,'archived','2026-10-19');await x.store.lifecycle(d.memoryId,'recently_deleted','2026-10-19');await assert.rejects(x.store.purge(d.memoryId,'2026-10-18'),/30 days/);await assert.rejects(x.store.purge(d.memoryId,'2026-11-17'),/30 days/);
 await x.store.lifecycle(d.memoryId,'active','2026-10-19');await x.store.lifecycle(d.memoryId,'recently_deleted','2026-10-19');await x.store.purge(d.memoryId,'2026-11-18');assert.equal((await x.store.load()).data.memories.length,0);assert.equal(x.files.size,1);await x.store.recover();assert.equal((await x.store.load()).data.memories.length,1);assert.ok((await x.store.audit()).every(r=>r.verdict==='verified'));
 }finally{x.close();}
});
test('full backup restores saved and draft photos independently with IDs and bytes intact',async()=>{
 const x=setup(),y=setup();try{const d=await checkpoint(x.store);await x.store.addPhoto(d.id,png);await x.store.saveDraft(d.attempt,d.memoryId);await x.store.lifecycle(d.memoryId,'archived','2026-10-19');const draft2=await checkpoint(x.store,{title:'Unfinished'});await x.store.addPhoto(draft2.id,png);
 const source=await x.store.backup(),raw=await encodeEngBackup(source.snapshot,source.read,source.hash),opened=await decodeEngBackup(raw,hash);
 await y.store.stageRestore(opened.snapshot,opened.read);await restore(y.store,opened.snapshot,'incoming');const restored=await y.store.load();assert.deepEqual(restored.data,source.snapshot.data);assert.deepEqual(restored.draft,source.snapshot.draft);assert.equal(y.files.size,2);for(const [name,bytes] of x.files)assert.deepEqual(y.files.get(name),bytes);
 }finally{x.close();y.close();}
});
test('draft conflict keep, incoming, cancel and previous full recovery preserve both choices',async()=>{
 const x=setup(),y=setup();try{const current=await checkpoint(x.store,{title:'Current',answer:'A'}),incoming=await checkpoint(y.store,{title:'Incoming',answer:'B'});const source=await y.store.load();const unchanged=await x.store.load();await restore(x.store,source,'cancel');assert.deepEqual(await x.store.load(),unchanged);
 await restore(x.store,source,'keep');assert.equal((await x.store.load()).draft.id,current.id);await restore(x.store,source,'incoming');assert.equal((await x.store.load()).draft.id,incoming.id);await x.store.recover();assert.equal((await x.store.load()).draft.id,current.id);
 }finally{x.close();y.close();}
});
test('truncation, corrupt hash, future version and trailing bytes fail before target mutation',async()=>{
 const x=setup();try{const d=await checkpoint(x.store);await x.store.addPhoto(d.id,png);const b=await x.store.backup(),raw=await encodeEngBackup(b.snapshot,b.read,b.hash),before=await x.store.load();
 await assert.rejects(decodeEngBackup(raw.slice(0,-1),hash));const corrupt=raw.slice();corrupt[corrupt.length-1]^=1;await assert.rejects(decodeEngBackup(corrupt,hash),/SHA/);const future=raw.slice();future[4]=52;await assert.rejects(decodeEngBackup(future,hash),/Unsupported/);const trailing=new Uint8Array(raw.length+1);trailing.set(raw);await assert.rejects(decodeEngBackup(trailing,hash),/Trailing/);assert.deepEqual(await x.store.load(),before);
 }finally{x.close();}
});
test('legacy text backup remains readable and disclosed; missing/corrupt live bytes block save and backup',async()=>{
 const x=setup();try{const legacy=await decodeEngBackup(new TextEncoder().encode(JSON.stringify(empty())),hash);assert.match(legacy.source,/Legacy v1/);const d=await checkpoint(x.store);const photo=(await x.store.addPhoto(d.id,png)).draft.photos[0];x.files.set(photo.path,new Uint8Array([0]));await assert.rejects(x.store.saveDraft(d.attempt,d.memoryId),/count/);await assert.rejects(x.store.backup(),/count/);assert.ok((await x.store.audit()).some(r=>r.verdict!=='verified'));
 }finally{x.close();}
});
test('stale edited memory cannot overwrite a newer revision; source/date evidence is validated',async()=>{
 const x=setup();try{const d=await checkpoint(x.store,{answer:'Label'});const saved=await x.store.saveDraft(d.attempt,d.memoryId),m=saved.data.memories[0];await x.store.taxonomy('space','Garage');await assert.rejects(x.store.updateMemory({...m,title:'stale'},saved.revision),/changed/);const current=await x.store.load();await assert.rejects(x.store.updateMemory({...m,confidence:'Verified'},current.revision),/evidence/);
 }finally{x.close();}
});
test('legacy CDXM2 image container imports authored card and exact image hash, without draft fabrication',async()=>{
 const text=empty();text.cards=[{id:'legacy',spaceId:'home',title:'Original filter',answer:'20x25',location:'Closet',notes:'Keep',context:'Maintain',confidence:'Unknown',source:'',history:[]}];
 const entry={id:'photo',cardId:'legacy',path:'media/photo.png',mime:'image/png',bytes:png.length,sha256:await hash(png)};
 const parts=[new TextEncoder().encode(JSON.stringify(text)),new TextEncoder().encode(JSON.stringify({version:2,media:[entry]})),png];
 const raw=new Uint8Array(6+parts.reduce((n,p)=>n+4+p.length,0)),view=new DataView(raw.buffer);raw.set([67,68,88,77,50,0]);let at=6;
 for(const part of parts){view.setUint32(at,part.length);at+=4;raw.set(part,at);at+=part.length;}
 const opened=await decodeEngBackup(raw,hash);assert.match(opened.source,/CDXM2/);assert.equal(opened.snapshot.draft,null);assert.equal(opened.snapshot.data.memories[0].legacyContext,'Maintain');assert.deepEqual(await opened.read(entry.path),png);
});
test('failed restore cutover retains old state and previous full recovery, then retry succeeds',async()=>{
 const x=setup(),y=setup();try{await checkpoint(x.store,{title:'Current',answer:'Original'});await x.store.taxonomy('space','Recovery marker');await checkpoint(y.store,{title:'Incoming',answer:'New'});const before=await x.store.load(),recovery=x.raw.prepare('SELECT payload FROM eng_recovery_v2').get().payload;
 x.raw.exec("CREATE TRIGGER fail_restore BEFORE UPDATE ON eng_state_v2 BEGIN SELECT RAISE(FAIL,'restore cutover'); END");await assert.rejects(restore(x.store,await y.store.load(),'incoming'),/restore cutover/);assert.deepEqual(await x.store.load(),before);assert.equal(x.raw.prepare('SELECT payload FROM eng_recovery_v2').get().payload,recovery);x.raw.exec('DROP TRIGGER fail_restore');await restore(x.store,await y.store.load(),'incoming');assert.equal((await x.store.load()).draft.title,'Incoming');
 }finally{x.close();y.close();}
});
test('saved photo additions are journaled; photo-only last image cannot be removed',async()=>{
 const x=setup();try{const d=await checkpoint(x.store);await x.store.addPhoto(d.id,png);const saved=await x.store.saveDraft(d.attempt,d.memoryId),first=saved.data.media.media[0];await assert.rejects(x.store.removeMemoryPhoto(d.memoryId,first.id),/last photo/);const added=await x.store.addMemoryPhoto(d.memoryId,png);assert.equal(added.data.memories[0].mediaIds.length,2);await x.store.removeMemoryPhoto(d.memoryId,first.id);assert.equal((await x.store.load()).data.memories[0].mediaIds.length,1);assert.equal(x.files.size,2);
 }finally{x.close();}
});
test('all supported legacy record and Space identifiers survive migration without renaming',async()=>{
 const data=empty();data.spaces[0].id='my home:一';data.cards=[{id:'filter:one / old',spaceId:'my home:一',title:'Filter',answer:'20x25',location:'',notes:'',context:'Fix',confidence:'Unknown',source:'',history:[{id:'',date:'2026-10-18',action:'Legacy note'}]}];
 const x=setup();try{x.initial=legacyEngSnapshot(JSON.stringify(data));const store=createEngStore(adapter(x.raw),x.port,async()=>x.initial);const migrated=await store.load();assert.equal(migrated.data.memories[0].id,data.cards[0].id);assert.equal(migrated.data.spaces[0].id,data.spaces[0].id);assert.deepEqual(migrated.data.memories[0].history,data.cards[0].history);}finally{x.close();}
});
test('explicit full recovery repairs corrupt primary JSON without destroying damaged bytes or known-good recovery',async()=>{
 const x=setup();try{const d=await checkpoint(x.store,{answer:'Original'});await x.store.taxonomy('space','Garage');const recovery=x.raw.prepare('SELECT payload FROM eng_recovery_v2').get().payload;
 x.raw.prepare('UPDATE eng_state_v2 SET payload=?').run('{corrupt primary');await assert.rejects(x.store.load());const restored=await x.store.recover();assert.equal(restored.draft.id,d.id);assert.equal(restored.draft.answer,'Original');assert.equal(x.raw.prepare('SELECT payload FROM eng_damaged_v2').get().payload,'{corrupt primary');assert.equal(x.raw.prepare('SELECT payload FROM eng_recovery_v2').get().payload,recovery);await assert.rejects(x.store.audit(),/ownership needs review/);
 }finally{x.close();}
});
test('known portable state can replace corrupt primary only through explicit incoming-draft choice',async()=>{
 const x=setup(),y=setup();try{await checkpoint(x.store,{answer:'Original'});await x.store.taxonomy('space','Keep previous');await checkpoint(y.store,{answer:'Portable'});const incoming=await y.store.load();x.raw.prepare('UPDATE eng_state_v2 SET payload=?').run('damaged');await assert.rejects(restore(x.store,incoming,'keep'),/cannot be read/);assert.equal(x.raw.prepare('SELECT payload FROM eng_state_v2').get().payload,'damaged');const restored=await restore(x.store,incoming,'incoming');assert.equal(restored.draft.answer,'Portable');assert.equal(x.raw.prepare('SELECT COUNT(*) n FROM eng_damaged_v2').get().n,1);
 }finally{x.close();y.close();}
});
test('missing primary after restart cannot silently remigrate v1; explicit recovery restores known full state',async()=>{
 const x=setup();try{const d=await checkpoint(x.store,{answer:'Full state'});await x.store.taxonomy('space','Garage');x.raw.exec('DELETE FROM eng_state_v2');let migrations=0;const reopened=createEngStore(adapter(x.raw),x.port,async()=>{migrations++;return x.initial;});await assert.rejects(reopened.load(),/unavailable/);assert.equal(migrations,0);assert.equal((await reopened.recover()).draft.id,d.id);assert.equal(migrations,0);
 }finally{x.close();}
});
test('declared future primary and future initialization markers cannot be downgraded by recovery',async()=>{
 const x=setup();try{await checkpoint(x.store,{answer:'Known'});await x.store.taxonomy('space','Garage');const future=await x.store.load();future.version=4;const raw=JSON.stringify(future);x.raw.prepare('UPDATE eng_state_v2 SET payload=?').run(raw);await assert.rejects(x.store.recover(),/newer CasitaDex/);assert.equal(x.raw.prepare('SELECT payload FROM eng_state_v2').get().payload,raw);assert.equal(x.raw.prepare('SELECT COUNT(*) n FROM eng_damaged_v2').get().n,0);x.raw.prepare("UPDATE eng_control_v2 SET value='4' WHERE key='initialized'").run();const reopened=createEngStore(adapter(x.raw),x.port,async()=>x.initial);await assert.rejects(reopened.load(),/newer CasitaDex/);await assert.rejects(reopened.recover(),/newer CasitaDex/);assert.equal(x.raw.prepare('SELECT payload FROM eng_state_v2').get().payload,raw);
 }finally{x.close();}
});
