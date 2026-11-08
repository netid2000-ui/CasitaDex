import {useTheme} from '../ui';
import Constants from "expo-constants";
import {qaIllustrationBytes} from "../qa-illustration-bytes";

import {getEngStore,engPhotoUri} from '../eng-runtime';
import React,{useCallback,useRef,useState} from 'react';
import {Alert,Image,Modal,Pressable,ScrollView,Text,View} from 'react-native';
import {router,useFocusEffect} from 'expo-router';
import {Gesture,GestureDetector,GestureHandlerRootView} from 'react-native-gesture-handler';
import Animated,{useAnimatedStyle,useSharedValue,withTiming} from 'react-native-reanimated';
import {FigmaPhotos} from '../figma-first/FigmaPhotos';
import {photoSummaries} from '../figma-first/photo-summaries';
import type {EngSnapshot} from '../eng-types';
let preservedPhotosScrollY=0;
function NativePhotos(){
 const galleryScroll=useRef<ScrollView>(null);
 const restorePhotosScroll=useRef(false);
 const {colors}=useTheme();
 const [snapshot,setSnapshot]=useState<EngSnapshot|null>(null);
 const [error,setError]=useState('');
 const [selectedPhoto,setSelectedPhoto]=useState<{memoryId:string;photoId:string}|null>(null);
 const photoScale=useSharedValue(1);
 const startingScale=useSharedValue(1);
 const photoOffsetX=useSharedValue(0);
 const photoOffsetY=useSharedValue(0);
 const startingX=useSharedValue(0);
 const startingY=useSharedValue(0);
 const photoPinch=Gesture.Pinch().onStart(()=>{startingScale.value=photoScale.value;}).onUpdate(e=>{photoScale.value=Math.max(1,Math.min(4,startingScale.value*e.scale));});
 const photoPan=Gesture.Pan().onStart(()=>{startingX.value=photoOffsetX.value;startingY.value=photoOffsetY.value;}).onUpdate(e=>{if(photoScale.value>1){photoOffsetX.value=startingX.value+e.translationX;photoOffsetY.value=startingY.value+e.translationY;}});
 const photoDoubleTap=Gesture.Tap().numberOfTaps(2).onEnd(()=>{const next=photoScale.value>1?1:2;photoScale.value=withTiming(next);if(next===1){photoOffsetX.value=withTiming(0);photoOffsetY.value=withTiming(0);}});
 const photoTransform=useAnimatedStyle(()=>({transform:[{translateX:photoOffsetX.value},{translateY:photoOffsetY.value},{scale:photoScale.value}]}));
 const resetPhotoZoom=()=>{photoScale.set(1);photoOffsetX.set(0);photoOffsetY.set(0);};
 useFocusEffect(useCallback(()=>{let active=true;getEngStore().then(async store=>{let s=await store.load();if(Constants.expoConfig?.extra?.parityQaSeed===true){if(!s.data.memories.some(m=>m.id.startsWith("sb26qa_"))){await store.seedSyntheticQa();s=await store.load();}const fixtures=[{id:"sb26qa_001",image:"home"},{id:"sb26qa_007",image:"find"},{id:"sb26qa_013",image:"backup"}];for(const item of fixtures){try{const m=s.data.memories.find(m=>m.id===item.id);if(m&&m.mediaIds.length===0){await store.addMemoryPhoto(item.id,qaIllustrationBytes(item.image));s=await store.load();}}catch(fixtureError){console.warn('Optional QA sample photo unavailable',item.id,fixtureError);}}}return s;}).then(s=>{if(active){setSnapshot(s);setError('');restorePhotosScroll.current=true;requestAnimationFrame(()=>requestAnimationFrame(()=>galleryScroll.current?.scrollTo({y:preservedPhotosScrollY,animated:false})));}}).catch(photoLoadError=>{console.warn('Photo memories load failed',photoLoadError);if(active)setError('Unable to load photo memories. Your data was not changed.')});return()=>{active=false}},[]));
 const selectedMemory=snapshot?.data.memories.find(m=>m.id===selectedPhoto?.memoryId);
 const selectedPhotos=snapshot?.data.media.media.filter(p=>p.cardId===selectedPhoto?.memoryId)??[];
 const selectedIndex=selectedPhotos.findIndex(p=>p.id===selectedPhoto?.photoId);
 const selectedEntry=selectedIndex>=0?selectedPhotos[selectedIndex]:null;
 const galleryControl={backgroundColor:'#263C32',borderColor:'#B3CBB7',borderWidth:1,borderRadius:12,minHeight:48,paddingHorizontal:15,alignItems:'center' as const,justifyContent:'center' as const};
 const addPhotoMemory=()=>{if(!snapshot?.draft){router.push('/add?mode=photo');return;}Alert.alert('Unfinished memory','You already have a draft. Resume it or return to your photos. Your draft will not be replaced.',[{text:'Stay here',style:'cancel'},{text:'Resume draft',onPress:()=>router.push('/add?mode=photo')}]);};
 return <ScrollView ref={galleryScroll} onContentSizeChange={()=>{if(restorePhotosScroll.current){galleryScroll.current?.scrollTo({y:preservedPhotosScrollY,animated:false});restorePhotosScroll.current=false;}}} onScroll={event=>{if(!restorePhotosScroll.current)preservedPhotosScrollY=event.nativeEvent.contentOffset.y;}} scrollEventThrottle={100} contentContainerStyle={{flexGrow:1,backgroundColor:'transparent'}}>
 {error?<Text accessibilityLiveRegion='polite'>{error}</Text>:null}
 <FigmaPhotos items={snapshot?photoSummaries(snapshot.data).map(item=>({...item,photos:snapshot.data.media.media.filter(m=>m.cardId===item.id).map(m=>({id:m.id,uri:engPhotoUri(m.path)}))})):[]} onAdd={addPhotoMemory} onOpen={id=>router.push({pathname:'/card',params:{id}})} onViewPhoto={(memoryId,photoId)=>{resetPhotoZoom();setSelectedPhoto({memoryId,photoId});}}/>

 <Modal visible={!!selectedPhoto} transparent={false} animationType="fade" onRequestClose={()=>setSelectedPhoto(null)}><GestureHandlerRootView style={{flex:1}}><View style={{flex:1,backgroundColor:'#081611',paddingTop:54,paddingBottom:24,paddingHorizontal:12,gap:12}}><View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:10}}><Text style={{color:'#FFFFFF',fontSize:16,fontWeight:'700',flex:1}}>{selectedMemory?.title??'Photo'} · {selectedIndex+1} of {selectedPhotos.length}</Text><Pressable accessibilityRole="button" accessibilityLabel="Close photo" onPress={()=>{resetPhotoZoom();setSelectedPhoto(null);}} style={galleryControl}><Text style={{color:'#FFFFFF',fontSize:18}}>Close ×</Text></Pressable></View>{selectedEntry?<View style={{flex:1,overflow:"hidden"}}><GestureDetector gesture={Gesture.Simultaneous(photoPinch,photoPan,photoDoubleTap)}><Animated.View style={[{flex:1},photoTransform]}><Image source={{uri:engPhotoUri(selectedEntry.path)}} resizeMode="contain" style={{flex:1,width:"100%"}} accessibilityLabel={`Photo ${selectedIndex+1} of ${selectedMemory?.title??"memory"}`} /></Animated.View></GestureDetector></View>:<Text style={{color:'#FFFFFF',flex:1}}>Photo unavailable</Text>}<View style={{flexDirection:'row',gap:10}}><Pressable accessibilityRole="button" accessibilityLabel="Previous photo" disabled={selectedIndex<=0} onPress={()=>{resetPhotoZoom();setSelectedPhoto(old=>old&&selectedIndex>0?{...old,photoId:selectedPhotos[selectedIndex-1].id}:old);}} style={[galleryControl,{flex:1,opacity:selectedIndex<=0?0.4:1}]}><Text style={{color:'#FFFFFF'}}>‹ Previous</Text></Pressable><Pressable accessibilityRole="button" accessibilityLabel="Next photo" disabled={selectedIndex>=selectedPhotos.length-1} onPress={()=>{resetPhotoZoom();setSelectedPhoto(old=>old&&selectedIndex<selectedPhotos.length-1?{...old,photoId:selectedPhotos[selectedIndex+1].id}:old);}} style={[galleryControl,{flex:1,opacity:selectedIndex>=selectedPhotos.length-1?0.4:1}]}><Text style={{color:'#FFFFFF'}}>Next ›</Text></Pressable></View><Pressable accessibilityRole="button" accessibilityLabel="View associated memory details" onPress={()=>{const id=selectedPhoto?.memoryId;setSelectedPhoto(null);if(id)router.push({pathname:'/card',params:{id}});}} style={galleryControl}><Text style={{color:'#FFFFFF',fontSize:17,fontWeight:'700'}}>View Memory</Text></Pressable></View></GestureHandlerRootView></Modal>
 <View style={{padding:16}}><Pressable accessibilityRole='button' onPress={()=>router.push('/photos-manage')}><Text style={{fontSize:16,color:colors.ink,fontWeight:'700'}}>Manage saved photos</Text></Pressable></View>
 </ScrollView>;
}
export default function Photos(){return <NativePhotos/>;}