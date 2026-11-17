import React from "react";
import {Pressable,View} from "react-native";
import {SvgXml} from "react-native-svg";
import {Copy,useTheme} from "./ui";
const modules=[require("../assets/approved-refresh/edit-light-cancel.svg"),require("../assets/approved-refresh/edit-light-save.svg"),require("../assets/approved-refresh/edit-light-photo.svg"),require("../assets/approved-refresh/edit-dark-cancel.svg"),require("../assets/approved-refresh/edit-dark-save.svg"),require("../assets/approved-refresh/edit-dark-photo.svg")];
export function MemoryEditorIcon({name}:{name:"cancel"|"save"|"photo"}){
 const {dark}=useTheme();const xml=modules[(dark?3:0)+({cancel:0,save:1,photo:2}[name])];
 return <View accessible={false} accessibilityElementsHidden style={{width:16,height:16}}><SvgXml xml={xml}/></View>;
}
export function MemoryEditorChoice({label,value,onPress,expanded,disabled}:{label:string;value:string;onPress:()=>void;expanded:boolean;disabled:boolean}){
 const {colors}=useTheme();
 return <View style={{gap:6}}><Copy>{label}</Copy><Pressable accessibilityRole="button" testID="Choose ▾" accessibilityLabel={`Choose ${label}`} accessibilityValue={{text:value}} accessibilityHint={expanded?"Closes the choices":"Opens the choices"} accessibilityState={{expanded,disabled}} disabled={disabled} onPress={onPress} style={{backgroundColor:"transparent",borderColor:colors.separator,borderWidth:0,borderBottomWidth:1,borderRadius:0,minHeight:48,padding:12,flexDirection:"row",alignItems:"center",justifyContent:"space-between",gap:12}}><Copy style={{flex:1}}>{value}</Copy><Copy style={{fontSize:20}}>{expanded?"⌃":"›"}</Copy></Pressable></View>;
}
