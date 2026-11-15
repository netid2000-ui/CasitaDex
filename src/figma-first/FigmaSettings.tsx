import React,{useState} from "react";
import {Pressable,Text,View} from "react-native";
import {useTheme} from "../ui";
import {useData} from "../state";
import {editorialFonts} from "../theme";
import {ApprovedIcon,type ApprovedIconName} from "../approved-icon";
export type SettingsAction="plus"|"storage"|"backup"|"recovery"|"archived"|"reminders"|"appearance"|"accessibility"|"privacy"|"help"|"labels";
export type FigmaSettingsProps={onOpen:(action:SettingsAction)=>void};
const groups:{title:string;items:{id:SettingsAction;title:string;description:string}[]}[]=[
 {title:"Preferences",items:[{id:"appearance",title:"Appearance",description:"Light, dark, or follow your device"},{id:"accessibility",title:"Accessibility",description:"Large text and display appearance"}]},
 {title:"Memory management",items:[{id:"labels",title:"Spaces & categories",description:"Organize saved information"},{id:"recovery",title:"Recently deleted",description:"Review recoverable memories"},{id:"archived",title:"Archived Memories",description:"Review archived memories"},{id:"reminders",title:"Reminders",description:"Review and manage your reminders"}]},
 {title:"Data protection",items:[{id:"backup",title:"Backup & restore",description:"Export or recover local data"},{id:"storage",title:"Privacy & storage",description:"Your memories stay on this device"},{id:"privacy",title:"Privacy & security",description:"Local data, sharing and backup protection"}]},
 {title:"About",items:[{id:"plus",title:"CasitaDex Plus",description:"Explore the one-time upgrade"},{id:"help",title:"About CasitaDex",description:"Version and guidance for your memories"}]},
];
export function FigmaSettings({onOpen}:FigmaSettingsProps){
 const {colors}=useTheme(),{large}=useData(),[collapsed,setCollapsed]=useState<string[]>([]);const scale=large?1.6:1;
 return <View style={{backgroundColor:colors.paper,paddingHorizontal:18,paddingBottom:24,gap:16}}>{groups.map(g=><View key={g.title}>
 <Pressable accessibilityRole="button" accessibilityLabel={g.title} accessibilityState={{expanded:!collapsed.includes(g.title)}} onPress={()=>setCollapsed(v=>v.includes(g.title)?v.filter(x=>x!==g.title):[...v,g.title])} style={{minHeight:44,flexDirection:"row",alignItems:"center",justifyContent:"space-between"}}><Text style={{fontFamily:editorialFonts.heading,fontSize:21*scale,color:colors.ink}}>{g.title}</Text><Text style={{color:colors.ink}}>{collapsed.includes(g.title)?"⌄":"⌃"}</Text></Pressable>
 {!collapsed.includes(g.title)?g.items.map(item=><Pressable key={item.id} accessibilityRole="button" accessibilityLabel={item.title} accessibilityHint={item.description} onPress={()=>onOpen(item.id)} style={{minHeight:59,paddingVertical:8,borderTopWidth:1,borderColor:colors.separator,flexDirection:"row",alignItems:"center",gap:10}}><ApprovedIcon name={item.id as ApprovedIconName}/><View style={{flex:1,gap:3}}><Text style={{fontFamily:editorialFonts.body,fontSize:14*scale,color:colors.ink}}>{item.title}</Text><Text style={{fontFamily:editorialFonts.body,fontSize:12*scale,color:colors.muted}}>{item.description}</Text></View><Text style={{fontSize:19,color:colors.ink}}>›</Text></Pressable>):null}
 </View>)}</View>;
}
