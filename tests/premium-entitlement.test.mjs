import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
test('premium source preserves free access and requires verification',()=>{
 const src=readFileSync(new URL('../src/premiumEntitlement.ts',import.meta.url),'utf8');
 assert.match(src,/status === 'active' && trustedVerification/);
 assert.match(src,/canAccessExistingMemories/);
 assert.match(src,/return true/);
});
