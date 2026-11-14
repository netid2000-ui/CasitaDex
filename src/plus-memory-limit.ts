import type {EntitlementSnapshot} from './plus-entitlement-store';
export const FREE_MEMORY_LIMIT=20;
/** Counts all retained saved memories; drafts do not count. Existing data is never removed. */
export function createMemoryLimitGate(dependencies:{enabled:boolean;refresh():Promise<void>;getSnapshot():EntitlementSnapshot}){
 return async function requireMemoryCapacity(savedCount:number):Promise<void>{
  if(!dependencies.enabled||savedCount<FREE_MEMORY_LIMIT)return;
  await dependencies.refresh();
  const state=dependencies.getSnapshot();
  if(state.entitlement==='plus'&&(state.status==='ready'||state.status==='error'))return;
  if(state.status!=='ready')throw new Error('Unable to verify Plus right now. Try again. Your draft and existing memories are kept.');
  throw new Error('Your free plan includes 20 saved memories, including archived and recently deleted memories. Open Settings → CasitaDex Plus to add more. Your draft is kept, and you can still view and edit existing memories.');
 };
}
