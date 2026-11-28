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
/** Show the effective local time when the native calendar skips a wall-clock time. */
export function reminderWallClockAdjustment(day:string,time:string):string|null {
 const at=localDate(day,time);if(!at)return null;
 const actual=[String(at.getHours()).padStart(2,"0"),String(at.getMinutes()).padStart(2,"0")].join(":");
 return actual!==time?`This local time is skipped by a clock change. The alert is scheduled for ${actual} instead.`:null;
}
export function planReminderAlerts(rows:readonly ReminderForAlert[],now=Date.now(),cap=48,perReminder=6):PlannedReminderAlert[]{
 const groups:PlannedReminderAlert[][]=[];
 for(const r of rows){
  if(r.completed||!r.title.trim()||!validReminderDay(r.dueDate))continue;
  const out:PlannedReminderAlert[]=[];
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
  if(out.length)groups.push(out);
 }
 const compare=(a:PlannedReminderAlert,b:PlannedReminderAlert)=>a.timestamp-b.timestamp||a.key.localeCompare(b.key);
 // Allocate one next occurrence per eligible reminder before allocating extra occurrences.
 const result:PlannedReminderAlert[]=[];const limit=Math.max(0,Math.min(48,cap));
 for(let round=0;round<perReminder&&result.length<limit;round++){
  const candidates=groups.flatMap(group=>group[round]?[group[round]]:[]).sort(compare);
  result.push(...candidates.slice(0,limit-result.length));
 }
 return result.sort(compare);
}
