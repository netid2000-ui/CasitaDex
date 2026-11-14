import React,{useEffect,useState,useSyncExternalStore} from 'react';
import {Pressable,ScrollView,Text,View} from 'react-native';
import {router} from 'expo-router';
import {useData} from '../state';
import {useFigmaTheme} from '../figma-first/tokens';
import {localPlusCheckout,localPlusPrice,plusPurchases} from '../plus-purchase-runtime';
import {plusEntitlements} from '../plus-entitlement-runtime';
import {plusPurchaseMessage} from '../plus-purchase-message';

export default function Plus(){
 const fg=useFigmaTheme(),{large}=useData();
 const ownership=useSyncExternalStore(plusEntitlements.subscribe,plusEntitlements.getSnapshot,plusEntitlements.getSnapshot);
 const [message,setMessage]=useState(''),[busy,setBusy]=useState(false),[price,setPrice]=useState<string|null>(null);
 useEffect(()=>{let active=true;void localPlusPrice().then(value=>{if(active)setPrice(value);}).catch(()=>{if(active)setMessage('Store price is unavailable. Reopen Plus to try again.');});return()=>{active=false;};},[]);
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
  setBusy(true);setMessage(operation==='purchase'?'Opening local test purchase…':'Restoring purchases…');
  try{
   const result=await plusPurchases[operation]();
   await plusEntitlements.refresh();
   setMessage(result.result==='verified'&&plusEntitlements.getSnapshot().entitlement==='plus'?'Plus is active.':plusPurchaseMessage(result.result));
  }finally{setBusy(false);}
 }
 return <View style={{flex:1,backgroundColor:fg.page}}>
  <View style={{padding:12,gap:8,borderBottomWidth:1,borderBottomColor:fg.secondaryInk}}>
   <Pressable accessibilityRole="button" accessibilityLabel="Back to Settings" onPress={()=>router.replace('/more')} style={button}><Text style={text}>‹ Settings</Text></Pressable>
   <Pressable testID="plus-purchase" accessibilityRole="button" accessibilityState={{disabled:purchaseDisabled,busy}} disabled={purchaseDisabled} onPress={()=>{void run('purchase');}} style={{...button,backgroundColor:fg.brandSurface,opacity:purchaseDisabled?0.65:1}}><Text style={text}>{owned?'Plus active':localPlusCheckout?price?`Test Unlock Plus · ${price}`:'Loading test price…':'Unlock Plus · $19.99 once'}</Text></Pressable>
   <Pressable testID="plus-restore" accessibilityRole="button" accessibilityState={{disabled:busy,busy}} disabled={busy} onPress={()=>{void run('restore');}} style={button}><Text style={text}>Restore purchases</Text></Pressable>
   <Text testID="plus-ownership" accessibilityLiveRegion="polite" style={text}>{owned?'Verified Plus access':ownership.status==='ready'?'Free plan':ownership.status==='checking'?'Checking store ownership…':'Store ownership unavailable'}</Text>
   {message?<Text testID="plus-status" accessibilityLiveRegion="polite" style={text}>{message}</Text>:null}
  </View>
  <ScrollView contentContainerStyle={{padding:16,gap:16}}>
   <Text accessibilityRole="header" style={{...text,fontSize:28*scale,fontWeight:'700'}}>CasitaDex Plus</Text>
   <Text style={text}>Remember more. Find it faster. Keep it safe.</Text>
   <Text style={text}>Free · 20 memories with photos, search, editing, and basic text export.</Text>
   <Text accessibilityRole="header" style={{...text,fontWeight:'700'}}>Plus · $19.99 once</Text>
   <Text style={text}>{'• Remove the plan’s memory-count limit\n• Full backup and restore, including photos\n• Move your memories to a new phone\n• Search text inside your photos\n• Create photo-rich PDF reports'}</Text>
   <Text style={text}>Your working data stays on your phone. No subscription or photo-storage fees. Device space and technical limits apply.</Text>
   <Text style={{...text,color:fg.secondaryInk}}>{localPlusCheckout?'Local StoreKit testing only · No real charge. Backup and restore access are connected. Other Plus features and the free-plan limit are still being implemented.':'Preview · Plus features are being implemented. Purchases and the free-plan limit are not enabled in this build.'}</Text>
   <Pressable accessibilityRole="button" onPress={()=>router.replace('/more')} style={button}><Text style={text}>Not now</Text></Pressable>
  </ScrollView>
 </View>;
}
