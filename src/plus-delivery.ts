import type {EntitlementSnapshot} from './plus-entitlement-store';
/** Only the local QA product uses this coordinator until all Plus delivery is qualified. */
export function createPlusDelivery(finish:()=>Promise<unknown>,onError:(error:unknown)=>void){
 let running=false,stopped=false;
 return {
  async reconcile(state:EntitlementSnapshot){
   if(stopped||running||state.status!=='ready'||state.entitlement!=='plus')return;
   running=true;
   try{await finish();}catch(error){onError(error);}finally{running=false;}
  },
  stop(){stopped=true;}
 };
}
