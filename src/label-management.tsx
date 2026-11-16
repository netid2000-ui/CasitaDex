import {plusFeatureEnforcementEnabled} from "./plus-entitlement-runtime";
import React,{useEffect,useState} from "react";
import {Alert,BackHandler,Pressable,View,useWindowDimensions} from "react-native";
import {router} from "expo-router";
import {SvgXml} from "react-native-svg";
import {Button,Copy,Field,Page,useTheme} from "./ui";
import {MemoryEditorIcon} from "./memory-editor-controls";
import {useStatusAnnouncement} from "./use-status-announcement";
import {useData} from "./state";
import {registerEditGuard} from "./eng-navigation";
import type {LabelEngine} from "./eng-screens";
import type {EngStore} from "./eng-runtime";
type Kind="space"|"category"|"location";
type Mode="list"|"detail"|"create"|"rename"|"removal"|"scope";
const icons={
 light:[require("../assets/approved-refresh/labels-light-space.svg"),require("../assets/approved-refresh/labels-light-category.svg"),require("../assets/approved-refresh/labels-light-plus.svg")],
 dark:[require("../assets/approved-refresh/labels-dark-space.svg"),require("../assets/approved-refresh/labels-dark-category.svg"),require("../assets/approved-refresh/labels-dark-plus.svg")],
};
export function LabelManagement({e}:{e:LabelEngine}){
 const {colors,dark}=useTheme();
 const {large}=useData(),{fontScale}=useWindowDimensions();
 const [kind,setKind]=useState<Kind>("space"),[mode,setMode]=useState<Mode>("list");
 const [scope,setScope]=useState<string|null>(null),[query,setQuery]=useState("");
 const [selected,setSelected]=useState(""),[name,setName]=useState(""),[revision,setRevision]=useState(0);
 const [impact,setImpact]=useState<Awaited<ReturnType<EngStore["taxonomyImpact"]>>|null>(null);
 const labels=(kind==="space"?e.snapshot?.data.spaces:kind==="category"?e.snapshot?.data.categories:e.snapshot?.data.locations?.filter(l=>l.spaceId===scope))??[];
 const label=labels.find(x=>x.id===selected),noun=kind==="space"?"Space":kind==="category"?"Category":"Location";
 const editing=mode==="create"||mode==="rename";
 useStatusAnnouncement(e.status);
 const dirty=editing&&name!==(mode==="rename"?label?.name??"":"");
 useEffect(()=>registerEditGuard(()=>dirty||e.busy),[dirty,e.busy]);
 function back(){
  if(e.busy)return;
  e.setStatus("");
  if(mode==="list"){router.replace("/more");return;}
  if(mode==="create"||mode==="detail"||mode==="scope"){setMode("list");setSelected("");}
  else setMode("detail");
  setImpact(null);
 }
 useEffect(()=>{const sub=BackHandler.addEventListener("hardwareBackPress",()=>{if(dirty){Alert.alert("Keep your label edits?","Save or cancel your edits before leaving.",[{text:"Keep editing",style:"cancel"}]);}else back();return true;});return()=>sub.remove();});
 function edit(next:"create"|"rename"){
  setName(next==="rename"?label?.name??"":"");setRevision(e.snapshot?.revision??0);e.setStatus("");setMode(next);
 }
 async function save(){
  if(!e.snapshot)return;
  const wasCreate=mode==="create";
  const ok=await e.run(store=>wasCreate?store.taxonomy(kind,name,revision,...(kind==="location"?[scope] as [string|null]:[])):store.renameTaxonomy(kind,selected,name,revision));
  if(ok){setMode(wasCreate?"list":"detail");if(wasCreate)setSelected("");}
 }
 async function review(){
  let next:Awaited<ReturnType<EngStore["taxonomyImpact"]>>|null=null;
  const ok=await e.run(async store=>{next=await store.taxonomyImpact(kind,selected);},"");
  if(ok&&next){setImpact(next);setMode("removal");}
 }
 async function remove(){
  if(!impact)return;
  const ok=await e.run(store=>store.removeTaxonomy(impact.kind,impact.id,impact.revision),"Label removed. Memories and photos were kept.");
  if(ok){setImpact(null);setSelected("");setMode("list");}
 }
 function row(title:string,onPress:()=>void,icon?:number,checked?:boolean){
  return <Pressable accessibilityRole="button" accessibilityLabel={title} accessibilityState={{disabled:e.busy,selected:checked}} disabled={e.busy} onPress={onPress} onAccessibilityTap={e.busy?undefined:onPress} style={{minHeight:44,paddingHorizontal:12,paddingVertical:8,borderRadius:8,borderWidth:1,borderColor:colors.line,backgroundColor:checked?colors.accent:colors.white,flexDirection:"row",alignItems:"center",gap:12}}>
   {icon!==undefined?<View accessible={false} accessibilityElementsHidden style={{width:16,height:16}}><SvgXml xml={icons[dark?"dark":"light"][icon]}/></View>:null}
   <Copy style={{flex:1}}>{title}</Copy><Copy>{checked?"✓":"›"}</Copy>
  </Pressable>;
 }
 const heading=mode==="list"?"Manage labels":mode==="scope"?"Choose a Space":editing?(mode==="create"?"Create ":"Rename ")+noun:mode==="removal"?"Review removal":label?.name??"Label unavailable";
 return <Page independent hideHeading title={heading} androidKeyboardAware stickyActions={<View style={{gap:14,maxWidth:720,width:"100%",alignSelf:"center"}}>
  <View style={{alignSelf:"flex-start"}}>{editing?<Button compact editorial variant="quiet" label="Cancel" disabled={e.busy} icon={<MemoryEditorIcon name="cancel"/>} onPress={back}/>:<Button compact editorial variant="quiet" label={mode==="list"?"‹ Settings":mode==="removal"?"‹ Label details":"‹ Manage labels"} disabled={e.busy} onPress={()=>{if(mode==="removal"){setMode("detail");setImpact(null);e.setStatus("");}else back();}}/>}</View>
  <Copy kind="title" accessibilityRole="header" style={{fontSize:large||fontScale>=1.35?24:44}}>{heading}</Copy>
  {editing?<View style={{alignSelf:"flex-start"}}><Button compact editorial primary label="Save" icon={<MemoryEditorIcon name="save"/>} disabled={e.busy||!name.trim()||name.trim().length>200||!e.snapshot} onPress={()=>void save()}/></View>:null}
  {e.status?<Copy kind="small" accessibilityLiveRegion="polite">{e.status}</Copy>:null}
 </View>}>
  {mode==="list"?<><Copy>Organize memories with spaces, categories and locations.</Copy>
   {row("Spaces",()=>{setKind("space");setQuery("");e.setStatus("");},0,kind==="space")}
   {row("Categories",()=>{setKind("category");setQuery("");e.setStatus("");},1,kind==="category")}
   {row("Locations",()=>{setKind("location");setQuery("");e.setStatus("");},0,kind==="location")}
   {kind==="location"?row("Space: "+(e.snapshot?.data.spaces.find(x=>x.id===scope)?.name??"Unassigned"),()=>setMode("scope")):null}
   {row("Create new label",()=>edit("create"),2)}
  </>:null}
  {mode==="scope"?<View style={{gap:14}}>{row("Unassigned",()=>{setScope(null);setQuery("");setMode("list");})}{[...(e.snapshot?.data.spaces??[])].sort((a,b)=>a.name.localeCompare(b.name)).map(x=><React.Fragment key={x.id}>{row(x.name,()=>{setScope(x.id);setQuery("");setMode("list");})}</React.Fragment>)}</View>:null}
  {mode==="list"?<View style={{gap:14}}><Field label="Search labels" value={query} onChangeText={setQuery}/>{[...labels].filter(x=>x.name.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())).sort((a,b)=>a.name.localeCompare(b.name)).map(x=><React.Fragment key={x.id}>{row(x.name,()=>{setSelected(x.id);setMode("detail");e.setStatus("");})}</React.Fragment>)}{!labels.length?<Copy>No {kind==="space"?"spaces":kind==="category"?"categories":"locations in this Space"} yet. Create a label to get started.</Copy>:null}</View>:null}
  {mode==="detail"&&label?<><Copy>{noun}</Copy><Button label="Rename ›" disabled={e.busy} onPress={()=>edit("rename")}/><Button label="Review removal ›" disabled={e.busy} onPress={()=>void review()}/></>:null}
  {editing?<>{kind==="location"?<Copy>Space: {e.snapshot?.data.spaces.find(x=>x.id===scope)?.name??"Unassigned"}</Copy>:null}<Field iosTextView={plusFeatureEnforcementEnabled} nativeEditing={plusFeatureEnforcementEnabled} label={noun+" name"} value={name} onChangeText={setName} disabled={e.busy}/><Copy>{mode==="create"?"Use this "+noun.toLowerCase()+" to organize your memories.":"The new name appears on every memory "+(kind==="space"?"assigned to this Space.":kind==="category"?"using this category.":"using this location in this Space.")}</Copy></>:null}
  {mode==="removal"&&impact?<><Copy>Remove “{impact.name}” from {impact.memories} saved memories and {impact.draft?"the unfinished draft":"no draft"}? Memories and photos are kept. {kind==="space"?"Removed Spaces become Unassigned.":kind==="category"?"This category is removed from those memories.":"The location assignment is cleared. Other Spaces are unchanged."}</Copy><Button label="Confirm remove label only" disabled={e.busy} onPress={()=>void remove()}/><Button label="Cancel label removal" disabled={e.busy} onPress={back}/></>:null}
 </Page>;
}
