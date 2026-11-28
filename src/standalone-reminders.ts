import type { RepeatSchedule } from "./reminder-recurrence";
export type StandaloneReminder={id:string;title:string;notes:string;memoryId?:string|null;dueDate:string;dueTime:string;repeat:RepeatSchedule;completed:boolean;createdAt:string;updatedAt:string};
export async function listStandaloneReminders():Promise<StandaloneReminder[]>{return [];}
export async function saveStandaloneReminder(_input:{id?:string;title:string;notes:string;memoryId?:string|null;dueDate:string;dueTime:string;repeat:RepeatSchedule}):Promise<void>{throw Error("Reminders require the native app.");}
export async function completeStandaloneReminder(_id:string,_completed:boolean):Promise<void>{throw Error("Reminders require the native app.");}
export async function deleteStandaloneReminder(_id:string):Promise<void>{throw Error("Reminders require the native app.");}export async function requestStandaloneReminderAlerts():Promise<string>{throw Error("Device alerts require the native app.");}

export async function getReminderTitlePreference(){return false;}
export async function setReminderTitlePreference(_show:boolean):Promise<string>{throw Error("Device alerts require the native app.");}
export async function reminderAlertCoverage(_rows:readonly StandaloneReminder[]){return {eligible:0,armed:0,through:{} as Record<string,number>,available:false};}
