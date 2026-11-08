import test from 'node:test';import assert from 'node:assert/strict';
import {performance} from 'node:perf_hooks';
import {searchIndex,findMemories,defaultFilter,homeMemories} from '../src/eng-find.ts';
import {verified,setup,png} from './eng-fixture.mjs';

const fixture=()=>{const d=verified().data;d.spaces=[{id:'home',name:'Main House'}];d.categories=[{id:'equipment',name:'Equipment'},{id:'maintenance',name:'Maintenance'}];const m=d.memories[0];d.memories=[{...m,id:'a',title:'Kitchen filter',answer:'AB-12',notes:'Upper cabinet',categoryIds:['equipment'],due:'2026-10-18'},{...m,id:'b',title:'Kitchen replacement',answer:'AB-123',categoryIds:['maintenance'],due:'2026-10-19'},{...m,id:'c',title:'AB-12',answer:'Kitchen label',categoryIds:[],lifecycle:'archived',due:'2026-10-17'}];return d;};
test('multiword prefix search ANDs across fields and labels; identifiers remain exact and exact titles rank first',()=>{const d=fixture(),i=searchIndex(d),f=defaultFilter();assert.deepEqual(findMemories(i,'kit cab',f,'2026-10-19').map(m=>m.id),['a']);assert.deepEqual(findMemories(i,'equipment house',f,'2026-10-19').map(m=>m.id),['a']);assert.deepEqual(findMemories(i,'AB-12',f,'2026-10-19').map(m=>m.id),['a']);assert.equal(findMemories(i,'AB12',f,'2026-10-19').length,0);assert.equal(findMemories(i,'AB-12',{...f,lifecycle:'archived'},'2026-10-19')[0].id,'c');});
test('category ANY, uncategorized, confidence, reminder, attachment and lifecycle filters compose honestly',()=>{const d=fixture(),i=searchIndex(d),f=defaultFilter();assert.equal(findMemories(i,'',{...f,categories:['equipment','maintenance']},'2026-10-19').length,2);assert.equal(findMemories(i,'',{...f,uncategorized:true},'2026-10-19').length,0);assert.equal(findMemories(i,'',{...f,reminder:'overdue'},'2026-10-19')[0].id,'a');assert.equal(findMemories(i,'',{...f,reminder:'today'},'2026-10-19')[0].id,'b');assert.equal(findMemories(i,'',{...f,lifecycle:'archived',reminder:'due'},'2026-10-19').length,0);assert.equal(findMemories(i,'',{...f,attachment:'photos'},'2026-10-19').length,0);assert.equal(findMemories(i,'',{...f,confidence:'Unknown'},'2026-10-19').length,0);});
test('Home limits reminders to two oldest due active obligations and recents to two with stable legacy fallback',()=>{const d=fixture();d.memories.push({...d.memories[0],id:'d',due:'2026-10-01',createdAt:'2026-10-19T08:00:00.000Z'});const h=homeMemories(d,'2026-10-19');assert.deepEqual(h.due.map(m=>m.id),['d','a']);assert.deepEqual(h.recent.map(m=>m.id),['d','b']);assert.equal(d.memories[0].createdAt,undefined);});
test('search index and bounded result production work at 0, 1, 500 and 5000 memories',()=>{const base=fixture();for(const size of [0,1,500,5000]){const d={...base,memories:Array.from({length:size},(_,n)=>({...base.memories[0],id:'m'+n,title:'Filter '+n}))};const start=performance.now(),i=searchIndex(d),result=findMemories(i,'equipment',defaultFilter(),'2026-10-19');assert.equal(result.length,size);console.log('ENG search',size,'memories',Math.round(performance.now()-start)+'ms');}});
import {duplicateCandidates} from '../src/eng-duplicates.ts';import {newEngDraft} from '../src/eng-store.ts';
test('duplicate advisory includes trash, exact normalized title/answer, matching photos, but does not flag title alone',()=>{const s=verified(),m=s.data.memories[0],d={...newEngDraft(),title:' filter ',answer:'20x25'};m.lifecycle='recently_deleted';m.deletedAt='2026-10-19';assert.equal(duplicateCandidates(d,s).length,1);assert.equal(duplicateCandidates({...d,answer:'Other'},s).length,0);s.data.media.media=[{cardId:m.id,sha256:'exact'}];assert.equal(duplicateCandidates({...d,title:'Different',answer:'',photos:[{sha256:'exact'}]},s).length,1);});

test('dimension queries normalize x, multiplication signs and spacing in stored values and queries',()=>{
 for(const value of ['20x25x1','20 X 25 X 1','20×25×1','20 25 1']){
  const data=fixture();data.memories[0].answer=value;data.memories[1].answer='20x25x10';
  for(const query of ['20x25x1','20 X 25 X 1','20 × 25 × 1','20✕25✕1','20 25 1'])
   assert.deepEqual(findMemories(searchIndex(data),query,defaultFilter(),'2026-11-08').map(m=>m.id),['a'],value+' / '+query);
 }
 const data=fixture();data.memories[0].answer='AB20x25';
 assert.equal(findMemories(searchIndex(data),'20x25',defaultFilter(),'2026-11-08').length,0);
 data.memories[0].answer='1.5x20x25';
 assert.equal(findMemories(searchIndex(data),'1.5 × 20 × 25',defaultFilter(),'2026-11-08')[0].id,'a');
});
