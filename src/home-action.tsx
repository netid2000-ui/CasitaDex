import React from "react";
import { Pressable, View } from "react-native";
import { Copy } from "./ui";
import { AcceptedNavigationIcon } from "./accepted-navigation-icon";

type Icon = "Memories" | "Photos" | "Reminders";
export function HomeAction({ title, detail, icon, primary=false, disabled=false, onPress }: { title:string; detail:string; icon:Icon; primary?:boolean; disabled?:boolean; onPress:()=>void }) {
 const bg=disabled?"#E8EDE5":primary?"#174C38":"#FFFFFF";
 const ink=disabled?"#264E3B":primary?"#FFFFFF":"#173D2E";
 return <Pressable accessibilityRole="button" accessibilityLabel={title} accessibilityHint={detail}
  disabled={disabled} accessibilityState={{disabled}} onPress={onPress} style={({pressed})=>({backgroundColor:bg,borderRadius:18,borderWidth:primary&&!disabled?0:1,borderColor:disabled?"#6F8676":"#8CA393",borderStyle:disabled?"dashed":"solid",paddingHorizontal:16,paddingVertical:18,flexDirection:"row",alignItems:"center",gap:14,minHeight:86,opacity:pressed?.86:1})}>
   <View style={{width:45,height:45,borderRadius:12,backgroundColor:primary?"#356B51":"#EEE5D4",alignItems:"center",justifyContent:"center"}}>
    <AcceptedNavigationIcon name={icon} color={ink}/>
   </View>
   <View style={{flex:1,gap:3}}><Copy style={{fontSize:19,fontWeight:"800",color:ink}}>{title}</Copy><Copy style={{fontSize:13,color:disabled?"#315943":primary?"#E7F2EA":"#657268"}}>{disabled?"Finish your existing draft first":detail}</Copy></View>
 </Pressable>;
}