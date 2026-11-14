import test from 'node:test';
import assert from 'node:assert/strict';
import {createPlusDelivery} from '../src/plus-delivery.ts';
const ready={status:'ready',entitlement:'plus'};
test('never acknowledges free, checking, unavailable or stale error ownership',async()=>{
 let calls=0;const d=createPlusDelivery(async()=>calls++,()=>{});
 for(const status of ['ready','checking','unavailable','error'])for(const entitlement of ['free','plus'])if(status!=='ready'||entitlement!=='plus')await d.reconcile({status,entitlement});
 assert.equal(calls,0);await d.reconcile(ready);assert.equal(calls,1);
});
test('overlapping ownership notifications do not run duplicate delivery concurrently',async()=>{
 let calls=0,resolve;const d=createPlusDelivery(()=>{calls++;return new Promise(r=>resolve=r);},()=>{});
 const first=d.reconcile(ready);await d.reconcile(ready);assert.equal(calls,1);resolve();await first;
});
test('failed acknowledgement can retry on a later verified refresh without losing ownership',async()=>{
 let calls=0;const errors=[];const d=createPlusDelivery(async()=>{if(++calls===1)throw Error('interrupted');},e=>errors.push(e));
 await d.reconcile(ready);await d.reconcile(ready);assert.equal(calls,2);assert.equal(errors.length,1);assert.deepEqual(ready,{status:'ready',entitlement:'plus'});
});
test('stopped runtime will not start additional acknowledgement work',async()=>{
 let calls=0;const d=createPlusDelivery(async()=>calls++,()=>{});d.stop();await d.reconcile(ready);assert.equal(calls,0);
});
