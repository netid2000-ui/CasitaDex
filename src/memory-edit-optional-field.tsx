import React,{useState} from "react";
import {Pressable,View} from "react-native";
import {Button,Copy,Field,useTheme} from "./ui";
/** Expanding a field never persists it; the parent editor owns Save and Cancel. */
export function MemoryEditOptionalField({initiallyOpen=false,...field}:React.ComponentProps<typeof Field>&{initiallyOpen?:boolean}){
 const [open,setOpen]=useState(initiallyOpen);
 const {colors}=useTheme();
 return <View style={{backgroundColor:colors.white,borderWidth:1,borderColor:colors.line,borderRadius:8,paddingHorizontal:12,paddingVertical:10,gap:6}}>
  {open?<><Field {...field}/><Button compact variant="quiet" label={`Done editing ${field.label}`} disabled={field.disabled} onPress={()=>setOpen(false)}/></>:<Pressable accessibilityRole="button" accessibilityLabel={`Edit ${field.label}`} accessibilityState={{disabled:!!field.disabled,expanded:false}} disabled={field.disabled} onPress={()=>setOpen(true)} style={{minHeight:44,flexDirection:"row",alignItems:"center",gap:12}}><View style={{flex:1,gap:4}}><Copy>{field.label}</Copy><Copy kind="small">{field.value||"None"}</Copy></View><Copy kind="small">Edit  ›</Copy></Pressable>}
 </View>;
}
