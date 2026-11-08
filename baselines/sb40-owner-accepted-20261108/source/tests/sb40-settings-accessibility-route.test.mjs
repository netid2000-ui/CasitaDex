import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const settings=read('src/figma-first/FigmaSettings.tsx');
const route=read('src/app/more.tsx');
const manage=read('src/app/settings-manage.tsx');
const legacy=read('src/eng-screens.tsx');
test('Settings exposes all eight approved destination IDs and readable accessibility hints',()=>{
 for(const id of ['storage','backup','recovery','appearance','accessibility','privacy','help','labels'])assert.match(settings,new RegExp("id:'"+id+"'"));
 assert.match(settings,/accessibilityRole="button" accessibilityLabel=\{item\.title\} accessibilityHint=\{item\.description\}/);
 assert.match(settings,/const narrow=width<360\|\|fontScale>=1\.35\|\|large/);
});
test('Settings routes action to native management without dropping action ID',()=>{
 assert.match(route,/pathname:'\/settings-manage',params:\{action\}/);
 assert.match(manage,/initialAction=\{action\}/);
});
test('Appearance and Accessibility lead to implemented preferences controls',()=>{
 assert.match(legacy,/appearance:"preferences",accessibility:"preferences"/);
 assert.match(legacy,/label="Large text" selected=\{preferences\.large\}/);
 assert.match(legacy,/\["System","Light","Dark"\]/);
});
