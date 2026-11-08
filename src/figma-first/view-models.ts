import type {StandaloneReminder} from "../standalone-reminders";
import type {DataV2} from "../sb20-contract";
import {defaultFilter,findMemories,searchIndex} from "../eng-find";
export const homeActions = (_draftPending:boolean) => [{kind:"memory",disabled:false},{kind:"photo",disabled:false},{kind:"reminder",disabled:false}] as const;
export function dueReminders(rows:readonly StandaloneReminder[],_today:string){return rows.filter(r=>!r.completed).slice().sort((a,b)=>a.dueDate.localeCompare(b.dueDate)||a.dueTime.localeCompare(b.dueTime)).slice(0,2)}
export function findResults(data:DataV2,query:string,today:string){return findMemories(searchIndex(data),query,defaultFilter(),today)}
