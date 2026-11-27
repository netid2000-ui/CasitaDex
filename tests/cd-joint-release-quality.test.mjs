import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {performance} from 'node:perf_hooks';
import {setup,add,png,hash,verified} from './eng-fixture.mjs';
import {createEngStore,newEngDraft} from '../src/eng-store.ts';
import {openEngStreamCompatible} from '../src/eng-stream-v4.ts';
import {searchIndex,findMemories,defaultFilter} from '../src/eng-find.ts';
import {photoWorkspaceItems} from '../src/figma-first/photo-summaries.ts';
test('historical native Build 4 synthetic archive preserves photo bytes and collection across interrupted initial migration then retry',async()=>{
 const bytes=await readFile(new URL('./fixtures/build5-to-build6/historic-build4-synthetic.cdxe',import.meta.url));
 const opened=await openEngStreamCompatible({size:bytes.length,read:async(o,n)=>bytes.subarray(o,o+n)},hash);
 const f=setup();try{
  for(const photo of opened.snapshot.data.media.media)f.files.set(photo.path,await opened.read(photo.path));
  const transaction=f.db.withExclusiveTransactionAsync;let interrupted=false;
  f.db.withExclusiveTransactionAsync=fn=>transaction(async tx=>{await fn(tx);if(!interrupted){interrupted=true;throw Error('Synthetic interrupted migration')}});
  const migrate=()=>Promise.resolve(opened.snapshot);
  await assert.rejects(createEngStore(f.db,f.port,migrate).load(),/interrupted migration/);
  assert.equal(f.raw.prepare('SELECT count(*) n FROM eng_state_v2').get().n,0);
  const current=createEngStore(f.db,f.port,migrate),loaded=await current.load();
  assert.deepEqual(loaded,opened.snapshot);
  for(const photo of loaded.data.media.media)assert.equal(await hash(await f.port.read(photo.path)),photo.sha256);
  assert.deepEqual(await createEngStore(f.db,f.port,()=>{throw Error('Unexpected second migration')}).load(),loaded);
 }finally{f.close();}
});
test('ordinary memory and photo capture at zero available space preserve prior collection and draft',async()=>{
 const f=setup();try{
  await add(f.store);const draft={...newEngDraft(),checkpoint:1,title:'QA pending',answer:'Kept'};await f.store.checkpoint(draft);
  const prior=await f.store.load();f.deny(true);
  await assert.rejects(f.store.addPhoto(draft.id,png),/Insufficient storage/);
  await assert.rejects(f.store.saveDraft(draft.attempt,draft.memoryId),/Insufficient storage/);
  assert.deepEqual(await f.store.load(),prior);assert.equal(f.files.size,0);
  f.deny(false);await f.store.addPhoto(draft.id,png);
  const afterPhoto=await f.store.load();f.deny(true);
  await assert.rejects(f.store.saveDraft(draft.attempt,draft.memoryId),/Insufficient storage/);
  assert.deepEqual(await f.store.load(),afterPhoto);assert.equal(f.files.size,1);
  f.deny(false);assert.equal((await f.store.saveDraft(draft.attempt,draft.memoryId)).data.memories.length,2);
 }finally{f.close();}
});
test('Mac synthetic 100 and 5000 memory, 10000 photo metadata retrieval benchmark',()=>{
 const template=verified().data,base=template.memories[0];
 for(const size of [100,5000]){
  const data={...template,memories:[],media:{version:2,media:[]}};
  for(let i=0;i<size;i++){
   const id='m'+i,mediaIds=['p'+i+'a','p'+i+'b'];data.memories.push({...base,id,title:'QA filter '+i,answer:'20x25x1',mediaIds});
   for(const photo of mediaIds)data.media.media.push({id:photo,cardId:id,path:'media/'+photo+'.png'});
  }
  const start=performance.now(),index=searchIndex(data),indexed=performance.now(),found=findMemories(index,'QA filter 20x25x1',defaultFilter(),'2026-11-26'),searched=performance.now();
  let reads=0;const gallery=photoWorkspaceItems(data,'updated',p=>{reads++;return p}),end=performance.now();
  assert.equal(found.length,size);assert.equal(gallery.length,size);assert.equal(reads,size*2);
  console.log('CD6 SCALE',JSON.stringify({memories:size,photos:reads,indexMs:Math.round(indexed-start),queryMs:Math.round(searched-indexed),galleryMs:Math.round(end-searched),heapMB:Math.round(process.memoryUsage().heapUsed/1e6)}));
 }
});

test('large text does not pin the Free limit explanation in the Add editor toolbar', async () => {
  const { readFile } = await import('node:fs/promises');
  const source = await readFile(new URL('../src/eng-screens.tsx', import.meta.url), 'utf8');
  const editor = source.slice(source.indexOf('export function EngAdd(){'), source.indexOf('function DetailField'));
  const open = editor.indexOf('stickyActions=');
  const close = editor.indexOf('</View>:undefined}>', open);
  const notice = editor.indexOf('testID="memory-limit-notice"');
  assert.ok(open >= 0 && close > open && notice > close, 'limit notice must scroll with form content');
  assert.match(editor.slice(open, close), /stackEditorActions\?"column":"row"/);
});
