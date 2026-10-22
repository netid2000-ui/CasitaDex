import type { RepeatSchedule } from "./reminder-recurrence";
export type StandaloneReminder={id:string;title:string;notes:string;dueDate:string;dueTime:string;repeat:RepeatSchedule;completed:boolean;createdAt:string;updatedAt:string};
export async function listStandaloneReminders():Promise<StandaloneReminder[]>{return [];}
export async function saveStandaloneReminder(_input:{id?:string;title:string;notes:string;dueDate:string;dueTime:string;repeat:RepeatSchedule}):Promise<void>{throw Error("Reminders require the native app.");}
export async function completeStandaloneReminder(_id:string,_completed:boolean):Promise<void>{throw Error("Reminders require the native app.");}
export async function deleteStandaloneReminder(_id:string):Promise<void>{throw Error("Reminders require the native app.");}