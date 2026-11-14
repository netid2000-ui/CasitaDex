import test from 'node:test';
import assert from 'node:assert/strict';
import {setup,verified} from './eng-fixture.mjs';
import {newEngDraft} from '../src/eng-store.ts';
for(const kind of ['space','category']) {
 test(kind+': duplicate create/rename and invalid names preserve primary and recovery snapshots',async()=>{
  const x=setup(verified());try {
   let s=await x.store.taxonomy(kind,'Safety Label');
   const table=kind==='space'?'spaces':'categories';const first=s.data[table].at(-1);
   s=await x.store.taxonomy(kind,'Second Label');const second=s.data[table].at(-1);
   const before=await x.store.load();const recovery=x.raw.prepare('select payload from eng_recovery_v2').get()?.payload;
   for(const name of ['Safety Label','sAfEtY lAbEl','  SAFETY LABEL  ']) {
    await assert.rejects(x.store.taxonomy(kind,name),/already exists/);
    await assert.rejects(x.store.renameTaxonomy(kind,second.id,name,before.revision),/already exists/);
    assert.deepEqual(await x.store.load(),before);assert.equal(x.raw.prepare('select payload from eng_recovery_v2').get()?.payload,recovery);
   }
   for(const name of ['', '   ', 'x'.repeat(201)]) {
    await assert.rejects(x.store.taxonomy(kind,name),/name up to 200/);
    await assert.rejects(x.store.renameTaxonomy(kind,first.id,name,before.revision),/name up to 200/);
    assert.deepEqual(await x.store.load(),before);
   }
   s=await x.store.renameTaxonomy(kind,first.id,'  SAFETY LABEL  ',before.revision);
   assert.equal(s.data[table].find(t=>t.id===first.id).name,'SAFETY LABEL');
   assert.equal(s.data[table].length,before.data[table].length);
  } finally {x.close()}
 });
 test(kind+': removal review is read-only; rename preserves links; stale removal refused; confirmed removal keeps memory and draft',async()=>{
  const x=setup(verified());try {
   let s=await x.store.taxonomy(kind,'Safety Review');const table=kind==='space'?'spaces':'categories',label=s.data[table].at(-1);
   s=await x.store.updateMemory({...s.data.memories[0],...(kind==='space'?{spaceId:label.id}:{categoryIds:[label.id]})},s.revision);
   await x.store.checkpoint({...newEngDraft(),checkpoint:1,title:'Keep draft',...(kind==='space'?{spaceId:label.id}:{categoryIds:[label.id]})});
   const before=await x.store.load(),review=await x.store.taxonomyImpact(kind,label.id);
   assert.equal(review.memories,1);assert.equal(review.draft,true);assert.deepEqual(await x.store.load(),before);
   s=await x.store.renameTaxonomy(kind,label.id,'Renamed Safety Review',review.revision);
   assert.deepEqual(s.data.memories,before.data.memories);assert.deepEqual(s.draft,before.draft);
   await assert.rejects(x.store.removeTaxonomy(kind,label.id,review.revision),/changed/);assert.deepEqual(await x.store.load(),s);
   const fresh=await x.store.taxonomyImpact(kind,label.id);s=await x.store.removeTaxonomy(kind,label.id,fresh.revision);
   assert.equal(s.data.memories.length,before.data.memories.length);assert.equal(s.data.memories[0].title,before.data.memories[0].title);assert.equal(s.draft.title,'Keep draft');assert.deepEqual(s.data.media,before.data.media);
   if(kind==='space'){assert.equal(s.data.memories[0].spaceId,null);assert.equal(s.draft.spaceId,null)}else{assert.deepEqual(s.data.memories[0].categoryIds,[]);assert.deepEqual(s.draft.categoryIds,[])}
  } finally {x.close()}
 });
}
