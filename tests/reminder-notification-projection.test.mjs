import test from "node:test";
import assert from "node:assert/strict";
import {projectReminderNotifications as project,reconcileReminderNotificationProjection as reconcile,REMINDER_NOTIFICATION_PREFIX as prefix} from "../src/reminder-notification-projection.ts";
const options={now:new Date(2026,10,4,8).getTime(),linkedDueTime:"09:00",limit:48};
const memory=(extra={})=>({id:"same",title:"Filter",due:"2026-11-05",lifecycle:"active",...extra});
const reminder=(extra={})=>({id:"same",title:"Water",dueDate:"2026-11-05",dueTime:"10:30",completed:false,...extra});
test("linked and standalone identities coexist, preserve source, and use local calendar times",()=>{
 const memories=[memory()],reminders=[reminder()],before=JSON.stringify([memories,reminders]);
 const result=project(memories,reminders,options);
 assert.equal(result.length,2);assert.notEqual(result[0].identifier,result[1].identifier);
 assert.equal(new Date(result[0].at).getHours(),9);assert.equal(new Date(result[1].at).getMinutes(),30);
 assert.equal(JSON.stringify([memories,reminders]),before);
 assert.deepEqual(project(memories,reminders,options),result);
});
test("completion, deletion, pause, demo and invalid/past dates cannot leave desired alerts",()=>{
 assert.deepEqual(project([memory({due:undefined}),memory({id:"a",lifecycle:"archived"}),memory({id:"b",lifecycle:"recently_deleted"}),memory({id:"c",demo:true})],
 [reminder({completed:true}),reminder({id:"bad",dueDate:"2026-02-30"}),reminder({id:"past",dueDate:"2026-11-03"}),reminder({id:"time",dueTime:"24:00"})],options),[]);
 assert.deepEqual(project([memory()],[],{...options,linkedDueTime:"bad"}),[]);
});
test("reschedule/rename replaces owned alert; completion/deletion cancels; other owners survive",()=>{
 const before=project([memory()],[reminder()],options),changed=project([memory({due:"2026-11-06",title:"New filter"})],[],options);
 const unrelated={...before[0],identifier:"calendar:keep"};
 const plan=reconcile([...before,unrelated],changed);
 assert.deepEqual(new Set(plan.cancel),new Set(before.map(x=>x.identifier)));assert.deepEqual(plan.schedule,changed);
 assert.deepEqual(reconcile(changed,changed),{cancel:[],schedule:[]});
 assert.deepEqual(reconcile(before,[]).cancel,before.map(x=>x.identifier));
 assert.throws(()=>reconcile([],[unrelated]));assert.throws(()=>reconcile([],[changed[0],changed[0]]));
});
test("capacity keeps soonest alerts with stable tie order; recurrence uses current persisted date",()=>{
 const all=project([memory({id:"z"}),memory({id:"a"})],[reminder({dueDate:"2026-11-06"})],options);
 assert.deepEqual(project([memory({id:"z"}),memory({id:"a"})],[reminder({dueDate:"2026-11-06"})],{...options,limit:1}),[all[0]]);
 assert.equal(all[0].sourceId,"a");assert.ok(all[2].at>all[0].at);
 assert.equal(project([],[],{...options,limit:0}).length,0);assert.throws(()=>project([],[],{...options,limit:-1}));
 assert.ok(all.every(x=>x.identifier.startsWith(prefix)));
});

test("DST gap is excluded rather than silently moved; changing timezone reprojects same identity",()=>{
 const saved=process.env.TZ;
 try{
  process.env.TZ="America/Los_Angeles";
  const gap=reminder({dueDate:"2027-03-14",dueTime:"02:30"});
  assert.deepEqual(project([], [gap], options),[]);
  const valid=reminder({dueDate:"2027-03-14",dueTime:"03:30"});
  const pacific=project([], [valid],options)[0];
  process.env.TZ="America/New_York";
  const eastern=project([], [valid],options)[0];
  assert.equal(pacific.identifier,eastern.identifier);assert.notEqual(pacific.at,eastern.at);
  assert.equal(new Date(eastern.at).getHours(),3);
 }finally{if(saved===undefined)delete process.env.TZ;else process.env.TZ=saved;}
});
