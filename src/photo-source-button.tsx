import React,{useState} from 'react';
import {Keyboard,Modal,ScrollView,View,useWindowDimensions} from 'react-native';
import {Button,Copy,useTheme} from './ui';
import {MemoryEditorIcon} from './memory-editor-controls';

/** Android native alerts truncate a fourth action. Keep Cancel outside the scrolling sources. */
export function PhotoSourceButton({disabled,onSelect}:{disabled?:boolean;onSelect:(source:boolean|'files')=>void}){
 const [visible,setVisible]=useState(false),{colors}=useTheme(),{height}=useWindowDimensions();
 const close=()=>setVisible(false);
 const choose=(source:boolean|'files')=>{close();onSelect(source);};
 return <>
  <Button editorial primary icon={<MemoryEditorIcon name="photo"/>} label="+ Add Photo" displayLabel="Add Photo" trailing={<Copy style={{color:colors.onPrimary}}>›</Copy>} disabled={disabled} onPress={()=>{Keyboard.dismiss();setVisible(true);}}/>
  <Modal visible={visible} transparent animationType="none" onRequestClose={close}>
   <View style={{flex:1,backgroundColor:'#0008',justifyContent:'center',padding:24}}>
    <View accessibilityViewIsModal style={{backgroundColor:colors.paper,padding:18,borderRadius:8,gap:12,maxHeight:height*.85}}>
     <ScrollView style={{flexShrink:1}} keyboardShouldPersistTaps="handled" contentContainerStyle={{gap:12}}>
      <Copy kind="title" accessibilityRole="header">Add Photo</Copy>
      <Copy>Choose a source for your photo or image.</Copy>
      <Button label="Take Photo" onPress={()=>choose(true)}/>
      <Button label="Choose from Library" onPress={()=>choose(false)}/>
      <Button label="Browse Files" onPress={()=>choose('files')}/>
     </ScrollView>
     <Button label="Cancel" onPress={close}/>
    </View>
   </View>
  </Modal>
 </>;
}
