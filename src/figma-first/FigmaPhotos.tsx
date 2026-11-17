import {PhotoActionIcon} from "../approved-icon";
import {PhotoPreview} from "../photo-preview";
import {editorialFonts} from "../theme";
import {shouldRenderPhoto,type PhotoViewport,type PhotoBounds} from './photo-render-window';
/** Photo workspace. Search and taxonomy filters belong to Find. */
import React,{useRef,useState,useEffect} from 'react';
import {Alert,Pressable,Text,View,useWindowDimensions} from 'react-native';
import {useData} from '../state';
import {useFigmaTheme} from './tokens';
export type PhotoSummary={id:string;title:string;photoCount:number;thumbnailUri?:string;photos?:readonly {id:string;uri:string}[]};
export type PhotoView='grid'|'compact';
export type FigmaPhotosProps={items:readonly PhotoSummary[];onAdd:()=>void;onOpen:(id:string)=>void;onViewPhoto?:(memoryId:string,photoId:string,uri:string,label:string)=>void;view?:PhotoView;sort?:'updated'|'added';onViewChange?:(view:PhotoView)=>void;onSortChange?:(sort:'updated'|'added')=>void;draft?:{title:string;photoCount:number};onResumeDraft?:()=>void;hideControls?:boolean;viewport?:PhotoViewport;onItemLayout?:(id:string,y:number)=>void};
export const photoCountLabel=(count:number)=>count===1?"1 photo":`${count} photos`;
export function FigmaPhotos({items,onAdd,onOpen,onViewPhoto,view='grid',sort='updated',onViewChange,onSortChange,draft,onResumeDraft,onItemLayout,hideControls=false,viewport}:FigmaPhotosProps){
 const fg=useFigmaTheme(),{width,fontScale}=useWindowDimensions(),{large}=useData();
 const gridTop=useRef<number|null>(null),itemY=useRef(new Map<string,number>());
 const bounds=useRef(new Map<string,PhotoBounds>()),layoutFrame=useRef<number|null>(null);
 const [layout,setLayout]=useState<{top:number|null;bounds:Map<string,PhotoBounds>}>({top:null,bounds:new Map()});
 function layoutChanged(){if(layoutFrame.current===null)layoutFrame.current=requestAnimationFrame(()=>{layoutFrame.current=null;setLayout({top:gridTop.current,bounds:new Map(bounds.current)});});}
 useEffect(()=>()=>{if(layoutFrame.current!==null)cancelAnimationFrame(layoutFrame.current);},[]);
 const columns=view==='grid'&&width>=360&&fontScale<1.35&&!large?2:1;
 const textScale=large?1.6:1;
 const control={minHeight:48,padding:8,borderWidth:0,borderBottomWidth:1,borderColor:fg.secondaryInk,borderRadius:0,justifyContent:'center' as const};
 return <View style={{backgroundColor:fg.page,padding:18,gap:16}}>
  {!hideControls?<PhotoWorkspaceControls onAdd={onAdd} view={view} sort={sort} onViewChange={onViewChange} onSortChange={onSortChange}/>:null}
  {draft?<View style={{backgroundColor:fg.brandSurface,borderRadius:12,padding:14,gap:8}}><Text accessibilityRole="header" style={{color:fg.headingInk,fontFamily:editorialFonts.heading,fontSize:21*textScale}}>Unfinished photo memory</Text><Text style={{color:fg.secondaryInk,fontSize:15*textScale}}>{draft.title||'Untitled draft'} · {photoCountLabel(draft.photoCount)} · Not saved yet</Text><Pressable accessibilityRole="button" accessibilityLabel="Resume unfinished photo memory" onPress={onResumeDraft} style={control}><Text style={{color:fg.headingInk,fontSize:16*textScale}}>Resume draft</Text></Pressable></View>:null}

  {items.length===0?<Text style={{color:fg.secondaryInk,fontSize:16*textScale}}>No saved photo memories yet. Add a photo memory to start your gallery.</Text>:<View onLayout={event=>{gridTop.current=event.nativeEvent.layout.y;layoutChanged();for(const [id,y]of itemY.current)onItemLayout?.(id,gridTop.current+y+16);}} style={{flexDirection:'row',flexWrap:'wrap',gap:12}}>{items.map((item,index)=>{
   const photos=item.photos??(item.thumbnailUri?[{id:item.id,uri:item.thumbnailUri}]:[]),photo=photos[0];
   const openPhoto=()=>photo&&(onViewPhoto?onViewPhoto(item.id,photo.id,photo.uri,`Photo 1 of ${item.title}`):onOpen(item.id));
   const measured=layout.bounds.get(item.id);
   const renderPhoto=shouldRenderPhoto(measured&&layout.top!==null?{top:layout.top+measured.top+16,height:measured.height}:undefined,viewport,index);
   const compact=view==='compact'&&!large&&fontScale<1.35;
   return <View key={item.id} onLayout={event=>{bounds.current.set(item.id,{top:event.nativeEvent.layout.y,height:event.nativeEvent.layout.height});layoutChanged();itemY.current.set(item.id,event.nativeEvent.layout.y);if(gridTop.current!==null)onItemLayout?.(item.id,gridTop.current+event.nativeEvent.layout.y+16);}} style={{width:columns===2?'48%':'100%',padding:0,borderRadius:8,backgroundColor:fg.page,gap:4,flexDirection:compact?'row':'column',alignItems:compact?'center':'stretch'}}>
    {photo?<Pressable accessibilityRole="button" accessibilityLabel={`View photo 1 of ${item.title} full screen`} accessibilityHint={`${photoCountLabel(item.photoCount)}. Opens the cover photo; use Next to view the other photos.`} onPress={openPhoto} style={{width:compact?96:'100%',aspectRatio:171/183,borderRadius:8,overflow:'hidden',borderWidth:1,borderColor:fg.secondaryInk}}><View pointerEvents="none" style={{width:'100%',height:'100%'}}>{renderPhoto?<PhotoPreview uri={photo.uri} label={`Saved photo for ${item.title}`} style={{width:'100%',height:'100%'}} />:null}</View></Pressable>:null}
    <View style={{flex:compact?1:undefined,gap:4}}><Pressable accessibilityRole="button" accessibilityLabel={`Open memory ${item.title}`} onPress={()=>onOpen(item.id)} style={{minHeight:48,justifyContent:'center'}}><Text key={`title-${fontScale}`} style={{fontFamily:editorialFonts.heading,fontSize:21*textScale,color:fg.headingInk}}>{item.title}</Text><Text key={`count-${fontScale}`} style={{color:fg.secondaryInk,fontFamily:editorialFonts.body,fontSize:13*textScale}}>{photoCountLabel(item.photoCount)}</Text></Pressable></View>
   </View>;
  })}</View>}
 </View>;
}

