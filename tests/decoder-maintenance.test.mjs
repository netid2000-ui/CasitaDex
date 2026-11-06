import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {spawnSync} from 'node:child_process';
const require=createRequire(import.meta.url),root=path.resolve(import.meta.dirname,'..');
const compare=require('./helpers/decoder-differential.cjs');
test('frozen hashed oracle matches installed candidate except explicit single-decode allowlist',()=>assert.equal(compare().checked,3828));
test('differential check rejects an unexpected candidate behavior',()=>{
 const query=require('query-string');assert.throws(()=>compare({...query,parse:()=>({unexpected:true})}),/Unexpected decoder semantic delta/);
});
function fixture(){
 const cache=path.join(root,'node_modules/.cache/decoder-guard-tests');fs.mkdirSync(cache,{recursive:true});const dir=fs.mkdtempSync(cache+'/fixture-');
 fs.mkdirSync(dir+'/scripts');for(const file of ['decoder-interop.cjs','decoder-interop.json'])fs.copyFileSync(root+'/scripts/'+file,dir+'/scripts/'+file);
 for(const name of ['query-string','decode-uri-component']){
  const destination=dir+'/node_modules/'+name;fs.mkdirSync(destination,{recursive:true});for(const file of ['package.json','index.js'])fs.copyFileSync(root+'/node_modules/'+name+'/'+file,destination+'/'+file);
 }
 fs.copyFileSync(root+'/tests/fixtures/decoder-legacy/query-string.cjs',dir+'/node_modules/query-string/index.js');
 fs.copyFileSync(root+'/metro.config.js',dir+'/metro.config.js');
 fs.writeFileSync(dir+'/package.json',JSON.stringify({name:'decoder-guard-test',version:'0.0.0'}));
 return dir;
}
const run=(dir,mode)=>spawnSync(process.execPath,['scripts/decoder-interop.cjs',mode],{cwd:dir,encoding:'utf8',timeout:10000});
test('unapplied guard fails, apply succeeds, reapply is byte-identical',()=>{
 const dir=fixture();const missing=run(dir,'--check');assert.equal(missing.status,1);assert.match(missing.stderr,/bridge missing/);
 assert.equal(run(dir,'--apply').status,0);const before=fs.readFileSync(dir+'/node_modules/query-string/index.js');assert.equal(run(dir,'--apply').status,0);assert.deepEqual(fs.readFileSync(dir+'/node_modules/query-string/index.js'),before);assert.equal(run(dir,'--check').status,0);
});
for(const [name,file,change,pattern] of [
 ['query version','query-string/package.json',s=>s.replace('"7.1.3"','"7.1.4"'),/version drift/],
 ['decoder version','decode-uri-component/package.json',s=>s.replace('"0.5.1"','"0.5.2"'),/version drift/],
 ['query source','query-string/index.js',s=>s+'\n// synthetic drift\n',/query-string source drift/],
 ['decoder source','decode-uri-component/index.js',s=>s+'\n// synthetic drift\n',/decoder source integrity mismatch/],
])test(`${name} drift is rejected without modifying package bytes`,()=>{
 const dir=fixture(),target=dir+'/node_modules/'+file;fs.writeFileSync(target,change(fs.readFileSync(target,'utf8')));const before=fs.readFileSync(target),result=run(dir,'--apply');assert.equal(result.status,1);assert.match(result.stderr,pattern);assert.deepEqual(fs.readFileSync(target),before);
});
test('actual Metro configuration load rejects missing bridge before default config loading',()=>{
 const dir=fixture();const result=spawnSync(process.execPath,['-e',"require('./metro.config.js')"],{cwd:dir,encoding:'utf8',timeout:10000});assert.equal(result.status,1);assert.match(result.stderr,/bridge missing/);
});
test('actual Metro configuration keeps Expo project defaults with installed bridge',()=>{
 const actual=require('../metro.config.js');assert.equal(actual.projectRoot,root);assert.ok(actual.resolver);assert.ok(actual.transformer);
});
const {required,summarize}=require('../scripts/decoder-metro-results.cjs');
test('Metro aggregate fails every missing or failed required stage',()=>{
 for(const name of required)for(const exit of [undefined,1])assert.equal(summarize(current=>({exit:current===name?exit:0,log:''})).ok,false,name);
});
test('Metro aggregate marks compiler-only Hermes execution NOT_RUN, not PASS',()=>{
 const summary=summarize(name=>name.startsWith('hermes-exec-')?{exit:1,log:'hermesc does not support -exec.'}:{exit:0,log:''});assert.equal(summary.ok,true);assert.equal(summary.nativeRuntimeAccepted,false);assert.equal(summary.stages.filter(s=>s.status==='NOT_RUN').length,2);
});
test('Metro aggregate fails unexpected Hermes execution failures',()=>{
 assert.equal(summarize(name=>({exit:name==='hermes-exec-ios'?1:0,log:'Unexpected runtime assertion failure'})).ok,false);
});

test('Metro status parser rejects empty or malformed exit files',()=>{
 const {parseExit}=require('../scripts/decoder-metro-results.cjs');
 for(const text of ['', ' ', 'success', '0 trailing', '0\n1'])assert.equal(parseExit(text),null);
 assert.equal(parseExit('0\n'),0);assert.equal(parseExit('1'),1);
});
test('actual Metro disk reader fails empty whitespace and invalid exit files',()=>{
 const base=path.join(root,'node_modules/.cache/decoder-guard-tests');fs.mkdirSync(base,{recursive:true});const dir=fs.mkdtempSync(base+'/disk-results-');
 for(const name of [...required,'hermes-exec-ios','hermes-exec-android']){fs.writeFileSync(dir+'/'+name+'.exit','0\n');fs.writeFileSync(dir+'/'+name+'.log','fixture success');}
 const invoke=()=>spawnSync(process.execPath,[root+'/scripts/decoder-metro-results.cjs',dir],{encoding:'utf8',timeout:10000});
 assert.equal(invoke().status,0);
 for(const text of ['', ' \n\t ', 'not-a-number']){
  fs.writeFileSync(dir+'/metro-guard.exit',text);assert.equal(invoke().status,1);
  const summary=JSON.parse(fs.readFileSync(dir+'/metro-summary.json','utf8'));assert.equal(summary.ok,false);assert.equal(summary.stages.find(s=>s.name==='metro-guard').status,'FAIL');
 }
});
