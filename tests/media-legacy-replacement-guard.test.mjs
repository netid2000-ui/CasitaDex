import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
const src=fs.readFileSync(new URL("../src/sqlite-repository.ts",import.meta.url),"utf8");
test("legacy card replacement probes existing media table before deletion",()=>{
  const fn=src.slice(src.indexOf("async function replace("),src.indexOf("async function initialize("));
  assert.match(fn,/sqlite_master/);
  assert.match(fn,/SELECT COUNT\(\*\) AS count FROM media_v2/);
  assert.match(fn,/count\.count > 0/);
  assert.ok(fn.indexOf("count.count > 0") < fn.indexOf("DELETE FROM cards"));
  assert.match(fn,/media-aware backup and restore/);
});
