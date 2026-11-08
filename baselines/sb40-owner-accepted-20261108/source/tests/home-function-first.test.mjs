import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(new URL(p,import.meta.url),'utf8');
test('Home presents one prominent Find action without an orphaned duplicate',()=>{
 const home=read('../src/app/index.tsx');
 const figma=read('../src/figma-first/FigmaHome.tsx');
 assert.match(figma,/accessibilityLabel="Find a memory"/);
 assert.doesNotMatch(home,/>Find a memory<\/Text>/);
 assert.match(home,/onFind=\{\(\)=>router.push\("\/answers"\)\}/);
});
test('Home never classifies loading snapshot as a draft',()=>{
 const home=read('../src/app/index.tsx');
 const actions=read('../src/figma-first/view-models.ts');
 assert.match(home,/draftPending=\{!!snapshot\?\.draft\}/);
 assert.match(actions,/kind:"memory",disabled:false/);
 assert.match(actions,/kind:"photo",disabled:false/);
});