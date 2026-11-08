import test from "node:test";
import assert from "node:assert/strict";
import { planReminderAlerts } from "../src/reminder-alert-plan.ts";
const at=(day,time="09:00")=>new Date(day+"T"+time+":00").getTime();
const make=(overrides={})=>({id:"qa1",title:"Change air filter",dueDate:"2027-01-31",dueTime:"09:00",repeat:"once",completed:false,...overrides});
test("invalid time should not schedule reminder",()=>{
 const current=at("2027-01-30");
 const upcoming=planReminderAlerts([make({dueTime:"25:00"})],current);
 assert.equal(upcoming.length,0);
});
test("blank title should not schedule reminder",()=>{
 const current=at("2027-01-30");
 const upcoming=planReminderAlerts([make({title:""})],current);
 assert.equal(upcoming.length,0);
});
test("cap zero should return empty array",()=>{
 const current=at("2027-01-30");
 const upcoming=planReminderAlerts([make()],current,0);
 assert.equal(upcoming.length,0);
});
test("sort order should be by timestamp",()=>{
 const current=at("2027-01-30");
 const upcoming=planReminderAlerts([make({dueDate:"2027-02-01"}),make({dueDate:"2027-01-31"})],current);
 assert.deepEqual(upcoming.map(x=>new Date(x.timestamp).getDate()),[31,1]);
});
test("invalid date should not schedule reminder",()=>{
 const current=at("2027-01-30");
 const upcoming=planReminderAlerts([make({dueDate:"2027-13-01"})],current);
 assert.equal(upcoming.length,0);
});