import type {PlusStoreAdapter, PurchaseOutcome} from './plus-purchase-controller';
import type {PlusEntitlement} from './plus-access';

export interface PlusNativeModule {
 purchaseForLocalTesting(): Promise<unknown>;
 restore(): Promise<unknown>;
 verifiedEntitlement(): Promise<unknown>;
}
function entitlement(value: unknown): PlusEntitlement {
 if(value !== 'free' && value !== 'plus') throw new Error('Invalid native entitlement');
 return value;
}
/** Explicit opt-in for isolated local QA. Public builds stay disconnected.
 * Native code independently blocks checkout outside Debug/Xcode/local QA identity.
 */
export function createLocalPlusAdapter(native: PlusNativeModule | null, localTesting: boolean): PlusStoreAdapter | null {
 if(!native || !localTesting) return null;
 return {
  async purchase(): Promise<PurchaseOutcome> {
   const result=await native.purchaseForLocalTesting();
   if(result !== 'completed' && result !== 'pending' && result !== 'cancelled') throw new Error('Invalid native purchase result');
   return result;
  },
  async restore() { entitlement(await native.restore()); },
  async verifiedEntitlement() { return entitlement(await native.verifiedEntitlement()); },
 };
}
