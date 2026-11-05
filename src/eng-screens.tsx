import { enableReminderAlerts, getReminderPermission, type ReminderPermission } from "./reminder-alerts";
import type { RepeatSchedule } from "./reminder-recurrence";
import { reminderNotificationTarget } from "./reminder-notification-target";
import { listLinkedReminderMemories } from "./reminder-notification-projection";
import DateTimePicker, { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import React, { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { Platform, Alert, AppState, BackHandler, Image, Linking, Modal, Pressable, ScrollView, Share, View, useWindowDimensions } from "react-native";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { Button, Copy, Field, Page, useTheme } from "./ui";
import { useData } from "./state";
import { getEngStore, getEngStorage, chooseEngPhoto, engPhotoUri, writeEngBackup, pickEngBackup, shareEngPhotos, writeEngText, type EngStore, type EngBackup } from "./eng-runtime";
import { newEngDraft } from "./eng-store";
import { listStandaloneReminders,saveStandaloneReminder,completeStandaloneReminder,deleteStandaloneReminder,type StandaloneReminder } from "./standalone-reminders";
import type { EngDraft, EngSnapshot } from "./eng-types";
import type { MemoryV2 } from "./sb20-contract";
import { localDay, eventText, orderedMemoryPhotos, sharePreview, type ShareField } from "./eng-domain";
import { defaultFilter, findMemories, searchIndex, type FindFilter } from "./eng-find";
import { textBackupPreview, createTextBackup } from "./eng-text-backup";
import { duplicateCandidates } from "./eng-duplicates";
import { registerEditGuard } from "./eng-navigation";
import { defaultReminderDay, isReminderDraftDirty, newReminderDraft, type ReminderDraft } from "./standalone-reminder-draft";
import { clampPhotoIndex, clampPhotoZoom, photoSwipeStep, touchDistance } from "./photo-viewer-state";
import { BrandHeader, BrandLogo, BrandArt } from "./brand";
import { HomeAction } from "./home-action";
import { EditorialIntro } from "./editorial-intro";
import { confidences } from "./model";
const day=localDay;
function message(e:unknown){const text=e instanceof Error?e.message:"Operation failed. Your last confirmed save is kept.";return text.startsWith("SB20 compatibility:")?"Check the name, answer or photo, source and dates before saving. Your last confirmed save is kept.":text;}
function useEng(){
  const [snapshot,setSnapshot]=useState<EngSnapshot|null>(null),[status,setStatus]=useState(""),[busy,setBusy]=useState(false);
  const lock=useRef(false),alive=useRef(true);
  useEffect(()=>()=>{alive.current=false;},[]);
  const refresh=useCallback(async():Promise<boolean>=>{
    try{const next=await(await getEngStore()).load();if(alive.current)setSnapshot(next);return true;}
    catch(e){if(alive.current)setStatus(message(e));return false;}
  },[]);
  useFocusEffect(useCallback(()=>{alive.current=true;void refresh();},[refresh]));
  async function run(task:(store:EngStore)=>Promise<unknown>,success="Saved on this device."){
    if(lock.current)return false;lock.current=true;setBusy(true);
    try{
      await task(await getEngStore());
      const refreshed=await refresh();
      if(alive.current){
        if(!refreshed)setStatus("Change saved on this device, but the list could not refresh. Reopen this page to confirm the latest data.");
        else if(success)setStatus(success);
      }
      return refreshed;
    }
    catch(e){if(alive.current)setStatus(message(e));return false;}
    finally{lock.current=false;if(alive.current)setBusy(false);}
  }
  return {snapshot,setSnapshot,status,setStatus,busy,run,refresh};
}
function Status({text}:{text:string}){return text ? <Copy kind="small" accessibilityLiveRegion="polite">{text}</Copy> : null;}
function MemoryLink({memory,data}:{memory:MemoryV2;data?:EngSnapshot["data"]}){
  const {s}=useTheme();
  const firstPhoto=!memory.answer?orderedMemoryPhotos(memory,data?.media.media)[0]:undefined;
  return <Pressable accessibilityRole="button" accessibilityLabel={`Open ${memory.title}: ${memory.answer||"Photo memory"}`}
    onPress={()=>router.push({pathname:"/card",params:{id:memory.id}})} style={s.panel}>
    {data?<><Copy kind="answer">{memory.answer||"Photo memory"}</Copy><Copy style={{fontWeight:"700"}}>{memory.title}</Copy>{firstPhoto?<Image source={{uri:engPhotoUri(firstPhoto.path)}} accessibilityLabel={`Photo for ${memory.title}`} resizeMode="contain" style={{width:"100%",height:160}} />:null}<Copy kind="small">{data.spaces.find(x=>x.id===memory.spaceId)?.name??"Unassigned"}{memory.categoryIds.length?" · "+memory.categoryIds.map(id=>data.categories.find(x=>x.id===id)?.name).join(", "):""} · {memory.confidence}</Copy></>:<><Copy style={{fontWeight:"700"}}>{memory.title}</Copy><Copy>{memory.answer||"Photo memory"}</Copy></>}

  </Pressable>;
}
type ViewerPhoto={path:string;label:string};
function PhotoViewer({path,label,photos,onClose}:{path:string;label:string;photos?:ViewerPhoto[];onClose:()=>void}){
  const {width,height}=useWindowDimensions(),{colors}=useTheme();
  const items=useMemo(()=>photos?.length?photos:[{path,label}],[photos,path,label]);
  const [index,setIndex]=useState(()=>Math.max(0,items.findIndex(p=>p.path===path))),[zoom,setZoom]=useState(1);
  const zoomRef=useRef(1),pinch=useRef<{distance:number;zoom:number}|null>(null),usedPinch=useRef(false);
  const vertical=useRef<ScrollView>(null),horizontal=useRef<ScrollView>(null);
  const selected=items[clampPhotoIndex(index,items.length)];
  const changeZoom=useCallback((value:number)=>{zoomRef.current=clampPhotoZoom(value);setZoom(zoomRef.current);},[]);
  const move=useCallback((step:number)=>{
    setIndex(value=>clampPhotoIndex(value+step,items.length));zoomRef.current=1;setZoom(1);
    vertical.current?.scrollTo({y:0,animated:false});horizontal.current?.scrollTo({x:0,animated:false});
  },[items.length]);
  const origin=useRef<{x:number;y:number}|null>(null);
  const gestures={
    onTouchStart:(event:import("react-native").GestureResponderEvent)=>{
      const touches=event.nativeEvent.touches;
      if(touches.length===1){origin.current={x:touches[0].pageX,y:touches[0].pageY};usedPinch.current=false;}
      if(touches.length>=2){
        const distance=touchDistance(touches);usedPinch.current=true;
        if(distance&&!pinch.current)pinch.current={distance,zoom:zoomRef.current};
      }
    },
    onStartShouldSetResponderCapture:(event:import("react-native").GestureResponderEvent)=>event.nativeEvent.touches.length>=2,
    onMoveShouldSetResponderCapture:(event:import("react-native").GestureResponderEvent)=>{
      const touches=event.nativeEvent.touches;if(touches.length>=2)return true;
      const start=origin.current,point=touches[0];if(!start||!point||zoomRef.current!==1)return false;
      const dx=point.pageX-start.x,dy=point.pageY-start.y;
      return Math.abs(dx)>16&&Math.abs(dx)>Math.abs(dy)*1.5;
    },
    onResponderMove:(event:import("react-native").GestureResponderEvent)=>{
      const distance=touchDistance(event.nativeEvent.touches);if(!distance)return;
      usedPinch.current=true;
      if(!pinch.current)pinch.current={distance,zoom:zoomRef.current};
      changeZoom(pinch.current.zoom*distance/pinch.current.distance);
    },
    onResponderRelease:(event:import("react-native").GestureResponderEvent)=>{
      const start=origin.current,point=event.nativeEvent.changedTouches[0];
      const step=usedPinch.current||!start||!point?0:photoSwipeStep(point.pageX-start.x,point.pageY-start.y,zoomRef.current);
      if(step)move(step);pinch.current=null;origin.current=null;
    },
    onResponderTerminate:()=>{pinch.current=null;origin.current=null;},
  };
  return <Modal visible onRequestClose={onClose} animationType="slide" accessibilityViewIsModal>
    <ScrollView style={{flex:1,backgroundColor:colors.paper}} contentContainerStyle={{flexGrow:1,padding:20,paddingTop:48,gap:12}}>
      <Copy accessibilityRole="header">{selected.label}</Copy>
      <Button label="Close photo" onPress={onClose} />
      <View style={{flexDirection:"row",flexWrap:"wrap",gap:10}}>
        <Button label="Previous photo" disabled={index<=0} onPress={()=>move(-1)} />
        <Button label="Next photo" disabled={index>=items.length-1} onPress={()=>move(1)} />
        <Copy accessibilityLiveRegion="polite">Photo {index+1} of {items.length}</Copy>
        <Button label="Zoom in" disabled={zoom>=4} onPress={()=>changeZoom(zoom+1)} />
        <Button label="Zoom out" disabled={zoom<=1} onPress={()=>changeZoom(zoom-1)} />
        <Copy accessibilityLiveRegion="polite">Zoom {Math.round(zoom*10)/10} times</Copy>
      </View>
      <View style={{height:Math.max(height-360,160)}} {...gestures}>
        <ScrollView ref={vertical} style={{flex:1}}><ScrollView ref={horizontal} horizontal>
          <Image source={{uri:engPhotoUri(selected.path)}} resizeMode="contain" accessibilityLabel={selected.label}
            style={{width:Math.max(width-40,200)*zoom,height:Math.max(height-360,160)*zoom}} />
        </ScrollView></ScrollView>
      </View>
    </ScrollView>
  </Modal>;
}
let findCache={query:"",filter:defaultFilter(),page:0,y:0,expanded:false};
export function EngHome(){
 const e=useEng(),{s}=useTheme(),[confirmDelete,setConfirmDelete]=useState(false);
 const draft=e.snapshot?.draft;

 function commands(items:{label:string;action:()=>void;disabled?:boolean}[]){return <View style={{flexDirection:"row",gap:10}}>{items.map(item=><View key={item.label} style={{flex:1}}><Button label={item.label} disabled={item.disabled||e.busy} onPress={item.action} /></View>)}</View>;}
 return <Page independent title="" hideHeading>
 <BrandHeader />
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
 <HomeAction title="Add Reminder" detail="Remember the next step" icon="Reminders" onPress={()=>router.push("/reminders?mode=new")} />
 </View>
 <Status text={e.status} />
 </Page>;
}
export function EngPhotos(){
 const e=useEng(),{s}=useTheme(),[selected,setSelected]=useState<string|null>(null),[preview,setPreview]=useState<{path:string;label:string}|null>(null);
 const memories=e.snapshot?.data.memories.filter(m=>m.mediaIds.length>0&&m.lifecycle!=="recently_deleted")??[];
 const m=memories.find(x=>x.id===selected);
 const manifest=e.snapshot?.data.media.media, photos=orderedMemoryPhotos(m,manifest);
 return <Page independent title="Photos" hideHeading>
 <BrandHeader /><EditorialIntro eyebrow="Visual memories" title="Photos with a purpose." description="Every photo stays linked to its memory." />
 <Copy>Select a saved memory to review, add, replace, or remove its photos. Existing photos are preserved until you confirm a change.</Copy>
 {preview?<PhotoViewer path={preview.path} label={preview.label} photos={photos.map((p,i)=>({path:p.path,label:"Photo "+(i+1)+" of "+m?.title}))} onClose={()=>setPreview(null)} />:null}
 {!m?<>{memories.length===0?<Copy>No saved memories with photos yet.</Copy>:<View style={{ flexDirection:"row",flexWrap:"wrap",gap:12,justifyContent:"space-between" }}>{memories.map(x=>{
 const first=orderedMemoryPhotos(x,manifest)[0];
 return <Pressable key={x.id} accessibilityRole="button" accessibilityLabel={`Open ${x.title} photo memory`}
 onPress={()=>setSelected(x.id)} style={{width:"47%",minWidth:135,flexGrow:1,backgroundColor:s.panel.backgroundColor,borderWidth:1,borderColor:"#B9C4B9",borderRadius:17,padding:9,gap:9,minHeight:180}}>
  {first?<Image source={{uri:engPhotoUri(first.path)}} resizeMode="cover" accessibilityLabel={`Photo for ${x.title}`} style={{width:"100%",height:130,borderRadius:12,backgroundColor:"#E4EBE4"}}/>:<View style={{width:"100%",height:130,borderRadius:12,backgroundColor:"#E4EBE4",alignItems:"center",justifyContent:"center"}}><Copy>Photo</Copy></View>}
  <Copy style={{fontWeight:"700",fontSize:15}}>{x.title}</Copy><Copy kind="small">{x.mediaIds.length} {x.mediaIds.length===1?"photo":"photos"}</Copy>
 </Pressable>;
 })}</View>}</>:<>
 <Button label="Back to photo memories" onPress={()=>setSelected(null)} />
 <Copy kind="section">{m.title}</Copy>
 {photos.map((p,i)=><View key={p.id} style={s.panel}>
 <Image source={{uri:engPhotoUri(p.path)}} resizeMode="contain" accessibilityLabel={"Saved photo "+(i+1)} style={{width:"100%",height:220}} />
 <Button label={"View photo "+(i+1)} onPress={()=>setPreview({path:p.path,label:"Photo "+(i+1)+" of "+m.title})} />
 <Button label={"Replace photo "+(i+1)} disabled={e.busy} onPress={()=>void e.run(async store=>{
   const bytes=await chooseEngPhoto(false);
   if(!bytes){e.setStatus("Replacement canceled. Original photo kept.");return;}
   await store.replaceMemoryPhoto(m.id,p.id,bytes);
   e.setStatus("Photo replacement saved. Previous snapshot retained.");
 },"")} />
 <Button label={"Remove photo "+(i+1)} disabled={e.busy} onPress={()=>Alert.alert("Remove saved photo?","Remove this photo from the memory? Previous full save remains recoverable.",[{text:"Cancel",style:"cancel"},{text:"Remove photo",style:"destructive",onPress:()=>void e.run(store=>store.removeMemoryPhoto(m.id,p.id))}])} />
 </View>)}
 <Button label="Add Photo" disabled={e.busy||m.mediaIds.length>=5} onPress={()=>void e.run(async store=>{
   const bytes=await chooseEngPhoto(false);
   if(!bytes){e.setStatus("Photo selection canceled. Your memory is kept.");return;}
   await store.addMemoryPhoto(m.id,bytes);
   e.setStatus("Photo added to saved memory.");
 },"")} />
 </>}
 <Status text={e.status} />
 </Page>;
}
export function EngReminders(){
 const {s}=useTheme(),params=useLocalSearchParams<{mode?:string;reminder?:string|string[]}>();
 const notificationTarget=reminderNotificationTarget(params.reminder);
 const memories = useEng();
 const linkedReminders = listLinkedReminderMemories(memories.snapshot?.data.memories ?? []);
 const today = day();
 const upcoming = linkedReminders.filter(memory => memory.due >= today);
 const overdue = linkedReminders.filter(memory => memory.due < today);

 function linkedSection(title: string, rows: typeof linkedReminders) {
  if (!rows.length) return null;
  return <View style={s.panel}>
   <Copy kind="section" accessibilityRole="header">{title}</Copy>
   {rows.map(memory => <Button key={memory.id} label={`${memory.title} · ${memory.due}`}
    onPress={() => router.push({ pathname: "/card", params: { id: memory.id } })} />)}
  </View>;
 }
 const [items,setItems]=useState<StandaloneReminder[]>([]),[expandedReminder,setExpandedReminder]=useState<string|null>(null),[editing,setEditing]=useState<string|null>(params.mode==="new"?"new":null);
 const [title,setTitle]=useState(""),[notes,setNotes]=useState(""),[dueDate,setDueDate]=useState(()=>defaultReminderDay()),[dueTime,setDueTime]=useState("09:00"),[repeat,setRepeat]=useState<RepeatSchedule>("once"),[iosPicker,setIosPicker]=useState<"date"|"time"|null>(null),[status,setStatus]=useState(""),[busy,setBusy]=useState(false);
 const [baseline,setBaseline]=useState<ReminderDraft>(()=>newReminderDraft(dueDate));
 const operation=useRef(false);
 const [itemsLoaded,setItemsLoaded]=useState(false);
 const refresh=useCallback(async()=>{try{setItems(await listStandaloneReminders());setItemsLoaded(true);}catch(e){setStatus(message(e));}},[]);
 const selectedNotification=notificationTarget ? items.find(item=>item.id===notificationTarget) : undefined;
 const visibleItems=selectedNotification ? [selectedNotification] : items;
 const [permission,setPermission]=useState<ReminderPermission>("unavailable");
 const refreshPermission=useCallback(async()=>{
  try { setPermission(await getReminderPermission()); }
  catch { setPermission("unavailable"); }
 },[]);
 useFocusEffect(useCallback(()=>{void refresh();void refreshPermission();},[refresh,refreshPermission]));
 useEffect(()=>{
  const listener=AppState.addEventListener("change",state=>{if(state==="active")void refreshPermission();});
  return ()=>listener.remove();
 },[refreshPermission]);
 async function enableAlerts(){
  try { setPermission(await enableReminderAlerts()); }
  catch { setStatus("Reminders are saved locally. CasitaDex could not refresh notification schedules."); }
 }
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
 const reminderDirty=editing!==null&&isReminderDraftDirty({title,notes,dueDate,dueTime,repeat},baseline);
 function closeEditor(){setEditing(null);setIosPicker(null);}
 const leaveReminder=useCallback(()=>{
  if(operation.current)return;
  if(!reminderDirty){closeEditor();return;}
  Alert.alert("Discard reminder changes?","Your unsaved reminder changes will be lost.",[
   {text:"Keep editing",style:"cancel"},{text:"Discard changes",style:"destructive",onPress:closeEditor},
  ]);
 },[reminderDirty]);
 useFocusEffect(useCallback(()=>{
  if(editing===null)return;
  const unregister=registerEditGuard(()=>operation.current||reminderDirty,"reminder");
  const back=BackHandler.addEventListener("hardwareBackPress",()=>{leaveReminder();return true;});
  return()=>{unregister();back.remove();};
 },[editing,leaveReminder,reminderDirty]));
 function edit(r?:StandaloneReminder){
  if(operation.current||editing!==null)return;
  const original=r??newReminderDraft(defaultReminderDay());
  setBaseline(original);setEditing(r?.id??"new");
  setTitle(original.title);setNotes(original.notes);setDueDate(original.dueDate);
  setDueTime(original.dueTime);setRepeat(original.repeat);setIosPicker(null);setStatus("");
 }
 async function act(task:()=>Promise<void>,success:string){
  if(operation.current)return;
  operation.current=true;setBusy(true);setStatus("");
  try{
   await task();
   closeEditor();
   setExpandedReminder(null);
   try{setItems(await listStandaloneReminders());setStatus(success);}
   catch{setStatus("Reminder change saved on this device. Reopen Reminders to refresh the list.");}
  }catch(e){setStatus(message(e));}
  finally{operation.current=false;setBusy(false);}
 }
 return <Page independent title="Reminders" hideHeading><BrandHeader /><EditorialIntro eyebrow="A little help remembering" title="What needs attention." description="The right details, at the right time." />
 <Copy>Reminders are saved locally. {permission==="allowed"
   ?"Phone notifications are enabled. Linked reminders are scheduled for 9:00 AM local time."
   :permission==="denied"?"To receive alerts, allow CasitaDex notifications in Settings."
   :permission==="undetermined"?"Enable phone notifications to receive reminder alerts."
   :"Phone notifications are unavailable on this build."}</Copy>
 {permission==="undetermined"?<Button label="Enable reminder notifications" onPress={()=>void enableAlerts()}/>:null}
 {permission==="denied"?<Button label="Open notification settings" onPress={()=>void Linking.openSettings().catch(()=>setStatus("Open CasitaDex in your device Settings to allow notifications."))}/>:null}
 {editing!==null?<View style={s.panel}>
  <Copy kind="section">{editing==="new"?"New reminder":"Edit reminder"}</Copy>
  <Field disabled={busy} label="Reminder title" value={title} onChangeText={setTitle} maxLength={200}/>
  <Field disabled={busy} label="Notes (optional)" value={notes} onChangeText={setNotes} multiline maxLength={4000}/>
  <Copy>Due: {dueDate} at {dueTime}</Copy><Button disabled={busy} label="Select Date" onPress={()=>choosePicker("date")}/><Button disabled={busy} label="Select Time" onPress={()=>choosePicker("time")}/>{iosPicker?<DateTimePicker value={new Date(dueDate+"T"+dueTime+":00")} mode={iosPicker} onChange={(_,selected)=>{if(!selected)return;if(iosPicker==="date")setDueDate([selected.getFullYear(),String(selected.getMonth()+1).padStart(2,"0"),String(selected.getDate()).padStart(2,"0")].join("-"));else setDueTime([String(selected.getHours()).padStart(2,"0"),String(selected.getMinutes()).padStart(2,"0")].join(":"));}}/>:null}{iosPicker?<Button label="Done Selecting" onPress={()=>setIosPicker(null)}/>:null}
  <Copy>Repeat: {repeat}</Copy>{(["once","daily","weekly","monthly","yearly"] as RepeatSchedule[]).map(option=><Button key={option} disabled={busy} label={option==="once"?"Once":option[0].toUpperCase()+option.slice(1)} selected={repeat===option} onPress={()=>setRepeat(option)}/>)}<Button label="Save Reminder" disabled={busy||!title.trim()} onPress={()=>void act(()=>saveStandaloneReminder({id:editing==="new"?undefined:editing,title,notes,dueDate,dueTime,repeat}),"Reminder saved on this device.")}/>
  <Button label="Cancel" disabled={busy} onPress={leaveReminder}/>
 </View>:<Button primary label="Create Reminder" onPress={()=>edit()}/>}
 {editing===null && params.reminder!==undefined ? <View style={s.panel}>
  <Copy>{!itemsLoaded ? "Loading your reminder…" : selectedNotification ? "Reminder opened from your notification." : "This notification reminder is unavailable. Your saved reminders are shown below."}</Copy>
  <Button label="Show all reminders" onPress={()=>router.setParams({reminder:undefined})}/>
 </View> : null}
 {editing===null && !selectedNotification ? <>
  {linkedSection("Upcoming memory reminders", upcoming)}
  {linkedSection("Past-due memory reminders", overdue)}
  {memories.status ? <View style={s.panel}>
   <Status text="Memory reminders could not refresh." />
   <Button label="Retry memory reminders" onPress={() => {
    memories.setStatus("");
    void memories.refresh();
   }} />
  </View> : null}
  {linkedReminders.length > 0 && items.length > 0 ? <Copy kind="section" accessibilityRole="header">Standalone reminders</Copy> : null}
 </> : null}
 {editing===null?visibleItems.map(r=><View key={r.id} style={s.panel}>
  <Copy style={{fontWeight:"700"}}>{r.title}</Copy><Copy>{r.dueDate} at {r.dueTime} · {r.repeat}{r.completed?" · Completed":""}</Copy>
  {r.notes?<Copy kind="small">{r.notes}</Copy>:null}
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
  <BrandHeader />
  <EditorialIntro eyebrow="Everything you have saved" title="Your memories." description="Browse and care for saved information." />
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
 <BrandHeader />
 <EditorialIntro eyebrow="Your answers, ready" title="Find it in seconds." description="Search the details you have saved." />
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
export function EngAdd(){
  const params=useLocalSearchParams<{mode?:string}>();const photoFirst=params.mode==="photo";
  const e=useEng(),{s}=useTheme();const {setStatus}=e;const [form,setForm]=useState<EngDraft|null>(null),[mode,setMode]=useState<"loading"|"resume"|"edit">("loading");
  const [duplicate,setDuplicate]=useState(false),[organize,setOrganize]=useState(false),[details,setDetails]=useState(false),[managePhotos,setManagePhotos]=useState(false);
 const [zoomPhoto,setZoomPhoto]=useState<{path:string;label:string}|null>(null);
  const [newSpace,setNewSpace]=useState(""),[newCategory,setNewCategory]=useState(""),[discard,setDiscard]=useState(false);
  const current=useRef<EngDraft|null>(null),timer=useRef<ReturnType<typeof setTimeout>|null>(null),initialized=useRef(false),done=useRef(false),blocked=useRef(false);
  const [working,setWorking]=useState(false);const alive=useRef(true);
  const write=useCallback(async(d:EngDraft)=>{
    await(await getEngStore()).checkpoint(d);
    if(alive.current&&current.current?.checkpoint===d.checkpoint)setStatus("Draft saved on this device.");
  },[setStatus]);
  const flush=useCallback(async()=>{if(timer.current)clearTimeout(timer.current);timer.current=null;if(current.current&&!done.current)await write(current.current);},[write]);
  useEffect(()=>{
    if(e.snapshot&&!initialized.current){initialized.current=true;current.current=e.snapshot.draft;setForm(e.snapshot.draft);setMode(e.snapshot.draft?"resume":"edit");}
  },[e.snapshot]);
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
      const value=current.current;if(!value)throw Error("Add a name and either an answer or a photo");
      await store.saveDraft(value.attempt,value.memoryId);done.current=true;
      router.replace({pathname:"/card",params:{id:value.memoryId}});
    },true);
  }
  const disabled=e.busy||working;
  return <Page independent hideHeading title="Add a Memory">
 <BrandHeader />
    <Copy accessibilityRole="header" kind="title">{mode==="resume"?"Unfinished Memory":photoFirst?"Add Photo Memory":"Add Memory"}</Copy>
     {mode==="loading"?<Copy>Reading your draft…</Copy>:null}
    {mode==="resume"?<><Copy kind="answer">{form?.title||"Unfinished memory"}</Copy>
      <Copy>{form?.photos.length??0} saved photos. Your draft is safe on this device.</Copy>
      <Button primary label="Continue Editing" disabled={disabled} onPress={()=>setMode("edit")} />
      <Button variant="quiet" label="Draft options" disabled={disabled} onPress={()=>setDiscard(true)} />
    </>:null}
    {mode==="edit"?<>
      {photoFirst?<><Copy kind="section">Start with a photo</Copy><Copy>Take a photo or choose one from your device, then add a title and optional details.</Copy><View style={s.row}><Button label="Take photo" disabled={disabled} onPress={()=>void photo(true)} /><Button label="Choose photo" disabled={disabled} onPress={()=>void photo(false)} /></View></>:null}
      <Field maxLength={200} label="What do you want to remember?" value={form?.title??""} onChangeText={title=>change({title})} />
      <Field maxLength={1000} label="The answer (or add a photo)" value={form?.answer??""} onChangeText={answer=>change({answer})} />

      <Copy>Photos ({form?.photos.length??0}/5)</Copy>
      <Button label={managePhotos?"Hide saved photos":"View saved photos"} onPress={()=>setManagePhotos(!managePhotos)} />{managePhotos?<> {zoomPhoto?<PhotoViewer path={zoomPhoto.path} label={zoomPhoto.label} photos={form?.photos.map((p,i)=>({path:p.path,label:"Draft photo "+(i+1)}))} onClose={()=>setZoomPhoto(null)} />:null}{form?.photos.map((p,index)=><View key={p.id} style={s.panel}>
        <Image source={{uri:engPhotoUri(p.path)}} resizeMode="contain" accessibilityLabel={`Draft photo ${index+1}`} style={{width:"100%",height:260}} />
        <Button label={`Open draft photo ${index+1} to zoom`} onPress={()=>setZoomPhoto({path:p.path,label:`Draft photo ${index+1}`})} /><Button label={`Replace draft photo ${index+1}`} disabled={disabled} onPress={()=>void action(async store=>{const bytes=await chooseEngPhoto(false);if(!bytes){setStatus("Replacement canceled. Original photo kept.");return;}const next=await store.replacePhoto(form.id,p.id,bytes);update(next.draft!);setStatus("Draft photo replaced and verified.");})} /><Button label={`Remove draft photo ${index+1}`} disabled={disabled} onPress={()=>void action(async store=>{const next=await store.removePhoto(form.id,p.id);update(next.draft!);setStatus("Photo removed from draft. Previous save remains recoverable.");})} />
      </View>)}</>:null}
      <Button label="Take photo" disabled={disabled||(form?.photos.length??0)>=5} onPress={()=>void photo(true)} />
      <Button label="Browse image files" disabled={disabled||(form?.photos.length??0)>=5} onPress={()=>void photo("files")} /><Button label="Choose photo" disabled={disabled||(form?.photos.length??0)>=5} onPress={()=>void photo(false)} />
      <Button label={organize?"Hide organization":"Organize (optional)"} onPress={()=>setOrganize(!organize)} />{organize?<><Copy>Space (optional)</Copy><View style={s.row}>
        <Button label="Unassigned" selected={!form?.spaceId} disabled={disabled} onPress={()=>change({spaceId:null})} />
        {e.snapshot?.data.spaces.map(x=><Button key={x.id} label={x.name} selected={form?.spaceId===x.id} disabled={disabled} onPress={()=>change({spaceId:x.id})} />)}
      </View>
      <Field label="New Space name" value={newSpace} onChangeText={setNewSpace} />
      <Button label="Create Space here" disabled={disabled} onPress={()=>void action(async store=>{
        const next=await store.taxonomy("space",newSpace);const space=next.data.spaces.at(-1)!;
        const d=current.current??newEngDraft();const updated={...d,spaceId:space.id,checkpoint:d.checkpoint+1};await store.checkpoint(updated);update(updated);setNewSpace("");setStatus("Space created and selected.");
      })} />
      {form?.spaceId?<Button label="Rename selected Space using new Space name" disabled={disabled} onPress={()=>void action(async store=>{const snapshot=await store.load();await store.renameTaxonomy("space",form.spaceId!,newSpace,snapshot.revision);setNewSpace("");setStatus("Space renamed. Draft kept.");})} />:null}
      <Copy>Categories (optional)</Copy><View style={s.row}>
        {e.snapshot?.data.categories.map(x=><Button key={x.id} label={x.name} selected={form?.categoryIds.includes(x.id)??false} disabled={disabled} onPress={()=>change({categoryIds:form?.categoryIds.includes(x.id)?form.categoryIds.filter(id=>id!==x.id):[...(form?.categoryIds??[]),x.id]})} />)}
      </View>
      <Field label="New Category name" value={newCategory} onChangeText={setNewCategory} />
      {form?.categoryIds.map(id=><Button key={`rename-${id}`} label={`Rename ${e.snapshot?.data.categories.find(c=>c.id===id)?.name} using new Category name`} disabled={disabled} onPress={()=>void action(async store=>{const snapshot=await store.load();await store.renameTaxonomy("category",id,newCategory,snapshot.revision);setNewCategory("");setStatus("Category renamed. Draft kept.");})} />)}
      <Button label="Create Category" disabled={disabled} onPress={()=>void action(async store=>{await store.taxonomy("category",newCategory);setNewCategory("");setStatus("Category created. Select it to add it to your memory.");})} />
      </>:null}<Button label={details?"Hide more details":"More details (optional)"} onPress={()=>setDetails(!details)} />{details?<><Field maxLength={4000} label="Where it is (optional)" value={form?.location??""} onChangeText={location=>change({location})} /><Field maxLength={4000} label="Notes (optional)" multiline value={form?.notes??""} onChangeText={notes=>change({notes})} /><Field maxLength={200} label="Source (optional)" value={form?.source??""} onChangeText={source=>change({source})} /><Field maxLength={10} label="Reminder date (YYYY-MM-DD, optional)" value={form?.due??""} onChangeText={due=>change({due:due||undefined})} /></>:null}

      <Button primary label={working?"Saving…":"Save memory"} disabled={disabled} onPress={()=>void save()} />
      {form?<Button variant="quiet" label="Draft options" disabled={disabled} onPress={()=>setDiscard(true)} />:null}
    </>:null}
    {duplicate?<View style={s.panel}><Copy>Possible duplicate. Your draft is safe. Review the existing memory or save anyway.</Copy>{(form&&e.snapshot?duplicateCandidates(form,e.snapshot):[]).map(m=><View key={m.id}><Copy>Existing {m.lifecycle==="recently_deleted"?"Recently Deleted":m.lifecycle} memory</Copy><MemoryLink memory={m} /></View>)}
      <Button primary label="Return to editing" onPress={()=>setDuplicate(false)} />
      <Button label="Save as separate memory" disabled={disabled} onPress={()=>void save(true)} />
    </View>:null}
    {discard?<View style={s.panel}><Copy>Discard this unfinished memory and its photos? Saved memories will stay as they are.</Copy>
      <Button label="Keep draft" disabled={disabled} onPress={()=>setDiscard(false)} />
      <Button label="Confirm discard draft" disabled={disabled} onPress={()=>void action(async store=>{const d=current.current;if(d)await store.discard(d.id,d.checkpoint);current.current=null;setForm(null);setDiscard(false);setMode("edit");setStatus("Draft discarded. Your saved memories are kept.");})} />
    </View>:null}
    <Copy>Full backups include your unfinished draft and its saved photos.</Copy><Status text={e.status} />
    <Button label="Keep draft and leave" disabled={disabled||mode==="loading"} onPress={()=>void action(async()=>{router.replace("/");})} />
  </Page>;
}
export function EngDetail(){
  const e=useEng(),{s}=useTheme(),{id}=useLocalSearchParams<{id:string}>();
  const memory=e.snapshot?.data.memories.find(m=>m.id===id);
  const [photo,setPhoto]=useState<{path:string;label:string}|null>(null);
  const [edit,setEdit]=useState<MemoryV2|null>(null),[revision,setRevision]=useState(0),[history,setHistory]=useState("");
  const [review,setReview]=useState(false),[source,setSource]=useState(""),[sharing,setSharing]=useState(false),[fields,setFields]=useState<ShareField[]>([]),[photoIds,setPhotoIds]=useState<string[]>([]);
  const [nextDue,setNextDue]=useState(""),[labelName,setLabelName]=useState("");
  const dirty=!!edit&&JSON.stringify(edit)!==JSON.stringify(memory);
  useEffect(()=>registerEditGuard(()=>dirty),[dirty]);
  useEffect(()=>{if(!dirty)return;const h=BackHandler.addEventListener("hardwareBackPress",()=>{Alert.alert("Keep your edits?","Save or cancel your edits before leaving this memory.");return true;});return()=>h.remove();},[dirty]);
  const m=edit??memory;
  const photos=orderedMemoryPhotos(m,e.snapshot?.data.media.media);
  function confirm(label:string,task:(store:EngStore)=>Promise<unknown>){Alert.alert(label,"Your previous full save remains recoverable.",[{text:"Cancel",style:"cancel"},{text:label,onPress:()=>void e.run(task)}]);}
  return <Page independent title={m?.title??"Memory"}>
    {photo?<PhotoViewer path={photo.path} label={photo.label} photos={photos.map((p,i)=>({path:p.path,label:"Photo "+(i+1)+" of "+m?.title}))} onClose={()=>setPhoto(null)} />:null}
    {m?<>
      {edit?<>
        <Field disabled={e.busy} maxLength={200} label="Memory name" value={edit.title} onChangeText={title=>setEdit({...edit,title})} />
        <Field disabled={e.busy} maxLength={1000} label="Written answer (optional with a photo)" value={edit.answer} onChangeText={answer=>setEdit({...edit,answer})} />
        <Field disabled={e.busy} maxLength={4000} label="Location" value={edit.location} onChangeText={location=>setEdit({...edit,location})} />
        <Field disabled={e.busy} maxLength={4000} label="Notes" value={edit.notes} onChangeText={notes=>setEdit({...edit,notes})} />
        <Field disabled={e.busy} maxLength={200} label="Source" value={edit.source} onChangeText={source=>setEdit({...edit,source})} />
        <Field disabled={e.busy} maxLength={10} label="Reminder date (YYYY-MM-DD)" value={edit.due??""} onChangeText={value=>setEdit({...edit,due:value||undefined})} />
        <Copy>Answer or source changes require checking again. Confirm verification separately in Review.</Copy>
        <Copy>Space</Copy><View style={s.row}><Button label="Unassigned" selected={edit.spaceId===null} onPress={()=>setEdit({...edit,spaceId:null})} />
          {e.snapshot?.data.spaces.map(x=><Button key={x.id} label={x.name} selected={edit.spaceId===x.id} onPress={()=>setEdit({...edit,spaceId:x.id})} />)}</View>
        <Copy>Categories</Copy><View style={s.row}>{e.snapshot?.data.categories.map(x=><Button key={x.id} label={x.name} selected={edit.categoryIds.includes(x.id)} onPress={()=>setEdit({...edit,categoryIds:edit.categoryIds.includes(x.id)?edit.categoryIds.filter(id=>id!==x.id):[...edit.categoryIds,x.id]})} />)}</View>
        <Field disabled={e.busy} label="Create a Space or Category without leaving edits" value={labelName} onChangeText={setLabelName} />
        {(["space","category"] as const).map(kind=><Button key={kind} label={kind==="space"?"Create and select Space":"Create and select Category"} disabled={e.busy} onPress={()=>void e.run(async store=>{const next=await store.taxonomy(kind,labelName,revision);const label=(kind==="space"?next.data.spaces:next.data.categories).at(-1)!;setEdit({...edit,...(kind==="space"?{spaceId:label.id}:{categoryIds:[...edit.categoryIds,label.id]})});setRevision(next.revision);setLabelName("");})} />)}
        {edit.spaceId?<Button label="Rename selected Space using label name" disabled={e.busy} onPress={()=>void e.run(async store=>{const next=await store.renameTaxonomy("space",edit.spaceId!,labelName,revision);setRevision(next.revision);setLabelName("");})} />:null}{edit.categoryIds.map(id=><Button key={`rename-${id}`} label={`Rename ${e.snapshot?.data.categories.find(c=>c.id===id)?.name} using label name`} disabled={e.busy} onPress={()=>void e.run(async store=>{const next=await store.renameTaxonomy("category",id,labelName,revision);setRevision(next.revision);setLabelName("");})} />)}
        <Button primary label="Save changes" disabled={e.busy} onPress={()=>void e.run(async store=>{await store.updateMemory(edit,revision);setEdit(null);})} />
        <Button label="Cancel edits" disabled={e.busy} onPress={()=>setEdit(null)} />
      </>:<>
        {m.answer?<Copy selectable kind="answer">{m.answer}</Copy>:<Copy>Photo memory</Copy>}
        <Copy>{m.confidence}{m.source?" · "+m.source:""}{m.verifiedAt?" · Last verified "+m.verifiedAt:""}</Copy>{m.location?<Copy>{m.location}</Copy>:null}{m.notes?<Copy>{m.notes}</Copy>:null}
        {m.lifecycle!=="recently_deleted"?<><Button label={review?"Close review":"Review answer"} onPress={()=>{setSource(m.source);setReview(!review);}} />{review?<View style={s.panel}><Copy>Confirm against a source you checked. Opening a memory does not verify it.</Copy><Field disabled={e.busy} maxLength={200} label="Source checked" value={source} onChangeText={setSource} />{confidences.map(confidence=><Button key={confidence} label={confidence==="Verified"?"Confirm Verified":`Set ${confidence}`} disabled={e.busy} onPress={()=>void e.run(async store=>{await store.reviewMemory(m.id,{source,confidence},e.snapshot!.revision);setReview(false);})} />)}</View>:null}</>:null}
        <Copy>Space: {e.snapshot?.data.spaces.find(s=>s.id===m.spaceId)?.name??"Unassigned"}</Copy>
        <Copy>Categories: {m.categoryIds.map(id=>e.snapshot?.data.categories.find(c=>c.id===id)?.name).join(", ")||"None"}</Copy>
        {m.legacyContext?<Copy>Original category: {m.legacyContext}</Copy>:null}
        {m.due?<><Copy>Reminder: {m.due}{m.lifecycle!=="active"?" (paused)":""}</Copy>{m.lifecycle==="active"?<><Field disabled={e.busy} maxLength={10} label="Next reminder (optional YYYY-MM-DD)" value={nextDue} onChangeText={setNextDue} /><Button label={nextDue?"Complete and reschedule reminder":"Complete reminder"} disabled={e.busy} onPress={()=>void e.run(async store=>{await store.completeReminder(m.id,e.snapshot!.revision,nextDue||undefined);setNextDue("");})} /></>:null}</>:null}
        {photos.map((p,index)=><View key={p.id} style={s.panel}>
          <Image source={{uri:engPhotoUri(p.path)}} resizeMode="contain" accessibilityLabel={`Saved photo ${index+1} of ${m.title}`} style={{width:"100%",height:320}} />
          <Button label={`Open photo ${index+1} to zoom`} onPress={()=>setPhoto({path:p.path,label:`Photo ${index+1} of ${m.title}`})} />
          {m.lifecycle!=="recently_deleted"?<Button label={`Remove saved photo ${index+1}`} disabled={e.busy} onPress={()=>confirm("Remove photo",store=>store.removeMemoryPhoto(m.id,p.id))} />:null}
        </View>)}
        {m.lifecycle!=="recently_deleted"?<>
          <Button label="Add a photo" disabled={e.busy} onPress={()=>void e.run(async store=>{const bytes=await chooseEngPhoto(false);if(!bytes){e.setStatus("Photo selection canceled. Your memory is kept.");return;}await store.addMemoryPhoto(m.id,bytes);e.setStatus("Photo saved with this memory.");},"")} />
          <Button label="Take another photo" disabled={e.busy} onPress={()=>void e.run(async store=>{const bytes=await chooseEngPhoto(true);if(!bytes){e.setStatus("Camera canceled. Your memory is kept.");return;}await store.addMemoryPhoto(m.id,bytes);e.setStatus("Photo saved with this memory.");},"")} />
          <Button label="Edit memory" disabled={e.busy} onPress={()=>{setEdit(JSON.parse(JSON.stringify(m)));setRevision(e.snapshot!.revision);}} />
          <Button label={m.lifecycle==="active"?"Archive memory":"Return to Active"} disabled={e.busy} onPress={()=>void e.run(store=>store.lifecycle(m.id,m.lifecycle==="active"?"archived":"active",day()))} />
          <Button label="Move to Recently Deleted" disabled={e.busy} onPress={()=>confirm("Move to Recently Deleted",store=>store.lifecycle(m.id,"recently_deleted",day()))} />
        </>:<>
          <Copy>Deleted {m.deletedAt}. Recoverable for at least 30 days. Photos stay with this memory.</Copy>
          <Button label="Restore memory" disabled={e.busy} onPress={()=>void e.run(store=>store.lifecycle(m.id,"active",day()))} />
          <Copy>Permanent cleanup is unavailable in this Development build. Deleted memories and photos remain recoverable.</Copy>
        </>}
        {m.lifecycle==="recently_deleted"?<Button label={review?"Hide history":"Show history"} onPress={()=>setReview(!review)} />:null}
        {review?<><Copy>History</Copy>{[...m.history.map((h,index)=>({id:`old-${index}-${h.id}`,order:h.date,text:`${h.date}: ${h.action}`})),...(m.events??[]).map(event=>({id:event.id,order:event.at,text:`${new Date(event.at).toLocaleString()}: ${eventText(event)}`}))].sort((a,b)=>a.order.localeCompare(b.order)).map(row=><Copy key={row.id}>{row.text}</Copy>)}
        {m.lifecycle!=="recently_deleted"?<><Field disabled={e.busy} label="History note" value={history} onChangeText={setHistory} />
          <Button label="Record history" disabled={e.busy} onPress={()=>void e.run(async store=>{if(!history.trim())throw Error("Add a history note first");await store.recordHistory(m.id,history.trim(),e.snapshot!.revision);setHistory("");})} />
        </>:null}
        </>:null}<Button label="Share memory" disabled={e.busy} onPress={()=>{setFields([]);setPhotoIds([]);setSharing(true);}} />
        {sharing?<View style={s.panel}><Copy accessibilityRole="header">Review what to share</Copy><Copy>The name and answer are included. Choose any additional details.</Copy>{(["location","notes","source","space","categories","verification","reminder"] as ShareField[]).map(field=><Button key={field} label={`Include ${field}`} disabled={e.busy} selected={fields.includes(field)} onPress={()=>setFields(old=>old.includes(field)?old.filter(x=>x!==field):[...old,field])} />)}<Copy selectable>{sharePreview(m,e.snapshot!.data,{fields,photoIds}).text}</Copy><Copy>{photoIds.length} photos selected.</Copy>{photos.map((p,i)=><Button key={p.id} label={`Include photo ${i+1}`} disabled={e.busy} selected={photoIds.includes(p.id)} onPress={()=>setPhotoIds(old=>old.includes(p.id)?old.filter(id=>id!==p.id):[...old,p.id])} />)}{photos.filter(p=>photoIds.includes(p.id)).map(p=>{return <Image key={p.id} source={{uri:engPhotoUri(p.path)}} resizeMode="contain" accessibilityLabel="Selected photo in share preview" style={{width:"100%",height:160}} />;})}{photoIds.length?<Copy>Selected original photos may contain location or other embedded metadata. The ZIP includes only the reviewed details and selected photos.</Copy>:null}<Button primary label="Open share sheet with reviewed details" disabled={e.busy} onPress={()=>void e.run(async()=>{const preview=sharePreview(m,e.snapshot!.data,{fields,photoIds});if(photoIds.length)e.setStatus(await shareEngPhotos(preview));else{const result=await Share.share({message:preview.text});e.setStatus(result.action===Share.dismissedAction?"Sharing canceled.":"Share sheet opened. Delivery is handled by the selected app.");}setSharing(false);},"")} /><Button label="Cancel sharing" disabled={e.busy} onPress={()=>setSharing(false)} /></View>:null}
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
export function EngMore(){
  const e=useEng(),preferences=useData();const [reminderRestoreToken,setReminderRestoreToken]=useState<string|null>(null),[incoming,setIncoming]=useState<EngBackup|null>(null),[conflict,setConflict]=useState<"keep"|"incoming"|null>(null),[confirmRecovery,setConfirmRecovery]=useState(false);const [restoreToken,setRestoreToken]=useState<string|null>(null);const [textReview,setTextReview]=useState<{snapshot:EngSnapshot;token:string}|null>(null);const [section,setSection]=useState<"storage"|"labels"|"backup"|"preferences"|"help"|"premium"|null>(null);
  useEffect(()=>{if(!section)return;const h=BackHandler.addEventListener("hardwareBackPress",()=>{setSection(null);return true;});return()=>h.remove();},[section]);
  return <Page key={section??"menu"} independent hideHeading title="More">
 <BrandHeader />
    <Copy accessibilityRole="header" kind="title">More</Copy>
     {!section?<>
    <Copy>Memories stay on this device. A local save is not a separate backup.</Copy>
    <Copy accessibilityRole="header">Memory management</Copy><Button label="Storage & Cleanup" onPress={()=>setSection("storage")} />
    <Button label="Archived memories" onPress={()=>{findCache={query:"",filter:{...defaultFilter(),lifecycle:"archived"},page:0,y:0,expanded:false};router.push("/answers");}} />
    <Button label="Recently Deleted memories" onPress={()=>{findCache={query:"",filter:{...defaultFilter(),lifecycle:"recently_deleted"},page:0,y:0,expanded:false};router.push("/answers");}} />
    <Button label="Manage Spaces & Categories" onPress={()=>setSection("labels")} />
    <Copy accessibilityRole="header">Data protection</Copy><Button label="Backup & Restore" onPress={()=>setSection("backup")} />
    <Copy accessibilityRole="header">Preferences & help</Copy><Button label="Appearance & Accessibility" onPress={()=>setSection("preferences")} /><Button label="Help & About" onPress={()=>setSection("help")} /><Button label="Optional premium information" onPress={()=>setSection("premium")} />
    </>:null}{section?<Button label="Back to More" onPress={()=>setSection(null)} />:null}
    {section==="premium"?<><Copy accessibilityRole="header">Optional premium</Copy><Copy>Your saved memories, photos, search and reminders remain available without a purchase.</Copy><Copy>Premium purchases are not available yet. No payment will be taken. Purchase and Restore will be enabled only after Apple and Google store verification is implemented and tested.</Copy></>:null}
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
    {section==="help"?<><BrandLogo width={180} /><Copy accessibilityRole="header">Help & About</Copy><Copy>CasitaDex Development 0.1.0. Memories and photos stay on this device unless you export or share them. Keep a verified full backup in a second location. Text backups from earlier versions can be reviewed with Choose backup. They cannot contain photos or an unfinished draft.</Copy><Copy>Verification records what you checked against a source. It is not a guarantee of correctness. Editing an answer or its source requires checking again. Archive pauses reminders; Recently Deleted keeps recovery available. Cleanup does not run automatically in this build.</Copy>
    </>:null}{section==="preferences"?<><Copy accessibilityRole="header">Appearance & Accessibility</Copy><Button label="Large text" selected={preferences.large} onPress={()=>preferences.setLarge(!preferences.large)} />
    {(["System","Light","Dark"] as const).map(value=><Button key={value} label={value+" appearance"} selected={preferences.appearance===value} onPress={()=>preferences.setAppearance(value)} />)}
    <Copy>{preferences.preferenceError}</Copy></>:null}<Status text={e.status} />
    {!e.snapshot?<Button label="Reload full collection" disabled={e.busy} onPress={()=>void e.refresh()} />:null}
  </Page>;
}
