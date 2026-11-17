import React,{useState} from 'react';
import {Keyboard,Modal,Platform,Pressable,ScrollView,View,useWindowDimensions} from 'react-native';
import {SvgXml} from 'react-native-svg';
import {Button,Copy,useTheme} from './ui';
import {useData} from './state';
import {MemoryEditorIcon} from './memory-editor-controls';

const sourceIcons={
 light:{camera:require('../assets/photo-source-figma/light-camera.svg'),library:require('../assets/photo-source-figma/light-library.svg'),files:require('../assets/photo-source-figma/light-files.svg'),cancel:require('../assets/photo-source-figma/light-cancel.svg')},
 dark:{camera:require('../assets/photo-source-figma/dark-camera.svg'),library:require('../assets/photo-source-figma/dark-library.svg'),files:require('../assets/photo-source-figma/dark-files.svg'),cancel:require('../assets/photo-source-figma/dark-cancel.svg')},
};
/** Approved Figma chooser 557:47 / 1000:249; preserve native text scaling. */
function SourceAction({label,icon,onPress,cancel=false}:{label:string;icon:keyof typeof sourceIcons.light;onPress:()=>void;cancel?:boolean}){
 const {colors,dark}=useTheme();const [focused,setFocused]=useState(false);
 return <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} onAccessibilityTap={onPress} onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)} style={({pressed})=>({minHeight:Platform.OS==='android'?48:44,borderWidth:focused?2:0,borderBottomWidth:focused?2:1,borderColor:focused?colors.focus:colors.separator,borderRadius:0,paddingHorizontal:12,paddingVertical:10,flexDirection:'row',alignItems:'center',gap:8,alignSelf:cancel?'flex-start':'stretch',minWidth:cancel?106:undefined,maxWidth:'100%',backgroundColor:'transparent',opacity:pressed?.82:1})}>
  <View accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={{width:16,height:16,flexShrink:0}}><SvgXml xml={sourceIcons[dark?'dark':'light'][icon]}/></View>
  <Copy style={{flexShrink:1}}>{label}{cancel?'':' ›'}</Copy>
 </Pressable>;
}
/** Keep Cancel outside scrolling sources; neither Cancel nor Android Back changes the draft. */
export function PhotoSourceButton({disabled,onSelect}:{disabled?:boolean;onSelect:(source:boolean|'files')=>void}){
 const [visible,setVisible]=useState(false),{colors,dark}=useTheme(),{height}=useWindowDimensions(),{large}=useData();
 const close=()=>setVisible(false);
 const choose=(source:boolean|'files')=>{close();onSelect(source);};
 return <>
  <Button editorial primary icon={<MemoryEditorIcon name="photo"/>} label="+ Add Photo" displayLabel="Add Photo" trailing={<Copy style={{color:colors.onPrimary}}>›</Copy>} disabled={disabled} onPress={()=>{Keyboard.dismiss();setVisible(true);}}/>
  <Modal visible={visible} transparent animationType="none" onRequestClose={close}>
   <View style={{flex:1,backgroundColor:'#0008',justifyContent:'center',padding:24}}>
    <View accessibilityViewIsModal style={{backgroundColor:dark?colors.white:colors.paper,padding:16,borderRadius:12,gap:12,maxHeight:height*.85,width:'100%',maxWidth:330,alignSelf:'center'}}>
     <ScrollView style={{flexShrink:1}} keyboardShouldPersistTaps="handled" contentContainerStyle={{gap:12}}>
      <Copy kind="title" accessibilityRole="header" style={{fontSize:32*(large?1.6:1),lineHeight:39*(large?1.6:1)}}>Choose a photo source</Copy>
      <SourceAction label="Take Photo" icon="camera" onPress={()=>choose(true)}/>
      <SourceAction label="Choose from Library" icon="library" onPress={()=>choose(false)}/>
      <SourceAction label="Browse Files" icon="files" onPress={()=>choose('files')}/>
     </ScrollView>
     <SourceAction label="Cancel" icon="cancel" cancel onPress={close}/>
    </View>
   </View>
  </Modal>
 </>;
}
