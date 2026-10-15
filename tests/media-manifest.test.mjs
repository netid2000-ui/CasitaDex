import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";
const source = fs.readFileSync(new URL("../src/media-manifest.ts", import.meta.url), "utf8");
const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
const module = { exports: {} };
vm.runInNewContext(js, { module, exports: module.exports, Set, Number, Error, Object });
const validate = module.exports.validateMediaManifest;
const base = () => ({ version: 2, media: [{ id: "photo_1", cardId: "c1", path: "media/photo_1.jpg", mime: "image/jpeg", bytes: 100, sha256: "a".repeat(64) }] });
test("valid manifest creates normalized, allowlisted metadata", () => {
  const result = validate(base(), ["c1"]);
  assert.equal(result.media.length, 1);
  assert.equal(result.media[0].path, "media/photo_1.jpg");
});
test("reject unrecognized schema", () => assert.throws(() => validate({version: 1,media:[]}, []), /version/i));
test("reject traversal and absolute paths", () => {
  for (const path of ["../secret.jpg", "/media/photo_1.jpg", "media/../secret.jpg", "media\\photo_1.jpg"]){ const x=base(); x.media[0].path=path;assert.throws(()=>validate(x,["c1"]),/path/i); }
});
test("reject missing parent card", () => assert.throws(() => validate(base(), []), /card reference/i));
test("reject duplicate media identifiers", () => {const x=base();x.media.push({...x.media[0]});assert.throws(()=>validate(x,["c1"]),/duplicate/i);});
test("reject unsupported type and mismatched filename extension", () => {
  for (const change of [{mime:"application/pdf"},{path:"media/photo_1.png"}]){const x=base();Object.assign(x.media[0],change);assert.throws(()=>validate(x,["c1"]));}
});
test("reject invalid SHA256 and byte count", () => {
  for(const change of [{sha256:"bad"},{bytes:-1},{bytes:10_000_001},{bytes:1.5}]){const x=base();Object.assign(x.media[0],change);assert.throws(()=>validate(x,["c1"]));}
});
test("reject excessive manifest entries", () => assert.throws(()=>validate({version:2,media:Array(1001).fill(null)},["c1"]),/count/i));