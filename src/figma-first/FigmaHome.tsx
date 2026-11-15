import React from "react";
import {Image,Pressable,Text,View} from "react-native";
import type {HomeActionKind} from "./HomeActionCard";
import {useTheme} from "../ui";
import {useData} from "../state";
import {editorialFonts} from "../theme";
export type FigmaHomeProps={draftPending:boolean;onAction:(kind:HomeActionKind)=>void;onSettings:()=>void;onFind:()=>void};
export function FigmaHome({onAction,onFind}:FigmaHomeProps){
 const {colors,dark}=useTheme(),{large}=useData();const scale=large?1.6:1;
 return <View style={{backgroundColor:colors.paper,paddingHorizontal:18,paddingBottom:24,gap:16}}>
 <Text accessibilityRole="header" style={{fontFamily:editorialFonts.heading,fontSize:51*scale,color:colors.ink}}>Find a memory</Text>
 <Pressable accessibilityRole="button" accessibilityLabel="Find a memory" onPress={onFind} style={{minHeight:48,padding:14,borderRadius:8,backgroundColor:colors.primary,flexDirection:"row",alignItems:"center",justifyContent:"space-between"}}><Text style={{fontFamily:editorialFonts.body,color:colors.onPrimary,fontSize:15*scale}}>⌕  Search memories…</Text><Text style={{color:colors.onPrimary,fontSize:20}}>›</Text></Pressable>
 <View>{([{kind:"memory",label:"Add Memory",icon:"＋"},{kind:"photo",label:"Add Photo Memory",icon:"▧"},{kind:"reminder",label:"Add Reminder",icon:"▣"}] as const).map(a=><Pressable key={a.kind} accessibilityRole="button" accessibilityLabel={a.label} onPress={()=>onAction(a.kind)} style={{minHeight:49,paddingVertical:10,borderTopWidth:1,borderBottomWidth:a.kind==="reminder"?1:0,borderColor:colors.separator,flexDirection:"row",alignItems:"center",gap:12}}><Text style={{fontSize:19,color:colors.ink}}>{a.icon}</Text><Text style={{flex:1,fontFamily:editorialFonts.heading,fontSize:22*scale,color:colors.ink}}>{a.label}</Text><Text style={{fontSize:22,color:colors.ink}}>›</Text></Pressable>)}</View>
 <View style={{mixBlendMode:dark?"multiply":"normal",minHeight:110,alignItems:"flex-end",justifyContent:"center"}}><Image accessible={false} source={require("../../assets/approved-refresh/homeDesign_imgWatercolorOliveBranch.jpg")} resizeMode="cover" style={{width:88,height:58}}/></View>
 </View>;
}
