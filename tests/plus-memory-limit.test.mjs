import test from 'node:test';
import assert from 'node:assert/strict';
import {createMemoryLimitGate} from '../src/plus-memory-limit.ts';
import {newEngDraft} from '../src/eng-store.ts';
import {setup,add,png} from './eng-fixture.mjs';
function policy(state={entitlement:'free',status:'ready'},enabled=true){return createMemoryLimitGate({enabled,refresh:async()=>{},getSnapshot:()=>state});}
test('free saves twentieth, refuses twenty-first without changing draft or collection; duplicate retry succeeds',async()=>{
 const x=setup(undefined,{requireMemoryCapacity:policy()});try{
  for(let i=0;i<19;i++)await add(x.store);
  const d={...newEngDraft(),checkpoint:1,title:'Twentieth',answer:'Kept'};await x.store.checkpoint(d);
  const twentieth=await x.store.saveDraft(d.attempt,d.memoryId);assert.equal(twentieth.data.memories.length,20);
  assert.deepEqual(await x.store.saveDraft(d.attempt,d.memoryId),twentieth);
  const blocked={...newEngDraft(),checkpoint:1,title:'Twenty first',answer:'Preserved draft'};await x.store.checkpoint(blocked);
  const before=await x.store.load();await assert.rejects(x.store.saveDraft(blocked.attempt,blocked.memoryId),/20 saved memories/);assert.deepEqual(await x.store.load(),before);
  const m={...before.data.memories[0],title:'Editable at limit'};await x.store.updateMemory(m,before.revision);assert.equal((await x.store.load()).data.memories[0].title,m.title);
 }finally{x.close();}
});
test('Plus allows above limit; refund blocks only new saves and preserves oversized collection',async()=>{
 const state={entitlement:'plus',status:'ready'};const x=setup(undefined,{requireMemoryCapacity:policy(state)});try{
  for(let i=0;i<21;i++)await add(x.store);
  state.entitlement='free';await assert.rejects(add(x.store),/20 saved memories/);assert.equal((await x.store.load()).data.memories.length,21);
  state.entitlement='plus';const d=(await x.store.load()).draft;await x.store.saveDraft(d.attempt,d.memoryId);assert.equal((await x.store.load()).data.memories.length,22);
 }finally{x.close();}
});
test('unknown access cannot exceed limit; previously verified Plus survives transient error; preview unaffected',async()=>{
 for(const status of ['checking','error','unavailable'])await assert.rejects(policy({entitlement:'free',status})(20),/Unable to verify/);
 await policy({entitlement:'plus',status:'error'})(25);
 await policy({entitlement:'free',status:'unavailable'})(19);
 await policy(undefined,false)(90);
});

test('upgrading at twenty saves the same photo-backed draft exactly once',async()=>{
 const state={entitlement:'free',status:'ready'};
 const fixture=setup(undefined,{requireMemoryCapacity:policy(state)});
 try{
  for(let i=0;i<20;i++)await add(fixture.store);
  const draft={...newEngDraft(),checkpoint:1,title:'Memory 21',answer:'Photo on file'};
  await fixture.store.checkpoint(draft);
  await fixture.store.addPhoto(draft.id,png);
  const before=await fixture.store.load();
  await assert.rejects(fixture.store.saveDraft(draft.attempt,draft.memoryId),/20 saved memories/);
  assert.deepEqual(await fixture.store.load(),before);
  state.entitlement='plus';
  const saved=await fixture.store.saveDraft(draft.attempt,draft.memoryId);
  assert.equal(saved.data.memories.length,21);
  assert.equal(saved.data.media.media[0].cardId,draft.memoryId);
  assert.equal(saved.data.media.media[0].sha256,before.draft.photos[0].sha256);
  assert.deepEqual(await fixture.store.saveDraft(draft.attempt,draft.memoryId),saved);
 }finally{fixture.close();}
});

