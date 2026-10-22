import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import vm from "node:vm";
import ts from "typescript";
import {DatabaseSync} from "node:sqlite";
const load=(n,req)=>{const src=fs.readFileSync(new URL(`../src/${n}.ts`,import.meta.url),"utf8");const js=ts.transpileModule(src,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;const m={exports:{}};vm.runInNewContext(js,{module:m,exports:m.exports,require:req,Set,Number,Error,Object});return m.exports;};
const journal=()=>load("media-journal",()=>load("media-manifest",()=>{}));
const adapter=raw=>{const q={execAsync:async s=>raw.exec(s),runAsync:async(s,...p)=>raw.prepare(s).run(...p),getFirstAsync:async(s,...p)=>raw.prepare(s).get(...p)||null,getAllAsync:async(s,...p)=>raw.prepare(s).all(...p),withExclusiveTransactionAsync:async f=>{raw.exec("BEGIN IMMEDIATE");try{await f(q);raw.exec("COMMIT")}catch(e){raw.exec("ROLLBACK");throw e}}};return q;};
const entry={id:"media1",cardId:"card1",path:"media/media1.png",mime:"image/png",bytes:20,sha256:"a".repeat(64)};
for(const phase of ["pending","promoted"]){
 test(`file-backed journal preserves ${phase} across SQLite close and reopen`,async()=>{
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),"casitadex-journal-"));const dbpath=path.join(dir,"journal.sqlite");
  try{
   const first=new DatabaseSync(dbpath);try{const q=adapter(first);const j=journal();await j.prepareMediaJournal(q);await j.recordMediaOperation(q,entry);if(phase==="promoted")await j.advanceMediaOperation(q,entry.id,"pending","promoted");}finally{first.close();}
   const reopened=new DatabaseSync(dbpath);try{const q=adapter(reopened);const rows=await journal().listIncompleteMedia(q);assert.equal(rows.length,1);assert.equal(rows[0].phase,phase);assert.equal(rows[0].entry.path,entry.path);assert.equal(reopened.prepare("SELECT COUNT(*) AS n FROM media_ops_v2 WHERE phase=?").get("committed").n,0);}finally{reopened.close();}
  }finally{fs.rmSync(dir,{recursive:true,force:true});}
 });
}
