import React from 'react';
import {Pressable,Text,View} from 'react-native';
import {MATERIAL_APPEARANCES,materialTokens} from './material-tokens';
import {useMaterialAppearance} from './material-appearance';
import {ThemeMaterial} from './theme-material';
const descriptions={subtle:'Quiet tint and restrained depth.',enhanced:'Richer color and visible translucent edges.',expressive:'Bold personalized color and stronger glass accents.'};
export function MaterialPreferencePanel({dark,surface,accent,ink,muted}:{dark:boolean;surface:string;accent:string;ink:string;muted:string}){
 const {appearance,setAppearance,ready,error}=useMaterialAppearance();
 return <View style={{gap:8,paddingVertical:6}}>
 <Text accessibilityRole="header" style={{color:ink,fontSize:18,fontWeight:'700'}}>Material appearance</Text>
 <Text style={{color:muted}}>Choose the visual intensity on this device. Reduce Transparency and large text retain readable controls.</Text>
 <ThemeMaterial dark={dark} surface={surface} accent={accent} ink={ink} testID="material-appearance-options" style={{borderRadius:22,padding:6,gap:4}}>
 <View accessibilityRole="radiogroup" accessibilityLabel="Material appearance">{MATERIAL_APPEARANCES.map(mode=>{const chosen=appearance===mode;const label=mode[0].toUpperCase()+mode.slice(1);return <Pressable key={mode} testID={'material-choice-'+mode} accessibilityRole="radio" accessibilityLabel={label+' material appearance'} accessibilityState={{checked:chosen,disabled:!ready}} disabled={!ready} onPress={()=>setAppearance(mode)} style={{minHeight:52,borderRadius:16,padding:10,gap:4,backgroundColor:chosen?materialTokens(surface,accent,ink,mode).tone:'transparent'}}><Text style={{color:ink,fontSize:16,fontWeight:chosen?'700':'500'}}>{chosen?'✓ ':''}{label}{mode==='enhanced'?' · Recommended':''}</Text><Text style={{color:ink,fontSize:13}}>{descriptions[mode]}</Text></Pressable>;})}</View>
 </ThemeMaterial>{error?<Text accessibilityRole="alert" style={{color:ink}}>{error}</Text>:null}</View>;
}
