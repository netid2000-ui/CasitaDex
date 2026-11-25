import React, {useEffect,useState} from 'react';
import {AccessibilityInfo,Platform,View,type StyleProp,type ViewStyle} from 'react-native';
import {GlassView,isGlassEffectAPIAvailable,isLiquidGlassAvailable} from 'expo-glass-effect';
import {materialTokens} from './material-tokens';
type Props={children:React.ReactNode;dark:boolean;surface:string;accent:string;ink:string;style?:StyleProp<ViewStyle>;testID:string;enabled?:boolean};
export function ThemeMaterial({children,dark,surface,accent,ink,style,testID,enabled=true}:Props){
 const [reduce,setReduce]=useState(true);
 useEffect(()=>{
  if(Platform.OS!=='ios'||!enabled)return;
  let active=true,changed=false;
  const sub=AccessibilityInfo.addEventListener('reduceTransparencyChanged',value=>{changed=true;if(active)setReduce(value);});
  AccessibilityInfo.isReduceTransparencyEnabled().then(value=>{if(active&&!changed)setReduce(value);}).catch(()=>undefined);
  return ()=>{active=false;sub.remove();};
 },[enabled]);
 const {tone,glassTint}=materialTokens(surface,accent,ink);
 const glass=enabled&&Platform.OS==='ios'&&!reduce&&isGlassEffectAPIAvailable()&&isLiquidGlassAvailable();
 // The normal-layout wrapper never changes the child actions, accessibility labels or callbacks.
 if(glass)return <GlassView testID={testID+'-glass'} glassEffectStyle="regular" colorScheme={dark?'dark':'light'} tintColor={glassTint} style={style}>{children}</GlassView>;
 return <View testID={testID+'-tonal'} style={[style,{backgroundColor:enabled?tone:surface}]}>{children}</View>;
}
