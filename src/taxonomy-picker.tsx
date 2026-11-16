import React,{useState} from "react";
import {Modal,View} from "react-native";
import {SafeAreaProvider,SafeAreaView} from "react-native-safe-area-context";
import {Button,Copy,Field,Page,useTheme} from "./ui";
import {MemoryEditorChoice,MemoryEditorIcon} from "./memory-editor-controls";
import {plusFeatureEnforcementEnabled} from "./plus-entitlement-runtime";
export type PickerChoice={id:string;name:string};
type Props={label:string;noun:string;choices:PickerChoice[];selected:string[];disabled:boolean;multiple?:boolean;scope?:string;initiallyOpen?:boolean;onSelect:(ids:string[])=>void|boolean|Promise<void|boolean>;onCreate:(name:string)=>Promise<string|null>;trigger?:(open:()=>void)=>React.ReactNode};
export function TaxonomyPicker({label,noun,choices,selected,disabled,multiple=false,scope,initiallyOpen=false,onSelect,onCreate,trigger}:Props){
 const {colors}=useTheme();
 const [open,setOpen]=useState(initiallyOpen),[creating,setCreating]=useState(false),[query,setQuery]=useState(""),[name,setName]=useState(""),[busy,setBusy]=useState(false),[error,setError]=useState("");
 const [pending,setPending]=useState<string[]>(selected),[created,setCreated]=useState<PickerChoice[]>([]);
 const options=[...choices,...created.filter(c=>!choices.some(x=>x.id===c.id))];
 const value=selected.map(id=>options.find(c=>c.id===id)?.name??id).join(", ");
 const blocked=busy||disabled;
 function show(){if(blocked)return;setPending([...selected]);setQuery("");setName("");setError("");setCreating(false);setOpen(true);}
 function close(){if(busy)return;setOpen(false);setCreating(false);setName("");setError("");setPending([...selected]);}
 async function apply(ids:string[]){if(blocked)return;setBusy(true);setError("");try{if(await onSelect(ids)===false){setError("Your selection was not saved. Try again.");return;}setOpen(false);setCreating(false);setName("");}catch(e){setError(e instanceof Error?e.message:"Your selection was not saved. Try again.");}finally{setBusy(false);}}
 function choose(id:string|null){if(blocked)return;if(multiple){setPending(id===null?[]:pending.includes(id)?pending.filter(x=>x!==id):[...pending,id]);}else void apply(id===null?[]:[id]);}
 async function create(){if(blocked||!name.trim()||name.trim().length>200)return;setBusy(true);setError("");try{const id=await onCreate(name.trim());if(id===null){setError(noun+" was not created. Check the name and try again.");return;}setCreated([...created.filter(c=>c.id!==id),{id,name:name.trim()}]);if(multiple){setPending([...new Set([...pending,id])]);setCreating(false);setName("");setQuery("");}else{if(await onSelect([id])===false){setError("Created, but not selected. Choose it from the list and try again.");setCreating(false);return;}setOpen(false);setCreating(false);setName("");}}catch(e){setError(e instanceof Error?e.message:"Unable to create "+noun.toLowerCase()+". Your text is kept.");}finally{setBusy(false);}}
 const filtered=options.filter(c=>c.name.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())).sort((a,b)=>a.name.localeCompare(b.name));
 const active=multiple?pending:selected;
 return <>{trigger?trigger(show):<MemoryEditorChoice label={label} value={value||"Choose "+label} expanded={open} disabled={blocked} onPress={show}/>}
 <Modal visible={open} animationType="slide" onRequestClose={close}><SafeAreaProvider><SafeAreaView style={{flex:1,backgroundColor:colors.paper}}><Page independent hideHeading title={label} androidKeyboardAware stickyActions={<View style={{gap:12}}>
 <View style={{flexDirection:"row",flexWrap:"wrap",justifyContent:"space-between",gap:12}}><Button compact editorial variant="quiet" label="Cancel" icon={<MemoryEditorIcon name="cancel"/>} disabled={busy} onPress={close}/>{multiple&&!creating?<Button compact editorial primary label="Done" disabled={blocked} onPress={()=>void apply(pending)}/>:null}</View>
 <Copy kind="section" accessibilityRole="header">{creating?"Create "+noun:"Choose "+label}</Copy>{scope!==undefined?<Copy>Space: {scope}</Copy>:null}
 {creating?<Button compact editorial primary label={"Save "+noun.toLowerCase()} disabled={blocked||!name.trim()||name.trim().length>200} onPress={()=>void create()}/>:<Button compact label={"Create new "+noun} disabled={blocked} onPress={()=>{setName("");setError("");setCreating(true);}}/>}
 {error?<Copy accessibilityLiveRegion="polite">{error}</Copy>:null}
 </View>}>
 {creating?<Field iosTextView={plusFeatureEnforcementEnabled} nativeEditing={plusFeatureEnforcementEnabled} label={noun+" name"} value={name} onChangeText={setName} disabled={blocked}/>:<><Field label={"Search "+(label==="Space"?"spaces":label==="Location"?"locations":"categories")} value={query} onChangeText={setQuery} disabled={blocked}/><Button label="None" selected={!active.length} disabled={blocked} onPress={()=>choose(null)}/>{filtered.map(c=><Button key={c.id} label={c.name} selected={active.includes(c.id)} disabled={blocked} onPress={()=>choose(c.id)}/>)}{!filtered.length?<Copy>{scope!==undefined?"No matching locations in this Space.":"No matching "+(label==="Space"?"spaces":"categories")+"."}</Copy>:null}</>}
 </Page></SafeAreaView></SafeAreaProvider></Modal></>;
}
