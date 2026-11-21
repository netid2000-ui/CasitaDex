import React,{useState} from "react";
import {View,Pressable} from "react-native";
import {router} from "expo-router";
import {Copy,Button,useTheme} from "./ui";
import {PhotoPreview} from "./photo-preview";
import {getEngStorage,engPhotoUri} from "./eng-runtime";
import type {EngSnapshot} from "./eng-types";
export function formatStorage(bytes:number){if(!Number.isFinite(bytes))return "Unavailable";if(bytes<1024)return bytes+" B";const units=["KB","MB","GB","TB"];let value=bytes/1024,i=0;while(value>=1024&&i<units.length-1){value/=1024;i++;}return value.toFixed(value<10?1:0)+" "+units[i];}
export function PhotoStoragePanel({snapshot,busy,onAudit}:{snapshot:EngSnapshot|null;busy:boolean;onAudit:()=>void}){
 const {s}=useTheme();const [measurement,setMeasurement]=useState<Awaited<ReturnType<typeof getEngStorage>>|null>(null),[measuring,setMeasuring]=useState(false),[error,setError]=useState("");
 async function measure(){if(measuring)return;setMeasuring(true);setError("");try{setMeasurement(await getEngStorage());}catch(e){setError(e instanceof Error?e.message:"Unable to measure storage. Your photos are kept.");}finally{setMeasuring(false);}}
 const photos=snapshot?.data.media.media??[],draft=snapshot?.draft;
 const largest=[...photos].sort((a,b)=>b.bytes-a.bytes).slice(0,3);
 const memories=new Map(snapshot?.data.memories.map(m=>[m.id,m]));
 return <View style={{gap:14}}>
 <Copy kind="title" accessibilityRole="header">Privacy & storage</Copy>
 <Copy>See how much space your photos use and how much is available on this device.</Copy>
 <Button label={measuring?"Measuring storage…":"Measure device storage"} disabled={measuring||busy} onPress={()=>void measure()}/>
 {error?<Copy accessibilityRole="alert">{error}</Copy>:null}
 <View style={s.panel}><Copy style={{fontWeight:"700"}}>Photo storage</Copy><Copy>Available on device: {measurement?formatStorage(measurement.free):"Measure to check"}</Copy><Copy>Saved photos: {formatStorage(photos.reduce((n,p)=>n+p.bytes,0))} · {photos.length} photos</Copy><Copy>Thumbnails: {measurement?formatStorage(measurement.thumbnailBytes):"Measure to check"}</Copy><Copy>Unfinished draft photos: {formatStorage(draft?.photos.reduce((n,p)=>n+p.bytes,0)??0)}</Copy><Copy>Archived and recently deleted photos still use storage.</Copy>{measurement?<Copy kind="small">Protected photo references: {formatStorage(measurement.referencedBytes)}. {measurement.unreadable} unreadable references. Recovery copies may overlap saved photos. Photo sizes exclude database and other app files.</Copy>:null}</View>
 <Button label="Check photo integrity" disabled={busy} onPress={onAudit}/>
 <View style={s.panel}><Copy style={{fontWeight:"700"}}>{largest.length} largest saved photos</Copy>{largest.map(p=>{const m=memories.get(p.cardId);return m?<Pressable key={p.id} accessibilityRole="button" accessibilityLabel={"Open "+m.title} onPress={()=>router.push({pathname:"/card",params:{id:m.id}})} style={{minHeight:64,flexDirection:"row",alignItems:"center",gap:10}}><PhotoPreview uri={engPhotoUri(p.path)} label={m.title} style={{width:48,height:48,borderRadius:8}}/><View style={{flex:1}}><Copy>{m.title}</Copy><Copy kind="small">Photo {m.mediaIds.indexOf(p.id)+1} · {formatStorage(p.bytes)} · {m.lifecycle==="active"?"Active":m.lifecycle==="archived"?"Archived":"Recently deleted"}</Copy></View><Copy>›</Copy></Pressable>:null;})}<Copy>Archiving or moving a memory to Recently Deleted keeps its photos and does not free their storage.</Copy></View>
 {draft?<Button disclosure label="Review unfinished draft and its photos" onPress={()=>router.push(draft.photos.length?"/add?mode=photo":"/add")}/>:null}
 <Copy>A full backup includes photos. Saving or restoring also needs temporary space. Available space at your backup destination may differ from this device.</Copy>
 <Button disclosure label="Backup & restore" onPress={()=>router.push("/settings-manage?action=backup")}/>
 </View>;
}
