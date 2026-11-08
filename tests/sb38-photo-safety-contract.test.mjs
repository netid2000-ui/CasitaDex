import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const viewer=readFileSync(new URL('../src/photo-memory-viewer.tsx',import.meta.url),'utf8');
const eng=readFileSync(new URL('../src/eng-store.ts',import.meta.url),'utf8');
test('shared photo removal requires an editable owner and a cancelable confirmation',()=>{
 assert.match(viewer,/Alert\.alert\('Remove photo\?'/);
 assert.match(viewer,/text:'Cancel',style:'cancel'/);
 assert.match(viewer,/text:'Remove photo',style:'destructive',onPress:/);
 assert.match(viewer,/if\(!current\|\|!editable\|\|busy\)return/);
 assert.match(viewer,/disabled=\{busy\}/);
});
test('store refuses removal of the only photo from an answerless memory',()=>{
 assert.match(eng,/m\.mediaIds\.length<=1\)throw Error\("Add a written answer before removing the last photo"\)/);
});
test('shared multi-photo navigation stays bounded and resets zoom',()=>{
 assert.match(viewer,/disabled=\{busy\|\|index<=0\}/);
 assert.match(viewer,/disabled=\{busy\|\|index>=photos\.length-1\}/);
 assert.match(viewer,/choose\(photos\[index-1\]\.id\)/);
 assert.match(viewer,/choose\(photos\[index\+1\]\.id\)/);
 assert.match(viewer,/function choose\(id:string\)\{resetZoom\(\)/);
});
