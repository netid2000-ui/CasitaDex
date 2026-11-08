import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { sqliteRepository } from "../src/sqlite-repository.ts";
import { sqliteDraftStore } from "../src/draft-sqlite.ts";
import { empty } from "../src/model.ts";
function adapter(raw) {
  const q = {
    execAsync: async sql => raw.exec(sql),
    runAsync: async (sql,...params) => raw.prepare(sql).run(...params),
    getFirstAsync: async (sql,...params) => raw.prepare(sql).get(...params) ?? null,
    getAllAsync: async (sql,...params) => raw.prepare(sql).all(...params),
    withExclusiveTransactionAsync: async fn => {
      raw.exec("BEGIN IMMEDIATE");
      try { await fn(q); raw.exec("COMMIT"); }
      catch(e) { raw.exec("ROLLBACK"); throw e; }
    },
  };
  return q;
}
const fixture = (patch = {}) => ({
  version:1,id:"draft1",attempt:"attempt1",memoryId:"memory1",checkpoint:1,
  title:"Spare filter",answer:"Hall closet",spaceId:"home",context:"Find",location:"Top shelf",...patch,
});
async function setup() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(),"casitadex-native-draft-test-"));
  const file = path.join(root,"private.sqlite");
  const raw = new DatabaseSync(file), db = adapter(raw);
  const repository = sqliteRepository(db,{getItem:async()=>null},"development");
  const data = empty();
  data.cards.push({id:"legacy",spaceId:"home",title:"Original",answer:"Keep me",context:"Buy",location:"",notes:"old notes",confidence:"Unknown",source:"",history:[]});
  await repository.save(data);
  const drafts = sqliteDraftStore(db);
  return {root,file,raw,db,repository,drafts,close(){raw.close();fs.rmSync(root,{recursive:true,force:true});}};
}
test("unfinished native draft survives reopening and stays outside saved/searchable cards",async()=>{
  const x=await setup();
  try {
    await x.drafts.checkpoint(fixture());
    const reopened = new DatabaseSync(x.file);
    try {
      const store=sqliteDraftStore(adapter(reopened));
      assert.deepEqual(await store.load(),fixture());
      assert.equal(reopened.prepare("SELECT COUNT(*) AS n FROM cards").get().n,1);
    } finally {reopened.close();}
  } finally {x.close();}
});
test("ENG save commits card, attempt and draft consumption together; replay cannot duplicate",async()=>{
  const x=await setup();
  try {
    await x.drafts.checkpoint(fixture());
    const first=await x.drafts.save("attempt1","memory1");
    assert.equal(first.id,"memory1");
    assert.equal(first.data.cards.length,2);
    assert.equal(first.data.cards[0].answer,"Keep me");
    assert.equal(first.data.cards[1].confidence,"Unknown");
    assert.equal(first.data.cards[1].location,"Top shelf");
    assert.equal(await x.drafts.load(),null);
    const retry=await x.drafts.save("attempt1","memory1");
    assert.equal(retry.data.cards.length,2);
    assert.equal(x.raw.prepare("SELECT COUNT(*) AS n FROM add_attempt_v1").get().n,1);
    await assert.rejects(x.drafts.save("attempt1","different"),/conflict/);
  } finally {x.close();}
});
test("card insert failure rolls back memory, recovery marker, attempt and draft consumption",async()=>{
  const x=await setup();
  try {
    await x.drafts.checkpoint(fixture());
    const before=x.raw.prepare("SELECT value FROM metadata WHERE key='recovery'").get().value;
    x.raw.exec("CREATE TRIGGER fail_insert BEFORE INSERT ON cards WHEN NEW.id='memory1' BEGIN SELECT RAISE(FAIL,'injected insert failure'); END");
    await assert.rejects(x.drafts.save("attempt1","memory1"),/injected insert failure/);
    assert.equal((await x.repository.load()).cards.length,1);
    assert.deepEqual(await x.drafts.load(),fixture());
    assert.equal(x.raw.prepare("SELECT COUNT(*) AS n FROM add_attempt_v1").get().n,0);
    assert.equal(x.raw.prepare("SELECT value FROM metadata WHERE key='recovery'").get().value,before);
    x.raw.exec("DROP TRIGGER fail_insert");
    assert.equal((await x.drafts.save("attempt1","memory1")).data.cards.length,2);
  } finally {x.close();}
});
test("failure consuming draft rolls back an already inserted card and attempt",async()=>{
  const x=await setup();
  try {
    await x.drafts.checkpoint(fixture());
    x.raw.exec("CREATE TRIGGER fail_consume BEFORE DELETE ON add_draft_v1 BEGIN SELECT RAISE(FAIL,'injected consume failure'); END");
    await assert.rejects(x.drafts.save("attempt1","memory1"),/injected consume failure/);
    assert.equal(x.raw.prepare("SELECT COUNT(*) AS n FROM cards").get().n,1);
    assert.equal(x.raw.prepare("SELECT COUNT(*) AS n FROM add_attempt_v1").get().n,0);
    assert.deepEqual(await x.drafts.load(),fixture());
  } finally {x.close();}
});
test("stale, conflicting and different drafts cannot overwrite the durable unfinished draft",async()=>{
  const x=await setup();
  try {
    const latest=fixture({checkpoint:3,answer:"Kitchen drawer"});
    await x.drafts.checkpoint(latest);
    await assert.rejects(x.drafts.checkpoint(fixture()),/Stale/);
    await assert.rejects(x.drafts.checkpoint({...latest,answer:"Changed"}),/Conflicting/);
    await assert.rejects(x.drafts.checkpoint(fixture({id:"different",checkpoint:4})),/existing draft/);
    await x.drafts.checkpoint(latest);
    await assert.rejects(x.drafts.discard("draft1",2),/changed/);
    assert.deepEqual(await x.drafts.load(),latest);
  } finally {x.close();}
});
test("invalid content or missing Space fails without consuming the draft",async()=>{
  const x=await setup();
  try {
    const value=fixture({answer:""});
    await x.drafts.checkpoint(value);
    await assert.rejects(x.drafts.save("attempt1","memory1"),/answer|photo/);
    assert.deepEqual(await x.drafts.load(),value);
    await x.drafts.checkpoint(fixture({checkpoint:2,spaceId:"missing"}));
    await assert.rejects(x.drafts.save("attempt1","memory1"),/available space/);
    assert.equal((await x.drafts.load()).checkpoint,2);
    await assert.rejects(x.drafts.checkpoint(fixture({id:"../escape",checkpoint:3})),/Unsafe/);
  } finally {x.close();}
});
test("saving a text draft preserves existing media parents and captures recovery manifest",async()=>{
  const x=await setup();
  try {
    x.raw.exec("CREATE TABLE media_v2(id TEXT PRIMARY KEY,card_id TEXT REFERENCES cards(id) ON DELETE RESTRICT,relative_path TEXT,mime TEXT,byte_count INTEGER,sha256 TEXT)");
    x.raw.prepare("INSERT INTO media_v2 VALUES(?,?,?,?,?,?)").run("image1","legacy","media/image1.png","image/png",9,"a".repeat(64));
    await x.drafts.checkpoint(fixture());
    await x.drafts.save("attempt1","memory1");
    assert.equal(x.raw.prepare("SELECT COUNT(*) AS n FROM media_v2 WHERE card_id='legacy'").get().n,1);
    const recovery=JSON.parse(x.raw.prepare("SELECT value FROM metadata WHERE key='recovery_media_v2'").get().value);
    assert.equal(recovery.media[0].cardId,"legacy");
    assert.equal((await x.repository.load()).cards[0].notes,"old notes");
  } finally {x.close();}
});
test("discard affects only the confirmed draft; successful save rejects late checkpoint recreation",async()=>{
  const x=await setup();
  try {
    await x.drafts.checkpoint(fixture());
    await x.drafts.discard("draft1",1);
    assert.equal(await x.drafts.load(),null);
    assert.equal((await x.repository.load()).cards.length,1);
    await x.drafts.checkpoint(fixture());
    await x.drafts.save("attempt1","memory1");
    await assert.rejects(x.drafts.checkpoint(fixture({checkpoint:2})),/already saved/);
    const reopened=new DatabaseSync(x.file);
    try {
      assert.equal(reopened.prepare("SELECT COUNT(*) AS n FROM cards").get().n,2);
      assert.equal(await sqliteDraftStore(adapter(reopened)).load(),null);
    } finally {reopened.close();}
  } finally {x.close();}
});

test("unknown or absent draft fields fail closed without overwriting prior bytes",async()=>{
  const x=await setup();
  try {
    await x.drafts.checkpoint(fixture());
    await assert.rejects(x.drafts.checkpoint(fixture({checkpoint:2,photoIds:["unverified"]})),/Unsupported/);
    await assert.rejects(x.drafts.checkpoint(fixture({checkpoint:2,id:undefined})),/identity/);
    assert.deepEqual(await x.drafts.load(),fixture());
  } finally {x.close();}
});