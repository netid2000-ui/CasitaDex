import Constants from "expo-constants";
import {qaIllustrationBytes} from '../qa-illustration-bytes';
import React,{useCallback,useState} from 'react';
import {Alert,ScrollView,Text} from 'react-native';
import {router,useFocusEffect} from 'expo-router';
import {getEngStore} from '../eng-runtime';
import {FigmaHome} from '../figma-first/FigmaHome';
import type {EngSnapshot} from '../eng-types';
import type {HomeActionKind} from '../figma-first/HomeActionCard';
function FigmaNativeHome(){
 const [snapshot,setSnapshot]=useState<EngSnapshot|null>(null);
 const [error,setError]=useState('');
 useFocusEffect(useCallback(()=>{
  let active=true;
  getEngStore().then(async store=>{let s=await store.load();if(Constants.expoConfig?.extra?.parityQaSeed===true){if(!s.data.memories.some(m=>m.id.startsWith("sb26qa_"))){await store.seedSyntheticQa();s=await store.load();}const fixtures=[{id:"sb26qa_001",image:"home"},{id:"sb26qa_007",image:"find"},{id:"sb26qa_013",image:"backup"}];for(const item of fixtures){const m=s.data.memories.find(m=>m.id===item.id);if(m&&m.mediaIds.length===0){await store.addMemoryPhoto(item.id,qaIllustrationBytes(item.image));s=await store.load();}}}return s;}).then(s=>{if(active)setSnapshot(s)}).catch((error)=>{console.warn('SB40 Home startup/load failed',error);if(active)setError('Your saved memories could not be loaded. No data was changed.')});
  return ()=>{active=false};
 },[]));
 const action=(kind:HomeActionKind)=>{
  if(kind==='reminder'){router.push('/reminders-manage?mode=new&origin=home');return;}
  const target=kind==='photo'?'/add?mode=photo':'/add';
  const draft=snapshot?.draft;
  if(!draft){router.push(target);return;}
  Alert.alert('Unfinished memory', 'A draft is saved on this device. Resume it, or discard it before starting a new memory. Saved memories will not be deleted.',[
   {text:'Cancel',style:'cancel'},
   {text:'Resume draft',onPress:()=>router.push('/add')},
   {text:'Discard draft and start new',style:'destructive',onPress:()=>{void getEngStore().then(async store=>{
    const fresh=await store.load();
    if(fresh.draft)await store.discard(fresh.draft.id,fresh.draft.checkpoint);
    setSnapshot(await store.load());
    router.push(target);
   }).catch(()=>setError('Could not discard the draft. No saved memories were changed.'));}}
  ]);
 };
 return <ScrollView contentContainerStyle={{flexGrow:1,backgroundColor:'transparent'}}>
  {error?<Text accessibilityLiveRegion='polite' style={{padding:16,color:'#7C2929'}}>{error}</Text>:null}

  <FigmaHome draftPending={!!snapshot?.draft} onAction={action} onSettings={()=>router.push("/more")} onFind={()=>router.push("/answers")}/>

 </ScrollView>;
}
export default function Home(){return <FigmaNativeHome/>;}