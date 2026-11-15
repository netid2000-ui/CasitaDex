import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
test('iOS queues changed status while Android retains live-region ownership',()=>{
 const source=fs.readFileSync(new URL('../src/use-status-announcement.ts',import.meta.url),'utf8');
 const code=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
 for(const os of ['ios','android']){
  const calls=[];let previous;
  const mocks={react:{useEffect:(effect,deps)=>{if(previous!==deps[0]){previous=deps[0];effect();}}},'react-native':{Platform:{OS:os},AccessibilityInfo:{announceForAccessibilityWithOptions:(text,options)=>calls.push([text,options.queue])}}};
  const module={exports:{}};vm.runInNewContext(code,{module,exports:module.exports,require:id=>mocks[id]});
  for(const text of ['', 'Saved on this device.', 'Saved on this device.', ' ', 'Could not save.'])module.exports.useStatusAnnouncement(text);
  assert.deepEqual(calls,os==='ios'?[['Saved on this device.',true],['Could not save.',true]]:[]);
 }
});
