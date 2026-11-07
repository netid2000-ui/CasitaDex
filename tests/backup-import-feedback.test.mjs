import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import {writeEngStreamV4,openEngStreamCompatible} from '../src/eng-stream-v4.ts';
import {setup,add,png,hash} from './eng-fixture.mjs';
const source=fs.readFileSync(new URL('../src/eng-runtime.native.ts',import.meta.url),'utf8');
const js=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
function fixture(bytes,{canceled=false,readError=false,pickerError=false,constructorError=false,metadataError=false,sizeOverride}={}){
 let opens=0,closes=0;const requests=[];
 class File{constructor(uri){if(constructorError)throw Error('private constructor path');assert.equal(uri,'private-cache:backup');}get size(){if(metadataError)throw Error('private metadata path');return sizeOverride??bytes.length;}open(){opens++;const h={offset:0,readBytes(n){if(readError)throw Error('Cannot read /private/personal-backup-name.cdxe');return bytes.slice(h.offset,h.offset+n);},close(){closes++;}};return h;}}
 const deps={'react-native':{Platform:{OS:'ios'}},'expo-constants':{default:{expoConfig:{extra:{appEnvironment:'development'}}}},'expo-file-system':{File,FileMode:{ReadOnly:1}},'expo-document-picker':{getDocumentAsync:async options=>{requests.push(options);if(pickerError)throw Error('private document provider path');return canceled?{canceled:true}:{canceled:false,assets:[{uri:'private-cache:backup'}]};}},'./eng-backup':{fullBackupLimit:154_000_000},'./eng-stream-v4':{openEngStreamCompatible},'./media-hash.native':{sha256Media:hash}};
 const module={exports:{}};vm.runInNewContext(js,{module,exports:module.exports,require:n=>deps[n]??{},Uint8Array,TextEncoder,TextDecoder,Date,Math,Error,Promise,JSON});
 return{pick:module.exports.pickEngBackup,requests,handles:()=>({opens,closes})};
}
async function archive(){const x=setup();try{const s=await add(x.store,{title:'Kept answer',answer:'Filter size'});await x.store.addMemoryPhoto(s.data.memories.at(-1).id,png);const b=await x.store.backup(),chunks=[];await writeEngStreamV4(b.snapshot,{version:1,rows:[]},b.read,b.hash,{write:async bytes=>chunks.push(bytes)});return {bytes:Buffer.concat(chunks),snapshot:b.snapshot};}finally{x.close();}}
test('native import keeps valid Full v4 review and photo bytes intact',async()=>{const {bytes,snapshot}=await archive(),x=fixture(bytes),opened=await x.pick();assert.equal(opened.source,'Full v4');assert.deepEqual(opened.snapshot,snapshot);assert.deepEqual(Buffer.from(await opened.read(snapshot.data.media.media[0].path)),Buffer.from(png));assert.equal(x.handles().opens,x.handles().closes);assert.equal(x.requests[0].copyToCacheDirectory,true);});
test('native import cancellation performs no archive reads',async()=>{const x=fixture(new Uint8Array(),{canceled:true});assert.equal(await x.pick(),null);assert.deepEqual(x.handles(),{opens:0,closes:0});});
test('damaged and truncated native imports fail with actionable nontechnical feedback',async()=>{const {bytes}=await archive();const damaged=Buffer.from(bytes);damaged[damaged.length-1]^=1;for(const bad of [damaged,bytes.subarray(0,bytes.length-1),Buffer.from('{not json')]){const before=Buffer.from(bad),x=fixture(bad);await assert.rejects(x.pick(),e=>{assert.match(e.message,/could not be verified/);assert.match(e.message,/current memories, photos and reminders are unchanged/);assert.match(e.message,/Choose another backup/);assert.doesNotMatch(e.message,/SHA|JSON|SyntaxError/);return true;});assert.deepEqual(bad,before);assert.equal(x.handles().opens,x.handles().closes);}});
test('native archive read errors do not expose private paths and close handles',async()=>{const x=fixture(new Uint8Array(20),{readError:true});await assert.rejects(x.pick(),e=>{assert.match(e.message,/could not be verified/);assert.doesNotMatch(e.message,/private|personal-backup/);return true;});assert.deepEqual(x.handles(),{opens:1,closes:1});});

test('picker, construction and metadata failures cannot disclose private diagnostics',async()=>{for(const options of [{pickerError:true},{constructorError:true},{metadataError:true}]){const x=fixture(new Uint8Array(20),options);await assert.rejects(x.pick(),e=>{assert.match(e.message,/could not be verified/);assert.match(e.message,/unchanged/);assert.doesNotMatch(e.message,/private|provider|metadata|constructor/);return true;});assert.deepEqual(x.handles(),{opens:0,closes:0});}});
test('oversized native imports retain explicit limit guidance and do not read archive bytes',async()=>{const x=fixture(new Uint8Array(),{sizeOverride:154_000_001});await assert.rejects(x.pick(),/154 MB/);assert.deepEqual(x.handles(),{opens:0,closes:0});});
