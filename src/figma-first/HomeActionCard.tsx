/** Figma A.2 Home actions: preserve tested dark action hierarchy, replace letter placeholders with approved icons. */
import React from "react";
import {Image,Pressable,Text,View} from "react-native";
import {useFigmaTheme} from "./tokens";
export type HomeActionKind="memory"|"photo"|"reminder";
export type HomeActionCardProps={kind:HomeActionKind;onPress:()=>void;disabled?:boolean};
const icons={
 memory:require("../../assets/ui-icons/figma-approved-v1/memories.png"),
 photo:require("../../assets/ui-icons/figma-approved-v1/photos.png"),
 reminder:require("../../assets/ui-icons/figma-approved-v1/reminders.png"),
} as const;
const actions={
 memory:{title:"Add Memory",detail:"Capture a useful detail"},
 photo:{title:"Add Photo Memory",detail:"Start with an image"},
 reminder:{title:"Add Reminder",detail:"Remember the next step"},
} as const;
export function HomeActionCard({kind,onPress,disabled=false}:HomeActionCardProps){
 const fg=useFigmaTheme();
 const action=actions[kind];
 return <Pressable accessibilityRole="button" accessibilityLabel={action.title}
  accessibilityHint={action.detail} accessibilityState={{disabled}} disabled={disabled}
  onPress={onPress} style={({pressed})=>({minHeight:fg.actionHeight,
   borderRadius:fg.actionRadius,backgroundColor:kind==="memory"?fg.actionSurface:fg.brandSurface,
   paddingHorizontal:16,paddingVertical:14,flexDirection:"row",alignItems:"center",gap:14,
   opacity:disabled?0.48:pressed?0.88:1})}>
   <View accessible={false} style={{width:fg.iconSize,height:fg.iconSize,
    borderRadius:12,backgroundColor:kind==="memory"?fg.actionIconSurface:fg.actionSurface,
    alignItems:"center",justifyContent:"center"}}>
    <Image source={icons[kind]} accessible={false} resizeMode="contain"
      style={{width:25,height:25,tintColor:"#FFFFFF"}} />
   </View>
   <View style={{flex:1}}>
    <Text allowFontScaling style={{fontSize:17,fontWeight:"700",color:kind==="memory"?fg.actionInk:fg.headingInk}}>{action.title}</Text>
    <Text allowFontScaling style={{fontSize:13,color:kind==="memory"?"#E3F0E8":fg.secondaryInk}}>{action.detail}</Text>
   </View>
  </Pressable>;
}
