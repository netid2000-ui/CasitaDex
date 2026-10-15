import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";
const source=fs.readFileSync(new URL("../src/media-store.native.ts",import.meta.url),"utf8");
const js=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
const files=new Map();
class Directory {constructor(parent,name=""){this.path=(parent.path||parent)+"/"+name}create(){}}
class File {constructor(dir,name){this.path=dir.path+"/"+name}get exists(){return files.has(this.path)}create(){if(this.exists)throw Error("exists");files.set(this.path,new Uint8Array())}write(data){files.set(this.path,data)}async bytes(){return files.get(this.path)}move(to){files.set(to.path,files.get(this.path));files.delete(this.path)}delete(){files.delete(this.path)}}
const mod={exports:{}};vm.runInNewContext(js,{module:mod,exports:mod.exports,require:()=>({File,Directory,Paths:{document:{path:"/private"}}}),Error});
const make=mod.exports.createNativeMediaStore;
test("private staging writes and promotes without changing existing files",async()=>{files.clear();const s=make();const b=Uint8Array.of(1,2,3);await s.writeTemporary("safe",b);assert.deepEqual([...await s.readTemporary("safe")],[1,2,3]);await s.promote("safe","media/safe.png");assert.equal(files.get("/private/casitadex-media-v2/media/safe.png"),b);});
test("rejects path traversal before removal",async()=>{const s=make();await assert.rejects(s.removeUnreferenced("../bad"),/Unsafe/)});
test("refuses replacement of existing destination",async()=>{files.clear();const s=make();await s.writeTemporary("x",Uint8Array.of(1));await s.promote("x","media/x.jpg");await s.writeTemporary("x",Uint8Array.of(2));await assert.rejects(s.promote("x","media/x.jpg"),/exists/)});