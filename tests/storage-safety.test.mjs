import test from 'node:test';
import assert from 'node:assert/strict';
import {measuredUsableSpace,requireStorageCapacity,fullRestoreCapacity,protectedStorageReport} from '../src/storage-safety.ts';
import {sqliteWriteTransaction} from '../src/sqlite-write-transaction.ts';
import {setup,verified} from './eng-fixture.mjs';
const entry={path:'media/qa_photo.png',bytes:68,sha256:'a'.repeat(64)};
const ref=(owner,verdict='verified',patch={})=>({owner,verdict,entry:{...entry,...patch}});
test('app-available blocks constrain free-block reports, including actual zero availability',()=>{
 assert.equal(measuredUsableSpace(180000000,0),0);
 assert.equal(measuredUsableSpace(500,400),400);
 for(const bad of [NaN,Infinity,-1,1.5])assert.throws(()=>measuredUsableSpace(500,bad),/unavailable/i);
});
test('write capacity checks accept exact requirement and reject one byte below or unknown estimates',()=>{
 assert.doesNotThrow(()=>requireStorageCapacity(1000,1000));
 assert.throws(()=>requireStorageCapacity(999,1000),/1000 bytes.*999 bytes/);
 for(const bad of [NaN,Infinity,-1,0.5])assert.throws(()=>requireStorageCapacity(1000,bad),/unavailable/);
});
test('restore capacity accounts for UTF-8 reminder and recovery payloads',()=>{
 const base=fullRestoreCapacity('old','new','[]','[]');
 const expanded=fullRestoreCapacity('old','new','[]','é'.repeat(1000));
 assert.equal(expanded-base,(2000-2)*3);
});
test('all approved media owners remain protected with duplicate references counted once',()=>{
 const rows=['active','archived','recently_deleted','draft','recovery','legacy-v1','legacy-recovery','journal:pending','journal:promoted','journal:committed','journal:restore-pending','journal:restore-staged'].map(o=>ref(o));
 const before=JSON.stringify(rows),r=protectedStorageReport(rows);
 assert.equal(r.protectedBytes,68);assert.equal(r.referencedBytes,68);
 for(const count of Object.values(r.ownerCounts))assert.equal(count,1);
 assert.equal(r.cleanupAllowed,false);assert.equal(JSON.stringify(rows),before);
});
test('missing media remains referenced and cannot be misreported as reclaimable',()=>{
 const r=protectedStorageReport([ref('active'),ref('recovery','Missing media')]);
 assert.equal(r.referencedBytes,68);assert.equal(r.protectedBytes,0);assert.equal(r.unreadable,1);assert.equal(r.cleanupAllowed,false);
});
test('unknown or damaged ownership fails closed',()=>{
 for(const row of [ref('unknown'),ref('journal:unknown'),ref('draft','verified',{path:'../owner.jpg'}),ref('draft','verified',{bytes:-1})])assert.throws(()=>protectedStorageReport([row]),/ownership|cleanup/i);
 assert.throws(()=>protectedStorageReport([ref('active'),ref('recovery','verified',{sha256:'b'.repeat(64)})]),/Conflicting/);
});
test('SQLite helper commits success and rolls back a failed write without masking it',async()=>{
 const f=setup();try{
  await f.db.execAsync("CREATE TABLE qa_tx(value TEXT);INSERT INTO qa_tx VALUES('before')");
  await sqliteWriteTransaction(f.db,async tx=>{await tx.runAsync("UPDATE qa_tx SET value='committed'")});
  assert.equal(f.raw.prepare('SELECT value FROM qa_tx').get().value,'committed');
  const failure=Error('original write failure');
  await assert.rejects(sqliteWriteTransaction(f.db,async tx=>{await tx.runAsync("UPDATE qa_tx SET value='bad'");throw failure}),e=>e===failure);
  assert.equal(f.raw.prepare('SELECT value FROM qa_tx').get().value,'committed');
 }finally{f.close()}
});
test('SQLite auto-rollback cleanup failure retains the original full-disk cause',async()=>{
 const f=setup();try{
  await f.db.execAsync("CREATE TABLE qa_tx(value TEXT);INSERT INTO qa_tx VALUES('before')");
  const full=Error('SQLITE_FULL: database or disk is full');
  await assert.rejects(sqliteWriteTransaction(f.db,async tx=>{await tx.runAsync("UPDATE qa_tx SET value='bad'");await tx.execAsync('ROLLBACK');throw full}),e=>{
   assert.ok(e instanceof AggregateError);assert.equal(e.cause,full);assert.equal(e.errors[0],full);assert.match(e.message,/disk is full.*Reopen/);return true;
  });
  assert.equal(f.raw.prepare('SELECT value FROM qa_tx').get().value,'before');
 }finally{f.close()}
});
test('SQLite commit failure rolls back both logical writes',async()=>{
 const f=setup();try{
  await f.db.execAsync("CREATE TABLE qa_tx(value TEXT);INSERT INTO qa_tx VALUES('before')");
  const original=f.db.execAsync;const full=Error('disk full during COMMIT');
  const db={...f.db,execAsync:async q=>{if(q==='COMMIT')throw full;return original(q)}};
  await assert.rejects(sqliteWriteTransaction(db,async tx=>{await tx.runAsync("UPDATE qa_tx SET value='bad'")}),e=>e===full);
  assert.equal(f.raw.prepare('SELECT value FROM qa_tx').get().value,'before');
 }finally{f.close()}
});
const reminder={id:'r_capacity_qa',title:'QA reminder',notes:'',dueDate:'2026-10-20',dueTime:'09:00',repeat:'once',anchorDay:20,completed:false,createdAt:'2026-10-20T00:00:00Z',updatedAt:'2026-10-20T00:00:00Z'};
test('large reminder section cannot bypass an ENG-only free-space budget',async()=>{
 const f=setup();try{
  const before=await f.store.load(),target=verified();
  const engOnly=(new TextEncoder().encode(JSON.stringify(before)+JSON.stringify({...target,revision:before.revision+1}))).length*3+65536;
  let requested=0;f.port.capacity=async n=>{requested=n;if(n>engOnly)throw Error('Insufficient reminder capacity')};
  const section={version:1,rows:Array.from({length:100},(_,i)=>({...reminder,id:'r_capacity_'+i,notes:'x'.repeat(4000)}))};
  await assert.rejects(f.store.restoreV4(target,section,'incoming',await f.store.restoreToken()),/Insufficient reminder/);
  assert.ok(requested>engOnly+1000000);assert.deepEqual(await f.store.load(),before);
  assert.equal(f.raw.prepare("SELECT name FROM sqlite_master WHERE name='standalone_reminders_v1'").get(),undefined);
 }finally{f.close()}
});
test('low-storage recovery preserves current data and both recovery snapshots',async()=>{
 const f=setup();try{
  await f.store.restoreV4(verified(),{version:1,rows:[reminder]},'incoming',await f.store.restoreToken());
  const before=await f.store.load();
  const tables=['standalone_reminders_v1','eng_recovery_v2','eng_reminder_recovery_v4'];
  const rows=tables.map(t=>f.raw.prepare('SELECT * FROM '+t).all());
  f.deny();
  await assert.rejects(f.store.recoverV4(),/Insufficient storage/);
  assert.deepEqual(await f.store.load(),before);
  assert.deepEqual(tables.map(t=>f.raw.prepare('SELECT * FROM '+t).all()),rows);
 }finally{f.close()}
});
