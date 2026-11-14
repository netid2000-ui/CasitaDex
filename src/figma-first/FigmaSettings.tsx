import React from 'react';
import {Pressable,Text,View,useWindowDimensions} from 'react-native';
import {useData} from '../state';
import {useFigmaTheme} from './tokens';
export type SettingsAction='plus'|'storage'|'backup'|'recovery'|'appearance'|'accessibility'|'privacy'|'help'|'labels';
export type FigmaSettingsProps={onOpen:(action:SettingsAction)=>void};
const entries:readonly {id:SettingsAction;title:string;description:string}[]=[
 {id:'plus',title:'CasitaDex Plus',description:'Explore the one-time upgrade'},
 {id:'appearance',title:'Appearance',description:'Light, dark, or follow your device'},
 {id:'accessibility',title:'Accessibility',description:'Large text and display appearance'},
 {id:'labels',title:'Spaces & categories',description:'Organize saved information'},
 {id:'backup',title:'Backup & restore',description:'Export or recover local data'},
 {id:'storage',title:'Privacy & storage',description:'Your memories stay on this device'},
 {id:'privacy',title:'Privacy & security',description:'Control how your data is protected'},
 {id:'help',title:'About CasitaDex',description:'Version, help and acknowledgements'},
 {id:'recovery',title:'Recently deleted',description:'Review recoverable memories'}
];
export function FigmaSettings({onOpen}:FigmaSettingsProps){
 const fg=useFigmaTheme();
 const {large}=useData();
 const {fontScale,width}=useWindowDimensions();
 const textMultiplier=large?1.6:1;
 const narrow=width<360||fontScale>=1.35||large;
 return <View style={{backgroundColor:fg.page,padding:16,gap:12}}>
  <Text style={{fontSize:12*textMultiplier,fontWeight:'700',letterSpacing:1.1,color:fg.eyebrowInk}}>PREFERENCES & PRIVACY</Text>
  <Text accessibilityRole="header" style={{fontSize:25*textMultiplier,fontWeight:'700',color:fg.headingInk}}>Settings.</Text>
  <Text style={{fontSize:14*textMultiplier,color:fg.secondaryInk}}>Your CasitaDex, your way.</Text>
  {entries.map(item=><Pressable key={item.id} accessibilityRole="button" accessibilityLabel={item.title} accessibilityHint={item.description} onPress={()=>onOpen(item.id)} style={{backgroundColor:fg.brandSurface,borderWidth:1,borderColor:fg.secondaryInk,borderRadius:12,minHeight:60,padding:12,flexDirection:narrow?'column':'row',alignItems:narrow?'stretch':'center',gap:12}}>
   <View style={{flex:narrow?undefined:1,gap:4,width:narrow?'100%':undefined}}><Text style={{fontSize:15*textMultiplier,fontWeight:'700',color:fg.headingInk}}>{item.title}</Text><Text style={{fontSize:12*textMultiplier,color:fg.secondaryInk}}>{item.description}</Text></View><Text accessibilityElementsHidden style={{fontSize:20*textMultiplier,color:fg.headingInk,alignSelf:narrow?'flex-end':'auto'}}>›</Text>
  </Pressable>)}
 </View>;
}