import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {resolve} from 'node:path';
const root=resolve(import.meta.dirname,'..');
const read=p=>JSON.parse(readFileSync(resolve(root,p),'utf8').replace(/^\uFEFF/,''));
test('release evidence matrix remains fail closed until every gate has evidence',()=>{
 const matrix=read('docs/design/store-release-evidence.json');
 assert.equal(matrix.schemaVersion,1);
 assert.equal(matrix.releaseAuthorized,false);
 const gates=Object.entries(matrix.gates);
 assert.ok(gates.length>=10);
 for(const [key,gate] of gates){
  assert.ok(['blocked','unverified','passed','not-applicable'].includes(gate.status),key);
  assert.ok(Array.isArray(gate.evidence),key);
  if(gate.status==='passed')assert.ok(gate.evidence.length>0,key);
  for(const file of gate.evidence)assert.ok(existsSync(resolve(root,file)),`${key}: ${file}`);
 }
 assert.ok(gates.some(([,g])=>g.status!=='passed'&&g.status!=='not-applicable'));
});
test('store promotion is prohibited until all mandatory gates pass',()=>{
 const matrix=read('docs/design/store-release-evidence.json');
 const figma=read('docs/design/figma-authority-manifest.json');
 const ready=Object.values(matrix.gates).every(g=>g.status==='passed'||g.status==='not-applicable');
 assert.equal(Boolean(matrix.releaseAuthorized),ready&&Boolean(figma.promotion.allowed));
});
