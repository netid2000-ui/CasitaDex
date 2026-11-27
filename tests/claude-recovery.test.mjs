import test from 'node:test';
import assert from 'node:assert/strict';
import {setup,verified,png} from './eng-fixture.mjs';
import {newEngDraft,draftRestoreImpact} from '../src/eng-store.ts';
import {isPickerCacheCopy,isStaleBackupTemp,backupTempName} from '../src/backup-temp.ts';
import {protectedStorageReport} from '../src/storage-safety.ts';
const row={id:'r_review_123',title:'Synthetic reminder',notes:'Note',dueDate:'2026-11-26',dueTime:'09:00',repeat:'monthly',anchorDay:26,completed:false,createdAt:'2026-11-26T00:00:00Z',updatedAt:'2026-11-26T00:00:00Z'};
const schema="CREATE TABLE standalone_reminders_v1 (id TEXT PRIMARY KEY,title TEXT NOT NULL,notes TEXT NOT NULL,memory_id TEXT,due_date TEXT NOT NULL,completed INTEGER NOT NULL DEFAULT 0,created_at TEXT NOT NULL,updated_at TEXT NOT NULL,due_time TEXT NOT NULL DEFAULT '09:00',anchor_day INTEGER NOT NULL DEFAULT 0,repeat TEXT NOT NULL DEFAULT 'once')";
async function insert(f,r,memoryId=null){await f.db.runAsync('INSERT INTO standalone_reminders_v1(id,title,notes,memory_id,due_date,due_time,repeat,anchor_day,completed,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?)',r.id,r.title,r.notes,memoryId,r.dueDate,r.dueTime,r.repeat,r.anchorDay,r.completed?1:0,r.createdAt,r.updatedAt);}
test('Full v4 requires a real reminder review token even when there are no local rows',async()=>{
 const f=setup(verified());try{
  await f.db.execAsync(schema); const review=await f.store.reviewRestore(verified());
  assert.equal(review.reminderToken.length,64);await insert(f,row);
  const before=await f.store.load();
  for(const missing of [undefined,'',null])await assert.rejects(f.store.restoreV4(verified(),{version:1,rows:[]},'incoming',review.collectionToken,missing),/review/i);
  await assert.rejects(f.store.stageRestore(verified(),async()=>{throw Error('must not read')},review.collectionToken,review.reminderToken),/reminders changed/);
  await assert.rejects(f.store.restoreV4(verified(),{version:1,rows:[]},'incoming',review.collectionToken,review.reminderToken),/reminders changed/);
  assert.deepEqual(await f.store.load(),before);assert.equal(f.raw.prepare('SELECT COUNT(*) AS n FROM standalone_reminders_v1').get().n,1);
 }finally{f.close();}
});
test('linked reminders preserve all fields through full restore and repeated previous-save recovery',async()=>{
 const f=setup(verified());try{
  await f.db.execAsync(schema);const initial=await f.store.load();const memoryId=initial.data.memories[0].id;await insert(f,row,memoryId);
  const before=(await f.store.backupWithReminders()).reminders;
  const target={version:1,rows:[{...row,id:'r_review_456',title:'Incoming',memoryId}]};
  const review=await f.store.reviewRestore(verified());
  await f.store.restoreV4(verified(),target,'incoming',review.collectionToken,review.reminderToken);
  let recovery=await f.store.reviewRecovery();assert.equal(recovery.kind,'full');
  await f.store.recoverV4(recovery.token);assert.deepEqual((await f.store.backupWithReminders()).reminders,before);
  recovery=await f.store.reviewRecovery();await f.store.recoverV4(recovery.token);
  assert.deepEqual((await f.store.backupWithReminders()).reminders,target);
 }finally{f.close();}
});
test('joint backup capture reads both domains in one SQLite transaction and returns a stable snapshot',async()=>{
 const f=setup(verified());try{
  await f.db.execAsync(schema);const state=await f.store.load();await insert(f,row,state.data.memories[0].id);
  const original=f.db.withExclusiveTransactionAsync,first=f.db.getFirstAsync,all=f.db.getAllAsync;
  let inside=false,collectionRead=false,reminderRead=false;
  f.db.withExclusiveTransactionAsync=async fn=>original(async tx=>{inside=true;try{await fn(tx);}finally{inside=false;}});
  f.db.getFirstAsync=async(sql,...args)=>{if(sql.includes('SELECT payload FROM eng_state_v2')){assert.ok(inside);collectionRead=true;}return first(sql,...args);};
  f.db.getAllAsync=async(sql,...args)=>{if(sql.includes('SELECT * FROM standalone_reminders_v1')){assert.ok(inside);reminderRead=true;}return all(sql,...args);};
  const backup=await f.store.backupWithReminders();assert.ok(collectionRead&&reminderRead);
  await f.db.runAsync('UPDATE standalone_reminders_v1 SET title=? WHERE id=?','Later',row.id);
  assert.equal(backup.reminders.rows[0].title,row.title);assert.equal(backup.reminders.rows[0].memoryId,state.data.memories[0].id);
 }finally{f.close();}
});
test('recovery preview accurately distinguishes collection-only and full, rejects a changed review',async()=>{
 const f=setup(verified());try{
  await f.db.execAsync(schema);await f.store.load();assert.equal((await f.store.reviewRecovery()).kind,'none');await insert(f,row);
  const review=await f.store.reviewRestore(verified());await f.store.restoreV4(verified(),{version:1,rows:[]},'incoming',review.collectionToken,review.reminderToken);
  const full=await f.store.reviewRecovery();assert.equal(full.kind,'full');await insert(f,{...row,id:'r_review_456'});
  await assert.rejects(f.store.recoverV4(full.token),/Review recovery again/);
  await f.store.restore(verified(),'incoming',await f.store.restoreToken());assert.equal((await f.store.reviewRecovery()).kind,'collection');
  const currentCount=f.raw.prepare('SELECT COUNT(*) AS n FROM standalone_reminders_v1').get().n;
  const collection=await f.store.reviewRecovery();await f.store.recover(collection.token);
  assert.equal(f.raw.prepare('SELECT COUNT(*) AS n FROM standalone_reminders_v1').get().n,currentCount);
 }finally{f.close();}
});
test('draft impact describes retained labels and conflicting save attempt before commit',()=>{
 const current=verified(),incoming=verified(),draft=newEngDraft();
 current.data.spaces.push({id:'extra-space',name:'Synthetic Space'});current.data.categories.push({id:'extra-category',name:'Synthetic Category'});
 current.draft={...draft,spaceId:'extra-space',categoryIds:['extra-category']};
 incoming.attempts[draft.attempt]='synthetic-memory';
 const impact=draftRestoreImpact(current,incoming);
 assert.deepEqual(impact,{hasDraft:true,space:'Synthetic Space',categories:['Synthetic Category'],attemptConflict:true,memoryConflict:false});
});
test('restore journal marks only committed ownership, interrupted staging remains protected',async()=>{
 const x=setup(verified()),y=setup();try{
  const d={...newEngDraft(),checkpoint:1,title:'Synthetic photo',answer:'Test'};await x.store.checkpoint(d);await x.store.addPhoto(d.id,png);await x.store.saveDraft(d.attempt,d.memoryId);
  const backup=await x.store.backupWithReminders();const review=await y.store.reviewRestore(backup.snapshot);
  await y.store.stageRestore(backup.snapshot,backup.read,review.collectionToken,review.reminderToken);
  let audit=await y.store.audit();assert.equal(protectedStorageReport(audit).stagedRestoreCount,1);assert.equal(y.files.size,1);
  await assert.rejects(y.store.restoreV4(backup.snapshot,backup.reminders,'incoming',review.collectionToken,''),/review/i);
  assert.equal(y.files.size,1);assert.equal(protectedStorageReport(await y.store.audit()).stagedRestoreCount,1);
  await y.store.restoreV4(backup.snapshot,backup.reminders,'incoming',review.collectionToken,review.reminderToken);
  audit=await y.store.audit();assert.equal(protectedStorageReport(audit).stagedRestoreCount,0);assert.equal(y.files.size,1);assert.ok(audit.some(r=>r.owner==='journal:committed'));
 }finally{x.close();y.close();}
});
test('only exact owned cache files qualify for scoped cleanup and stale sweeps',()=>{
 const root='file:///private/cache/';
 assert.ok(isPickerCacheCopy(root+'DocumentPicker/test.cdxe',root));
 for(const uri of ['file:///private/Documents/test.cdxe',root+'DocumentPicker/%2e%2e',root+'DocumentPicker/../test.cdxe',root+'DocumentPicker/%2Ftest.cdxe'])assert.equal(isPickerCacheCopy(uri,root),false);
 const stamp=1795737600000,old=backupTempName('review',stamp,'abc123');
 assert.equal(isStaleBackupTemp(old,stamp+23*3600000),false);assert.equal(isStaleBackupTemp(old,stamp+25*3600000),true);
 assert.equal(isStaleBackupTemp('CasitaDex-full-2026-11-26T00-00-00-000Z.cdxe',stamp+25*3600000),false);
});
