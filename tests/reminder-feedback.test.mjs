import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {runReminderFeedbackAction} from "../src/reminder-feedback.ts";
const messages={success:"Saved locally.",actionError:"Action failed.",refreshError:"Action finished; list could not refresh."};
test("action warnings remain verbatim even when subsequent refresh fails",async()=>{
 const feedback=[];
 const warning="Titles are off for new alerts. 1 existing alert(s) may still show titles; check device alerts.";
 await runReminderFeedbackAction(async()=>warning,async()=>{throw Error("refresh");},s=>feedback.push(["status",s]),e=>feedback.push(["error",e]),messages);
 assert.deepEqual(feedback,[["error",""],["status",warning],["error",messages.refreshError]]);
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
  assert.deepEqual(feedback,[["error",""],["status",result??messages.success]]);
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
