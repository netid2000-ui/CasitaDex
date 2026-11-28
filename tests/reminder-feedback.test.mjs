import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {runReminderFeedbackAction,reminderResultFeedback,retainReminderWarning} from "../src/reminder-feedback.ts";
const messages={success:"Saved locally.",actionError:"Action failed.",refreshError:"Action finished; list could not refresh."};
test("action warnings remain verbatim even when subsequent refresh fails",async()=>{
 const feedback=[];
 const warning="Titles are off for new alerts. 1 existing alert(s) may still show titles; check device alerts.";
 await runReminderFeedbackAction(async()=>warning,async()=>{throw Error("refresh");},s=>feedback.push(["status",s]),e=>feedback.push(["error",e]),messages);
 assert.deepEqual(feedback,[["error",""],["status",{message:warning,level:"warning"}],["error",messages.refreshError]]);
});
test("action failure does not report a successful save or refresh",async()=>{
 const feedback=[];let refreshed=false;
 await runReminderFeedbackAction(async()=>{throw Error("save");},async()=>{refreshed=true;},s=>feedback.push(["status",s]),e=>feedback.push(["error",e]),messages);
 assert.deepEqual(feedback,[["error",messages.actionError]]);
 assert.equal(refreshed,false);
});
test("successful feedback clears old error and uses explicit result or fallback",async()=>{
 for(const result of [undefined,"Saved locally. Notifications are off; enable alerts in device settings."]){
  const feedback=[];let refreshed=false;
  await runReminderFeedbackAction(async()=>result,async()=>{refreshed=true;},s=>feedback.push(["status",s]),e=>feedback.push(["error",e]),messages);
  assert.deepEqual(feedback,[["error",""],["status",result?{message:result,level:"warning"}:{message:messages.success,level:"info"}]]);
  assert.equal(refreshed,true);
 }
});
test("feedback is in the reminder scroll content, not fixed above it",()=>{
 const route=readFileSync(new URL("../src/app/reminders.tsx",import.meta.url),"utf8");
 const list=readFileSync(new URL("../src/figma-first/FigmaReminders.tsx",import.meta.url),"utf8");
 assert.match(route,/<FigmaReminders status=\{status\} error=\{error\}/);
 assert.doesNotMatch(route,/<Text accessibilityLiveRegion/);
 const scroll=list.indexOf("<ScrollView"),error=list.indexOf('testID="reminder-error-feedback"'),status=list.indexOf('testID="reminder-status-feedback"'),end=list.indexOf("</ScrollView>");
 assert.ok(scroll<error&&error<status&&status<end);
 assert.match(list,/accessibilityLiveRegion="polite"/);
 assert.match(route,/announceForAccessibilityWithOptions/);
});

test("device warnings stay distinct from healthy informational outcomes and survive new actions",()=>{
 const full="Saved locally. Alerts queued for 2 of 2 reminders. Coverage is finite; reopen Reminders to renew it. Device settings may affect delivery.";
 const partial="Saved locally. Alerts queued for 1 of 2 reminders. Coverage is finite; reopen Reminders to renew it. Device settings may affect delivery.";
 assert.equal(reminderResultFeedback(full).level,"info");
 assert.equal(reminderResultFeedback("Saved locally. No upcoming reminder alert is due.").level,"info");
 for(const message of [partial,full+" Additional warning.","Saved locally. Notifications are off; enable alerts in device settings.","Titles are off for new alerts. Existing notification text could not be verified; check device alerts.","Future unrecognized result"]){
  const warning=reminderResultFeedback(message);
  assert.equal(warning.level,"warning");assert.equal(retainReminderWarning(warning),warning);
 }
 assert.equal(retainReminderWarning(reminderResultFeedback(full)),null);
 assert.equal(retainReminderWarning(null),null);
});
