import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
function harness(){
 const state=[];let cursor=0,backHandler;const calls=[];
 const e={snapshot:{revision:7,data:{spaces:[{id:'a',name:'Garage'}],categories:[{id:'b',name:'Manuals'}],locations:[{id:'loc',name:'Top shelf',spaceId:'a'}]}},status:'',busy:false,setStatus:s=>{e.status=s;},run:async(fn)=>{try{await fn(store);return true;}catch(err){e.status=err.message;return false;}}};
 const store={taxonomy:async(...args)=>{calls.push(['create',...args]);if(args[1]==='Duplicate')throw Error('That name already exists');},renameTaxonomy:async(...args)=>calls.push(['rename',...args]),taxonomyImpact:async()=>({kind:'space',id:'a',name:'Garage',revision:7,memories:2,draft:true}),removeTaxonomy:async(...args)=>calls.push(['remove',...args])};
 const jsx=(type,props)=>({type,props:props??{}});
 const mocks={'react':{useState:v=>{const i=cursor++;if(!(i in state))state[i]=v;return [state[i],v=>{state[i]=v;}];},useEffect:fn=>fn(),Fragment:'Fragment'},'react/jsx-runtime':{jsx,jsxs:jsx},'react-native':{View:'View',Pressable:'Pressable',Alert:{alert:()=>calls.push(["keep editing"])},BackHandler:{addEventListener:(_,fn)=>{backHandler=fn;return {remove(){}};}},useWindowDimensions:()=>({fontScale:1})},'expo-router':{router:{replace:()=>calls.push(['leave'])}},'react-native-svg':{SvgXml:'SvgXml'},'./ui':{Button:'Button',Copy:'Copy',Field:'Field',Page:'Page',useTheme:()=>({colors:{},dark:false})},'./memory-editor-controls':{MemoryEditorIcon:'Icon'},'./use-status-announcement':{useStatusAnnouncement:()=>{}},'./state':{useData:()=>({large:false})},'./plus-entitlement-runtime':{plusFeatureEnforcementEnabled:true},'./eng-navigation':{registerEditGuard:()=>()=>{}}};
 const source=fs.readFileSync(new URL('../src/label-management.tsx',import.meta.url),'utf8');
 const module={exports:{}};vm.runInNewContext(ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText,{module,exports:module.exports,require:id=>id.endsWith('.svg')?'svg':mocks[id]});
 const walk=n=>!n||typeof n!=='object'?[]:Array.isArray(n)?n.flatMap(walk):[n,...walk(n.props?.stickyActions),...walk(n.props?.children)];
 function render(){cursor=0;return walk(module.exports.LabelManagement({e}));}
 const click=async(label)=>{const n=render().find(n=>n.props.label===label||n.props.accessibilityLabel===label);assert.ok(n,label);n.props.onPress();await new Promise(r=>setImmediate(r));};
 const input=value=>render().find(n=>n.type==='Field').props.onChangeText(value);
 return {e,calls,render,click,input,back:()=>{render();return backHandler();}};
}
test('create cancel does not persist; failed save keeps entered name and editor',async()=>{
 const h=harness();await h.click('Create new label');h.input('Draft label');await h.click('Cancel');assert.equal(h.calls.length,0);
 await h.click('Create new label');h.input('Duplicate');await h.click('Save');
 assert.equal(h.render().find(n=>n.type==='Field').props.value,'Duplicate');assert.match(h.e.status,/already exists/);
 h.input('Office');await h.click('Save');assert.equal(h.render().some(n=>n.props.label==='Space name'),false);assert.deepEqual(h.calls.at(-1),['create','space','Office',7]);
});
test('rename uses captured revision and cancel returns to selected details',async()=>{
 const h=harness();await h.click('Garage');await h.click('Rename ›');h.input('Workshop');await h.click('Cancel');assert.equal(h.calls.length,0);
 await h.click('Rename ›');assert.equal(h.render().find(n=>n.type==='Field').props.value,'Garage');h.input('Workshop');await h.click('Save');assert.deepEqual(h.calls[0],['rename','space','a','Workshop',7]);
});
test('removal requires review and confirmation; cancellation is read-only',async()=>{
 const h=harness();await h.click('Garage');await h.click('Review removal ›');assert.equal(h.calls.length,0);await h.click('Cancel label removal');assert.equal(h.calls.length,0);
 await h.click('Review removal ›');await h.click('Confirm remove label only');assert.deepEqual(h.calls[0],['remove','space','a',7]);assert.equal(h.render().some(n=>n.props.accessibilityLabel==='Create new label'),true);
});
test('category create uses its own taxonomy and Save disables blank names',async()=>{
 const h=harness();await h.click('Categories');await h.click('Create new label');assert.equal(h.render().find(n=>n.props.label==='Save').props.disabled,true);h.input('Warranties');await h.click('Save');assert.deepEqual(h.calls[0],['create','category','Warranties',7]);
});

test("Android Back keeps unsaved label edits",async()=>{const h=harness();await h.click("Create new label");h.input("Unsaved");h.back();assert.equal(h.render().find(n=>n.type==="Field").props.value,"Unsaved");assert.deepEqual(h.calls,[["keep editing"]]);});

test('location management scopes creation to the selected Space and retains invalid edits',async()=>{const h=harness();await h.click('Locations');await h.click('Space: Unassigned');await h.click('Garage');await h.click('Create new label');h.input('Shelf');await h.click('Save');assert.deepEqual(h.calls.at(-1),['create','location','Shelf',7,'a']);await h.click('Top shelf');await h.click('Rename ›');h.input('Upper shelf');await h.click('Save');assert.deepEqual(h.calls.at(-1),['rename','location','loc','Upper shelf',7]);});
