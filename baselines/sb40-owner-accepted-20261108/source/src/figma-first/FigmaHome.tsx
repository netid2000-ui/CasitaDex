/** New Home composition; no legacy screen imports or storage side effects. */
import React from 'react';
import {Image,Pressable,Text,View} from 'react-native';
import {HomeActionCard,type HomeActionKind} from './HomeActionCard';
import {homeActions} from './view-models';
import {useFigmaTheme} from './tokens';
export type FigmaHomeProps={draftPending:boolean;onAction:(kind:HomeActionKind)=>void;onSettings:()=>void;onFind:()=>void};
export function FigmaHome({draftPending,onAction,onSettings,onFind}:FigmaHomeProps){
 const fg=useFigmaTheme();
 return <View style={{backgroundColor:fg.page,padding:16,gap:12}}>
  <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',minHeight:44}}><Text style={{fontSize:12,fontWeight:'700',letterSpacing:1.1,color:fg.eyebrowInk}}>YOUR PERSONAL REFERENCE</Text><Pressable accessibilityRole="button" accessibilityLabel="Settings" onPress={onSettings} style={{width:44,height:44,borderRadius:12,borderWidth:1,borderColor:fg.secondaryInk,backgroundColor:fg.brandSurface,alignItems:'center',justifyContent:'center'}}><Text style={{fontSize:26,color:fg.headingInk}}>{'⚙'}</Text></Pressable></View>
  <Text accessibilityRole="header" style={{fontSize:25,fontWeight:'700',color:fg.headingInk}}>The details that matter.</Text>
  <Text style={{fontSize:14,lineHeight:21,color:fg.secondaryInk}}>A calmer place to keep useful things.</Text>
  <Pressable accessibilityRole="button" accessibilityLabel="Find a memory" accessibilityHint="Opens Find" onPress={onFind} style={({pressed})=>({minHeight:fg.actionHeight,borderRadius:fg.actionRadius,backgroundColor:fg.brandSurface,paddingHorizontal:16,paddingVertical:14,flexDirection:"row",alignItems:"center",gap:14,opacity:pressed?0.88:1})}><View style={{width:fg.iconSize,height:fg.iconSize,borderRadius:12,backgroundColor:fg.actionSurface,alignItems:"center",justifyContent:"center"}}><Image source={require("../../assets/ui-icons/figma-approved-v1/find.png")} resizeMode="contain" style={{width:25,height:25,tintColor:"#FFFFFF"}} /></View><View style={{flex:1}}><Text style={{fontSize:17,fontWeight:"700",color:fg.headingInk}}>Find a Memory</Text><Text style={{fontSize:13,color:fg.secondaryInk}}>Get an answer in seconds</Text></View></Pressable>
  {homeActions(draftPending).map(a=><HomeActionCard key={a.kind} kind={a.kind} disabled={a.disabled} onPress={()=>onAction(a.kind)}/>)}
 </View>;
}
