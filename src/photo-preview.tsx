import React,{useEffect,useState} from "react";
import {Image,View,Text,type ImageStyle,type StyleProp} from "react-native";
import {photoThumbnail} from "./photo-thumbnail";
import {useTheme} from "./ui";
export function PhotoPreview({uri,label,style}:{uri:string;label:string;style?:StyleProp<ImageStyle>}){
 const {colors}=useTheme();const [preview,setPreview]=useState<{source:string;uri:string}|null>(null),[failed,setFailed]=useState<string|null>(null);
 useEffect(()=>{let active=true;void photoThumbnail(uri).then(value=>{if(active){setFailed(null);setPreview({source:uri,uri:value});}}).catch(()=>{if(active)setFailed(uri);});return()=>{active=false;};},[uri]);
 return preview?.source===uri&&failed!==uri?<Image source={{uri:preview.uri}} accessibilityLabel={label} resizeMode="cover" style={style} onError={()=>setFailed(uri)}/>:<View accessibilityLabel={label} style={[style,{backgroundColor:colors.white,alignItems:"center",justifyContent:"center"}]}>{failed===uri?<Text style={{fontSize:12,color:colors.muted}}>Tap to view photo</Text>:null}</View>;
}
