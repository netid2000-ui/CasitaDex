import test from 'node:test';
import assert from 'node:assert/strict';
import {setup,verified} from './eng-fixture.mjs';
const r={id:'r_atomic_123',title:'Before',notes:'',dueDate:'2026-10-19',dueTime:'09:00',repeat:'once',anchorDay:19,completed:false,createdAt:'2026-10-19T00:00:00Z',updatedAt:'2026-10-19T00:00:00Z'};
const schema="CREATE TABLE standalone_reminders_v1 (id TEXT PRIMARY KEY,title TEXT NOT NULL,notes TEXT NOT NULL,due_date TEXT NOT NULL,completed INTEGER NOT NULL DEFAULT 0,created_at TEXT NOT NULL,updated_at TEXT NOT NULL,due_time TEXT NOT NULL DEFAULT '09:00',anchor_day INTEGER NOT NULL DEFAULT 0,repeat TEXT NOT NULL DEFAULT 'once')";
async function fixture(options){const f=setup(undefined,options);await f.db.execAsync(schema);await f.db.runAsync('INSERT INTO standalone_reminders_v1(id,title,notes,due_date,due_time,repeat,anchor_day,completed,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?)',r.id,r.title,r.notes,r.dueDate,r.dueTime,r.repeat,r.anchorDay,0,r.createdAt,r.updatedAt);return f;}
test('v4 restore and previous-save recovery atomically swap reminders and ENG',async()=>{
 const f=await fixture();try{const before=(await f.store.backup()).snapshot;const token=await f.store.restoreToken();const target=verified();await f.store.restoreV4(target,{version:1,rows:[{...r,id:'r_incoming_456',title:'Incoming'}]},'incoming',token);assert.equal(((await f.store.backup()).snapshot).data.memories.length,target.data.memories.length);assert.equal(f.raw.prepare('SELECT title FROM standalone_reminders_v1').get().title,'Incoming');await f.store.recoverV4();assert.deepEqual(((await f.store.backup()).snapshot).data.memories,before.data.memories);assert.equal(f.raw.prepare('SELECT title FROM standalone_reminders_v1').get().title,'Before');}finally{f.close();}
});
test('v4 injected fault rolls back reminder and ENG writes',async()=>{
 const f=await fixture({fault:phase=>{if(phase==='after-v4-eng-write')throw Error('injected transaction fault')}});try{const before=(await f.store.backup()).snapshot;await assert.rejects(f.store.restoreV4(verified(),{version:1,rows:[{...r,id:'r_incoming_456'}]},'incoming',await f.store.restoreToken()),/injected transaction fault/);assert.deepEqual((await f.store.backup()).snapshot,before);assert.equal(f.raw.prepare('SELECT title FROM standalone_reminders_v1').get().title,'Before');}finally{f.close();}
});
test('v4 stale preview refuses mutation',async()=>{
 const f=await fixture();try{const stale=await f.store.restoreToken();await f.store.checkpoint((await import('../src/eng-store.ts')).newEngDraft());await assert.rejects(f.store.restoreV4(verified(),{version:1,rows:[r]},'incoming',stale),/changed/);assert.equal(f.raw.prepare('SELECT title FROM standalone_reminders_v1').get().title,'Before');}finally{f.close();}
});
test('v4 failure after reminder write rolls back both tables',async()=>{
 const f=await fixture({fault:p=>{if(p==='after-v4-reminder-write')throw Error('injected reminder fault')}});try{const before=(await f.store.backup()).snapshot;await assert.rejects(f.store.restoreV4(verified(),{version:1,rows:[{...r,id:'r_incoming_456'}]},'incoming',await f.store.restoreToken()),/injected reminder fault/);assert.deepEqual((await f.store.backup()).snapshot,before);assert.equal(f.raw.prepare('SELECT title FROM standalone_reminders_v1').get().title,'Before');}finally{f.close();}
});test('reminder-only changes invalidate reviewed Full v4 restore',async()=>{
 const f=await fixture();try{const engToken=await f.store.restoreToken();const reminderToken=await f.store.reminderRestoreToken();await f.db.runAsync('UPDATE standalone_reminders_v1 SET title=? WHERE id=?','Changed',r.id);await assert.rejects(f.store.restoreV4(verified(),{version:1,rows:[r]},'incoming',engToken,reminderToken),/reminders changed/);assert.equal(f.raw.prepare('SELECT title FROM standalone_reminders_v1').get().title,'Changed');}finally{f.close();}
});
test('legacy ENG-only restore invalidates stale Full v4 reminder recovery',async()=>{
 const f=await fixture();try{
  const initial=(await f.store.backup()).snapshot;
  await f.store.restoreV4(verified(),{version:1,rows:[{...r,title:'Incoming'}]},'incoming',await f.store.restoreToken());
  assert.equal(await f.store.hasV4Recovery(),true);
  await f.store.restore(initial,'incoming',await f.store.restoreToken());
  assert.equal(await f.store.hasV4Recovery(),false);
  assert.equal(f.raw.prepare('SELECT title FROM standalone_reminders_v1').get().title,'Incoming');
 }finally{f.close();}
});
test('Full v4 restore migrates older standalone reminder columns',async()=>{
 const f=setup();try{
  await f.db.execAsync('CREATE TABLE standalone_reminders_v1 (id TEXT PRIMARY KEY,title TEXT NOT NULL,notes TEXT NOT NULL,due_date TEXT NOT NULL,completed INTEGER NOT NULL DEFAULT 0,created_at TEXT NOT NULL,updated_at TEXT NOT NULL)');
  await f.db.runAsync('INSERT INTO standalone_reminders_v1 (id,title,notes,due_date,completed,created_at,updated_at) VALUES (?,?,?,?,?,?,?)',r.id,r.title,r.notes,r.dueDate,0,r.createdAt,r.updatedAt);
  await f.store.restoreV4(verified(),{version:1,rows:[r]},'incoming',await f.store.restoreToken());
  assert.equal(f.raw.prepare('SELECT due_time FROM standalone_reminders_v1').get().due_time,'09:00');
  await f.store.recoverV4();
  assert.equal(f.raw.prepare('SELECT title FROM standalone_reminders_v1').get().title,'Before');
 }finally{f.close();}
});

