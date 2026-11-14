import test from 'node:test';
import assert from 'node:assert/strict';
import {plusAccess} from '../src/plus-access.ts';
import {createPlusPurchaseController} from '../src/plus-purchase-controller.ts';

test('free plan permits the twentieth save and protects existing data above the limit', () => {
 assert.equal(plusAccess('create-memory','free',19),'allowed');
 for (const count of [20,21,1000]) {
  assert.equal(plusAccess('create-memory','free',count),'upgrade-required');
  for (const action of ['read','edit','search','text-export','restore-purchases']) assert.equal(plusAccess(action,'free',count),'allowed');
  assert.equal(plusAccess('create-memory','plus',count),'allowed');
 }
 for (const count of [NaN,Infinity,-1,1.5]) assert.equal(plusAccess('create-memory','free',count),'invalid-count');
});
test('backup, restore, OCR and photo PDF require Plus; restore purchases remains free', () => {
 for (const action of ['full-backup','restore-backup','photo-text-search','photo-pdf']) {
  assert.equal(plusAccess(action,'free',0),'upgrade-required');
  assert.equal(plusAccess(action,'plus',0),'allowed');
 }
});
test('missing native adapter cannot grant Plus', async () => {
 const c=createPlusPurchaseController(null);
 for (const method of ['purchase','restore','refresh']) assert.deepEqual(await c[method](),{entitlement:'free',operation:'idle',result:'unavailable'});
});
test('completed checkout still needs verification; restore works without purchasing', async () => {
 let purchaseCalls=0,verified='free';
 const c=createPlusPurchaseController({purchase:async()=>{purchaseCalls++;return 'completed';},restore:async()=>{},verifiedEntitlement:async()=>verified});
 assert.equal((await c.purchase()).entitlement,'free');
 verified='plus';assert.equal((await c.restore()).entitlement,'plus');assert.equal(purchaseCalls,1);
 verified='free';assert.equal((await c.refresh()).entitlement,'free');
});
test('cancel and pending never verify or erase existing ownership', async () => {
 for (const outcome of ['cancelled','pending']) for (const initial of ['free','plus']) {
  const c=createPlusPurchaseController({purchase:async()=>outcome,restore:async()=>{},verifiedEntitlement:async()=>{assert.fail('must not verify');}},initial);
  assert.deepEqual(await c.purchase(),{entitlement:initial,operation:'idle',result:outcome});
 }
});
test('verification failure preserves last verified access and allows retry', async () => {
 let fail=true;
 const c=createPlusPurchaseController({purchase:async()=> 'completed',restore:async()=>{},verifiedEntitlement:async()=>{if(fail)throw Error('offline');return 'plus';}},'plus');
 assert.deepEqual(await c.restore(),{entitlement:'plus',operation:'idle',result:'error'});
 fail=false;assert.equal((await c.restore()).result,'verified');
});
test('overlapping purchase and restore calls cannot double-submit', async () => {
 let finish,calls=0;
 const c=createPlusPurchaseController({purchase:()=>{calls++;return new Promise(r=>{finish=r;});},restore:async()=>{calls++;},verifiedEntitlement:async()=> 'plus'});
 const pending=c.purchase();assert.equal((await c.restore()).result,'busy');assert.equal(calls,1);
 finish('completed');assert.equal((await pending).result,'verified');assert.equal(c.snapshot().operation,'idle');
});
test('invalid adapter values never unlock and snapshots cannot mutate state', async () => {
 const c=createPlusPurchaseController({purchase:async()=> 'made-up',restore:async()=>{},verifiedEntitlement:async()=> 'made-up'});
 assert.equal((await c.purchase()).result,'error');assert.equal((await c.restore()).result,'error');
 const s=c.snapshot();s.entitlement='plus';assert.equal(c.snapshot().entitlement,'free');
});
