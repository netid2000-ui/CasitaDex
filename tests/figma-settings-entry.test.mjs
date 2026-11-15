import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=(p)=>readFileSync(new URL('../src/'+p,import.meta.url),'utf8');
test('Home Settings action stays in the approved fixed header and opens Settings',()=>{
 const shell=read('app/_layout.tsx');
 assert.match(shell,/accessibilityLabel="Settings"/);
 assert.match(shell,/router.navigate\("\/more"\)/);
 assert.match(shell,/Primary navigation/);
});
