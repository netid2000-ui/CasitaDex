import test from 'node:test';
import assert from 'node:assert/strict';
import {purchaseGateway} from '../src/purchaseGateway.ts';
test('no paid purchase or restore without native billing',async()=>{assert.equal(purchaseGateway.configured,false);await assert.rejects(purchaseGateway.purchase('test.product'),/not configured/);await assert.rejects(purchaseGateway.restore(),/not configured/);});
