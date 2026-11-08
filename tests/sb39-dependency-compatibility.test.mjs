import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {readFileSync} from 'node:fs';
const require=createRequire(import.meta.url);
test('query-string v7 requires callable decoder, so unreviewed ESM-only decoder overrides are not accepted',()=>{
 const consumer=readFileSync(require.resolve('query-string'),'utf8');
 const decoder=require('decode-uri-component');
 assert.match(consumer,/require\('decode-uri-component'\)/);
 assert.match(consumer,/decodeComponent\(value\)/);
 assert.equal(typeof decoder,'function','installed decoder must remain callable until a reviewed fix is implemented');
});
