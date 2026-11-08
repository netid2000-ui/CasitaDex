import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import ts from 'typescript';
import {photoZoomScale,touchDistance} from '../src/photo-zoom.ts';

// Render the actual component with deterministic hooks/native primitives. This verifies
// structure and interaction state, not native text metrics or screen-reader acceptance.
const source=readFileSync(new URL('../src/photo-memory-viewer.tsx',import.meta.url),'utf8');
const compiled=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.React,esModuleInterop:true}}).outputText;
const title='SB40 Draft Cap iOS QA 20261108';
function harness(profile={}){
 const viewport={width:402,height:874,fontScale:1,large:false,...profile};
 const snapshot={revision:1,data:{memories:[]},draft:{id:'draft',title,photos:Array.from({length:5},(_,i)=>({id:`photo-${i+1}`,path:`private-${i+1}.png`}))}};
 const states=[snapshot],refs=[];let stateIndex=0,refIndex=0,closed=0,returned=0;
 const react={
  createElement:(type,props,...children)=>({type,props:{...props,children:children.flat(Infinity)}}),
  useState(initial){const i=stateIndex++;if(!(i in states))states[i]=typeof initial==='function'?initial():initial;return[states[i],next=>{states[i]=typeof next==='function'?next(states[i]):next;}];},
  useRef(initial){const i=refIndex++;return refs[i]??(refs[i]={current:initial});},
  useCallback:fn=>fn,useMemo:fn=>fn(),useEffect:()=>{},
 };
 const native={Alert:{alert:()=>{}},PanResponder:{create:()=>({panHandlers:{}})},useWindowDimensions:()=>viewport,...Object.fromEntries(['Image','Pressable','ScrollView','Text','View'].map(name=>[name,name]))};
 const imports={react,'react-native':native,'react-native-safe-area-context':{SafeAreaProvider:'SafeAreaProvider',SafeAreaView:'SafeAreaView',initialWindowMetrics:null},'./photo-zoom':{photoZoomScale,touchDistance},'./state':{useData:()=>({large:viewport.large})},'./photo-order':{orderedMemoryPhotos:()=>[],movedPhoto:()=>{throw Error('Unexpected reorder');}},'./eng-runtime':{engPhotoUri:path=>path,getEngStore:()=>{throw Error('Unexpected store mutation');},chooseEngPhoto:()=>{throw Error('Unexpected picker');}}};
 const module={exports:{}};
 runInNewContext(compiled,{module,exports:module.exports,require:name=>{assert.ok(name in imports,name);return imports[name];}});
 return{
  viewport,snapshot,
  render(){stateIndex=0;refIndex=0;return module.exports.PhotoMemoryViewer({draftId:'draft',initialPhotoId:'photo-1',onClose:()=>closed++,onViewMemory:()=>returned++});},
  counts:()=>({closed,returned}),
 };
}
function nodes(node){return node&&typeof node==='object'?[node,...(node.props.children??[]).flatMap(nodes)]:[];}
function byId(tree,id){return nodes(tree).find(n=>n.props.testID===id);}
function button(tree,label){const node=nodes(tree).find(n=>n.props.accessibilityLabel===label&&n.type==='Pressable');assert.ok(node,`Missing ${label}`);return node;}
function style(node){return Object.assign({},...[node.props.style].flat());}
function contents(node){return(node.props.children??[]).map(child=>child&&typeof child==='object'?contents(child):child??'').join('');}
function assertReflow(tree,expected){
 const controls=byId(tree,'photo-viewer-controls'),summary=byId(tree,'photo-viewer-summary');
 assert.equal(nodes(controls).includes(summary),expected,'Only the unconstrained header may pin the full title');
 assert.equal(contents(summary),`${title}Photo 1 of 5`);
 assert.equal(style(controls).flex,expected?2:undefined);
 assert.equal(style(controls).maxHeight,expected?undefined:260);
 assert.ok(!nodes(controls).includes(button(tree,'Close photo')),'Close stays outside scrolling content');
 if(expected){
  const previous=button(tree,'Previous photo'),row=nodes(controls).find(n=>n.props.children?.includes(previous));
  assert.equal(style(row).flexDirection,'column');
  assert.equal(style(previous).flex,undefined,'Wrapped labels retain intrinsic button height');
 }
}

