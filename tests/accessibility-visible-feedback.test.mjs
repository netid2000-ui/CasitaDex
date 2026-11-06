import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import ts from "typescript";
const root = process.env.CASITADEX_A11Y_SOURCE_ROOT || path.resolve(import.meta.dirname, "..");
const reminderError = "Memory reminders could not refresh.";
const preferenceError = "This reading setting applies now but could not be saved. Select it again to retry.";
function load(file, mocks, extra = "") {
  const code = ts.transpileModule(fs.readFileSync(path.join(root, "src", file), "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.React },
  }).outputText;
  const mod = { exports: {} };
  vm.runInNewContext(code + extra, { module: mod, exports: mod.exports, require: name => {
    assert.ok(name in mocks, "Unexpected import " + name); return mocks[name];
  }, Set, Math, Date, JSON });
  return mod.exports;
}
// Small commit/effect harness for actual components. It does not emulate native speech.
function fixture({ screen = "EngReminders", os = "ios", initialError = "", rows = [] } = {}) {
  const scopes = new Map(); let active, queue = [], visited, tree;
  const f = { spoken: [], route: screen === "EngMore" ? "/more" : "/reminders", params: {},
    e: { snapshot: { data: { memories: [] } }, status: initialError, busy: false, refresh: async () => {},
      setStatus: value => { f.e.status = value; } },
    preferences: { large: false, appearance: "Light", preferenceError: "",
      setLarge: value => { f.preferences.large = value; }, setAppearance: value => { f.preferences.appearance = value; } },
  };
  const slot = create => {
    const i = active.index++;
    if (!(i in active.slots)) active.slots[i] = create(i);
    return active.slots[i];
  };
  const equal = (a,b) => a && b && a.length === b.length && a.every((v,i) => Object.is(v,b[i]));
  const react = {
    Fragment: "Fragment",
    createElement: (type, props, ...children) => ({ type, props: { ...props, children } }),
    useState: initial => {
      const cell = slot(i => ({ value: active.key === "root" && screen === "EngReminders" && i === 0
        ? rows : typeof initial === "function" ? initial() : initial }));
      return [cell.value, value => { cell.value = typeof value === "function" ? value(cell.value) : value; }];
    },
    useRef: initial => slot(() => ({ current: initial })),
    useMemo: (fn,deps) => { const cell=slot(()=>({})); if(!equal(cell.deps,deps)){cell.value=fn();cell.deps=deps;} return cell.value; },
    useCallback: (fn,deps) => react.useMemo(()=>fn,deps),
    useEffect: (fn,deps) => { const cell=slot(()=>({})); if(!equal(cell.deps,deps)){cell.deps=deps;queue.push(()=>{cell.cleanup?.();cell.cleanup=fn();});} },
    useReducer: (reducer, initial, init) => { const cell=slot(()=>({value:init?init(initial):initial})); return [cell.value, action=>{cell.value=reducer(cell.value,action);}]; },
  };
  const native = { Platform: { OS: os }, AppState: { currentState: "active", addEventListener: () => ({ remove() {} }) },
    AccessibilityInfo: { announceForAccessibilityWithOptions: (text,options) => f.spoken.push({text,options}) },
    BackHandler: { addEventListener: () => ({ remove() {} }) }, Alert: { alert() {} },
    View:"View", ScrollView:"ScrollView", Image:"Image", Pressable:"Pressable", Text:"Text", Modal:"Modal",
    useWindowDimensions: () => ({ width:390,height:844 }),
  };
  f.native=native;
  const feedback=load("accessibility-feedback.ts",{react,"react-native":native});
  f.feedback=feedback;
  const ui={Button:"Button",Copy:"Copy",Field:"Field",Page:"Page",useTheme:()=>({s:{panel:{}},colors:{},dark:false})};
  const mocks={react,"react-native":native,"./ui":ui,"./accessibility-feedback":feedback,
    "expo-router":{useFocusEffect:()=>{},useLocalSearchParams:()=>f.params,usePathname:()=>f.route},
    "./state":{useData:()=>f.preferences},"./eng-find":{defaultFilter:()=>({})},
    "./eng-domain":{localDay:()=>"2026-11-06"},
    "./reminder-notification-target":{reminderNotificationTarget:value=>typeof value==="string"?value:null},
    "./reminder-notification-projection":{listLinkedReminderMemories:()=>[]},
    "./standalone-reminder-draft":{defaultReminderDay:()=>"2026-11-07",isReminderDraftDirty:()=>false,
      newReminderDraft:dueDate=>({title:"",notes:"",dueDate,dueTime:"09:00",repeat:"once"})},
    "./backup-review":{emptyBackupReview:()=>({}),backupReviewReducer:(s)=>s},
    "./brand":{BrandHeader:"BrandHeader",BrandLogo:"BrandLogo",BrandArt:"BrandArt"},
    "./editorial-intro":{EditorialIntro:"EditorialIntro"},
    "./eng-navigation":{registerEditGuard:()=>()=>{}},
    "./memory-navigation":{},"./action-page":{ActionPage:"ActionPage"},"./share-session":{},
  };
  for(const name of ["./reminder-alerts","@react-native-community/datetimepicker","./eng-runtime","./eng-store","./standalone-reminders","./eng-text-backup","./eng-duplicates","./photo-viewer-state","./home-action","./model"])mocks[name]??={};
  const screens=load("eng-screens.tsx",mocks,"\nmodule.exports.__setEng = value => { useEng = () => value; };");
  screens.__setEng(f.e);
  function call(fn,props,key) {
    let scope=scopes.get(key); if(!scope){scope={slots:[],key,index:0};scopes.set(key,scope);}
    visited.add(key);const old=active;active=scope;scope.index=0;const result=fn(props);active=old;return result;
  }
  function resolve(node,key) {
    if(Array.isArray(node))return node.map((n,i)=>resolve(n,key+"."+i));
    if(!node || typeof node!=="object")return node;
    if(typeof node.type==="function")return resolve(call(node.type,node.props,key),key+".render");
    return {...node,props:{...node.props,children:resolve(node.props.children,key+".children")}};
  }
  f.render=()=>{queue=[];visited=new Set();tree=resolve(call(screens[screen],{},"root"),"root.render");
    for(const [key,scope] of scopes)if(!visited.has(key)){for(const cell of scope.slots)cell.cleanup?.();scopes.delete(key);}
    for(const effect of queue)effect();return tree;
  };
  f.unmount=()=>{for(const scope of scopes.values())for(const cell of scope.slots)cell.cleanup?.();scopes.clear();};
  const flat=node=>Array.isArray(node)?node.flatMap(flat):node&&typeof node==="object"?[node,...flat(node.props?.children)]:[];
  f.nodes=()=>flat(tree);
  f.press=label=>{const button=f.nodes().find(n=>n.props.label===label);assert.ok(button,"Missing "+label);button.props.onPress();f.render();};
  f.textNode=text=>f.nodes().find(n=>n.type==="Copy"&&n.props.children.includes(text));
  return f;
}
test("regression: newly visible linked refresh failure reaches iOS announcer once",()=>{
  const f=fixture();f.render();f.e.status="Synthetic store failure";f.render();
  assert.equal(f.spoken.length,1);assert.equal(f.spoken[0].text,reminderError);
  f.render();assert.equal(f.spoken.length,1);
});
test("regression: newly failed reading-setting save announces useful recovery",()=>{
  const f=fixture({screen:"EngMore"});f.render();f.press("Appearance & Accessibility");
  f.press("Large text");f.preferences.preferenceError=preferenceError;f.render();
  assert.equal(f.spoken.length,1);assert.equal(f.spoken[0].text,preferenceError);
});
test("regression: disabled Home hint matches the visible reason",()=>{
  const react={createElement:(type,props,...children)=>({type,props:{...props,children}})};
  const home=load("home-action.tsx",{react,"react-native":{Pressable:"Pressable",Text:"Text",View:"View"},
    "./ui":{Copy:"Copy",useTheme:()=>({dark:false,colors:{}})},"./state":{useData:()=>({large:false})},
    "./accepted-navigation-icon":{AcceptedNavigationIcon:"Icon"}});
  for(const disabledDetail of ["Finish your existing draft first","Opening your memories…","Memory editing is available in the native app"]){
    const h=home.HomeAction({title:"Add Memory",detail:"Capture a useful detail",icon:"Memories",disabled:true,disabledDetail,onPress(){}});
    assert.equal(h.props.accessibilityHint,disabledDetail);assert.equal(h.props.accessibilityRole,"button");assert.equal(h.props.accessibilityState.disabled,true);
  }
  const enabled=home.HomeAction({title:"Add Memory",detail:"Capture a useful detail",icon:"Memories",onPress(){}});
  assert.equal(enabled.props.accessibilityHint,"Capture a useful detail");
});
test("linked failure while editing stays quiet when the old error becomes visible",()=>{
  const f=fixture();f.render();f.press("Create Reminder");f.e.status="Hidden failure";f.render();
  assert.equal(f.spoken.length,0);f.press("Cancel");assert.equal(f.spoken.length,0);
  f.e.status="";f.render();f.e.status="New visible failure";f.render();assert.equal(f.spoken.length,1);
});
test("selected-notification and unfocused linked errors are consumed without replay",()=>{
  const f=fixture({rows:[{id:"synthetic",title:"Synthetic",dueDate:"2026-11-07",dueTime:"09:00",repeat:"once"}]});
  f.render();f.params.reminder="synthetic";f.render();f.e.status="Hidden target failure";f.render();
  f.params={};f.render();assert.equal(f.spoken.length,0);
  f.route="/photos";f.render();f.e.status="Other hidden failure";f.render();f.route="/reminders";f.render();assert.equal(f.spoken.length,0);
  f.e.status="";f.render();f.e.status="Visible failure";f.render();assert.equal(f.spoken.length,1);
});
test("initial linked errors and remounts stay quiet",()=>{
  const f=fixture({initialError:"Existing failure"});f.render();assert.equal(f.spoken.length,0);
  f.unmount();f.render();assert.equal(f.spoken.length,0);
});
test("existing preference error on panel opening or remount is not replayed",()=>{
  const f=fixture({screen:"EngMore"});f.preferences.preferenceError=preferenceError;f.render();f.press("Appearance & Accessibility");
  assert.equal(f.spoken.length,0);f.press("Back to More");f.press("Appearance & Accessibility");assert.equal(f.spoken.length,0);
  f.unmount();f.render();f.press("Appearance & Accessibility");assert.equal(f.spoken.length,0);
  f.preferences.preferenceError="";f.render();f.preferences.preferenceError=preferenceError;f.render();assert.equal(f.spoken.length,1);
});
test("preference errors arriving on a hidden route do not replay when returning",()=>{
  const f=fixture({screen:"EngMore"});f.render();f.press("Appearance & Accessibility");
  f.route="/";f.render();f.preferences.preferenceError=preferenceError;f.render();f.route="/more";f.render();assert.equal(f.spoken.length,0);
});
test("Android live regions notify changed visible failures only",()=>{
  const r=fixture({os:"android"});r.render();r.e.status="Visible failure";r.render();
  assert.equal(r.textNode(reminderError).props.accessibilityLiveRegion,"polite");assert.equal(r.spoken.length,0);
  r.render();assert.equal(r.textNode(reminderError).props.accessibilityLiveRegion,"polite","unrelated rerender retains live region eligibility");
  r.press("Create Reminder");r.e.status="Hidden failure";r.render();r.press("Cancel");
  assert.equal(r.textNode(reminderError).props.accessibilityLiveRegion,"none");
  const p=fixture({screen:"EngMore",os:"android"});p.preferences.preferenceError=preferenceError;p.render();p.press("Appearance & Accessibility");
  assert.equal(p.textNode(preferenceError).props.accessibilityLiveRegion,"none");
  p.preferences.preferenceError="";p.render();p.preferences.preferenceError=preferenceError;p.render();
  assert.equal(p.textNode(preferenceError).props.accessibilityLiveRegion,"polite");assert.equal(p.spoken.length,0);
});
test("background errors stay quiet, do not replay, and permit a later new visible failure",()=>{
  const f=fixture();f.render();f.native.AppState.currentState="background";f.e.status="Background failure";f.render();
  f.native.AppState.currentState="active";f.render();assert.equal(f.spoken.length,0);
  f.e.status="";f.render();f.e.status="Visible failure";f.render();assert.equal(f.spoken.length,1);
  const p=fixture({screen:"EngMore",os:"android"});p.render();p.press("Appearance & Accessibility");
  p.native.AppState.currentState="background";p.preferences.preferenceError=preferenceError;p.render();
  assert.equal(p.textNode(preferenceError).props.accessibilityLiveRegion,"none");
});
test("visibility wrapper preserves privacy, autosave quietness, and disposal",()=>{
  const f=fixture();const a=f.feedback.createVisibleStatusAnnouncer("",true);
  a.update("Draft saved on this device.",true);assert.equal(f.spoken.length,0);
  a.update("Synthetic private-looking /sandbox/fixture",true);assert.equal(f.spoken[0].text,"Status updated. Review the status message for details.");
  a.update("Another private-looking fixture",true);assert.equal(f.spoken.length,1);
  a.update("Saved on this device.",false);a.update("Saved on this device.",true);assert.equal(f.spoken.length,1);
  a.stop();a.update("Reminder updated.",true);assert.equal(f.spoken.length,1);
});
