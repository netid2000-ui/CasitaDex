import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
const cache=new Map();
function load(name){if(cache.has(name))return cache.get(name);const src=fs.readFileSync(new URL(`../src/${name}.ts`,import.meta.url),'utf8');const js=ts.transpileModule(src,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;const m={exports:{}};vm.runInNewContext(js,{module:m,exports:m.exports,require:path=>path==='./model'?{parseData:s=>{const v=JSON.parse(s);if(v.version!==1||v.media.length)throw Error('Invalid text');return v}}:load(path.replace('./','')),TextEncoder,TextDecoder,Uint8Array,DataView,Map,Set,Error,Number,Object,JSON,Promise});cache.set(name,m.exports);return m.exports}
const api=load('media-portable-container');
const bytes=Uint8Array.from([137,80,78,71,13,10,26,10,1]);
const text=JSON.stringify({version:1,spaces:[{id:'home',name:'My Home'}],cards:[{id:'card'}],media:[]});
const item={id:'m1',cardId:'card',mime:'image/png',path:'media/m1.png',bytes:bytes.length,sha256:'a'.repeat(64)};
const hash=async()=> 'a'.repeat(64);
test('v2 portable container roundtrip verifies all media before restore',async()=>{const bin=await api.createPortableMediaContainer(text,{version:2,media:[item]},async()=>bytes,hash);const opened=await api.preflightPortableMediaContainer(bin,hash);assert.equal(opened.preview.manifest.media.length,1);assert.deepEqual([...await opened.readEntry(item.path)],[...bytes])});
test('rejects truncated container and unexpected trailing data',async()=>{const bin=await api.createPortableMediaContainer(text,{version:2,media:[item]},async()=>bytes,hash);assert.throws(()=>api.openPortableMediaContainer(bin.slice(0,-1)),/Truncated/);const extended=new Uint8Array(bin.length+1);extended.set(bin);assert.throws(()=>api.openPortableMediaContainer(extended),/Trailing/)});
test('rejects modified image digest',async()=>{const bin=await api.createPortableMediaContainer(text,{version:2,media:[item]},async()=>bytes,hash);const bad=bin.slice();bad[bad.length-1]^=1;await assert.rejects(api.preflightPortableMediaContainer(bad,async()=> 'b'.repeat(64)),/SHA-256 mismatch/)});
