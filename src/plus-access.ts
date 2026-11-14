/** Approved Plus policy. Store verification and durable entitlement storage are adapter responsibilities. */
export const freeMemoryLimit = 20;
export type PlusEntitlement = 'free' | 'plus';
export type PlusAction = 'read' | 'edit' | 'search' | 'text-export' | 'restore-purchases' |
 'create-memory' | 'full-backup' | 'restore-backup' | 'photo-text-search' | 'photo-pdf';
export type PlusAccess = 'allowed' | 'upgrade-required' | 'invalid-count';
export function plusAccess(action: PlusAction, entitlement: PlusEntitlement, savedMemoryCount: number): PlusAccess {
 switch (action) {
  case 'read': case 'edit': case 'search': case 'text-export': case 'restore-purchases': return 'allowed';
  case 'create-memory':
   if (!Number.isSafeInteger(savedMemoryCount) || savedMemoryCount < 0) return 'invalid-count';
   return entitlement === 'plus' || savedMemoryCount < freeMemoryLimit ? 'allowed' : 'upgrade-required';
  case 'full-backup': case 'restore-backup': case 'photo-text-search': case 'photo-pdf':
   return entitlement === 'plus' ? 'allowed' : 'upgrade-required';
 }
}
