import {useEffect} from "react";
import {AccessibilityInfo,Platform} from "react-native";
/** Android uses the visible polite live region; iOS queues changed messages. */
export function useStatusAnnouncement(text:string){
 useEffect(()=>{
  if(Platform.OS==="ios" && text.trim()){
   AccessibilityInfo.announceForAccessibilityWithOptions(text,{queue:true});
  }
 },[text]);
}
