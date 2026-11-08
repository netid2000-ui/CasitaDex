import React,{useEffect,useState} from "react";
import {Alert,Image,Pressable,Text,View,useWindowDimensions} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {router,useLocalSearchParams} from "expo-router";
import {engPhotoUri,getEngStore} from "../eng-runtime";
import {Gesture,GestureDetector,GestureHandlerRootView} from "react-native-gesture-handler";
import Animated,{useAnimatedStyle,useSharedValue,withTiming} from "react-native-reanimated";

export default function FullScreenPhoto(){
 const {path,label,memoryId,photoId,draftId}=useLocalSearchParams<{path:string;label?:string;memoryId?:string;photoId?:string;draftId?:string}>();
 const window=useWindowDimensions();
 const [frame,setFrame]=useState({width:window.width,height:window.height});
 const [photos,setPhotos]=useState<{id:string;path:string}[]>([]);
 const [index,setIndex]=useState(0);
 const [busy,setBusy]=useState(false);
 const [photoError,setPhotoError]=useState(false);
 const scale=useSharedValue(1),startScale=useSharedValue(1);
 const pinch=Gesture.Pinch().onStart(()=>{startScale.value=scale.value;}).onUpdate(e=>{scale.value=Math.max(1,Math.min(4,startScale.value*e.scale));});
 const doubleTap=Gesture.Tap().numberOfTaps(2).onEnd(()=>{scale.value=withTiming(scale.value>1?1:2);});
 const zoomStyle=useAnimatedStyle(()=>({transform:[{scale:scale.value}]}));
 useEffect(()=>{let active=true;if(!memoryId&&!draftId)return;void getEngStore().then(store=>store.load()).then(snapshot=>{if(!active)return;const list=draftId&&snapshot.draft?.id===draftId?snapshot.draft.photos.map(p=>({id:p.id,path:p.path})):snapshot.data.media.media.filter(p=>p.cardId===memoryId).map(p=>({id:p.id,path:p.path}));setPhotos(list);setIndex(Math.max(0,list.findIndex(p=>p.id===photoId)));setPhotoError(!list.length);}).catch(()=>setPhotoError(true));return()=>{active=false;};},[memoryId,draftId,photoId]);
 const current=photos.length?photos[index]:null;
 const remove=()=>{if((!memoryId&&!draftId)||!current||busy)return;Alert.alert("Remove photo?",draftId?"Remove this photo from the unfinished memory? The other draft photos will be kept.":"The photo will be removed from this memory. Your previous save remains recoverable.",[{text:"Cancel",style:"cancel"},{text:"Remove photo",style:"destructive",onPress:()=>{setBusy(true);void getEngStore().then(store=>draftId?store.removePhoto(draftId,current.id):store.removeMemoryPhoto(memoryId!,current.id)).then(()=>{router.back();}).catch(()=>{Alert.alert("Unable to remove photo","The photo was not removed. Please try again.");}).finally(()=>setBusy(false));}}]);};
 const control={minHeight:44,paddingHorizontal:14,borderRadius:22,backgroundColor:"#263C32",borderColor:"#B3CBB7",borderWidth:1,justifyContent:"center" as const,alignItems:"center" as const};
 return <SafeAreaView edges={["top","bottom"]} style={{flex:1,backgroundColor:"#081611"}}>
  <View style={{minHeight:58,flexDirection:"row",justifyContent:"space-between",alignItems:"center",paddingHorizontal:16,gap:8}}>
   <Text style={{color:"#FFFFFF",fontSize:15,flex:1}}>{photos.length?`Photo ${index+1} of ${photos.length}`:(label||"Saved photo")}</Text>
   {current&&(memoryId||draftId)?<Pressable accessibilityRole="button" accessibilityLabel="Remove this photo" disabled={busy} onPress={remove} style={control}><Text style={{color:"#FFFFFF",fontSize:15}}>Remove</Text></Pressable>:null}
   <Pressable accessibilityRole="button" accessibilityLabel="Close photo" onPress={()=>router.back()} hitSlop={10} style={{...control,width:48,height:48,paddingHorizontal:0}}><Text style={{fontSize:27,fontWeight:"600",color:"#FFFFFF",lineHeight:33}}>{"\u00D7"}</Text></Pressable>
  </View>
  {memoryId?<Pressable accessibilityRole="button" accessibilityLabel="View associated memory details" onPress={()=>router.replace({pathname:"/card",params:{id:memoryId}})} style={[control,{alignSelf:"center",marginBottom:8}]}><Text style={{color:"#FFFFFF",fontSize:16,fontWeight:"700"}}>View Memory</Text></Pressable>:null}
  <GestureHandlerRootView style={{flex:1}}><View style={{flex:1,overflow:"hidden"}} onLayout={e=>setFrame({width:e.nativeEvent.layout.width,height:e.nativeEvent.layout.height})}>
   {(current?.path||path)?<GestureDetector gesture={Gesture.Simultaneous(pinch,doubleTap)}>
 <Animated.View key={current?.id??path} style={[{flex:1,alignItems:"center",justifyContent:"center"},zoomStyle]}>
 <Image source={{uri:engPhotoUri(current?.path??path!)}} accessibilityLabel={label||"Saved photo"} resizeMode="contain" style={{width:Math.max(frame.width,1),height:Math.max(frame.height,1)}}/>
 </Animated.View>
 </GestureDetector>:<Text style={{color:"#FFFFFF",textAlign:"center"}}>{photoError?"Unable to load this memory photo.":"Photo unavailable."}</Text>}
  </View>
  </GestureHandlerRootView>
  {photos.length>1?<View style={{flexDirection:"row",justifyContent:"space-between",padding:12,gap:12}}><Pressable accessibilityRole="button" accessibilityLabel="Previous photo" disabled={index===0} onPress={()=>{scale.set(1);setIndex(i=>Math.max(0,i-1));}} style={[control,{flex:1,opacity:index===0?0.4:1}]}><Text style={{color:"#FFFFFF",fontSize:17}}>{"\u2039 Previous"}</Text></Pressable><Pressable accessibilityRole="button" accessibilityLabel="Next photo" disabled={index===photos.length-1} onPress={()=>{scale.set(1);setIndex(i=>Math.min(photos.length-1,i+1));}} style={[control,{flex:1,opacity:index===photos.length-1?0.4:1}]}><Text style={{color:"#FFFFFF",fontSize:17}}>{"Next \u203A"}</Text></Pressable></View>:null}
 </SafeAreaView>;
}
