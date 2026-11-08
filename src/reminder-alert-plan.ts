import { nextReminderDay, validReminderDay, type RepeatSchedule } from "./reminder-recurrence.ts";

/** Local wall-clock schedules, with the same month-end clamp as saved reminders. */
export type ReminderForAlert = {
 id:string; title:string; memoryId?:string|null; dueDate:string; dueTime:string;
 repeat:RepeatSchedule; completed:boolean;
};
export type PlannedReminderAlert={id:string;key:string;timestamp:number;title:string;memoryId?:string|null};
function localDate(day:string,time:string):Date|null {
 if(!validReminderDay(day)||!/^([01]\d|2[0-3]):[0-5]\d$/.test(time))return null;
 const [y,m,d]=day.split("-").map(Number);
 const [hour,minute]=time.split(":").map(Number);
 const at=new Date(y,m-1,d,hour,minute,0,0);
 // DST gaps roll forward using native local-calendar interpretation.
 return Number.isFinite(at.getTime())?at:null;
}
export function planReminderAlerts(rows:readonly ReminderForAlert[],now=Date.now(),cap=48,perReminder=6):PlannedReminderAlert[]{
 const out:PlannedReminderAlert[]=[];
 for(const r of rows){
  if(r.completed||!r.title.trim()||!validReminderDay(r.dueDate))continue;
  let day=r.dueDate;
  const anchor=Number(day.slice(-2));
  for(let i=0,created=0;i<30000&&created<perReminder;i++){
   const at=localDate(day,r.dueTime);
   if(!at)break;
   const timestamp=at.getTime();
   if(timestamp>now+5000){
    out.push({id:r.id,key:r.id+"@"+timestamp,timestamp,title:r.title.trim(),memoryId:r.memoryId});
    created++;
   }
   if(r.repeat==="once")break;
   const next=nextReminderDay(day,r.repeat,anchor);
   if(!next||next===day)break;
   day=next;
  }
 }
 return out.sort((a,b)=>a.timestamp-b.timestamp||a.key.localeCompare(b.key)).slice(0,Math.max(0,Math.min(48,cap)));
}
