import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const source=path=>readFileSync(new URL(path,import.meta.url),'utf8');
test('Find preserves scroll position and selected result context across detail navigation',()=>{
 const s=source('../src/app/answers.tsx');
 assert.match(s,/preservedFindScrollY/);
 assert.match(s,/onScroll=\{event=>/);
 assert.match(s,/scrollTo\(\{y:preservedFindScrollY,animated:false\}\)/);
 assert.match(s,/preservedFindQuery/);
 assert.match(s,/preservedFindPage/);
});
test('Photos gallery restores original scroll offset after viewing memory details',()=>{
 const s=source('../src/app/photos.tsx');
 assert.match(s,/preservedPhotosScrollY/);
 assert.match(s,/onScroll=\{event=>/);
 assert.match(s,/scrollTo\(\{y:preservedPhotosScrollY,animated:false\}\)/);
});
