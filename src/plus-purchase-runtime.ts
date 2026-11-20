import {requireOptionalNativeModule} from 'expo-modules-core';
import {createLocalPlusAdapter,type PlusNativeModule} from './plus-native-adapter';
import {createPlusPurchaseController} from './plus-purchase-controller';

type LocalStore=PlusNativeModule&{isLocalTesting():boolean;isAppleSandbox?():boolean;catalog():Promise<{productID:string;displayPrice:string}>};
const native=requireOptionalNativeModule<LocalStore>('CasitaDexPlusStore');
export const appleSandbox=native?.isAppleSandbox?.()===true;
export const localPlusCheckout=native?.isLocalTesting?.()===true;
export const plusPurchases=createPlusPurchaseController(createLocalPlusAdapter(native,localPlusCheckout));
export async function localPlusPrice(){
 if(!localPlusCheckout||!native)return null;
 const catalog=await native.catalog();
 if(catalog.productID!==(appleSandbox?'com.designsbyfa.casitadex.plus':'local.casitadex.plus.qa')||typeof catalog.displayPrice!=='string'||!catalog.displayPrice.trim())throw Error('Local product unavailable');
 return catalog.displayPrice;
}
