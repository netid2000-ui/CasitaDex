/** Load the current reminder state only when the preceding reconciliation has finished. */
export function createLatestReminderRefresh<T,R>(read:()=>Promise<T>,apply:(state:T,ask:boolean)=>Promise<R>){
 let tail:Promise<unknown>=Promise.resolve();
 return (ask=false)=>{
  const next=tail.then(async()=>apply(await read(),ask),async()=>apply(await read(),ask));
  tail=next;
  return next;
 };
}
