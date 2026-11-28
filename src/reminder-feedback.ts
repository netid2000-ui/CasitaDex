/** Action and refresh are different phases: a refresh error cannot undo a committed action. */
export async function runReminderFeedbackAction(
 action:()=>Promise<string|void>,refresh:()=>Promise<void>,
 reportStatus:(message:string)=>void,reportError:(message:string)=>void,
 messages:{success:string;actionError:string;refreshError:string}
):Promise<void>{
 let result:string|void;
 try{result=await action();}catch{reportError(messages.actionError);return;}
 reportError('');
 reportStatus(typeof result==='string'?result:messages.success);
 try{await refresh();}catch{reportError(messages.refreshError);}
}
