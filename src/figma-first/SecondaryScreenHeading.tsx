import React from 'react';
import {Text,View} from 'react-native';
import {useFigmaTheme} from './tokens';
export function SecondaryScreenHeading({eyebrow,title,description}:{eyebrow:string;title:string;description?:string}){
 const fg=useFigmaTheme();
 return <View style={{backgroundColor:fg.page,paddingVertical:12,gap:7}}>
  <Text style={{color:fg.eyebrowInk,fontSize:12,fontWeight:'700',letterSpacing:1.2}}>{eyebrow.toUpperCase()}</Text>
  <Text accessibilityRole='header' style={{color:fg.headingInk,fontSize:28,fontWeight:'700',lineHeight:35}}>{title}</Text>
  {description?<Text style={{color:fg.secondaryInk,fontSize:15,lineHeight:22}}>{description}</Text>:null}
 </View>;
}
