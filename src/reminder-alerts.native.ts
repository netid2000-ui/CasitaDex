import { Platform } from "react-native";
import { setNotificationHandler } from "expo-notifications/build/NotificationsHandler";
import { setNotificationChannelAsync } from "expo-notifications/build/setNotificationChannelAsync";
import { getPermissionsAsync, requestPermissionsAsync } from "expo-notifications/build/NotificationPermissions";
import { getAllScheduledNotificationsAsync } from "expo-notifications/build/getAllScheduledNotificationsAsync";
import { scheduleNotificationAsync } from "expo-notifications/build/scheduleNotificationAsync";
import { cancelScheduledNotificationAsync } from "expo-notifications/build/cancelScheduledNotificationAsync";
import { SchedulableTriggerInputTypes } from "expo-notifications/build/Notifications.types";
import { AndroidImportance } from "expo-notifications/build/NotificationChannelManager.types";
import { planReminderAlerts, type ReminderForAlert } from "./reminder-alert-plan";

const CHANNEL="casitadex-reminders-v1";
const OWNER="standalone-v1";
let pending:Promise<string>=Promise.resolve("Ready");

setNotificationHandler({
 handleNotification:async()=>({shouldShowBanner:true,shouldShowList:true,shouldPlaySound:true,shouldSetBadge:false}),
});

async function run(rows:readonly ReminderForAlert[],askPermission:boolean):Promise<string>{
 try {
  if(Platform.OS==="android"){
   await setNotificationChannelAsync(CHANNEL,{
    name:"CasitaDex reminders",importance:AndroidImportance.DEFAULT,
    sound:"default",showBadge:false,
   });
  }
  let permission=await getPermissionsAsync();
  if(!permission.granted&&askPermission&&permission.canAskAgain){
   permission=await requestPermissionsAsync();
  }
  if(!permission.granted)return "Saved locally. Notifications are off; enable alerts in device settings.";
  const desired=planReminderAlerts(rows);
  const next=new Map(desired.map(r=>[r.key,r]));
  const all=await getAllScheduledNotificationsAsync();
  const owned=all.filter(r=>r.content.data?.casitaDexType===OWNER);
  const valid=new Set<string>();
  // Schedule replacements before removing stale alerts to avoid a lost-alert window.
  for(const alert of desired){
   const found=owned.find(r=>r.content.data?.casitaDexKey===alert.key&&r.content.body===alert.title&&!valid.has(r.identifier));
   if(found){valid.add(found.identifier);continue;}
   const id=await scheduleNotificationAsync({
    content:{title:"CasitaDex reminder",body:alert.title,sound:"default",
     data:{casitaDexType:OWNER,casitaDexReminderId:alert.id,casitaDexMemoryId:alert.memoryId??null,casitaDexKey:alert.key}},
    trigger:{type:SchedulableTriggerInputTypes.DATE,
     date:new Date(alert.timestamp),...(Platform.OS==="android"?{channelId:CHANNEL}:{})},
   });
   valid.add(id);
  }
  for(const old of owned){
   if(!valid.has(old.identifier)||!next.has(String(old.content.data?.casitaDexKey??""))){
    await cancelScheduledNotificationAsync(old.identifier);
   }
  }
  return desired.length
   ? "Saved locally. Reminder alerts scheduled; device settings may affect timing."
   : "Saved locally. No upcoming reminder alert is due.";
 }catch{
  // Storage mutations are already committed; native alert errors never erase saved records.
  return "Saved locally. Alert scheduling needs attention; reopen Reminders to retry.";
 }
}
export function reconcileReminderNotifications(rows:readonly ReminderForAlert[],askPermission=false):Promise<string>{
 const next=pending.then(()=>run(rows,askPermission),()=>run(rows,askPermission));
 pending=next;
 return next;
}
