import { notifyReminderChanges } from "./reminder-notification-changes";
import { nextReminderDay, reminderLocalTimestamp, validReminderDay, type RepeatSchedule } from "./reminder-recurrence";
import { openDatabaseAsync } from "expo-sqlite";
export type StandaloneReminder={id:string;title:string;notes:string;dueDate:string;dueTime:string;repeat:RepeatSchedule;completed:boolean;createdAt:string;updatedAt:string};
let database:ReturnType<typeof openDatabaseAsync>|undefined;
async function initialize(){
 const d=await openDatabaseAsync("casitadex-development-v1.db");
 await d.execAsync("CREATE TABLE IF NOT EXISTS standalone_reminders_v1 (id TEXT PRIMARY KEY,title TEXT NOT NULL,notes TEXT NOT NULL,due_date TEXT NOT NULL,completed INTEGER NOT NULL DEFAULT 0,created_at TEXT NOT NULL,updated_at TEXT NOT NULL)");
 const columns=await d.getAllAsync<{name:string}>("PRAGMA table_info(standalone_reminders_v1)");
 if(!columns.some(c=>c.name==="due_time"))await d.execAsync("ALTER TABLE standalone_reminders_v1 ADD COLUMN due_time TEXT NOT NULL DEFAULT '09:00'");
 if(!columns.some(c=>c.name==="anchor_day"))await d.execAsync("ALTER TABLE standalone_reminders_v1 ADD COLUMN anchor_day INTEGER NOT NULL DEFAULT 0");
 if(!columns.some(c=>c.name==="repeat"))await d.execAsync("ALTER TABLE standalone_reminders_v1 ADD COLUMN repeat TEXT NOT NULL DEFAULT 'once'");
 return d;
}
function db(){
 database??=initialize().catch(error=>{database=undefined;throw error;});
 return database;
}
function valid(title:string,notes:string,date:string){
 if(!title.trim()||title.length>200||notes.length>4000)throw Error("Enter a title (up to 200 characters) and notes (up to 4000 characters).");
 if(!validReminderDay(date))throw Error("Enter a valid date as YYYY-MM-DD.");
}
export async function listStandaloneReminders():Promise<StandaloneReminder[]>{
 const d=await db();
 const rows=await d.getAllAsync<{id:string;title:string;notes:string;due_date:string;due_time:string;repeat:string;anchor_day:number;completed:number;created_at:string;updated_at:string}>("SELECT * FROM standalone_reminders_v1 ORDER BY completed ASC,due_date ASC,created_at DESC");
 return rows.map(r=>({id:r.id,title:r.title,notes:r.notes,dueDate:r.due_date,dueTime:r.due_time,repeat:r.repeat as RepeatSchedule,completed:r.completed===1,createdAt:r.created_at,updatedAt:r.updated_at}));
}
export async function saveStandaloneReminder(input:{id?:string;title:string;notes:string;dueDate:string;dueTime:string;repeat:RepeatSchedule}){
 valid(input.title,input.notes,input.dueDate);
 if(!/^([01]\d|2[0-3]):[0-5]\d$/.test(input.dueTime))throw Error("Select a valid time.");
 if (reminderLocalTimestamp(input.dueDate, input.dueTime) === null) {
  throw Error("That time does not occur on the selected date in your device time zone. Choose another time.");
 }
 if(!["once","daily","weekly","monthly","yearly"].includes(input.repeat))throw Error("Invalid repeat schedule.");
 const d=await db(),now=new Date().toISOString();
 if(input.id){
  const result=await d.runAsync("UPDATE standalone_reminders_v1 SET title=?,notes=?,due_date=?,due_time=?,repeat=?,anchor_day=?,updated_at=? WHERE id=?",input.title.trim(),input.notes,input.dueDate,input.dueTime,input.repeat,Number(input.dueDate.slice(-2)),now,input.id);
  if(result.changes!==1)throw Error("Reminder no longer exists.");
 }else{
  await d.runAsync("INSERT INTO standalone_reminders_v1 (id,title,notes,due_date,due_time,repeat,anchor_day,completed,created_at,updated_at) VALUES (?,?,?,?,?,?,?,0,?,?)","r_"+Date.now().toString(36)+"_"+Math.random().toString(36).slice(2,10),input.title.trim(),input.notes,input.dueDate,input.dueTime,input.repeat,Number(input.dueDate.slice(-2)),now,now);
 }
 notifyReminderChanges();
}
export async function completeStandaloneReminder(id:string,completed:boolean){
 const d=await db(),now=new Date().toISOString();
 const row=await d.getFirstAsync<{due_date:string;repeat:string;anchor_day:number}>("SELECT due_date,repeat,anchor_day FROM standalone_reminders_v1 WHERE id=?",id);
 if(!row)throw Error("Reminder no longer exists.");
 const next=completed?nextReminderDay(row.due_date,row.repeat as RepeatSchedule,row.anchor_day||undefined):null;
 const result=next
  ?await d.runAsync("UPDATE standalone_reminders_v1 SET due_date=?,completed=0,updated_at=? WHERE id=?",next,now,id)
  :await d.runAsync("UPDATE standalone_reminders_v1 SET completed=?,updated_at=? WHERE id=?",completed?1:0,now,id);
 if(result.changes!==1)throw Error("Reminder no longer exists.");
 notifyReminderChanges();
}
export async function deleteStandaloneReminder(id:string){
 const result=await (await db()).runAsync("DELETE FROM standalone_reminders_v1 WHERE id=?",id);
 if(result.changes!==1)throw Error("Reminder no longer exists.");
 notifyReminderChanges();
}
/** Read-only consistent reminder export; does not modify existing reminders. */
export async function snapshotStandaloneRemindersForBackup(){
 const d=await db();
 const {validateReminderBackupSection}=await import("./reminder-backup-v4.ts");
 const rows=await d.getAllAsync<{id:string;title:string;notes:string;due_date:string;due_time:string;repeat:string;anchor_day:number;completed:number;created_at:string;updated_at:string}>("SELECT id,title,notes,due_date,due_time,repeat,anchor_day,completed,created_at,updated_at FROM standalone_reminders_v1 ORDER BY id");
 return validateReminderBackupSection({version:1,rows:rows.map(r=>({id:r.id,title:r.title,notes:r.notes,dueDate:r.due_date,dueTime:r.due_time,repeat:r.repeat,anchorDay:r.anchor_day||Number(r.due_date.slice(-2)),completed:r.completed===1,createdAt:r.created_at,updatedAt:r.updated_at}))});
}
