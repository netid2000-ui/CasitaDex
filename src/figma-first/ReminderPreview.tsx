/** Read-only reminder preview for the Figma-first Home. */
import React from 'react';
import {Text,View} from 'react-native';
import type {StandaloneReminder} from '../standalone-reminders';
import {dueReminders} from './view-models';
import {useFigmaTheme} from './tokens';
export type ReminderPreviewProps={reminders:readonly StandaloneReminder[];today:string};
export function ReminderPreview({reminders,today}:ReminderPreviewProps){
 const fg=useFigmaTheme();
 const due=dueReminders(reminders,today);
 return <View style={{gap:8}}>
  <Text accessibilityRole="header" style={{fontSize:18,fontWeight:'700',color:fg.headingInk}}>Reminders</Text>
  {due.length===0?<Text style={{color:fg.secondaryInk}}>No upcoming reminders.</Text>:due.map(r=><View key={r.id} style={{padding:12,backgroundColor:fg.brandSurface,borderRadius:12}}><Text style={{fontWeight:'700',color:fg.headingInk}}>{r.title}</Text><Text style={{color:fg.secondaryInk}}>{r.dueDate} {r.dueTime}</Text></View>)}
 </View>;
}
