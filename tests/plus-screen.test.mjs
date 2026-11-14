import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import {createPlusPurchaseController} from '../src/plus-purchase-controller.ts';
test('Plus preview exposes restore feedback, disables checkout, and returns to Settings',async()=>{
 let value='',route;
 const jsx=(type,props)=>({type,props:props??{}});
 const mocks={'react':{useState:()=>[value,v=>{value=v;}]},'react/jsx-runtime':{jsx,jsxs:jsx},'react-native':Object.fromEntries(['Pressable','ScrollView','Text','View'].map(k=>[k,k])),'expo-router':{router:{replace:r=>{route=r;}}},'../state':{useData:()=>({large:false})},'../figma-first/tokens':{useFigmaTheme:()=>({})},'../plus-purchase-controller':{createPlusPurchaseController}};
 const source=fs.readFileSync(new URL('../src/app/plus.tsx',import.meta.url),'utf8');
 const compiled=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText;
 const module={exports:{}};vm.runInNewContext(compiled,{module,exports:module.exports,require:id=>mocks[id]});
 function nodes(n){if(!n||typeof n!=='object')return [];if(Array.isArray(n))return n.flatMap(nodes);return [n,...nodes(n.props?.children)];}
 const tree=module.exports.default(),all=nodes(tree),buttons=all.filter(n=>n.type==='Pressable');
 assert.equal(buttons.find(n=>n.props.disabled).props.onPress,undefined);
 buttons.find(n=>n.props.children.props.children==='Restore purchases').props.onPress();
 await new Promise(resolve=>setImmediate(resolve));
 assert.match(value,/not available in this preview/);assert.match(value,/have not changed/);
 assert.ok(nodes(module.exports.default()).some(n=>n.props.accessibilityLiveRegion==='polite'));
 for(const b of buttons.filter(n=>['Not now','‹ Settings'].includes(n.props.children.props.children))){b.props.onPress();assert.equal(route,'/more');}
 const fixed=tree.props.children[0];assert.equal(fixed.type,'View');assert.equal(tree.props.children[1].type,'ScrollView');
});
