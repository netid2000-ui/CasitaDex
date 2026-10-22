import test from 'node:test';
import assert from 'node:assert/strict';
import {registerHooks} from 'node:module';
import {verified,hash} from './eng-fixture.mjs';
import {writeEngStreamV4} from '../src/eng-stream-v4.ts';
test('accepted native consumer picker returns only a validated Full v4 archive without opening its database',async()=>{
 const chunks=[];const reminders={version:1,rows:[]};
 await writeEngStreamV4(verified(),reminders,async()=>{throw Error('No image expected')},hash,{write:async b=>chunks.push(b.slice())});
 let raw=new Uint8Array(chunks.reduce((n,b)=>n+b.length,0)),at=0;
 for(const b of chunks){raw.set(b,at);at+=b.length}
 let opens=0,canceled=false;
 globalThis.__nativePicker={bytes:raw,pick:async()=>canceled?{canceled:true}:{canceled:false,assets:[{uri:'qa://archive'}]},open:async()=>{opens++;throw Error('Picker must not open a database')}};
 const mocks={
 'expo-constants':'export default {expoConfig:{extra:{appEnvironment:"development"}}};',
 '@react-native-async-storage/async-storage':'export default {};',
 'expo-sqlite':'export const openDatabaseAsync=globalThis.__nativePicker.open;',
 'expo-image-picker':'export const requestCameraPermissionsAsync=()=>{};',
 'expo-document-picker':'export const getDocumentAsync=globalThis.__nativePicker.pick;',
 'expo-file-system/legacy':'export const StorageAccessFramework={};export const getFreeDiskStorageAsync=async()=>1000000000;',
 'expo-crypto':'import {createHash} from "node:crypto";export const CryptoDigestAlgorithm={SHA256:"sha256"};export const digest=async(_,b)=>Uint8Array.from(createHash("sha256").update(b).digest()).buffer;',
 'expo-file-system': 'export const Paths={document:"private:",cache:"cache:",availableDiskSpace:1000000000,totalDiskSpace:2000000000};export const FileMode={ReadOnly:0};export class Directory{constructor(...p){this.uri=p.join("/")}};export class File{constructor(uri){this.uri=uri}get size(){return globalThis.__nativePicker.bytes.length}open(){return {offset:0,readBytes(n){return globalThis.__nativePicker.bytes.slice(this.offset,this.offset+n)},close(){}}}};'
 };
 const hook=registerHooks({resolve(s,ctx,next){
  if(mocks[s])return{url:'data:text/javascript,'+encodeURIComponent(mocks[s]),shortCircuit:true};
  try{return next(s,ctx)}catch(e){if(s.startsWith('.'))return next(s+'.ts',ctx);throw e}
 }});
 try{
  const {pickEngBackup}=await import('../src/eng-runtime.native.ts');
  const opened=await pickEngBackup();
  assert.equal(opened.source,'Full v4');assert.deepEqual(opened.reminders,reminders);assert.deepEqual(opened.snapshot.data,verified().data);assert.equal(opens,0);
  globalThis.__nativePicker.bytes=raw.slice(0,raw.length-1);await assert.rejects(pickEngBackup());assert.equal(opens,0);
  canceled=true;assert.equal(await pickEngBackup(),null);assert.equal(opens,0);
 }finally{hook.deregister();delete globalThis.__nativePicker}
});
