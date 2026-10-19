import React, { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { Alert, AppState, BackHandler, Image, Modal, Pressable, ScrollView, Share, TextInput, View, useWindowDimensions } from "react-native";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { Button, Copy, Field, Page, useTheme } from "./ui";
import { useData } from "./state";
import { getEngStore, getEngStorage, chooseEngPhoto, engPhotoUri, writeEngBackup, pickEngBackup, shareEngPhotos, writeEngText, type EngStore, type EngBackup } from "./eng-runtime";
import { newEngDraft } from "./eng-store";
import type { EngDraft, EngSnapshot } from "./eng-types";
import type { MemoryV2 } from "./sb20-contract";
import { localDay, eventText, sharePreview, type ShareField } from "./eng-domain";
import { defaultFilter, findMemories, searchIndex, homeMemories, type FindFilter } from "./eng-find";
import { textBackupPreview, createTextBackup } from "./eng-text-backup";
import { duplicateCandidates } from "./eng-duplicates";
import { registerEditGuard } from "./eng-navigation";
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
function Status({text}:{text:string}){return <Copy accessibilityLiveRegion="polite">{text}</Copy>;}
function MemoryLink({memory,data}:{memory:MemoryV2;data?:EngSnapshot["data"]}){
  const {s}=useTheme();
  return <Pressable accessibilityRole="button" accessibilityLabel={`Open ${memory.title}: ${memory.answer||"Photo memory"}`}
    onPress={()=>router.push({pathname:"/card",params:{id:memory.id}})} style={s.panel}>
    {data?<><Copy kind="answer">{memory.answer||"Photo memory"}</Copy><Copy style={{fontWeight:"700"}}>{memory.title}</Copy>{!memory.answer&&data.media.media.find(p=>p.cardId===memory.id)?<Image source={{uri:engPhotoUri(data.media.media.find(p=>p.cardId===memory.id)!.path)}} accessibilityLabel={`Photo for ${memory.title}`} resizeMode="contain" style={{width:"100%",height:160}} />:null}<Copy kind="small">{data.spaces.find(x=>x.id===memory.spaceId)?.name??"Unassigned"}{memory.categoryIds.length?" · "+memory.categoryIds.map(id=>data.categories.find(x=>x.id===id)?.name).join(", "):""} · {memory.confidence}</Copy></>:<><Copy style={{fontWeight:"700"}}>{memory.title}</Copy><Copy>{memory.answer||"Photo memory"}</Copy></>}
    
  </Pressable>;
}
function PhotoViewer({path,label,onClose}:{path:string;label:string;onClose:()=>void}){
  const {width,height}=useWindowDimensions(),{colors}=useTheme();const [zoom,setZoom]=useState(1);
  return <Modal visible onRequestClose={onClose} animationType="slide">
    <View style={{flex:1,padding:20,paddingTop:48,backgroundColor:colors.paper,gap:12}}>
      <Copy accessibilityRole="header">{label}</Copy>
      <Button label="Close photo" onPress={onClose} />
      <View style={{flexDirection:"row",flexWrap:"wrap",gap:10}}>
        <Button label="Zoom in" disabled={zoom>=4} onPress={()=>setZoom(v=>Math.min(v+1,4))} />
        <Button label="Zoom out" disabled={zoom<=1} onPress={()=>setZoom(v=>Math.max(v-1,1))} />
        <Copy accessibilityLiveRegion="polite">Zoom {zoom} times</Copy>
      </View>
      <ScrollView style={{flex:1}}><ScrollView horizontal>
        <Image source={{uri:engPhotoUri(path)}} resizeMode="contain" accessibilityLabel={label}
          style={{width:Math.max(width-40,200)*zoom,height:Math.max(height-300,200)*zoom}} />
      </ScrollView></ScrollView>
    </View>
  </Modal>;
}
let findCache={query:"",filter:defaultFilter(),page:0,y:0,expanded:false};
export function EngHome(){
 const e=useEng(),{colors}=useTheme(),preferences=useData(),[quick,setQuick]=useState("");
 const banner=Image.resolveAssetSource(require("../assets/casitadex-branded-banner.png"));
 const home=e.snapshot?homeMemories(e.snapshot.data,day()):null;
 function open(query="",reminder="all"){findCache={query,filter:{...defaultFilter(),reminder},page:0,y:0,expanded:false};router.push("/answers");}
 return <Page independent title="" hideHeading>
 <Image source={require("../assets/casitadex-branded-banner.png")} resizeMode="contain" accessibilityLabel="CasitaDex. Your home, remembered. A little less to remember." style={{aspectRatio:banner.width/banner.height,width:"100%",height:undefined}} />
 <Copy>Search your memories</Copy><View style={{flexDirection:"row",alignItems:"center",gap:8,borderRadius:32,borderWidth:1,borderColor:colors.muted,backgroundColor:colors.white,padding:8}}><TextInput accessibilityLabel="Search your memories" placeholder="Find an answer" placeholderTextColor={colors.muted} value={quick} onChangeText={setQuick} onSubmitEditing={()=>open(quick)} returnKeyType="search" style={{flex:1,minHeight:52,fontSize:preferences.large?34:17,color:colors.ink,paddingHorizontal:12}} /><Button label="GO" onPress={()=>open(quick)} /></View>
 <Copy>{home?.active??0} saved memories</Copy><Button primary label="Save a memory" onPress={()=>router.push("/add")} />
 {e.snapshot?.draft?<Button label="Continue unfinished memory" onPress={()=>router.push("/add")} />:null}
 <Copy accessibilityRole="header">Recently remembered</Copy>{home?.recent.map(m=><MemoryLink key={m.id} memory={m} />)}
 <Button label="See all memories" onPress={()=>open()} />
 {home?.due.length?<><Copy accessibilityRole="header">Reminders</Copy>{home.due.map(m=><View key={m.id}><MemoryLink memory={m} /><Copy>Due {m.due}</Copy></View>)}<Button label="See all due reminders" onPress={()=>open("","due")} /></>:null}
 <Status text={e.status} />{!e.snapshot?<Button label="Retry loading full collection" onPress={()=>void e.refresh()} />:null}
 </Page>;
}
export function EngFind(){
 const e=useEng(),{s}=useTheme();const [query,setQuery]=useState(findCache.query),[f,setF]=useState<FindFilter>(findCache.filter),[page,setPage]=useState(findCache.page),[filters,setFilters]=useState(findCache.expanded),[selecting,setSelecting]=useState(false),[selected,setSelected]=useState<string[]>([]);
 const [returnScroll,setReturnScroll]=useState(()=>({key:0,y:findCache.y})),focused=useRef(false);
 useFocusEffect(useCallback(()=>{const y=findCache.y;focused.current=true;setReturnScroll(old=>({key:old.key+1,y}));return()=>{focused.current=false;};},[]));
 const index=useMemo(()=>e.snapshot?searchIndex(e.snapshot.data):[],[e.snapshot]);
 const records=useMemo(()=>findMemories(index,query,f,day()),[index,query,f]);
 useEffect(()=>{findCache={...findCache,query,filter:f,page,expanded:filters};},[query,f,page,filters]);
 function filter(patch:Partial<FindFilter>){setF(old=>({...old,...patch}));setPage(0);setSelected([]);}
 function bulk(state:MemoryV2["lifecycle"]){const ids=[...selected],revision=e.snapshot!.revision;Alert.alert(`Change ${ids.length} selected memories?`,`Move to ${state==="active"?"Active":state==="archived"?"Archive":"Recently Deleted"}. Photos stay attached. Previous full save remains recoverable.`,[{text:"Cancel",style:"cancel"},{text:"Confirm",onPress:()=>void e.run(async store=>{await store.bulkLifecycle(ids,state,revision);setSelected([]);setSelecting(false);})}]);}
 const currentPage=Math.min(page,Math.max(0,Math.ceil(records.length/50)-1));
 return <Page key={returnScroll.key} independent title="Find an answer" restoreScrollY={returnScroll.y} restoreReady={!!e.snapshot} onScrollY={y=>{if(focused.current)findCache.y=y;}}>
 <Field label="Search your memories" value={query} onChangeText={q=>{setQuery(q);setPage(0);}} />
 <View style={s.row}>{(["active","archived","recently_deleted"] as const).map(value=><Button key={value} label={value==="active"?"Active":value==="archived"?"Archived":"Recently Deleted"} selected={f.lifecycle===value} onPress={()=>filter({lifecycle:value,reminder:"all"})} />)}</View>
 <Copy>Space</Copy><View style={s.row}><Button label="All spaces" selected={f.space==="all"} onPress={()=>filter({space:"all"})} /><Button label="Unassigned" selected={f.space===null} onPress={()=>filter({space:null})} />{e.snapshot?.data.spaces.map(x=><Button key={x.id} label={x.name} selected={f.space===x.id} onPress={()=>filter({space:x.id})} />)}</View>
 <Copy>Categories (any selected)</Copy><View style={s.row}><Button label="All categories" selected={!f.categories.length&&!f.uncategorized} onPress={()=>filter({categories:[],uncategorized:false})} /><Button label="Uncategorized" selected={f.uncategorized} onPress={()=>filter({categories:[],uncategorized:true})} />{e.snapshot?.data.categories.map(x=><Button key={x.id} label={x.name} selected={f.categories.includes(x.id)} onPress={()=>filter({uncategorized:false,categories:f.categories.includes(x.id)?f.categories.filter(id=>id!==x.id):[...f.categories,x.id]})} />)}</View>
 <Button label={filters?"Hide more filters":"More filters"} onPress={()=>setFilters(!filters)} />{filters?<>
 <Copy>Verification</Copy><View style={s.row}>{["all",...confidences].map(value=><Button key={value} label={value==="all"?"Any verification":value} selected={f.confidence===value} onPress={()=>filter({confidence:value})} />)}</View>
 <Copy>Reminders (active memories)</Copy><View style={s.row}>{["all","due","overdue","today","future","none"].map(value=><Button key={value} label={value==="all"?"Any reminder":value} selected={f.reminder===value} onPress={()=>filter({reminder:value})} />)}</View>
 <Copy>Attachments</Copy><View style={s.row}>{["all","photos","text"].map(value=><Button key={value} label={value==="all"?"Any attachment":value==="text"?"Without photos":"With photos"} selected={f.attachment===value} onPress={()=>filter({attachment:value})} />)}</View>
 </>:null}
 <View style={s.row}>{f.space!=="all"?<Button label="Remove Space filter" onPress={()=>filter({space:"all"})} />:null}{f.uncategorized?<Button label="Remove Uncategorized filter" onPress={()=>filter({uncategorized:false})} />:null}{f.categories.map(id=><Button key={id} label={`Remove ${e.snapshot?.data.categories.find(c=>c.id===id)?.name??"Category"} filter`} onPress={()=>filter({categories:f.categories.filter(c=>c!==id)})} />)}{(["confidence","reminder","attachment"] as const).filter(key=>f[key]!=="all").map(key=><Button key={key} label={`Remove ${f[key]} filter`} onPress={()=>filter({[key]:"all"})} />)}</View>
 <Copy>Applied: {f.space==="all"?"all spaces":f.space===null?"Unassigned":e.snapshot?.data.spaces.find(x=>x.id===f.space)?.name}; {f.uncategorized?"Uncategorized":f.categories.map(id=>e.snapshot?.data.categories.find(x=>x.id===id)?.name).join(", ")||"all categories"}; {f.confidence}; {f.reminder}; {f.attachment}</Copy>
 <Button label="Clear filters" onPress={()=>{setF({...defaultFilter(),lifecycle:f.lifecycle});setPage(0);}} />
 <Copy>{records.length} memories</Copy><Button label={selecting?"Cancel selection":"Select memories"} onPress={()=>{setSelecting(!selecting);setSelected([]);}} />{selecting?<><Copy>{selected.length} selected</Copy>{(["active","archived","recently_deleted"] as const).filter(state=>state!==f.lifecycle).map(state=><Button key={state} label={state==="active"?"Restore selected":state==="archived"?"Archive selected":"Delete selected"} disabled={e.busy||!selected.length} onPress={()=>bulk(state)} />)}</>:null}{records.slice(currentPage*50,(currentPage+1)*50).map(m=><View key={m.id}>{selecting?<Button label={`Select ${m.title}`} disabled={e.busy} selected={selected.includes(m.id)} onPress={()=>setSelected(old=>old.includes(m.id)?old.filter(id=>id!==m.id):[...old,m.id])} />:null}<MemoryLink memory={m} data={e.snapshot!.data} /></View>)}
 {!records.length?<Copy>No memories match. Try fewer words or clear filters.</Copy>:null}
 {records.length>50?<View style={s.row}><Copy>Page {currentPage+1} of {Math.ceil(records.length/50)}</Copy><Button label="Previous 50 results" disabled={!currentPage} onPress={()=>setPage(currentPage-1)} /><Button label="Next 50 results" disabled={(currentPage+1)*50>=records.length} onPress={()=>setPage(currentPage+1)} /></View>:null}
 {f.lifecycle==="recently_deleted"?<Copy>Deleted memories and photos remain recoverable. Restore them from their details.</Copy>:null}<Status text={e.status} />
 </Page>;
}
export function EngAdd(){
  const e=useEng(),{s}=useTheme();const {setStatus}=e;const [form,setForm]=useState<EngDraft|null>(null),[mode,setMode]=useState<"loading"|"resume"|"edit">("loading");
  const [duplicate,setDuplicate]=useState(false),[organize,setOrganize]=useState(false),[details,setDetails]=useState(false);
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
  return <Page independent title={mode==="resume"?"Continue your memory?":"Add a Memory"} subtitle="Save a quick detail now, so you can find it later.">
    {mode==="loading"?<Copy>Reading your draft…</Copy>:null}
    {mode==="resume"?<><Copy kind="answer">{form?.title||"Unfinished memory"}</Copy>
      <Copy>Your unfinished memory and photos are kept separately from saved answers.</Copy>
      <Button primary label="Continue draft" disabled={disabled} onPress={()=>setMode("edit")} />
      <Button label="Discard draft" disabled={disabled} onPress={()=>setDiscard(true)} />
    </>:null}
    {mode==="edit"?<>
      <Field maxLength={200} label="What do you want to remember?" value={form?.title??""} onChangeText={title=>change({title})} />
      <Field maxLength={1000} label="The answer (or add a photo)" value={form?.answer??""} onChangeText={answer=>change({answer})} />
      
      <Copy>Photos ({form?.photos.length??0}/5)</Copy>
      {zoomPhoto?<PhotoViewer path={zoomPhoto.path} label={zoomPhoto.label} onClose={()=>setZoomPhoto(null)} />:null}{form?.photos.map((p,index)=><View key={p.id} style={s.panel}>
        <Image source={{uri:engPhotoUri(p.path)}} resizeMode="contain" accessibilityLabel={`Draft photo ${index+1}`} style={{width:"100%",height:260}} />
        <Button label={`Open draft photo ${index+1} to zoom`} onPress={()=>setZoomPhoto({path:p.path,label:`Draft photo ${index+1}`})} /><Button label={`Replace draft photo ${index+1}`} disabled={disabled} onPress={()=>void action(async store=>{const bytes=await chooseEngPhoto(false);if(!bytes){setStatus("Replacement canceled. Original photo kept.");return;}const next=await store.replacePhoto(form.id,p.id,bytes);update(next.draft!);setStatus("Draft photo replaced and verified.");})} /><Button label={`Remove draft photo ${index+1}`} disabled={disabled} onPress={()=>void action(async store=>{const next=await store.removePhoto(form.id,p.id);update(next.draft!);setStatus("Photo removed from draft. Previous save remains recoverable.");})} />
      </View>)}
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
      <Copy>Starts as Unknown. Confirm against a source when ready. Keep passwords, door codes and alarm codes out of CasitaDex.</Copy>
      <Button primary label={working?"Saving…":"Save memory"} disabled={disabled} onPress={()=>void save()} />
      {form?<Button label="Discard draft" disabled={disabled} onPress={()=>setDiscard(true)} />:null}
    </>:null}
    {duplicate?<View style={s.panel}><Copy>A similar memory or matching photo already exists. Your unfinished draft is kept.</Copy>{(form&&e.snapshot?duplicateCandidates(form,e.snapshot):[]).map(m=><View key={m.id}><Copy>Existing {m.lifecycle==="recently_deleted"?"Recently Deleted":m.lifecycle} memory</Copy><MemoryLink memory={m} /></View>)}
      <Button label="Keep editing draft" onPress={()=>setDuplicate(false)} />
      <Button label="Save anyway" disabled={disabled} onPress={()=>void save(true)} />
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
  function confirm(label:string,task:(store:EngStore)=>Promise<unknown>){Alert.alert(label,"Your previous full save remains recoverable.",[{text:"Cancel",style:"cancel"},{text:label,onPress:()=>void e.run(task)}]);}
  return <Page independent title={m?.title??"Memory"}>
    {photo?<PhotoViewer path={photo.path} label={photo.label} onClose={()=>setPhoto(null)} />:null}
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
        {e.snapshot?.data.media.media.filter(p=>p.cardId===m.id).map((p,index)=><View key={p.id} style={s.panel}>
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
        {sharing?<View style={s.panel}><Copy accessibilityRole="header">Review what to share</Copy><Copy>The name and answer are included. Choose any additional details.</Copy>{(["location","notes","source","space","categories","verification","reminder"] as ShareField[]).map(field=><Button key={field} label={`Include ${field}`} disabled={e.busy} selected={fields.includes(field)} onPress={()=>setFields(old=>old.includes(field)?old.filter(x=>x!==field):[...old,field])} />)}<Copy selectable>{sharePreview(m,e.snapshot!.data,{fields,photoIds}).text}</Copy><Copy>{photoIds.length} photos selected.</Copy>{e.snapshot?.data.media.media.filter(p=>p.cardId===m.id).map((p,i)=><Button key={p.id} label={`Include photo ${i+1}`} disabled={e.busy} selected={photoIds.includes(p.id)} onPress={()=>setPhotoIds(old=>old.includes(p.id)?old.filter(id=>id!==p.id):[...old,p.id])} />)}{photoIds.map(id=>{const p=e.snapshot!.data.media.media.find(p=>p.id===id)!;return <Image key={id} source={{uri:engPhotoUri(p.path)}} resizeMode="contain" accessibilityLabel="Selected photo in share preview" style={{width:"100%",height:160}} />;})}{photoIds.length?<Copy>Selected original photos may contain location or other embedded metadata. The ZIP includes only the reviewed details and selected photos.</Copy>:null}<Button primary label="Open share sheet with reviewed details" disabled={e.busy} onPress={()=>void e.run(async()=>{const preview=sharePreview(m,e.snapshot!.data,{fields,photoIds});if(photoIds.length)e.setStatus(await shareEngPhotos(preview));else{const result=await Share.share({message:preview.text});e.setStatus(result.action===Share.dismissedAction?"Sharing canceled.":"Share sheet opened. Delivery is handled by the selected app.");}setSharing(false);},"")} /><Button label="Cancel sharing" disabled={e.busy} onPress={()=>setSharing(false)} /></View>:null}
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
  const e=useEng(),preferences=useData();const [incoming,setIncoming]=useState<EngBackup|null>(null),[conflict,setConflict]=useState<"keep"|"incoming"|null>(null),[confirmRecovery,setConfirmRecovery]=useState(false);const [restoreToken,setRestoreToken]=useState<string|null>(null);const [textReview,setTextReview]=useState<{snapshot:EngSnapshot;token:string}|null>(null);const [section,setSection]=useState<"storage"|"labels"|"backup"|"preferences"|"help"|null>(null);
  useEffect(()=>{if(!section)return;const h=BackHandler.addEventListener("hardwareBackPress",()=>{setSection(null);return true;});return()=>h.remove();},[section]);
  return <Page key={section??"menu"} independent title="More">
    {!section?<>
    <Copy>Memories stay on this device. A local save is not a separate backup.</Copy>
    <Copy accessibilityRole="header">Memory management</Copy><Button label="Storage & Cleanup" onPress={()=>setSection("storage")} />
    <Button label="Archived memories" onPress={()=>{findCache={query:"",filter:{...defaultFilter(),lifecycle:"archived"},page:0,y:0,expanded:false};router.push("/answers");}} />
    <Button label="Recently Deleted memories" onPress={()=>{findCache={query:"",filter:{...defaultFilter(),lifecycle:"recently_deleted"},page:0,y:0,expanded:false};router.push("/answers");}} />
    <Button label="Manage Spaces & Categories" onPress={()=>setSection("labels")} />
    <Copy accessibilityRole="header">Data protection</Copy><Button label="Backup & Restore" onPress={()=>setSection("backup")} />
    <Copy accessibilityRole="header">Preferences & help</Copy><Button label="Appearance & Accessibility" onPress={()=>setSection("preferences")} /><Button label="Help & About" onPress={()=>setSection("help")} />
    </>:null}{section?<Button label="Back to More" onPress={()=>setSection(null)} />:null}
    {section==="storage"?<><Copy accessibilityRole="header">Storage & Cleanup</Copy>    <Button label="Measure device storage" disabled={e.busy} onPress={()=>void e.run(async()=>{
      const storage=await getEngStorage();
      const free=Number.isFinite(storage.free)?`${storage.free} bytes`:"Unavailable";
      e.setStatus(`Device usable storage: ${free}. Verified protected photo bytes: ${storage.protectedBytes}. Unreadable references: ${storage.unreadable}. Photo totals exclude database, cache and unindexed files. Archive and Recently Deleted reclaim no bytes. Calibrated warning thresholds are not enabled in this Development build.`);
    },"")} />
    <Button label="Check photo integrity and protected owners" disabled={e.busy} onPress={()=>void e.run(async store=>{const result=await store.audit();const bad=result.filter(x=>x.verdict!=="verified");e.setStatus(`${result.length} protected photo references checked. ${bad.length} need attention.`+(bad.length?" "+bad.map(x=>x.owner+": "+x.verdict).join("; "):" No files removed."));},"")} />
<Copy>Largest saved photos (recorded size; retained photos may overlap recovery references). Archive and Recently Deleted do not reclaim bytes.</Copy>
    {e.snapshot?.data.media.media.slice().sort((a,b)=>b.bytes-a.bytes).slice(0,10).map(p=>{const m=e.snapshot!.data.memories.find(m=>m.id===p.cardId)!;return <View key={p.id}><Copy>Photo {m.mediaIds.indexOf(p.id)+1} · {p.bytes} bytes · {m.lifecycle==="recently_deleted"?"Recently Deleted":m.lifecycle==="archived"?"Archived":"Active"}</Copy><MemoryLink memory={m} /></View>;})}
    <Copy>Exact photo matches are advisory. No files are removed automatically.</Copy>{e.snapshot?.data.media.media.filter((p,i,all)=>all.some((other,j)=>j!==i&&other.sha256===p.sha256)).map(p=><MemoryLink key={p.id} memory={e.snapshot!.data.memories.find(m=>m.id===p.cardId)!} />)}
    {e.snapshot?.draft?<Button label="Review unfinished draft and its photos" onPress={()=>router.push("/add")} />:null}<Copy>Permanent cleanup is unavailable in this Development build. Memories and photos remain recoverable.</Copy></>:null}
    {section==="labels"?<LabelManager e={e} />:null}
    {section==="backup"?<>
    <Copy>Back up your memories</Copy><Copy>Full backups include active, archived and recently deleted memories, photos, categories, Spaces, and your unfinished draft. Full backups support all currently permitted collection and draft photos, up to 154 MB.</Copy>
    <Button primary label="Save full backup (with draft and photos)" disabled={e.busy} onPress={()=>void e.run(async store=>{const b=await store.backup();e.setStatus(await writeEngBackup(b));},"")} />
    <Button label="Review limited text backup (photos excluded)" disabled={e.busy} onPress={()=>void e.run(async store=>{const b=await store.backup();setTextReview({snapshot:b.snapshot,token:await store.restoreToken()});},"")} />
    {textReview?<View><Copy>PHOTOS EXCLUDED. Includes {textBackupPreview(textReview.snapshot).included} written-answer memories with lifecycle, labels, notes, source, history and reminders. Omits {textBackupPreview(textReview.snapshot).omitted.length} photo-only saved memories and all {textBackupPreview(textReview.snapshot).savedPhotos} saved / {textBackupPreview(textReview.snapshot).draftPhotos} draft photos. Draft text is retained; it may need a new photo before saving. Use a full backup for complete recovery.</Copy>{textBackupPreview(textReview.snapshot).omitted.map(m=><Copy key={m.id}>Excluded: {m.title} ({m.lifecycle})</Copy>)}<Button primary label="Confirm save limited text backup" disabled={e.busy} onPress={()=>void e.run(async store=>{if(await store.restoreToken()!==textReview.token)throw Error("Collection changed. Review the text backup again.");e.setStatus(await writeEngText(createTextBackup(textReview.snapshot),true));setTextReview(null);},"")} /><Button label="Cancel text backup" onPress={()=>setTextReview(null)} /></View>:null}
    <Copy>Text export is a readable report of all states and draft text. It includes private written metadata and history, excludes photo bytes, and cannot restore a collection. Use a full backup for recovery.</Copy>
    <Button label="Save text report (no photos; not a backup)" disabled={e.busy} onPress={()=>void e.run(async store=>{const b=await store.backup();const text=JSON.stringify({format:"CasitaDex readable text report — not restorable",exportedAt:new Date().toISOString(),memories:b.snapshot.data.memories,spaces:b.snapshot.data.spaces,categories:b.snapshot.data.categories,draft:b.snapshot.draft?{...b.snapshot.draft,photos:b.snapshot.draft.photos.map(p=>({id:p.id,note:"Photo bytes excluded"}))}:null},null,2);e.setStatus(await writeEngText(text));},"")} />
    <Button label="Choose backup to review" disabled={e.busy} onPress={()=>void e.run(async store=>{const backup=await pickEngBackup();setIncoming(backup);setRestoreToken(backup?await store.restoreToken():null);setConflict(null);e.setStatus(backup?"Backup checked. Review before replacing your collection.":"Backup selection canceled. Current data kept.");},"")} />
    {incoming?<>
      <Copy>{incoming.source}</Copy><Copy>{incoming.snapshot.data.memories.length} memories, {incoming.snapshot.data.media.media.length} saved photos, {incoming.snapshot.draft?"1 unfinished draft":"no unfinished draft"}, {incoming.snapshot.draft?.photos.length??0} draft photos.</Copy>
      <Copy>Active: {incoming.snapshot.data.memories.filter(m=>m.lifecycle==="active").length}; Archived: {incoming.snapshot.data.memories.filter(m=>m.lifecycle==="archived").length}; Recently Deleted: {incoming.snapshot.data.memories.filter(m=>m.lifecycle==="recently_deleted").length}.</Copy>
      <Copy>Replacing the collection keeps the current full state as a recoverable previous save.</Copy>
      {e.snapshot?.draft?<>
        <Copy>You already have an unfinished draft. Choose which one to use.</Copy>
        <Button label="Keep current draft" disabled={e.busy} selected={conflict==="keep"} onPress={()=>setConflict("keep")} />
        <Button label="Use backed-up draft (previous state recoverable)" disabled={e.busy} selected={conflict==="incoming"} onPress={()=>setConflict("incoming")} />
      </>:null}
      <Button primary label="Confirm replace with reviewed backup" disabled={e.busy||!!(e.snapshot?.draft&&!conflict)} onPress={()=>void e.run(async store=>{if(!restoreToken)throw Error("Review this backup again");await store.stageRestore(incoming.snapshot,incoming.read,restoreToken);await store.restore(incoming.snapshot,conflict??"incoming",restoreToken);setIncoming(null);},"Full collection restored and verified.")} />
      <Button label="Cancel restore" disabled={e.busy} onPress={()=>{setIncoming(null);e.setStatus("Restore canceled. Your collection and draft are kept.");}} />
    </>:null}
    <Button label="Recover previous full save" disabled={e.busy} onPress={()=>setConfirmRecovery(true)} />
    {confirmRecovery?<><Copy>Replace the current collection and draft with the previous full save? Your current state becomes the recoverable previous save.</Copy>
      <Button label="Confirm full recovery" disabled={e.busy} onPress={()=>void e.run(async store=>{await store.recover();setConfirmRecovery(false);},"Previous full save recovered and verified.")} />
      <Button label="Cancel recovery" onPress={()=>setConfirmRecovery(false)} />
    </>:null}
    </>:null}
    {section==="help"?<><Copy accessibilityRole="header">Help & About</Copy><Copy>CasitaDex Development 0.1.0. Memories and photos stay on this device unless you export or share them. Keep a verified full backup in a second location. Text backups from earlier versions can be reviewed with Choose backup. They cannot contain photos or an unfinished draft.</Copy><Copy>Verification records what you checked against a source. It is not a guarantee of correctness. Editing an answer or its source requires checking again. Archive pauses reminders; Recently Deleted keeps recovery available. Cleanup does not run automatically in this build.</Copy>
    </>:null}{section==="preferences"?<><Copy accessibilityRole="header">Appearance & Accessibility</Copy><Button label="Large text" selected={preferences.large} onPress={()=>preferences.setLarge(!preferences.large)} />
    {(["System","Light","Dark"] as const).map(value=><Button key={value} label={value+" appearance"} selected={preferences.appearance===value} onPress={()=>preferences.setAppearance(value)} />)}
    <Copy>{preferences.preferenceError}</Copy></>:null}<Status text={e.status} />
    {!e.snapshot?<Button label="Reload full collection" disabled={e.busy} onPress={()=>void e.refresh()} />:null}
  </Page>;
}
