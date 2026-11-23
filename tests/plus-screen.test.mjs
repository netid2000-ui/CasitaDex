import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import {plusPurchaseMessage} from '../src/plus-purchase-message.ts';
import {createPlusPurchaseController} from '../src/plus-purchase-controller.ts';
test('Plus preview exposes restore feedback, disables checkout, and returns to Settings',async()=>{
 let value='',route,origin,hasHistory=false;
 const jsx=(type,props)=>({type,props:props??{}});
 const mocks={'react':{useSyncExternalStore:(_s,get)=>get(),useEffect:()=>{},useState:initial=>[initial,v=>{if(typeof v==='string')value=v;}]},'react/jsx-runtime':{jsx,jsxs:jsx},'react-native':Object.fromEntries(['Pressable','ScrollView','Text','View'].map(k=>[k,k])),'expo-router':{useLocalSearchParams:()=>({origin}),router:{back:()=>{route="previous screen";},canGoBack:()=>hasHistory,replace:r=>{route=r;}}},'../state':{useData:()=>({large:false})},'../figma-first/tokens':{useFigmaTheme:()=>({})},'../plus-purchase-controller':{createPlusPurchaseController},'../plus-purchase-message':{plusPurchaseMessage},'../plus-purchase-runtime':{localPlusCheckout:false,localPlusPrice:async()=>null,plusPurchases:createPlusPurchaseController(null)},'../plus-entitlement-runtime':{plusEntitlements:{subscribe:()=>()=>{},getSnapshot:()=>({entitlement:'free',status:'ready'}),refresh:async()=>{}}}};
 const source=fs.readFileSync(new URL('../src/app/plus.tsx',import.meta.url),'utf8');
 const compiled=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText;
 const module={exports:{}};vm.runInNewContext(compiled,{module,exports:module.exports,require:id=>mocks[id]});
 function nodes(n){if(!n||typeof n!=='object')return [];if(Array.isArray(n))return n.flatMap(nodes);return [n,...nodes(n.props?.children)];}
 const tree=module.exports.default(),all=nodes(tree),buttons=all.filter(n=>n.type==='Pressable');
 assert.equal(buttons.find(n=>n.props.testID==='plus-purchase').props.disabled,true);
 buttons.find(n=>n.props.children.props.children==='Restore purchases').props.onPress();
 await new Promise(resolve=>setImmediate(resolve));
 assert.match(value,/unavailable in this preview/);assert.match(value,/unchanged/);
 assert.ok(nodes(module.exports.default()).some(n=>n.props.accessibilityLiveRegion==='polite'));
 for(const b of buttons.filter(n=>['Not now','‹ Settings'].includes(n.props.children.props.children))){b.props.onPress();assert.equal(route,'/more');}
 for(const [entry,label,fallback] of [['draft','Add Memory','/add'],['backup','Backup & restore','/settings-manage?action=backup']]){
  origin=entry;
  const controls=nodes(module.exports.default()).filter(n=>n.type==='Pressable'&&[`‹ ${label}`,'Not now'].includes(n.props.children.props.children));
  assert.equal(controls.length,2);
  for(const control of controls){
   hasHistory=true;control.props.onPress();assert.equal(route,'previous screen');
   hasHistory=false;control.props.onPress();assert.equal(route,fallback);
  }
 }
 const fixed=tree.props.children[0];assert.equal(fixed.type,'View');assert.equal(tree.props.children[1].type,'ScrollView');
});
