/** CasitaDex premium is additive. This module never blocks access to existing memories. */
export type PremiumStatus = 'free' | 'pending' | 'active' | 'expired' | 'revoked';
export function canUseOptionalPremium(status:PremiumStatus, trustedVerification:boolean):boolean {
 return status === 'active' && trustedVerification;
}
export function canAccessExistingMemories(_status:PremiumStatus):boolean { return true; }
export function afterStoreResult(current:PremiumStatus,result:'pending'|'cancelled'|'failed'|'verified'|'revoked'|'expired'):PremiumStatus {
 if(result==='verified') return 'active';
 if(result==='revoked') return 'revoked';
 if(result==='expired') return 'expired';
 if(result==='pending') return 'pending';
 return current==='active' ? 'active' : 'free';
}
