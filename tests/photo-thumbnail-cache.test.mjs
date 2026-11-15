import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";
import {createHash} from "node:crypto";
function harness(space=100_000_000){
 const records=new Map([["original/photo.jpg",{size:9_000_000,time:1}]]);let generated=0;const actions=[];
 const path=(...parts)=>parts.map(p=>typeof p==="string"?p:p.uri).join("/");
 class File {constructor(...p){this.uri=path(...p);}get exists(){return records.has(this.uri);}get size(){return records.get(this.uri)?.size??0;}get modificationTime(){return records.get(this.uri)?.time??0;}async copy(to){await new Promise(resolve=>setImmediate(resolve));assert.ok(records.has(this.uri),"Source retained until async copy finishes");records.set(to.uri,{...records.get(this.uri)});}delete(){records.delete(this.uri);}}
 class Directory {constructor(...p){this.uri=path(...p);}get exists(){return true;}create(){}list(){return [...records.keys()].filter(p=>p.startsWith(this.uri+"/")).map(p=>new File(p));}}
 const mocks={"expo-file-system":{Directory,File,Paths:{cache:"cache"}},"react-native":{Image:{getSize:(_uri,ok)=>ok(4000,6000)}},"expo-image-manipulator":{SaveFormat:{JPEG:"jpeg"},manipulateAsync:async(uri,a)=>{generated++;actions.push(a);const name="temporary/"+generated+".jpg";records.set(name,{size:30_000,time:Date.now()});return {uri:name};}},"expo-crypto":{CryptoDigestAlgorithm:{SHA256:"sha256"},digestStringAsync:async(_,uri)=>createHash("sha256").update(uri).digest("hex")},"./storage-space.native":{usableNativeSpace:async()=>space}};
 const source=fs.readFileSync(new URL("../src/photo-thumbnail.native.ts",import.meta.url),"utf8");
 const js=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
 const module={exports:{}};vm.runInNewContext(js,{module,exports:module.exports,require:name=>mocks[name],Map,Promise,Error});
 return {api:module.exports,records,actions,generated:()=>generated};
}
test("thumbnail generation coalesces requests, bounds dimensions and retains the original",async()=>{
 const h=harness();const [a,b]=await Promise.all([h.api.photoThumbnail("original/photo.jpg"),h.api.photoThumbnail("original/photo.jpg")]);
 assert.equal(a,b);assert.equal(h.generated(),1);assert.equal(h.records.get("original/photo.jpg").size,9_000_000);
 assert.equal(h.records.get(a).size,30_000);assert.equal(h.actions[0][0].resize.height,384);
 assert.equal(await h.api.photoThumbnail("original/photo.jpg"),a);assert.equal(h.generated(),1);
 assert.equal(await h.api.thumbnailStorageBytes(),30_000);
 assert.ok(![...h.records.keys()].some(k=>k.startsWith("temporary/")));
});
test("low space refuses disposable thumbnail work without touching originals",async()=>{
 const h=harness(1024);await assert.rejects(h.api.photoThumbnail("original/photo.jpg"),/storage/);
 assert.equal(h.generated(),0);assert.equal(h.records.size,1);
});
test("cache pruning removes only disposable derivatives and retains new preview",async()=>{
 const h=harness();h.records.set("cache/casitadex-thumbnails-v1/old.jpg",{size:64*1024*1024,time:0});
 const uri=await h.api.photoThumbnail("original/photo.jpg");
 assert.ok(!h.records.has("cache/casitadex-thumbnails-v1/old.jpg"));assert.ok(h.records.has(uri));assert.ok(h.records.has("original/photo.jpg"));
});
