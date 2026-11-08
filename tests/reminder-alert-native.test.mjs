import test from "node:test";
import assert from "node:assert/strict";
import {registerHooks} from "node:module";
const api={
 'react-native':'export const Platform={OS:"android"};',
 'expo-notifications':`
const x=globalThis.__casitaAlertQA;
export const SchedulableTriggerInputTypes={DATE:"date"};
export const AndroidImportance={DEFAULT:3};
export const setNotificationHandler=()=>{};
export const setNotificationChannelAsync=async()=>{x.channel++};
export const getPermissionsAsync=async()=>({granted:x.granted,canAskAgain:true});
export const requestPermissionsAsync=async()=>{x.prompts++;return {granted:x.granted,canAskAgain:true}};
export const getAllScheduledNotificationsAsync=async()=>x.scheduled;
export const scheduleNotificationAsync=async r=>{const identifier="qa"+(++x.next);x.scheduled.push({...r,identifier});x.created++;return identifier};
export const cancelScheduledNotificationAsync=async id=>{x.scheduled=x.scheduled.filter(x=>x.identifier!==id);x.canceled++};
`,
};
const mockExports=api['expo-notifications'];
for(const name of ['NotificationsHandler','setNotificationChannelAsync','NotificationPermissions','getAllScheduledNotificationsAsync','scheduleNotificationAsync','cancelScheduledNotificationAsync','Notifications.types','NotificationChannelManager.types']){
 const selected=name==='NotificationPermissions'?['getPermissionsAsync','requestPermissionsAsync']:name==='Notifications.types'?['SchedulableTriggerInputTypes']:name==='NotificationChannelManager.types'?['AndroidImportance']:name==='NotificationsHandler'?['setNotificationHandler']:[name];
 api[`expo-notifications/build/${name}`]='const x=globalThis.__casitaAlertQA;\n'+mockExports.split('\n').filter(line=>selected.some(n=>line.includes(`const ${n}=`))).join('\n');
}
const hooks=registerHooks({resolve(s,ctx,next){
 if(api[s])return {url:"data:text/javascript,"+encodeURIComponent(api[s]),shortCircuit:true};
 try{return next(s,ctx)}catch(e){if(s.startsWith("."))return next(s+".ts",ctx);throw e}
}});
const state={granted:false,prompts:0,created:0,canceled:0,channel:0,next:0,scheduled:[]};
globalThis.__casitaAlertQA=state;
const {reconcileReminderNotifications}=await import("../src/reminder-alerts.native.ts");
const date=new Date(Date.now()+3600e3);
const dueDate=[date.getFullYear(),String(date.getMonth()+1).padStart(2,"0"),String(date.getDate()).padStart(2,"0")].join("-");
const dueTime=[String(date.getHours()).padStart(2,"0"),String(date.getMinutes()).padStart(2,"0")].join(":");
const reminder=(name="QA Alert")=>({id:"qa-alert",title:name,dueDate,dueTime,repeat:"once",completed:false});
test("denied permission keeps reminder record intention without scheduling",async()=>{
 const result=await reconcileReminderNotifications([reminder()],true);
 assert.match(result,/Saved locally/);assert.equal(state.created,0);assert.equal(state.prompts,1);
});
test("permission grant schedules one local alert, repeated sync is idempotent",async()=>{
 state.granted=true;await reconcileReminderNotifications([reminder()],false);
 assert.equal(state.scheduled.length,1);assert.equal(state.created,1);
 await reconcileReminderNotifications([reminder()],false);
 assert.equal(state.scheduled.length,1);assert.equal(state.created,1);
});
test("editing replaces obsolete alert, completion cancels its scheduled occurrence",async()=>{
 await reconcileReminderNotifications([reminder("Edited QA Alert")],false);
 assert.equal(state.scheduled.length,1);assert.equal(state.created,2);assert.ok(state.canceled>=1);
 assert.equal(state.scheduled[0].content.body,"Edited QA Alert");
 await reconcileReminderNotifications([reminder("Edited QA Alert"),{...reminder(),completed:true}],false);
 assert.equal(state.scheduled.length,1);
 await reconcileReminderNotifications([{...reminder(),completed:true}],false);
 assert.equal(state.scheduled.length,0);
});
test("unrelated app notifications are never cancelled",async()=>{
 const other={identifier:"other",content:{title:"External",data:{owner:"different"}}};
 state.scheduled=[other];const count=state.canceled;
 await reconcileReminderNotifications([],false);
 assert.equal(state.scheduled.length,1);assert.equal(state.canceled,count);
});
test.after(()=>{hooks.deregister();delete globalThis.__casitaAlertQA});