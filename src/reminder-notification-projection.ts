import { reminderLocalTimestamp, validReminderDay } from "./reminder-recurrence.ts";
import type { MemoryV2 } from "./sb20-contract.ts";
export type LinkedNotificationMemory=Pick<MemoryV2,"id"|"title"|"due"|"lifecycle"|"demo">;
export type StandaloneNotificationReminder={id:string;title:string;dueDate:string;dueTime:string;completed:boolean};
export type ReminderNotification={identifier:string;kind:"memory"|"standalone";sourceId:string;title:string;at:number};
export const LINKED_REMINDER_TIME = "09:00";
export const REMINDER_NOTIFICATION_PREFIX="casitadex:unified-reminder-v1:";

export function listLinkedReminderMemories<T extends LinkedNotificationMemory>(
  memories: readonly T[],
): (T & { due: string })[] {
  return memories
    .filter((memory): memory is T & { due: string } =>
      memory.lifecycle === "active" && !memory.demo &&
      typeof memory.due === "string" && validReminderDay(memory.due),
    )
    .sort((a, b) => a.due.localeCompare(b.due) || a.id.localeCompare(b.id));
}
/** Pure local-calendar projection. Caller must select the linked time and platform capacity policy.
 * Recurrence is already advanced by persistence; notifications are single occurrences.
 * Invalid/nonexistent local times are excluded. An overdue occurrence is kept only while its original native alarm is pending. */
export function projectReminderNotifications(memories:readonly LinkedNotificationMemory[],standalone:readonly StandaloneNotificationReminder[],
 options:{now:number;linkedDueTime:string;limit:number;pendingTimes?:ReadonlyMap<string,number>}):ReminderNotification[]{
 if(!Number.isFinite(options.now)||!Number.isInteger(options.limit)||options.limit<0)throw Error("Invalid reminder projection options");
 const output:ReminderNotification[]=[];
 const ids=new Set<string>();
 function add(kind:"memory"|"standalone",id:string,title:string,day:string|undefined,time:string){
  if (!id || !title.trim() || !day) return;
  const at = reminderLocalTimestamp(day, time);
  if (at === null) return;
  const identifier=REMINDER_NOTIFICATION_PREFIX+kind+":"+encodeURIComponent(id);
  if(at<=options.now&&options.pendingTimes?.get(identifier)!==at)return;
  if(ids.has(identifier))throw Error("Duplicate reminder identity");
  ids.add(identifier);output.push({identifier,kind,sourceId:id,title,at});
 }
 for(const memory of listLinkedReminderMemories(memories))add("memory",memory.id,memory.title,memory.due,options.linkedDueTime);
 for(const reminder of standalone)if(!reminder.completed)add("standalone",reminder.id,reminder.title,reminder.dueDate,reminder.dueTime);
 return output.sort((a,b)=>a.at-b.at||a.identifier.localeCompare(b.identifier)).slice(0,options.limit);
}
/** Adapter must supply only previously scheduled request metadata; unrelated notifications survive.
 * Cancel before schedule. Retry against refreshed OS state after any partial native failure. */
export function reconcileReminderNotificationProjection(previous:readonly ReminderNotification[],desired:readonly ReminderNotification[]){
 const wanted=new Map<string,ReminderNotification>();
 for(const item of desired){
  if(!item.identifier.startsWith(REMINDER_NOTIFICATION_PREFIX)||wanted.has(item.identifier))throw Error("Invalid desired reminder ownership");
  wanted.set(item.identifier,item);
 }
 const owned=previous.filter(item=>item.identifier.startsWith(REMINDER_NOTIFICATION_PREFIX));
 const same=(a:ReminderNotification,b:ReminderNotification)=>a.at===b.at&&a.title===b.title&&a.sourceId===b.sourceId&&a.kind===b.kind;
 const cancel=owned.filter(item=>!wanted.has(item.identifier)||!same(item,wanted.get(item.identifier)!)).map(item=>item.identifier);
 const schedule=desired.filter(item=>!owned.some(old=>old.identifier===item.identifier&&same(old,item)));
 return {cancel:[...new Set(cancel)],schedule};
}