export function PhotoWorkspaceControls({onAdd,view='grid',sort='updated',onViewChange,onSortChange}:Pick<FigmaPhotosProps,'onAdd'|'view'|'sort'|'onViewChange'|'onSortChange'>){
 const fg=useFigmaTheme(),{large}=useData();const scale=large?1.6:1;
 const control={minHeight:48,maxWidth:"100%" as const,paddingVertical:8,paddingHorizontal:10,borderWidth:0,borderBottomWidth:1,borderColor:fg.secondaryInk,borderRadius:0,justifyContent:'center' as const,flexDirection:'row' as const,alignItems:'center' as const,gap:8,backgroundColor:"transparent"};
 const text={fontFamily:editorialFonts.body,color:fg.headingInk,fontSize:12*scale,flexShrink:1,minWidth:0};
 return <View style={{backgroundColor:fg.page,paddingHorizontal:18,paddingBottom:16,gap:8}}>
 <View style={{flexDirection:'row',flexWrap:'wrap',gap:8}}>{(['grid','compact'] as const).map(value=><Pressable key={value} accessibilityRole="button" accessibilityLabel={value==='grid'?'Grid photo view':'Compact photo view'} accessibilityState={{selected:view===value}} onPress={()=>onViewChange?.(value)} style={[control,view===value?{borderBottomWidth:3,borderBottomColor:fg.headingInk}:null]}><PhotoActionIcon name={value}/><Text style={text}>{value==='grid'?'Grid':'Compact'}</Text></Pressable>)}
 <Pressable accessibilityRole="button" accessibilityLabel="Sort photos" accessibilityValue={{text:sort==='updated'?'Recently updated':'Recently added'}} onPress={()=>Alert.alert('Sort photos','',[{text:'Recently updated',onPress:()=>onSortChange?.('updated')},{text:'Recently added',onPress:()=>onSortChange?.('added')},{text:'Cancel',style:'cancel'}])} style={control}><PhotoActionIcon name="sort"/><Text style={text}>Sort ▾</Text></Pressable></View>
 <Pressable accessibilityRole="button" accessibilityLabel="Add Photo Memory" onPress={onAdd} style={[control,{alignSelf:'stretch',justifyContent:'flex-start'}]}><Text accessible={false} style={{color:fg.headingInk,fontSize:20}}>+</Text><Text style={text}>Add Photo Memory  ›</Text></Pressable>
 </View>;
}
