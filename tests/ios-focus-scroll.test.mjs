import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import ts from "typescript";

const root = process.env.CASITADEX_FOCUS_SOURCE_ROOT || path.resolve(import.meta.dirname, "..");
function fixture(os = "ios") {
  const state = { active: true, keyboard: true, owned: true, viewport: [0, 71, 874, 107],
    field: [22, 1455, 358, 173], deferred: false };
  const slots = [], effects = [], frames = new Map(), measurements = [], calls = [], listeners = new Map(), navigationListeners = new Map();
  let cursor = 0, frameId = 0, measureCount = 0, cleanup;
  const same = (a,b) => a && b && a.length === b.length && a.every((x,i) => Object.is(x,b[i]));
  const react = {
    createElement: (type, props, ...children) => ({ type, props: { ...props, children } }),
    useState(initial) { const i=cursor++; slots[i] ??= { value: initial }; return [slots[i].value, update => {
      slots[i].value = typeof update === "function" ? update(slots[i].value) : update; }]; },
    useRef(initial) { const i=cursor++; slots[i] ??= { current: initial }; return slots[i]; },
    useCallback(fn,deps) { const i=cursor++; if (!same(slots[i]?.deps,deps)) slots[i]={ value: fn, deps }; return slots[i].value; },
    useEffect(fn,deps) { const i=cursor++; if (!same(slots[i]?.deps,deps)) effects.push(() => {
      slots[i]?.cleanup?.(); slots[i]={ deps, cleanup: fn() }; }); },
  };
  const measure = (coords,cb) => { measureCount++; const run=()=>cb(...coords);
    if(state.deferred) measurements.push(run); else run(); };
  const input = { measureInWindow: cb => measure(state.field,cb) };
  state.focusedInput = input;
  const native = { contains: n => state.owned && n === input, measureInWindow: cb => measure(state.viewport,cb) };
  const scroll = { getNativeScrollRef: () => native, scrollTo: options => calls.push(options) };
  const keyboard = { isVisible: () => state.keyboard, addListener: (name,fn) => {
    if(!listeners.has(name))listeners.set(name,new Set());listeners.get(name).add(fn);
    return { remove:()=>listeners.get(name).delete(fn) }; } };
  const navigation = { isFocused:()=>state.active, addListener:(name,fn)=>{
    if(!navigationListeners.has(name))navigationListeners.set(name,new Set());
    navigationListeners.get(name).add(fn);return ()=>navigationListeners.get(name).delete(fn);
  }};
  const rn = { Platform:{OS:os}, Keyboard:keyboard, TextInput:{State:{currentlyFocusedInput:()=>state.focusedInput}},
    KeyboardAvoidingView:"KeyboardAvoidingView", ScrollView:"ScrollView", View:"View",
    useWindowDimensions:()=>({fontScale:3.571}) };
  function load(file,mocks) {
    const code=ts.transpileModule(fs.readFileSync(path.join(root,"src",file),"utf8"),{
      compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.React}
    }).outputText;
    const mod={exports:{}};
    vm.runInNewContext(code,{module:mod,exports:mod.exports,
      requestAnimationFrame:fn=>{const id=++frameId;frames.set(id,fn);return id;},
      cancelAnimationFrame:id=>frames.delete(id),
      require:name=>{assert.ok(name in mocks,"Unexpected import "+name);return mocks[name];}});
    return mod.exports;
  }
  const focusPath=path.join(root,"src/use-ios-focus-scroll.ts");
  const focus=fs.existsSync(focusPath) ? load("use-ios-focus-scroll.ts",{
    react,"react-native":rn,"expo-router":{useNavigation:()=>navigation}
  }) : {};
  const {ActionPage}=load("action-page.tsx",{
    react,"react-native":rn,
    "react-native-safe-area-context":{useSafeAreaInsets:()=>({top:0})},
    "./ui":{Button:"Button",Copy:"Copy",useTheme:()=>({colors:{paper:"paper",muted:"muted"},s:{page:{},container:{}}})},
    "./state":{useData:()=>({large:true})},
    "./action-page-layout":load("action-page-layout.ts",{}),"./use-ios-focus-scroll":focus
  });
  const editor={type:"EditorProbe",props:{children:[],session:"same-dirty-editor"}};
  const props={title:"Editing memory",actions:[{label:"Cancel",onPress:()=>{}},{label:"Save",onPress:()=>{}}],children:editor};
  const flat=n=>Array.isArray(n)?n.flatMap(flat):n&&typeof n==="object"?[n,...flat(n.props.children)]:[];
  let tree,content;
  function render(){
    cursor=0;tree=ActionPage(props);content=flat(tree).find(n=>n.props.testID==="memory-content-region");
    if(content.props.ref)content.props.ref.current=scroll;
    while(effects.length)effects.shift()();
    return tree;
  }
  function flush(){for(let i=0;frames.size&&i<10;i++){const batch=[...frames.values()];frames.clear();batch.forEach(fn=>fn());}}
  function size(height=3000){assert.equal(typeof content.props.onContentSizeChange,"function","Reflow must reconcile focused input");content.props.onContentSizeChange(874,height);}
  function event(name){for(const fn of listeners.get(name)||[])fn();}
  function navEvent(name){for(const fn of navigationListeners.get(name)||[])fn();}
  function offset(y,geometry={}){content.props.onScroll({nativeEvent:{contentOffset:{y},...geometry}});}
  function unmount(){for(const slot of slots)slot?.cleanup?.();cleanup=true;}
  render();
  return {state,input,scroll,native,calls,listeners,navigationListeners,frames,measurements,render,flush,size,event,navEvent,offset,unmount,
    get content(){return content;},get tree(){return tree;},editor,flat,get measureCount(){return measureCount;},get cleanup(){return cleanup;}};
}

