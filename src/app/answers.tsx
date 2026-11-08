import {getEngStore} from '../eng-runtime';
import React,{useCallback,useRef,useState} from 'react';
import {Pressable,ScrollView,Text,View} from 'react-native';
import {router,useFocusEffect,useLocalSearchParams} from 'expo-router';
import {FigmaFind,FindSearchControls} from '../figma-first/FigmaFind';
import {findResults} from '../figma-first/view-models';
import {useFigmaTheme} from '../figma-first/tokens';
import {findLifecycle} from '../eng-find';
import {localDay} from '../eng-domain';
import type {EngSnapshot} from '../eng-types';
import {readFindContext,saveFindContext} from '../find-context';
function NativeFind(){
 const fg=useFigmaTheme();
 const params=useLocalSearchParams<{lifecycle?:string}>();
 const lifecycle=findLifecycle(params.lifecycle),context=readFindContext(lifecycle);
 const preservedFindQuery=context.query,preservedFindPage=context.page,preservedFindPageSize=context.pageSize;
 const scrollRef=useRef<ScrollView>(null);
 const restoreFindScroll=useRef(false);
 const listTop=useRef(0);
 const resultsTop=useRef(0);
 const [snapshot,setSnapshot]=useState<EngSnapshot|null>(null);
 const [query,setQuery]=useState(preservedFindQuery);
 const [page,setPage]=useState(preservedFindPage);
 const [pageSize,setPageSize]=useState(preservedFindPageSize);
 const updateQuery=(value:string)=>{saveFindContext(lifecycle,{y:0,query:value,page:0});setQuery(value);setPage(0);};
 const changePage=(value:number)=>{
  const goingForward=value>page;
  saveFindContext(lifecycle,{y:0,page:value});setPage(value);
  // Defer scrolling until React has committed the new page of results.
  requestAnimationFrame(()=>requestAnimationFrame(()=>{
   if(goingForward)scrollRef.current?.scrollTo({y:listTop.current+resultsTop.current,animated:false});
   else scrollRef.current?.scrollToEnd({animated:false});
  }));
 };
 const changePageSize=(value:number)=>{saveFindContext(lifecycle,{pageSize:value});setPageSize(value);changePage(0);};
 const [photosOnly,setPhotosOnly]=useState(context.photosOnly);
 const togglePhotos=(value:boolean)=>{saveFindContext(lifecycle,{photosOnly:value,y:0,page:0});setPhotosOnly(value);setPage(0);};
 const [error,setError]=useState('');
 const restorePosition=useCallback(()=>{const preservedFindScrollY=readFindContext(lifecycle).y;scrollRef.current?.scrollTo({y:preservedFindScrollY,animated:false});},[lifecycle]);
 useFocusEffect(useCallback(()=>{let active=true;restoreFindScroll.current=true;const context=readFindContext(lifecycle);setError('');setQuery(context.query);setPage(context.page);setPageSize(context.pageSize);setPhotosOnly(context.photosOnly);getEngStore().then(s=>s.load()).then(s=>{if(active){setSnapshot(s);restoreFindScroll.current=true;requestAnimationFrame(()=>requestAnimationFrame(()=>{restorePosition();restoreFindScroll.current=false;}));}}).catch(()=>{if(active)setError('Unable to load saved memories. Your data was not changed.')});return()=>{active=false}},[lifecycle,restorePosition]));
 return <ScrollView stickyHeaderIndices={[0]} keyboardDismissMode="on-drag" ref={scrollRef} onContentSizeChange={()=>{if(restoreFindScroll.current){restorePosition();restoreFindScroll.current=false;}}} onScroll={event=>{if(!restoreFindScroll.current)saveFindContext(lifecycle,{y:event.nativeEvent.contentOffset.y});}} scrollEventThrottle={100} keyboardShouldPersistTaps="handled" contentContainerStyle={{flexGrow:1,backgroundColor:'transparent'}}>
 <View style={{backgroundColor:fg.page}}>{lifecycle!=="active"?<View style={{padding:12,gap:8}}><Text accessibilityRole="header" style={{color:fg.headingInk,fontSize:19,fontWeight:"700"}}>{lifecycle==="archived"?"Archived memories":"Recently Deleted memories"}</Text><Pressable accessibilityRole="button" accessibilityLabel="Return to active memories" onPress={()=>router.replace({pathname:"/answers",params:{lifecycle:"active"}})} style={{padding:12,minHeight:48}}><Text style={{color:fg.headingInk}}>Return to active memories</Text></Pressable></View>:null}
 <FindSearchControls photosOnly={photosOnly} onPhotosOnlyChange={togglePhotos} query={query} onQueryChange={updateQuery} results={snapshot?findResults(snapshot.data,query,localDay(),lifecycle,photosOnly):[]}/></View>
 {error?<Text accessibilityLiveRegion='polite'>{error}</Text>:null}
 <View onLayout={event=>{listTop.current=event.nativeEvent.layout.y;}}><FigmaFind hideSearchControls onResultsLayout={y=>{resultsTop.current=y;}} query={query} onQueryChange={updateQuery} results={snapshot?findResults(snapshot.data,query,localDay(),lifecycle,photosOnly):[]} onOpen={id=>router.push({pathname:'/card',params:{id}})} page={page} pageSize={pageSize} onPageChange={changePage} onPageSizeChange={changePageSize}/></View>
 </ScrollView>;
}
export default function Answers(){return <NativeFind/>;}