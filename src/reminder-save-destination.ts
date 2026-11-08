/** A successful linked reminder save returns to its originating memory. */
export function savedReminderDestination(memoryId?:string,origin?:string):string|{pathname:'/card';params:{id:string}} {
 return memoryId?{pathname:'/card',params:{id:memoryId}}:origin==='home'?'/':'/reminders';
}
