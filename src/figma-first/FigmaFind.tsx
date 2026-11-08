/** Figma-first Find: controlled query, read-only results and explicit detail navigation. */
import React from 'react';
import {Keyboard,Pressable,Text,TextInput,View} from 'react-native';
import type {MemoryV2} from '../sb20-contract';
import {useFigmaTheme} from './tokens';
export type FigmaFindProps={query:string;onQueryChange:(query:string)=>void;results:readonly MemoryV2[];onOpen:(id:string)=>void;pageSize:number;onPageSizeChange:(size:number)=>void;page:number;onPageChange:(page:number)=>void;onResultsLayout?:(y:number)=>void;hideSearchControls?:boolean};
export function FigmaFind({query,onQueryChange,results,onOpen,pageSize,onPageSizeChange,page,onPageChange,onResultsLayout,hideSearchControls=false}:FigmaFindProps){
 const fg=useFigmaTheme();
 const searching=query.trim().length>0;
 void pageSize;void onPageSizeChange;void page;void onPageChange;
 const filtered=results;
 const visible=filtered;
 return <View style={{backgroundColor:fg.page,padding:16,gap:12}}>
  {!hideSearchControls?<FindSearchControls query={query} onQueryChange={onQueryChange} results={results}/>:null}
  <View style={{gap:8}}>
    <Text accessibilityRole="header" style={{fontSize:19,fontWeight:"700",color:fg.headingInk}}>{searching?"Search results":"Browse memories"}</Text>
  </View>
  <View onLayout={event=>onResultsLayout?.(event.nativeEvent.layout.y)} style={{gap:12}}>
  {filtered.length===0?<Text style={{color:fg.secondaryInk}}>{searching?"Try a different search or fewer words.":"Your saved memories will appear here."}</Text>:visible.map(m=><Pressable key={m.id} accessibilityRole="button" accessibilityLabel={`Open ${m.mediaIds.length>0?"photo":"regular"} memory ${m.title}`} onPress={()=>onOpen(m.id)} style={{padding:14,minHeight:48,borderRadius:12,backgroundColor:fg.brandSurface,gap:4}}><Text style={{fontSize:12,fontWeight:"700",color:fg.secondaryInk}}>{m.mediaIds.length>0?`📷 Photo Memory · ${m.mediaIds.length} ${m.mediaIds.length===1?"photo":"photos"}`:"▤ Regular Memory"}</Text><Text style={{fontSize:17,fontWeight:'700',color:fg.headingInk}}>{m.title}</Text><Text numberOfLines={2} style={{color:fg.secondaryInk}}>{m.answer}</Text></Pressable>)}
  </View>

 </View>;
}

export function FindSearchControls({query,onQueryChange,results}:Pick<FigmaFindProps,"query"|"onQueryChange"|"results">){
 const fg=useFigmaTheme();
 const filteredCount=results.length;
 return <View style={{backgroundColor:fg.page,padding:12,gap:8,borderBottomWidth:1,borderBottomColor:fg.secondaryInk}}>
  <TextInput accessibilityLabel="Search memories" accessibilityHint="Search titles, answers and details" value={query} onChangeText={onQueryChange} placeholder="Search a memory, place, or part" placeholderTextColor={fg.secondaryInk} returnKeyType="search" onSubmitEditing={()=>Keyboard.dismiss()} style={{borderWidth:1,borderColor:fg.secondaryInk,borderRadius:12,padding:12,minHeight:48,color:fg.headingInk}}/>
 <Text style={{color:fg.secondaryInk}} accessibilityLiveRegion="polite">{filteredCount} {filteredCount===1?"memory":"memories"} found</Text>
 </View>;
}
