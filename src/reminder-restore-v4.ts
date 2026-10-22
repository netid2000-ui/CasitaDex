import {validateReminderBackupSection,type ReminderBackupSection} from './reminder-backup-v4.ts';
/** SQL transaction participant. Caller owns BEGIN/COMMIT/ROLLBACK and must commit ENG in the same transaction. */
export async function replaceReminderRowsInTransaction(tx:{runAsync:(sql:string,...args:any[])=>Promise<unknown>},input:ReminderBackupSection){
 const checked=validateReminderBackupSection(input);
 await tx.runAsync('DELETE FROM standalone_reminders_v1');
 for(const r of checked.rows){
  await tx.runAsync('INSERT INTO standalone_reminders_v1 (id,title,notes,due_date,due_time,repeat,anchor_day,completed,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?)',r.id,r.title,r.notes,r.dueDate,r.dueTime,r.repeat,r.anchorDay,r.completed?1:0,r.createdAt,r.updatedAt);
 }
 return checked.rows.length;
}