test('Full v4 cancel preserves collection, reminders, recovery snapshots, schema and media',async()=>{
 const f=await fixture();try{
  const before=(await f.store.backup()).snapshot;
  const token=await f.store.restoreToken();
  const reminderToken=await f.store.reminderRestoreToken();
  const databaseBefore=f.raw.prepare("SELECT name,sql FROM sqlite_master WHERE type IN ('table','index') ORDER BY name").all();
  const reminderBefore=f.raw.prepare("SELECT * FROM standalone_reminders_v1 ORDER BY id").all();
  const recoveryBefore=f.raw.prepare("SELECT * FROM eng_recovery_v2 ORDER BY slot").all();
  const mediaBefore=[...f.files.entries()];
  await f.store.restoreV4(verified(),{version:1,rows:[{...r,title:'Should never restore'}]},'cancel',token,reminderToken);
  assert.deepEqual((await f.store.backup()).snapshot,before);
  assert.deepEqual(f.raw.prepare("SELECT * FROM standalone_reminders_v1 ORDER BY id").all(),reminderBefore);
  assert.deepEqual(f.raw.prepare("SELECT * FROM eng_recovery_v2 ORDER BY slot").all(),recoveryBefore);
  assert.deepEqual(f.raw.prepare("SELECT name,sql FROM sqlite_master WHERE type IN ('table','index') ORDER BY name").all(),databaseBefore);
  assert.deepEqual([...f.files.entries()],mediaBefore);
  assert.equal(await f.store.hasV4Recovery(),false);
 }finally{f.close();}
});

test('Full v4 insufficient storage preflight preserves ENG, reminders and recovery',async()=>{
 const f=await fixture();try{
  const before=(await f.store.backup()).snapshot;
  const reminderBefore=f.raw.prepare("SELECT * FROM standalone_reminders_v1 ORDER BY id").all();
  const recoveryBefore=f.raw.prepare("SELECT * FROM eng_recovery_v2 ORDER BY slot").all();
  const schemaBefore=f.raw.prepare("SELECT name,sql FROM sqlite_master WHERE type IN ('table','index') ORDER BY name").all();
  f.deny(true);
  await assert.rejects(f.store.restoreV4(verified(),{version:1,rows:[{...r,title:'Incoming'}]},'incoming',await f.store.restoreToken(),await f.store.reminderRestoreToken()),/Insufficient storage/);
  f.deny(false);
  assert.deepEqual((await f.store.backup()).snapshot,before);
  assert.deepEqual(f.raw.prepare("SELECT * FROM standalone_reminders_v1 ORDER BY id").all(),reminderBefore);
  assert.deepEqual(f.raw.prepare("SELECT * FROM eng_recovery_v2 ORDER BY slot").all(),recoveryBefore);
  assert.deepEqual(f.raw.prepare("SELECT name,sql FROM sqlite_master WHERE type IN ('table','index') ORDER BY name").all(),schemaBefore);
  assert.equal(await f.store.hasV4Recovery(),false);
  assert.equal(f.files.size,0);
 }finally{f.close();}
});

