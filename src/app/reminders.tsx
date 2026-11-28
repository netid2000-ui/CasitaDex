import {Button} from '../ui';
import React,{useCallback,useRef,useState} from 'react';
import {Alert,View,Text} from 'react-native';
import {router,useFocusEffect,useLocalSearchParams} from 'expo-router';
import {FigmaReminders,type MemoryDueItem} from '../figma-first/FigmaReminders';
import {getEngStore} from '../eng-runtime';
import {listStandaloneReminders,completeStandaloneReminder,deleteStandaloneReminder,getReminderTitlePreference,setReminderTitlePreference,reminderAlertCoverage,refreshStandaloneReminderAlerts,requestStandaloneReminderAlerts,type StandaloneReminder} from '../standalone-reminders';
function NativeReminders(){
 const {origin}=useLocalSearchParams<{origin?:string}>();
 const [rows,setRows]=useState<StandaloneReminder[]>([]);
 const [memoryDue,setMemoryDue]=useState<MemoryDueItem[]>([]);
 const [error,setError]=useState('');
 const [showTitles,setShowTitles]=useState(false),[busy,setBusy]=useState(false);
 const [coverage,setCoverage]=useState<Awaited<ReturnType<typeof reminderAlertCoverage>>|null>(null);
 const refreshGeneration=useRef(0);
 const refresh=useCallback(async()=>{const generation=++refreshGeneration.current;const [reminders,snapshot]=await Promise.all([listStandaloneReminders(false),getEngStore().then(store=>store.load())]);if(generation!==refreshGeneration.current)return;setRows(reminders);setMemoryDue(snapshot.data.memories.filter(m=>m.lifecycle==='active'&&!!m.due).map(m=>({id:m.id,title:m.title,due:m.due!})).sort((a,b)=>a.due.localeCompare(b.due)));setCoverage(null);const preference=await getReminderTitlePreference();if(generation!==refreshGeneration.current)return;setShowTitles(preference);void refreshStandaloneReminderAlerts().then(()=>reminderAlertCoverage(reminders)).then(result=>{if(generation===refreshGeneration.current)setCoverage(result);}).catch(()=>{if(generation===refreshGeneration.current)setError('Alert coverage could not be checked.');});},[]);
 useFocusEffect(useCallback(()=>{let active=true;refresh().catch(()=>{if(active)setError('Unable to load reminders. Nothing was changed.')});return()=>{active=false;refreshGeneration.current++}},[refresh]));
 async function changePrivacy(){if(busy)return;setBusy(true);try{const result=await setReminderTitlePreference(!showTitles);setError(result);await refresh();}catch{setError("Could not update reminder privacy. Review device notification settings.");}finally{setBusy(false);}}
 async function renew(){if(busy)return;setBusy(true);try{setError(await requestStandaloneReminderAlerts());await refresh();}catch{setError("Could not check device alerts.");}finally{setBusy(false);}}
 const complete=(id:string,completed=true)=>{void completeStandaloneReminder(id,completed).then(refresh).catch(()=>setError('Reminder could not be completed. Your previous save remains.'))};
 return <View style={{flex:1,backgroundColor:'transparent'}}>
 {origin==="settings"?<View style={{paddingHorizontal:18,paddingVertical:8}}><Button label="‹ Settings" onPress={()=>router.replace("/more")}/></View>:null}
 {error?<Text accessibilityLiveRegion='polite'>{error}</Text>:null}
 <FigmaReminders reminders={rows} coverage={coverage} showTitles={showTitles} privacyBusy={busy} onToggleTitles={()=>void changePrivacy()} onRenewAlerts={()=>void renew()} memoryDue={memoryDue} onSetMemoryReminder={id=>router.push({pathname:'/reminders-manage',params:{mode:'new',memoryId:id,origin}})} onAdd={()=>router.push({pathname:'/reminders-manage',params:{mode:'new',origin}})} onEdit={id=>router.push({pathname:'/reminders-manage',params:{id,origin}})} onComplete={complete} onOpenMemory={id=>router.push({pathname:'/card',params:{id,origin:'reminders'}})} onDelete={id=>Alert.alert('Delete reminder?','The reminder will be deleted. Its linked memory will not be changed.',[{text:'Cancel',style:'cancel'},{text:'Delete',style:'destructive',onPress:()=>{void deleteStandaloneReminder(id).then(refresh).catch(()=>setError('Could not delete reminder.'))}}])}/>
 </View>;
}
export default function Reminders(){return <NativeReminders/>;}