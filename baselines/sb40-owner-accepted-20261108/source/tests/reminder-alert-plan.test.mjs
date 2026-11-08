import test from "node:test";
import assert from "node:assert/strict";
import { planReminderAlerts } from "../src/reminder-alert-plan.ts";
const at=(day,time="09:00")=>new Date(day+"T"+time+":00").getTime();
const make=(overrides={})=>({id:"qa1",title:"Change air filter",dueDate:"2027-01-31",dueTime:"09:00",repeat:"once",completed:false,...overrides});
test("one-off alerts use native local wall clock and skip expired alerts",()=>{
 const current=at("2027-01-30");
 const upcoming=planReminderAlerts([make()],current);
 assert.equal(upcoming.length,1);
 assert.equal(upcoming[0].timestamp,at("2027-01-31"));
 assert.deepEqual(planReminderAlerts([make()],at("2027-02-01")),[]);
});
test("monthly recurrence clamps month ends to last available day",()=>{
 const a=planReminderAlerts([make({repeat:"monthly"})],at("2027-01-30"),48,3);
 assert.deepEqual(a.map(x=>new Date(x.timestamp).getDate()),[31,28,31]);
});
test("leap year recurrence clamps to February 28 in non-leap years",()=>{
 const a=planReminderAlerts([make({repeat:"yearly",dueDate:"2028-02-29"})],at("2028-02-28"),48,2);
 assert.deepEqual(a.map(x=>new Date(x.timestamp).getDate()),[29,28]);
});
test("completed reminders do not schedule and the platform cap is respected",()=>{
 const rows=Array.from({length:15},(_,i)=>make({id:"qa"+i,repeat:"daily"}));
 assert.equal(planReminderAlerts(rows,at("2027-01-30"),48,6).length,48);
 assert.equal(planReminderAlerts([make({completed:true})],at("2027-01-30")).length,0);
});
test("edit key changes when due time changes, permitting cancellation of old occurrence",()=>{
 const original=planReminderAlerts([make()],at("2027-01-30"))[0];
 const edited=planReminderAlerts([make({dueTime:"09:30"})],at("2027-01-30"))[0];
 assert.notEqual(original.key,edited.key);
});
test("linked reminders carry their memory ID into scheduled alert data",()=>{const planned=planReminderAlerts([make({memoryId:"sb26qa_001"})],at("2027-01-30"));assert.equal(planned[0].memoryId,"sb26qa_001");});
