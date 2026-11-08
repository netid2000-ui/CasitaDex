import React, {useState} from "react";
import {ScrollView, Text, View} from "react-native";
import {PrimaryCta} from "../figma-first/PrimaryCta";

/** Isolated QA route only: no data writes or production navigation entry. */
export default function SB29Review(){
 const [taps,setTaps]=useState(0);
 return <ScrollView contentContainerStyle={{padding:20,gap:16,backgroundColor:"#F7F2E8",flexGrow:1}}>
  <Text accessibilityRole="header" style={{fontSize:23,fontWeight:"700",color:"#173D2E"}}>SB-29 CTA review only</Text>
  <Text>Tap count: {taps}. Check scaling, focus outlines and button hit areas.</Text>
  {(["light","dark"] as const).map(theme=><View key={theme} style={{padding:16,gap:14,backgroundColor:theme==="dark"?"#183F30":"#FFFFFF"}}>
   <Text style={{color:theme==="dark"?"white":"#173D2E"}}>{theme.toUpperCase()}</Text>
   <PrimaryCta theme={theme} label="Add Photo Memory" onPress={()=>setTaps(v=>v+1)} testID={`sb29-${theme}-enabled`}/>
   <PrimaryCta theme={theme} label="Add Photo Memory" focused onPress={()=>setTaps(v=>v+1)} testID={`sb29-${theme}-focus`}/>
   <PrimaryCta theme={theme} label="Add Photo Memory" disabled onPress={()=>{}} testID={`sb29-${theme}-disabled`}/>
  </View>)}
 </ScrollView>;
}