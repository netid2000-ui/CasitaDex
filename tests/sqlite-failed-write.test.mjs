import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import {DatabaseSync} from 'node:sqlite';
function load(n, requireFn) {
  const source=fs.readFileSync(new URL(`../src/${n}.ts`,import.meta.url),'utf8');
  const js=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
  const module={exports:{}};
  vm.runInNewContext(js,{module,exports:module.exports,require:requireFn,Error,Object,Set,Number,JSON,Promise,Date});
  return module.exports;
}
const model=load('model',()=>{});
const repoModule=load('sqlite-repository',(n)=>{if(n==='./model.ts')return model;throw Error('Unexpected import '+n)});
function adapter(raw){const q={execAsync:async s=>raw.exec(s),runAsync:async(s,...p)=>raw.prepare(s).run(...p),getFirstAsync:async(s,...p)=>raw.prepare(s).get(...p)||null,getAllAsync:async(s,...p)=>raw.prepare(s).all(...p),withExclusiveTransactionAsync:async fn=>{raw.exec('BEGIN IMMEDIATE');try{await fn(q);raw.exec('COMMIT')}catch(e){raw.exec('ROLLBACK');throw e}}};return q}
test('injected SQL insert failure rolls back both replacement and recovery marker',async()=>{
 const raw=new DatabaseSync(':memory:');
 try {
  const legacy={getItem:async()=>null,setItem:async()=>{throw Error('not used')}};
  const repo=repoModule.sqliteRepository(adapter(raw),legacy,'staging');
  const first=model.empty();
  first.cards.push({id:'c1',spaceId:'home',title:'Original',answer:'OriginalAnswer',location:'',notes:'',context:'Buy',confidence:'Unknown',source:'',history:[]});
  await repo.save(first);
  const previous=raw.prepare("SELECT value FROM metadata WHERE key='recovery'").get().value;
  raw.exec("CREATE TRIGGER fail_replacement BEFORE INSERT ON cards WHEN NEW.payload LIKE '%NewAnswer%' BEGIN SELECT RAISE(FAIL,'injected failure'); END;");
  const next=JSON.parse(JSON.stringify(first));next.cards[0].answer='NewAnswer';
  await assert.rejects(repo.save(next),/injected failure/);
  assert.equal((await repo.load()).cards[0].answer,'OriginalAnswer');
  assert.equal(raw.prepare("SELECT value FROM metadata WHERE key='recovery'").get().value,previous);
  raw.exec('DROP TRIGGER fail_replacement');
  await repo.save(next);
  assert.equal((await repo.load()).cards[0].answer,'NewAnswer');
 }finally{raw.close()}
});
test('attached card can be edited in place but legacy replacement cannot discard its identity',async()=>{
 const raw=new DatabaseSync(':memory:');
 try{
  const repo=repoModule.sqliteRepository(adapter(raw),{getItem:async()=>null},'staging');
  const data=model.empty();data.cards.push({id:'c1',spaceId:'home',title:'Image card',answer:'before',location:'',notes:'',context:'Buy',confidence:'Unknown',source:'',history:[]});
  await repo.save(data);
  raw.exec("CREATE TABLE media_v2(id TEXT PRIMARY KEY,card_id TEXT REFERENCES cards(id) ON DELETE RESTRICT, relative_path TEXT, mime TEXT, byte_count INTEGER,sha256 TEXT); INSERT INTO media_v2 VALUES('m1','c1','media/m1.png','image/png',9,'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')");
  const edited=JSON.parse(JSON.stringify(data));edited.cards[0].answer='after';
  await repo.save(edited);
  assert.equal((await repo.load()).cards[0].answer,'after');
  assert.equal(raw.prepare('SELECT COUNT(*) AS n FROM media_v2').get().n,1);
  const replacing=JSON.parse(JSON.stringify(edited));replacing.cards[0].id='c2';
  await assert.rejects(repo.save(replacing),/media-aware backup and restore/);
  assert.equal((await repo.load()).cards[0].id,'c1');
  assert.equal(raw.prepare('SELECT COUNT(*) AS n FROM media_v2').get().n,1);
 }finally{raw.close()}
});
