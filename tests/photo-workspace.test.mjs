import test from 'node:test';import assert from 'node:assert/strict';
import {setup,add,png,hash,restore} from './eng-fixture.mjs';
import {createEngStore} from '../src/eng-store.ts';
import {movedPhoto,photoPermutation,orderedMemoryPhotos} from '../src/photo-order.ts';
import {photoSummaries} from '../src/figma-first/photo-summaries.ts';
import {findMemories,searchIndex,defaultFilter} from '../src/eng-find.ts';
test('cover and photo order persist across store reopening without altering immutable bytes or ownership',async()=>{
 const x=setup();try{
  let s=await add(x.store,{title:'Fictional photo order'}),id=s.data.memories[0].id;
  for(let i=0;i<3;i++)s=await x.store.addMemoryPhoto(id,Uint8Array.from([...png,i]));
  const before=structuredClone(s),original=s.data.memories[0].mediaIds,order=movedPhoto(original,original[2],0),files=new Map([...x.files].map(([p,b])=>[p,b.slice()]));
  s=await x.store.reorderMemoryPhotos(id,order,s.revision);
  assert.deepEqual(s.data.memories[0].mediaIds,[original[2],original[0],original[1]]);
  assert.deepEqual(orderedMemoryPhotos(s.data,id).map(p=>p.id),order);
  assert.equal(s.data.memories[0].confidence,before.data.memories[0].confidence);
  assert.deepEqual(new Set(s.data.media.media.map(p=>p.id)),new Set(before.data.media.media.map(p=>p.id)));
  const reopened=createEngStore(x.db,x.port,async()=>{throw Error('Unexpected migration')});
  assert.deepEqual((await reopened.load()).data.memories[0].mediaIds,order);
  for(const [p,b] of files){assert.deepEqual(x.files.get(p),b);assert.equal(await hash(b),await hash(x.files.get(p)));}
  const backup=await reopened.backup();assert.deepEqual(backup.snapshot.data.memories[0].mediaIds,order);
  await reopened.reorderMemoryPhotos(id,[...order].reverse(),(await reopened.load()).revision);await restore(reopened,backup.snapshot);assert.deepEqual((await reopened.load()).data.memories[0].mediaIds,order);
 }finally{x.close();}
});
test('stale or incomplete/cross-memory photo order is rejected atomically and deleted memories cannot be rearranged',async()=>{
 const x=setup();try{
  let s=await add(x.store),id=s.data.memories[0].id;s=await x.store.addMemoryPhoto(id,png);s=await x.store.addMemoryPhoto(id,png);const before=structuredClone(s),ids=s.data.memories[0].mediaIds;
  for(const order of [[],[ids[0]],[ids[0],ids[0]],[ids[0],'someone_else']])await assert.rejects(x.store.reorderMemoryPhotos(id,order,s.revision));
  await assert.rejects(x.store.reorderMemoryPhotos(id,ids,s.revision-1),/changed/);assert.deepEqual(await x.store.load(),before);
  s=await x.store.lifecycle(id,'recently_deleted','2026-11-08');await assert.rejects(x.store.reorderMemoryPhotos(id,ids,s.revision),/unavailable/);assert.deepEqual(await x.store.load(),s);
 }finally{x.close();}
});
test('move helpers reject impossible positions and leave their inputs unchanged',()=>{
 const ids=['p1','p2','p3'];assert.deepEqual(movedPhoto(ids,'p1',2),['p2','p3','p1']);assert.deepEqual(ids,['p1','p2','p3']);assert.throws(()=>movedPhoto(ids,'missing',0));assert.throws(()=>movedPhoto(ids,'p1',-1));assert.throws(()=>photoPermutation(ids,['p1','p2']));
});
test('recent gallery order uses memory timestamps, is stable for legacy dates, and excludes archived/deleted/draft records',()=>{
 const m=(id,createdAt,updatedAt,lifecycle='active')=>({id,title:id,lifecycle,createdAt,updatedAt,mediaIds:['p'+id]});
 const data={memories:[m('old','2026-01-01','2026-11-08'),m('new','2026-11-01','2026-11-01'),m('legacy'),m('archive',undefined,undefined,'archived')],media:{media:['old','new','legacy','archive'].map(id=>({id:'p'+id,cardId:id,path:'private'}))}};
 const before=structuredClone(data);assert.deepEqual(photoSummaries(data,'updated').map(m=>m.id),['old','new','legacy']);assert.deepEqual(photoSummaries(data,'added').map(m=>m.id),['new','old','legacy']);assert.deepEqual(data,before);
});
test('With photos composes with Find text and lifecycle without putting search in Photos',()=>{
 const make=(id,lifecycle,photos)=>({id,title:'Filter '+id,answer:'20 x 25 x 1',location:'',notes:'',categoryIds:[],mediaIds:photos,spaceId:null,legacyContext:null,lifecycle});
 const data={spaces:[],categories:[],memories:[make('a','active',['p1']),make('b','active',[]),make('c','archived',['p2'])],media:{media:[{id:'p1',cardId:'a'},{id:'p2',cardId:'c'}]}};
 const index=searchIndex(data);assert.deepEqual(findMemories(index,'20x25x1',{...defaultFilter(),attachment:'photos'},'2026-11-08').map(m=>m.id),['a']);assert.deepEqual(findMemories(index,'Filter',{...defaultFilter(),lifecycle:'archived',attachment:'photos'},'2026-11-08').map(m=>m.id),['c']);
});

import {photoZoomScale,touchDistance} from '../src/photo-zoom.ts';
test('photo zoom clamps to 1–4 and pinch distance handles missing touches',()=>{
 for(const [input,expected]of [[0,1],[1,1],[2.5,2.5],[9,4],[NaN,1],[Infinity,1]])assert.equal(photoZoomScale(input),expected);
 assert.equal(touchDistance([]),0);assert.equal(touchDistance([{pageX:0,pageY:0}]),0);assert.equal(touchDistance([{pageX:0,pageY:0},{pageX:3,pageY:4}]),5);
});
