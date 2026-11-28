import {Button} from '../ui';
import React,{useCallback,useRef,useState} from 'react';
import {AccessibilityInfo,Alert,Platform,View} from 'react-native';
import {router,useFocusEffect,useLocalSearchParams} from 'expo-router';
import {FigmaReminders,type MemoryDueItem} from '../figma-first/FigmaReminders';
import {getEngStore} from '../eng-runtime';
import {runReminderFeedbackAction} from '../reminder-feedback';
import {listStandaloneReminders,completeStandaloneReminder,deleteStandaloneReminder,getReminderTitlePreference,setReminderTitlePreference,reminderAlertCoverage,refreshStandaloneReminderAlerts,requestStandaloneReminderAlerts,type StandaloneReminder} from '../standalone-reminders';
function NativeReminders(){
 const {origin}=useLocalSearchParams<{origin?:string}>();
 const [rows,setRows]=useState<StandaloneReminder[]>([]);
 const [memoryDue,setMemoryDue]=useState<MemoryDueItem[]>([]);
 const [error,setError]=useState(''),[status,setStatus]=useState('');
 const focused=useRef(false),actionLock=useRef(false);
 const reportError=useCallback((message:string)=>{setError(message);if(message&&focused.current&&Platform.OS==='ios'){try{AccessibilityInfo.announceForAccessibilityWithOptions(message,{queue:true});}catch{/* Feedback remains visible if announcement is unavailable. */}}},[]);
 const reportStatus=useCallback((message:string)=>{setStatus(message);if(message&&focused.current&&Platform.OS==='ios'){try{AccessibilityInfo.announceForAccessibilityWithOptions(message,{queue:true});}catch{/* Feedback remains visible if announcement is unavailable. */}}},[]);
 const [showTitles,setShowTitles]=useState(false),[busy,setBusy]=useState(false);
 const [coverage,setCoverage]=useState<Awaited<ReturnType<typeof reminderAlertCoverage>>|null>(null);
 const refreshGeneration=useRef(0);
 const refresh=useCallback(async()=>{const generation=++refreshGeneration.current;const [reminders,snapshot]=await Promise.all([listStandaloneReminders(false),getEngStore().then(store=>store.load())]);if(generation!==refreshGeneration.current)return;setRows(reminders);setMemoryDue(snapshot.data.memories.filter(m=>m.lifecycle==='active'&&!!m.due).map(m=>({id:m.id,title:m.title,due:m.due!})).sort((a,b)=>a.due.localeCompare(b.due)));setCoverage(null);const preference=await getReminderTitlePreference();if(generation!==refreshGeneration.current)return;setShowTitles(preference);void refreshStandaloneReminderAlerts().then(()=>reminderAlertCoverage(reminders)).then(result=>{if(generation===refreshGeneration.current)setCoverage(result);}).catch(()=>{if(generation===refreshGeneration.current)reportError('Alert coverage could not be checked.');});},[reportError]);
 useFocusEffect(useCallback(()=>{let active=true;focused.current=true;refresh().catch(()=>{if(active)reportError('Unable to load reminders. Nothing was changed.')});return()=>{active=false;focused.current=false;refreshGeneration.current++}},[refresh,reportError]));
 async function act(action:()=>Promise<string|void>,success:string,actionError:string){
  if(actionLock.current)return;
  actionLock.current=true;setBusy(true);
  try{await runReminderFeedbackAction(action,refresh,reportStatus,reportError,{success,actionError,refreshError:'The action finished, but the reminder list could not be refreshed. Reopen Reminders to check.'});}
  finally{actionLock.current=false;setBusy(false);}
 }
 const changePrivacy=()=>act(()=>setReminderTitlePreference(!showTitles),'Reminder privacy updated.','Could not update reminder privacy. Review device notification settings.');
 const renew=()=>act(requestStandaloneReminderAlerts,'Device alerts checked.','Could not check device alerts.');
 const complete=(id:string,completed=true)=>{void act(()=>completeStandaloneReminder(id,completed),'Reminder saved locally.','Reminder could not be changed. Review the saved reminder before retrying.');};
 return <View style={{flex:1,backgroundColor:'transparent'}}>
 {origin==="settings"?<View style={{paddingHorizontal:18,paddingVertical:8}}><Button label="‹ Settings" onPress={()=>router.replace("/more")}/></View>:null}
 <FigmaReminders status={status} error={error} reminders={rows} coverage={coverage} showTitles={showTitles} privacyBusy={busy} onToggleTitles={()=>void changePrivacy()} onRenewAlerts={()=>void renew()} memoryDue={memoryDue} onSetMemoryReminder={id=>router.push({pathname:'/reminders-manage',params:{mode:'new',memoryId:id,origin}})} onAdd={()=>router.push({pathname:'/reminders-manage',params:{mode:'new',origin}})} onEdit={id=>router.push({pathname:'/reminders-manage',params:{id,origin}})} onComplete={complete} onOpenMemory={id=>router.push({pathname:'/card',params:{id,origin:'reminders'}})} onDelete={id=>Alert.alert('Delete reminder?','The reminder will be deleted. Its linked memory will not be changed.',[{text:'Cancel',style:'cancel'},{text:'Delete',style:'destructive',onPress:()=>{void act(()=>deleteStandaloneReminder(id),'Reminder deleted locally.','Could not delete reminder. Review the saved reminder before retrying.')}}])}/>
 </View>;
}
export default function Reminders(){return <NativeReminders/>;}