import Constants from 'expo-constants';
import {Platform} from 'react-native';
import {requireOptionalNativeModule} from 'expo-modules-core';
import {createLocalPlusAdapter,type PlusNativeModule} from './plus-native-adapter';
import {createPlusPurchaseController} from './plus-purchase-controller';

type LocalStore=PlusNativeModule&{isLocalTesting():boolean;isAppleSandbox?():boolean;catalog():Promise<{productID:string;displayPrice:string}>};
const native=requireOptionalNativeModule<LocalStore>('CasitaDexPlusStore');
export const appleSandbox=native?.isAppleSandbox?.()===true;
export const localPlusCheckout=native?.isLocalTesting?.()===true;
export const plusPurchases=createPlusPurchaseController(createLocalPlusAdapter(native,localPlusCheckout));
const playProduct = Platform.OS === 'android' && Constants.expoConfig?.extra?.playCatalogProduct;
export const playCatalogEnabled = typeof playProduct === 'string' && !!playProduct;
export async function localPlusPrice(){
 if(playCatalogEnabled){
  const play=requireOptionalNativeModule<{price(id:string):Promise<string>}>('CasitaDexPlayCatalog');
  if(!play)throw Error('Play Billing unavailable');
  return play.price(playProduct);
 }
 if(!localPlusCheckout||!native)return null;
 const catalog=await native.catalog();
 if(catalog.productID!==(appleSandbox?'com.designsbyfa.casitadex.plus':'local.casitadex.plus.qa')||typeof catalog.displayPrice!=='string'||!catalog.displayPrice.trim())throw Error('Local product unavailable');
 return catalog.displayPrice;
}
