import type {PlusPurchaseState} from './plus-purchase-controller';
export function plusPurchaseMessage(result:PlusPurchaseState['result']){
 switch(result){
  case 'verified':return 'Purchase verified. Checking current Plus access…';
  case 'no-purchase':return 'No Plus purchase was found for this store account.';
  case 'pending':return 'Purchase is awaiting approval. Plus will update when the store confirms it.';
  case 'cancelled':return 'Purchase canceled. Your memories and photos are unchanged.';
  case 'error':return 'Unable to complete the store request. Please try again. Your memories and photos are unchanged.';
  case 'unavailable':return 'Purchases and restoration are unavailable in this preview. Your memories and photos are unchanged.';
  case 'busy':return 'A store request is already in progress.';
  default:return '';
 }
}
