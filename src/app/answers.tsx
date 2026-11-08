import {getEngStore} from '../eng-runtime';
import React,{useCallback,useRef,useState} from 'react';
import {ScrollView,Text,View} from 'react-native';
import {router,useFocusEffect} from 'expo-router';
import {FigmaFind,FindSearchControls} from '../figma-first/FigmaFind';
import {findResults} from '../figma-first/view-models';
import {localDay} from '../eng-domain';
import type {EngSnapshot} from '../eng-types';
let preservedFindScrollY=0;
let preservedFindQuery = "";
let preservedFindPage = 0;
let preservedFindPageSize = 10;
function NativeFind(){
 const scrollRef=useRef<ScrollView>(null);
 const restoreFindScroll=useRef(false);
 const listTop=useRef(0);
 const resultsTop=useRef(0);
 const [snapshot,setSnapshot]=useState<EngSnapshot|null>(null);
 const [query,setQuery]=useState(preservedFindQuery);
 const [page,setPage]=useState(preservedFindPage);
 const [pageSize,setPageSize]=useState(preservedFindPageSize);
 const updateQuery=(value:string)=>{preservedFindScrollY=0;preservedFindQuery=value;setQuery(value);preservedFindPage=0;setPage(0);};
 const changePage=(value:number)=>{
  const goingForward=value>page;
  preservedFindScrollY=0;preservedFindPage=value;setPage(value);
  // Defer scrolling until React has committed the new page of results.
  requestAnimationFrame(()=>requestAnimationFrame(()=>{
   if(goingForward)scrollRef.current?.scrollTo({y:listTop.current+resultsTop.current,animated:false});
   else scrollRef.current?.scrollToEnd({animated:false});
  }));
 };
 const changePageSize=(value:number)=>{preservedFindPageSize=value;setPageSize(value);changePage(0);};
 const [error,setError]=useState('');
 useFocusEffect(useCallback(()=>{let active=true;getEngStore().then(s=>s.load()).then(s=>{if(active){setSnapshot(s);restoreFindScroll.current=true;requestAnimationFrame(()=>requestAnimationFrame(()=>scrollRef.current?.scrollTo({y:preservedFindScrollY,animated:false})));}}).catch(()=>{if(active)setError('Unable to load saved memories. Your data was not changed.')});return()=>{active=false}},[]));
 return <ScrollView stickyHeaderIndices={[0]} keyboardDismissMode="on-drag" ref={scrollRef} onContentSizeChange={()=>{if(restoreFindScroll.current){scrollRef.current?.scrollTo({y:preservedFindScrollY,animated:false});restoreFindScroll.current=false;}}} onScroll={event=>{if(!restoreFindScroll.current)preservedFindScrollY=event.nativeEvent.contentOffset.y;}} scrollEventThrottle={100} keyboardShouldPersistTaps="handled" contentContainerStyle={{flexGrow:1,backgroundColor:'transparent'}}>
 <FindSearchControls query={query} onQueryChange={updateQuery} results={snapshot?findResults(snapshot.data,query,localDay()):[]}/>
 {error?<Text accessibilityLiveRegion='polite'>{error}</Text>:null}
 <View onLayout={event=>{listTop.current=event.nativeEvent.layout.y;}}><FigmaFind hideSearchControls onResultsLayout={y=>{resultsTop.current=y;}} query={query} onQueryChange={updateQuery} results={snapshot?findResults(snapshot.data,query,localDay()):[]} onOpen={id=>router.push({pathname:'/card',params:{id}})} page={page} pageSize={pageSize} onPageChange={changePage} onPageSizeChange={changePageSize}/></View>
 </ScrollView>;
}
export default function Answers(){return <NativeFind/>;}