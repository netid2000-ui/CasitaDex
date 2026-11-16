/** Route notification taps to their specific saved reminder or linked memory. */
export function reminderNotificationDestination(
 reminder: {id:string;memoryId?:string|null}|undefined,
 fallbackMemoryId?:string|null,
): '/reminders'|{pathname:'/card'|'/reminders-manage';params:{id:string}} {
 const memoryId=reminder?.memoryId??fallbackMemoryId;
 if(memoryId)return {pathname:'/card',params:{id:memoryId}};
 if(reminder)return {pathname:'/reminders-manage',params:{id:reminder.id}};
 return '/reminders';
}
