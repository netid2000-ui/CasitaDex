import {ThemeMaterial} from "../platform/theme-material";
import {Button,useTheme} from '../ui';
import {filterFindResults,locationAfterSpaceChange} from '../find-filters';
import {plusFeatureEnforcementEnabled} from '../plus-entitlement-runtime';
import {getEngStore} from '../eng-runtime';
import React,{useCallback,useRef,useState} from 'react';
import {ScrollView,Text,View} from 'react-native';
import {router,useFocusEffect,useLocalSearchParams} from 'expo-router';
import {FigmaFind,FindSearchControls} from '../figma-first/FigmaFind';
import {findResults} from '../figma-first/view-models';
import {useFigmaTheme} from '../figma-first/tokens';
import {findLifecycle} from '../eng-find';
import {localDay} from '../eng-domain';
import type {EngSnapshot} from '../eng-types';
import {readFindContext,saveFindContext} from '../find-context';
function NativeFind(){
 const fg=useFigmaTheme();const {colors,dark}=useTheme();
 const params=useLocalSearchParams<{lifecycle?:string;fresh?:string;origin?:string}>();
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
   if(goingForward)scrollRef.current?.scrollTo({y:resultsTop.current,animated:false});
   else scrollRef.current?.scrollToEnd({animated:false});
  }));
 };
 const changePageSize=(value:number)=>{saveFindContext(lifecycle,{pageSize:value});setPageSize(value);changePage(0);};
 const [photosOnly,setPhotosOnly]=useState(context.photosOnly);
 const togglePhotos=(value:boolean)=>{saveFindContext(lifecycle,{photosOnly:value,y:0,page:0});setPhotosOnly(value);setPage(0);};
 const [spaceId,setSpaceId]=useState(context.spaceId??""),[categoryId,setCategoryId]=useState(context.categoryId??"");
 const [locationId,setLocationId]=useState(context.locationId??"");
 const changeLocation=(id:string)=>{setLocationId(id);setPage(0);saveFindContext(lifecycle,{locationId:id,y:0,page:0});};
 const changeSpace=(id:string)=>{const nextLocation=locationAfterSpaceChange(snapshot?.data,locationId,id);setSpaceId(id);setLocationId(nextLocation);setPage(0);saveFindContext(lifecycle,{spaceId:id,locationId:nextLocation,y:0,page:0});};
 const changeCategory=(id:string)=>{setCategoryId(id);setPage(0);saveFindContext(lifecycle,{categoryId:id,y:0,page:0});};
 const hasCriteria=Boolean(query.trim() || photosOnly || spaceId || categoryId || locationId);
 const clearCriteria=()=>{
  updateQuery("");togglePhotos(false);changeSpace("");changeCategory("");changeLocation("");
 };
 const results=snapshot?filterFindResults(findResults(snapshot.data,query,localDay(),lifecycle,photosOnly),snapshot.data,{spaceId,categoryId,locationId}):[];
 const [error,setError]=useState('');
 const restorePosition=useCallback(()=>{const preservedFindScrollY=readFindContext(lifecycle).y;scrollRef.current?.scrollTo({y:preservedFindScrollY,animated:false});},[lifecycle]);
 useFocusEffect(useCallback(()=>{void params.fresh;let active=true;restoreFindScroll.current=true;const context=readFindContext(lifecycle);setError('');setQuery(context.query);setPage(context.page);setPageSize(context.pageSize);setPhotosOnly(context.photosOnly);setSpaceId(context.spaceId??"");setCategoryId(context.categoryId??"");setLocationId(context.locationId??"");getEngStore().then(s=>s.load()).then(s=>{if(active){setSnapshot(s);restoreFindScroll.current=true;requestAnimationFrame(()=>requestAnimationFrame(()=>{restorePosition();restoreFindScroll.current=false;}));}}).catch(()=>{if(active)setError('Unable to load saved memories. Your data was not changed.')});return()=>{active=false}},[lifecycle,params.fresh,restorePosition,setError,setQuery,setPage,setPageSize,setPhotosOnly,setSpaceId,setCategoryId,setSnapshot]));
 return <ScrollView stickyHeaderIndices={[0]} keyboardDismissMode="on-drag" ref={scrollRef} onContentSizeChange={()=>{if(restoreFindScroll.current){restorePosition();restoreFindScroll.current=false;}}} onScroll={event=>{if(!restoreFindScroll.current)saveFindContext(lifecycle,{y:event.nativeEvent.contentOffset.y});}} scrollEventThrottle={100} keyboardShouldPersistTaps="handled" contentContainerStyle={{flexGrow:1,backgroundColor:'transparent'}}>
 <View style={{backgroundColor:fg.page}}>{params.origin==="settings"?<View style={{paddingHorizontal:18,paddingVertical:8}}><Button label="‹ Settings" onPress={()=>router.replace("/more")}/></View>:null}
 <ThemeMaterial testID="find-search-material" dark={dark} surface={colors.paper} accent={colors.focus} ink={colors.ink} style={{borderRadius:20,marginHorizontal:6,paddingVertical:2}}><FindSearchControls locationId={locationId} onLocationChange={changeLocation} spaceId={spaceId} categoryId={categoryId} onSpaceChange={changeSpace} onCategoryChange={changeCategory} iosTextView={plusFeatureEnforcementEnabled} photosOnly={photosOnly} onPhotosOnlyChange={togglePhotos} query={query} onQueryChange={updateQuery} results={results} data={snapshot?.data}/></ThemeMaterial></View>
 <View style={{paddingHorizontal:18,paddingVertical:8,flexDirection:"row",flexWrap:"wrap",gap:8}}>
  {(["active","archived","recently_deleted"] as const).map(scope=>{
   const label={active:"Active",archived:"Archived",recently_deleted:"Recently deleted"}[scope];
   return <Button key={scope} compact label={label} selected={scope===lifecycle} onPress={()=>{if(scope!==lifecycle)router.setParams({lifecycle:scope});}}/>;
  })}
 </View>
 {error?<Text accessibilityLiveRegion='polite'>{error}</Text>:null}
 <View onLayout={event=>{listTop.current=event.nativeEvent.layout.y;}}>{snapshot && !error?<FigmaFind lifecycle={lifecycle} onClearCriteria={hasCriteria?clearCriteria:undefined} hideSearchControls onResultsLayout={y=>{resultsTop.current=y;}} query={query} onQueryChange={updateQuery} results={results} data={snapshot?.data} onOpen={id=>router.push({pathname:'/card',params:{id,origin:'find'}})} page={page} pageSize={pageSize} onPageChange={changePage} onPageSizeChange={changePageSize}/>:null}</View>
 </ScrollView>;
}
export default function Answers(){return <NativeFind/>;}