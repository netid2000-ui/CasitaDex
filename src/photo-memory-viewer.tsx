import React,{useCallback,useEffect,useMemo,useRef,useState} from 'react';
import {Alert,Image,PanResponder,Pressable,ScrollView,Text,View} from 'react-native';
import {SafeAreaProvider,SafeAreaView,initialWindowMetrics} from 'react-native-safe-area-context';
import {photoZoomScale,touchDistance,boundedPhotoPan,photoSwipeDirection} from './photo-zoom';
import {chooseEngPhoto,engPhotoUri,getEngStore} from './eng-runtime';
import {movedPhoto,orderedMemoryPhotos} from './photo-order';
import type {EngSnapshot} from './eng-types';
import {useData} from './state';
type Props={memoryId?:string;draftId?:string;initialPhotoId?:string;path?:string;label?:string;onClose:()=>void;onViewMemory?:()=>void;onChanged?:()=>void|Promise<void>};
export function PhotoMemoryViewer({memoryId,draftId,initialPhotoId,path,label,onClose,onViewMemory,onChanged}:Props){
 const [snapshot,setSnapshot]=useState<EngSnapshot|null>(null),[selectedId,setSelectedId]=useState(initialPhotoId??''),[busy,setBusy]=useState(false),[actions,setActions]=useState(false),[status,setStatus]=useState(''),[imageError,setImageError]=useState(false);
 const [sourceMode,setSourceMode]=useState<{replace:boolean;photoId?:string}|null>(null);
 const lock=useRef(false),alive=useRef(true);const actionsScrollRef=useRef<ScrollView|null>(null);const {large}=useData();const textScale=large?1.6:1;
 const [zoom,setZoom]=useState({scale:1,x:0,y:0});
 const [viewport,setViewport]=useState({width:0,height:0});
 const zoomRef=useRef({scale:1,x:0,y:0}),gestureRef=useRef({distance:0,scale:1,x:0,y:0,pageX:0,pageY:0,pinched:false,moved:false}),lastTap=useRef({at:0,x:0,y:0});
 const updateZoom=useCallback((next:{scale:number;x:number;y:number})=>{
  const scale=photoZoomScale(next.scale);
  const pan=boundedPhotoPan(next.x,next.y,scale,viewport.width,viewport.height);
  const value=scale===1?{scale:1,x:0,y:0}:{scale,...pan};
  zoomRef.current=value;setZoom(value);
 },[viewport.width,viewport.height]);
 const resetZoom=()=>updateZoom({scale:1,x:0,y:0});
 const responder=useMemo(()=>PanResponder.create({
  onStartShouldSetPanResponder:()=>true,onMoveShouldSetPanResponder:()=>true,
  onPanResponderGrant:event=>{const touches=event.nativeEvent.touches,first=touches[0];gestureRef.current={distance:touchDistance(touches),scale:zoomRef.current.scale,x:zoomRef.current.x,y:zoomRef.current.y,pageX:first?.pageX??0,pageY:first?.pageY??0,pinched:touches.length>1,moved:false};},
  onPanResponderMove:event=>{const touches=event.nativeEvent.touches,g=gestureRef.current;if(touches.length>1){const distance=touchDistance(touches);if(!g.distance){g.distance=distance;g.scale=zoomRef.current.scale;}g.pinched=true;g.moved=true;if(g.distance>0)updateZoom({...zoomRef.current,scale:g.scale*distance/g.distance});}else if(touches.length===1){const dx=touches[0].pageX-g.pageX,dy=touches[0].pageY-g.pageY;if(Math.hypot(dx,dy)>8)g.moved=true;if(zoomRef.current.scale>1)updateZoom({...zoomRef.current,x:g.x+dx,y:g.y+dy});}},
  onPanResponderRelease:()=>{const g=gestureRef.current;if(g.moved||g.pinched){lastTap.current.at=0;return;}const at=Date.now(),last=lastTap.current;if(at-last.at<450&&Math.hypot(g.pageX-last.x,g.pageY-last.y)<30){updateZoom({scale:zoomRef.current.scale>1?1:2,x:0,y:0});lastTap.current={at:0,x:0,y:0};}else lastTap.current={at,x:g.pageX,y:g.pageY};},
  onPanResponderTerminationRequest:()=>false,
 }),[updateZoom]);
 const refresh=useCallback(async()=>{const next=await(await getEngStore()).load();if(alive.current)setSnapshot(next);return next;},[]);
 useEffect(()=>{alive.current=true;if(memoryId||draftId)void refresh().catch(()=>{if(alive.current)setStatus('Unable to load photos. Your saved data was not changed.');});return()=>{alive.current=false;};},[memoryId,draftId,refresh]);
 const memory=snapshot?.data.memories.find(m=>m.id===memoryId);
 const draft=draftId&&snapshot?.draft?.id===draftId?snapshot.draft:null;
 const photos=snapshot?(draftId?(draft?.photos??[]):orderedMemoryPhotos(snapshot.data,memoryId??'')):[];
 const requestedIndex=photos.findIndex(p=>p.id===selectedId),index=requestedIndex>=0?requestedIndex:0,current=photos[index];
 function chooseOffset(step:number){
  const next=index+step;
  if(next<0||next>=photos.length)return;
  choose(photos[next].id);
 }
  function swipeAtTouchEnd(event:import('react-native').GestureResponderEvent){
  const gesture=gestureRef.current;
  const end=event.nativeEvent.changedTouches?.[0];
  if(!end||gesture.pinched||zoomRef.current.scale!==1)return;
  const step=photoSwipeDirection(end.pageX-gesture.pageX,end.pageY-gesture.pageY,zoomRef.current.scale);
  if(step){lastTap.current.at=0;chooseOffset(step);}
 }

 const fallbackPath=!memoryId&&!draftId?path:undefined;
 const title=memory?.title??draft?.title??label??'Photo';
 const editable=!!(draft||memory&&memory.lifecycle!=='recently_deleted');
 const control={minHeight:48,paddingHorizontal:14,paddingVertical:10,borderRadius:12,backgroundColor:'#263C32',borderColor:'#B3CBB7',borderWidth:1,justifyContent:'center' as const,alignItems:'center' as const};
 const controlText={color:'#FFFFFF',fontSize:15*textScale};
 function choose(id:string){resetZoom();setImageError(false);setSelectedId(id);setStatus('');}
 async function act(task:()=>Promise<unknown>,success:string){if(lock.current)return;lock.current=true;setBusy(true);try{await task();const next=await refresh();const updated=draftId?(next.draft?.id===draftId?next.draft.photos:[]):orderedMemoryPhotos(next.data,memoryId??'');if(alive.current){if(!updated.some(p=>p.id===selectedId))setSelectedId(updated[Math.min(index,Math.max(0,updated.length-1))]?.id??'');resetZoom();setImageError(false);setStatus(success);if(success==='Cover photo saved.'||success==='Photo order saved.'){setActions(false);actionsScrollRef.current?.scrollTo({y:0,animated:false});}}await onChanged?.();}catch(error){if(alive.current)setStatus(error instanceof Error?error.message:'Unable to save the photo change. Please try again.');}finally{lock.current=false;if(alive.current)setBusy(false);}}
 function pick(replace:boolean){if(busy||!editable)return;setSourceMode({replace,photoId:current?.id});}
 function runPick(source:boolean|'files'){const chosen=sourceMode;if(!chosen)return;setSourceMode(null);void act(async()=>{const bytes=await chooseEngPhoto(source);if(!bytes)return;const store=await getEngStore();if(draftId){if(chosen.replace&&chosen.photoId)await store.replacePhoto(draftId,chosen.photoId,bytes);else await store.addPhoto(draftId,bytes);}else if(memoryId){if(chosen.replace&&chosen.photoId)await store.replaceMemoryPhoto(memoryId,chosen.photoId,bytes);else await store.addMemoryPhoto(memoryId,bytes);}},'Photos checked and saved on this device.');}

 function remove(){if(!current||!editable||busy)return;const id=current.id;Alert.alert('Remove photo?',draftId?'Remove this photo from the unfinished memory? Other draft photos are kept.':'Remove this photo from this memory? Your previous full save remains recoverable.',[{text:'Cancel',style:'cancel'},{text:'Remove photo',style:'destructive',onPress:()=>void act(async()=>{const store=await getEngStore();if(draftId)await store.removePhoto(draftId,id);else if(memoryId)await store.removeMemoryPhoto(memoryId,id);},'Photo removed from this memory.')}]);}
 function arrange(destination:number){if(!memoryId||!current||!snapshot||busy)return;const ids=movedPhoto(photos.map(p=>p.id),current.id,destination);void act(async()=>{await(await getEngStore()).reorderMemoryPhotos(memoryId,ids,snapshot.revision);},destination===0?'Cover photo saved.':'Photo order saved.');}
 return <SafeAreaProvider initialMetrics={initialWindowMetrics}><SafeAreaView edges={['top','bottom']} style={{flex:1,backgroundColor:'#081611'}}>
  <View style={{padding:12,flexDirection:'row',alignItems:'center',gap:10}}><View style={{flex:1,gap:4}}><Text style={{color:'#FFFFFF',fontSize:16*textScale,fontWeight:'700'}}>{title}</Text><Text style={{color:'#FFFFFF',fontSize:14*textScale}}>{photos.length?`Photo ${index+1} of ${photos.length}${!draftId&&index===0?' · Cover':''}`:draftId?'Unfinished photo memory':'Photo'}</Text></View><Pressable accessibilityRole="button" accessibilityLabel="Close photo" disabled={busy} onPress={onClose} style={control}><Text style={controlText}>Close ×</Text></Pressable></View>
  <View {...responder.panHandlers} onTouchEnd={swipeAtTouchEnd}
   onLayout={event=>{const {width,height}=event.nativeEvent.layout;
    if(viewport.width!==width||viewport.height!==height)setViewport({width,height});}}
    collapsable={false} style={{flex:1,minHeight:80,overflow:'hidden'}}>{(current?.path||fallbackPath)&&!imageError?<View pointerEvents="none" key={current?.id??fallbackPath} style={{flex:1,transform:[{translateX:zoom.x},{translateY:zoom.y},{scale:zoom.scale}]}}><Image source={{uri:engPhotoUri(current?.path??fallbackPath!)}} resizeMode="contain" onError={()=>setImageError(true)} accessibilityLabel={`Photo ${index+1} of ${title}`} style={{width:'100%',height:'100%'}}/></View>:<Text style={{...controlText,textAlign:'center',padding:16}}>{imageError?'Unable to display this photo. Your saved memory is kept.':snapshot?'No photos available.':'Loading photo…'}</Text>}</View>
  <ScrollView ref={actionsScrollRef} style={{maxHeight:sourceMode?360:large?310:260}} contentContainerStyle={{padding:12,gap:10}}>
   {sourceMode?<View style={{gap:8}}><Text accessibilityRole="header" style={{...controlText,fontWeight:'700'}}>{sourceMode.replace?'Replace photo':'Add Photo'} · Choose a source</Text><Pressable accessibilityRole="button" accessibilityLabel="Take Photo" onPress={()=>runPick(true)} style={control}><Text style={controlText}>Take Photo</Text></Pressable><Pressable accessibilityRole="button" accessibilityLabel="Choose from Library" onPress={()=>runPick(false)} style={control}><Text style={controlText}>Choose from Library</Text></Pressable><Pressable accessibilityRole="button" accessibilityLabel="Browse Files" onPress={()=>runPick('files')} style={control}><Text style={controlText}>Browse Files</Text></Pressable><Pressable accessibilityRole="button" accessibilityLabel="Cancel" onPress={()=>{setSourceMode(null);setStatus('Photo selection canceled. Saved photos are kept.');}} style={control}><Text style={controlText}>Cancel</Text></Pressable></View>:<>
   <View style={{flexDirection:'row',flexWrap:'wrap',gap:8}}><Pressable accessibilityRole="button" accessibilityLabel="Previous photo" disabled={busy||index<=0} onPress={()=>choose(photos[index-1].id)} style={[control,{flex:1,opacity:index<=0?0.4:1}]}><Text style={controlText}>‹ Previous</Text></Pressable><Pressable accessibilityRole="button" accessibilityLabel="Next photo" disabled={busy||index>=photos.length-1} onPress={()=>choose(photos[index+1].id)} style={[control,{flex:1,opacity:index>=photos.length-1?0.4:1}]}><Text style={controlText}>Next ›</Text></Pressable></View>
   <View style={{flexDirection:'row',flexWrap:'wrap',gap:8}}>{onViewMemory?<Pressable accessibilityRole="button" accessibilityLabel={draftId?'Return to draft':'View associated memory details'} disabled={busy} onPress={onViewMemory} style={[control,{flexGrow:1}]}><Text style={controlText}>{draftId?'Return to draft':'View Memory'}</Text></Pressable>:null}<Pressable accessibilityRole="button" accessibilityLabel="Reset photo zoom" onPress={resetZoom} style={[control,{flexGrow:1}]}><Text style={controlText}>Reset zoom</Text></Pressable></View>
   <View style={{flexDirection:'row',flexWrap:'wrap',gap:8}}><Pressable accessibilityRole="button" accessibilityLabel="Zoom photo out" disabled={zoom.scale<=1} onPress={()=>updateZoom({...zoomRef.current,scale:zoomRef.current.scale/1.5})} style={[control,{flex:1,opacity:zoom.scale<=1?0.4:1}]}><Text style={controlText}>− Zoom</Text></Pressable><Pressable accessibilityRole="button" accessibilityLabel="Zoom photo in" disabled={zoom.scale>=4} onPress={()=>updateZoom({...zoomRef.current,scale:zoomRef.current.scale*1.5})} style={[control,{flex:1,opacity:zoom.scale>=4?0.4:1}]}><Text style={controlText}>+ Zoom</Text></Pressable></View>
   {editable?<Pressable accessibilityRole="button" accessibilityLabel={actions?'Hide photo actions':'Manage photos'} accessibilityState={{expanded:actions}} onPress={()=>setActions(!actions)} style={control}><Text style={controlText}>{actions?'Hide photo actions ▴':'Manage photos ▾'}</Text></Pressable>:null}
   {actions&&editable?<View style={{gap:8}}><Pressable accessibilityRole="button" accessibilityLabel="Add Photo" disabled={busy||photos.length>=5} onPress={()=>pick(false)} style={[control,{opacity:photos.length>=5?0.4:1}]}><Text style={controlText}>Add Photo · {photos.length}/5</Text></Pressable>{current?<><Pressable accessibilityRole="button" accessibilityLabel="Replace this photo" disabled={busy} onPress={()=>pick(true)} style={control}><Text style={controlText}>Replace photo</Text></Pressable><Pressable accessibilityRole="button" accessibilityLabel="Remove this photo" disabled={busy} onPress={remove} style={control}><Text style={controlText}>Remove photo</Text></Pressable>{!draftId?<><Pressable accessibilityRole="button" accessibilityLabel={index===0?'Current cover photo':'Use as cover photo'} disabled={busy||index===0} onPress={()=>arrange(0)} style={[control,{opacity:index===0?0.4:1}]}><Text style={controlText}>{index===0?'Cover photo ✓':'Use as cover'}</Text></Pressable><View style={{flexDirection:'row',flexWrap:'wrap',gap:8}}><Pressable accessibilityRole="button" accessibilityLabel="Move photo earlier" disabled={busy||index<=0} onPress={()=>arrange(index-1)} style={[control,{flexGrow:1,opacity:index<=0?0.4:1}]}><Text style={controlText}>Move earlier</Text></Pressable><Pressable accessibilityRole="button" accessibilityLabel="Move photo later" disabled={busy||index>=photos.length-1} onPress={()=>arrange(index+1)} style={[control,{flexGrow:1,opacity:index>=photos.length-1?0.4:1}]}><Text style={controlText}>Move later</Text></Pressable></View></>:null}</>:null}</View>:null}
   </>}
   {status?<Text accessibilityLiveRegion="polite" style={controlText}>{status}</Text>:null}
  </ScrollView>
 </SafeAreaView></SafeAreaProvider>;
}
