import React,{useState} from "react";
import {Pressable,View,useWindowDimensions} from "react-native";
import {useData} from "./state";
import {Button,Copy,Field,useTheme} from "./ui";
/** Expanding a field never persists it; the parent editor owns Save and Cancel. */
export function MemoryEditOptionalField({initiallyOpen=false,...field}:React.ComponentProps<typeof Field>&{initiallyOpen?:boolean}){
 const [open,setOpen]=useState(initiallyOpen);
 const {colors}=useTheme();
 const {fontScale}=useWindowDimensions(),{large}=useData();
 const stacked=large||fontScale>=1.35;
 return <View style={{backgroundColor:colors.white,borderWidth:1,borderColor:colors.line,borderRadius:8,paddingHorizontal:12,paddingVertical:10,gap:6}}>
  {open?<><Field {...field}/><Button compact variant="quiet" label={`Done editing ${field.label}`} disabled={field.disabled} onPress={()=>setOpen(false)}/></>:<Pressable accessibilityRole="button" accessibilityLabel={`Edit ${field.label}`} accessibilityValue={{text:field.value||"None"}} accessibilityHint="Opens the field for editing. Save the memory to keep changes." accessibilityState={{disabled:!!field.disabled,expanded:false}} disabled={field.disabled} onPress={()=>setOpen(true)} style={{minHeight:44,flexDirection:stacked?"column":"row",alignItems:stacked?"stretch":"center",gap:12}}><View style={{flex:stacked?undefined:1,gap:4}}><Copy>{field.label}</Copy><Copy kind="small">{field.value||"None"}</Copy></View><Copy kind="small">Edit  ›</Copy></Pressable>}
 </View>;
}
