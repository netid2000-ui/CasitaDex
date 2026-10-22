import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
const shell=fs.readFileSync("src/app/_layout.tsx","utf8");
const eng=fs.readFileSync("src/eng-screens.tsx","utf8");
test("five distinct labeled accessible primary destinations",()=>{
 for(const [name,route] of [["Home","/"],["Memories","/memories"],["Photos","/photos"],["Reminders","/reminders"],["Find","/answers"]]){
  assert.ok(shell.includes(`label: "${name}", route: "${route}"`),name);
 }
 assert.match(shell,/accessibilityRole="tab"/);
 assert.match(shell,/accessibilityState=\{\{ selected: active \}\}/);
});
test("Home retains the three owner-approved create actions",()=>{
 const home=eng.slice(eng.indexOf("export function EngHome(){"),eng.indexOf("export function EngPhotos(){"));
 for(const name of ["Add Memory","Add Photo Memory","Add Reminder"]){assert.ok(home.includes(`label:"${name}"`) || home.includes(`label="${name}"`) || home.includes(`title="${name}"`),name)}
 assert.ok(!home.includes("Recent memories"));
});
test("photo viewer provides accessible close and zoom controls",()=>{
 for(const label of ["Close photo","Zoom in","Zoom out"]){assert.ok(eng.includes(`label="${label}"`),label)}
});
