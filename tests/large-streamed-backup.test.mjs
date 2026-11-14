import {DatabaseSync} from 'node:sqlite';
import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {mkdtemp,open,rm,mkdir,readFile,writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {empty} from '../src/model.ts';
import {legacyEngSnapshot,createEngStore} from '../src/eng-store.ts';
import {writeEngStreamV4,openEngStreamCompatible} from '../src/eng-stream-v4.ts';
import {encodeEngBackup} from '../src/eng-backup.ts';
import {backupWorkingSpace,assertStreamedBackupSize} from '../src/backup-capacity.ts';
import {requireStorageCapacity} from '../src/storage-safety.ts';
const hash=async b=>createHash('sha256').update(b).digest('hex');
test('170 MB archive streams to disk and verifies without a full archive buffer',async()=>{
 const bytes=new Uint8Array(10_000_000);bytes.set([137,80,78,71,13,10,26,10]);
 const digest=await hash(bytes),data=empty(),media=[];
 for(let i=0;i<17;i++){
  const id='large_'+i;
  data.cards.push({id,spaceId:'home',title:'Item '+i,answer:'Label',location:'',notes:'',context:'Maintain',confidence:'Unknown',source:'',history:[]});
  media.push({id:'p'+i,cardId:id,path:'media/p'+i+'.png',mime:'image/png',bytes:bytes.length,sha256:digest});
 }
 const snapshot=legacyEngSnapshot(JSON.stringify(data),{version:2,media});
 const dir=await mkdtemp(join(tmpdir(),'casitadex-large-backup-')),file=await open(join(dir,'archive.cdxe'),'w+');
 let at=0,maxWrite=0,maxRead=0;
 try{
  const written=await writeEngStreamV4(snapshot,{version:1,rows:[]},async()=>bytes,hash,{write:async b=>{
   maxWrite=Math.max(maxWrite,b.length);let n=0;
   while(n<b.length){const r=await file.write(b,n,b.length-n,at+n);assert.ok(r.bytesWritten>0);n+=r.bytesWritten;}at+=b.length;
  }});
  const reader={size:at,read:async(o,n)=>{maxRead=Math.max(maxRead,n);const b=new Uint8Array(n);const r=await file.read(b,0,n,o);return b.subarray(0,r.bytesRead);}};
  const opened=await openEngStreamCompatible(reader,hash);
  assert.ok(at>170_000_000);assert.equal(written.size,at);assert.equal(opened.snapshot.data.media.media.length,17);
  assert.ok(maxWrite<=65536);assert.ok(maxRead<=10_000_000);
  assert.deepEqual(await opened.read('media/p16.png'),bytes);

  // Restore into an independent file-backed SQLite database, then reopen it.
  let target;
  function openTarget(){
   const raw=new DatabaseSync(join(dir,'target.sqlite'));
   const db={execAsync:async q=>raw.exec(q),runAsync:async(q,...a)=>raw.prepare(q).run(...a),getFirstAsync:async(q,...a)=>raw.prepare(q).get(...a)??null,getAllAsync:async(q,...a)=>raw.prepare(q).all(...a),withExclusiveTransactionAsync:async fn=>{
    raw.exec('BEGIN IMMEDIATE');try{await fn(db);raw.exec('COMMIT');}catch(error){raw.exec('ROLLBACK');throw error;}
   }};
   const files={hash,read:async path=>new Uint8Array(await readFile(join(dir,path))),put:async(entry,b)=>{
    await mkdir(join(dir,'media'),{recursive:true});await writeFile(join(dir,entry.path),b,{flag:'wx'});
   },capacity:async required=>requireStorageCapacity(1_000_000_000,required)};
   return {raw,files,store:createEngStore(db,files,async()=>legacyEngSnapshot(JSON.stringify(empty())))};
  }
  try{
   target=openTarget();const token=await target.store.restoreToken(),reminderToken=await target.store.reminderRestoreToken();
   await target.store.stageRestore(opened.snapshot,opened.read,token);
   await target.store.restoreV4(opened.snapshot,opened.reminders,'incoming',token,reminderToken);
   target.raw.close();target=undefined;
   target=openTarget();const restored=await target.store.load();
   assert.deepEqual(restored.data,opened.snapshot.data);
   for(const photo of restored.data.media.media)assert.equal(await hash(await target.files.read(photo.path)),photo.sha256);
   await target.store.recoverV4();assert.equal((await target.store.load()).data.memories.length,0);
  }finally{target?.raw.close();}

  const before=JSON.stringify(snapshot);
  await assert.rejects(writeEngStreamV4(snapshot,{version:1,rows:[]},async()=>bytes,hash,{write:async()=>{throw Error('disk full');}}),/disk full/);
  assert.equal(JSON.stringify(snapshot),before);
  await assert.rejects(openEngStreamCompatible({...reader,size:at-1},hash),/frame/);
  await file.write(new Uint8Array([1]),0,1,at-1);
  await assert.rejects(openEngStreamCompatible(reader,hash),/SHA/);
  // The older in-memory encoder deliberately retains its allocation guard.
  await assert.rejects(encodeEngBackup(snapshot,async()=>bytes,hash),/154 MB/);
 }finally{await file.close();await rm(dir,{recursive:true,force:true});}
});
test('large-backup free-space and malformed-size checks fail closed',()=>{
 const needed=backupWorkingSpace(170_000_000);
 assert.throws(()=>requireStorageCapacity(needed-1,needed),/Not enough/);
 assert.doesNotThrow(()=>requireStorageCapacity(needed,needed));
 for(const n of [NaN,Infinity,-1,2.5,Number.MAX_SAFE_INTEGER])assert.throws(()=>assertStreamedBackupSize(n));
});
