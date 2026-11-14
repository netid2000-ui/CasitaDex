import {useTheme} from '../ui';
import Constants from 'expo-constants';
import {qaIllustrationBytes} from '../qa-illustration-bytes';
import {getEngStore,engPhotoUri} from '../eng-runtime';
import React,{useCallback,useEffect,useRef,useState,useMemo} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert,Modal,ScrollView,Text,View} from 'react-native';
import {router,useFocusEffect} from 'expo-router';
import {FigmaPhotos,PhotoWorkspaceControls,type PhotoView} from '../figma-first/FigmaPhotos';
import {photoWorkspaceItems,type PhotoSort} from '../figma-first/photo-summaries';
import {PhotoMemoryViewer} from '../photo-memory-viewer';
import type {EngSnapshot} from '../eng-types';
let preservedPhotosScrollY=0;
const preferencesKey='casitadex-photo-workspace-v1';
function NativePhotos(){
 const galleryScroll=useRef<ScrollView>(null),restorePhotosScroll=useRef(false),preferencesTouched=useRef(false);
 const itemOffsets=useRef(new Map<string,number>()),anchor=useRef<{id:string;inset:number}|null>(null);
 const {colors}=useTheme();
 const [snapshot,setSnapshot]=useState<EngSnapshot|null>(null),[error,setError]=useState('');
 const [view,setView]=useState<PhotoView>('grid'),[sort,setSort]=useState<PhotoSort>('updated');
 const [selectedPhoto,setSelectedPhoto]=useState<{memoryId:string;photoId:string}|null>(null);
 const refreshPhotos=useCallback(async()=>{try{setSnapshot(await(await getEngStore()).load());}catch{setError('Unable to refresh photos. Your saved data is kept.');}},[]);
 useEffect(()=>{let active=true;void AsyncStorage.getItem(preferencesKey).then(raw=>{if(!active||preferencesTouched.current||!raw)return;try{const p=JSON.parse(raw);if(p.view==='grid'||p.view==='compact')setView(p.view);if(p.sort==='updated'||p.sort==='added')setSort(p.sort);}catch{/* Invalid presentation preferences never affect saved memories. */}}).catch(()=>{});return()=>{active=false;};},[]);
 function rememberPhoto(id:string){anchor.current={id,inset:preservedPhotosScrollY-(itemOffsets.current.get(id)??preservedPhotosScrollY)};}
 function closeViewer(){setSelectedPhoto(null);const saved=anchor.current;if(saved)requestAnimationFrame(()=>requestAnimationFrame(()=>{const y=itemOffsets.current.get(saved.id);if(y!==undefined){preservedPhotosScrollY=Math.max(0,y+saved.inset);galleryScroll.current?.scrollTo({y:preservedPhotosScrollY,animated:false});}}));}
 function presentation(nextView:PhotoView,nextSort:PhotoSort){preferencesTouched.current=true;preservedPhotosScrollY=0;galleryScroll.current?.scrollTo({y:0,animated:false});setView(nextView);setSort(nextSort);void AsyncStorage.setItem(preferencesKey,JSON.stringify({view:nextView,sort:nextSort})).catch(()=>setError('Gallery preference could not be saved. Memories and photos are kept.'));}
 useFocusEffect(useCallback(()=>{let active=true;getEngStore().then(async store=>{let s=await store.load();if(Constants.expoConfig?.extra?.parityQaSeed===true){if(!s.data.memories.some(m=>m.id.startsWith("sb26qa_"))){await store.seedSyntheticQa();s=await store.load();}const fixtures=[{id:"sb26qa_001",image:"home"},{id:"sb26qa_007",image:"find"},{id:"sb26qa_013",image:"backup"}];for(const item of fixtures){try{const m=s.data.memories.find(m=>m.id===item.id);if(m&&m.mediaIds.length===0){await store.addMemoryPhoto(item.id,qaIllustrationBytes(item.image));s=await store.load();}}catch(fixtureError){console.warn('Optional QA sample photo unavailable',item.id,fixtureError);}}}return s;}).then(s=>{if(active){setSnapshot(s);setError('');restorePhotosScroll.current=true;requestAnimationFrame(()=>requestAnimationFrame(()=>galleryScroll.current?.scrollTo({y:preservedPhotosScrollY,animated:false})));}}).catch(photoLoadError=>{console.warn('Photo memories load failed',photoLoadError);if(active)setError('Unable to load photo memories. Your data was not changed.')});return()=>{active=false}},[]));

 const galleryItems=useMemo(()=>snapshot?photoWorkspaceItems(snapshot.data,sort,engPhotoUri):[],[snapshot,sort]);
 const addPhotoMemory=()=>{if(!snapshot?.draft){router.push('/add?mode=photo');return;}Alert.alert('Unfinished memory','You already have a draft. Resume it or return to your photos. Your draft will not be replaced.',[{text:'Stay here',style:'cancel'},{text:'Resume draft',onPress:()=>router.push('/add?mode=photo')}]);};
 return <View style={{flex:1}}><PhotoWorkspaceControls onAdd={addPhotoMemory} view={view} sort={sort} onViewChange={value=>presentation(value,sort)} onSortChange={value=>presentation(view,value)}/><ScrollView ref={galleryScroll} onContentSizeChange={()=>{if(restorePhotosScroll.current){galleryScroll.current?.scrollTo({y:preservedPhotosScrollY,animated:false});restorePhotosScroll.current=false;}}} onScroll={event=>{if(!restorePhotosScroll.current)preservedPhotosScrollY=event.nativeEvent.contentOffset.y;}} scrollEventThrottle={100} contentContainerStyle={{flexGrow:1,backgroundColor:'transparent'}}>
 {error?<Text accessibilityLiveRegion="polite" style={{color:colors.ink}}>{error}</Text>:null}
 <FigmaPhotos hideControls onItemLayout={(id,y)=>itemOffsets.current.set(id,y)} view={view} sort={sort} onViewChange={value=>presentation(value,sort)} onSortChange={value=>presentation(view,value)} draft={snapshot?.draft?.photos.length?{title:snapshot.draft.title,photoCount:snapshot.draft.photos.length}:undefined} onResumeDraft={()=>router.push('/add?mode=photo')} items={galleryItems} onAdd={addPhotoMemory} onOpen={id=>router.push({pathname:'/card',params:{id}})} onViewPhoto={(memoryId,photoId)=>{rememberPhoto(memoryId);setSelectedPhoto({memoryId,photoId});}}/>
 <Modal visible={!!selectedPhoto} transparent={false} animationType="fade" onRequestClose={closeViewer}>{selectedPhoto?<PhotoMemoryViewer memoryId={selectedPhoto.memoryId} initialPhotoId={selectedPhoto.photoId} onClose={closeViewer} onChanged={refreshPhotos} onViewMemory={()=>{const id=selectedPhoto.memoryId;setSelectedPhoto(null);router.push({pathname:'/card',params:{id}});}}/>:null}</Modal>

 </ScrollView></View>;
}
export default function Photos(){return <NativePhotos/>;}
