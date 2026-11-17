import React from "react";
import {Image,Pressable,Text,View} from "react-native";
import type {HomeActionKind} from "./HomeActionCard";
import {useTheme,Button,Copy} from "../ui";
import {useData} from "../state";
import {editorialFonts} from "../theme";
export type FigmaHomeProps={draftPending:boolean;onAction:(kind:HomeActionKind)=>void;onSettings:()=>void;onFind:()=>void};
export function FigmaHome({onAction,onFind}:FigmaHomeProps){
 const {colors}=useTheme(),{large}=useData();const scale=large?1.6:1;
 return <View style={{flexGrow:1,backgroundColor:colors.paper,paddingHorizontal:18,paddingBottom:24,gap:16}}>
 <Text accessibilityRole="header" style={{fontFamily:editorialFonts.heading,fontSize:51*scale,color:colors.ink}}>Find a memory</Text>
 <Button label="Search Memories" onPress={onFind} trailing={<Text accessible={false} style={{color:colors.ink,fontSize:22}}>›</Text>}/>
 <View>{([{kind:"memory",label:"Add Memory",icon:"＋"},{kind:"photo",label:"Add Photo Memory",icon:"▧"},{kind:"reminder",label:"Add Reminder",icon:"▣"}] as const).map(a=><Pressable key={a.kind} accessibilityRole="button" accessibilityLabel={a.label} onPress={()=>onAction(a.kind)} style={{minHeight:49,paddingVertical:10,borderTopWidth:1,borderBottomWidth:a.kind==="reminder"?1:0,borderColor:colors.separator,flexDirection:"row",alignItems:"center",gap:12}}><Text style={{fontSize:19,color:colors.ink}}>{a.icon}</Text><Text style={{flex:1,fontFamily:editorialFonts.heading,fontSize:22*scale,color:colors.ink}}>{a.label}</Text><Text style={{fontSize:22,color:colors.ink}}>›</Text></Pressable>)}</View>
 <View style={{flexGrow:1,minHeight:240,paddingVertical:24,gap:16,alignItems:"center",justifyContent:"center"}}><Image accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" source={require("../../assets/approved-hero/home-botanical.png")} resizeMode="contain" style={{width:"100%",maxWidth:350,height:160}}/><Copy style={{textAlign:"center",maxWidth:350}}>{"Your little home\nfor what you want to remember."}</Copy></View>
 </View>;
}
