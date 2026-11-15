import React,{useState,useRef,useEffect} from "react";
import {AccessibilityInfo,Pressable,View,useWindowDimensions} from "react-native";
import {useData} from "./state";
import {Button,Copy,Field,useTheme} from "./ui";
/** Expanding a field never persists it; the parent editor owns Save and Cancel. */
export function MemoryEditOptionalField({initiallyOpen=false,...field}:React.ComponentProps<typeof Field>&{initiallyOpen?:boolean}){
 const [open,setOpen]=useState(initiallyOpen);
 const trigger=useRef<React.ElementRef<typeof Pressable>>(null),returning=useRef(false);
 useEffect(()=>{
  if(open||!returning.current)return;
  const timer=setTimeout(()=>{if(trigger.current)AccessibilityInfo.sendAccessibilityEvent(trigger.current,"focus");returning.current=false;},300);
  return ()=>clearTimeout(timer);
 },[open]);
 const {colors}=useTheme();
 const {fontScale}=useWindowDimensions(),{large}=useData();
 const stacked=large||fontScale>=1.35;
 return <View style={{backgroundColor:colors.white,borderWidth:1,borderColor:colors.line,borderRadius:8,paddingHorizontal:12,paddingVertical:10,gap:6}}>
  {open?<View key="expanded" accessible={false}><Field {...field} accessibilityFocusOnMount/><Button compact variant="quiet" label={`Done editing ${field.label}`} disabled={field.disabled} onPress={()=>{returning.current=true;setOpen(false);}}/></View>:<Pressable key="collapsed" ref={trigger} onAccessibilityTap={field.disabled?undefined:()=>setOpen(true)} accessibilityRole="button" accessibilityLabel={`Edit ${field.label}`} accessibilityValue={{text:field.value||"None"}} accessibilityHint="Opens the field for editing. Save the memory to keep changes." accessibilityState={{disabled:!!field.disabled,expanded:false}} disabled={field.disabled} onPress={()=>setOpen(true)} style={{minHeight:44,flexDirection:stacked?"column":"row",alignItems:stacked?"stretch":"center",gap:12}}><View style={{flex:stacked?undefined:1,gap:4}}><Copy>{field.label}</Copy><Copy kind="small">{field.value||"None"}</Copy></View><Copy kind="small">Edit  ›</Copy></Pressable>}
 </View>;
}
