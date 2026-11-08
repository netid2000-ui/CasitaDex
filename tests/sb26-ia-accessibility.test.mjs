import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
const shell=fs.readFileSync("src/app/_layout.tsx","utf8");
const eng=fs.readFileSync("src/eng-screens.tsx","utf8");
test("four distinct labeled accessible primary destinations with Memories integrated into Find",()=>{
 for(const [name,route] of [["Home","/"],["Photos","/photos"],["Reminders","/reminders"],["Find","/answers"]]){
  assert.ok(shell.includes(`label: "${name}", route: "${route}"`),name);
 }
 assert.ok(!shell.includes('label: "Memories", route: "/memories"'));
 assert.match(shell,/accessibilityRole="tab"/);
 assert.match(shell,/accessibilityState=\{\{ selected: active \}\}/);
});
test("Home retains the three owner-approved create actions",()=>{
 const home=eng.slice(eng.indexOf("export function EngHome(){"),eng.indexOf("export function EngPhotos(){"));
 for(const name of ["Add Memory","Add Photo Memory","Add Reminder"]){assert.ok(home.includes(`label:"${name}"`) || home.includes(`label="${name}"`) || home.includes(`title="${name}"`),name)}
 assert.ok(!home.includes("Recent memories"));
});
test("photo viewer provides accessible close and native pinch zoom",()=>{
 const viewer=fs.readFileSync("src/app/photo-viewer.tsx","utf8");
 assert.ok(eng.includes('pathname:"/photo-viewer"'));
 assert.match(viewer,/accessibilityLabel="Close photo"/);
 assert.match(viewer,/Gesture\.Pinch\(\)/); assert.match(viewer,/Math\.min\(4,/);
 assert.match(viewer,/Math\.max\(1,/);
 assert.match(viewer,/router\.back\(\)/);
});
