export type ReminderStatusFeedback={message:string;level:'info'|'warning'};
/** Only known healthy scheduler outcomes are informational; preserve unknown and partial results as warnings. */
export function reminderResultFeedback(message:string):ReminderStatusFeedback{
 const queued=/^Saved locally\. Alerts queued for (\d+) of (\d+) reminders\. Coverage is finite; reopen Reminders to renew it\. Device settings may affect delivery\.$/.exec(message);
 const healthy=message==='Saved locally. No upcoming reminder alert is due.'||(queued!==null&&queued[1]===queued[2]);
 return {message,level:healthy?'info':'warning'};
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
 reportStatus(typeof result==='string'?reminderResultFeedback(result):{message:messages.success,level:'info'});
 try{await refresh();}catch{reportError(messages.refreshError);}
}
