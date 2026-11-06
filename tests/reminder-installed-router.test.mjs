import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { reminderResponseRoute } from '../src/reminder-response-routing.ts';
import { reminderNotificationTarget } from '../src/reminder-notification-target.ts';

// Execute the installed implementation, not a hand-written decode approximation.
// Only React context/preview access is mocked so the real hook can run in Node.
const require=createRequire(import.meta.url);
const {resolveHref}=require('../node_modules/expo-router/build/link/href.js');
const {parseQueryParams}=require('../node_modules/expo-router/build/fork/getStateFromPath-forks.js');
const hookSource=readFileSync(new URL('../node_modules/expo-router/build/hooks/useLocalSearchParams.js',import.meta.url),'utf8');
function localParams(route) {
 const parsed=parseQueryParams(resolveHref(route),{name:route.pathname.slice(1)});
 const module={exports:{}};
 const deps={
  react:{use:()=>parsed},
  '../Route':{LocalRouteParamsContext:{}},
  '../link/preview/PreviewRouteContext':{usePreviewInfo:()=>({})},
 };
 vm.runInNewContext(hookSource,{module,exports:module.exports,require:name=>{assert.ok(name in deps,name);return deps[name];}});
 return module.exports.useLocalSearchParams();
}
const fixture='sb120-background-literal%2F-ñ-1793926445718';
test('reproduces native failure: raw params lose a literal percent escape in installed Router hook',()=>{
 assert.equal(localParams({pathname:'/reminders',params:{reminder:fixture}}).reminder,fixture.replace('%2F','/'));
});
for(const kind of ['memory','standalone']) test(`${kind} response survives installed resolver, query parser and local-params hook exactly`,()=>{
 for(const id of [fixture,'literal%20value','literal%252Fvalue','literal%25','slash/real','a?b#c&d+e','café 日本 🏠','%','%GG','%E0%A4%A','r_simple','x'.repeat(512)]) {
  const route=reminderResponseRoute({token:'tap',kind,sourceId:id});
  assert.ok(route);
  const params=localParams(route);
  const actual=kind==='memory'?params.id:reminderNotificationTarget(params.reminder);
  assert.equal(actual,id,`${kind}: ${id}`);
 }
});
test('percent and slash identities cannot collide after installed router processing',()=>{
 for(const kind of ['memory','standalone']) {
  const ids=['a%2Fb','a/b','a%252Fb','a%20b','a b'];
  const values=ids.map(sourceId=>{
   const params=localParams(reminderResponseRoute({token:'tap',kind,sourceId}));
   return kind==='memory'?params.id:params.reminder;
  });
  assert.deepEqual(values,ids);assert.equal(new Set(values).size,ids.length);
 }
});
test('invalid Unicode source cannot crash native response processing',()=>{
 assert.equal(reminderResponseRoute({token:'tap',kind:'standalone',sourceId:'\ud800'}),null);
});