test('normal portrait retains the original title/header and control cap',()=>{
 assertReflow(harness().render(),false);
});
test('system font scale, in-app large text and short height independently reflow the full title',()=>{
 for(const profile of [{fontScale:1.5},{fontScale:3.12},{large:true},{height:599},{width:874,height:402},{fontScale:1.2,large:true}])assertReflow(harness(profile).render(),true);
});
test('maximum-text portrait and landscape use uncapped controls, intrinsic targets and all safe edges',()=>{
 for(const profile of [{fontScale:3.12,large:true},{width:874,height:402,fontScale:3.12,large:true}]){
  const tree=harness(profile).render(),body=byId(tree,'photo-viewer-body'),photo=byId(tree,'photo-viewer-image');
  assertReflow(tree,true);
  assert.equal(style(body).flex,1);assert.equal(style(body).minHeight,0);
  assert.equal(style(photo).flex,1);assert.equal(style(photo).minHeight,80);
  const safe=nodes(tree).find(n=>n.type==='SafeAreaView');assert.equal(Array.from(safe.props.edges).sort().join(','),'bottom,left,right,top');
  for(const node of nodes(tree)){
   assert.equal(node.props.allowFontScaling,undefined);assert.equal(node.props.maxFontSizeMultiplier,undefined);
   if(node.type==='Text'){assert.equal(node.props.numberOfLines,undefined);assert.equal(node.props.adjustsFontSizeToFit,undefined);}
   if(node.type==='Pressable'){assert.equal(style(node).minHeight,48);assert.equal(style(node).height,undefined);}
  }
  assert.ok(nodes(byId(tree,'photo-viewer-summary')).some(n=>n.type==='Text'&&contents(n)===title&&n.props.accessibilityRole==='header'));
 }
});
test('navigation, zoom, close and return survive text changes and rotation without altering the draft',()=>{
 const h=harness(),before=JSON.stringify(h.snapshot);let tree=h.render();
 button(tree,'Zoom photo in').props.onPress();tree=h.render();
 const transform=()=>style(byId(tree,'photo-viewer-image').props.children[0]).transform;
 assert.equal(transform().find(v=>'scale'in v).scale,1.5);
 Object.assign(h.viewport,{width:874,height:402,fontScale:3.12,large:true});tree=h.render();
 assert.equal(transform().find(v=>'scale'in v).scale,1.5,'Reflow must not reset zoom');
 button(tree,'Next photo').props.onPress();tree=h.render();
 assert.equal(contents(byId(tree,'photo-viewer-summary')),`${title}Photo 2 of 5`);
 assert.equal(nodes(tree).find(n=>n.type==='Image').props.source.uri,'private-2.png');
 assert.equal(transform().find(v=>'scale'in v).scale,1,'Changing photo resets zoom');
 button(tree,'Previous photo').props.onPress();tree=h.render();
 button(tree,'Zoom photo in').props.onPress();tree=h.render();
 button(tree,'Reset photo zoom').props.onPress();tree=h.render();
 assert.equal(transform().find(v=>'scale'in v).scale,1);
 button(tree,'Return to draft').props.onPress();button(tree,'Close photo').props.onPress();
 assert.deepEqual(h.counts(),{closed:1,returned:1});assert.equal(JSON.stringify(h.snapshot),before);
});
test('five-photo cap, replacement source choices and cancellation remain in the reflowed scroller',()=>{
 const h=harness({fontScale:3.12,large:true});let tree=h.render();
 button(tree,'Manage photos').props.onPress();tree=h.render();
 assert.equal(button(tree,'Add Photo').props.disabled,true);
 button(tree,'Replace this photo').props.onPress();tree=h.render();
 for(const label of ['Take Photo','Choose from Library','Browse Files','Cancel'])assert.ok(nodes(byId(tree,'photo-viewer-controls')).includes(button(tree,label)));
 Object.assign(h.viewport,{width:874,height:402});tree=h.render();
 assert.equal(style(byId(tree,'photo-viewer-controls')).maxHeight,undefined,'Source chooser must not restore the old fixed cap');
 button(tree,'Cancel').props.onPress();tree=h.render();
 assert.ok(button(tree,'Replace this photo'));
 assert.ok(contents(byId(tree,'photo-viewer-controls')).includes('Photo selection canceled. Saved photos are kept.'));
 assert.equal(h.snapshot.draft.photos.length,5);
});
