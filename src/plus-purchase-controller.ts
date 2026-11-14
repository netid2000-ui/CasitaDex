import type {PlusEntitlement} from './plus-access';

export type PurchaseOutcome = 'completed' | 'pending' | 'cancelled';
/** Native adapter must verify store ownership, product, app, environment and revocation.
 * Never implement this interface using a backup flag or an unverified purchase callback.
 */
export interface PlusStoreAdapter {
 purchase(): Promise<PurchaseOutcome>;
 restore(): Promise<void>;
 verifiedEntitlement(): Promise<PlusEntitlement>;
}
export type PlusPurchaseState = {
 entitlement: PlusEntitlement;
 operation: 'idle' | 'purchase' | 'restore' | 'refresh';
 result: 'none' | 'unavailable' | 'busy' | 'pending' | 'cancelled' | 'verified' | 'no-purchase' | 'error';
};
/** No app data is accepted or changed here. Failed store calls preserve the last verified entitlement. */
export function createPlusPurchaseController(adapter: PlusStoreAdapter | null, initial: PlusEntitlement = 'free') {
 let state: PlusPurchaseState = {entitlement: initial, operation: 'idle', result: 'none'};
 const snapshot = (): PlusPurchaseState => ({...state});
 async function run(operation: 'purchase' | 'restore' | 'refresh'): Promise<PlusPurchaseState> {
  if (state.operation !== 'idle') return {...state, result: 'busy'};
  if (!adapter) {state = {...state, result: 'unavailable'}; return snapshot();}
  state = {...state, operation, result: 'none'};
  try {
   if (operation === 'purchase') {
    const outcome = await adapter.purchase();
    if (outcome === 'pending' || outcome === 'cancelled') {
     state = {...state, operation: 'idle', result: outcome}; return snapshot();
    }
    if (outcome !== 'completed') throw new Error('Invalid purchase outcome');
   } else if (operation === 'restore') await adapter.restore();
   // A completed checkout is not proof of ownership. Query the verifier before granting access.
   const entitlement = await adapter.verifiedEntitlement();
   if (entitlement !== 'free' && entitlement !== 'plus') throw new Error('Invalid entitlement');
   state = {...state, entitlement, result: entitlement === 'plus' ? 'verified' : 'no-purchase'};
  } catch {
   state = {...state, result: 'error'};
  } finally {
   state = {...state, operation: 'idle'};
  }
  return snapshot();
 }
 return {snapshot, purchase: () => run('purchase'), restore: () => run('restore'), refresh: () => run('refresh')};
}
