import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(new URL(p,import.meta.url),'utf8');
test('reminders page exposes add, edit, complete through callbacks only',()=>{
 const s=read('../src/figma-first/FigmaReminders.tsx');
 for(const callback of ['onAdd','onEdit','onComplete'])assert.match(s,new RegExp(callback));
 assert.doesNotMatch(s,/saveStandaloneReminder|deleteStandaloneReminder|completeStandaloneReminder/);
});
test('photo page accepts summaries, not unverified media file paths',()=>{
 const s=read('../src/figma-first/FigmaPhotos.tsx');
 assert.match(s,/PhotoSummary/);
 assert.match(s,/onOpen:\(id:string\)=>void/);
 assert.doesNotMatch(s,/file:\/\/|deleteMedia|unlink|engPhotoUri|getEngStore|expo-file-system/);
});

