/** Simplicity A.3: one reminder list, progressive actions; storage stays in the domain adapter. */
import React,{useState} from 'react';
import {Pressable,ScrollView,Text,View,useWindowDimensions} from 'react-native';
import type {StandaloneReminder} from '../standalone-reminders';
import {useFigmaTheme} from './tokens';
import {Button,Copy} from '../ui';
import {useData} from '../state';
const formatReminderDate=(date:string,time:string)=>{
 const parsed=new Date(`${date}T${time}:00`);
 if(Number.isNaN(parsed.getTime()))return `${date} · ${time}`;
 return parsed.toLocaleString(undefined,{month:'short',day:'numeric',year:'numeric',hour:'numeric',minute:'2-digit'});
};
export type MemoryDueItem={id:string;title:string;due:string};
export type FigmaRemindersProps={coverage?:{eligible:number;armed:number;through:Record<string,number>;available:boolean}|null;showTitles?:boolean;privacyBusy?:boolean;onToggleTitles?:()=>void;onRenewAlerts?:()=>void;reminders:readonly StandaloneReminder[];onAdd:()=>void;onEdit:(id:string)=>void;onComplete:(id:string,completed?:boolean)=>void;onOpenMemory?:(id:string)=>void;onDelete?:(id:string)=>void;memoryDue?:readonly MemoryDueItem[];onSetMemoryReminder?:(id:string)=>void};
export function FigmaReminders({coverage,showTitles=false,privacyBusy=false,onToggleTitles,onRenewAlerts,reminders,onAdd,onEdit,onComplete,onOpenMemory,onDelete,memoryDue=[],onSetMemoryReminder}:FigmaRemindersProps){
 const fg=useFigmaTheme();
 const {large}=useData(),{fontScale}=useWindowDimensions();
 const compactHeader=large||fontScale>=1.35;const textScale=large?1.6:1;
 const [tab,setTab]=useState<'upcoming'|'overdue'|'completed'|'memoryDates'>('upcoming');
 const now=new Date();
 const isOverdue=(r:StandaloneReminder)=>new Date(r.dueDate+'T'+r.dueTime+':00').getTime()<now.getTime();
 const [alertSettings,setAlertSettings]=useState(false);
 const [expanded,setExpanded]=useState<string|null>(null);
 const unlinkedMemoryDue=memoryDue.filter(m=>!reminders.some(r=>r.memoryId===m.id));
 const visible=reminders.filter(r=>tab==='completed'?r.completed:tab==='overdue'?!r.completed&&isOverdue(r):tab==='upcoming'?!r.completed&&!isOverdue(r):false).sort((a,b)=>(a.dueDate+'T'+a.dueTime).localeCompare(b.dueDate+'T'+b.dueTime));
 const counts={upcoming:reminders.filter(r=>!r.completed&&!isOverdue(r)).length,overdue:reminders.filter(r=>!r.completed&&isOverdue(r)).length,completed:reminders.filter(r=>r.completed).length,memoryDates:unlinkedMemoryDue.length};
 const labels={upcoming:'Upcoming',overdue:'Overdue',completed:'Completed',memoryDates:'Memory dates'};
 const action=(label:string,run:()=>void,filled=false,selected?:boolean)=> <View style={{maxWidth:"100%"}}><Button compact editorial primary={filled} variant={filled?"tonal":"quiet"} selected={selected} label={label} onPress={run}/></View>;
 return <ScrollView stickyHeaderIndices={compactHeader?[]:[0]} contentContainerStyle={{backgroundColor:fg.page,paddingBottom:24}}><View style={{backgroundColor:fg.page,paddingHorizontal:18,paddingVertical:16,gap:14}}>
  <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:8}}>{action('Add Reminder ›',onAdd)}</View>
  <View style={{flexDirection:'row',flexWrap:'wrap',gap:6}}>{(['upcoming','overdue','completed','memoryDates'] as const).map(value=><View key={value} style={{flexGrow:1,flexBasis:compactHeader?"45%":"22%",minWidth:0}}><Pressable accessibilityRole='button' accessibilityLabel={labels[value]+' ('+counts[value]+')'} accessibilityState={{selected:tab===value}} onPress={()=>{setTab(value);setExpanded(null)}} style={({pressed})=>({flexGrow:1,minHeight:48,paddingHorizontal:7,paddingVertical:9,borderRadius:0,borderWidth:0,borderBottomWidth:tab===value?3:1,borderColor:tab===value?fg.headingInk:fg.secondaryInk,backgroundColor:'transparent',justifyContent:'center',alignItems:'center',opacity:pressed?0.75:1})}><Text style={{fontFamily:'Inter_400Regular',fontSize:12*textScale,textAlign:'center',color:fg.headingInk}}>{labels[value]}{counts[value] > 0 ? ' (' + counts[value] + ')' : ''}</Text></Pressable></View>)}</View>
  </View><View style={{paddingHorizontal:18,gap:10}}>{onToggleTitles?<View style={{gap:8}}><Button compact editorial variant="quiet" label={alertSettings?"Hide alert settings":"Alert settings ›"} onPress={()=>setAlertSettings(v=>!v)}/>{alertSettings?<><Copy>Reminder titles are hidden in notification text by default. Showing titles may expose them on your lock screen.</Copy><Button label={showTitles?"Show notification titles: On":"Show notification titles: Off"} selected={showTitles} disabled={privacyBusy} onPress={onToggleTitles}/><Copy>Alerts are queued for a limited period. Reopen Reminders to renew them; device settings may affect delivery.</Copy>{onRenewAlerts?<Button label="Check device alerts" disabled={privacyBusy} onPress={onRenewAlerts}/>:null}</>:null}{coverage?.available?<Copy kind="small">Alerts queued for {coverage.armed} of {coverage.eligible} eligible reminders.{coverage.armed<coverage.eligible?" Some reminders have no queued alert.":""}</Copy>:<Copy kind="small">Alert coverage not checked.</Copy>}</View>:null}<Copy kind="section">{labels[tab]}</Copy>
  {tab==='memoryDates'&&unlinkedMemoryDue.length>0?<View style={{gap:10}}><Text style={{fontSize:15*textScale,color:fg.secondaryInk}}>These dates belong to saved memories. They are not scheduled notifications or completed reminders.</Text>{unlinkedMemoryDue.map(m=><View key={m.id} style={{padding:16,borderRadius:16,backgroundColor:fg.brandSurface,gap:8}}><Text style={{fontSize:18,fontWeight:'700',color:fg.headingInk}}>{m.title}</Text><Text style={{color:fg.secondaryInk}}>{m.due} · {new Date(m.due+'T23:59:59').getTime()<now.getTime()?'Past date · ':''}Notification not yet set</Text><View style={{flexDirection:'row',flexWrap:'wrap',gap:8}}>{onSetMemoryReminder?action('Set Alert',()=>onSetMemoryReminder(m.id),true):null}{onOpenMemory?action('View Memory',()=>onOpenMemory(m.id)):null}</View></View>)}</View>:null}
  {visible.length===0&&!(tab==='memoryDates'&&unlinkedMemoryDue.length)?<Text style={{color:fg.secondaryInk,paddingVertical:18}}>{tab==='completed'?'No completed reminders.':tab==='overdue'?'No overdue reminders.':tab==='memoryDates'?'No unlinked memory dates.':'No upcoming reminders.'}</Text>:visible.map(r=><View key={r.id} style={{paddingVertical:14,borderBottomWidth:1,borderColor:fg.secondaryInk,gap:10}}>
   <Pressable accessibilityRole="button" accessibilityLabel={'Edit '+r.title} onPress={()=>onEdit(r.id)}><Text style={{fontFamily:'CormorantGaramond_700Bold',fontSize:24*textScale,color:fg.headingInk}}>{r.title}</Text><Text style={{fontSize:15*textScale,color:fg.secondaryInk,marginTop:5}}>{formatReminderDate(r.dueDate,r.dueTime)}{r.repeat==='once'?'':' · '+r.repeat}</Text></Pressable>
   <View style={{flexDirection:"row",flexWrap:"wrap",alignItems:"center",gap:8}}>{tab==="overdue"?<Text accessibilityLabel="Overdue reminder" style={{fontSize:14,fontWeight:"700",color:fg.headingInk}}>● Overdue</Text>:null}{r.memoryId?<Text style={{fontSize:13,color:fg.secondaryInk}}>Linked memory</Text>:null}</View>{!r.completed&&coverage?.available?<Copy kind="small">{coverage.through[r.id]?"Alert queued through "+new Date(coverage.through[r.id]).toLocaleString():"No upcoming alert queued."}</Copy>:null}
   <View style={{flexDirection:'row',flexWrap:'wrap',alignItems:'center',gap:8}}>
    {action(r.completed?'↶ Restore':'✓ Complete',()=>onComplete(r.id,!r.completed))}
    {r.memoryId&&onOpenMemory?action('View Memory',()=>onOpenMemory(r.memoryId!)):null}
    {expanded!==r.id?action('More ···',()=>setExpanded(r.id)):null}
   </View>
   {expanded===r.id?<View style={{flexDirection:'row',flexWrap:'wrap',gap:8}}>{action('Edit ›',()=>onEdit(r.id))}{onDelete?action('Delete',()=>onDelete(r.id)):null}{action('Less ↑',()=>setExpanded(null))}</View>:null}
  </View>)}
 </View></ScrollView>;
}
