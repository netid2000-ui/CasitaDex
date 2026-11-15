import React,{useState} from "react";
import {SafeAreaProvider,SafeAreaView} from "react-native-safe-area-context";
import {Alert,Modal,View} from "react-native";
import {Button,Copy,Field,Page,useTheme} from "./ui";
import {MemoryEditorChoice,MemoryEditorIcon} from "./memory-editor-controls";
import {plusFeatureEnforcementEnabled} from "./plus-entitlement-runtime";
import type {DataV2} from "./sb20-contract";
import {locationKey} from "./locations";
export function LocationPicker({data,spaceId,value,disabled,onSelect,onCreate,initiallyOpen=false}:{data:DataV2|undefined;spaceId:string|null;value:string;disabled:boolean;onSelect:(value:string)=>void;onCreate:(name:string)=>Promise<boolean>;initiallyOpen?:boolean}){
 const {colors}=useTheme();
 const [open,setOpen]=useState(initiallyOpen),[creating,setCreating]=useState(false),[query,setQuery]=useState(""),[name,setName]=useState(""),[busy,setBusy]=useState(false),[error,setError]=useState("");
 const scope=data?.spaces.find(x=>x.id===spaceId)?.name??"Unassigned";
 const labels=(data?.locations??[]).filter(l=>l.spaceId===spaceId&&locationKey(l.name).includes(locationKey(query))).sort((a,b)=>a.name.localeCompare(b.name));
 function close(){if(busy)return;setOpen(false);setCreating(false);setName("");setError("");}
 function choose(next:string){if(busy||disabled)return;onSelect(next);close();}
 async function create(){if(busy||disabled)return;setBusy(true);setError("");try{if(await onCreate(name.trim()))closeAfterSave();else setError("Location was not created. Check the name and try again.");}catch(e){setError(e instanceof Error?e.message:"Unable to create location. Your text is kept.");}finally{setBusy(false);}}
 function closeAfterSave(){setOpen(false);setCreating(false);setName("");}
 return <><MemoryEditorChoice label="Location" value={value||"None"} expanded={open} disabled={disabled} onPress={()=>{setQuery("");setError("");setOpen(true);}}/>
 <Modal visible={open} animationType="slide" onRequestClose={()=>{if(creating&&name.trim())Alert.alert("Keep your location edits?","Save or cancel before leaving.");else close();}}>
 <SafeAreaProvider><SafeAreaView style={{flex:1,backgroundColor:colors.paper}}><Page independent hideHeading title="Location" androidKeyboardAware stickyActions={<View style={{gap:12}}>
  <View style={{alignSelf:"flex-start"}}><Button compact editorial variant="quiet" label="Cancel" icon={<MemoryEditorIcon name="cancel"/>} disabled={busy} onPress={close}/></View>
  <Copy kind="section" accessibilityRole="header">{creating?"Create Location":"Choose a Location"}</Copy><Copy>Space: {scope}</Copy>
  {creating?<View style={{alignSelf:"flex-start"}}><Button compact editorial primary label="Save location" disabled={busy||disabled||!name.trim()||name.trim().length>200} onPress={()=>void create()}/></View>:<Button compact label="Create new Location" disabled={busy||disabled} onPress={()=>{setName("");setCreating(true);}}/>}
  {error?<Copy accessibilityLiveRegion="polite">{error}</Copy>:null}
 </View>}>
 {creating?<Field iosTextView={plusFeatureEnforcementEnabled} nativeEditing={plusFeatureEnforcementEnabled} label="Location name" value={name} onChangeText={setName} disabled={busy}/>:<><Field label="Search locations" value={query} onChangeText={setQuery}/><Button label="None" selected={!value} disabled={disabled} onPress={()=>choose("")}/>{labels.map(l=><Button key={l.id} label={l.name} selected={locationKey(value)===locationKey(l.name)} disabled={disabled} onPress={()=>choose(l.name)}/>)}{!labels.length?<Copy>No matching locations in this Space.</Copy>:null}</>}
 </Page></SafeAreaView></SafeAreaProvider></Modal></>;
}
