import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const viewer=readFileSync(new URL('../src/app/photo-viewer.tsx',import.meta.url),'utf8');
const eng=readFileSync(new URL('../src/eng-store.ts',import.meta.url),'utf8');
test('photo removal is explicitly guarded by a cancelable native confirmation',()=>{
 assert.match(viewer,/Alert\.alert\("Remove photo\?"/);
 assert.match(viewer,/\{text:"Cancel",style:"cancel"\}/);
 assert.match(viewer,/\{text:"Remove photo",style:"destructive",onPress:/);
 assert.match(viewer,/if\(\(!memoryId&&\!draftId\)\|\|!current\|\|busy\)return/);
 assert.match(viewer,/disabled=\{busy\}/);
});
test('store refuses removal of the only photo from an answerless memory',()=>{
 assert.match(eng,/m\.mediaIds\.length<=1\)throw Error\("Add a written answer before removing the last photo"\)/);
});
test('multi-photo navigation stays bounded and resets zoom',()=>{
 assert.match(viewer,/index===0/);
 assert.match(viewer,/index===photos\.length-1/);
 assert.match(viewer,/Math\.max\(0,i-1\)/);
 assert.match(viewer,/Math\.min\(photos\.length-1,i\+1\)/);
 assert.equal((viewer.match(/scale\.set\(1\);setIndex/g)||[]).length,2);
});
