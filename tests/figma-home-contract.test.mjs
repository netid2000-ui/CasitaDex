import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(new URL(p,import.meta.url),'utf8');
test('Home remains command-only without recent memory feed',()=>{
 const home=read('../src/figma-first/FigmaHome.tsx');
 assert.match(home,/homeActions\(draftPending\)/);
 assert.doesNotMatch(home,/recentMemories|homeMemories|Recent memories/);
});
test('Reminder preview uses typed read-only projection and max two due items',()=>{
 const component=read('../src/figma-first/ReminderPreview.tsx');
 const model=read('../src/figma-first/view-models.ts');
 assert.match(component,/dueReminders\(reminders,today\)/);
 assert.match(model,/\.slice\(0,2\)/);
 assert.doesNotMatch(component,/saveStandaloneReminder|deleteStandaloneReminder|completeStandaloneReminder/);
});

test('Home commands render approved navigation glyph assets instead of letter placeholders',()=>{
 const source=read('../src/figma-first/HomeActionCard.tsx');
 for(const asset of ['memories.png','photos.png','reminders.png']){
  assert.match(source,new RegExp('figma-approved-v1/'+asset.replace('.','\\.') ));
 }
 assert.match(source,/Image source=\{icons\[kind\]\}/);
 assert.doesNotMatch(source,/symbol:"[+PR]"/);
 assert.match(source,/accessibilityLabel=\{action.title\}/);
});
test('Figma-first Home never exposes an unfinished draft card or delete control',()=>{
 const home=read('../src/figma-first/FigmaHome.tsx');
 const entry=read('../src/app/index.tsx');
 assert.doesNotMatch(home,/Unfinished Memory|Resume Draft|Delete Draft|draft\.title/);
 assert.match(entry,/const draft=snapshot\?\.draft/);
 assert.match(entry,/Resume draft/);
 assert.match(entry,/Discard draft and start new/);
});

test('Home keeps reminder creation but has no reminder feed',()=>{const home=read('../src/figma-first/FigmaHome.tsx');assert.doesNotMatch(home,/ReminderPreview|dueReminders/);assert.match(home,/homeActions\(draftPending\)/);});