test("actual iOS ActionPage reconciles retained dirty focus after extreme rotation reflow",()=>{
 const f=fixture();f.size();f.flush();
 assert.equal(f.calls.length,1);assert.equal(f.calls[0].y,1417);assert.equal(f.calls[0].animated,false);
 assert.ok(f.flat(f.tree).includes(f.editor));assert.equal(f.tree.props.key,undefined);
 assert.equal(f.tree.props.behavior,"padding");
 assert.equal(f.content.props.automaticallyAdjustKeyboardInsets,false);
 const action=f.flat(f.tree).find(n=>n.props.testID==="memory-action-region");
 assert.equal(action.props.ref,undefined,"Never scroll the action pane to reveal an input");
});
test("fully visible field is unchanged",()=>{const f=fixture();f.state.viewport=[0,255,402,291];f.state.field=[22,256,358,173];f.size();f.flush();assert.equal(f.calls.length,0);});
test("below-viewport field uses only the measured bottom delta",()=>{const f=fixture();f.state.viewport=[0,274,402,272];f.state.field=[22,500,358,173];f.size();f.flush();assert.equal(f.calls[0].y,127);});
test("above-viewport field uses only the measured top delta",()=>{const f=fixture();f.state.viewport=[0,274,402,272];f.state.field=[22,76,358,173];f.offset(400);f.size();f.flush();assert.equal(f.calls[0].y,202);});
test("oversized field is centered, not falsely claimed completely visible",()=>{const f=fixture();f.size();f.flush();const y=f.state.field[1]-f.calls[0].y;assert.equal(y,38);assert.equal(y+173/2,71+107/2);});
test("scroll correction is clamped to available content",()=>{const f=fixture();f.size(200);f.flush();assert.equal(f.calls[0].y,93);});
test("no current or foreign focus causes no measurement",()=>{for(const foreign of [false,true]){const f=fixture();if(foreign)f.state.owned=false;else f.state.focusedInput=null;f.size();f.flush();assert.equal(f.measureCount,0);assert.equal(f.calls.length,0);}});
test("hidden keyboard causes no scrolling",()=>{const f=fixture();f.state.keyboard=false;f.size();f.flush();assert.equal(f.measureCount,0);});
test("new focus invalidates asynchronous measurements",()=>{const f=fixture();f.state.deferred=true;f.size();f.flush();f.state.focusedInput={};f.measurements.shift()();assert.equal(f.calls.length,0);assert.equal(f.measurements.length,0);});
test("blur invalidates asynchronous input measurement",()=>{const f=fixture();f.state.deferred=true;f.size();f.flush();f.measurements.shift()();f.state.focusedInput=null;f.measurements.shift()();assert.equal(f.calls.length,0);});
test("new layout invalidates old measurements",()=>{const f=fixture();f.state.deferred=true;f.size();f.flush();f.content.props.onLayout();f.measurements.shift()();assert.equal(f.calls.length,0);});
test("offset movement invalidates measurement without a scroll feedback loop",()=>{const f=fixture();f.state.deferred=true;f.size();f.flush();f.offset(42);f.measurements.shift()();assert.equal(f.calls.length,0);assert.equal(f.frames.size,0);});
test("user drag and momentum suppress reconciliation",()=>{const f=fixture();f.size();f.content.props.onScrollBeginDrag();f.flush();f.event("keyboardDidChangeFrame");f.flush();assert.equal(f.calls.length,0);f.content.props.onScrollEndDrag();f.content.props.onMomentumScrollBegin();f.size();f.flush();assert.equal(f.calls.length,0);f.content.props.onMomentumScrollEnd();assert.equal(f.frames.size,0);});
test("inactive route removes listeners and invalidates pending callback",()=>{const f=fixture();f.state.deferred=true;f.size();f.flush();f.state.active=false;f.navEvent("blur");f.render();f.measurements.shift()();assert.equal(f.calls.length,0);assert.equal([...f.listeners.values()].reduce((n,s)=>n+s.size,0),0);});
test("unmount invalidates measurements and cancels frame work",()=>{const f=fixture();f.state.deferred=true;f.size();f.flush();f.unmount();f.measurements.shift()();assert.equal(f.calls.length,0);assert.equal(f.frames.size,0);});
test("completed keyboard frame schedules fresh bounded geometry",()=>{const f=fixture();f.size();f.event("keyboardWillChangeFrame");f.flush();assert.equal(f.calls.length,0);f.event("keyboardDidChangeFrame");f.flush();assert.equal(f.calls[0].y,1417);});
test("nonfinite or empty measurements are ignored",()=>{for(const height of [0,NaN]){const f=fixture();f.state.viewport[3]=height;f.size();f.flush();assert.equal(f.calls.length,0);}});
for(const os of ["android","web"])test(os+" keeps existing behavior without native focus listeners or callbacks",()=>{const f=fixture(os);assert.equal(f.listeners.size,0);assert.equal(f.navigationListeners.size,0);assert.equal(f.content.props.ref,undefined);assert.equal(f.content.props.onLayout,undefined);assert.equal(f.content.props.onScroll,undefined);f.flush();assert.equal(f.measureCount,0);assert.equal(f.calls.length,0);});

