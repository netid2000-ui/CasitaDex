import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import {createHash} from "node:crypto";
import {openEngStreamCompatible} from "../src/eng-stream-v4.ts";
import {allEngMedia} from "../src/eng-store.ts";
const hash=async bytes=>createHash("sha256").update(bytes).digest("hex");
test("provided Full v4 acceptance archive verifies every embedded photo byte",async t=>{
 const file=process.env.CASITADEX_SB24_ARCHIVE;
 if(!file){t.skip("Set CASITADEX_SB24_ARCHIVE to a local QA archive");return;}
 const bytes=fs.readFileSync(file);
 const opened=await openEngStreamCompatible({size:bytes.length,read:async(at,n)=>bytes.subarray(at,at+n)},hash);
 assert.equal(opened.source,"Full v4");
 assert.ok(opened.reminders.rows.length>0);
 const entries=allEngMedia(opened.snapshot);
 assert.ok(entries.length>0,"Archive must contain a photo");
 for(const entry of entries){
  const photo=await opened.read(entry.path);
  assert.equal(photo.length,entry.bytes);
  assert.equal(await hash(photo),entry.sha256);
 }
 assert.ok(opened.snapshot.draft,"Expected preserved unfinished draft");
});

test("real Full v4 emulator archive rejects one-byte photo corruption without changing source",async t=>{
 const file=process.env.CASITADEX_SB24_ARCHIVE;
 if(!file){t.skip("Set CASITADEX_SB24_ARCHIVE to a local QA archive");return;}
 const original=fs.readFileSync(file);
 const originalHash=await hash(original);
 const corrupted=Buffer.from(original);
 corrupted[corrupted.length-1]^=1;
 const reader={size:corrupted.length,read:async(at,n)=>corrupted.subarray(at,at+n)};
 await assert.rejects(openEngStreamCompatible(reader,hash),/integrity|hash|mismatch|damaged|corrupt|verify/i);
 assert.equal(await hash(fs.readFileSync(file)),originalHash);
});

test("real Full v4 archive restores and recovers both domains in disposable SQLite",async t=>{
 const file=process.env.CASITADEX_SB24_ARCHIVE;
 if(!file){t.skip("Set CASITADEX_SB24_ARCHIVE to a local QA archive");return;}
 const {setup}=await import("./eng-fixture.mjs");
 const bytes=fs.readFileSync(file);
 const opened=await openEngStreamCompatible({size:bytes.length,read:async(at,n)=>bytes.subarray(at,at+n)},hash);
 const x=setup();
 try{
  const initial=await x.store.backup();
  for(const entry of allEngMedia(opened.snapshot))x.files.set(entry.path,(await opened.read(entry.path)).slice());
  const token=await x.store.restoreToken();
  await x.store.restoreV4(opened.snapshot,opened.reminders,"incoming",token);
  const restored=await x.store.backup();
  assert.deepEqual(restored.snapshot.data,opened.snapshot.data);
  assert.equal(restored.snapshot.draft?.title,opened.snapshot.draft?.title);
  assert.equal(x.raw.prepare("SELECT COUNT(*) AS n FROM standalone_reminders_v1").get().n,opened.reminders.rows.length);
  assert.equal(await x.store.hasV4Recovery(),true);
  await x.store.recoverV4();
  const recovered=await x.store.backup();
  assert.deepEqual(recovered.snapshot.data,initial.snapshot.data);
  assert.equal(x.raw.prepare("SELECT COUNT(*) AS n FROM standalone_reminders_v1").get().n,0);
  assert.ok([...x.files.keys()].length>0,"Source photo bytes retained without deletion");
 }finally{x.close()}
});

test("real Full v4 archive cancel is nonmutating in disposable SQLite",async t=>{
 const file=process.env.CASITADEX_SB24_ARCHIVE;
 if(!file){t.skip("Set CASITADEX_SB24_ARCHIVE to a local QA archive");return;}
 const {setup}=await import("./eng-fixture.mjs");
 const bytes=fs.readFileSync(file);
 const opened=await openEngStreamCompatible({size:bytes.length,read:async(at,n)=>bytes.subarray(at,at+n)},hash);
 const x=setup();
 try{
  const before=(await x.store.backup()).snapshot;
  const schemaBefore=x.raw.prepare("SELECT name,sql FROM sqlite_master WHERE type IN ('table','index') ORDER BY name").all();
  const token=await x.store.restoreToken();
  await x.store.restoreV4(opened.snapshot,opened.reminders,"cancel",token);
  assert.deepEqual((await x.store.backup()).snapshot,before);
  assert.deepEqual(x.raw.prepare("SELECT name,sql FROM sqlite_master WHERE type IN ('table','index') ORDER BY name").all(),schemaBefore);
  assert.equal(await x.store.hasV4Recovery(),false);
  assert.equal(x.raw.prepare("SELECT name FROM sqlite_master WHERE name='standalone_reminders_v1'").get(),undefined);
  assert.equal(x.files.size,0);
 }finally{x.close()}
});

test("real Full v4 archive refuses stale reminder review without mutations",async t=>{
 const file=process.env.CASITADEX_SB24_ARCHIVE;
 if(!file){t.skip("Set CASITADEX_SB24_ARCHIVE to a local QA archive");return;}
 const {setup}=await import("./eng-fixture.mjs");
 const bytes=fs.readFileSync(file);
 const opened=await openEngStreamCompatible({size:bytes.length,read:async(at,n)=>bytes.subarray(at,at+n)},hash);
 const x=setup();
 try{
  for(const entry of allEngMedia(opened.snapshot))x.files.set(entry.path,(await opened.read(entry.path)).slice());
  await x.db.execAsync("CREATE TABLE standalone_reminders_v1 (id TEXT PRIMARY KEY,title TEXT NOT NULL,notes TEXT NOT NULL,due_date TEXT NOT NULL,completed INTEGER NOT NULL DEFAULT 0,created_at TEXT NOT NULL,updated_at TEXT NOT NULL,due_time TEXT NOT NULL DEFAULT '09:00',anchor_day INTEGER NOT NULL DEFAULT 0,repeat TEXT NOT NULL DEFAULT 'once')");
  const engToken=await x.store.restoreToken();
  const reminderToken=await x.store.reminderRestoreToken();
  await x.db.runAsync("INSERT INTO standalone_reminders_v1(id,title,notes,due_date,completed,created_at,updated_at) VALUES(?,?,?,?,?,?,?)","new-reminder","New after review","","2026-10-20",0,"2026-10-20","2026-10-20");
  const before=(await x.store.backup()).snapshot;
  const rows=x.raw.prepare("SELECT * FROM standalone_reminders_v1 ORDER BY id").all();
  const schemaBefore=x.raw.prepare("SELECT name,sql FROM sqlite_master WHERE type IN ('table','index') ORDER BY name").all();
  await assert.rejects(x.store.restoreV4(opened.snapshot,opened.reminders,"incoming",engToken,reminderToken),/reminders changed/);
  assert.deepEqual((await x.store.backup()).snapshot,before);
  assert.deepEqual(x.raw.prepare("SELECT * FROM standalone_reminders_v1 ORDER BY id").all(),rows);
  assert.deepEqual(x.raw.prepare("SELECT name,sql FROM sqlite_master WHERE type IN ('table','index') ORDER BY name").all(),schemaBefore);
  assert.equal(await x.store.hasV4Recovery(),false);
 }finally{x.close()}
});
