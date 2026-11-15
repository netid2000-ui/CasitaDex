import test from 'node:test';
import assert from 'node:assert/strict';
import {beginFreshFind,readFindContext,saveFindContext} from '../src/find-context.ts';
import {filterFindResults,findLocationChoices,locationAfterSpaceChange,findPage} from '../src/find-filters.ts';
import {findMemories,searchIndex,defaultFilter} from '../src/eng-find.ts';
const data={spaces:[{id:'h',name:'Hallway'},{id:'g',name:'Garage'}],categories:[{id:'c',name:'Maintenance'}],locations:[{id:'gh',spaceId:'g',name:'Shelf'},{id:'hh',spaceId:'h',name:'Shelf'},{id:'a',spaceId:null,name:'Attic'}],media:{media:[{id:'p',cardId:'1'}]},memories:[['1','h',' Shelf ','c'],['2','g','Shelf','c'],['3','h','Shelf',''],['4',null,'Attic','']].map(([id,spaceId,location,c])=>({id,spaceId,location,categoryIds:c?[c]:[],title:'Filter 20 x 25 x 1',answer:'Fixture',notes:'',legacyContext:null,lifecycle:'active',mediaIds:id==='1'?['p']:[]}))};
test('fresh entry clears stale query, filters, page and scroll; result return keeps context',()=>{
 const old=readFindContext('active');try{
 saveFindContext('active',{query:'stale',page:2,y:540,spaceId:'h',categoryId:'c',locationId:'hh',photosOnly:true});
 const entry=beginFreshFind();assert.deepEqual(readFindContext('active'),{query:'',page:0,pageSize:10,y:0,photosOnly:false});
 saveFindContext('active',{query:'20x25x1',page:1,y:600,locationId:'hh'});
 assert.equal(readFindContext('active').query,'20x25x1');assert.equal(readFindContext('active').y,600);assert.equal(readFindContext('active').locationId,'hh');
 assert.notEqual(beginFreshFind(),entry);assert.equal(readFindContext('active').query,'');
 }finally{saveFindContext('active',old);}
});
test('Location is scoped by Space and normalized with existing taxonomy semantics',()=>{
 const before=JSON.stringify(data);
 assert.deepEqual(filterFindResults(data.memories,data,{locationId:'hh'}).map(x=>x.id),['1','3']);
 assert.deepEqual(filterFindResults(data.memories,data,{locationId:'gh'}).map(x=>x.id),['2']);
 assert.equal(filterFindResults(data.memories,data,{locationId:'missing'}).length,0);
 assert.equal(filterFindResults(data.memories,data,{}).length,4);assert.equal(JSON.stringify(data),before);
});
test('Location choices are alphabetical, disambiguated, and restricted by selected Space',()=>{
 assert.deepEqual(findLocationChoices(data).map(x=>x.label),['Attic · Unassigned','Shelf · Garage','Shelf · Hallway']);
 assert.deepEqual(findLocationChoices(data,'h').map(x=>x.id),['hh']);
 assert.equal(locationAfterSpaceChange(data,'hh','g'),'');assert.equal(locationAfterSpaceChange(data,'hh','h'),'hh');assert.equal(locationAfterSpaceChange(data,'hh',''),'hh');
});
test('all text/Space/Category/photo/Location filter combinations intersect correctly',()=>{
 for(const query of ['', '20x25x1'])for(const spaceId of ['', 'h','g'])for(const categoryId of ['', 'c'])for(const photos of [false,true])for(const locationId of ['', 'hh','gh','a']){
 const base=findMemories(searchIndex(data),query,{...defaultFilter(),attachment:photos?'photos':'all'},'2026-11-15');
 const actual=filterFindResults(base,data,{spaceId,categoryId,locationId});
 const label=data.locations.find(l=>l.id===locationId);
 const expected=data.memories.filter(m=>(!spaceId||m.spaceId===spaceId)&&(!categoryId||m.categoryIds.includes(categoryId))&&(!photos||m.id==='1')&&(!label||m.spaceId===label.spaceId&&m.location.trim()===label.name));
 assert.deepEqual(actual.map(m=>m.id),expected.map(m=>m.id));
 }
});
test('paging does not omit or duplicate results, and shrunk filter results clamp safely',()=>{
 const rows=Array.from({length:23},(_,i)=>i);
 assert.deepEqual([0,1,2].flatMap(p=>findPage(rows,p,10).items),rows);
 assert.deepEqual(findPage([1],2,10),{page:0,pages:1,items:[1]});
 assert.deepEqual(findPage([],3,10),{page:0,pages:1,items:[]});
});