test('Recently Deleted frees a slot; archive and unarchive preserve count; at-cap restores are atomic',async()=>{
 const x=setup(undefined,{requireMemoryCapacity:policy()});try{
  for(let i=0;i<20;i++)await add(x.store,{title:'Synthetic '+i});
  const [first,second]=(await x.store.load()).data.memories;
  await x.store.lifecycle(first.id,'archived','2026-11-26');
  await assert.rejects(add(x.store),/20 saved memories/);
  await x.store.lifecycle(first.id,'active','2026-11-26');
  await x.store.lifecycle(first.id,'recently_deleted','2026-11-26');
  const preserved=(await x.store.load()).draft;assert.ok(preserved);await x.store.saveDraft(preserved.attempt,preserved.memoryId);
  const before=await x.store.load();
  assert.equal(before.data.memories.length,21);
  await assert.rejects(x.store.lifecycle(first.id,'active','2026-11-26'),/restore requires an available slot/);
  assert.deepEqual(await x.store.load(),before);
  await x.store.lifecycle(second.id,'recently_deleted','2026-11-26');
  await x.store.lifecycle(first.id,'active','2026-11-26');
  assert.equal((await x.store.load()).data.memories.find(m=>m.id===second.id).lifecycle,'recently_deleted');
 }finally{x.close();}
});
test('bulk restore reserves all slots at once and retains data when blocked',async()=>{
 const state={entitlement:'plus',status:'ready'};const x=setup(undefined,{requireMemoryCapacity:policy(state)});try{
  for(let i=0;i<21;i++)await add(x.store,{title:'Synthetic '+i});
  const ids=(await x.store.load()).data.memories.slice(0,2).map(m=>m.id);
  await x.store.bulkLifecycle(ids,'recently_deleted',(await x.store.load()).revision);
  state.entitlement='free';const before=await x.store.load();
  await assert.rejects(x.store.bulkLifecycle(ids,'archived',before.revision),/restore requires an available slot/);
  assert.deepEqual(await x.store.load(),before);
  await x.store.bulkLifecycle([ids[0]],'archived',before.revision);
  await assert.rejects(x.store.lifecycle(ids[1],'active','2026-11-26'),/restore requires an available slot/);
  state.entitlement='plus';await x.store.lifecycle(ids[1],'active','2026-11-26');
  assert.equal((await x.store.load()).data.memories.length,21);
 }finally{x.close();}
});
test('over-cap legitimate data remains editable and shareable; deletion to 19 lets restore once',async()=>{
 const state={entitlement:'plus',status:'ready'};const x=setup(undefined,{requireMemoryCapacity:policy(state)});try{
  for(let i=0;i<21;i++)await add(x.store,{title:'Synthetic '+i});
  state.entitlement='free';
  const [a,b]=(await x.store.load()).data.memories;
  await x.store.lifecycle(a.id,'recently_deleted','2026-11-26');
  await assert.rejects(x.store.lifecycle(a.id,'active','2026-11-26'),/restore requires an available slot/);
  await x.store.lifecycle(b.id,'recently_deleted','2026-11-26');
  await x.store.lifecycle(a.id,'active','2026-11-26');
  const before=await x.store.load();
  assert.equal(before.data.memories.filter(m=>m.lifecycle!=='recently_deleted').length,20);
  await assert.rejects(add(x.store),/20 saved memories/);
  const share=(await import('../src/eng-domain.ts')).sharePreview(before.data.memories.find(m=>m.id===b.id),before.data);
  assert.match(share.text,/Synthetic/);
 }finally{x.close();}
});

test('Free external restore counts incoming active and archived, not the replaced collection; over-cap staging and commit preserve data',async()=>{
 const state={entitlement:'free',status:'ready'};const x=setup(undefined,{requireMemoryCapacity:policy(state)}),source=setup();
 try{
  for(let i=0;i<21;i++)await add(source.store,{title:'Incoming '+i});
  const all=await source.store.load();
  await add(x.store,{title:'Existing'});
  const before=await x.store.load();const token=await x.store.restoreToken();
  await assert.rejects(x.store.stageRestore(all,async()=>assert.fail('read before capacity gate'),token),/more than 20/);
  await assert.rejects(x.store.restore(all,'incoming',token),/more than 20/);
  assert.deepEqual(await x.store.load(),before);
  await source.store.lifecycle(all.data.memories[0].id,'recently_deleted','2026-11-27');
  await source.store.lifecycle(all.data.memories[1].id,'archived','2026-11-27');
  const twenty=await source.store.load();await x.store.stageRestore(twenty,async()=>assert.fail('no photos in fixture'),token);
  const restored=await x.store.restore(twenty,'incoming',token);
  assert.equal(restored.data.memories.filter(m=>m.lifecycle!=='recently_deleted').length,20);
 }finally{x.close();source.close();}
});

test('v4 replacement rechecks Free cap at commit and keeps previous reminders and collection',async()=>{
 const state={entitlement:'plus',status:'ready'},x=setup(undefined,{requireMemoryCapacity:policy(state)}),source=setup();
 try{
  await add(x.store,{title:'Keep current'});
  for(let i=0;i<21;i++)await add(source.store,{title:'Incoming '+i});
  const incoming=await source.store.backupWithReminders();
  const {collectionToken,reminderToken}=await x.store.reviewRestore(incoming.snapshot);
  await x.store.stageRestore(incoming.snapshot,incoming.read,collectionToken,reminderToken);
  const before=await x.store.backupWithReminders();state.entitlement='free';
  await assert.rejects(x.store.restoreV4(incoming.snapshot,incoming.reminders,'incoming',collectionToken,reminderToken),/more than 20/);
  const after=await x.store.backupWithReminders();assert.deepEqual(after.snapshot,before.snapshot);assert.deepEqual(after.reminders,before.reminders);
 }finally{x.close();source.close();}
});
