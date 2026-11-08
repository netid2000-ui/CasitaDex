/** New Figma-first native component: Figma node 109:111, no legacy UI dependencies. */
import React, {useState} from "react";
import {Platform, Pressable, Text, View, type AccessibilityState} from "react-native";
import {figmaPrimaryCta, type FAPlatform, type FATheme} from "./tokens";

export type PrimaryCtaProps = {label:string; onPress:()=>void; theme:FATheme;
  disabled?:boolean; focused?:boolean; testID?:string; platformOverride?:FAPlatform};
export function PrimaryCta({label,onPress,theme,disabled=false,focused=false,testID,platformOverride}:PrimaryCtaProps){
  const [nativeFocused,setNativeFocused]=useState(false);
  const showFocus = !disabled && (focused || nativeFocused);
  const platform = platformOverride ?? (Platform.OS === "ios" ? "ios" : "android");
  const visual = figmaPrimaryCta(platform,theme,disabled?"disabled":showFocus?"focused":"enabled");
  const state:AccessibilityState = {disabled};
  return <View style={{borderWidth:3,borderColor:showFocus?visual.focusHaloColor:"transparent",borderRadius:visual.radius+5,padding:2}}><Pressable accessibilityRole="button" accessibilityLabel={label} accessibilityState={state}
    testID={testID} onPress={onPress} disabled={disabled} onFocus={()=>setNativeFocused(true)} onBlur={()=>setNativeFocused(false)}
    style={({pressed})=>({minHeight:visual.height,borderRadius:visual.radius,
      backgroundColor:pressed&&!disabled?visual.pressedBackgroundColor:visual.backgroundColor,borderColor:showFocus?visual.focusColor:"transparent",
      borderWidth:3,alignItems:"center",justifyContent:"center",
      paddingHorizontal:22,paddingVertical:12})}>
    <Text allowFontScaling style={{fontSize:16,flexShrink:1,fontWeight:"700",color:visual.color,textAlign:"center"}}>{label}</Text>
  </Pressable></View>;
}
