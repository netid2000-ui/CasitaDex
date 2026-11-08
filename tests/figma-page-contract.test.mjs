import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(new URL(p,import.meta.url),'utf8');
test('Home omits the reminders list while preserving reminder navigation',()=>{
 const home=read('../src/figma-first/FigmaHome.tsx');
 const entry=read('../src/app/index.tsx');
 assert.doesNotMatch(home,/ReminderPreview|reminders:readonly/);
 assert.doesNotMatch(entry,/listStandaloneReminders|setReminders/);
 assert.match(entry,/kind==='reminder'/);
});
test('Memories index is separate from Find and opens selected memory',()=>{
 const source=read('../src/figma-first/FigmaMemories.tsx');
 assert.match(source,/onOpen:\(id:string\)=>void/);
 assert.match(source,/onPress=\{\(\)=>onOpen\(m.id\)\}/);
 assert.doesNotMatch(source,/eng-screens|\.\.\/screens|saveNativeDraft/);
});
