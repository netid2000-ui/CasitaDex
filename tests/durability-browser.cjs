const {chromium}=require("playwright");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
(async()=>{
 const profile=fs.mkdtempSync(path.resolve("../../work/browser-durability-"));
 let context=await chromium.launchPersistentContext(profile,{channel:"msedge",headless:true,viewport:{width:390,height:844}});
 let page=context.pages()[0];
 const errors=[],checks=[],retrieval=[];
 const observe=()=>page.on("pageerror",e=>errors.push(e.message));
 observe();
 const button=t=>page.getByRole("button",{name:t,exact:true});
 const click=async t=>{await button(t).click();const paths={Today:"/",Answers:"/answers",Add:"/add",More:"/more"};if(paths[t])await page.waitForURL(u=>u.pathname===paths[t]);};
 const field=t=>page.getByRole("textbox",{name:t,exact:true});
 const pass=t=>{checks.push(t);console.log("PASS "+t);};
 await page.goto("http://127.0.0.1:8765");
 const fixtures=[
 ["HVAC filter","20 x 25 x 1 - MERV 11","Hall ceiling","Buy"],
 ["Refrigerator water filter","EDR4RXD1","Kitchen fridge","Buy"],
 ["Living-room paint formula","SW 7036 - eggshell - confirm label","Utility shelf","Buy"],
 ["Main water shutoff","Garage left wall - verify on site","Utility door","Find"],
 ["Dishwasher model","WDT750SAKZ - example model","Kitchen cabinet","Fix"],
 ["Last HVAC service","2026-09-15 - filter inspected","Utility folder","Maintain"],
 ];
 for(const [title,answer,location,mode] of fixtures){
  await click("Add");await field("What do you want to remember?").fill(title);await field("The answer").fill(answer);await field("Where it is (optional)").fill(location);await click(mode);await click("Save answer");await page.getByText(answer,{exact:true}).waitFor();
 }
 await click("Record maintenance done today");
 await page.getByText(/Maintenance completed/).waitFor();
 await field("New due date (YYYY-MM-DD, blank to remove)").fill("2026-10-01");await click("Save due date");
 await page.getByText("Current due date: 2026-10-01",{exact:true}).waitFor();
 pass("Six realistic cards created through UI; maintenance history and due date saved");
 await click("More");await click("Dark");
 await click("Extra-large text: Off");
 await button("Extra-large text: On").waitFor();
 await page.screenshot({path:"docs/qa/dark-more-200.png"});
 await context.close();
 context=await chromium.launchPersistentContext(profile,{channel:"msedge",headless:true,viewport:{width:390,height:844}});
 page=context.pages()[0];observe();await page.goto("http://127.0.0.1:8765/more");
 await button("Extra-large text: On").waitFor();
 assert.equal(await button("Dark").getAttribute("aria-pressed"),"true");
 pass("Browser process restart preserves cards and reading preferences");
 await click("Extra-large text: On");
 await click("Light");
 assert.equal(await button("Light").getAttribute("aria-pressed"),"true");
 await click("System");await page.emulateMedia({colorScheme:"dark"});
 await page.waitForFunction(()=>getComputedStyle(document.querySelector("h1")).color==="rgb(228, 239, 229)");
 await page.emulateMedia({colorScheme:"light"});
 await page.waitForFunction(()=>getComputedStyle(document.querySelector("h1")).color==="rgb(32, 63, 54)");
 pass("Light, Dark and live System appearance respond");
 for(const [title,answer] of fixtures){
   await click("Today");
   const start=performance.now();
   await click("Find an answer");
   await field("Search answers").fill(title);
   await click("Open "+title);
   await page.getByText(answer,{exact:true}).waitFor();
   retrieval.push({task:title,milliseconds:Math.round(performance.now()-start),method:"automated known-route click/search/open; not human usability"});
 }
 pass("Six answer-retrieval journeys measured without a target guarantee");
 await page.getByText("Current due date: 2026-10-01",{exact:true}).waitFor();
 await page.getByText(/Maintenance completed/).waitFor();
 pass("Maintenance date and history survive process restart");
 await click("Edit answer");await field("Updated answer").fill("2026-09-16 - service invoice filed");await click("Save edited answer");
 await page.getByText("Needs checking",{exact:true}).waitFor();
 await click("More");await click("Prepare text backup");const backup=await field("Complete backup text").inputValue();
 assert.equal(JSON.parse(backup).cards.length,6);
 await click("Answers");await field("Search answers").fill("Dishwasher");await click("Open Dishwasher model");
 await click("Delete this answer");await click("Keep answer");await page.getByText("WDT750SAKZ - example model",{exact:true}).waitFor();
 await click("Delete this answer");await click("Confirm delete");await page.waitForURL(u=>u.pathname==="/answers");
 await field("Search answers").fill("Dishwasher");await page.getByText("No matching answers.",{exact:true}).waitFor();
 await page.reload();await field("Search answers").fill("Dishwasher");await page.getByText("No matching answers.",{exact:true}).waitFor();
 pass("Delete confirmation, cancel and durable deletion verified");
 await click("More");await field("Paste a CasitaDex backup to restore").fill(backup);await click("Check backup");await click("Confirm replace from backup");await page.getByText("Backup restored.",{exact:true}).waitFor();
 await click("Answers");await click("Share");await click("Select: HVAC filter");await click("Preview 1 selected cards");
 const preview=page.getByText("HVAC filter\n20 x 25 x 1 - MERV 11\nUnknown",{exact:true});
 await preview.waitFor();
 assert.ok(!(await preview.innerText()).includes("Garage"));
 pass("Text export/import restores six cards; selective preview excludes unrelated data");
 await context.setOffline(true);await click("Today");await click("Find an answer");await field("Search answers").fill("Dishwasher");await page.getByText("WDT750SAKZ - example model",{exact:true}).waitFor();
 pass("Already-loaded browser application retrieves restored answers offline");
 await context.setOffline(false);
 assert.deepEqual(errors,[]);
 fs.writeFileSync("docs/qa/durability-browser-results.json",JSON.stringify({date:new Date().toISOString(),checks,retrieval,pageErrors:errors,limitations:["Browser restart uses local preview server; this is not offline cold launch","Timings use automated input and do not replace human comparison with Notes, Photos, paper or memory","No native screen reader acceptance inferred"]},null,2));
 await context.close();
})().catch(e=>{console.error(e);process.exit(1);});
