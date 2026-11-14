import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const source=readFileSync(new URL('../src/eng-runtime.native.ts',import.meta.url),'utf8');
const compiled=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
function setup({sharingAvailable=true,shareFails=false,verifyFails=false,names=[]}={}){
 let shares=0,deletes=0;
 const files=[],snapshot={data:{media:{media:[]}}},reminders={items:[]};
 class File {
  exists=false;
  constructor(...parts){this.uri=parts.join('/');files.push(this);}
  create(){this.exists=true;}
  write(){}
  delete(){deletes++;this.exists=false;}
 }
 const mocks={
  './storage-space.native':{requireNativeCapacity:async()=>{}},
  'expo-constants':{default:{expoConfig:{extra:{appEnvironment:'development'}}}},
  'expo-file-system':{File,Paths:{document:'private-documents'}},
  'react-native':{Platform:{OS:'ios'}},
  'expo-file-system/legacy':{readDirectoryAsync:async()=>names},
  './eng-backup':{fullBackupLimit:154010000},
  './standalone-reminders.native':{snapshotStandaloneRemindersForBackup:async()=>reminders},
  './eng-stream-v4':{
   writeEngStreamV4:async(s,r,read,hash,writer)=>{await writer.write(new Uint8Array([1]));return {size:100,snapshot:s};},
   openEngStreamCompatible:async()=>{if(verifyFails)throw Error('checksum failed');return {size:100,headerHash:'digest',source:'Full v4',reminders};}
  },
  'expo-sharing':{isAvailableAsync:async()=>sharingAvailable,shareAsync:async()=>{shares++;if(shareFails)throw Error('provider unavailable');}}
 };
 const module={exports:{}};
 vm.runInNewContext(compiled,{exports:module.exports,module,require:id=>mocks[id]??{},TextEncoder,Date,Error,Promise});
 return {files,api:module.exports,shares:()=>shares,deletes:()=>deletes,run:()=>module.exports.writeEngBackup({snapshot,read:async()=>new Uint8Array(),hash:async()=>'digest'})};
}
test('verified iOS archive survives unavailable sharing',async()=>{
 const x=setup({sharingAvailable:false});
 await assert.rejects(x.run(),/verified backup is kept privately on this device/i);
 assert.equal(x.files[0].exists,true);
});
test('verified iOS archive survives share provider rejection',async()=>{
 const x=setup({shareFails:true});
 await assert.rejects(x.run(),/verified backup is kept privately on this device/i);
 assert.equal(x.files[0].exists,true);
});
test('failed iOS archive verification removes incomplete file',async()=>{
 const x=setup({verifyFails:true});
 await assert.rejects(x.run(),/checksum failed/);
 assert.equal(x.files[0].exists,false);
});
test('resolved share sheet keeps archive without claiming external save',async()=>{
 const x=setup();
 const message=await x.run();
 assert.equal(x.files[0].exists,true);
 assert.match(message,/confirm it exists/);
});

const older='CasitaDex-full-2026-11-13T10-00-00-000Z.cdxe';
const newer='CasitaDex-full-2026-11-14T10-00-00-000Z.cdxe';
test('retained listing only exposes named archives, newest first',async()=>{
 const x=setup({names:[older,'casitadex-development-v1.db','../'+newer,newer,'other.cdxe']});
 assert.deepEqual(Array.from(await x.api.listRetainedEngBackups()),[newer,older]);
});
test('unknown or traversal names cannot be shared',async()=>{
 const x=setup({names:[newer]});
 await assert.rejects(x.api.shareRetainedEngBackup('../'+newer),/unavailable/);
 assert.equal(x.shares(),0);assert.equal(x.files.length,0);
});
test('corrupt retained archive is not handed to share provider',async()=>{
 const x=setup({names:[newer],verifyFails:true});
 await assert.rejects(x.api.shareRetainedEngBackup(newer),/checksum/);
 assert.equal(x.shares(),0);
});
test('retained archive can be shared again without creating another archive',async()=>{
 const x=setup({names:[newer]});
 assert.match(await x.api.shareRetainedEngBackup(newer),/confirm a separate copy exists/);
 assert.equal(x.shares(),1);assert.equal(x.files.length,1);
});
test('retry failure never deletes retained archive',async()=>{
 const x=setup({names:[newer],shareFails:true});
 await assert.rejects(x.api.shareRetainedEngBackup(newer),/saved backup is kept/);
 assert.equal(x.shares(),1);assert.equal(x.deletes(),0);
});
