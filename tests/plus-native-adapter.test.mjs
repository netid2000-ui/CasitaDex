import test from 'node:test';
import assert from 'node:assert/strict';
import {createLocalPlusAdapter} from '../src/plus-native-adapter.ts';
import {createPlusPurchaseController} from '../src/plus-purchase-controller.ts';
const native = (overrides={}) => ({purchaseForLocalTesting:async()=> 'completed',restore:async()=> 'plus',verifiedEntitlement:async()=> 'plus',...overrides});
test('native connection requires an explicit local harness',()=>{
 assert.equal(createLocalPlusAdapter(native(),false),null);
 assert.equal(createLocalPlusAdapter(null,true),null);
});
test('purchase is followed by a separate verified entitlement query',async()=>{
 const calls=[];
 const c=createPlusPurchaseController(createLocalPlusAdapter(native({purchaseForLocalTesting:async()=>{calls.push('purchase');return 'completed';},verifiedEntitlement:async()=>{calls.push('verify');return 'plus';}}),true));
 assert.equal((await c.purchase()).result,'verified');assert.deepEqual(calls,['purchase','verify']);
});
test('pending and cancellation do not query entitlement',async()=>{
 for(const value of ['pending','cancelled']){
  const c=createPlusPurchaseController(createLocalPlusAdapter(native({purchaseForLocalTesting:async()=>value,verifiedEntitlement:async()=>assert.fail('unexpected query')}),true));
  assert.equal((await c.purchase()).result,value);assert.equal(c.snapshot().entitlement,'free');
 }
});
test('restore rechecks ownership and never calls purchase',async()=>{
 let checked=0;
 const c=createPlusPurchaseController(createLocalPlusAdapter(native({purchaseForLocalTesting:async()=>assert.fail('purchase called'),verifiedEntitlement:async()=>{checked++;return 'free';}}),true),'plus');
 assert.equal((await c.restore()).entitlement,'free');assert.equal(checked,1);
});
test('invalid native results and rejected promises preserve verified access',async()=>{
 for(const overrides of [{purchaseForLocalTesting:async()=> 'bogus'},{verifiedEntitlement:async()=>({plus:true})},{purchaseForLocalTesting:async()=>{throw Error('offline');}}]){
  const c=createPlusPurchaseController(createLocalPlusAdapter(native(overrides),true),'plus');
  assert.equal((await c.purchase()).result,'error');assert.equal(c.snapshot().entitlement,'plus');
 }
 const c=createPlusPurchaseController(createLocalPlusAdapter(native({restore:async()=>null}),true),'plus');
 assert.equal((await c.restore()).result,'error');assert.equal(c.snapshot().entitlement,'plus');
});
