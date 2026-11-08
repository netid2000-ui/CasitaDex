import React,{useCallback,useState} from 'react';
import {Alert,ScrollView,Text} from 'react-native';
import {router,useFocusEffect} from 'expo-router';
import {FigmaReminders,type MemoryDueItem} from '../figma-first/FigmaReminders';
import {getEngStore} from '../eng-runtime';
import {listStandaloneReminders,completeStandaloneReminder,deleteStandaloneReminder,type StandaloneReminder} from '../standalone-reminders';
function NativeReminders(){
 const [rows,setRows]=useState<StandaloneReminder[]>([]);
 const [memoryDue,setMemoryDue]=useState<MemoryDueItem[]>([]);
 const [error,setError]=useState('');
 const refresh=useCallback(async()=>{const [reminders,snapshot]=await Promise.all([listStandaloneReminders(),getEngStore().then(store=>store.load())]);setRows(reminders);setMemoryDue(snapshot.data.memories.filter(m=>m.lifecycle==='active'&&!!m.due).map(m=>({id:m.id,title:m.title,due:m.due!})).sort((a,b)=>a.due.localeCompare(b.due)));},[]);
 useFocusEffect(useCallback(()=>{let active=true;refresh().catch(()=>{if(active)setError('Unable to load reminders. Nothing was changed.')});return()=>{active=false}},[refresh]));
 const complete=(id:string,completed=true)=>{void completeStandaloneReminder(id,completed).then(refresh).catch(()=>setError('Reminder could not be completed. Your previous save remains.'))};
 return <ScrollView contentContainerStyle={{flexGrow:1,backgroundColor:'transparent'}}>
 {error?<Text accessibilityLiveRegion='polite'>{error}</Text>:null}
 <FigmaReminders reminders={rows} memoryDue={memoryDue} onSetMemoryReminder={id=>router.push({pathname:'/reminders-manage',params:{mode:'new',memoryId:id}})} onAdd={()=>router.push('/reminders-manage?mode=new')} onEdit={id=>router.push({pathname:'/reminders-manage',params:{id}})} onComplete={complete} onOpenMemory={id=>router.push({pathname:'/card',params:{id}})} onDelete={id=>Alert.alert('Delete reminder?','The reminder will be deleted. Its linked memory will not be changed.',[{text:'Cancel',style:'cancel'},{text:'Delete',style:'destructive',onPress:()=>{void deleteStandaloneReminder(id).then(refresh).catch(()=>setError('Could not delete reminder.'))}}])}/>
 </ScrollView>;
}
export default function Reminders(){return <NativeReminders/>;}