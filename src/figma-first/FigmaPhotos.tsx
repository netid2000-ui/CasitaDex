/** Shared photo gallery: each photo remains attached to its owning memory. */
import React from 'react';
import {Image,Pressable,Text,View} from 'react-native';
import {useFigmaTheme} from './tokens';
export type PhotoSummary={id:string;title:string;photoCount:number;thumbnailUri?:string;photos?:readonly {id:string;uri:string}[]};
export type FigmaPhotosProps={items:readonly PhotoSummary[];onAdd:()=>void;onOpen:(id:string)=>void;onViewPhoto?:(memoryId:string,photoId:string,uri:string,label:string)=>void};
export const photoCountLabel=(count:number)=>count===1?"1 photo":`${count} photos`;
export function FigmaPhotos({items,onAdd,onOpen,onViewPhoto}:FigmaPhotosProps){
 const fg=useFigmaTheme();
 return <View style={{backgroundColor:fg.page,padding:16,gap:16}}>
  <Pressable accessibilityRole="button" accessibilityLabel="Add Photo Memory" onPress={onAdd} style={{backgroundColor:fg.actionSurface,borderRadius:12,minHeight:48,alignItems:'center',justifyContent:'center',padding:12}}><Text style={{color:fg.actionInk,fontWeight:'700',fontSize:16}}>+ Add Photo Memory</Text></Pressable>
  <Text style={{color:fg.secondaryInk}}>{items.length} {items.length===1?'photo memory':'photo memories'} · Tap a photo to open its saved memory.</Text>
  {items.length===0?<Text style={{color:fg.secondaryInk}}>No photo memories yet. Add a photo memory to start your gallery.</Text>:items.map(item=><View key={item.id} style={{padding:12,borderRadius:12,backgroundColor:fg.brandSurface,gap:10}}>
   <Pressable accessibilityRole="button" accessibilityLabel={`Open memory ${item.title}`} onPress={()=>onOpen(item.id)} style={{minHeight:44,justifyContent:'center'}}><Text style={{fontWeight:'700',fontSize:17,color:fg.headingInk}}>{item.title}</Text><Text style={{color:fg.secondaryInk}}>{photoCountLabel(item.photoCount)} · View memory details</Text></Pressable>
   <View style={{flexDirection:'row',flexWrap:'wrap',gap:10}}>{(item.photos??(item.thumbnailUri?[{id:item.id,uri:item.thumbnailUri}]:[])).map((photo,index)=><Pressable key={photo.id} accessibilityRole="button" accessibilityLabel={`View photo ${index+1} of ${item.title} full screen`} onPress={()=>onViewPhoto?onViewPhoto(item.id,photo.id,photo.uri,`Photo ${index+1} of ${item.title}`):onOpen(item.id)} hitSlop={6} style={{width:96,height:96,borderRadius:10,overflow:'hidden',borderWidth:1,borderColor:fg.secondaryInk}}><View pointerEvents="none" style={{width:"100%",height:"100%"}}><Image source={{uri:photo.uri}} accessibilityLabel={`Saved photo for ${item.title}`} resizeMode="cover" style={{width:'100%',height:'100%'}} /></View></Pressable>)}</View>
  </View>)}
 </View>;
}
