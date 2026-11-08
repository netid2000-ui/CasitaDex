import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(new URL(p,import.meta.url),'utf8').replace(/^\uFEFF/,'');
test('publication standard defines store gates and evidence',()=>{
 const doc=read('../docs/design/MOBILE_STORE_PUBLICATION_STANDARD_20261024.md');
 for(const term of ['Gate 0','Gate 1','Gate 2','Gate 3','Gate 4','Gate 5','Gate 6','Data safety','privacy manifest','owner approval'])assert.ok(doc.toLowerCase().includes(term.toLowerCase()),term);
});
test('store promotion remains blocked while design approval is pending',()=>{
 const gate=JSON.parse(read('../docs/design/figma-authority-manifest.json'));
 assert.equal(gate.promotion.allowed,false);
});