test("second layout before native acknowledgment cannot double the scroll delta",()=>{
 const f=fixture();f.size();f.flush();assert.equal(f.calls[0].y,1417);
 f.size();f.flush();assert.equal(f.calls.length,1);
 f.offset(0);f.flush();assert.equal(f.calls.length,1,"Old unchanged scroll event is not acknowledgment");
 f.state.field[1]-=1417;f.offset(1417);f.flush();assert.equal(f.calls.length,1,"Settled geometry needs no second correction");
});
test("reflow requested during pending scroll is measured after actual acknowledgment",()=>{
 const f=fixture();f.size();f.flush();
 f.state.field[1]=2000;f.size();f.flush();assert.equal(f.calls.length,1);
 f.state.field[1]-=1417;f.offset(1417);f.flush();
 assert.equal(f.calls.length,2);assert.equal(f.calls[1].y,1962);
});
test("drag interrupted by navigation resets on route refocus",()=>{
 const f=fixture();f.size();f.content.props.onScrollBeginDrag();
 f.state.active=false;f.navEvent("blur");f.state.active=true;f.navEvent("focus");f.flush();
 assert.equal(f.calls.length,1);assert.equal(f.calls[0].y,1417);
});
test("keyboard hide and manual drag cancel unacknowledged command latch",()=>{
 for(const reset of ["hide","drag"]){
  const f=fixture();f.size();f.flush();assert.equal(f.calls.length,1);
  if(reset==="hide"){f.state.keyboard=false;f.event("keyboardWillHide");f.state.keyboard=true;f.event("keyboardDidShow");}
  else{f.content.props.onScrollBeginDrag();f.content.props.onScrollEndDrag();f.size();}
  f.flush();assert.equal(f.calls.length,2);
 }
});

test("delayed earlier nonmatching scroll cannot acknowledge command during deferred reflow",()=>{
 const f=fixture();f.size();f.flush();assert.equal(f.calls[0].y,1417);
 f.size();f.offset(42,{contentSize:{height:3000},layoutMeasurement:{height:107}});f.flush();
 assert.equal(f.calls.length,1,"Earlier movement must leave native correction pending");
 f.state.field[1]-=1417;f.offset(1417,{contentSize:{height:3000},layoutMeasurement:{height:107}});f.flush();
 assert.equal(f.calls.length,1);
});
test("actual native content clamp can acknowledge a pending command",()=>{
 const f=fixture();f.size();f.flush();
 f.state.field=[22,50,358,80];f.size(200);
 f.offset(93,{contentSize:{height:200},layoutMeasurement:{height:107}});f.flush();
 assert.equal(f.calls.length,2,"Clamped acknowledgment permits the deferred fresh measurement");
 assert.equal(f.calls[1].y,72);
});
