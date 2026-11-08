import test from "node:test";
import assert from "node:assert/strict";
import { empty, examples, parseData, matches, snapshot } from "../src/model.ts";
import { repository } from "../src/repository.ts";
test("versioned backup round trips and preserves confidence", () => {
  const d = examples();
  assert.deepEqual(parseData(JSON.stringify(d)), d);
  assert.equal(d.cards[1].confidence, "Needs checking");
});
test("reject malformed, future, duplicate and impossible-date backups", () => {
  for (const edit of [
    (d) => (d.version = 2),
    (d) => d.cards.push(d.cards[0]),
    (d) => (d.cards[0].due = "2026-02-30"),
    (d) => (d.cards[0].spaceId = "missing"),
    (d) => (d.cards[0].source = ""),
    (d) => d.media.push({}),
  ]) {
    const d = examples();
    edit(d);
    assert.throws(() => parseData(JSON.stringify(d)));
  }
  assert.throws(() => parseData("{"));
});
test("ignore unexpected imported fields", () => {
  const d = examples();
  d.cards[0].secret = "hidden";
  assert.equal(
    JSON.stringify(parseData(JSON.stringify(d))).includes("hidden"),
    false,
  );
});
test("search and context projections share one source", () => {
  const c = examples().cards[0];
  assert.equal(matches(c, "20 ×", "Buy", "2026-10-07"), true);
  assert.equal(matches(c, "", "Fix", "2026-10-07"), false);
  assert.equal(matches(c, "", "Maintain", "2026-10-06"), false);
  assert.equal(matches(c, "", "Maintain", "2026-10-07"), true);
});
test("share excludes unselected cards and optional private detail by default", () => {
  const d = examples();
  assert.equal(snapshot(d.cards, [], false), "");
  const s = snapshot(d.cards, ["demo-filter"], false);
  assert.ok(s.includes("20 × 25 × 1"));
  assert.ok(!s.includes("Hall closet"));
  assert.ok(!s.includes("Garage"));
  assert.ok(snapshot(d.cards, ["demo-filter"], true).includes("Hall closet"));
});
function storage() {
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
test("Development and Staging never share storage", async () => {
  const s = storage(),
    a = repository(s, "development"),
    b = repository(s, "staging");
  await a.save(examples());
  assert.deepEqual(await b.load(), empty());
  assert.throws(() => repository(s, "production"));
});
test("corrupt read leaves raw data untouched", async () => {
  const s = storage(),
    r = repository(s, "development");
  s.map.set(r.key, "BROKEN");
  await assert.rejects(r.load());
  assert.equal(s.map.get(r.key), "BROKEN");
});
test("previous save recovers after replacement", async () => {
  const s = storage(),
    r = repository(s, "development");
  await r.save(examples());
  await r.save(empty());
  assert.deepEqual(await r.recover(), examples());
});
test("failed write rejects without losing current primary", async () => {
  const s = storage(),
    r = repository(s, "development");
  await r.save(examples());
  const original = s.setItem;
  s.setItem = async (k, v) => {
    if (k === r.key) throw Error("disk full");
    return original(k, v);
  };
  await assert.rejects(r.save(empty()));
  assert.deepEqual(await r.load(), examples());
});
test("invalid import is rejected before any storage write", async () => {
  const s = storage(),
    r = repository(s, "development");
  await assert.rejects(r.save({ version: 9 }));
  assert.equal(s.map.size, 0);
});
