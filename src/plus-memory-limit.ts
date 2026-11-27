import type {EntitlementSnapshot} from './plus-entitlement-store';
export const FREE_MEMORY_LIMIT=20;
export function countedMemories(memories:readonly {lifecycle:string}[]):number{
 return memories.filter(memory=>memory.lifecycle!=='recently_deleted').length;
}
/** Active and archived count; drafts and Recently Deleted do not. No data is removed. */
export function createMemoryLimitGate(dependencies:{enabled:boolean;refresh():Promise<void>;getSnapshot():EntitlementSnapshot}){
 return async function requireMemoryCapacity(savedCount:number,additional=1,action:"save"|"restore"="save"):Promise<void>{
  if(!Number.isSafeInteger(savedCount)||savedCount<0||!Number.isSafeInteger(additional)||additional<1)throw Error("Invalid memory count");
  if(!dependencies.enabled||savedCount+additional<=FREE_MEMORY_LIMIT)return;
  await dependencies.refresh();
  const state=dependencies.getSnapshot();
  if(state.entitlement==='plus'&&(state.status==='ready'||state.status==='error'))return;
  if(state.status!=='ready')throw new Error('Unable to verify Plus right now. Try again. Your draft and existing memories are kept.');
  if(action==='restore')throw new Error('Free plan: restore requires an available slot (20 active and archived memories). Move another memory to Recently Deleted or choose CasitaDex Plus. Your deleted memories remain safe and shareable.');
  throw new Error('Your free plan includes 20 saved memories (active and archived). Recently Deleted does not count. Move a memory to Recently Deleted or choose CasitaDex Plus. Your draft and existing memories are kept.');
 };
}
