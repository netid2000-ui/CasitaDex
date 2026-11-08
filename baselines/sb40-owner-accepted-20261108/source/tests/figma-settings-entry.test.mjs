import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=(p)=>readFileSync(new URL('../src/'+p,import.meta.url),'utf8');
test('Home Settings gear is outside the brand/date header and opens Settings',()=>{
 const home=read('figma-first/FigmaHome.tsx');
 const route=read('app/index.tsx');
 const shell=read('app/_layout.tsx');
 assert.match(home,/accessibilityLabel="Settings"/);
 assert.match(home,/onPress=\{onSettings\}/);
 assert.match(home,/width:44,height:44/);
 assert.match(route,/onSettings=\{\(\)=>router\.push\(["']\/more["']\)\}/);
 assert.doesNotMatch(shell,/accessibilityLabel="Settings"/);
});