/** Existing compact filter layout also controls whether its header can dock. */
export function usesCompactReminderHeader(large:boolean,fontScale:number):boolean {
 return large || fontScale >= 1.35;
}
