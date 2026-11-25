import React, {useEffect,useState} from 'react';
import {AccessibilityInfo,Platform,View,useWindowDimensions,type StyleProp,type ViewStyle} from 'react-native';
import {GlassView,isGlassEffectAPIAvailable,isLiquidGlassAvailable} from 'expo-glass-effect';
import {materialTokens} from './material-tokens';
type Props={children:React.ReactNode;dark:boolean;surface:string;accent:string;ink:string;style?:StyleProp<ViewStyle>;testID:string;enabled?:boolean};
export function ThemeMaterial({children,dark,surface,accent,ink,style,testID,enabled=true}:Props){
 const [reduce,setReduce]=useState(true);
 const {fontScale}=useWindowDimensions();
 const materialEnabled=enabled&&fontScale<1.35;
 useEffect(()=>{
  if(Platform.OS!=='ios'||!materialEnabled)return;
  let active=true,changed=false;
  const sub=AccessibilityInfo.addEventListener('reduceTransparencyChanged',value=>{changed=true;if(active)setReduce(value);});
  AccessibilityInfo.isReduceTransparencyEnabled().then(value=>{if(active&&!changed)setReduce(value);}).catch(()=>undefined);
  return ()=>{active=false;sub.remove();};
 },[materialEnabled]);
 const {tone,glassTint}=materialTokens(surface,accent,ink);
 const glass=materialEnabled&&Platform.OS==='ios'&&!reduce&&isGlassEffectAPIAvailable()&&isLiquidGlassAvailable();
 // The normal-layout wrapper never changes the child actions, accessibility labels or callbacks.
 if(glass)return <GlassView testID={testID+'-glass'} glassEffectStyle="regular" colorScheme={dark?'dark':'light'} tintColor={glassTint} style={style}>{children}</GlassView>;
 return <View testID={testID+'-tonal'} style={[style,{backgroundColor:materialEnabled?tone:surface}]}>{children}</View>;
}
