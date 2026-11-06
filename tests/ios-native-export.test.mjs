import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import { writeEngStreamV4, openEngStreamCompatible } from '../src/eng-stream-v4.ts';
import { setup, add } from './eng-fixture.mjs';

const source=fs.readFileSync(new URL('../src/eng-runtime.native.ts',import.meta.url),'utf8');
const js=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
function fixture({platform='ios',available=true,corrupt=false,shareError=false}={}) {
 const files=new Map(),shares=[];let saf=0;
 class File {
  constructor(...parts){this.uri=parts.join('/');}
  get exists(){return files.has(this.uri);}
  get size(){return files.get(this.uri)?.length??0;}
  create(){assert.equal(this.exists,false);files.set(this.uri,new Uint8Array());}
  write(value,options){const bytes=typeof value==='string'?new TextEncoder().encode(value):value;files.set(this.uri,options?.append?Uint8Array.from([...(files.get(this.uri)??[]),...bytes]):bytes);}
  async text(){return corrupt?'bad readback':new TextDecoder().decode(files.get(this.uri));}
  open(){const file=this;return {offset:0,readBytes(length){const result=files.get(file.uri).slice(this.offset,this.offset+length);this.offset+=length;if(corrupt&&result.length)result[0]^=255;return result;},close(){}};}
  delete(){files.delete(this.uri);}
 }
 const deps={
  'react-native':{Platform:{OS:platform}},
  'expo-sharing':{isAvailableAsync:async()=>available,shareAsync:async(uri,options)=>{assert.ok(files.get(uri)?.length);shares.push({uri,options});if(shareError)throw Error('No current view controller');}},
  'expo-constants':{default:{expoConfig:{extra:{appEnvironment:'development'}}}},
  'expo-file-system':{File,FileMode:{ReadOnly:1},Paths:{cache:'file:///private/cache'}},
  'expo-file-system/legacy':{StorageAccessFramework:{requestDirectoryPermissionsAsync:async()=>{saf++;return {granted:false};}}},
  './storage-space.native':{requireNativeCapacity:async()=>{}},
  './eng-backup':{fullBackupLimit:154_000_000},
  './eng-stream-v4':{writeEngStreamV4,openEngStreamCompatible},
  './standalone-reminders.native':{snapshotStandaloneRemindersForBackup:async()=>({version:1,rows:[]})},
 };
 const module={exports:{}};
 vm.runInNewContext(js,{module,exports:module.exports,require:name=>deps[name]??{},Uint8Array,TextEncoder,TextDecoder,Date,Math,Error,Promise,JSON});
 return {api:module.exports,files,shares,saf:()=>saf};
}
test('iOS full backup verifies real v4 bytes before native sharing without Android SAF',async()=>{
 const store=setup();try {
  await add(store.store,{title:'Exact answer',answer:'20 x 25'});
  const x=fixture(),backup=await store.store.backup();
  const result=await x.api.writeEngBackup(backup);
  assert.equal(x.saf(),0);assert.equal(x.shares.length,1);assert.match(x.shares[0].uri,/\.cdxe$/);
  const bytes=x.files.get(x.shares[0].uri);
  const opened=await openEngStreamCompatible({size:bytes.length,read:async(o,n)=>bytes.slice(o,o+n)},backup.hash);
  assert.equal(opened.source,'Full v4');assert.deepEqual(opened.reminders,{version:1,rows:[]});
  assert.match(result,/cannot confirm the external save/);assert.match(result,/if you canceled/);
  assert.doesNotMatch(result,/backup saved and verified/);
 } finally {store.close();}
});
test('iOS corrupt backup cannot reach share sheet and removes incomplete cache file',async()=>{
 const store=setup();try {const x=fixture({corrupt:true});await assert.rejects(x.api.writeEngBackup(await store.store.backup()));assert.equal(x.shares.length,0);assert.equal(x.files.size,0);}finally{store.close();}
});
test('iOS report and limited text backup retain verified file and honest completion/cancel wording',async()=>{
 for(const backup of [false,true]) {
  const x=fixture(),text='Exact café & filter';const result=await x.api.writeEngText(text,backup);
  assert.equal(x.saf(),0);assert.equal(x.shares.length,1);
  assert.match(x.shares[0].uri,backup?/\.json$/:/\.txt$/);
  assert.equal(new TextDecoder().decode(x.files.get(x.shares[0].uri)),text);
  assert.match(result,/cannot confirm the external save/);assert.match(result,/if you canceled/);
  assert.match(result,backup?/Photos.*excluded/:/cannot restore your collection/);
 }
});
test('iOS unavailable sharing, failed readback and presentation failure do not report success',async()=>{
 for(const options of [{available:false},{corrupt:true},{shareError:true}]) {
  const x=fixture(options);await assert.rejects(x.api.writeEngText('kept'));
  assert.equal(x.files.size,0);assert.equal(x.saf(),0);
  if(!options.shareError)assert.equal(x.shares.length,0);
 }
});
test('Android retains SAF cancellation path and never invokes iOS sharing',async()=>{
 const x=fixture({platform:'android'}),store=setup();
 try {
  assert.equal(await x.api.writeEngText('text'),'Text export canceled.');
  assert.equal(await x.api.writeEngBackup(await store.store.backup()),'Backup canceled. Your memories and draft are kept.');
  assert.equal(x.saf(),2);assert.equal(x.shares.length,0);assert.equal(x.files.size,0);
 }finally{store.close();}
});
