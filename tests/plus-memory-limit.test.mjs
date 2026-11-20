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
