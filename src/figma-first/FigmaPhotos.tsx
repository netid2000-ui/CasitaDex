/** Photo workspace. Search and taxonomy filters belong to Find. */
import React,{useRef} from 'react';
import {Image,Pressable,Text,View,useWindowDimensions} from 'react-native';
import {useData} from '../state';
import {useFigmaTheme} from './tokens';
export type PhotoSummary={id:string;title:string;photoCount:number;thumbnailUri?:string;photos?:readonly {id:string;uri:string}[]};
export type PhotoView='grid'|'compact';
export type FigmaPhotosProps={items:readonly PhotoSummary[];onAdd:()=>void;onOpen:(id:string)=>void;onViewPhoto?:(memoryId:string,photoId:string,uri:string,label:string)=>void;view?:PhotoView;sort?:'updated'|'added';onViewChange?:(view:PhotoView)=>void;onSortChange?:(sort:'updated'|'added')=>void;draft?:{title:string;photoCount:number};onResumeDraft?:()=>void;onItemLayout?:(id:string,y:number)=>void};
export const photoCountLabel=(count:number)=>count===1?"1 photo":`${count} photos`;
export function FigmaPhotos({items,onAdd,onOpen,onViewPhoto,view='grid',sort='updated',onViewChange,onSortChange,draft,onResumeDraft,onItemLayout}:FigmaPhotosProps){
 const fg=useFigmaTheme(),{width,fontScale}=useWindowDimensions(),{large}=useData();
 const gridTop=useRef<number|null>(null),itemY=useRef(new Map<string,number>());
 const columns=view==='grid'&&width>=360&&fontScale<1.35&&!large?2:1;
 const textScale=large?1.6:1;
 const control={minHeight:48,padding:12,borderWidth:1,borderColor:fg.secondaryInk,borderRadius:12,justifyContent:'center' as const};
 return <View style={{backgroundColor:fg.page,padding:16,gap:16}}>
  <Pressable accessibilityRole="button" accessibilityLabel="Add Photo Memory" onPress={onAdd} style={{backgroundColor:fg.actionSurface,borderRadius:12,minHeight:48,alignItems:'center',justifyContent:'center',padding:12}}><Text style={{color:fg.actionInk,fontWeight:'700',fontSize:16*textScale}}>+ Add Photo Memory</Text></Pressable>
  {draft?<View style={{backgroundColor:fg.brandSurface,borderRadius:12,padding:14,gap:8}}><Text accessibilityRole="header" style={{color:fg.headingInk,fontWeight:'700',fontSize:17*textScale}}>Unfinished photo memory</Text><Text style={{color:fg.secondaryInk,fontSize:15*textScale}}>{draft.title||'Untitled draft'} · {photoCountLabel(draft.photoCount)} · Not saved yet</Text><Pressable accessibilityRole="button" accessibilityLabel="Resume unfinished photo memory" onPress={onResumeDraft} style={control}><Text style={{color:fg.headingInk,fontSize:16*textScale}}>Resume draft</Text></Pressable></View>:null}
  <View style={{flexDirection:'row',flexWrap:'wrap',gap:8}}>{(['grid','compact'] as const).map(value=><Pressable key={value} accessibilityRole="button" accessibilityLabel={`${value==='grid'?'Grid':'Compact'} photo view`} accessibilityState={{selected:view===value}} onPress={()=>onViewChange?.(value)} style={[control,{backgroundColor:view===value?fg.actionSurface:fg.page}]}><Text style={{color:view===value?fg.actionInk:fg.headingInk,fontSize:15*textScale}}>{value==='grid'?'Grid':'Compact'}</Text></Pressable>)}</View>
  <View style={{flexDirection:'row',flexWrap:'wrap',gap:8}}>{(['updated','added'] as const).map(value=><Pressable key={value} accessibilityRole="button" accessibilityLabel={value==='updated'?'Recently updated':'Recently added'} accessibilityState={{selected:sort===value}} onPress={()=>onSortChange?.(value)} style={[control,{backgroundColor:sort===value?fg.brandSurface:fg.page}]}><Text style={{color:fg.headingInk,fontSize:14*textScale}}>{value==='updated'?'Recently updated':'Recently added'}</Text></Pressable>)}</View>
  <Text style={{color:fg.secondaryInk,fontSize:14*textScale}}>{items.length} {items.length===1?'photo memory':'photo memories'} · Tap a photo to view it. Tap its title for memory details.</Text>
  {items.length===0?<Text style={{color:fg.secondaryInk,fontSize:16*textScale}}>No saved photo memories yet. Add a photo memory to start your gallery.</Text>:<View onLayout={event=>{gridTop.current=event.nativeEvent.layout.y;for(const [id,y]of itemY.current)onItemLayout?.(id,gridTop.current+y+16);}} style={{flexDirection:'row',flexWrap:'wrap',gap:12}}>{items.map(item=>{
   const photos=item.photos??(item.thumbnailUri?[{id:item.id,uri:item.thumbnailUri}]:[]),photo=photos[0];
   const openPhoto=()=>photo&&(onViewPhoto?onViewPhoto(item.id,photo.id,photo.uri,`Photo 1 of ${item.title}`):onOpen(item.id));
   const compact=view==='compact'&&!large&&fontScale<1.35;
   return <View key={item.id} onLayout={event=>{itemY.current.set(item.id,event.nativeEvent.layout.y);if(gridTop.current!==null)onItemLayout?.(item.id,gridTop.current+event.nativeEvent.layout.y+16);}} style={{width:columns===2?'48%':'100%',padding:12,borderRadius:14,backgroundColor:fg.brandSurface,gap:10,flexDirection:compact?'row':'column',alignItems:compact?'center':'stretch'}}>
    {photo?<Pressable accessibilityRole="button" accessibilityLabel={`View photo 1 of ${item.title} full screen`} accessibilityHint={`${photoCountLabel(item.photoCount)}. Opens the cover photo; use Next to view the other photos.`} onPress={openPhoto} style={{width:compact?96:'100%',aspectRatio:1,borderRadius:10,overflow:'hidden',borderWidth:1,borderColor:fg.secondaryInk}}><View pointerEvents="none" style={{width:'100%',height:'100%'}}><Image source={{uri:photo.uri}} accessibilityLabel={`Saved photo for ${item.title}`} resizeMode="cover" style={{width:'100%',height:'100%'}} /></View></Pressable>:null}
    <View style={{flex:compact?1:undefined,gap:4}}><Pressable accessibilityRole="button" accessibilityLabel={`Open memory ${item.title}`} onPress={()=>onOpen(item.id)} style={{minHeight:48,justifyContent:'center'}}><Text style={{fontWeight:'700',fontSize:17*textScale,color:fg.headingInk}}>{item.title}</Text><Text style={{color:fg.secondaryInk,fontSize:14*textScale}}>{photoCountLabel(item.photoCount)} · View memory</Text></Pressable></View>
   </View>;
  })}</View>}
 </View>;
}
