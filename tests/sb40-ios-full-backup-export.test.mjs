import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const source=readFileSync(new URL('../src/eng-runtime.native.ts',import.meta.url),'utf8');
test('iOS full backup uses a native share sheet and never calls Android SAF',()=>{
 const ios=source.indexOf('if(Platform.OS==="ios"){');
 const saf=source.indexOf('FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync()',ios);
 assert.ok(ios>0&&saf>ios,'iOS branch must precede Android storage access');
 const block=source.slice(ios,saf);
 for(const p of ['writeEngStreamV4','openEngStreamCompatible','checked.headerHash','checked.reminders','Sharing.isAvailableAsync','Sharing.shareAsync','share sheet','Paths.document'])
   assert.ok(block.includes(p),'Required iOS verified export behavior: '+p);
 assert.ok(!block.includes('StorageAccessFramework'),'iOS branch must not use Android folder provider');
});
test('Android backup writer retains its verified export and cleanup paths',()=>{
 assert.match(source,/StorageAccessFramework\.createFileAsync/);
 assert.match(source,/await file\.copy\(readback\)/);
 assert.match(source,/openEngStreamCompatible\(reader\(readback\)/);
 assert.match(source,/Full v4 backup saved and verified/);
});

test('iOS exports remain private and never expose the app database through Files sharing',()=>{
 const config=readFileSync(new URL('../app.config.js',import.meta.url),'utf8');
 assert.doesNotMatch(config,/UIFileSharingEnabled:\s*true/);
 assert.doesNotMatch(config,/LSSupportsOpeningDocumentsInPlace:\s*true/);
 assert.match(source,/new File\(Paths\.document,iosName\)/);
});
