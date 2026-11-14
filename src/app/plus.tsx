import React,{useState} from 'react';
import {Pressable,ScrollView,Text,View} from 'react-native';
import {router} from 'expo-router';
import {useData} from '../state';
import {useFigmaTheme} from '../figma-first/tokens';
import {createPlusPurchaseController} from '../plus-purchase-controller';

// No store adapter is registered until verified native purchase/restore is available.
const purchases=createPlusPurchaseController(null);
export default function Plus(){
 const fg=useFigmaTheme(),{large}=useData();
 const [message,setMessage]=useState('');
 const scale=large?1.6:1;
 const text={color:fg.headingInk,fontSize:16*scale};
 const button={minHeight:48,padding:12,borderRadius:12,borderWidth:1,borderColor:fg.secondaryInk,justifyContent:'center' as const};
 async function restore(){
  const result=await purchases.restore();
  setMessage(result.result==='unavailable'?'Purchase restoration is not available in this preview. Your memories and photos have not changed.':'Unable to restore purchases. Please try again.');
 }
 return <View style={{flex:1,backgroundColor:fg.page}}>
  <View style={{padding:12,borderBottomWidth:1,borderBottomColor:fg.secondaryInk}}>
   <Pressable accessibilityRole="button" accessibilityLabel="Back to Settings" onPress={()=>router.replace('/more')} style={button}><Text style={text}>‹ Settings</Text></Pressable>
  </View>
  <ScrollView contentContainerStyle={{padding:16,gap:16}}>
   <Text accessibilityRole="header" style={{...text,fontSize:28*scale,fontWeight:'700'}}>CasitaDex Plus</Text>
   <Text style={text}>Remember more. Find it faster. Keep it safe.</Text>
   <Text style={text}>Free · 20 memories with photos, search, editing, and basic text export.</Text>
   <Text accessibilityRole="header" style={{...text,fontWeight:'700'}}>Plus · $19.99 once</Text>
   <Text style={text}>{'• Remove the plan’s memory-count limit\n• Full backup and restore, including photos\n• Move your memories to a new phone\n• Search text inside your photos\n• Create photo-rich PDF reports'}</Text>
   <Text style={text}>Your working data stays on your phone. No subscription or photo-storage fees. Device space and technical limits apply.</Text>
   <Text style={{...text,color:fg.secondaryInk}}>Preview · Plus features are being implemented. Purchases and the free-plan limit are not enabled in this build.</Text>
   <Pressable accessibilityRole="button" accessibilityLabel="Unlock Plus, unavailable in this preview" accessibilityState={{disabled:true}} disabled style={{...button,backgroundColor:fg.brandSurface}}><Text style={text}>Unlock Plus · $19.99 once</Text></Pressable>
   <Pressable accessibilityRole="button" onPress={()=>{void restore();}} style={button}><Text style={text}>Restore purchases</Text></Pressable>
   {message?<Text accessibilityLiveRegion="polite" style={text}>{message}</Text>:null}
   <Pressable accessibilityRole="button" onPress={()=>router.replace('/more')} style={button}><Text style={text}>Not now</Text></Pressable>
  </ScrollView>
 </View>;
}
