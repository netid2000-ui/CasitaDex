import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";
import { DatabaseSync } from "node:sqlite";
const load=(name,req)=>{const src=fs.readFileSync(new URL(`../src/${name}.ts`,import.meta.url),"utf8");const js=ts.transpileModule(src,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;const m={exports:{}};vm.runInNewContext(js,{module:m,exports:m.exports,require:req,Set,Number,Error,Object});return m.exports;};
const manifest=load("media-manifest",()=>{});
const media=load("media-sqlite",()=>manifest);
function db(){const raw=new DatabaseSync(":memory:");raw.exec("PRAGMA foreign_keys=ON; CREATE TABLE cards (id TEXT PRIMARY KEY)");const q={execAsync:async s=>raw.exec(s),runAsync:async(s,...p)=>raw.prepare(s).run(...p),getFirstAsync:async(s,...p)=>raw.prepare(s).get(...p)||null,getAllAsync:async(s,...p)=>raw.prepare(s).all(...p),withExclusiveTransactionAsync:async fn=>{raw.exec("BEGIN IMMEDIATE");try{await fn(q);raw.exec("COMMIT")}catch(e){raw.exec("ROLLBACK");throw e}}};return {raw,q};}
const entry={id:"m1",cardId:"c1",path:"media/m1.png",mime:"image/png",bytes:12,sha256:"a".repeat(64)};
test("media table created without modifying text cards",async()=>{const {raw,q}=db();raw.prepare("INSERT INTO cards VALUES (?)").run("c1");await media.prepareMediaTable(q);await media.attachMedia(q,entry);const results=await media.listAttachedMedia(q,"c1");assert.equal(results[0].path,entry.path);assert.equal(raw.prepare("SELECT count(*) AS n FROM cards").get().n,1);raw.close()});
test("rejects orphan parent and rolls back",async()=>{const {raw,q}=db();await media.prepareMediaTable(q);await assert.rejects(media.attachMedia(q,entry),/Parent card/);assert.equal(raw.prepare("SELECT count(*) AS n FROM media_v2").get().n,0);raw.close()});
test("duplicate file path cannot replace existing attachment",async()=>{const {raw,q}=db();raw.prepare("INSERT INTO cards VALUES (?)").run("c1");await media.prepareMediaTable(q);await media.attachMedia(q,entry);await assert.rejects(media.attachMedia(q,{...entry,id:"m2",path:"media/m1.png"}));assert.equal(raw.prepare("SELECT count(*) AS n FROM media_v2").get().n,1);raw.close()});
test("invalid manifest cannot write metadata",async()=>{const {raw,q}=db();raw.prepare("INSERT INTO cards VALUES (?)").run("c1");await media.prepareMediaTable(q);await assert.rejects(media.attachMedia(q,{...entry,path:"../secret"}));assert.equal(raw.prepare("SELECT count(*) AS n FROM media_v2").get().n,0);raw.close()});