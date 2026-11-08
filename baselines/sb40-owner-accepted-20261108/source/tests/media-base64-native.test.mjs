import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
const src=fs.readFileSync(new URL('../src/media-transfer.native.ts',import.meta.url),'utf8');
const start=src.indexOf('function base64(bytes:Uint8Array):string {');
const end=src.indexOf('\n}',start)+2;
assert.ok(start>=0 && end>start);
const code=ts.transpileModule('export '+src.slice(start,end),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
const module={exports:{}};vm.runInNewContext(code,{module,exports:module.exports,Uint8Array,Math});
test('native v2 binary export Base64 handles padding and 12K boundaries',()=>{
 for(const size of [0,1,2,3,4,7,12287,12288,12289,24576,50000]){
  const raw=Uint8Array.from({length:size},(_,i)=>i%251);
  assert.equal(module.exports.base64(raw),Buffer.from(raw).toString('base64'),`bytes=${size}`);
 }
});
