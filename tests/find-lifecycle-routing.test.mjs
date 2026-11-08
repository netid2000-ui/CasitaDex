import test from 'node:test';
import assert from 'node:assert/strict';
import {findLifecycle,defaultFilter,findMemories,searchIndex} from '../src/eng-find.ts';
const data=()=>({spaces:[],categories:[],media:{media:[]},memories:['active','archived','recently_deleted'].map((lifecycle,i)=>({id:String(i),title:'Filter 20 x 25 x 1',answer:'Fictional fixture',location:'',notes:'',legacyContext:null,spaceId:null,categoryIds:[],mediaIds:[],lifecycle}))});
const results=(d,life,q='')=>findMemories(searchIndex(d),q,{...defaultFilter(),lifecycle:findLifecycle(life)},'2026-11-08');
test('management route selects only its requested lifecycle; normal Find remains active',()=>{
 const d=data();
 for(const life of ['active','archived','recently_deleted'])assert.deepEqual(results(d,life).map(m=>m.lifecycle),[life]);
 for(const invalid of [undefined,null,'all','deleted',['archived'],{},'ARCHIVED'])assert.deepEqual(results(d,invalid).map(m=>m.lifecycle),['active']);
});
test('dimension normalization works inside Archived and Recently Deleted scopes',()=>{
 for(const life of ['archived','recently_deleted'])assert.deepEqual(results(data(),life,'20x25x1').map(m=>m.lifecycle),[life]);
});
test('archiving, deletion and restoration move a memory between scoped searches without duplicating it',()=>{
 const d=data();d.memories=d.memories.slice(0,1);const m=d.memories[0];
 for(const life of ['archived','recently_deleted','active']){
  m.lifecycle=life;
  for(const scope of ['active','archived','recently_deleted'])assert.equal(results(d,scope).length,scope===life?1:0);
  assert.equal(d.memories.length,1);
 }
});

import {readFindContext,saveFindContext} from '../src/find-context.ts';
test('returning from details retains each lifecycle search and scroll without leaking between scopes',()=>{
 const old=Object.fromEntries(['active','archived','recently_deleted'].map(k=>[k,readFindContext(k)]));
 try{
  saveFindContext('active',{query:'washer',y:320});saveFindContext('archived',{query:'old boiler',y:980});saveFindContext('recently_deleted',{query:'filter',y:50});
  assert.equal(readFindContext('active').query,'washer');assert.equal(readFindContext('archived').query,'old boiler');assert.equal(readFindContext('recently_deleted').y,50);
  const copy=readFindContext('active');copy.query='not persisted';assert.equal(readFindContext('active').query,'washer');
 }finally{for(const [life,context]of Object.entries(old))saveFindContext(life,context);}
});
