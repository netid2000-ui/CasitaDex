import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const source=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
test('integration runtime never adopts unconditional QA enablement',()=>{
 const s=source('src/eng-runtime.native.ts');
 assert.match(s,/const environment=Constants\.expoConfig\?\.extra\?\.appEnvironment\|\|"development"/);
 assert.match(s,/engEnabled=environment==="development"/);
 assert.doesNotMatch(s,/engEnabled=true/);
});
test('integration configuration retains unique development and staging identities and production lock',()=>{
 const s=source('app.config.js');
 assert.match(s,/Production configuration is intentionally unavailable/);
 assert.match(s,/env === "development" \? "dev" : "staging"/);
 assert.match(s,/productionAuthorized: false/);
});
test('existing unfinished draft remains recoverable and requires an explicit discard decision',()=>{
 const home=source('src/app/index.tsx');
 assert.match(home,/draftPending=\{!!snapshot\?\.draft\}/);
 assert.match(home,/Resume draft/);
 assert.match(home,/Discard draft and start new/);
 const screens=source('src/eng-screens.tsx');
 assert.match(screens,/current\.current=e\.snapshot\.draft;setForm\(e\.snapshot\.draft\);setMode\("edit"\)/);
 assert.doesNotMatch(screens,/mode==="resume"/);
});
