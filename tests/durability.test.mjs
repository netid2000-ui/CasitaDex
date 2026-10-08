import test from "node:test";
import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
import { mkdtempSync, readdirSync, unlinkSync, rmdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { sqliteRepository } from "../src/sqlite-repository.ts";
import { repository } from "../src/repository.ts";
import { preferenceStore } from "../src/preferences.ts";
import { empty, examples, parseData, utf8Bytes } from "../src/model.ts";
function memory() {
  const map = new Map();
  return {
    map,
    async getItem(k) {
      return map.get(k) ?? null;
    },
    async setItem(k, v) {
      map.set(k, v);
    },
  };
}
function adapter(filename = ":memory:") {
  const db = new DatabaseSync(filename);
  const api = {
    db,
    fail: "",
    async execAsync(sql) {
      db.exec(sql);
    },
    async runAsync(sql, ...values) {
      if (api.fail && sql.includes(api.fail))
        throw Error("injected write failure");
      return db.prepare(sql).run(...values);
    },
    async getFirstAsync(sql, ...values) {
      return db.prepare(sql).get(...values) ?? null;
    },
    async getAllAsync(sql, ...values) {
      return db.prepare(sql).all(...values);
    },
    async withExclusiveTransactionAsync(task) {
      db.exec("BEGIN IMMEDIATE");
      try {
        await task(api);
        db.exec("COMMIT");
      } catch (e) {
        db.exec("ROLLBACK");
        throw e;
      }
    },
  };
  return api;
}
test("SQLite migration preserves legacy, source confidence, dates and ordered history; marker prevents reimport", async (t) => {
  const old = memory(),
    db = adapter();
  t.after(() => db.db.close());
  const r = sqliteRepository(db, old, "development"),
    original = JSON.stringify(examples());
  old.map.set(r.key, original);
  assert.deepEqual(await r.load(), examples());
  assert.equal(old.map.get(r.key), original);
  await r.save(empty());
  assert.deepEqual(await r.load(), empty());
  assert.deepEqual(await r.recover(), examples());
});
test("SQLite reopens durable rows from disk", async () => {
  const dir = mkdtempSync(join(tmpdir(), "casitadex-spike-")),
    file = join(dir, "answers.db"),
    old = memory();
  let db = adapter(file);
  try {
    await sqliteRepository(db, old, "staging").save(examples());
    db.db.close();
    db = adapter(file);
    assert.deepEqual(
      await sqliteRepository(db, old, "staging").load(),
      examples(),
    );
  } finally {
    db.db.close();
    for (const file of readdirSync(dir)) unlinkSync(join(dir, file));
    rmdirSync(dir);
  }
});
test("SQLite rolls back row deletion AND recovery changes when a later write fails", async (t) => {
  const db = adapter(),
    r = sqliteRepository(db, memory(), "development");
  t.after(() => db.db.close());
  await r.save(examples());
  const modified = examples();
  modified.cards[0].answer = "16 × 20 × 1";
  await r.save(modified);
  db.fail = "INSERT INTO spaces";
  await assert.rejects(r.save(empty()), /injected/);
  db.fail = "";
  assert.deepEqual(await r.load(), modified);
  assert.deepEqual(await r.recover(), examples());
});
test("failed migration is retryable and does not remove legacy data", async (t) => {
  const db = adapter(),
    old = memory(),
    r = sqliteRepository(db, old, "development");
  t.after(() => db.db.close());
  old.map.set(r.key, JSON.stringify(examples()));
  db.fail = "INSERT INTO cards";
  await assert.rejects(r.load());
  assert.equal(db.db.prepare("SELECT count(*) n FROM metadata").get().n, 0);
  db.fail = "";
  assert.deepEqual(await r.load(), examples());
  assert.ok(old.map.has(r.key));
});
test("corrupt legacy primary blocks writes, explicit previous-save recovery is available", async (t) => {
  const db = adapter(),
    old = memory(),
    r = sqliteRepository(db, old, "development");
  t.after(() => db.db.close());
  old.map.set(r.key, "BROKEN");
  old.map.set(r.key + ":recovery", JSON.stringify(examples()));
  await assert.rejects(r.load());
  await assert.rejects(r.save(empty()));
  assert.equal(old.map.get(r.key), "BROKEN");
  assert.deepEqual(await r.recover(), examples());
  assert.deepEqual(await r.load(), examples());
});
test("corrupt SQLite primary cannot overwrite good recovery; explicit recovery repairs it", async (t) => {
  const db = adapter(),
    r = sqliteRepository(db, memory(), "development");
  t.after(() => db.db.close());
  await r.save(examples());
  await r.save(examples());
  db.db
    .prepare("UPDATE cards SET payload='BROKEN' WHERE id=?")
    .run("demo-filter");
  await assert.rejects(r.load());
  await assert.rejects(r.save(empty()));
  assert.deepEqual(await r.recover(), examples());
});
test("SQLite serializes saves and reads, rejects future schema and enforces foreign keys", async (t) => {
  const db = adapter(),
    r = sqliteRepository(db, memory(), "staging");
  t.after(() => db.db.close());
  const result = await Promise.all([
    r.save(examples()),
    r.save(empty()),
    r.load(),
  ]);
  assert.deepEqual(result[2], empty());
  assert.throws(
    () =>
      db.db
        .prepare("INSERT INTO cards VALUES (?, ?, ?, ?)")
        .run("x", "missing", 0, "{}"),
    /FOREIGN KEY/,
  );
  db.db.exec("UPDATE metadata SET value='99' WHERE key='schema'");
  await assert.rejects(r.load(), /newer/);
  await assert.rejects(r.recover(), /newer/);
  assert.throws(() => sqliteRepository(db, memory(), "production"));
});
test("independent native environment databases and legacy keys stay isolated", async (t) => {
  const a = adapter(),
    b = adapter(),
    old = memory();
  t.after(() => {
    a.db.close();
    b.db.close();
  });
  const dev = sqliteRepository(a, old, "development"),
    stage = sqliteRepository(b, old, "staging");
  await dev.save(examples());
  assert.deepEqual(await stage.load(), empty());
});
test("browser recovery copy survives corruption appearing between load and save", async () => {
  const s = memory(),
    r = repository(s, "development");
  await r.save(examples());
  await r.save(empty());
  s.map.set(r.key, "BROKEN");
  await assert.rejects(r.save(empty()));
  assert.deepEqual(await r.recover(), examples());
});
test("backup size uses UTF-8 bytes including multibyte characters", () => {
  assert.equal(utf8Bytes("aé家😀"), 10);
  const data = empty();
  for (let i = 0; i < 700; i++)
    data.cards.push({
      ...examples().cards[0],
      id: String(i),
      notes: "家".repeat(1000),
    });
  const raw = JSON.stringify(data);
  assert.ok(raw.length < 2000000);
  assert.ok(Buffer.byteLength(raw) > 2000000);
  assert.throws(() => parseData(raw), /too large/);
});
test("reading preferences persist per environment without carrying private cards", async () => {
  const s = memory(),
    dev = preferenceStore(s, "development"),
    stage = preferenceStore(s, "staging");
  await dev.save({ large: true, appearance: "Dark" });
  assert.deepEqual(await preferenceStore(s, "development").load(), {
    large: true,
    appearance: "Dark",
  });
  assert.deepEqual(await stage.load(), { large: false, appearance: "System" });
});

test("SQLite survives an OS-killed writer before commit", async () => {
  const { spawn } = await import("node:child_process");
  const dir = mkdtempSync(join(tmpdir(), "casitadex-crash-")),
    file = join(dir, "answers.db"),
    old = memory();
  let db = adapter(file),
    child;
  try {
    await sqliteRepository(db, old, "staging").save(examples());
    db.db.close();
    db = null;
    child = spawn(
      process.execPath,
      [
        "--input-type=module",
        "-e",
        `import {DatabaseSync} from 'node:sqlite'; const db=new DatabaseSync(process.argv[1]); db.exec("PRAGMA journal_mode=WAL; BEGIN IMMEDIATE; DELETE FROM cards;"); console.log("uncommitted"); setInterval(()=>{},1000);`,
        file,
      ],
      { stdio: ["ignore", "pipe", "pipe"], windowsHide: true },
    );
    await new Promise((resolve, reject) => {
      const timer = setTimeout(
        () => reject(Error("crash fixture timed out")),
        45000,
      );
      child.stdout.once("data", () => {
        clearTimeout(timer);
        resolve();
      });
      child.once("error", (e) => {
        clearTimeout(timer);
        reject(e);
      });
    });
    const exited = new Promise((resolve) => child.once("exit", resolve));
    child.kill("SIGKILL");
    await exited;
    child = null;
    db = adapter(file);
    assert.deepEqual(
      await sqliteRepository(db, old, "staging").load(),
      examples(),
    );
  } finally {
    if (child) child.kill("SIGKILL");
    db?.db.close();
    for (const file of readdirSync(dir)) unlinkSync(join(dir, file));
    rmdirSync(dir);
  }
});

test("every permitted collection exports within the import byte limit", async () => {
  const { exportData } = await import("../src/model.ts");
  const data = examples(),
    template = data.cards[0];
  data.cards = Array.from({ length: 850 }, (_, i) => ({
    ...template,
    id: String(i),
    notes: "x".repeat(1900),
  }));
  assert.ok(utf8Bytes(JSON.stringify(data)) < 2000000);
  assert.ok(utf8Bytes(JSON.stringify(data, null, 2)) > 2000000);
  assert.deepEqual(parseData(exportData(data)), data);
});
