import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";
import { primaryNavigationRows } from "../src/primary-navigation-layout.ts";

const react = {
 createElement:(type,props,...children)=>({type,props:{...props,children}}),
 useState:initial=>[typeof initial==="function"?initial():initial,()=>{}],
 useReducer:()=>[{},()=>{}],useRef:current=>({current}),useMemo:fn=>fn(),useCallback:fn=>fn,useEffect:()=>{},
};
function load(file,mocks,extra="") {
 const text=fs.readFileSync("src/"+file,"utf8");
 const js=ts.transpileModule(text,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.React}}).outputText;
 const mod={exports:{}};
 vm.runInNewContext(js+extra,{module:mod,exports:mod.exports,require:name=>{
  if(name.endsWith(".png")||name.endsWith(".jpg"))return name;
  if(!(name in mocks))throw Error("Unexpected import "+name);
  return mocks[name];
 },Date,Math,Set});
 return mod.exports;
}
function all(node) {
 if(!node||typeof node!=="object")return [];
 if(Array.isArray(node))return node.flatMap(all);
 return [node,...all(node.props?.children)];
}
function screens(snapshot, pathname = "/") {
 const routes=[];
 const mocks={react,"react-native":{Platform:{OS:"ios"},View:"View",ScrollView:"ScrollView",useWindowDimensions:()=>({width:390,height:844})},
 "expo-router":{router:{push:route=>routes.push(route)},useFocusEffect:()=>{},usePathname:()=>pathname},
 "./ui":{Page:"Page",Button:"Button",Copy:"Copy",Field:"Field",useTheme:()=>({s:{panel:{}},colors:{paper:"#F7F2E8",white:"#fff"}})},
 "./state":{useData:()=>({large:false,preferenceError:""})},
 "./accessibility-feedback":{useVisibleStatusAnnouncement:()=>"none"},
 "./home-action":{HomeAction:"HomeAction",HomeIntro:"HomeIntro"},
 "./eng-find":{defaultFilter:()=>({categories:[]}),searchIndex:()=>[],findMemories:()=>[]},
 "./eng-domain":{localDay:()=>""},
 };
 for(const name of ["./accessibility-feedback","./reminder-alerts","./backup-review","./reminder-notification-target","./reminder-notification-projection","@react-native-community/datetimepicker","./eng-runtime","./eng-store","./standalone-reminders","./eng-text-backup","./eng-duplicates","./eng-navigation","./standalone-reminder-draft","./brand","./editorial-intro","./model","./photo-viewer-state"])mocks[name]??={};
 const api=load("eng-screens.tsx",mocks,"\nmodule.exports.setFixture = fixture => { useEng = () => fixture; };");
 api.setFixture({snapshot,status:"",busy:false,run:()=>{throw Error("Unexpected storage mutation");}});
 return {api,routes};
}
test("Home action order and route callbacks match owner reference without touching storage",()=>{
 const f=screens({draft:null}),tree=all(f.api.EngHome());
 const actions=tree.filter(n=>n.type==="HomeAction");
 assert.deepEqual(actions.map(n=>n.props.title),["Find a Memory","Add Memory","Add Photo Memory","Add Reminder"]);
 for(const n of actions)n.props.onPress();
 tree.find(n=>n.type==="HomeIntro").props.onSettings();
 assert.deepEqual(f.routes,["/answers","/add","/add?mode=photo","/reminders?mode=new","/more"]);
 assert.equal(actions[1].props.primary,true);
});
test("Home preserves loading and saved draft protections while Find and Settings remain available",()=>{
 for(const snapshot of [null,{draft:{id:"draft",checkpoint:2,title:"Keep me",photos:[]}}]){
  const f=screens(snapshot),tree=all(f.api.EngHome()),actions=tree.filter(n=>n.type==="HomeAction");
  assert.equal(actions[1].props.disabled,true);assert.equal(actions[2].props.disabled,true);
  assert.notEqual(actions[0].props.disabled,true);assert.notEqual(actions[3].props.disabled,true);
  assert.ok(tree.some(n=>n.type==="HomeIntro"));
  if(snapshot)assert.ok(tree.some(n=>n.props?.label==="Resume Draft"));
  else assert.equal(actions[1].props.disabledDetail,"Opening your memories…");
 }
});
test("Find and Settings both retain a direct Browse all memories route",()=>{
 for(const [name,pathname] of [["EngFind","/answers"],["EngMore","/more"]]){
  const f=screens(null,pathname);
  const browse=all(f.api[name]()).find(n=>n.props?.label==="Browse all memories");
  assert.ok(browse);browse.props.onPress();
  assert.deepEqual(f.routes,["/memories"]);
 }
});
test("all four tab presses still use the navigation guard and notification responses stay blocked during edits",()=>{
 const routes=[],effects=[];let blocked=true,responseHandler,guarded=0;
 const api=load("app/_layout.tsx",{
  react:{...react,useEffect:fn=>effects.push(fn)},
  "react-native":{Pressable:"Pressable",Text:"Text",View:"View",useWindowDimensions:()=>({width:390,fontScale:1})},
  "expo-router":{Slot:"Slot",router:{navigate:route=>routes.push(route),push:route=>routes.push(route)},usePathname:()=>"/memories",useRootNavigationState:()=>({key:"ready"})},
  "react-native-safe-area-context":{SafeAreaView:"SafeAreaView",SafeAreaProvider:"SafeAreaProvider",useSafeAreaInsets:()=>({left:0,right:0})},
  "expo-status-bar":{StatusBar:"StatusBar"},"../state":{Provider:"Provider"},
  "../ui":{useTheme:()=>({colors:{},s:{}})},"../brand-web-meta":{BrandWebMeta:"BrandWebMeta"},
  "../accepted-navigation-icon":{AcceptedNavigationIcon:"NavigationIcon"},
  "../primary-navigation-layout":{primaryNavigationRows},
  "../eng-navigation":{guardedNavigate:fn=>{guarded++;if(!blocked)fn();},navigationIsGuarded:()=>blocked},
  "../reminder-alerts":{startReminderResponses:fn=>{responseHandler=fn;return()=>{};},startReminderAlerts:()=>{}},
 },"\nmodule.exports.Shell = Shell;");
 const tabs=all(api.Shell()).filter(n=>n.props?.accessibilityRole==="tab");
 assert.deepEqual(tabs.map(n=>n.props.accessibilityLabel),["Home","Photos","Reminders","Find"]);
 assert.equal(tabs[3].props.accessibilityState.selected,true);
 tabs.forEach(n=>n.props.onPress());assert.equal(guarded,4);assert.deepEqual(routes,[]);
 effects.forEach(fn=>fn());assert.equal(responseHandler("/card"),false);
 blocked=false;tabs.forEach(n=>n.props.onPress());assert.deepEqual(routes,["/","/photos","/reminders","/answers"]);
 assert.equal(responseHandler("/card"),true);
});
function brand(file,width=390,fontScale=1,large=false) {
 return load(file,{react,"react-native":{Image:"Image",Text:"Text",View:"View",useWindowDimensions:()=>({width,fontScale})},
 "./ui":{Copy:"Copy",useTheme:()=>({colors:{white:"#fff"},dark:false})},"./state":{useData:()=>({large})}},
 "\nmodule.exports.LocalDate = LocalDate;");
}
test("brand keeps one accessible logo and full uncapped date on native and web",()=>{
 for(const file of ["brand.tsx","brand.web.tsx"]){
  const api=brand(file),tree=all(api.BrandLogo({}));
  assert.equal(tree.filter(n=>n.props?.accessibilityRole==="image").length,1);
  assert.ok(tree.find(n=>n.type==="Image").props["aria-hidden"]);
  const date=all(api.LocalDate({}));
  for(const n of date.filter(n=>n.type==="Copy")){
   assert.equal(n.props.numberOfLines,undefined);assert.equal(n.props.maxFontSizeMultiplier,undefined);
  }
 }
});
test("header stacks for narrow, enlarged native or in-app text without imposing a fixed height",()=>{
 for(const [width,fontScale,large,expected] of [[390,1,false,"row"],[320,1,false,"column"],[390,2,false,"column"],[390,1,true,"column"]]){
  const header=brand("brand.tsx",width,fontScale,large).BrandHeader();
  assert.equal(header.props.style.flexDirection,expected);assert.equal(header.props.style.height,undefined);
 }
});
