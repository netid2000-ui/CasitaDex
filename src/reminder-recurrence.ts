export type RepeatSchedule="once"|"daily"|"weekly"|"monthly"|"yearly";
const pad=(n:number)=>String(n).padStart(2,"0");
const year=(n:number)=>String(n).padStart(4,"0");
const utc=(y:number,m:number,d:number)=>{const x=new Date(0);x.setUTCHours(0,0,0,0);x.setUTCFullYear(y,m,d);return x;};
export function validReminderDay(day:string){
 if(!/^\d{4}-\d{2}-\d{2}$/.test(day))return false;
 const [y,m,d]=day.split("-").map(Number);
 if(y<1||y>9999||m<1||m>12||d<1)return false;
 return d<=utc(y,m,0).getUTCDate();
}
export function nextReminderDay(day:string,repeat:RepeatSchedule,anchorDay?:number){
 if(!validReminderDay(day))throw Error("Invalid reminder date");
 if(repeat==="once")return null;
 const [y,m,d]=day.split("-").map(Number);
 if(repeat==="daily"||repeat==="weekly"){
  const x=utc(y,m-1,d+(repeat==="daily"?1:7));
  if(x.getUTCFullYear()>9999)throw Error("Reminder exceeds supported calendar range");
  return [year(x.getUTCFullYear()),pad(x.getUTCMonth()+1),pad(x.getUTCDate())].join("-");
 }
 const target=repeat==="monthly"?{y:y+(m===12?1:0),m:m===12?1:m+1}:{y:y+1,m};
 if(target.y>9999)throw Error("Reminder exceeds supported calendar range");
 const last=utc(target.y,target.m,0).getUTCDate();
 return [year(target.y),pad(target.m),pad(Math.min(anchorDay??d,last))].join("-");
}