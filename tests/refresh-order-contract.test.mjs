import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createEngStore,legacyEngSnapshot} from '../src/eng-store.ts';
import {empty} from '../src/model.ts';
import {load,deferred,settle} from './helpers/detail-share-harness.mjs';

// Only in-memory test ports; no SQLite, files, native runtime or account.
async function storePort(){
 let payload=JSON.stringify(legacyEngSnapshot(JSON.stringify(empty()))), gate=null;
 const reads=[];
 const db={
  execAsync:async()=>{},
  getFirstAsync:async sql=>{
   if(sql.includes("key='initialized'"))return {value:'3'};
   if(sql.includes('sqlite_master'))return null;
   if(sql.includes('eng_recovery_v2'))return null;
   if(sql.includes('eng_state_v2')){
    const captured=payload, pending=gate;gate=null;reads.push(JSON.parse(captured).revision);
    if(pending)await pending.promise;
    return {payload:captured};
   }
   throw Error('Unexpected read '+sql);
  },
  runAsync:async(sql,...args)=>{
   if(sql.startsWith('UPDATE eng_state_v2 SET payload='))payload=args[0];
   else if(!sql.includes('eng_recovery_v2'))throw Error('Unexpected write '+sql);
  },
  withExclusiveTransactionAsync:async fn=>fn(db),
 };
 const files={capacity:async()=>{},read:async()=>{throw Error('No media expected');},put:async()=>{throw Error('No media expected');},hash:async()=>''};
 const store=createEngStore(db,files,async()=>{throw Error('Primary already present');});
 await store.load();reads.length=0;
 return {store,reads,hold(){gate=deferred();return gate;},revision:()=>JSON.parse(payload).revision};
}
function hook(store){
 const cells=[],effects=[];let index=0,focus,cleanup,focused=true;
 const slot=fn=>{const i=index++;return cells[i]??(cells[i]=fn());};
 const react={
  useState:initial=>{const c=slot(()=>({value:initial}));return [c.value,v=>{c.value=typeof v==='function'?v(c.value):v;}];},
  useRef:initial=>slot(()=>({current:initial})),
  useCallback:fn=>fn,
  useEffect:fn=>{slot(()=>{effects.push(fn);return {};});},
 };
 const screens=load('eng-screens.tsx',{react,'expo-router':{useFocusEffect:fn=>{focus=fn;}},'./eng-runtime':{getEngStore:()=>Promise.resolve(store)},'./eng-find':{defaultFilter:()=>({})}},'\nmodule.exports.__hook=useEng;');
 const render=()=>{index=0;return screens.__hook();};
 let value=render();const unmountEffects=effects.map(fn=>fn());cleanup=focus();
 return {render,blur(){focused=false;cleanup?.();},focus(){assert.equal(focused,false);focused=true;cleanup=focus();},unmount(){cleanup?.();unmountEffects.forEach(fn=>fn?.());},get value(){value=render();return value;}};
}
test('native runtime retains one initialization promise/store, and actual store serializes all loads',()=>{
 const runtime=fs.readFileSync(new URL('../src/eng-runtime.native.ts',import.meta.url),'utf8');
 assert.match(runtime,/pending\?\?=\(async\(\)=>/);assert.match(runtime,/return pending;/);
 const source=fs.readFileSync(new URL('../src/eng-store.ts',import.meta.url),'utf8');
 assert.match(source,/load:\(\)=>serial\(loaded\)/);
});
test('pending initial focus cannot overwrite later successful mutation/readback',async()=>{
 const p=await storePort(),gate=p.hold(),h=hook(p.store);await settle();
 assert.deepEqual(p.reads,[0]);const run=h.value.run(s=>s.taxonomy('category','Kitchen'));
 await settle();assert.equal(p.revision(),0);assert.equal(h.value.busy,true);
 gate.resolve();assert.equal(await run,true);await settle();
 assert.equal(p.revision(),1);assert.equal(h.value.snapshot.revision,1);assert.equal(h.value.snapshot.data.categories.at(-1).name,'Kitchen');
 assert.equal(h.value.status,'Saved on this device.');assert.equal(h.value.busy,false);h.unmount();
});
test('blur/refocus cannot let the older load complete after the newer focus load',async()=>{
 const p=await storePort(),h=hook(p.store);await settle();
 const gate=p.hold();const old=h.value.refresh();await settle();
 h.blur();const mutation=p.store.taxonomy('category','Garage');h.focus();await settle();
 assert.equal(p.revision(),0);gate.resolve();await old;await mutation;await settle();
 assert.equal(h.value.snapshot.revision,1);assert.equal(h.value.snapshot.data.categories.at(-1).name,'Garage');h.unmount();
});
test('failed old focus read does not poison queue or overwrite newer save status',async()=>{
 const p=await storePort(),gate=p.hold(),h=hook(p.store);await settle();
 const run=h.value.run(s=>s.taxonomy('category','Bedroom'));await settle();
 gate.reject(Error('Old read failed'));assert.equal(await run,true);await settle();
 assert.equal(h.value.snapshot.revision,1);assert.equal(h.value.status,'Saved on this device.');assert.equal(h.value.busy,false);h.unmount();
});
test('unmount prevents pending reads from publishing a snapshot or error',async()=>{
 for(const fail of [false,true]){
  const p=await storePort(),gate=p.hold(),h=hook(p.store);await settle();h.unmount();
  if(fail)gate.reject(Error('Late error'));else gate.resolve();await settle();
  assert.equal(h.value.snapshot,null);assert.equal(h.value.status,'');
 }
});
test('failed mutation retains confirmed local snapshot and reports failure',async()=>{
 const p=await storePort(),h=hook(p.store);await settle();const original=h.value.snapshot;
 assert.equal(await h.value.run(async()=>{throw Error('Write denied');}),false);
 assert.equal(h.value.snapshot,original);assert.equal(h.value.status,'Write denied');assert.equal(h.value.busy,false);h.unmount();
});
test('cancelled task preserves local revision and reports its explicit status',async()=>{
 const p=await storePort(),h=hook(p.store);await settle();
 assert.equal(await h.value.run(async()=>{h.value.setStatus('Cancelled. Original kept.');},''),true);
 assert.equal(h.value.snapshot.revision,0);assert.equal(h.value.status,'Cancelled. Original kept.');h.unmount();
});
test('newer local mutation cannot be replaced by an older pending read',async()=>{
 const p=await storePort(),h=hook(p.store);await settle();
 const gate=p.hold(),first=h.value.refresh();await settle();
 const mutation=p.store.taxonomy('category','Living room'),second=h.value.refresh();await settle();
 assert.equal(h.value.snapshot.revision,0);gate.resolve();
 await Promise.all([first,mutation,second]);await settle();
 assert.equal(h.value.snapshot.revision,1);assert.equal(p.revision(),1);h.unmount();
});
