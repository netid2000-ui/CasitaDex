import {validReminderDay, type RepeatSchedule} from "./reminder-recurrence.ts";
export type ReminderBackupRow={id:string;title:string;notes:string;dueDate:string;dueTime:string;repeat:RepeatSchedule;anchorDay:number;completed:boolean;createdAt:string;updatedAt:string};
export type ReminderBackupSection={version:1;rows:ReminderBackupRow[]};
export function validateReminderBackupSection(input:unknown):ReminderBackupSection {
 if(!input||typeof input!=="object"||Array.isArray(input))throw Error("Invalid reminder backup section");
 const section=input as Record<string,unknown>;
 if(section.version!==1||!Array.isArray(section.rows)||section.rows.length>10000)throw Error("Unsupported reminder backup section");
 const ids=new Set<string>();const rows:ReminderBackupRow[]=[];
 for(const value of section.rows){
  if(!value||typeof value!=="object"||Array.isArray(value))throw Error("Invalid reminder record");
  const r=value as Record<string,unknown>;
  if(typeof r.id!=="string"||!/^r_[a-z0-9_]{3,90}$/.test(r.id)||ids.has(r.id))throw Error("Invalid or duplicate reminder ID");
  ids.add(r.id);
  if(typeof r.title!=="string"||!r.title.trim()||r.title.length>200||typeof r.notes!=="string"||r.notes.length>4000)throw Error("Invalid reminder content");
  if(typeof r.dueDate!=="string"||!validReminderDay(r.dueDate)||typeof r.dueTime!=="string"||!/^([01]\d|2[0-3]):[0-5]\d$/.test(r.dueTime))throw Error("Invalid reminder date or time");
  if(typeof r.repeat!=="string"||!["once","daily","weekly","monthly","yearly"].includes(r.repeat)||!Number.isInteger(r.anchorDay)||Number(r.anchorDay)<1||Number(r.anchorDay)>31||typeof r.completed!=="boolean")throw Error("Invalid reminder schedule");
  if(typeof r.createdAt!=="string"||typeof r.updatedAt!=="string"||!Number.isFinite(Date.parse(r.createdAt))||!Number.isFinite(Date.parse(r.updatedAt)))throw Error("Invalid reminder timestamps");
  rows.push(r as unknown as ReminderBackupRow);
 }
 return {version:1,rows};
}

export function encodeReminderBackupSection(input:unknown):Uint8Array {
 const section=validateReminderBackupSection(input);
 const bytes=new TextEncoder().encode(JSON.stringify(section));
 if(bytes.length>5_000_000)throw Error("Reminder backup section exceeds limit");
 return bytes;
}
export function decodeReminderBackupSection(bytes:Uint8Array):ReminderBackupSection {
 if(!(bytes instanceof Uint8Array)||bytes.length>5_000_000)throw Error("Reminder backup section exceeds limit");
 return validateReminderBackupSection(JSON.parse(new TextDecoder("utf-8",{fatal:true}).decode(bytes)));
}

export function reminderBackupPreview(input:unknown){
 const section=validateReminderBackupSection(input);
 return {total:section.rows.length,active:section.rows.filter(r=>!r.completed).length,completed:section.rows.filter(r=>r.completed).length,recurring:section.rows.filter(r=>r.repeat!=="once").length};
}

/** Explicit non-destructive restore preflight; rejects ID collisions before any write. */
export function preflightReminderRestore(incoming:unknown,current:unknown){
 const next=validateReminderBackupSection(incoming),existing=validateReminderBackupSection(current);
 const oldIds=new Set(existing.rows.map(r=>r.id));
 const collisions=next.rows.filter(r=>oldIds.has(r.id)).map(r=>r.id);
 return {incoming:next.rows.length,existing:existing.rows.length,collisions,requiresExplicitReplacement:existing.rows.length>0};
}
