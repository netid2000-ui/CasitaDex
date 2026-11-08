import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const route = readFileSync(new URL('../src/app/answers.tsx', import.meta.url),'utf8');
const component = readFileSync(new URL('../src/figma-first/FigmaFind.tsx', import.meta.url),'utf8');
test('Find handles result presses with search keyboard active',()=>{
  assert.match(route,/keyboardShouldPersistTaps=["']handled["']/);
  assert.match(component,/onPress=\{\(\)=>onOpen\(m\.id\)\}/);
 });test('Find retains a separate query for each lifecycle when returning to results',()=>{
  assert.match(route,/context=readFindContext\(lifecycle\)/);
  assert.match(route,/useState\(preservedFindQuery\)/);
  assert.match(route,/saveFindContext\(lifecycle,\{y:0,query:value,page:0\}\)/);
  assert.match(route,/setQuery\(context\.query\)/);
  assert.match(route,/onQueryChange=\{updateQuery\}/);
});
