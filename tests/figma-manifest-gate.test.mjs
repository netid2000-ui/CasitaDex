import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {resolve} from 'node:path';
const root=resolve(import.meta.dirname,'..');
const manifest=JSON.parse(readFileSync(resolve(root,'docs/design/figma-authority-manifest.json'),'utf8'));
test('Figma authority manifest is explicitly fail-closed',()=>{
 assert.equal(manifest.schemaVersion,1);
 assert.equal(manifest.status,'owner-approved-current-baseline-revisable');
 assert.equal(manifest.promotion.allowed,false);
 assert.ok(manifest.promotion.reason);
});
test('both platform screen mappings and brand authority are explicit',()=>{
 for(const platform of ['ios','android']){
  assert.equal(manifest.platforms[platform].status,'owner-approved-current-baseline-revisable');
  for(const page of ['home','memories','photos','reminders','find'])assert.match(manifest.platforms[platform].screens[page],/^\d+:\d+$/);
 }
 for(const asset of ['fullLight','fullDark','iconLight'])assert.match(manifest.brandAuthority[asset],/^\d+:\d+$/);
});
test('all provisional components reject legacy presentation imports',()=>{
 for(const name of readdirSync(resolve(root,'src/figma-first')).filter(x=>/\.(tsx|ts)$/.test(x))){
  const code=readFileSync(resolve(root,'src/figma-first',name),'utf8');
  assert.doesNotMatch(code,/from\s*['"](?:\.\.\/)*(?:eng-screens|screens|ui|theme)(?:['"\/]|$)/,name);
 }
});
