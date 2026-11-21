import React,{useEffect,useState,useSyncExternalStore} from 'react';
import {Pressable,ScrollView,Text,View} from 'react-native';
import {router} from 'expo-router';
import {useData} from '../state';
import {useFigmaTheme} from '../figma-first/tokens';
import {appleSandbox,playCatalogEnabled,localPlusCheckout,localPlusPrice,plusPurchases} from '../plus-purchase-runtime';
import {plusEntitlements} from '../plus-entitlement-runtime';
import {plusPurchaseMessage} from '../plus-purchase-message';

export default function Plus(){
 const fg=useFigmaTheme(),{large}=useData();
 const ownership=useSyncExternalStore(plusEntitlements.subscribe,plusEntitlements.getSnapshot,plusEntitlements.getSnapshot);
 const [message,setMessage]=useState(''),[busy,setBusy]=useState(false),[price,setPrice]=useState<string|null>(null);
 const [priceFailed,setPriceFailed]=useState(false);
 const [priceAttempt,setPriceAttempt]=useState(0);
 useEffect(()=>{
  if(!localPlusCheckout&&!playCatalogEnabled)return;
  let active=true;
  async function loadPrice(){
   try {
    const value=await localPlusPrice();
    if(active){setPrice(value);setPriceFailed(!value);}
   } catch {
    if(active)setPriceFailed(true);
   }
  }
  void loadPrice();
  return ()=>{active=false;};
 },[priceAttempt]);
 const scale=large?1.6:1;
 const text={color:fg.headingInk,fontSize:16*scale};
 const button={minHeight:48,padding:12,borderRadius:12,borderWidth:1,borderColor:fg.secondaryInk,justifyContent:'center' as const};
 const owned=ownership.entitlement==='plus';
 useEffect(()=>{
  let previous=plusEntitlements.getSnapshot().entitlement;
  return plusEntitlements.subscribe(()=>{
   const current=plusEntitlements.getSnapshot().entitlement;
   if(current!==previous){previous=current;setMessage(current==='plus'?'Plus is active.':'Plus is no longer active.');}
  });
 },[]);
 const purchaseDisabled=!localPlusCheckout||!price||busy||owned||ownership.status!=='ready';
 async function run(operation:'purchase'|'restore'){
  if(busy)return;
  setBusy(true);setMessage(operation==='purchase'?'Opening test purchase…':'Restoring purchases…');
  try{
   const result=await plusPurchases[operation]();
   await plusEntitlements.refresh();
   setMessage(result.result==='verified'&&plusEntitlements.getSnapshot().entitlement==='plus'?'Plus is active.':plusPurchaseMessage(result.result));
  }finally{setBusy(false);}
 }
 return <View style={{flex:1,backgroundColor:fg.page}}>
  <View style={{padding:12,gap:8,borderBottomWidth:1,borderBottomColor:fg.secondaryInk}}>
   <Pressable accessibilityRole="button" accessibilityLabel="Back to Settings" onPress={()=>router.replace('/more')} style={button}><Text style={text}>‹ Settings</Text></Pressable>
   <Pressable testID="plus-purchase" accessibilityRole="button" accessibilityState={{disabled:purchaseDisabled,busy}} disabled={purchaseDisabled} onPress={()=>{void run('purchase');}} style={{...button,backgroundColor:fg.brandSurface,opacity:purchaseDisabled?0.65:1}}><Text style={text}>{owned?'Plus active':localPlusCheckout?price?`Test Unlock Plus · ${price}`:priceFailed?'Plus purchase unavailable':'Loading test price…' :playCatalogEnabled?(price?'Play Store price · '+price:priceFailed?'Play Store price unavailable':'Checking Play Store price…'):'Plus purchases unavailable'}</Text></Pressable>
   {priceFailed&&!owned&&<Pressable testID="plus-retry-price" accessibilityRole="button" style={button} onPress={()=>{
    setPriceFailed(false);
    setMessage('');
    setPriceAttempt(attempt=>attempt+1);
   }}><Text style={text}>Retry store price</Text></Pressable>}
   <Pressable testID="plus-restore" accessibilityRole="button" accessibilityState={{disabled:busy,busy}} disabled={busy} onPress={()=>{void run('restore');}} style={button}><Text style={text}>Restore purchases</Text></Pressable>
   <Text testID="plus-ownership" accessibilityLiveRegion="polite" style={text}>{owned?'Verified Plus access':ownership.status==='ready'?'Free plan':ownership.status==='checking'?'Checking store ownership…':'Store ownership unavailable'}</Text>
   {message?<Text testID="plus-status" accessibilityLiveRegion="polite" style={text}>{message}</Text>:null}
  </View>
  <ScrollView contentContainerStyle={{padding:16,gap:16}}>
   <Text accessibilityRole="header" style={{...text,fontSize:28*scale,fontWeight:'700'}}>CasitaDex plans</Text>
   <Text accessibilityRole="header" style={{...text,fontWeight:'700'}}>Free</Text>
   <Text style={text}>Save up to 20 memories with photos. Search, edit, and export them as basic text.</Text>
   <Text accessibilityRole="header" style={{...text,fontWeight:'700'}}>Plus · US$25.99 once</Text>
   <Text style={text}>Remove the memory-count limit. Get full backup and recovery, including photos, and move your memories to a new device.</Text>
   <Text style={{...text,color:fg.secondaryInk}}>{playCatalogEnabled?(localPlusCheckout?'Google Play test checkout. Select a test payment method.':'Google Play price preview. Checkout is unavailable in this build.'):appleSandbox?'Apple sandbox test purchase.':localPlusCheckout?'Local StoreKit testing only · No real charge. Backup and restore access are connected. Other Plus features and the free-plan limit are still being implemented.':'Preview · Plus features are being implemented. Purchases and the free-plan limit are not enabled in this build.'}</Text>
   <Pressable accessibilityRole="button" onPress={()=>router.replace('/more')} style={button}><Text style={text}>Not now</Text></Pressable>
  </ScrollView>
 </View>;
}
