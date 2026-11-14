import {createMemoryLimitGate} from './plus-memory-limit';
import {requireOptionalNativeModule} from 'expo-modules-core';
import {AppState} from 'react-native';
import {createPlusEntitlementStore} from './plus-entitlement-store';
import {createPlusBackupGate} from './plus-feature-gate';
import {createPlusDelivery} from './plus-delivery';

type NativeOwnership = {
 finishDeliveredLocalTransactions(): Promise<number>;
 recordLocalQAState?(status:string,entitlement:string): void;
 isConfigured(): boolean;
 isLocalTesting(): boolean;
 verifiedEntitlement(): Promise<unknown>;
 addListener(event:'entitlementsChanged', listener:()=>void): {remove():void};
};
const native=requireOptionalNativeModule<NativeOwnership>('CasitaDexPlusStore');
const configured=native?.isConfigured?.()===true;
export const plusEntitlements=createPlusEntitlementStore(configured&&native?{
 verifiedEntitlement:()=>native.verifiedEntitlement(),
 subscribe(listener){
  const subscription=native.addListener('entitlementsChanged',listener);
  return()=>subscription.remove();
 },
}:null);
/** Start at the app root, including the full-screen viewer route. Never calls purchase or sync. */
export function startPlusEntitlements(){
 const delivery=native?.isLocalTesting?.()===true?createPlusDelivery(
  ()=>native.finishDeliveredLocalTransactions(),
  error=>console.warn('[CasitaDex Plus QA] Delivery acknowledgement will retry on next verified refresh',error)
 ):null;
 const delivered=plusEntitlements.subscribe(()=>{void delivery?.reconcile(plusEntitlements.getSnapshot());});
 const log=native?.isLocalTesting?.()===true?plusEntitlements.subscribe(()=>{
  const s=plusEntitlements.getSnapshot();
  console.info('[CasitaDex Plus QA]',s.status,s.entitlement);
  native.recordLocalQAState?.(s.status,s.entitlement);
 }):()=>{};
 plusEntitlements.start();
 const foreground=AppState.addEventListener('change',state=>{if(state==='active')void plusEntitlements.refresh();});
 return()=>{foreground.remove();plusEntitlements.stop();log();delivered();delivery?.stop();};
}

// Qualify feature gates in isolated QA before enabling them in public builds.
export const plusFeatureEnforcementEnabled=configured&&native?.isLocalTesting?.()===true;
export const requirePlusBackup=createPlusBackupGate({enabled:plusFeatureEnforcementEnabled,refresh:plusEntitlements.refresh,getSnapshot:plusEntitlements.getSnapshot});

export const requireMemoryCapacity=createMemoryLimitGate({enabled:plusFeatureEnforcementEnabled,refresh:plusEntitlements.refresh,getSnapshot:plusEntitlements.getSnapshot});
