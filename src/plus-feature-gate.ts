import type {EntitlementSnapshot} from './plus-entitlement-store';
export type BackupPlusAction='full-backup'|'restore-backup';
export function createPlusBackupGate(dependencies:{enabled:boolean;refresh():Promise<void>;getSnapshot():EntitlementSnapshot}) {
 return async function requirePlus(action:BackupPlusAction):Promise<void>{
  if(!dependencies.enabled||action==='restore-backup')return; // Collection-size validation is enforced in the serialized restore store.
  await dependencies.refresh();
  const state=dependencies.getSnapshot();
  if(state.entitlement==='plus'&&(state.status==='ready'||state.status==='error'||state.status==='cached'))return;
  if(state.status!=='ready')throw new Error('Unable to verify Plus right now. Try again. Your memories and photos are unchanged.');
  throw new Error('Creating or sharing a backup requires CasitaDex Plus. You can still save a readable text report.');
 };
}
