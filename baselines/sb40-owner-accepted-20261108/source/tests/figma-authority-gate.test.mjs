import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {resolve} from 'node:path';
const root=resolve(import.meta.dirname,'..');
const read=p=>readFileSync(resolve(root,p),'utf8');
test('clean Figma-first implementation remains isolated from legacy routes',()=>{
 const code=read('src/figma-first/HomeActionCard.tsx')+read('src/figma-first/PrimaryCta.tsx');
 assert.doesNotMatch(code,/from\s*['\x22][^'\x22]*(?:eng-screens|screens|\/ui|\/theme|accepted-navigation-icon)/);
 assert.ok(existsSync(resolve(root,'src/figma-first/tokens.ts')));
});
test('Figma source authority and candidate state remain explicit',()=>{
 const gate=read('docs/design/SB29_FIGMA_FOUNDATION_VALIDATION_20261023.md');
 assert.match(gate,/NOT connected to active routes/);
 assert.match(gate,/not a finished component library/);
});
