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
import {noUpcomingReminderFeedback,queuedReminderFeedback} from "./reminder-feedback";

const CHANNEL="casitadex-reminders-v1";
const OWNER="standalone-v1";
let pending:Promise<string>=Promise.resolve("Ready");

setNotificationHandler({
 handleNotification:async()=>({shouldShowBanner:true,shouldShowList:true,shouldPlaySound:true,shouldSetBadge:false}),
});

const privateBody="Open CasitaDex to view your reminder.";
function bodyFor(alert:{title:string},showTitles:boolean){return showTitles?alert.title:privateBody;}
export async function readTitleBearingReminderCount():Promise<number|null>{
 try{return (await getAllScheduledNotificationsAsync()).filter(r=>r.content.data?.casitaDexType===OWNER&&r.content.body!==privateBody).length;}
 catch{return null;}
}
export type ReminderAlertCoverage={eligible:number;armed:number;through:Record<string,number>;available:boolean};
function matches(r:Awaited<ReturnType<typeof getAllScheduledNotificationsAsync>>[number],alert:ReturnType<typeof planReminderAlerts>[number],showTitles:boolean){
 return r.content.data?.casitaDexKey===alert.key&&r.content.data?.casitaDexReminderId===alert.id&&
 (r.content.data?.casitaDexMemoryId??null)===(alert.memoryId??null)&&r.content.body===bodyFor(alert,showTitles);
}
export async function readReminderAlertCoverage(rows:readonly ReminderForAlert[],showTitles=false):Promise<ReminderAlertCoverage>{
 const eligible=rows.filter(r=>planReminderAlerts([r],Date.now(),1,1).length>0).length;
 try{
  if(!(await getPermissionsAsync()).granted)return {eligible,armed:0,through:{},available:true};
  const owned=(await getAllScheduledNotificationsAsync()).filter(r=>r.content.data?.casitaDexType===OWNER);
  const through:Record<string,number>={};
  for(const alert of planReminderAlerts(rows))if(owned.some(r=>matches(r,alert,showTitles)))through[alert.id]=Math.max(through[alert.id]??0,alert.timestamp);
  return {eligible,armed:Object.keys(through).length,through,available:true};
 }catch{return {eligible,armed:0,through:{},available:false};}
}
async function run(rows:readonly ReminderForAlert[],askPermission:boolean,showTitles:boolean):Promise<string>{
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
  const desired=planReminderAlerts(rows);
  const all=await getAllScheduledNotificationsAsync();
  const owned=all.filter(r=>r.content.data?.casitaDexType===OWNER);
  const retained=new Set<string>();
  // Cancel stale title-bearing alerts, obsolete occurrences and duplicates first.
  // This also avoids exceeding the pending cap while replacing existing requests.
  for(const alert of desired){
   const found=owned.find(r=>matches(r,alert,showTitles)&&!retained.has(r.identifier));
   if(found)retained.add(found.identifier);
  }
  for(const old of owned)if(!retained.has(old.identifier))await cancelScheduledNotificationAsync(old.identifier);
  if(!permission.granted)return "Saved locally. Notifications are off; enable alerts in device settings.";
  for(const alert of desired){
   if(owned.some(r=>retained.has(r.identifier)&&matches(r,alert,showTitles)))continue;
   await scheduleNotificationAsync({
    content:{title:"CasitaDex reminder",body:bodyFor(alert,showTitles),sound:"default",
     data:{casitaDexType:OWNER,casitaDexReminderId:alert.id,casitaDexMemoryId:alert.memoryId??null,casitaDexKey:alert.key}},
    trigger:{type:SchedulableTriggerInputTypes.DATE,date:new Date(alert.timestamp),...(Platform.OS==="android"?{channelId:CHANNEL}:{})},
   });
  }
  const coverage=await readReminderAlertCoverage(rows,showTitles);
  if(!coverage.available)return "Saved locally. Alert coverage could not be checked; reopen Reminders to retry.";
  return coverage.eligible
   ? queuedReminderFeedback(coverage.armed,coverage.eligible)
   : noUpcomingReminderFeedback;
 }catch{
  // Storage mutations are already committed; native alert errors never erase saved records.
  return "Saved locally. Alert scheduling needs attention; reopen Reminders to retry.";
 }
}
export function reconcileReminderNotifications(rows:readonly ReminderForAlert[],askPermission=false,showTitles=false):Promise<string>{
 const next=pending.then(()=>run(rows,askPermission,showTitles),()=>run(rows,askPermission,showTitles));
 pending=next;
 return next;
}
