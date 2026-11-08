import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
const modules=new Map();
function load(name){if(modules.has(name))return modules.get(name);const raw=fs.readFileSync(new URL(`../src/${name}.ts`,import.meta.url),'utf8');const js=ts.transpileModule(raw,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;const m={exports:{}};vm.runInNewContext(js,{module:m,exports:m.exports,require:id=>id==='./model'?{parseData:s=>{const data=JSON.parse(s);if(data.version!==1||data.media.length)throw Error('Invalid text');return data}}:load(id.replace('./','')),TextEncoder,TextDecoder,Uint8Array,DataView,Map,Set,Error,Number,Object,JSON,Promise});modules.set(name,m.exports);return m.exports}
const codec=load('media-portable-container'),gate=load('media-restore-gate');
const bytes=Uint8Array.from([137,80,78,71,13,10,26,10,1]);
const data=JSON.stringify({version:1,spaces:[{id:'home',name:'My Home'}],cards:[{id:'c1'}],media:[]});
const manifest={version:2,media:[{id:'m1',cardId:'c1',path:'media/m1.png',mime:'image/png',bytes:bytes.length,sha256:'a'.repeat(64)}]};
const good=async()=> 'a'.repeat(64);
test('verified restore gate calls apply only after all images pass',async()=>{const raw=await codec.createPortableMediaContainer(data,manifest,async()=>bytes,good);let applied=0;await gate.restoreVerifiedMediaContainer(raw,good,async value=>{applied++;assert.equal(value.text.cards[0].id,'c1');assert.equal((await value.readEntry('media/m1.png')).length,9)});assert.equal(applied,1)});
test('corrupt hash blocks all mutations',async()=>{const raw=await codec.createPortableMediaContainer(data,manifest,async()=>bytes,good);let applied=0;await assert.rejects(gate.restoreVerifiedMediaContainer(raw,async()=> 'b'.repeat(64),async()=>{applied++}),/SHA-256 mismatch/);assert.equal(applied,0)});
