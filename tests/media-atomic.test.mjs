import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";
import os from "node:os";
import path from "node:path";
import {DatabaseSync} from "node:sqlite";
const load=(n,req)=>{const js=ts.transpileModule(fs.readFileSync(new URL(`../src/${n}.ts`,import.meta.url),"utf8"),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;const m={exports:{}};vm.runInNewContext(js,{module:m,exports:m.exports,require:req,Set,Number,Error,Object});return m.exports};
const validator=load("media-manifest",()=>{});
const media=load("media-sqlite",()=>validator),journal=load("media-journal",()=>validator);
const entry={id:"m1",cardId:"c1",path:"media/m1.png",mime:"image/png",bytes:12,sha256:"a".repeat(64)};
function adapter(raw){const q={execAsync:async s=>raw.exec(s),runAsync:async(s,...p)=>raw.prepare(s).run(...p),getFirstAsync:async(s,...p)=>raw.prepare(s).get(...p)||null,getAllAsync:async(s,...p)=>raw.prepare(s).all(...p),withExclusiveTransactionAsync:async f=>{raw.exec("BEGIN IMMEDIATE");try{await f(q);raw.exec("COMMIT")}catch(e){raw.exec("ROLLBACK");throw e}}};return q;}
async function setup(){const dir=fs.mkdtempSync(path.join(os.tmpdir(),"casitadex-media-"));const file=path.join(dir,"test.db");const raw=new DatabaseSync(file);raw.exec("PRAGMA foreign_keys=ON; CREATE TABLE cards (id TEXT PRIMARY KEY); INSERT INTO cards VALUES ('c1')");const db=adapter(raw);await media.prepareMediaTable(db);await journal.prepareMediaJournal(db);await journal.recordMediaOperation(db,entry);await journal.advanceMediaOperation(db,"m1","pending","promoted");return {dir,file,raw,db};}
test("atomic commit survives close and reopen",async()=>{const v=await setup();try{await media.commitMediaWithJournal(v.db,entry);v.raw.close();const r=new DatabaseSync(v.file);assert.equal(r.prepare("SELECT count(*) AS n FROM media_v2").get().n,1);assert.equal(r.prepare("SELECT phase FROM media_ops_v2").get().phase,"committed");r.close()}finally{fs.rmSync(v.dir,{recursive:true,force:true})}});
test("failed media insert leaves promoted journal on disk",async()=>{const v=await setup();try{v.raw.exec("CREATE TRIGGER fail_media BEFORE INSERT ON media_v2 BEGIN SELECT RAISE(FAIL,'injected failure'); END;");await assert.rejects(media.commitMediaWithJournal(v.db,entry));v.raw.close();const r=new DatabaseSync(v.file);assert.equal(r.prepare("SELECT count(*) AS n FROM media_v2").get().n,0);assert.equal(r.prepare("SELECT phase FROM media_ops_v2").get().phase,"promoted");r.close()}finally{fs.rmSync(v.dir,{recursive:true,force:true})}});