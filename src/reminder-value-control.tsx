import React from "react";
import {Pressable,View} from "react-native";
import {SvgXml} from "react-native-svg";
import {Copy,useTheme} from "./ui";
const icons=[require("../assets/approved-refresh/reminder-light-date.svg"),require("../assets/approved-refresh/reminder-light-time.svg"),require("../assets/approved-refresh/reminder-dark-date.svg"),require("../assets/approved-refresh/reminder-dark-time.svg")];
export function ReminderValueControl({kind,value,label,onPress}:{kind:"date"|"time";value:string;label:string;onPress:()=>void}){
 const {dark,colors}=useTheme();
 return <View style={{gap:6}}><Copy>{kind==="date"?"Date":"Time"}</Copy><Pressable accessibilityRole="button" accessibilityLabel={label} accessibilityHint={kind==="date"?"Choose reminder date":"Choose reminder time"} onPress={onPress} style={{backgroundColor:"transparent",borderColor:colors.separator,borderWidth:0,borderBottomWidth:1,borderRadius:0,minHeight:48,paddingHorizontal:12,paddingVertical:10,flexDirection:"row",alignItems:"center",gap:9}}><View accessible={false} accessibilityElementsHidden style={{width:16,height:16}}><SvgXml xml={icons[(dark?2:0)+(kind==="time"?1:0)]}/></View><Copy style={{flex:1}}>{value}</Copy><Copy style={{fontSize:19}}>›</Copy></Pressable></View>;
}
