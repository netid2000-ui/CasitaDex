// Prepared driver: NOT RUN in this batch because no Android APK was produced.
const assert=require("node:assert/strict");
const fs=require("node:fs");
const {adb,dump,find,click,fill,screenshot,cold,pause,packageName}=require("../scripts/android-qa.cjs");
(async()=>{
 const checks=[],errors=[];
 const pass=t=>{checks.push(t);console.log("PASS "+t);fs.mkdirSync("docs/qa/native",{recursive:true});fs.writeFileSync("docs/qa/native/results-in-progress.json",JSON.stringify({checks},null,2));};
 const seen=t=>{const state=dump();assert.ok(state.nodes.some(n=>(n.text+" "+n["content-desc"]).includes(t)),"Expected visible text: "+t);return state;};
 await cold();seen("A little less to remember.");screenshot("01-launch");
 pass("Staging APK launches with bundled JavaScript");
 const fixtures=[
 ["HVAC filter","20 x 25 x 1 - MERV 11","Hall ceiling","Buy"],
 ["Refrigerator filter","EDR4RXD1","Kitchen fridge","Buy"],
 ["Living-room paint","SW 7036 - eggshell","Utility shelf","Buy"],
 ["Main water shutoff","Garage left wall - verify on site","Utility door","Find"],
 ["Dishwasher model","WDT750SAKZ","Kitchen cabinet","Fix"],
 ["Last HVAC service","2026-09-15 - filter inspected","Utility folder","Maintain"],
 ];
 for(const [title,answer,location,mode] of fixtures){
   await click("Add");await fill("What do you want to remember?",title);await fill("The answer",answer);await fill("Where it is (optional)",location);await click(mode);await click("Save answer");seen(answer);pass("Native save: "+title);
 }
 await click("Record maintenance done today");
 await fill("New due date (YYYY-MM-DD, blank to remove)","2026-10-01");await click("Save due date");
 await click("Answers");await fill("Search answers","Last HVAC service");await click("Open Last HVAC service");
 screenshot("02-service");
 pass("Native maintenance date and history recorded");
 await click("More");await click("Prepare text backup");const backup=(await find("Complete backup text","field")).text;
 assert.equal(JSON.parse(backup).cards.length,6);
 pass("Native compact text export includes six saved records");
 await cold();await click("Answers");await fill("Search answers","HVAC filter");seen("20 x 25 x 1 - MERV 11");
 pass("Force-stop and cold relaunch preserve saved card");
 const before={airplane:adb("shell","settings","get","global","airplane_mode_on").trim(),wifi:adb("shell","settings","get","global","wifi_on").trim(),data:adb("shell","settings","get","global","mobile_data").trim()};
 try{
   adb("shell","cmd","connectivity","airplane-mode","enable");adb("shell","svc","wifi","disable");adb("shell","svc","data","disable");
   await cold();await click("Answers");await fill("Search answers","Dishwasher model");seen("WDT750SAKZ");
   const connectivity=adb("shell","dumpsys","connectivity");
   const defaultLine=connectivity.split("\n").filter(l=>/Active default network/i.test(l)).join("\n");
   fs.writeFileSync("docs/qa/native/offline-connectivity.txt",defaultLine);
   assert.ok(/Active default network: (none|null)/i.test(defaultLine),"No default network must be present");
   screenshot("03-offline-cold");
   pass("Airplane mode / Wi-Fi and mobile data disabled: cold launch retrieves device data");
 }finally{
   adb("shell","cmd","connectivity","airplane-mode",before.airplane==="1"?"enable":"disable");
   adb("shell","svc","wifi",before.wifi==="1"?"enable":"disable");adb("shell","svc","data",before.data==="1"?"enable":"disable");
 }
 await click("Open Dishwasher model");await click("Edit answer");await fill("Updated answer","WDT750SAKZ - label checked");await click("Save edited answer");
 seen("Needs checking");pass("Native edit preserves explicit trust downgrade");
 await click("Delete this answer");await click("Keep answer");await click("Delete this answer");await click("Confirm delete");
 await fill("Search answers","Dishwasher model");seen("No matching answers.");
 await cold();await click("Answers");await fill("Search answers","Dishwasher model");seen("No matching answers.");
 pass("Native delete confirmation/cancel and durable deletion");
 await click("More");await fill("Paste a CasitaDex backup to restore",'{"version":2}');await click("Check backup");
 assert.ok(!dump().nodes.some(n=>n["content-desc"]==="Confirm replace from backup"));
 await fill("Paste a CasitaDex backup to restore",backup);await click("Check backup");await click("Confirm replace from backup");
 await click("Answers");await fill("Search answers","Dishwasher model");seen("WDT750SAKZ");
 pass("Native invalid import rejected and confirmed import restores the deleted record");
 await click("More");await click("Dark");await click("Extra-large text: Off");await cold();await click("More");
 seen("Extra-large text: On");screenshot("04-dark-large");
 pass("Native reading preferences survive force-stop");
 await click("Extra-large text: On");await click("Light");screenshot("05-light");await click("System");
 const originalScale=adb("shell","settings","get","system","font_scale").trim();
 try{
   adb("shell","settings","put","system","font_scale","2.0");await cold();await click("Answers");screenshot("06-system-font-200");
   pass("Native 200% system font scaling rendered for visual inspection");
 }finally{adb("shell","settings","put","system","font_scale",originalScale);await cold();}
 await click("Answers");await click("Share");await click("Select: HVAC filter");await click("Preview 1 selected cards");screenshot("07-share-preview");
 await click("Open device share sheet");await pause(600);
 const activity=adb("shell","dumpsys","activity","activities");
 assert.ok(/ChooserActivity|ResolverActivity/.test(activity),"Expected Android chooser");
 fs.writeFileSync("docs/qa/native/share-chooser.txt",activity.split("\n").filter(l=>/ChooserActivity|ResolverActivity/.test(l)).join("\n"));
 adb("shell","input","keyevent","4");
 pass("Native selective preview opens Android chooser; cancelled without sending");
 fs.writeFileSync("docs/qa/native/results.json",JSON.stringify({date:new Date().toISOString(),packageName,checks,errors,physicalDevice:false,limitations:["Screen reader speech not verified by this script","Native upgrade migration and device storage-failure cases require separate results","Screenshots require visual review; rendering is not an automatic no-clipping pass"]},null,2));
})().catch(e=>{console.error(e);process.exit(1)});
