import test from 'node:test';
import assert from 'node:assert/strict';
import {createPlusBackupGate} from '../src/plus-feature-gate.ts';
test('ordinary preview builds preserve current backup availability',async()=>{
 const gate=createPlusBackupGate({enabled:false,refresh:async()=>assert.fail('query'),getSnapshot:()=>assert.fail('read')});await gate('full-backup');await gate('restore-backup');
});
test('free users can review a restore, but cannot create a full backup',async()=>{
 let called=false;const gate=createPlusBackupGate({enabled:true,refresh:async()=>{},getSnapshot:()=>({entitlement:'free',status:'ready'})});
 for(const action of ['full-backup'])await assert.rejects(async()=>{await gate(action);called=true;},/requires CasitaDex Plus/);
 assert.equal(called,false);await gate("restore-backup");
});
test('verified Plus grants both operations',async()=>{
 const gate=createPlusBackupGate({enabled:true,refresh:async()=>{},getSnapshot:()=>({entitlement:'plus',status:'ready'})});await gate('full-backup');await gate('restore-backup');
});
test('confirmation rechecks revocation after an earlier preview',async()=>{
 let state={entitlement:'plus',status:'ready'};let revoked=false;
 const gate=createPlusBackupGate({enabled:true,refresh:async()=>{if(revoked)state={entitlement:'free',status:'ready'};},getSnapshot:()=>state});
 await gate('full-backup');revoked=true;await assert.rejects(gate('full-backup'),/requires CasitaDex Plus/);
});
test('unknown and still-checking access never authorizes a write',async()=>{
 for(const status of ['unavailable','checking','error']){
  const gate=createPlusBackupGate({enabled:true,refresh:async()=>{},getSnapshot:()=>({entitlement:'free',status})});await assert.rejects(gate('full-backup'),/Unable to verify/);
 }
 const gate=createPlusBackupGate({enabled:true,refresh:async()=>{},getSnapshot:()=>({entitlement:'plus',status:'checking'})});await assert.rejects(gate('full-backup'),/Unable to verify/);
});
test('temporary verification failure preserves previously verified Plus access',async()=>{
 const gate=createPlusBackupGate({enabled:true,refresh:async()=>{},getSnapshot:()=>({entitlement:'plus',status:'error'})});await gate('full-backup');
});
