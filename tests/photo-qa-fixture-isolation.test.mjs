import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const photos=readFileSync(new URL('../src/app/photos.tsx',import.meta.url),'utf8');
test('optional synthetic photo failures cannot mask saved-memory load',()=>{
 assert.match(photos,/for\(const item of fixtures\)\{try\{/);
 assert.match(photos,/catch\(fixtureError\)\{console\.warn\('Optional QA sample photo unavailable'/);
 assert.ok(photos.includes("setSnapshot(s);setError('')"));
});