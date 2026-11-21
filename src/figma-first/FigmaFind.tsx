import {findLocationChoices,findPage} from "../find-filters";
import React,{useState} from "react";
import {Keyboard,Modal,Platform,Pressable,ScrollView,Text,TextInput,View} from "react-native";
import type {MemoryV2,DataV2} from "../sb20-contract";
import {useTheme,Button} from "../ui";
import {useData} from "../state";
import {editorialFonts} from "../theme";
import {PhotoPreview} from "../photo-preview";
import {engPhotoUri} from "../eng-runtime";
export type FigmaFindProps={lifecycle?:MemoryV2["lifecycle"];onClearCriteria?:()=>void;query:string;onQueryChange:(query:string)=>void;results:readonly MemoryV2[];onOpen:(id:string)=>void;pageSize:number;onPageSizeChange:(size:number)=>void;page:number;onPageChange:(page:number)=>void;onResultsLayout?:(y:number)=>void;hideSearchControls?:boolean;data?:DataV2};
export function FigmaFind({lifecycle="active",onClearCriteria,query,onQueryChange,results,onOpen,page,pageSize,onPageChange,onResultsLayout,hideSearchControls=false,data}:FigmaFindProps){
 const {colors}=useTheme(),{large}=useData(),scale=large?1.6:1;const media=new Map(data?.media.media.map(p=>[p.id,p]));
 const emptyCollection={active:"Your saved memories will appear here.",archived:"No archived memories.",recently_deleted:"No recently deleted memories."};
 const paging=findPage(results,page,pageSize);
 const navigation=()=>paging.pages>1?<View style={{flexDirection:"row",flexWrap:"wrap",alignItems:"center",gap:8}}><Button compact label="Previous" disabled={paging.page===0} onPress={()=>onPageChange(paging.page-1)}/><Text style={{color:colors.ink}}>Page {paging.page+1} of {paging.pages}</Text><Button compact label="Next" disabled={paging.page===paging.pages-1} onPress={()=>onPageChange(paging.page+1)}/></View>:null;
 return <View style={{backgroundColor:colors.paper,padding:18,gap:12}}>
 {!hideSearchControls?<FindSearchControls query={query} onQueryChange={onQueryChange} results={results}/>:null}
 <Text accessibilityLiveRegion="polite" style={{fontFamily:editorialFonts.body,fontSize:13*scale,color:colors.ink}}>{results.length} {results.length===1?"result":"results"}</Text>
 {navigation()}
 <View onLayout={event=>onResultsLayout?.(event.nativeEvent.layout.y)}>{results.length===0?<View style={{gap:8}}><Text style={{color:colors.muted}}>{onClearCriteria?"No memories match your search or filters.":emptyCollection[lifecycle]}</Text>{onClearCriteria?<Button variant="quiet" label="Clear search and filters" onPress={onClearCriteria}/>:null}</View>:paging.items.map(m=>{const photo=media.get(m.mediaIds[0]);return <Pressable key={m.id} accessibilityRole="button" accessibilityLabel={`Open ${m.mediaIds.length>0?"photo":"regular"} memory ${m.title}`} onPress={()=>onOpen(m.id)} style={{minHeight:90,paddingVertical:8,borderBottomWidth:1,borderColor:colors.separator,flexDirection:"row",alignItems:"center",gap:12}}>
 {photo?<PhotoPreview uri={engPhotoUri(photo.path)} label={m.title} style={{width:68,height:68,borderRadius:8}}/>:null}<View style={{flex:1,gap:3}}><Text style={{fontFamily:editorialFonts.heading,fontSize:24*scale,color:colors.ink}}>{m.title}</Text><Text numberOfLines={2} style={{fontFamily:editorialFonts.body,fontSize:15*scale,color:colors.ink}}>{m.answer}</Text><Text style={{fontFamily:editorialFonts.body,fontSize:12*scale,color:colors.muted}}>{[data?.spaces.find(s=>s.id===m.spaceId)?.name,...m.categoryIds.map(id=>data?.categories.find(c=>c.id===id)?.name)].filter(Boolean).join(" · ")}</Text></View><Text style={{color:colors.ink,fontSize:22}}>›</Text></Pressable>;})}</View>
 {navigation()}
 </View>;
}
type Filters={spaceId?:string;categoryId?:string;locationId?:string;onLocationChange?:(id:string)=>void;onSpaceChange?:(id:string)=>void;onCategoryChange?:(id:string)=>void;data?:DataV2};
export function FindSearchControls({query,onQueryChange,photosOnly=false,onPhotosOnlyChange,iosTextView=false,data,spaceId="",categoryId="",locationId="",onLocationChange,onSpaceChange,onCategoryChange}:Pick<FigmaFindProps,"query"|"onQueryChange"|"results">&Filters&{iosTextView?:boolean;photosOnly?:boolean;onPhotosOnlyChange?:(value:boolean)=>void}){
 const {colors}=useTheme(),{large}=useData();const scale=large?1.6:1;
 const [picker,setPicker]=useState<"space"|"category"|"location"|null>(null);
 const choices=picker==="location"?(data?findLocationChoices(data,spaceId):[]):((picker==="space"?data?.spaces:data?.categories)?.slice().sort((a,b)=>a.name.localeCompare(b.name))??[]).map(c=>({...c,label:c.name}));
 const selectedId=picker==="space"?spaceId:picker==="location"?locationId:categoryId;
 const choose=picker==="space"?onSpaceChange:picker==="location"?onLocationChange:onCategoryChange;
 const locationLabel=data?findLocationChoices(data,spaceId).find(l=>l.id===locationId)?.label:undefined;
 return <View style={{backgroundColor:colors.paper,paddingHorizontal:18,paddingBottom:16,gap:14,borderBottomWidth:1,borderBottomColor:colors.separator}}>
 <TextInput testID="find-query" multiline={iosTextView&&Platform.OS==="ios"} submitBehavior={iosTextView&&Platform.OS==="ios"?"blurAndSubmit":undefined} accessibilityLabel="Search memories" accessibilityHint="Search titles, descriptions and details" value={query} onChangeText={onQueryChange} placeholder="Search memories…" placeholderTextColor={colors.onPrimary} returnKeyType="search" onSubmitEditing={()=>Keyboard.dismiss()} style={{fontFamily:editorialFonts.body,fontSize:15*scale,borderRadius:8,padding:12,minHeight:48,backgroundColor:colors.primary,color:colors.onPrimary}}/>
 {query.length>0?<View style={{alignSelf:"flex-start"}}><Button compact variant="quiet" label="Clear search" onPress={()=>onQueryChange("")}/></View>:null}
 <View style={{flexDirection:"row",flexWrap:"wrap",gap:8}}>
 {onSpaceChange?<Button compact label={(data?.spaces.find(s=>s.id===spaceId)?.name??"Space")+"  ▾"} selected={!!spaceId} onPress={()=>setPicker("space")}/>:null}
 {onCategoryChange?<Button compact label={(data?.categories.find(c=>c.id===categoryId)?.name??"Category")+"  ▾"} selected={!!categoryId} onPress={()=>setPicker("category")}/>:null}
 {onLocationChange?<Button compact label={(locationLabel??"Location")+"  ▾"} selected={!!locationId} onPress={()=>setPicker("location")}/>:null}
 {onPhotosOnlyChange?<Button compact label="With photos only" selected={photosOnly} onPress={()=>onPhotosOnlyChange(!photosOnly)}/>:null}
 </View>
 <Modal visible={picker!==null} transparent animationType="fade" onRequestClose={()=>setPicker(null)}><View style={{flex:1,backgroundColor:"#0008",justifyContent:"center",padding:24}}><View accessibilityViewIsModal style={{backgroundColor:colors.paper,padding:18,borderRadius:8,gap:12}}><Text accessibilityRole="header" style={{fontFamily:editorialFonts.heading,fontSize:28,color:colors.ink}}>{picker==="space"?"Space":picker==="location"?"Location":"Category"}</Text><ScrollView style={{maxHeight:240}} keyboardShouldPersistTaps="handled"><Button label="All" selected={!selectedId} onPress={()=>{choose?.("");setPicker(null);}}/>{choices.map(c=><Button key={c.id} label={c.label} selected={c.id===selectedId} onPress={()=>{choose?.(c.id);setPicker(null);}}/>)}</ScrollView><Button label="Done" onPress={()=>setPicker(null)}/></View></View></Modal>
 </View>;
}
