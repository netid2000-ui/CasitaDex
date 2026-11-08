import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
test('SB39 release security triage names URI decoding and schema validation as open release gates',()=>{
 const triage=read('docs/security/SB39_DEPENDENCY_TRIAGE_2026-10-27.md');
 for(const finding of ['GHSA-vcc3-ghjq-m6fr','GHSA-mrhx-c7xc-m3w5','RELEASE BLOCKED','native JavaScript bundle'])assert.ok(triage.includes(finding),finding);
});
test('production deployment and environment remain unavailable during source integration',()=>{
 const config=read('app.config.js');
 assert.match(config,/productionAuthorized: false/);
 assert.match(config,/Production configuration is intentionally unavailable/);
});
