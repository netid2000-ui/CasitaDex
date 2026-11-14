import test from 'node:test';
import assert from 'node:assert/strict';
import {createPlusEntitlementStore} from '../src/plus-entitlement-store.ts';
const tick=()=>new Promise(resolve=>setImmediate(resolve));
function fixture(query){let event,removed=0;const store=createPlusEntitlementStore({verifiedEntitlement:query,subscribe:fn=>{event=fn;return()=>removed++;}});return {store,emit:()=>event(),removed:()=>removed};}
test('unavailable native support never queries or grants',async()=>{
 const store=createPlusEntitlementStore(null);store.start();await store.refresh();assert.deepEqual(store.getSnapshot(),{entitlement:'free',status:'unavailable'});store.stop();
});
test('startup verifies ownership and delayed revocation updates shared state',async()=>{
 let owned='plus';const f=fixture(async()=>owned);f.store.start();await tick();assert.equal(f.store.getSnapshot().entitlement,'plus');owned='free';f.emit();await tick();assert.deepEqual(f.store.getSnapshot(),{entitlement:'free',status:'ready'});f.store.stop();assert.equal(f.removed(),1);
});
test('event during verification discards stale ownership and requeries once',async()=>{
 let resolve,calls=0;const f=fixture(()=>{calls++;return calls===1?new Promise(r=>resolve=r):Promise.resolve('free');});const seen=[];f.store.subscribe(()=>seen.push(f.store.getSnapshot().entitlement));f.store.start();f.emit();f.emit();resolve('plus');await tick();assert.equal(calls,2);assert.ok(!seen.includes('plus'));assert.equal(f.store.getSnapshot().entitlement,'free');f.store.stop();
});
test('verification errors and invalid results preserve last verified ownership',async()=>{
 let mode='plus';const f=fixture(async()=>{if(mode==='error')throw Error('offline');return mode;});f.store.start();await tick();for(const value of ['error','invalid']){mode=value;await f.store.refresh();assert.deepEqual(f.store.getSnapshot(),{entitlement:'plus',status:'error'});}mode='free';await f.store.refresh();assert.equal(f.store.getSnapshot().entitlement,'free');f.store.stop();
});
test('late response after stop cannot overwrite a restarted session',async()=>{
 let resolve,calls=0;const f=fixture(()=>++calls===1?new Promise(r=>resolve=r):Promise.resolve('free'));f.store.start();f.store.stop();f.store.start();await tick();resolve('plus');await tick();assert.deepEqual(f.store.getSnapshot(),{entitlement:'free',status:'ready'});f.store.stop();assert.equal(f.removed(),2);
});
test('start is idempotent and snapshots cannot be mutated',async()=>{
 let calls=0;const f=fixture(async()=>{calls++;return 'free';});f.store.start();f.store.start();await tick();assert.equal(calls,1);assert.throws(()=>{f.store.getSnapshot().entitlement='plus';},TypeError);f.store.stop();
});
