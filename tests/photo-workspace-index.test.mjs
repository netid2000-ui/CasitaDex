import test from 'node:test';
import assert from 'node:assert/strict';
import {photoWorkspaceItems,photoSummaries} from '../src/figma-first/photo-summaries.ts';
import {orderedMemoryPhotos} from '../src/photo-order.ts';
test('indexed workspace preserves selected cover order, ownership, filtering and sort',()=>{
 const data={memories:[
  {id:'a',title:'A',lifecycle:'active',createdAt:'2026-01-01',updatedAt:'2026-03-01',mediaIds:['a2','a1','b1']},
  {id:'b',title:'B',lifecycle:'active',createdAt:'2026-02-01',mediaIds:['b1']},
  {id:'c',title:'C',lifecycle:'archived',mediaIds:['c1']}
 ],media:{media:[
  {id:'a1',cardId:'a',path:'a1.png'},{id:'a2',cardId:'a',path:'a2.png'},
  {id:'b1',cardId:'b',path:'b1.png'},{id:'c1',cardId:'c',path:'c1.png'}
 ]}};
 const before=JSON.stringify(data);
 for(const sort of ['added','updated']){
  const expected=photoSummaries(data,sort).map(item=>({...item,photos:orderedMemoryPhotos(data,item.id).map(p=>({id:p.id,uri:'local:'+p.path}))}));
  assert.deepEqual(photoWorkspaceItems(data,sort,p=>'local:'+p),expected);
 }
 assert.equal(JSON.stringify(data),before);
});
test('1000-photo gallery resolves each included photo once',()=>{
 const data={memories:[],media:{media:[]}};let resolved=0;
 for(let i=0;i<1000;i++){
  data.memories.push({id:'m'+i,title:'Item '+i,lifecycle:'active',mediaIds:['p'+i]});
  data.media.media.push({id:'p'+i,cardId:'m'+i,path:'media/p'+i+'.png'});
 }
 const items=photoWorkspaceItems(data,'updated',p=>{resolved++;return p;});
 assert.equal(items.length,1000);assert.equal(resolved,1000);
 assert.equal(items[999].photos[0].id,'p999');
});
