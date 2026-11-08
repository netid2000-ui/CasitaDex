import {orderedMemoryPhotos} from './photo-order';
import {savedReminderDestination} from "./reminder-save-destination";
import type { RepeatSchedule } from "./reminder-recurrence";
import DateTimePicker, { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import React, { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { Platform, Alert, AppState, BackHandler, Keyboard, Image, Modal, Pressable, ScrollView, Share, View, useWindowDimensions } from "react-native";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { Button, Copy, Field, Page, useTheme } from "./ui";
import { useData } from "./state";
import { getEngStore, getEngStorage, chooseEngPhoto, engPhotoUri, writeEngBackup, pickEngBackup, shareEngPhotos, writeEngText, type EngStore, type EngBackup } from "./eng-runtime";
import { newEngDraft } from "./eng-store";
import { listStandaloneReminders,saveStandaloneReminder,completeStandaloneReminder,deleteStandaloneReminder,requestStandaloneReminderAlerts,type StandaloneReminder } from "./standalone-reminders";
import type { EngDraft, EngSnapshot } from "./eng-types";
import type { MemoryV2 } from "./sb20-contract";
import { localDay, eventText, sharePreview, type ShareField } from "./eng-domain";
import { defaultFilter, findMemories, searchIndex, homeMemories, type FindFilter } from "./eng-find";
import { textBackupPreview, createTextBackup } from "./eng-text-backup";
import { duplicateCandidates } from "./eng-duplicates";
import { registerEditGuard } from "./eng-navigation";
import { BrandLogo, BrandArt } from "./brand";
import { HomeAction } from "./home-action";
import { EditorialIntro } from "./editorial-intro";
import { confidences } from "./model";
const day=localDay;
function message(e:unknown){const text=e instanceof Error?e.message:"Operation failed. Your last confirmed save is kept.";return text.startsWith("SB20 compatibility:")?"Check the name, answer or photo, source and dates before saving. Your last confirmed save is kept.":text;}
function useEng(){
  const [snapshot,setSnapshot]=useState<EngSnapshot|null>(null),[status,setStatus]=useState(""),[busy,setBusy]=useState(false);
  const lock=useRef(false),alive=useRef(true);
  useEffect(()=>()=>{alive.current=false;},[]);
  const refresh=useCallback(async()=>{
    try{const next=await(await getEngStore()).load();if(alive.current)setSnapshot(next);}
    catch(e){if(alive.current)setStatus(message(e));}
  },[]);
  useFocusEffect(useCallback(()=>{alive.current=true;void refresh();},[refresh]));
  async function run(task:(store:EngStore)=>Promise<unknown>,success="Saved on this device."){
    if(lock.current)return false;lock.current=true;setBusy(true);
    try{await task(await getEngStore());await refresh();if(alive.current&&success)setStatus(success);return true;}
    catch(e){if(alive.current)setStatus(message(e));return false;}
    finally{lock.current=false;if(alive.current)setBusy(false);}
  }
  return {snapshot,setSnapshot,status,setStatus,busy,run,refresh};
}
function Status({text}:{text:string}){return text ? <Copy kind="small" accessibilityLiveRegion="polite">{text}</Copy> : null;}
function MemoryLink({memory,data}:{memory:MemoryV2;data?:EngSnapshot["data"]}){
  const {s}=useTheme();
  return <Pressable accessibilityRole="button" accessibilityLabel={`Open ${memory.title}: ${memory.answer||"Photo memory"}`}
    onPress={()=>{Keyboard.dismiss();router.push({pathname:"/card",params:{id:memory.id}});}} style={s.panel}>
    {data?<><Copy kind="answer">{memory.answer||"Photo memory"}</Copy><Copy style={{fontWeight:"700"}}>{memory.title}</Copy>{!memory.answer&&data.media.media.find(p=>p.cardId===memory.id)?<Image source={{uri:engPhotoUri(data.media.media.find(p=>p.cardId===memory.id)!.path)}} accessibilityLabel={`Photo for ${memory.title}`} resizeMode="contain" style={{width:"100%",height:160}} />:null}<Copy kind="small">{data.spaces.find(x=>x.id===memory.spaceId)?.name??"Unassigned"}{memory.categoryIds.length?" · "+memory.categoryIds.map(id=>data.categories.find(x=>x.id===id)?.name).join(", "):""} · {memory.confidence}</Copy></>:<><Copy style={{fontWeight:"700"}}>{memory.title}</Copy><Copy>{memory.answer||"Photo memory"}</Copy></>}

  </Pressable>;
}
function openFullScreenPhoto(path:string,label:string){
 router.push({pathname:"/photo-viewer",params:{path,label}});
}

let findCache={query:"",filter:defaultFilter(),page:0,y:0,expanded:false};
export function EngHome(){
 const e=useEng(),{s}=useTheme(),[confirmDelete,setConfirmDelete]=useState(false);
 const home=e.snapshot?homeMemories(e.snapshot.data,day()):null;
 const [homeReminders,setHomeReminders]=useState<StandaloneReminder[]>([]);
 useFocusEffect(useCallback(()=>{let active=true;void listStandaloneReminders().then(items=>{if(active)setHomeReminders(items.filter(r=>!r.completed).sort((a,b)=>(a.dueDate+a.dueTime).localeCompare(b.dueDate+b.dueTime)).slice(0,3));}).catch(()=>{if(active)setHomeReminders([]);});return()=>{active=false;};},[]));
 const draft=e.snapshot?.draft;

 function commands(items:{label:string;action:()=>void;disabled?:boolean}[]){return <View style={{flexDirection:"row",gap:10}}>{items.map(item=><View key={item.label} style={{flex:1}}><Button label={item.label} disabled={item.disabled||e.busy} onPress={item.action} /></View>)}</View>;}
 return <Page independent title="" hideHeading>
 
 <EditorialIntro eyebrow="Your personal reference" title="The details that matter." description="A calmer place to keep useful things." />
 {draft?<View style={s.panel}>
   <Copy kind="answer">Unfinished Memory (Draft)</Copy>
   <Copy style={{fontWeight:"700"}}>{draft.title.trim()||"Untitled memory"}</Copy>
   <Copy kind="small">{draft.photos.length} attached photos. Your unfinished information is saved on this device.</Copy>
   {commands([{label:"Resume Draft",action:()=>router.push("/add")},{label:"Delete Draft",action:()=>setConfirmDelete(true)}])}
   {confirmDelete?<View style={{gap:8}}>
     <Copy>Delete this unfinished memory, its text and {draft.photos.length} draft photos? Saved memories and their photos will not be deleted.</Copy>
     {commands([{label:"Cancel",action:()=>setConfirmDelete(false)},{label:"Delete Draft and Photos",action:()=>void e.run(async store=>{await store.discard(draft.id,draft.checkpoint);setConfirmDelete(false);},"Draft deleted. Saved memories were kept.")}])}
   </View>:null}
 </View>:null}
 <View style={{gap:12}}>
 <HomeAction primary title="Add Memory" detail="Capture a useful detail" icon="Memories" disabled={!!draft||!e.snapshot} onPress={()=>router.push("/add")} />
 <HomeAction title="Add Photo Memory" detail="Start with an image" icon="Photos" disabled={!!draft||!e.snapshot} onPress={()=>router.push("/add?mode=photo")} />
 <HomeAction title="Add Reminder" detail="Remember the next step" icon="Reminders" onPress={()=>router.push("/reminders-manage?mode=new&origin=home")} />
 </View> {(homeReminders.length>0||!!home?.due.length)?<Copy kind="section" accessibilityRole="header">Upcoming reminders</Copy>:null}
 {homeReminders.length||home?.due.length?<>{homeReminders.map(r=><View key={r.id} style={s.panel}><Copy style={{fontWeight:"700"}}>{r.title}</Copy><Copy kind="small">{r.dueDate} at {r.dueTime}</Copy></View>)}{home?.due.slice(0,Math.max(0,3-homeReminders.length)).map(m=><MemoryLink key={m.id} memory={m} />)}<Button label="View all reminders" onPress={()=>router.push("/reminders")} /></>:null}
 <Status text={e.status} />
 </Page>;
}
export function EngPhotos(){
 const e=useEng(),{s}=useTheme(),[selected,setSelected]=useState<string|null>(null);
 const memories=e.snapshot?.data.memories.filter(m=>m.mediaIds.length>0&&m.lifecycle!=="recently_deleted")??[];
 const m=memories.find(x=>x.id===selected);
 return <Page independent title="Photos" hideHeading>
 <Copy>Select a saved memory to review, add, replace, or remove its photos. Existing photos are preserved until you confirm a change.</Copy>
 
 {!m?<>{memories.length===0?<Copy>No saved memories with photos yet.</Copy>:<View style={{ flexDirection:"row",flexWrap:"wrap",gap:12,justifyContent:"space-between" }}>{memories.map(x=>{
 const first=e.snapshot?.data.media.media.find(p=>p.cardId===x.id);
 return <Pressable key={x.id} accessibilityRole="button" accessibilityLabel={`Open ${x.title} photo memory`}
 onPress={()=>setSelected(x.id)} style={{width:"47%",minWidth:135,flexGrow:1,backgroundColor:s.panel.backgroundColor,borderWidth:1,borderColor:"#B9C4B9",borderRadius:17,padding:9,gap:9,minHeight:180}}>
  {first?<Image source={{uri:engPhotoUri(first.path)}} resizeMode="cover" accessibilityLabel={`Photo for ${x.title}`} style={{width:"100%",height:130,borderRadius:12,backgroundColor:"#E4EBE4"}}/>:<View style={{width:"100%",height:130,borderRadius:12,backgroundColor:"#E4EBE4",alignItems:"center",justifyContent:"center"}}><Copy>Photo</Copy></View>}
  <Copy style={{fontWeight:"700",fontSize:15}}>{x.title}</Copy><Copy kind="small">{x.mediaIds.length} {x.mediaIds.length===1?"photo":"photos"}</Copy>
 </Pressable>;
 })}</View>}</>:<>
 <Button label="Back to photo memories" onPress={()=>setSelected(null)} />
 <Copy kind="section">{m.title}</Copy>
 {(e.snapshot?orderedMemoryPhotos(e.snapshot.data,m.id):[]).map((p,i)=><View key={p.id} style={s.panel}>
 <Image source={{uri:engPhotoUri(p.path)}} resizeMode="contain" accessibilityLabel={"Saved photo "+(i+1)} style={{width:"100%",height:220}} />
 <Button label={"View photo "+(i+1)} onPress={()=>router.push({pathname:"/photo-viewer",params:{path:p.path,label:"Photo "+(i+1)+" of "+m.title,memoryId:m.id,photoId:p.id}})} />
 <Button label={"Replace photo "+(i+1)} disabled={e.busy} onPress={()=>void e.run(async store=>{const bytes=await chooseEngPhoto(false);if(bytes)await store.replaceMemoryPhoto(m.id,p.id,bytes);},"Photo replacement saved. Previous snapshot retained.")} />
 <Button label={"Remove photo "+(i+1)} disabled={e.busy} onPress={()=>Alert.alert("Remove saved photo?","Remove this photo from the memory? Previous full save remains recoverable.",[{text:"Cancel",style:"cancel"},{text:"Remove photo",style:"destructive",onPress:()=>void e.run(store=>store.removeMemoryPhoto(m.id,p.id))}])} />
 </View>)}
 <Button label="Add Photo" disabled={e.busy||m.mediaIds.length>=5} onPress={()=>void e.run(async store=>{const bytes=await chooseEngPhoto(false);if(bytes)await store.addMemoryPhoto(m.id,bytes);},"Photo added to saved memory.")} />
 </>}
 <Status text={e.status} />
 </Page>;
}
 const defaultFutureTime=()=>{const at=new Date(Date.now()+10*60*1000);return `${String(at.getHours()).padStart(2,"0")}:${String(at.getMinutes()).padStart(2,"0")}`;};
export function EngReminders(){
 const {s,colors,dark}=useTheme(),params=useLocalSearchParams<{mode?:string;id?:string;memoryId?:string;origin?:string}>();
 const [items,setItems]=useState<StandaloneReminder[]>([]),[expandedReminder,setExpandedReminder]=useState<string|null>(null),[editing,setEditing]=useState<string|null>(params.mode==="new"?"new":null);
 const reminderBaseline=useRef<{title:string;notes:string;dueDate:string;dueTime:string;repeat:RepeatSchedule}|null>(null);
 const [title,setTitle]=useState(""),[notes,setNotes]=useState(""),[dueDate,setDueDate]=useState(day()),[dueTime,setDueTime]=useState(defaultFutureTime),[repeat,setRepeat]=useState<RepeatSchedule>("once"),[iosPicker,setIosPicker]=useState<"date"|"time"|null>(null),[moreReminderOptions,setMoreReminderOptions]=useState(false),[status,setStatus]=useState(""),[busy,setBusy]=useState(false);
 if(params.mode==="new"&&!params.memoryId&&!reminderBaseline.current)reminderBaseline.current={title,notes,dueDate,dueTime,repeat};
 useEffect(()=>{if(params.mode!=="new"||!params.memoryId)return;let alive=true;void getEngStore().then(store=>store.load()).then(snapshot=>{const memory=snapshot.data.memories.find(m=>m.id===params.memoryId&&m.lifecycle==="active");if(!alive||!memory)return;setEditing("new");setTitle(`Review ${memory.title}`.slice(0,200));setNotes((memory.answer||memory.location||"").slice(0,4000));setDueDate(memory.due&&memory.due>day()?memory.due:day());const initialTime=defaultFutureTime();setDueTime(initialTime);reminderBaseline.current={title:`Review ${memory.title}`.slice(0,200),notes:(memory.answer||memory.location||"").slice(0,4000),dueDate:memory.due&&memory.due>day()?memory.due:day(),dueTime:initialTime,repeat:"once"};setMoreReminderOptions(false);}).catch(()=>{if(alive)setStatus("Unable to load memory for reminder.");});return()=>{alive=false;};},[params.mode,params.memoryId]);
 const refresh=useCallback(async()=>{try{setItems(await listStandaloneReminders());}catch(e){setStatus(message(e));}},[]);
 useFocusEffect(useCallback(()=>{void refresh();},[refresh]));
 useEffect(()=>{if(!params.id)return;let active=true;void listStandaloneReminders().then(rows=>{const match=rows.find(r=>r.id===params.id);if(active&&match)edit(match);}).catch(()=>{if(active)setStatus("Unable to load the selected reminder.");});return()=>{active=false;};},[params.id]);
 function choosePicker(mode:"date"|"time"){
  const parts=dueDate.split("-").map(Number),clock=dueTime.split(":").map(Number);
  const current=new Date(parts[0],parts[1]-1,parts[2],clock[0],clock[1]);
  if(Platform.OS==="android"){
   DateTimePickerAndroid.open({value:current,mode,is24Hour:false,onChange:(event,selected)=>{
    if(event.type!=="set"||!selected)return;
    if(mode==="date")setDueDate([selected.getFullYear(),String(selected.getMonth()+1).padStart(2,"0"),String(selected.getDate()).padStart(2,"0")].join("-"));
    else setDueTime([String(selected.getHours()).padStart(2,"0"),String(selected.getMinutes()).padStart(2,"0")].join(":"));
   }});
  }else setIosPicker(mode);
 }
 const returnToLinkedMemory=()=>{if(!params.memoryId)return;const go=()=>router.replace({pathname:"/card",params:{id:params.memoryId}});if(editing!==null&&reminderDirty){Alert.alert("Leave reminder editor?","Your unsaved reminder changes will be lost. The saved memory will not be changed.",[{text:"Keep editing",style:"cancel"},{text:"Return to memory",style:"destructive",onPress:go}]);}else go();};
 const reminderDirty=editing!==null&&!!reminderBaseline.current&&(title!==reminderBaseline.current.title||notes!==reminderBaseline.current.notes||dueDate!==reminderBaseline.current.dueDate||dueTime!==reminderBaseline.current.dueTime||repeat!==reminderBaseline.current.repeat);
  const leaveReminder=useCallback(()=>{const go=()=>router.replace(params.origin==="home"?"/":"/reminders");if(!reminderDirty){go();return;}Alert.alert("Discard reminder changes?","Your unsaved reminder changes will be lost.",[{text:"Keep editing",style:"cancel"},{text:"Discard changes",style:"destructive",onPress:go}]);},[reminderDirty,params.origin]);
  useEffect(()=>{if(editing===null)return;const h=BackHandler.addEventListener("hardwareBackPress",()=>{leaveReminder();return true;});return()=>h.remove();},[editing,leaveReminder]);
  function edit(r?:StandaloneReminder){const initial={title:r?.title??"",notes:r?.notes??"",dueDate:r?.dueDate??day(),dueTime:r?.dueTime??defaultFutureTime(),repeat:r?.repeat??"once" as RepeatSchedule};reminderBaseline.current=initial;setEditing(r?.id??"new");setTitle(initial.title);setNotes(initial.notes);setDueDate(initial.dueDate);setDueTime(initial.dueTime);setRepeat(initial.repeat);setMoreReminderOptions(!!r&&(!!r.notes||r.repeat!=="once"));setStatus("");}
 function saveReminderWithDuplicateCheck(){
  const memoryId=params.memoryId??items.find(r=>r.id===editing)?.memoryId??null;
  const save=()=>void act(()=>saveStandaloneReminder({id:editing==="new"?undefined:editing??undefined,title,notes,memoryId,dueDate,dueTime,repeat}),"Reminder saved on this device.");
  const duplicate=items.find(r=>r.id!==editing&&!r.completed&&r.dueDate===dueDate&&r.dueTime===dueTime&&r.repeat===repeat&&(memoryId?r.memoryId===memoryId:r.memoryId==null&&r.title.trim().toLocaleLowerCase()===title.trim().toLocaleLowerCase()));
  if(duplicate){Alert.alert("Similar reminder already scheduled","A reminder for the same item at this date and time already exists. Keep both reminders?",[{text:"Review reminder",style:"cancel"},{text:"Keep both",onPress:save}]);return;}
  save();
 }
 async function act(task:()=>Promise<unknown>,success:string){if(busy)return;setBusy(true);try{const result=await task();await refresh();setEditing(null);setStatus(typeof result==="string"?result:success);if(editing!==null)router.replace(savedReminderDestination(params.memoryId,params.origin));}catch(e){setStatus(message(e));}finally{setBusy(false);}}
 return <Page independent title="Reminders" hideHeading stickyActions={editing!==null?<View style={{maxWidth:720,width:"100%",alignSelf:"center"}}>  <View style={{flexDirection:"row",gap:10,alignItems:"stretch"}}>
   <View style={{flex:1}}><Button variant="quiet" label="Cancel" onPress={leaveReminder}/></View>
   <View style={{flex:1}}><Button primary label="Save Reminder" disabled={busy||!title.trim()} onPress={saveReminderWithDuplicateCheck}/></View>
  </View></View>:undefined}>
 {params.memoryId?<Button compact label="‹ Return to Memory Details" onPress={returnToLinkedMemory}/>:null}
 {editing===null?<><Copy>Reminders are saved locally. Device alerts need permission and a future due time; delivery can vary with device settings.</Copy><Button label="Enable device reminder alerts" onPress={()=>void act(()=>requestStandaloneReminderAlerts(),"Device alerts checked.")}/></>:null}
 {editing!==null?<View style={{gap:12}}>
  {editing==="new"?null:<Copy kind="section">Edit reminder</Copy>}
  <View style={{backgroundColor:colors.white,borderWidth:1,borderColor:colors.separator,borderRadius:14,padding:16}}><Field label="Reminder title *" value={title} onChangeText={setTitle} maxLength={200}/></View>
  <View style={{backgroundColor:colors.white,borderWidth:1,borderColor:colors.separator,borderRadius:14,padding:16,gap:10}}>
   <Copy style={{color:colors.ink,fontWeight:"700"}}>When should we remind you?</Copy>
   <View style={{flexDirection:"row",gap:10}}><View style={{flex:1,gap:6}}><Copy kind="small">Date</Copy><Button label={dueDate} onPress={()=>choosePicker("date")}/></View><View style={{flex:1,gap:6}}><Copy kind="small">Time (AM / PM)</Copy><Button label={new Date(`2000-01-01T${dueTime}:00`).toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit",hour12:true})} onPress={()=>choosePicker("time")}/></View></View>
  </View>
  {new Date(`${dueDate}T${dueTime}:00`).getTime()<=Date.now()?<Copy style={{color:colors.ink,fontWeight:"700"}}>This time has already passed. Choose a future date and time to receive an alert.</Copy>:null}
  <Button variant="quiet" label={moreReminderOptions?"Hide options ▴":"More options ▾"} onPress={()=>setMoreReminderOptions(!moreReminderOptions)}/>
  {moreReminderOptions?<><View style={{gap:8}}><Copy style={{color:colors.ink,fontWeight:"700"}}>Repeat</Copy><View style={{flexDirection:"row",flexWrap:"wrap",gap:8}}>{(["once","daily","weekly","monthly","yearly"] as RepeatSchedule[]).map(option=><Button key={option} compact label={option==="once"?"Once":option[0].toUpperCase()+option.slice(1)} selected={repeat===option} onPress={()=>setRepeat(option)}/>)}</View></View><Field label="Notes" value={notes} onChangeText={setNotes} multiline maxLength={4000}/></>:null}
  <Modal visible={iosPicker!==null} transparent animationType="fade" onRequestClose={()=>setIosPicker(null)}>
   <View style={{flex:1,justifyContent:"center",padding:20,backgroundColor:"rgba(0,0,0,0.48)"}}>
    <View style={{backgroundColor:colors.white,borderRadius:20,padding:18,gap:12}}>
     <Copy style={{fontWeight:"700",fontSize:20,color:colors.ink}}>{iosPicker==="date"?"Choose a date":"Choose a time"}</Copy>
     {iosPicker?<DateTimePicker themeVariant={dark?"dark":"light"} textColor={dark?"#FFFFFF":"#172F27"} value={new Date(dueDate+"T"+dueTime+":00")} mode={iosPicker} display={iosPicker==="date"?"inline":"spinner"} style={{alignSelf:"stretch",height:iosPicker==="date"?340:200}} onChange={(_,selected)=>{if(!selected)return;if(iosPicker==="date")setDueDate([selected.getFullYear(),String(selected.getMonth()+1).padStart(2,"0"),String(selected.getDate()).padStart(2,"0")].join("-"));else setDueTime([String(selected.getHours()).padStart(2,"0"),String(selected.getMinutes()).padStart(2,"0")].join(":"));}}/>:null}
     <Button primary label="Done" onPress={()=>setIosPicker(null)}/>
    </View>
   </View>
  </Modal>

 </View>:<Button primary label="Create Reminder" onPress={()=>edit()}/>}
 {editing===null&&params.mode!=="new"&&!params.id?items.map(r=><View key={r.id} style={s.panel}>
  <Copy style={{fontWeight:"700"}}>{r.title}</Copy><Copy>{r.dueDate} at {r.dueTime} · {r.repeat}{r.completed?" · Completed":""}</Copy>
  {r.notes?<Copy kind="small">{r.notes}</Copy>:null}
  {r.memoryId?<Button compact label="View Linked Memory" onPress={()=>router.push({pathname:"/card",params:{id:r.memoryId!}})}/>:null}
  <Button variant="quiet" label={expandedReminder===r.id?"Close actions":"Manage reminder"} onPress={()=>setExpandedReminder(old=>old===r.id?null:r.id)}/>
  {expandedReminder===r.id?<>  <Button label="Edit" disabled={busy} onPress={()=>edit(r)}/>
  <Button label={r.completed?"Mark Incomplete":"Mark Complete"} disabled={busy} onPress={()=>void act(()=>completeStandaloneReminder(r.id,!r.completed),"Reminder updated.")}/>
  <Button label="Delete Reminder" disabled={busy} onPress={()=>Alert.alert("Delete reminder?","This standalone reminder will be permanently deleted. Saved memories are not affected.",[{text:"Cancel",style:"cancel"},{text:"Delete",style:"destructive",onPress:()=>void act(()=>deleteStandaloneReminder(r.id),"Reminder deleted.")}])}/> </>:null}
 </View>):null}
 <Status text={status}/></Page>;
}
export function EngMemories(){
 const e=useEng();
 const [category,setCategory]=useState<string>("all"),[limit,setLimit]=useState(50);
 const data=e.snapshot?.data;
 const memories=(data?.memories??[]).filter(m=>m.lifecycle==="active"&&(category==="all"||m.categoryIds.includes(category))).sort((a,b)=>(b.updatedAt??b.createdAt??"").localeCompare(a.updatedAt??a.createdAt??""));
 return <Page independent hideHeading title="Memories">
  
  
  <Copy>Browse and manage what you have saved on this device.</Copy>
  <Button label="Add Memory" onPress={()=>router.push("/add")} />
  <Button variant="quiet" label="Add 90 fictional QA sample memories" disabled={e.busy} onPress={()=>Alert.alert("Add 90 sample memories?","Adds clearly labeled fictional household records and 15 categories on this Development device. Existing memories, draft, and photos are preserved. This action is idempotent; sample records are not real facts.",[{text:"Cancel",style:"cancel"},{text:"Add samples",onPress:()=>void e.run(store=>store.seedSyntheticQa(),"90 fictional sample memories added. Existing draft preserved.")}])} />
  <Copy kind="section">Browse by category</Copy>
  <ScrollView horizontal showsHorizontalScrollIndicator contentContainerStyle={{flexDirection:"row",gap:8,paddingBottom:4}}>
   <Button compact label="All categories" selected={category==="all"} onPress={()=>{setCategory("all");setLimit(50);}} />
   {data?.categories.map(c=><Button compact key={c.id} label={c.name} selected={category===c.id} onPress={()=>{setCategory(c.id);setLimit(50);}} />)}
  </ScrollView>
  {memories.length===0?<Copy>No saved memories in this category yet.</Copy>:memories.slice(0,limit).map(m=><MemoryLink key={m.id} memory={m} data={data!} />)}
  {memories.length>limit?<Button label={`Show more (${memories.length-limit} remaining)`} onPress={()=>setLimit(n=>n+50)} />:null}
  <Button label="Find a specific answer" onPress={()=>router.push("/answers")} />
  <Button label="Settings, backup and recovery" onPress={()=>router.push("/more")} />
  <Status text={e.status} />
 </Page>;
}export function EngFind(){
 const e=useEng(),{s}=useTheme();const [query,setQuery]=useState(findCache.query),[f,setF]=useState<FindFilter>(findCache.filter),[page,setPage]=useState(findCache.page),[filters,setFilters]=useState(findCache.expanded),[selecting,setSelecting]=useState(false),[selected,setSelected]=useState<string[]>([]);
 const [returnScroll,setReturnScroll]=useState(()=>({key:0,y:findCache.y})),focused=useRef(false);
 useFocusEffect(useCallback(()=>{const y=findCache.y;focused.current=true;setReturnScroll(old=>({key:old.key+1,y}));return()=>{focused.current=false;};},[]));
 const index=useMemo(()=>e.snapshot?searchIndex(e.snapshot.data):[],[e.snapshot]);
 const records=useMemo(()=>findMemories(index,query,f,day()),[index,query,f]);
 useEffect(()=>{findCache={...findCache,query,filter:f,page,expanded:filters};},[query,f,page,filters]);
 function filter(patch:Partial<FindFilter>){setF(old=>({...old,...patch}));setPage(0);setSelected([]);}
 function bulk(state:MemoryV2["lifecycle"]){const ids=[...selected],revision=e.snapshot!.revision;Alert.alert(`Change ${ids.length} selected memories?`,`Move to ${state==="active"?"Active":state==="archived"?"Archive":"Recently Deleted"}. Photos stay attached. Previous full save remains recoverable.`,[{text:"Cancel",style:"cancel"},{text:"Confirm",onPress:()=>void e.run(async store=>{await store.bulkLifecycle(ids,state,revision);setSelected([]);setSelecting(false);})}]);}
 const hasFilters=f.space!=="all"||f.categories.length>0||f.uncategorized||f.confidence!=="all"||f.reminder!=="all"||f.attachment!=="all";
 const currentPage=Math.min(page,Math.max(0,Math.ceil(records.length/50)-1));
 return <Page key={returnScroll.key} independent hideHeading title="Find an answer" restoreScrollY={returnScroll.y} restoreReady={!!e.snapshot} onScrollY={y=>{if(focused.current)findCache.y=y;}}>
 
 <Button compact variant="quiet" label="‹ Back to Home" onPress={()=>router.navigate("/")} />
 
 <Field label="Search your memories" value={query} onChangeText={q=>{setQuery(q);setPage(0);}} />
 <ScrollView horizontal showsHorizontalScrollIndicator contentContainerStyle={{flexDirection:"row",gap:8,paddingBottom:4}}>{(["active","archived","recently_deleted"] as const).map(value=><Button compact key={value} label={value==="active"?"Active":value==="archived"?"Archived":"Recently Deleted"} selected={f.lifecycle===value} onPress={()=>filter({lifecycle:value,reminder:"all"})} />)}</ScrollView>
 <View style={{gap:6}}><Copy kind="small" style={{fontWeight:"600"}}>Space</Copy><ScrollView horizontal showsHorizontalScrollIndicator contentContainerStyle={{flexDirection:"row",gap:8,paddingBottom:4}}><Button compact label="All spaces" selected={f.space==="all"} onPress={()=>filter({space:"all"})} /><Button compact label="Unassigned" selected={f.space===null} onPress={()=>filter({space:null})} />{e.snapshot?.data.spaces.map(x=><Button compact key={x.id} label={x.name} selected={f.space===x.id} onPress={()=>filter({space:x.id})} />)}</ScrollView></View>
 <View style={{gap:6}}><Copy kind="small" style={{fontWeight:"600"}}>Categories (any selected)</Copy><ScrollView horizontal showsHorizontalScrollIndicator contentContainerStyle={{flexDirection:"row",gap:8,paddingBottom:4}}><Button compact label="All categories" selected={!f.categories.length&&!f.uncategorized} onPress={()=>filter({categories:[],uncategorized:false})} /><Button compact label="Uncategorized" selected={f.uncategorized} onPress={()=>filter({categories:[],uncategorized:true})} />{e.snapshot?.data.categories.map(x=><Button compact key={x.id} label={x.name} selected={f.categories.includes(x.id)} onPress={()=>filter({uncategorized:false,categories:f.categories.includes(x.id)?f.categories.filter(id=>id!==x.id):[...f.categories,x.id]})} />)}</ScrollView></View>
 <Button compact label={filters?"Hide more filters":"More filters"} onPress={()=>setFilters(!filters)} />{filters?<>
 <Copy>Verification</Copy><View style={s.row}>{["all",...confidences].map(value=><Button compact key={value} label={value==="all"?"Any verification":value} selected={f.confidence===value} onPress={()=>filter({confidence:value})} />)}</View>
 <Copy>Reminders (active memories)</Copy><View style={s.row}>{["all","due","overdue","today","future","none"].map(value=><Button compact key={value} label={value==="all"?"Any reminder":value} selected={f.reminder===value} onPress={()=>filter({reminder:value})} />)}</View>
 <Copy>Attachments</Copy><View style={s.row}>{["all","photos","text"].map(value=><Button compact key={value} label={value==="all"?"Any attachment":value==="text"?"Without photos":"With photos"} selected={f.attachment===value} onPress={()=>filter({attachment:value})} />)}</View>
 </>:null}
 {hasFilters?<View style={s.row}>{f.space!=="all"?<Button compact label="Remove Space filter" onPress={()=>filter({space:"all"})} />:null}{f.uncategorized?<Button compact label="Remove Uncategorized filter" onPress={()=>filter({uncategorized:false})} />:null}{f.categories.map(id=><Button compact key={id} label={`Remove ${e.snapshot?.data.categories.find(c=>c.id===id)?.name??"Category"} filter`} onPress={()=>filter({categories:f.categories.filter(c=>c!==id)})} />)}{(["confidence","reminder","attachment"] as const).filter(key=>f[key]!=="all").map(key=><Button compact key={key} label={`Remove ${f[key]} filter`} onPress={()=>filter({[key]:"all"})} />)}</View>:null}
 {hasFilters?<Copy kind="small">{f.lifecycle==="active"?"Active memories":f.lifecycle==="archived"?"Archived memories":"Recently Deleted memories"} · Filters applied</Copy>:null}
 {hasFilters?<Button compact variant="quiet" label="Clear filters" onPress={()=>{setF({...defaultFilter(),lifecycle:f.lifecycle});setPage(0);}} />:null}
 <View style={[s.row,{alignItems:"center",justifyContent:"space-between"}]}><Copy kind="small">{records.length} {records.length===1?"memory":"memories"}</Copy><Button compact label={selecting?"Cancel selection":"Select memories"} onPress={()=>{setSelecting(!selecting);setSelected([]);}} /></View>{selecting?<><Copy>{selected.length} selected</Copy>{(["active","archived","recently_deleted"] as const).filter(state=>state!==f.lifecycle).map(state=><Button compact key={state} label={state==="active"?"Restore selected":state==="archived"?"Archive selected":"Delete selected"} disabled={e.busy||!selected.length} onPress={()=>bulk(state)} />)}</>:null}{records.slice(currentPage*50,(currentPage+1)*50).map(m=><View key={m.id}>{selecting?<Button compact label={`Select ${m.title}`} disabled={e.busy} selected={selected.includes(m.id)} onPress={()=>setSelected(old=>old.includes(m.id)?old.filter(id=>id!==m.id):[...old,m.id])} />:null}<MemoryLink memory={m} data={e.snapshot!.data} /></View>)}
 {e.snapshot&&!records.length?<><BrandArt name="find" size={120} /><Copy>No memories match. Try fewer words or clear filters.</Copy></>:null}
 {records.length>50?<View style={s.row}><Copy>Page {currentPage+1} of {Math.ceil(records.length/50)}</Copy><Button compact label="Previous 50 results" disabled={!currentPage} onPress={()=>setPage(currentPage-1)} /><Button compact label="Next 50 results" disabled={(currentPage+1)*50>=records.length} onPress={()=>setPage(currentPage+1)} /></View>:null}
 {f.lifecycle==="recently_deleted"?<Copy>Deleted memories and photos remain recoverable. Restore them from their details.</Copy>:null}<Status text={e.status} />
 </Page>;
}
const addCardHeading={fontWeight:"700" as const};

export function EngAdd(){
  const params=useLocalSearchParams<{mode?:string}>();const photoFirst=params.mode==="photo";
  const e=useEng(),{s,colors}=useTheme();const {setStatus}=e;const [form,setForm]=useState<EngDraft|null>(null),[mode,setMode]=useState<"loading"|"edit">("loading");
  const [duplicate,setDuplicate]=useState(false),[organize,setOrganize]=useState(false),[details,setDetails]=useState(false);
  const [expandedField,setExpandedField]=useState<"location"|"notes"|"source"|null>(null);
  
  const [newSpace,setNewSpace]=useState(""),[newCategory,setNewCategory]=useState(""),[discard,setDiscard]=useState(false);
  const [showDraftActions,setShowDraftActions]=useState(false);
  const [taxonomyQueryAdd,setTaxonomyQueryAdd]=useState(""),[creatingTaxonomyAdd,setCreatingTaxonomyAdd]=useState(false);
  const [selectingTaxonomyAdd,setSelectingTaxonomyAdd]=useState(false);
  const current=useRef<EngDraft|null>(null),timer=useRef<ReturnType<typeof setTimeout>|null>(null),initialized=useRef(false),done=useRef(false),blocked=useRef(false);
  const [working,setWorking]=useState(false);const alive=useRef(true);
  const write=useCallback(async(d:EngDraft)=>{
    await(await getEngStore()).checkpoint(d);
    if(alive.current&&current.current?.checkpoint===d.checkpoint)setStatus("Draft saved on this device.");
  },[setStatus]);
  const flush=useCallback(async()=>{if(timer.current)clearTimeout(timer.current);timer.current=null;if(current.current&&!done.current)await write(current.current);},[write]);
  useEffect(()=>{
    if(e.snapshot&&!initialized.current){initialized.current=true;current.current=e.snapshot.draft;setForm(e.snapshot.draft);setMode("edit");}
  },[e.snapshot]);
  useFocusEffect(useCallback(()=>{let active=true;void getEngStore().then(store=>store.load()).then(snapshot=>{if(!active||!initialized.current||!snapshot.draft||!current.current||snapshot.draft.id!==current.current.id)return;if(snapshot.draft.checkpoint>current.current.checkpoint){current.current=snapshot.draft;setForm(snapshot.draft);}}).catch(()=>{});return()=>{active=false;};},[]));
  useEffect(()=>{
    alive.current=true;
    const listener=AppState.addEventListener("change",state=>{if(state!=="active")void flush().catch(e=>{if(alive.current)eSet(message(e));});});
    function eSet(text:string){setStatus(text);}
    return()=>{alive.current=false;listener.remove();void flush().catch(()=>undefined);};
  },[flush,setStatus]);
  function update(d:EngDraft){current.current=d;setForm(d);}
  function change(patch:Partial<Pick<EngDraft,"title"|"answer"|"location"|"spaceId"|"categoryIds"|"notes"|"source"|"due">>){
    if(blocked.current||done.current||mode!=="edit")return;
    const old=current.current??newEngDraft(),next={...old,...patch,checkpoint:old.checkpoint+1};update(next);
    setStatus("Draft has changes to save.");if(timer.current)clearTimeout(timer.current);
    timer.current=setTimeout(()=>{timer.current=null;void write(next).catch(error=>setStatus(message(error)));},400);
  }
  async function action(task:(store:EngStore)=>Promise<void>,allowSaved=false){
    if(blocked.current)return;blocked.current=true;setWorking(true);
    try{try{await flush();}catch(error){if(!allowSaved||message(error)!=="Draft was already saved")throw error;}await task(await getEngStore());await e.refresh();}
    catch(error){setStatus(message(error));}
    finally{blocked.current=false;if(alive.current)setWorking(false);}
  }
  async function photo(camera:boolean|"files"){
    if(!current.current){const fresh=newEngDraft();fresh.checkpoint++;update(fresh);}
    await action(async store=>{
      const bytes=await chooseEngPhoto(camera);if(!bytes){setStatus("Photo selection canceled. Your draft is kept.");return;}
      const next=await store.addPhoto(current.current!.id,bytes);update(next.draft!);setStatus("Photo saved with your draft.");
    });
  }
  async function save(confirmed=false){
    const draft=current.current;
    if(!confirmed&&draft?.title.trim()&&e.snapshot&&duplicateCandidates(draft,e.snapshot).length>0){
      setDuplicate(true);setStatus("A similar saved memory or matching photo exists. Review it before saving another.");return;
    }
    await action(async store=>{
      const value=current.current;if(!value)throw Error("Add a memory name and either a description or a photo");
      await store.saveDraft(value.attempt,value.memoryId);done.current=true;
      router.replace("/");
    },true);
  }
  const disabled=e.busy||working;
  const addCardStyle={backgroundColor:colors.accent,borderWidth:1,borderColor:colors.line,borderRadius:14,padding:10,gap:4} as const;
  const resumedDraft=!!form&&!!e.snapshot?.draft&&form.id===e.snapshot.draft.id;
  const editingPhotoDraft=photoFirst||(resumedDraft&&(form?.photos.length??0)>0);
  return <Page independent hideHeading title={editingPhotoDraft?"Add a Photo Memory":"Add a Memory"} stickyActions={mode==="edit"?<View style={{maxWidth:720,width:"100%",alignSelf:"center"}}>      <View style={{flexDirection:"row",gap:10,alignItems:"stretch"}}>
       <View style={{flex:1}}><Button variant="quiet" label="Cancel" disabled={disabled} onPress={()=>void flush().then(()=>router.replace("/")).catch(error=>setStatus(message(error)))}/></View>
       <View style={{flex:1}}><Button primary label={working?"Saving…":"Save"} disabled={disabled||!form?.title.trim()||(!form.answer.trim()&&!form.photos.length)||(editingPhotoDraft&&!form.photos.length)} onPress={()=>void save()} /></View>
      </View></View>:undefined}>
     {mode==="loading"?<Copy>Reading your draft…</Copy>:null}
    {mode==="edit"?<>


      {editingPhotoDraft?<View style={{backgroundColor:colors.accent,borderRadius:14,padding:16,gap:10}}>
        <Copy accessibilityRole="header" style={{fontWeight:"700"}}>PHOTOS · {form?.photos.length??0}/5</Copy>
        <View style={{flexDirection:"row",flexWrap:"wrap",gap:10}}>{form?.photos.map((item,index)=><Pressable key={item.id} accessibilityRole="button" accessibilityLabel={`View photo ${index+1} full screen`} onPress={()=>router.push({pathname:"/photo-viewer",params:{draftId:form.id,photoId:item.id,label:`Draft photo ${index+1}`}})} style={{width:96,height:96,borderRadius:12,overflow:"hidden",borderWidth:1,borderColor:colors.line}}><Image source={{uri:engPhotoUri(item.path)}} resizeMode="cover" style={{width:"100%",height:"100%"}} /></Pressable>)}</View>
        <Button label="+ Add Photo" disabled={disabled||(form?.photos.length??0)>=5} onPress={()=>Alert.alert("Add Photo","Choose a source for your photo or image.",[{text:"Take Photo",onPress:()=>void photo(true)},{text:"Choose from Library",onPress:()=>void photo(false)},{text:"Browse Files",onPress:()=>void photo("files")},{text:"Cancel",style:"cancel"}])} />
        {(form?.photos.length??0)>0?<Copy kind="small">Tap a photo to view or remove it. Maximum five.</Copy>:null}
      </View>:null}
      <View style={addCardStyle}><Field maxLength={200} label="Memory name (Required)" value={form?.title??""} onChangeText={title=>change({title})} /></View>
      <View style={addCardStyle}><View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between",gap:10}}><View style={{flex:1,gap:6}}><Copy accessibilityRole="header" style={addCardHeading}>SPACE</Copy><Copy>{e.snapshot?.data.spaces.find(x=>x.id===form?.spaceId)?.name??"None"}</Copy></View><Button compact label={organize?"Close ▴":"Choose ▾"} onPress={()=>{setOrganize(!organize);setDetails(false);setTaxonomyQueryAdd("");setCreatingTaxonomyAdd(false);setSelectingTaxonomyAdd(false);}} /></View>{organize?<View style={{backgroundColor:colors.accent,borderRadius:14,padding:12,gap:10}}><Copy accessibilityRole="header">Choose a Space</Copy><Button compact label={selectingTaxonomyAdd?"Select Space ▴":"Select Space ▾"} onPress={()=>{setSelectingTaxonomyAdd(!selectingTaxonomyAdd);setCreatingTaxonomyAdd(false);}} /><Button compact label={creatingTaxonomyAdd?"Create new Space ▴":"+ Create new Space ▾"} onPress={()=>{setCreatingTaxonomyAdd(!creatingTaxonomyAdd);setSelectingTaxonomyAdd(false);setNewSpace("");}} />{creatingTaxonomyAdd?<><Field label="New Space name" value={newSpace} onChangeText={setNewSpace} /><Button compact label="Create and assign" disabled={disabled||!newSpace.trim()} onPress={()=>void action(async store=>{const result=await store.taxonomy("space",newSpace);const item=result.data.spaces.at(-1)!;const d=current.current??newEngDraft();const updated={...d,spaceId:item.id,checkpoint:d.checkpoint+1};await store.checkpoint(updated);update(updated);setNewSpace("");setCreatingTaxonomyAdd(false);setOrganize(false);setStatus("Space created and selected.");})} /></>:null}{selectingTaxonomyAdd&&!creatingTaxonomyAdd?<ScrollView nestedScrollEnabled keyboardShouldPersistTaps="always" showsVerticalScrollIndicator style={{maxHeight:240}}><View style={{gap:6}}>{!taxonomyQueryAdd.trim()?<Button compact label="None" selected={!form?.spaceId} disabled={disabled} onPress={()=>{change({spaceId:null});setOrganize(false);}} />:null}{e.snapshot?.data.spaces.filter(item=>item.name.toLocaleLowerCase().includes(taxonomyQueryAdd.trim().toLocaleLowerCase())).sort((a,b)=>a.name.localeCompare(b.name)).map(item=><Button compact key={item.id} label={`${form?.spaceId===item.id?"✓ ":""}${item.name}`} selected={form?.spaceId===item.id} disabled={disabled} onPress={()=>{change({spaceId:item.id});setOrganize(false);setTaxonomyQueryAdd("");}} />)}</View></ScrollView>:null}</View>:null}</View>

      <View style={addCardStyle}><View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between",gap:10}}><View style={{flex:1,gap:6}}><Copy accessibilityRole="header" style={addCardHeading}>CATEGORIES</Copy><Copy>{form?.categoryIds.map(id=>e.snapshot?.data.categories.find(x=>x.id===id)?.name).filter(Boolean).join(", ")||"None"}</Copy></View><Button compact label={details?"Close ▴":"Choose ▾"} onPress={()=>{setDetails(!details);setOrganize(false);setTaxonomyQueryAdd("");setCreatingTaxonomyAdd(false);setSelectingTaxonomyAdd(false);}} /></View>{details?<View style={{backgroundColor:colors.accent,borderRadius:14,padding:12,gap:10}}><Copy accessibilityRole="header">Choose Categories</Copy><Button compact label={selectingTaxonomyAdd?"Select Category ▴":"Select Category ▾"} onPress={()=>{setSelectingTaxonomyAdd(!selectingTaxonomyAdd);setCreatingTaxonomyAdd(false);}} /><Button compact label={creatingTaxonomyAdd?"Create new Category ▴":"+ Create new Category ▾"} onPress={()=>{setCreatingTaxonomyAdd(!creatingTaxonomyAdd);setSelectingTaxonomyAdd(false);setNewCategory("");}} />{creatingTaxonomyAdd?<><Field label="New Category name" value={newCategory} onChangeText={setNewCategory} /><Button compact label="Create and assign" disabled={disabled||!newCategory.trim()} onPress={()=>void action(async store=>{const result=await store.taxonomy("category",newCategory);const item=result.data.categories.at(-1)!;const d=current.current??newEngDraft();const updated={...d,categoryIds:[...d.categoryIds,item.id],checkpoint:d.checkpoint+1};await store.checkpoint(updated);update(updated);setNewCategory("");setCreatingTaxonomyAdd(false);setDetails(false);setStatus("Category created and selected.");})} /></>:null}{form?.categoryIds.length?<View style={s.row}>{form.categoryIds.map(id=>{const item=e.snapshot?.data.categories.find(x=>x.id===id);return item?<Button compact key={id} label={`${item.name} ×`} disabled={disabled} onPress={()=>change({categoryIds:form.categoryIds.filter(x=>x!==id)})} />:null;})}</View>:null}{selectingTaxonomyAdd&&!creatingTaxonomyAdd?<ScrollView nestedScrollEnabled keyboardShouldPersistTaps="always" showsVerticalScrollIndicator style={{maxHeight:240}}><View style={{gap:6}}>{!taxonomyQueryAdd.trim()?<Button compact label="None" selected={!form?.categoryIds.length} disabled={disabled} onPress={()=>change({categoryIds:[]})} />:null}{e.snapshot?.data.categories.filter(item=>item.name.toLocaleLowerCase().includes(taxonomyQueryAdd.trim().toLocaleLowerCase())).sort((a,b)=>a.name.localeCompare(b.name)).map(item=><Button compact key={item.id} label={`${form?.categoryIds.includes(item.id)?"✓ ":""}${item.name}`} selected={form?.categoryIds.includes(item.id)} disabled={disabled} onPress={()=>change({categoryIds:form?.categoryIds.includes(item.id)?form.categoryIds.filter(id=>id!==item.id):[...(form?.categoryIds??[]),item.id]})} />)}</View></ScrollView>:null}</View>:null}</View>

      <View style={addCardStyle}><Field maxLength={1000} label="Description" value={form?.answer??""} onChangeText={answer=>change({answer})} multiline compactMultiline /></View>
      {(["location","notes","source"] as const).map(key=><View key={key} style={addCardStyle}><View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between",gap:10}}><View style={{flex:1,gap:6}}><Copy accessibilityRole="header" style={addCardHeading}>{key==="source"?"REFERENCE":key.toUpperCase()}</Copy>{expandedField!==key?<Copy numberOfLines={2}>{form?.[key]?.trim()||"Not provided"}</Copy>:null}</View><Button compact label={expandedField===key?"Done":"Edit ✎"} onPress={()=>setExpandedField(expandedField===key?null:key)} /></View>{expandedField===key?<Field maxLength={key==="source"?200:4000} label={`Edit ${key}`} multiline={key==="notes"} value={form?.[key]??""} onChangeText={value=>change({[key]:value})} />:null}</View>)}
      {!editingPhotoDraft?<View style={{backgroundColor:colors.accent,borderRadius:14,padding:16,gap:10}}>
        <Copy accessibilityRole="header" style={{fontWeight:"700"}}>PHOTOS · {form?.photos.length??0}/5</Copy>
        <View style={{flexDirection:"row",flexWrap:"wrap",gap:10}}>{form?.photos.map((item,index)=><Pressable key={item.id} accessibilityRole="button" accessibilityLabel={`View photo ${index+1} full screen`} onPress={()=>router.push({pathname:"/photo-viewer",params:{draftId:form.id,photoId:item.id,label:`Draft photo ${index+1}`}})} style={{width:96,height:96,borderRadius:12,overflow:"hidden",borderWidth:1,borderColor:colors.line}}><Image source={{uri:engPhotoUri(item.path)}} resizeMode="cover" style={{width:"100%",height:"100%"}} /></Pressable>)}</View>
        <Button label="+ Add Photo" disabled={disabled||(form?.photos.length??0)>=5} onPress={()=>Alert.alert("Add Photo","Choose a source for your photo or image.",[{text:"Take Photo",onPress:()=>void photo(true)},{text:"Choose from Library",onPress:()=>void photo(false)},{text:"Browse Files",onPress:()=>void photo("files")},{text:"Cancel",style:"cancel"}])} />
        {(form?.photos.length??0)>0?<Copy kind="small">Tap a photo to view or remove it. Maximum five.</Copy>:null}
      </View>:null}
      <Copy kind="small" style={{color:colors.muted}}>{editingPhotoDraft?"Attach at least one photo; up to five photos per memory.":"Add a description or a photo to save your memory."}</Copy>

    </>:null}
    {duplicate?<View style={s.panel}><Copy>Possible duplicate. Your draft is safe. Review the existing memory or save anyway.</Copy>{(form&&e.snapshot?duplicateCandidates(form,e.snapshot):[]).map(m=><View key={m.id}><Copy>Existing {m.lifecycle==="recently_deleted"?"Recently Deleted":m.lifecycle} memory</Copy><MemoryLink memory={m} /></View>)}
      <Button primary label="Return to editing" onPress={()=>setDuplicate(false)} />
      <Button label="Save as separate memory" disabled={disabled} onPress={()=>void save(true)} />
    </View>:null}
    {discard?<View style={s.panel}><Copy>Discard this unfinished memory and its photos? Saved memories will stay as they are.</Copy>
      <Button label="Keep draft" disabled={disabled} onPress={()=>setDiscard(false)} />
      <Button label="Confirm discard draft" disabled={disabled} onPress={()=>void action(async store=>{const d=current.current;if(d)await store.discard(d.id,d.checkpoint);current.current=null;setForm(null);setDiscard(false);setMode("edit");setStatus("Draft discarded. Your saved memories are kept.");})} />
    </View>:null}
    <Status text={e.status} />
    {form&&(form.title.trim()||form.answer.trim()||form.photos.length>0)?<Button compact label={showDraftActions?"Hide draft options ▴":"Draft options ▾"} disabled={disabled||mode==="loading"} onPress={()=>setShowDraftActions(!showDraftActions)} />:null}
    {showDraftActions?<Button compact label="Keep draft and leave" disabled={disabled||mode==="loading"} onPress={()=>void action(async()=>{router.replace("/");})} />:null}
  </Page>;
}
  function DetailField({label,value,onEdit}:{label:string;value:string;onEdit?:()=>void}){const {colors}=useTheme();return <View style={{backgroundColor:colors.accent,borderWidth:1,borderColor:colors.line,borderRadius:14,padding:14,gap:6}}><View style={{flexDirection:"row",justifyContent:"space-between",alignItems:"center",gap:8}}><Copy kind="small" style={{fontWeight:"700",color:colors.ink}}>{label.toUpperCase()}</Copy>{onEdit?<Button compact label={`Edit ${label}`} onPress={onEdit}/>:null}</View><Copy selectable style={{fontSize:16,lineHeight:24,color:colors.ink}}>{value}</Copy></View>;}
export function EngDetail(){
  const e=useEng(),{s,colors}=useTheme(),{id}=useLocalSearchParams<{id:string}>();
  const {large}=useData();
  const {width:detailWidth,fontScale:detailFontScale}=useWindowDimensions();
  const stackedDetailActions=large||detailFontScale>=1.35||detailWidth<360;
  const memory=e.snapshot?.data.memories.find(m=>m.id===id);
   
  const [edit,setEdit]=useState<MemoryV2|null>(null),[revision,setRevision]=useState(0),[history,setHistory]=useState("");
  const [review,setReview]=useState(false),[source,setSource]=useState("");
  const [moreActions,setMoreActions]=useState(false);
  const [showStickyMemoryTitle,setShowStickyMemoryTitle]=useState(false);
  const [nextDue,setNextDue]=useState("");
  const [editingReference,setEditingReference]=useState(false),[referenceDraft,setReferenceDraft]=useState("");
  const [inlineTaxonomy,setInlineTaxonomy]=useState<"space"|"category"|null>(null),[inlineName,setInlineName]=useState("");
  const [taxonomyQuery,setTaxonomyQuery]=useState(""),[creatingTaxonomy,setCreatingTaxonomy]=useState(false);
  const [selectingDetailTaxonomy,setSelectingDetailTaxonomy]=useState(false);
  const dirty=!!edit&&JSON.stringify(edit)!==JSON.stringify(memory);
  useEffect(()=>registerEditGuard(()=>dirty),[dirty]);
  useEffect(()=>{if(!dirty)return;const h=BackHandler.addEventListener("hardwareBackPress",()=>{Alert.alert("Keep your edits?","Save or cancel your edits before leaving this memory.");return true;});return()=>h.remove();},[dirty]);
  const m=edit??memory;
  function confirm(label:string,task:(store:EngStore)=>Promise<unknown>){Alert.alert(label,"Your previous full save remains recoverable.",[{text:"Cancel",style:"cancel"},{text:label,onPress:()=>void e.run(task)}]);}
  const saveEdits=()=>{if(!edit)return;void e.run(async store=>{await store.updateMemory(edit,revision);setEdit(null);});};
  const renderTaxonomySelector=(kind:"space"|"category")=><View style={{backgroundColor:colors.accent,borderRadius:14,padding:12,gap:10}}>
        <Copy accessibilityRole="header">{kind==="space"?"Choose a Space":"Choose Categories"}</Copy>
        {kind==="category"&&m!.categoryIds.length?<View style={s.row}>{m!.categoryIds.map(id=>{const item=e.snapshot?.data.categories.find(x=>x.id===id);return item?<Button key={id} compact label={`${item.name} ×`} disabled={e.busy} onPress={()=>void e.run(async store=>{await store.updateMemory({...m!,categoryIds:m!.categoryIds.filter(x=>x!==id)},e.snapshot!.revision);})}/>:null;})}</View>:null}<Button compact label={selectingDetailTaxonomy?`Select ${kind==="space"?"Space":"Category"} ▴`:`Select ${kind==="space"?"Space":"Category"} ▾`} onPress={()=>{setSelectingDetailTaxonomy(!selectingDetailTaxonomy);setCreatingTaxonomy(false);}} /><Button compact label={creatingTaxonomy?`Create new ${kind==="space"?"Space":"Category"} ▴`:`+ Create new ${kind==="space"?"Space":"Category"} ▾`} onPress={()=>{setCreatingTaxonomy(!creatingTaxonomy);setSelectingDetailTaxonomy(false);setInlineName("");}} />
        {creatingTaxonomy?<><Field label={kind==="space"?"New Space name":"New Category name"} value={inlineName} onChangeText={setInlineName}/><Button compact label="Create and assign" disabled={e.busy||!inlineName.trim()} onPress={()=>void e.run(async store=>{const result=await store.taxonomy(kind,inlineName,e.snapshot!.revision);const item=(kind==="space"?result.data.spaces:result.data.categories).at(-1)!;await store.updateMemory(kind==="space"?{...m!,spaceId:item.id}:{...m!,categoryIds:[...m!.categoryIds,item.id]},result.revision);setInlineName("");setCreatingTaxonomy(false);setInlineTaxonomy(null);})}/></>:null}
        
        {selectingDetailTaxonomy&&!creatingTaxonomy?<ScrollView nestedScrollEnabled keyboardShouldPersistTaps="always" showsVerticalScrollIndicator style={{maxHeight:240}}><View style={{gap:6}}>
          {!taxonomyQuery.trim()?<Button compact label="None" selected={kind==="space"?!m!.spaceId:!m!.categoryIds.length} disabled={e.busy} onPress={()=>void e.run(async store=>{await store.updateMemory(kind==="space"?{...m!,spaceId:null}:{...m!,categoryIds:[]},e.snapshot!.revision);if(kind==="space")setInlineTaxonomy(null);})}/>:null}
          {(kind==="space"?e.snapshot?.data.spaces:e.snapshot?.data.categories)?.filter(item=>item.name.toLocaleLowerCase().includes(taxonomyQuery.trim().toLocaleLowerCase())).sort((a,b)=>a.name.localeCompare(b.name)).map(item=><Button compact key={item.id} label={`${(kind==="space"?m!.spaceId===item.id:m!.categoryIds.includes(item.id))?"✓ ":""}${item.name}`} selected={kind==="space"?m!.spaceId===item.id:m!.categoryIds.includes(item.id)} disabled={e.busy} onPress={()=>void e.run(async store=>{await store.updateMemory(kind==="space"?{...m!,spaceId:item.id}:{...m!,categoryIds:m!.categoryIds.includes(item.id)?m!.categoryIds.filter(x=>x!==item.id):[...m!.categoryIds,item.id]},e.snapshot!.revision);if(kind==="space")setInlineTaxonomy(null);})} />)}
        </View></ScrollView>:null}
      </View>;

  const beginFieldEdit=()=>{if(!memory||edit)return;setEdit(JSON.parse(JSON.stringify(memory)));setRevision(e.snapshot!.revision);setMoreActions(false);};
  const editField=(label:string)=>m?.lifecycle!=="recently_deleted"&&!edit?<Button compact label={`Edit ${label}`} disabled={e.busy} onPress={beginFieldEdit}/>:null;
  return <Page independent hideHeading title={m?.title??"Memory"} onScrollY={y=>setShowStickyMemoryTitle(previous=>previous===(y>90)?previous:y>90)} stickyActions={<View style={{maxWidth:720,width:"100%",alignSelf:"center",gap:6}}>{!edit&&m&&showStickyMemoryTitle?<Copy kind="small" style={{color:colors.ink,fontWeight:"700"}}>{m.title}</Copy>:null}{edit?<><View style={{flexDirection:"row",alignItems:"center",gap:10}}><View style={{flex:1}}><Button compact label="Cancel" disabled={e.busy} onPress={()=>setEdit(null)} /></View><View style={{flex:2}}><Button compact primary label="Save & return to details" disabled={e.busy} onPress={saveEdits} /></View></View></>:<View style={{flexDirection:stackedDetailActions?"column":"row",alignItems:stackedDetailActions?"stretch":"center",gap:6}}><View style={{flex:1}}><Button compact label="‹ Results" onPress={()=>router.back()} /></View><View style={{flex:1}}><Button compact primary label="Edit memory" disabled={!m||e.busy} onPress={()=>{if(m){setEdit(JSON.parse(JSON.stringify(m)));setRevision(e.snapshot!.revision);}}} /></View>{m&&m.lifecycle!=="recently_deleted"?<View style={{flex:1}}><Button compact label={moreActions?"Close ▴":"More ···"} onPress={()=>setMoreActions(!moreActions)} /></View>:null}</View>}{!edit&&m&&m.lifecycle!=="recently_deleted"?<>{moreActions?<View style={{backgroundColor:colors.accent,borderRadius:14,padding:10,gap:8}}><Button compact label="Remind me later" disabled={e.busy} onPress={()=>{setMoreActions(false);router.push({pathname:"/reminders-manage",params:{mode:"new",memoryId:m.id}});}} /><Button compact label="Share memory" disabled={e.busy} onPress={()=>{setMoreActions(false);router.push({pathname:"/share-memory",params:{id:m.id}});}} /><Button compact label={m.lifecycle==="active"?"Archive memory":"Return to Active"} disabled={e.busy} onPress={()=>{setMoreActions(false);void e.run(store=>store.lifecycle(m.id,m.lifecycle==="active"?"archived":"active",day()));}} /><Button compact label="Move to Recently Deleted" disabled={e.busy} onPress={()=>{setMoreActions(false);confirm("Move to Recently Deleted",store=>store.lifecycle(m.id,"recently_deleted",day()));}} /></View>:null}</>:null}</View>}>
    

    <View style={{backgroundColor:colors.accent,borderWidth:1,borderColor:colors.line,borderRadius:16,padding:16,gap:6}}><Copy kind="small" style={{color:colors.ink,fontWeight:"700"}}>SAVED MEMORY</Copy>{edit?<Field disabled={e.busy} maxLength={200} label="Memory name (Required)" value={edit.title} onChangeText={title=>setEdit({...edit,title})}/>:<View style={{flexDirection:"row",alignItems:"center",gap:8}}><View style={{flex:1}}><Copy accessibilityRole="header" style={{color:colors.ink,fontSize:23,lineHeight:30,fontWeight:"700"}}>{m?.title??"Memory"}</Copy></View>{editField("name")}</View>}</View>
    
    {m?<>
      <View style={{gap:10}}>{(["Space","Categories"] as const).map(kind=>{const key=kind==="Space"?"space":"category";return <View key={kind} style={{gap:8}}><View style={{backgroundColor:colors.accent,borderColor:colors.line,borderWidth:1,borderRadius:14,padding:12,flexDirection:"row",alignItems:"center",gap:10}}><View style={{flex:1,gap:4}}><Copy kind="small" style={{fontWeight:"700",color:colors.ink}}>{kind.toUpperCase()}</Copy><Copy style={{color:colors.ink}}>{kind==="Space"?(e.snapshot?.data.spaces.find(x=>x.id===m.spaceId)?.name??"None"):(m.categoryIds.map(id=>e.snapshot?.data.categories.find(x=>x.id===id)?.name).filter(Boolean).join(", ")||"None")}</Copy></View><Button compact label={inlineTaxonomy===key?"Close ▴":edit?"Choose ▾":"Edit ✎"} onPress={()=>{setInlineTaxonomy(inlineTaxonomy===key?null:key);setInlineName("");setTaxonomyQuery("");setCreatingTaxonomy(false);setSelectingDetailTaxonomy(false);}} /></View>{inlineTaxonomy===key?(edit?<View style={{backgroundColor:colors.accent,padding:12,borderRadius:14,gap:8}}><Button compact label={selectingDetailTaxonomy?"Select "+kind+" ▴":"Select "+kind+" ▾"} onPress={()=>{setSelectingDetailTaxonomy(!selectingDetailTaxonomy);setCreatingTaxonomy(false);}} /><Button compact label={creatingTaxonomy?"Create new "+kind+" ▴":"+ Create new "+kind+" ▾"} onPress={()=>{setCreatingTaxonomy(!creatingTaxonomy);setSelectingDetailTaxonomy(false);setInlineName("");}} />{creatingTaxonomy?<><Field label={`New ${key} name`} value={inlineName} onChangeText={setInlineName}/><Button compact label="Create and select" disabled={e.busy||!inlineName.trim()} onPress={()=>void e.run(async store=>{const next=await store.taxonomy(key,inlineName,revision);const item=(key==="space"?next.data.spaces:next.data.categories).at(-1)!;setEdit({...edit,...(key==="space"?{spaceId:item.id}:{categoryIds:[...edit.categoryIds,item.id]})});setRevision(next.revision);setInlineName("");setCreatingTaxonomy(false);if(key==="space")setInlineTaxonomy(null);})}/></>:null}{selectingDetailTaxonomy&&!creatingTaxonomy?<ScrollView nestedScrollEnabled style={{maxHeight:225}}><View style={{gap:6}}><Button compact label="None" selected={key==="space"?!edit.spaceId:!edit.categoryIds.length} onPress={()=>{setEdit(key==="space"?{...edit,spaceId:null}:{...edit,categoryIds:[]});if(key==="space")setInlineTaxonomy(null);}} />{(key==="space"?e.snapshot?.data.spaces:e.snapshot?.data.categories)?.slice().sort((a,b)=>a.name.localeCompare(b.name)).map(item=><Button key={item.id} compact label={item.name} selected={key==="space"?edit.spaceId===item.id:edit.categoryIds.includes(item.id)} onPress={()=>{setEdit(key==="space"?{...edit,spaceId:item.id}:{...edit,categoryIds:edit.categoryIds.includes(item.id)?edit.categoryIds.filter(x=>x!==item.id):[...edit.categoryIds,item.id]});if(key==="space")setInlineTaxonomy(null);}} />)}</View></ScrollView>:null}</View>:renderTaxonomySelector(key)):null}</View>;})}</View>
      {edit?<>
        <View style={{backgroundColor:colors.accent,borderWidth:1,borderColor:colors.line,borderRadius:14,padding:14}}><Field disabled={e.busy} maxLength={1000} label="Description" value={edit.answer} onChangeText={answer=>setEdit({...edit,answer})} multiline /></View>
        <View style={{backgroundColor:colors.accent,borderWidth:1,borderColor:colors.line,borderRadius:14,padding:14}}><Field disabled={e.busy} maxLength={4000} label="Location" value={edit.location} onChangeText={location=>setEdit({...edit,location})} /></View>
        <View style={{backgroundColor:colors.accent,borderWidth:1,borderColor:colors.line,borderRadius:14,padding:14}}><Field disabled={e.busy} maxLength={4000} label="Notes" value={edit.notes} onChangeText={notes=>setEdit({...edit,notes})} /></View>
        <View style={{backgroundColor:colors.accent,borderWidth:1,borderColor:colors.line,borderRadius:14,padding:14}}><Field disabled={e.busy} maxLength={200} label="Reference" value={edit.source} onChangeText={source=>setEdit({...edit,source})} /></View>
        <View style={{backgroundColor:colors.accent,borderWidth:1,borderColor:colors.line,borderRadius:14,padding:12,gap:4}}><Copy kind="small" style={{fontWeight:"700",color:colors.ink}}>VERIFICATION STATUS</Copy><Copy>{edit.confidence}</Copy></View>
        <View style={{backgroundColor:colors.accent,borderRadius:14,padding:14,gap:10}}><Copy accessibilityRole="header" style={{fontWeight:"700"}}>PHOTOS · {e.snapshot?.data.media.media.filter(p=>p.cardId===edit.id).length??0}/5</Copy>
        <View style={{flexDirection:"row",flexWrap:"wrap",gap:10}}>{e.snapshot?.data.media.media.filter(p=>p.cardId===edit.id).map((p,index)=><Pressable key={p.id} accessibilityRole="button" accessibilityLabel={`View photo ${index+1} full screen`} onPress={()=>router.push({pathname:"/photo-viewer",params:{path:p.path,label:`Photo ${index+1} of ${edit.title}`,memoryId:edit.id,photoId:p.id}})} style={{width:96,height:96,borderRadius:12,overflow:"hidden",borderWidth:1,borderColor:colors.line}}><Image source={{uri:engPhotoUri(p.path)}} resizeMode="cover" style={{width:"100%",height:"100%"}} /></Pressable>)}</View>
        <Button label="+ Add Photo" disabled={e.busy||dirty||(e.snapshot?.data.media.media.filter(p=>p.cardId===edit.id).length??0)>=5} onPress={()=>Alert.alert("Add Photo","Choose a source for your photo or image.",[{text:"Take Photo",onPress:()=>void e.run(async store=>{const bytes=await chooseEngPhoto(true);if(bytes)await store.addMemoryPhoto(edit.id,bytes);})},{text:"Choose from Library",onPress:()=>void e.run(async store=>{const bytes=await chooseEngPhoto(false);if(bytes)await store.addMemoryPhoto(edit.id,bytes);})},{text:"Browse Files",onPress:()=>void e.run(async store=>{const bytes=await chooseEngPhoto("files");if(bytes)await store.addMemoryPhoto(edit.id,bytes);})},{text:"Cancel",style:"cancel"}])} />
        {dirty?<Copy kind="small">Save or cancel your text changes before adding photos.</Copy>:null}</View>
      </>:<>
        <DetailField label="Description" value={m.answer||"Photo memory"} onEdit={beginFieldEdit} />
        <DetailField label="Location" value={m.location||"None"} onEdit={beginFieldEdit} />
        <DetailField label="Notes" value={m.notes||"None"} onEdit={beginFieldEdit} />
        <View style={{backgroundColor:colors.accent,borderColor:colors.line,borderWidth:1,borderRadius:14,padding:12,flexDirection:"row",alignItems:"center",gap:10}}><View style={{flex:1,gap:4}}><Copy kind="small" style={{fontWeight:"700",color:colors.ink}}>REFERENCE · OPTIONAL</Copy><Copy style={{color:colors.ink}}>{m.source||"None"}</Copy></View>{m.lifecycle!=="recently_deleted"?<Button compact label={editingReference?"Close ▴":"Edit ✎"} onPress={()=>{setReferenceDraft(m.source);setEditingReference(!editingReference);}} />:null}</View>
        {editingReference&&!edit?<View style={s.panel}><Field disabled={e.busy} maxLength={200} label="Reference" value={referenceDraft} onChangeText={setReferenceDraft} /><Button primary compact label="Save reference" disabled={e.busy} onPress={()=>void e.run(async store=>{await store.updateMemory({...m,source:referenceDraft.trim()},e.snapshot!.revision);setEditingReference(false);})} /><Button compact label="Cancel" onPress={()=>setEditingReference(false)} /></View>:null}
        {m.verifiedAt?<DetailField label="Last verified" value={m.verifiedAt} />:null}
        {m.legacyContext?<DetailField label="Original category" value={m.legacyContext} />:null}
        {m.due?<><Copy>Reminder: {m.due}{m.lifecycle!=="active"?" (paused)":""}</Copy>{m.lifecycle==="active"?<><Field disabled={e.busy} maxLength={10} label="Next reminder (YYYY-MM-DD)" value={nextDue} onChangeText={setNextDue} /><Button label={nextDue?"Complete and reschedule reminder":"Complete reminder"} disabled={e.busy} onPress={()=>void e.run(async store=>{await store.completeReminder(m.id,e.snapshot!.revision,nextDue||undefined);setNextDue("");})} /></>:null}</>:null}
        <View style={{backgroundColor:colors.accent,borderColor:colors.line,borderWidth:1,borderRadius:14,padding:12,flexDirection:"row",alignItems:"center",gap:10}}><View style={{flex:1,gap:4}}><Copy kind="small" style={{fontWeight:"700",color:colors.ink}}>VERIFICATION STATUS</Copy><Copy style={{color:colors.ink}}>{m.confidence}</Copy></View>{m.lifecycle!=="recently_deleted"?<Button compact label={review?"Close ▴":"Choose ▾"} onPress={()=>{setSource(m.source);setReview(!review);}} />:null}</View>
        {review&&m.lifecycle!=="recently_deleted"?<View style={s.panel}><Copy>Confirm against a reference you checked. Opening a memory does not verify it.</Copy><Field disabled={e.busy} maxLength={200} label="Reference checked" value={source} onChangeText={setSource} />{confidences.map(confidence=><Button key={confidence} label={confidence==="Verified"?"Confirm Verified":`Set ${confidence}`} selected={m.confidence===confidence} disabled={e.busy} onPress={()=>void e.run(async store=>{await store.reviewMemory(m.id,{source,confidence},e.snapshot!.revision);setReview(false);})} />)}<Button compact label="Close ▴" onPress={()=>setReview(false)} /></View>:null}
        <View style={{backgroundColor:colors.accent,borderRadius:16,padding:12,gap:10}}><View style={{flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}><Copy accessibilityRole="header" style={{fontWeight:"700"}}>PHOTOS</Copy><Copy kind="small">{e.snapshot?.data.media.media.filter(p=>p.cardId===m.id).length??0} saved</Copy></View>
        <View style={{flexDirection:"row",flexWrap:"wrap",gap:10}}>{(e.snapshot?orderedMemoryPhotos(e.snapshot.data,m.id):[]).map((p,index)=><Pressable key={p.id} accessibilityRole="button" accessibilityLabel={`Open photo ${index+1} of ${m.title}`} onPress={()=>router.push({pathname:"/photo-viewer",params:{path:p.path,label:`Photo ${index+1} of ${m.title}`,memoryId:m.id,photoId:p.id}})} style={{width:"31%",aspectRatio:1,borderWidth:1,borderColor:colors.line,borderRadius:12,overflow:"hidden"}}><Image source={{uri:engPhotoUri(p.path)}} resizeMode="cover" style={{width:"100%",height:"100%"}} /></Pressable>)}</View>
        {m.lifecycle!=="recently_deleted"?<>
          <Button label="+ Add Photo" disabled={e.busy||(e.snapshot?.data.media.media.filter(p=>p.cardId===m.id).length??0)>=5} onPress={()=>Alert.alert("Add Photo","Choose a photo or image source.",[{text:"Take Photo",onPress:()=>void e.run(async store=>{const bytes=await chooseEngPhoto(true);if(bytes)await store.addMemoryPhoto(m.id,bytes);})},{text:"Choose from Library",onPress:()=>void e.run(async store=>{const bytes=await chooseEngPhoto(false);if(bytes)await store.addMemoryPhoto(m.id,bytes);})},{text:"Browse Files",onPress:()=>void e.run(async store=>{const bytes=await chooseEngPhoto("files");if(bytes)await store.addMemoryPhoto(m.id,bytes);})},{text:"Cancel",style:"cancel"}])} />
        </>:<>
          <Copy>Deleted {m.deletedAt}. Recoverable for at least 30 days. Photos stay with this memory.</Copy>
          <Button label="Restore memory" disabled={e.busy} onPress={()=>void e.run(store=>store.lifecycle(m.id,"active",day()))} />
          <Copy>Permanent cleanup is unavailable in this Development build. Deleted memories and photos remain recoverable.</Copy>
        </>}
        </View>
        {m.lifecycle==="recently_deleted"?<Button label={review?"Hide history":"Show history"} onPress={()=>setReview(!review)} />:null}
        {review?<><Copy>History</Copy>{[...m.history.map((h,index)=>({id:`old-${index}-${h.id}`,order:h.date,text:`${h.date}: ${h.action}`})),...(m.events??[]).map(event=>({id:event.id,order:event.at,text:`${new Date(event.at).toLocaleString()}: ${eventText(event)}`}))].sort((a,b)=>a.order.localeCompare(b.order)).map(row=><Copy key={row.id}>{row.text}</Copy>)}
        {m.lifecycle!=="recently_deleted"?<><Field disabled={e.busy} label="History note" value={history} onChangeText={setHistory} />
          <Button label="Record history" disabled={e.busy} onPress={()=>void e.run(async store=>{if(!history.trim())throw Error("Add a history note first");await store.recordHistory(m.id,history.trim(),e.snapshot!.revision);setHistory("");})} />
        </>:null}
        </>:null}

      </>}
    </>:<Copy>{e.snapshot?"This memory is no longer available.":"Reading memory…"}</Copy>}
    <Status text={e.status} />
  </Page>;
}
function LabelManager({e}:{e:ReturnType<typeof useEng>}){
 const {s}=useTheme();const [kind,setKind]=useState<"space"|"category">("space"),[selected,setSelected]=useState(""),[name,setName]=useState("");
 const [impact,setImpact]=useState<Awaited<ReturnType<EngStore["taxonomyImpact"]>>|null>(null);
 const labels=kind==="space"?e.snapshot?.data.spaces:e.snapshot?.data.categories;
 return <View style={s.panel}><Copy accessibilityRole="header">Manage Spaces and Categories</Copy><View style={s.row}>{(["space","category"] as const).map(k=><Button key={k} label={k==="space"?"Spaces":"Categories"} disabled={e.busy} selected={kind===k} onPress={()=>{setKind(k);setSelected("");setImpact(null);setName("");}} />)}</View>
 {labels?.map(x=><Button key={x.id} label={x.name} disabled={e.busy} selected={selected===x.id} onPress={()=>{setSelected(x.id);setName(x.name);setImpact(null);}} />)}
 <Field disabled={e.busy} label="Label name" value={name} onChangeText={setName} />
 <Button label="Create new label" disabled={e.busy} onPress={()=>void e.run(store=>store.taxonomy(kind,name))} />
 {selected?<><Button label="Rename selected label" disabled={e.busy} onPress={()=>void e.run(async store=>{await store.renameTaxonomy(kind,selected,name,e.snapshot!.revision);setImpact(null);})} />
 <Button label="Review label removal" disabled={e.busy} onPress={()=>void e.run(async store=>{setImpact(await store.taxonomyImpact(kind,selected));},"")} />
 {impact?<><Copy>Remove “{impact.name}” from {impact.memories} saved memories and {impact.draft?"the unfinished draft":"no draft"}? Memories and photos are kept. Removed Spaces become Unassigned.</Copy><Button label="Confirm remove label only" disabled={e.busy} onPress={()=>void e.run(async store=>{await store.removeTaxonomy(impact.kind,impact.id,impact.revision);setSelected("");setImpact(null);setName("");})} /><Button label="Cancel label removal" onPress={()=>setImpact(null)} /></>:null}</>:null}</View>;
}
export function EngMore({initialAction}:{initialAction?:string}={}){
  const e=useEng(),preferences=useData();const [reminderRestoreToken,setReminderRestoreToken]=useState<string|null>(null),[incoming,setIncoming]=useState<EngBackup|null>(null),[conflict,setConflict]=useState<"keep"|"incoming"|null>(null),[confirmRecovery,setConfirmRecovery]=useState(false);const [restoreToken,setRestoreToken]=useState<string|null>(null);const [textReview,setTextReview]=useState<{snapshot:EngSnapshot;token:string}|null>(null);const [section,setSection]=useState<"storage"|"labels"|"backup"|"preferences"|"help"|"privacy"|"recovery"|null>(()=>({storage:"storage",backup:"backup",appearance:"preferences",accessibility:"preferences",help:"help",privacy:"privacy",recovery:"recovery",labels:"labels"} as Record<string,"storage"|"labels"|"backup"|"preferences"|"help"|"privacy"|"recovery">)[initialAction??""]??null);
  useEffect(()=>{if(!section)return;const h=BackHandler.addEventListener("hardwareBackPress",()=>{setSection(null);return true;});return()=>h.remove();},[section]);
  return <Page key={section??"menu"} independent hideHeading title="More">
     {!section?<>
    <Copy>Memories stay on this device. A local save is not a separate backup.</Copy>
    <Copy accessibilityRole="header">Memory management</Copy><Button label="Storage & Cleanup" onPress={()=>setSection("storage")} />
    <Button label="Archived memories" onPress={()=>{router.push({pathname:"/answers",params:{lifecycle:"archived"}});}} />
    <Button label="Recently Deleted memories" onPress={()=>{router.push({pathname:"/answers",params:{lifecycle:"recently_deleted"}});}} />
    <Button label="Manage Spaces & Categories" onPress={()=>setSection("labels")} />
    <Copy accessibilityRole="header">Data protection</Copy><Button label="Backup & Restore" onPress={()=>setSection("backup")} />
    <Copy accessibilityRole="header">Preferences & help</Copy><Button label="Appearance & Accessibility" onPress={()=>setSection("preferences")} /><Button label="Help & About" onPress={()=>setSection("help")} />
    </>:null}{section?<Button label="Back to More" onPress={()=>setSection(null)} />:null}
    {section==="storage"?<><Copy accessibilityRole="header">Storage & Cleanup</Copy>    <Button label="Measure device storage" disabled={e.busy} onPress={()=>void e.run(async()=>{
      const storage=await getEngStorage();
      const free=Number.isFinite(storage.free)?`${storage.free} bytes`:"Unavailable";
      e.setStatus(`App-available device storage: ${free}. Verified protected photo content: ${storage.protectedBytes} bytes. Referenced photo content: ${storage.referencedBytes} bytes. Unreadable files: ${storage.unreadable}. Photos kept for: ${Object.entries(storage.ownerCounts).map(([owner,count])=>({active:"Active",archived:"Archived",recently_deleted:"Recently Deleted",draft:"Draft",recovery:"Previous save","legacy-v1":"Earlier collection","legacy-recovery":"Earlier previous save",journal:"Retained photo operations"} as Record<string,string>)[owner]+" "+count).join(", ")}. Groups can overlap. Photo content sizes exclude database, cache, filesystem allocation and unindexed files. Archive and Recently Deleted reclaim no bytes. Automatic cleanup and permanent purge remain disabled. Space is checked before saving or restoring. Automatic low-space alerts are not enabled.`);
    },"")} />
    <Button label="Check photo integrity and protected owners" disabled={e.busy} onPress={()=>void e.run(async store=>{const result=await store.audit();const bad=result.filter(x=>x.verdict!=="verified");e.setStatus(`${result.length} protected photo references checked. ${bad.length} need attention.`+(bad.length?" "+bad.map(x=>x.owner+": "+x.verdict).join("; "):" No files removed."));},"")} />
<Copy>Largest saved photos (recorded size; retained photos may overlap recovery references). Archive and Recently Deleted do not reclaim bytes.</Copy>
    {e.snapshot?.data.media.media.slice().sort((a,b)=>b.bytes-a.bytes).slice(0,10).map(p=>{const m=e.snapshot!.data.memories.find(m=>m.id===p.cardId)!;return <View key={p.id}><Copy>Photo {m.mediaIds.indexOf(p.id)+1} · {p.bytes} bytes · {m.lifecycle==="recently_deleted"?"Recently Deleted":m.lifecycle==="archived"?"Archived":"Active"}</Copy><MemoryLink memory={m} /></View>;})}
    <Copy>Exact photo matches are advisory. No files are removed automatically.</Copy>{e.snapshot?.data.media.media.filter((p,i,all)=>all.some((other,j)=>j!==i&&other.sha256===p.sha256)).map(p=><MemoryLink key={p.id} memory={e.snapshot!.data.memories.find(m=>m.id===p.cardId)!} />)}
    {e.snapshot?.draft?<Button label="Review unfinished draft and its photos" onPress={()=>router.push("/add")} />:null}<Copy>Permanent cleanup is unavailable in this Development build. Memories and photos remain recoverable.</Copy></>:null}
    {section==="recovery"?<><Copy accessibilityRole="header">Recently deleted</Copy><Copy>Recently deleted memories remain recoverable. Open Find to review them.</Copy><Button label="View archived memories" onPress={()=>router.push({pathname:"/answers",params:{lifecycle:"archived"}})} /><Button label="View recently deleted memories" onPress={()=>{router.push({pathname:"/answers",params:{lifecycle:"recently_deleted"}});}} /></>:null}
    {section==="privacy"?<><Copy accessibilityRole="header">Privacy & security</Copy><Copy>Memories are stored on this device. Backups and sharing are user-initiated. A local save is not a second backup. Review Data protection before exporting private information.</Copy><Button label="Open backup protection" onPress={()=>setSection("backup")} /></>:null}
    {section==="labels"?<LabelManager e={e} />:null}
    {section==="backup"?<>
    <View style={{flexDirection:"row",alignItems:"center",gap:16}}><BrandArt name="backup" size={80} /><Copy accessibilityRole="header" kind="section" style={{flex:1}}>Back up your memories</Copy></View><Copy>Full v4 backups include standalone reminders. Before restoring, keep a second verified backup. Full v4 restore replaces current standalone reminders after explicit review and confirmation. Text backups still exclude standalone reminders. Full backups include active, archived and recently deleted memories, photos, categories, Spaces, and your unfinished draft. Full backups support all currently permitted collection and draft photos, up to 154 MB.</Copy>
    <Button primary label="Save full backup (with draft and photos)" disabled={e.busy} onPress={()=>void e.run(async store=>{const b=await store.backup();e.setStatus(await writeEngBackup(b));},"")} />
    <Button label="Review limited text backup (photos excluded)" disabled={e.busy} onPress={()=>void e.run(async store=>{const b=await store.backup();setTextReview({snapshot:b.snapshot,token:await store.restoreToken()});},"")} />
    {textReview?<View><Copy>PHOTOS EXCLUDED. Includes {textBackupPreview(textReview.snapshot).included} written-answer memories with lifecycle, labels, notes, source, history and reminders. Omits {textBackupPreview(textReview.snapshot).omitted.length} photo-only saved memories and all {textBackupPreview(textReview.snapshot).savedPhotos} saved / {textBackupPreview(textReview.snapshot).draftPhotos} draft photos. Draft text is retained; it may need a new photo before saving. Use a full backup for complete recovery.</Copy>{textBackupPreview(textReview.snapshot).omitted.map(m=><Copy key={m.id}>Excluded: {m.title} ({m.lifecycle})</Copy>)}<Button primary label="Confirm save limited text backup" disabled={e.busy} onPress={()=>void e.run(async store=>{if(await store.restoreToken()!==textReview.token)throw Error("Collection changed. Review the text backup again.");e.setStatus(await writeEngText(createTextBackup(textReview.snapshot),true));setTextReview(null);},"")} /><Button label="Cancel text backup" onPress={()=>setTextReview(null)} /></View>:null}
    <Copy>Text export is a readable report of all states and draft text. It includes private written metadata and history, excludes photo bytes, and cannot restore a collection. Use a full backup for recovery.</Copy>
    <Button label="Save text report (no photos; not a backup)" disabled={e.busy} onPress={()=>void e.run(async store=>{const b=await store.backup();const text=JSON.stringify({format:"CasitaDex readable text report — not restorable",exportedAt:new Date().toISOString(),memories:b.snapshot.data.memories,spaces:b.snapshot.data.spaces,categories:b.snapshot.data.categories,draft:b.snapshot.draft?{...b.snapshot.draft,photos:b.snapshot.draft.photos.map(p=>({id:p.id,note:"Photo bytes excluded"}))}:null},null,2);e.setStatus(await writeEngText(text));},"")} />
    <Button label="Choose backup to review" disabled={e.busy} onPress={()=>void e.run(async store=>{const backup=await pickEngBackup();setIncoming(backup);setRestoreToken(backup?await store.restoreToken():null);setReminderRestoreToken(backup?.reminders?await store.reminderRestoreToken():null);setConflict(null);e.setStatus(backup?"Backup checked. Review before replacing your collection.":"Backup selection canceled. Current data kept.");},"")} />
    {incoming?<>
      <Copy>{incoming.source}</Copy>{incoming.reminders?<Copy>Standalone reminders in backup: {incoming.reminders.rows.length}. Confirming replaces all current standalone reminders.</Copy>:<Copy>Legacy archive: current standalone reminders will be kept.</Copy>}<Copy>{incoming.snapshot.data.memories.length} memories, {incoming.snapshot.data.media.media.length} saved photos, {incoming.snapshot.draft?"1 unfinished draft":"no unfinished draft"}, {incoming.snapshot.draft?.photos.length??0} draft photos.</Copy>
      <Copy>Active: {incoming.snapshot.data.memories.filter(m=>m.lifecycle==="active").length}; Archived: {incoming.snapshot.data.memories.filter(m=>m.lifecycle==="archived").length}; Recently Deleted: {incoming.snapshot.data.memories.filter(m=>m.lifecycle==="recently_deleted").length}.</Copy>
      <Copy>Replacing the collection keeps the current full state as a recoverable previous save.</Copy>
      {e.snapshot?.draft?<>
        <Copy>You already have an unfinished draft. Choose which one to use.</Copy>
        <Button label="Keep current draft" disabled={e.busy} selected={conflict==="keep"} onPress={()=>setConflict("keep")} />
        <Button label="Use backed-up draft (previous state recoverable)" disabled={e.busy} selected={conflict==="incoming"} onPress={()=>setConflict("incoming")} />
      </>:null}
      <Button primary label="Confirm replace with reviewed backup" disabled={e.busy||!!(e.snapshot?.draft&&!conflict)} onPress={()=>void e.run(async store=>{if(!restoreToken)throw Error("Review this backup again");await store.stageRestore(incoming.snapshot,incoming.read,restoreToken);if(incoming.reminders)await store.restoreV4(incoming.snapshot,incoming.reminders,conflict??"incoming",restoreToken,reminderRestoreToken??undefined);else await store.restore(incoming.snapshot,conflict??"incoming",restoreToken);setIncoming(null);},"Full collection restored and verified.")} />
      <Button label="Cancel restore" disabled={e.busy} onPress={()=>{setIncoming(null);e.setStatus("Restore canceled. Your collection and draft are kept.");}} />
    </>:null}
    <Button label="Recover previous full save" disabled={e.busy} onPress={()=>setConfirmRecovery(true)} />
    {confirmRecovery?<><Copy>Recover the previous Full v4 collection, draft, photos and standalone reminders? Your current state becomes the recoverable previous save.</Copy>
      <Button label="Confirm full recovery" disabled={e.busy} onPress={()=>void e.run(async store=>{if(await store.hasV4Recovery())await store.recoverV4();else await store.recover();setConfirmRecovery(false);},"Previous full save recovered and verified.")} />
      <Button label="Cancel recovery" onPress={()=>setConfirmRecovery(false)} />
    </>:null}
    </>:null}
    {section==="help"?<><BrandLogo width={180} /><Copy accessibilityRole="header">Help & About</Copy><Copy>CasitaDex Development 0.1.0. Memories and photos stay on this device unless you export or share them. Keep a verified full backup in a second location. Text backups from earlier versions can be reviewed with Choose backup. They cannot contain photos or an unfinished draft.</Copy><Copy>Verification records what you checked against a source. It is not a guarantee of correctness. Editing a description or its source requires checking again. Archive pauses reminders; Recently Deleted keeps recovery available. Cleanup does not run automatically in this build.</Copy>
    </>:null}{section==="preferences"?<><Copy accessibilityRole="header">Appearance & Accessibility</Copy><Button label="Large text" selected={preferences.large} onPress={()=>preferences.setLarge(!preferences.large)} />
    {(["System","Light","Dark"] as const).map(value=><Button key={value} label={value+" appearance"} selected={preferences.appearance===value} onPress={()=>preferences.setAppearance(value)} />)}
    <Copy kind="small">Readable text: CasitaDex supports its Large text option and your device text-size setting. Content reflows and remains scrollable at larger sizes.</Copy>
    <Copy kind="small">Screen reader: use iPhone VoiceOver or Android TalkBack in your device Accessibility settings. Buttons and form controls must remain labeled and operable.</Copy>
    <Copy kind="small">Contrast and motion: CasitaDex follows your device accessibility preferences where supported. Separate contrast and reduced-motion switches are not available in this build.</Copy>
    <Copy>{preferences.preferenceError}</Copy></>:null}<Status text={e.status} />
    {!e.snapshot?<Button label="Reload full collection" disabled={e.busy} onPress={()=>void e.refresh()} />:null}
  </Page>;
}

export function EngShareMemory(){
 const e=useEng(),{s,colors}=useTheme(),{id}=useLocalSearchParams<{id:string}>();
 const [fields,setFields]=useState<ShareField[]>([]),[photoIds,setPhotoIds]=useState<string[]>([]),[previewOpen,setPreviewOpen]=useState(false);
 const m=e.snapshot?.data.memories.find(x=>x.id===id);
 const photos=e.snapshot?.data.media.media.filter(p=>p.cardId===id)??[];
 const choices:[ShareField,string][]=[["location","Location"],["notes","Notes"],["source","Reference / source"],["space","Space"],["categories","Categories"],["verification","Verification"],["reminder","Reminder"]];
 const preview=m&&e.snapshot?sharePreview(m,e.snapshot.data,{fields,photoIds}):null;
 const share=()=>{if(!preview)return;void e.run(async()=>{if(photoIds.length){e.setStatus(await shareEngPhotos(preview));}else{const result=await Share.share({message:preview.text});e.setStatus(result.action===Share.dismissedAction?"Sharing canceled.":"Share sheet opened. Delivery is handled by the selected app.");}},"");};
 return <Page independent hideHeading title="Share memory" stickyActions={<View style={{maxWidth:720,width:"100%",alignSelf:"center",gap:8}}><View style={{flexDirection:"row",gap:10}}><View style={{flex:1}}><Button compact label="‹ Memory details" onPress={()=>router.back()} /></View><View style={{flex:1}}><Button compact primary label="Share selected details" disabled={!preview||e.busy} onPress={share} /></View></View><Copy accessibilityRole="header" style={{textAlign:"center",fontWeight:"700",color:colors.ink}}>Share memory</Copy></View>}>
  {m?<><View style={s.panel}><Copy kind="small">SHARING</Copy><Copy accessibilityRole="header">{m.title}</Copy><Copy>Name and description are included by default. Select optional details below.</Copy></View>
  <View style={s.panel}><Copy accessibilityRole="header">Include additional details</Copy>{choices.map(([field,label])=><Pressable key={field} accessibilityRole="checkbox" accessibilityState={{checked:fields.includes(field)}} onPress={()=>setFields(old=>old.includes(field)?old.filter(x=>x!==field):[...old,field])} style={{flexDirection:"row",justifyContent:"space-between",alignItems:"center",minHeight:48,borderBottomWidth:1,borderColor:colors.line,paddingVertical:8}}><Copy>{label}</Copy><Copy style={{fontWeight:"700"}}>{fields.includes(field)?"☑":"☐"}</Copy></Pressable>)}</View>
  {photos.length?<View style={s.panel}><Copy accessibilityRole="header">Photos · {photoIds.length} of {photos.length} selected</Copy><View style={{flexDirection:"row",flexWrap:"wrap",gap:10}}>{photos.map((p,i)=><Pressable key={p.id} accessibilityRole="checkbox" accessibilityLabel={`Include photo ${i+1}`} accessibilityState={{checked:photoIds.includes(p.id)}} onPress={()=>setPhotoIds(old=>old.includes(p.id)?old.filter(x=>x!==p.id):[...old,p.id])} style={{width:"30%",gap:4}}><Image source={{uri:engPhotoUri(p.path)}} style={{width:"100%",aspectRatio:1,borderRadius:10,borderWidth:photoIds.includes(p.id)?3:1,borderColor:photoIds.includes(p.id)?colors.ink:colors.line}} /><Copy kind="small">{photoIds.includes(p.id)?"☑":"☐"} Photo {i+1}</Copy></Pressable>)}</View>{photoIds.length?<Copy kind="small">Original photos may contain embedded metadata, including location. Only selected photos are included.</Copy>:null}</View>:null}
  <View style={s.panel}><Button compact label={previewOpen?"Hide sharing preview ▴":"Review what will be shared ▾"} onPress={()=>setPreviewOpen(!previewOpen)} />{previewOpen?<View style={{gap:12}}><View style={{borderBottomWidth:1,borderColor:colors.line,paddingBottom:10,gap:5}}><Copy kind="small">MEMORY NAME</Copy><Copy accessibilityRole="header" style={{fontWeight:"700"}}>{m.title}</Copy></View><View style={{borderBottomWidth:1,borderColor:colors.line,paddingBottom:10,gap:5}}><Copy kind="small">DESCRIPTION</Copy><Copy selectable>{m.answer||"Photo memory"}</Copy></View>{fields.map(field=>{const line=preview?.text.split("\n").slice(2).find(line=>line.toLowerCase().startsWith((field==="verification"?"user verification":field==="source"?"source":field)+":"));return line?<View key={field} style={{borderWidth:1,borderColor:colors.line,borderRadius:12,padding:12,gap:6}}><Copy kind="small" style={{fontWeight:"700"}}>{field==="source"?"SOURCE":field==="verification"?"VERIFICATION":field.toUpperCase()}</Copy><Copy selectable>{line.slice(line.indexOf(":")+1).trim()}</Copy></View>:null;})}{photoIds.length?<View style={{gap:8}}><Copy accessibilityRole="header">SELECTED PHOTOS · {photoIds.length}</Copy><View style={{flexDirection:"row",flexWrap:"wrap",gap:8}}>{photos.filter(p=>photoIds.includes(p.id)).map(p=><Image key={p.id} source={{uri:engPhotoUri(p.path)}} resizeMode="cover" style={{width:"30%",aspectRatio:1,borderRadius:10}} />)}</View></View>:null}</View>:<Copy kind="small">{fields.length} optional details and {photoIds.length} photos selected.</Copy>}</View>
  <Button label="Cancel sharing" onPress={()=>router.back()} /><Status text={e.status}/></>:<Copy>{e.snapshot?"Memory unavailable.":"Loading memory…"}</Copy>}
 </Page>;
}
