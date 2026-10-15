import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";
const load=(n,req)=>{const source=fs.readFileSync(new URL(`../src/${n}.ts`,import.meta.url),"utf8");const code=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;const m={exports:{}};vm.runInNewContext(code,{module:m,exports:m.exports,require:req,Set,Number,Error,Object,Uint8Array});return m.exports;};
const manifest=load("media-manifest",()=>{});
const integrity=load("media-integrity",()=>{});
const api=load("media-backup-v2",name=>name==="./model"?{parseData:raw=>{const value=JSON.parse(raw);if(value.version!==1 || value.media?.length)throw Error("Invalid text data");return value;}}:name==="./media-integrity"?integrity:manifest);
const text=JSON.stringify({version:1,spaces:[{id:"home",name:"Home"}],cards:[{id:"c1"}],media:[]});
const item={id:"a",cardId:"c1",path:"media/a.png",mime:"image/png",bytes:21,sha256:"a".repeat(64)};
test("v2 manifest preview counts images without writing data",()=>{const r=api.previewMediaBackup(text,{version:2,media:[item]});assert.equal(r.totalBytes,21);assert.equal(r.manifest.media[0].cardId,"c1")});
test("rejects media referencing absent cards",()=>assert.throws(()=>api.previewMediaBackup(text,{version:2,media:[{...item,cardId:"absent"}]}),/card reference/));
test("rejects unsafe archive entry names",()=>assert.throws(()=>api.previewMediaBackup(text,{version:2,media:[{...item,path:"../escape"}]}),/path/));
test("rejects invalid text before considering manifest",()=>assert.throws(()=>api.previewMediaBackup(JSON.stringify({version:99,media:[]}),{version:2,media:[]}),/text/));

test("validates every media entry before the restore adapter may write",async()=>{
  const bytes=Uint8Array.from([137,80,78,71,13,10,26,10,3]);
  const pre=api.previewMediaBackup(text,{version:2,media:[{...item,bytes:bytes.length}]});
  const visited=[];
  await api.verifyPortableMediaPayload(pre,async path=>{visited.push(path);return bytes;},async()=>"a".repeat(64));
  assert.deepEqual(visited,["media/a.png"]);
});
test("rejects corrupt media before any database mutation",async()=>{
  const bytes=Uint8Array.from([137,80,78,71,13,10,26,10,3]);
  const pre=api.previewMediaBackup(text,{version:2,media:[{...item,bytes:bytes.length}]});
  await assert.rejects(()=>api.verifyPortableMediaPayload(pre,async()=>bytes,async()=>"b".repeat(64)),/SHA-256 mismatch/);
  await assert.rejects(()=>api.verifyPortableMediaPayload(pre,async()=>Uint8Array.of(1,2,3),async()=>"a".repeat(64)),/byte count mismatch/);
  await assert.rejects(()=>api.verifyPortableMediaPayload(pre,async()=>{throw Error("Missing image");},async()=>"a".repeat(64)),/Missing image/);
});