test('Full v4 legacy reminder schema accepts unchanged preview token before migration',async()=>{
 const f=setup();try{
  await f.db.execAsync("CREATE TABLE standalone_reminders_v1 (id TEXT PRIMARY KEY,title TEXT NOT NULL,notes TEXT NOT NULL,due_date TEXT NOT NULL,completed INTEGER NOT NULL DEFAULT 0,created_at TEXT NOT NULL,updated_at TEXT NOT NULL)");
  await f.db.runAsync("INSERT INTO standalone_reminders_v1 (id,title,notes,due_date,completed,created_at,updated_at) VALUES (?,?,?,?,?,?,?)",r.id,r.title,r.notes,r.dueDate,0,r.createdAt,r.updatedAt);
  const engToken=await f.store.restoreToken();
  const reminderToken=await f.store.reminderRestoreToken();
  await f.store.restoreV4(verified(),{version:1,rows:[{...r,title:'Restored'}]},'incoming',engToken,reminderToken);
  assert.equal(f.raw.prepare("SELECT title FROM standalone_reminders_v1").get().title,'Restored');
  await f.store.recoverV4();
  assert.equal(f.raw.prepare("SELECT title FROM standalone_reminders_v1").get().title,'Before');
 }finally{f.close();}
});

test("Full v4 pre-transaction interruption preserves all durable state",async()=>{
 const f=await fixture({fault:phase=>{if(phase==="before-v4-transaction")throw Error("interrupted before transaction")}});
 try{
 const before=(await f.store.backup()).snapshot;
 const rows=f.raw.prepare("SELECT * FROM standalone_reminders_v1 ORDER BY id").all();
 const recovery=f.raw.prepare("SELECT * FROM eng_recovery_v2 ORDER BY slot").all();
 const schemaBefore=f.raw.prepare("SELECT name,sql FROM sqlite_master WHERE type IN ('table','index') ORDER BY name").all();
 await assert.rejects(f.store.restoreV4(verified(),{version:1,rows:[{...r,title:"Incoming"}]},"incoming",await f.store.restoreToken()),/interrupted before transaction/);
 assert.deepEqual((await f.store.backup()).snapshot,before);
 assert.deepEqual(f.raw.prepare("SELECT * FROM standalone_reminders_v1 ORDER BY id").all(),rows);
 assert.deepEqual(f.raw.prepare("SELECT * FROM eng_recovery_v2 ORDER BY slot").all(),recovery);
 assert.deepEqual(f.raw.prepare("SELECT name,sql FROM sqlite_master WHERE type IN ('table','index') ORDER BY name").all(),schemaBefore);
 assert.equal(await f.store.hasV4Recovery(),false);
 }finally{f.close()}
});

test("Full v4 restore refuses exactly one byte below calculated capacity before any mutation",async()=>{
 const f=await fixture();try{
  const before=(await f.store.backup()).snapshot;
  const reminders=f.raw.prepare("SELECT * FROM standalone_reminders_v1 ORDER BY id").all();
  const schemaBefore=f.raw.prepare("SELECT name,sql FROM sqlite_master WHERE type IN ('table','index') ORDER BY name").all();
  const recoveryBefore=f.raw.prepare("SELECT * FROM eng_recovery_v2 ORDER BY slot").all();
  const incoming=verified();
  const expected=(new TextEncoder().encode(JSON.stringify(before)+JSON.stringify({...incoming,revision:before.revision+1})).length*3+65536);
  let requested=-1;
  f.port.capacity=async n=>{requested=n;if(n>expected-1)throw Error("Insufficient storage at exact restore boundary")};
  await assert.rejects(f.store.restoreV4(incoming,{version:1,rows:[{...r,title:"Incoming"}]},"incoming",await f.store.restoreToken()),/Insufficient storage at exact restore boundary/);
  assert.equal(requested,expected);
  assert.deepEqual((await f.store.backup()).snapshot,before);
  assert.deepEqual(f.raw.prepare("SELECT * FROM standalone_reminders_v1 ORDER BY id").all(),reminders);
  assert.deepEqual(f.raw.prepare("SELECT name,sql FROM sqlite_master WHERE type IN ('table','index') ORDER BY name").all(),schemaBefore);
  assert.deepEqual(f.raw.prepare("SELECT * FROM eng_recovery_v2 ORDER BY slot").all(),recoveryBefore);
  assert.equal(await f.store.hasV4Recovery(),false);
 }finally{f.close()}
});
