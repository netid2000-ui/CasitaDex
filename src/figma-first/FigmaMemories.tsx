/** Read-only Figma-first Memories index, intentionally separate from Find. */
import React from 'react';
import {Pressable,Text,View} from 'react-native';
import type {MemoryV2} from '../sb20-contract';
import {useFigmaTheme} from './tokens';
export type FigmaMemoriesProps={memories:readonly MemoryV2[];onOpen:(id:string)=>void};
export function FigmaMemories({memories,onOpen}:FigmaMemoriesProps){
 const fg=useFigmaTheme();
 return <View style={{backgroundColor:fg.page,padding:16,gap:12}}>
  <Text accessibilityRole="header" style={{fontSize:25,fontWeight:'700',color:fg.headingInk}}>Memories</Text>
  {memories.length===0?<Text style={{color:fg.secondaryInk}}>No memories saved yet.</Text>:memories.map(m=><Pressable key={m.id} accessibilityRole="button" accessibilityLabel={`Open ${m.title}`} onPress={()=>onOpen(m.id)} style={{padding:14,borderRadius:12,backgroundColor:fg.brandSurface}}><Text style={{fontSize:17,fontWeight:'700',color:fg.headingInk}}>{m.title}</Text><Text numberOfLines={2} style={{color:fg.secondaryInk}}>{m.answer}</Text></Pressable>)}
 </View>;
}
