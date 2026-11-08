import Constants from 'expo-constants';
import {useTheme} from '../ui';
import {getEngStore} from '../eng-runtime';
import React,{useCallback,useState} from 'react';
import {ScrollView,Text} from 'react-native';
import {router,useFocusEffect} from 'expo-router';
import {FigmaMemories} from '../figma-first/FigmaMemories';
import type {EngSnapshot} from '../eng-types';
function NativeMemories(){
 const {colors}=useTheme();
 const [snapshot,setSnapshot]=useState<EngSnapshot|null>(null);
 const [error,setError]=useState('');
 const [loaded,setLoaded]=useState(false);
 useFocusEffect(useCallback(()=>{let active=true;getEngStore().then(async store=>{let s=await store.load();if(Constants.expoConfig?.extra?.parityQaSeed===true&&!s.data.memories.some(m=>m.id.startsWith("sb26qa_"))){await store.seedSyntheticQa();s=await store.load();}return s;}).then(s=>{if(active){setSnapshot(s);setLoaded(true);}}).catch(()=>{if(active){setError('Unable to load saved memories. Your data was not changed.');setLoaded(true);}});return()=>{active=false}},[]));
 return <ScrollView contentContainerStyle={{flexGrow:1,backgroundColor:'transparent'}}>
 {error?<Text accessibilityLiveRegion='polite'>{error}</Text>:null}
 <Text accessibilityRole='text' style={{paddingHorizontal:20,paddingTop:12,fontWeight:'600',color:colors.ink}}>{!loaded?'Loading saved memories…':`${snapshot?.data.memories.filter(m=>m.lifecycle==='active').length??0} saved memories on this device`}</Text>
 <FigmaMemories memories={snapshot?.data.memories.filter(m=>m.lifecycle==='active')??[]} onOpen={id=>router.push({pathname:'/card',params:{id}})}/>
 </ScrollView>;
}
export default function Memories(){return <NativeMemories/>;}