import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const shared=['src/app/reminders.tsx','src/figma-first/ReminderPreview.tsx','src/figma-first/view-models.ts','src/figma-first/FigmaReminders.tsx'];
test('shared screens resolve platform-specific reminder stores without importing native SQLite on web',()=>{
 for(const path of shared){
  const code=readFileSync(new URL('../'+path,import.meta.url),'utf8');
  assert.match(code,/from ['"]\.\.\/standalone-reminders['"]/);
  assert.doesNotMatch(code,/from ['"]\.\.\/standalone-reminders\.native['"]/);
 }
});
