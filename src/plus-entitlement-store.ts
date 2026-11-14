import type {PlusEntitlement} from './plus-access';
export type EntitlementSnapshot = Readonly<{entitlement: PlusEntitlement; status: 'unavailable'|'checking'|'ready'|'error'}>;
export interface EntitlementSource {
 verifiedEntitlement(): Promise<unknown>;
 subscribe(listener:()=>void): ()=>void;
}
/** Events invalidate ownership; only a fresh verified query can change it.
 * Coalesces overlapping events and ignores completions after stop/restart.
 */
export function createPlusEntitlementStore(source: EntitlementSource|null) {
 let state: EntitlementSnapshot=Object.freeze({entitlement:'free',status:'unavailable'});
 const listeners=new Set<()=>void>();
 let active=false, epoch=0, running=false, dirty=false;
 let unsubscribe:(()=>void)|undefined;
 const publish=(next:EntitlementSnapshot)=>{state=Object.freeze(next);for(const listener of listeners)listener();};
 async function refresh() {
  if(!active||!source)return;
  dirty=true;if(running)return;
  running=true;const token=epoch;
  try {
   while(dirty&&active&&token===epoch){
    dirty=false;publish({...state,status:'checking'});
    try {
     const value=await source.verifiedEntitlement();
     if(!active||token!==epoch)return;
     if(value!=='free'&&value!=='plus')throw new Error('Invalid verified entitlement');
     // If an event arrived during the query, discard the potentially stale result.
     if(!dirty)publish({entitlement:value,status:'ready'});
    }catch{
     if(active&&token===epoch&&!dirty)publish({...state,status:'error'});
    }
   }
  }finally{if(token===epoch)running=false;}
 }
 function start(){
  if(active)return;
  active=true;epoch++;
  if(!source)return;
  try{unsubscribe=source.subscribe(()=>{void refresh();});}catch{publish({...state,status:'error'});}
  void refresh();
 }
 function stop(){
  active=false;epoch++;running=false;dirty=false;unsubscribe?.();unsubscribe=undefined;
 }
 return {start,stop,refresh,getSnapshot:()=>state,subscribe:(listener:()=>void)=>{listeners.add(listener);return()=>{listeners.delete(listener);};}};
}
