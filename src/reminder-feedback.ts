export type ReminderStatusFeedback={message:string;level:'info'|'warning';verified:boolean};
export const noUpcomingReminderFeedback='Saved locally. No upcoming reminder alert is due.';
export function queuedReminderFeedback(armed:number,eligible:number){return `Saved locally. Alerts queued for ${armed} of ${eligible} reminders. Coverage is finite; reopen Reminders to renew it. Device settings may affect delivery.`;}
/** Only known healthy scheduler outcomes are informational; preserve unknown and partial results as warnings. */
export function reminderResultFeedback(message:string):ReminderStatusFeedback{
 const queued=/^Saved locally\. Alerts queued for (\d+) of (\d+) reminders\./.exec(message);
 const healthy=message===noUpcomingReminderFeedback||(queued!==null&&queued[1]===queued[2]&&message===queuedReminderFeedback(Number(queued[1]),Number(queued[2])));
 return {message,level:healthy?'info':'warning',verified:healthy};
}
/** Only an explicit healthy reconciliation can supersede an unresolved warning. */
export function mergeReminderFeedback(previous:ReminderStatusFeedback|null,next:ReminderStatusFeedback):ReminderStatusFeedback{
 return previous?.level==='warning'&&next.level==='info'&&!next.verified?previous:next;
}
export function retainReminderWarning(status:ReminderStatusFeedback|null):ReminderStatusFeedback|null{
 return status?.level==='warning'?status:null;
}
/** Action and refresh are different phases: a refresh error cannot undo a committed action. */
export async function runReminderFeedbackAction(
 action:()=>Promise<string|void>,refresh:()=>Promise<void>,
 reportStatus:(status:ReminderStatusFeedback)=>void,reportError:(message:string)=>void,
 messages:{success:string;actionError:string;refreshError:string}
):Promise<void>{
 let result:string|void;
 try{result=await action();}catch{reportError(messages.actionError);return;}
 reportError('');
 reportStatus(typeof result==='string'?reminderResultFeedback(result):{message:messages.success,level:'info',verified:false});
 try{await refresh();}catch{reportError(messages.refreshError);}
}
