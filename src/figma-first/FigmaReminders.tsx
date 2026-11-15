/** Simplicity A.3: one reminder list, progressive actions; storage stays in the domain adapter. */
import React,{useState} from 'react';
import {Pressable,ScrollView,Text,View} from 'react-native';
import type {StandaloneReminder} from '../standalone-reminders';
import {useFigmaTheme} from './tokens';
import {Copy} from '../ui';
import {router} from 'expo-router';
const formatReminderDate=(date:string,time:string)=>{
 const parsed=new Date(`${date}T${time}:00`);
 if(Number.isNaN(parsed.getTime()))return `${date} · ${time}`;
 return parsed.toLocaleString(undefined,{month:'short',day:'numeric',year:'numeric',hour:'numeric',minute:'2-digit'});
};
export type MemoryDueItem={id:string;title:string;due:string};
export type FigmaRemindersProps={reminders:readonly StandaloneReminder[];onAdd:()=>void;onEdit:(id:string)=>void;onComplete:(id:string,completed?:boolean)=>void;onOpenMemory?:(id:string)=>void;onDelete?:(id:string)=>void;memoryDue?:readonly MemoryDueItem[];onSetMemoryReminder?:(id:string)=>void};
export function FigmaReminders({reminders,onAdd,onEdit,onComplete,onOpenMemory,onDelete,memoryDue=[],onSetMemoryReminder}:FigmaRemindersProps){
 const fg=useFigmaTheme();
 const [tab,setTab]=useState<'upcoming'|'overdue'|'completed'|'memoryDates'>('upcoming');
 const now=new Date();
 const isOverdue=(r:StandaloneReminder)=>new Date(r.dueDate+'T'+r.dueTime+':00').getTime()<now.getTime();
 const [expanded,setExpanded]=useState<string|null>(null);
 const unlinkedMemoryDue=memoryDue.filter(m=>!reminders.some(r=>r.memoryId===m.id));
 const visible=reminders.filter(r=>tab==='completed'?r.completed:tab==='overdue'?!r.completed&&isOverdue(r):tab==='upcoming'?!r.completed&&!isOverdue(r):false).sort((a,b)=>(a.dueDate+'T'+a.dueTime).localeCompare(b.dueDate+'T'+b.dueTime));
 const counts={upcoming:reminders.filter(r=>!r.completed&&!isOverdue(r)).length,overdue:reminders.filter(r=>!r.completed&&isOverdue(r)).length,completed:reminders.filter(r=>r.completed).length,memoryDates:unlinkedMemoryDue.length};
 const labels={upcoming:'Upcoming',overdue:'Overdue',completed:'Completed',memoryDates:'Memory dates'};
 const action=(label:string,run:()=>void,filled=false,selected?:boolean)=> <Pressable accessibilityRole="button" accessibilityLabel={label} accessibilityState={selected===undefined?undefined:{selected}} onPress={run} style={({pressed})=>({minHeight:44,paddingHorizontal:14,paddingVertical:10,borderRadius:8,backgroundColor:filled?fg.actionSurface:fg.page,justifyContent:'center',opacity:pressed?0.75:1})}><Text style={{fontFamily:'Inter_400Regular',fontSize:14,color:filled?fg.actionInk:fg.headingInk}}>{label}</Text></Pressable>;
 return <ScrollView stickyHeaderIndices={[0]} contentContainerStyle={{backgroundColor:fg.page,paddingBottom:24}}><View style={{backgroundColor:fg.page,paddingHorizontal:18,paddingVertical:16,gap:14}}><Pressable accessibilityRole="button" accessibilityLabel="CasitaDex logo, go to Home" onPress={()=>router.navigate("/")} style={{minHeight:44,justifyContent:"center"}}><Copy kind="section">CasitaDex</Copy></Pressable>
  <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:8}}><Copy kind="title">Reminders</Copy>{action('Add Reminder ›',onAdd,true)}</View>
  <View style={{flexDirection:'row',flexWrap:'wrap',gap:6}}>{(['upcoming','overdue','completed','memoryDates'] as const).map(value=><View key={value} style={{flexGrow:1}}><Pressable accessibilityRole='button' accessibilityLabel={labels[value]+' ('+counts[value]+')'} accessibilityState={{selected:tab===value}} onPress={()=>{setTab(value);setExpanded(null)}} style={({pressed})=>({minHeight:44,paddingHorizontal:7,paddingVertical:9,borderRadius:8,borderWidth:1,borderColor:fg.secondaryInk,backgroundColor:tab===value?fg.actionSurface:'transparent',justifyContent:'center',alignItems:'center',opacity:pressed?0.75:1})}><Text numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.8} style={{fontFamily:'Inter_400Regular',fontSize:12,color:tab===value?fg.actionInk:fg.headingInk}}>{labels[value]}</Text></Pressable></View>)}</View>
  </View><View style={{paddingHorizontal:18,gap:10}}><Copy kind="section">{labels[tab]}</Copy>
  {tab==='memoryDates'&&unlinkedMemoryDue.length>0?<View style={{gap:10}}><Text style={{fontSize:15,color:fg.secondaryInk}}>These dates belong to saved memories. They are not scheduled notifications or completed reminders.</Text>{unlinkedMemoryDue.map(m=><View key={m.id} style={{padding:16,borderRadius:16,backgroundColor:fg.brandSurface,gap:8}}><Text style={{fontSize:18,fontWeight:'700',color:fg.headingInk}}>{m.title}</Text><Text style={{color:fg.secondaryInk}}>{m.due} · {new Date(m.due+'T23:59:59').getTime()<now.getTime()?'Past date · ':''}Notification not yet set</Text><View style={{flexDirection:'row',flexWrap:'wrap',gap:8}}>{onSetMemoryReminder?action('Set Alert',()=>onSetMemoryReminder(m.id),true):null}{onOpenMemory?action('View Memory',()=>onOpenMemory(m.id)):null}</View></View>)}</View>:null}
  {visible.length===0&&!(tab==='memoryDates'&&unlinkedMemoryDue.length)?<Text style={{color:fg.secondaryInk,paddingVertical:18}}>{tab==='completed'?'No completed reminders.':tab==='overdue'?'No overdue reminders.':tab==='memoryDates'?'No unlinked memory dates.':'No upcoming reminders.'}</Text>:visible.map(r=><View key={r.id} style={{paddingVertical:14,borderBottomWidth:1,borderColor:fg.secondaryInk,gap:10}}>
   <Pressable accessibilityRole="button" accessibilityLabel={'Edit '+r.title} onPress={()=>onEdit(r.id)}><Text style={{fontFamily:'CormorantGaramond_700Bold',fontSize:24,color:fg.headingInk}}>{r.title}</Text><Text style={{fontSize:15,color:fg.secondaryInk,marginTop:5}}>{formatReminderDate(r.dueDate,r.dueTime)}{r.repeat==='once'?'':' · '+r.repeat}</Text></Pressable>
   <View style={{flexDirection:"row",flexWrap:"wrap",alignItems:"center",gap:8}}>{tab==="overdue"?<Text accessibilityLabel="Overdue reminder" style={{fontSize:14,fontWeight:"700",color:fg.headingInk}}>● Overdue</Text>:null}{r.memoryId?<Text style={{fontSize:13,color:fg.secondaryInk}}>Linked memory</Text>:null}</View>
   <View style={{flexDirection:'row',flexWrap:'wrap',alignItems:'center',gap:8}}>
    {action(r.completed?'↶ Restore':'✓ Complete',()=>onComplete(r.id,!r.completed))}
    {r.memoryId&&onOpenMemory?action('View Memory',()=>onOpenMemory(r.memoryId!)):null}
    {expanded!==r.id?action('More ···',()=>setExpanded(r.id)):null}
   </View>
   {expanded===r.id?<View style={{flexDirection:'row',flexWrap:'wrap',gap:8}}>{action('Edit',()=>onEdit(r.id))}{onDelete?action('Delete',()=>onDelete(r.id)):null}{action('Less ↑',()=>setExpanded(null))}</View>:null}
  </View>)}
 </View></ScrollView>;
}
