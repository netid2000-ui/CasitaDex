import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const route = readFileSync(new URL('../src/app/answers.tsx', import.meta.url),'utf8');
const component = readFileSync(new URL('../src/figma-first/FigmaFind.tsx', import.meta.url),'utf8');
test('Find handles result presses with search keyboard active',()=>{
  assert.match(route,/keyboardShouldPersistTaps=["']handled["']/);
  assert.match(component,/onPress=\{\(\)=>onOpen\(m\.id\)\}/);
});test('Find retains query when Back to Results remounts the route',()=>{
  assert.match(route,/let preservedFindQuery\s*=\s*['\"]{2};/);
  assert.match(route,/useState\(preservedFindQuery\)/);
  assert.match(route,/preservedFindQuery=value;setQuery\(value\)/);
  assert.match(route,/onQueryChange=\{updateQuery\}/);
});