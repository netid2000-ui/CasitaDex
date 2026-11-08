import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import {DatabaseSync} from 'node:sqlite';
const digest='a'.repeat(64);
const png=Uint8Array.from([137,80,78,71,13,10,26,10,1]);
const card=id=>({id,spaceId:'home',title:id,answer:id,location:'',notes:'',context:'Buy',confidence:'Unknown',source:'',history:[]});
const text=id=>JSON.stringify({version:1,spaces:[{id:'home',name:'My Home'}],cards:[card(id)],media:[]});
const original=text('c1');
const model={parseData:JSON.parse,exportData:JSON.stringify};
let db;
const stubs={
 'expo-document-picker':{}, 'expo-file-system/legacy':{},'expo-file-system':{File:class{}},
 './model':model,'./media-hash.native':{sha256Media:async()=>digest},
 './media-attachment.native':{mediaDatabase:async()=>db,mediaFileByPath:()=>({bytes:async()=>png})},
 './media-sqlite':{prepareMediaTable:async()=>{}},
 './media-store.native':{createNativeMediaStore:()=>({})},
 './media-staging':{stageMedia:async()=>{}},
 './media-journal':{
  prepareMediaJournal:async()=>{},
  recordMediaOperation:async(d,e)=>d.runAsync('INSERT INTO media_ops_v2(id,relative_path,sha256,phase) VALUES(?,?,?,?)',e.id,e.path,e.sha256,'pending'),
  advanceMediaOperation:async(d,id,from,to)=>d.runAsync('UPDATE media_ops_v2 SET phase=? WHERE id=? AND phase=?',to,id,from)
 }
};
const loaded=new Map();
function load(name){if(loaded.has(name))return loaded.get(name);const source=fs.readFileSync(new URL(`../src/${name}.ts`,import.meta.url),'utf8');const js=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;const m={exports:{}};vm.runInNewContext(js,{module:m,exports:m.exports,require:path=>stubs[path]??load(path.replace('./','')),Uint8Array,TextEncoder,TextDecoder,DataView,Map,Set,Error,Object,Number,JSON,Promise,Date,Math,btoa});loaded.set(name,m.exports);return m.exports}
function makeDb(){
 const raw=new DatabaseSync(':memory:');
 raw.exec(`PRAGMA foreign_keys=ON;
 CREATE TABLE metadata(key TEXT PRIMARY KEY,value TEXT);
 CREATE TABLE spaces(id TEXT PRIMARY KEY,name TEXT,position INTEGER);
 CREATE TABLE cards(id TEXT PRIMARY KEY,space_id TEXT REFERENCES spaces(id),position INTEGER,payload TEXT);
 CREATE TABLE media_v2(id TEXT PRIMARY KEY,card_id TEXT REFERENCES cards(id) ON DELETE RESTRICT,relative_path TEXT,mime TEXT,byte_count INTEGER,sha256 TEXT);
 CREATE TABLE media_ops_v2(id TEXT PRIMARY KEY,relative_path TEXT,sha256 TEXT,phase TEXT);
 INSERT INTO spaces VALUES('home','My Home',0);`);
 raw.prepare('INSERT INTO cards VALUES(?,?,?,?)').run('c1','home',0,JSON.stringify(card('c1')));
 const q={execAsync:async s=>raw.exec(s),runAsync:async(s,...p)=>raw.prepare(s).run(...p),getFirstAsync:async(s,...p)=>raw.prepare(s).get(...p)||null,getAllAsync:async(s,...p)=>raw.prepare(s).all(...p),withExclusiveTransactionAsync:async fn=>{raw.exec('BEGIN IMMEDIATE');try{await fn(q);raw.exec('COMMIT')}catch(e){raw.exec('ROLLBACK');throw e}}};
 return {raw,q};
}
test('media restore SQL failure rolls back cards and recovery, followed by successful recovery',async()=>{
 const fixture=makeDb();db=fixture.q;
 const container=load('media-portable-container'),transfer=load('media-transfer.native');
 const manifest={version:2,media:[{id:'img',cardId:'c2',path:'media/img.png',mime:'image/png',bytes:png.length,sha256:digest}]};
 const blob=await container.createPortableMediaContainer(text('c2'),manifest,async()=>png,async()=>digest);
 try{
  fixture.raw.exec("CREATE TRIGGER inject_fail BEFORE INSERT ON cards WHEN NEW.id='c2' BEGIN SELECT RAISE(FAIL,'injected media restore failure'); END;");
  await assert.rejects(()=>transfer.restoreMediaBackup('staging',blob),/injected media restore failure/);
  assert.equal(fixture.raw.prepare('SELECT id FROM cards').get().id,'c1');
  assert.equal(fixture.raw.prepare('SELECT count(*) AS n FROM media_v2').get().n,0);
  assert.equal(fixture.raw.prepare("SELECT count(*) AS n FROM metadata WHERE key='recovery'").get().n,0);
  fixture.raw.exec('DROP TRIGGER inject_fail');
  await transfer.restoreMediaBackup('staging',blob);
  assert.equal(fixture.raw.prepare('SELECT id FROM cards').get().id,'c2');
  assert.equal(fixture.raw.prepare('SELECT count(*) AS n FROM media_v2').get().n,1);
  assert.equal(JSON.parse(fixture.raw.prepare("SELECT value FROM metadata WHERE key='recovery'").get().value).cards[0].id,'c1');
  await transfer.recoverMediaPrevious('staging');
  assert.equal(fixture.raw.prepare('SELECT id FROM cards').get().id,'c1');
  assert.equal(fixture.raw.prepare('SELECT count(*) AS n FROM media_v2').get().n,0);
 }finally{fixture.raw.close()}
});
