// Local emulator helper. Run only against the named CasitaDex test package.
const {execFileSync}=require("node:child_process");
const fs=require("node:fs");
const path=require("node:path");
const adbPath=process.env.ADB_PATH || "C:/Users/franco/AppData/Local/Android/Sdk/platform-tools/adb.exe";
const serial=process.env.ANDROID_SERIAL || "emulator-5554";
const packageName="com.designsbyfa.casitadex.staging";
function adb(...args){return execFileSync(adbPath,["-s",serial,...args],{encoding:"utf8",timeout:30000,windowsHide:true});}
const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const decode=s=>s.replace(/&quot;/g,'"').replace(/&apos;/g,"'").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&#10;/g,"\n").replace(/&amp;/g,"&");
function dump(){
 adb("shell","uiautomator","dump","/sdcard/casitadex-qa.xml");
 const xml=adb("shell","cat","/sdcard/casitadex-qa.xml");
 const nodes=[...xml.matchAll(/<node\s+([^>]+)>/g)].map(m=>{
  const node=Object.fromEntries([...m[1].matchAll(/([\w-]+)="([^"]*)"/g)].map(a=>[a[1],decode(a[2])]));
  node.box=(node.bounds?.match(/\d+/g)||[]).map(Number);return node;
 });
 return {xml,nodes};
}
function tap(node){
 const [l,t,r,b]=node.box;if(!(r>l && b>t))throw Error("Node has no tappable bounds");
 adb("shell","input","tap",String(Math.round((l+r)/2)),String(Math.round((t+b)/2)));
}
function scroll(nodes,direction){
 const scroller=nodes.find(n=>n.scrollable==="true"&&n.package===packageName);
 if(!scroller)return false;
 const [l,t,r,b]=scroller.box,x=Math.round((l+r)/2),a=Math.round(t+(b-t)*0.75),z=Math.round(t+(b-t)*0.25);
 adb("shell","input","swipe",String(x),String(direction==="down"?a:z),String(x),String(direction==="down"?z:a),"300");
 return true;
}
async function find(label,kind="button"){
 for(const direction of ["here","up","up","up","up","up","down","down","down","down","down","down","down","down","down","down","down","down"]){
  const state=dump();
  if(!state.nodes.some(n=>n.package===packageName))throw Error("CasitaDex is not the current UI; refusing to interact");
  const node=state.nodes.find(n=>n.package===packageName && (n["content-desc"]===label || n.text===label) && (kind==="field"?n.class?.includes("EditText"):n.clickable==="true"));
  if(node)return node;
  if(direction!=="here")scroll(state.nodes,direction);
 }
 throw Error("Control not found: "+label);
}
async function click(label){tap(await find(label));await pause(180);}
async function fill(label,value){
 if(!/^[a-zA-Z0-9 .,/:()_-]*$/.test(value))throw Error("QA input must use safe ASCII");
 const node=await find(label,"field");tap(node);
 adb("shell","input","keyevent","123");
 if(node.text.length)adb("shell","input","keyevent",...Array(node.text.length).fill("67"));
 if(value)adb("shell","input","text",value.replace(/ /g,"%s"));
 adb("shell","input","keyevent","4");
 await pause(120);
}
function screenshot(name){
 const file=path.join("docs/qa/native",name+".png");fs.mkdirSync(path.dirname(file),{recursive:true});
 fs.writeFileSync(file,execFileSync(adbPath,["-s",serial,"exec-out","screencap","-p"],{timeout:30000,windowsHide:true}));
 const state=dump();fs.writeFileSync(path.join("docs/qa/native",name+".xml"),state.xml);
 return state;
}
async function cold(){adb("shell","am","force-stop",packageName);adb("shell","am","start","-W","-n",packageName+"/.MainActivity");await pause(1200);}
module.exports={adb,dump,click,fill,screenshot,cold,pause,packageName,scroll};
if(require.main===module){const state=screenshot(process.argv[2]||"current");console.log(JSON.stringify(state.nodes.map(n=>({text:n.text,label:n["content-desc"],class:n.class,clickable:n.clickable,bounds:n.bounds})),null,2));}
