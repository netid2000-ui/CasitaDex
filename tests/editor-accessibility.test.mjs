import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
function load(file){
 const jsx=(type,props)=>({type,props:props??{}});
 const mocks={'react':{useState:v=>[v,()=>{}],useRef:v=>({current:v}),useEffect:()=>{}},'react/jsx-runtime':{jsx,jsxs:jsx},'react-native':{Pressable:'Pressable',View:'View',useWindowDimensions:()=>({fontScale:1})},'react-native-svg':{SvgXml:'SvgXml'},'./state':{useData:()=>({large:false})},'./ui':{Copy:'Copy',Field:'Field',Button:'Button',useTheme:()=>({colors:{},dark:false})}};
 const source=fs.readFileSync(new URL('../src/'+file,import.meta.url),'utf8');
 const compiled=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText;
 const module={exports:{}};vm.runInNewContext(compiled,{module,exports:module.exports,require:id=>id.endsWith('.svg')?'':mocks[id]});return module.exports;
}
function nodes(n){return !n||typeof n!=='object'?[]:Array.isArray(n)?n.flatMap(nodes):[n,...nodes(n.props?.children)];}
test('taxonomy choices have distinct spoken names, selected values and expansion state',()=>{
 const {MemoryEditorChoice}=load('memory-editor-controls.tsx');
 for(const [label,value,expanded] of [['Space','Garage',false],['Categories','Tools, Electrical',true]]){
  let activated=false;
  const b=nodes(MemoryEditorChoice({label,value,expanded,disabled:false,onPress:()=>{activated=true;}})).find(n=>n.type==='Pressable');
  assert.equal(b.props.accessibilityLabel,'Choose '+label);assert.equal(b.props.accessibilityValue.text,value);
  assert.equal(b.props.accessibilityState.expanded,expanded);b.props.onPress();assert.equal(activated,true);
 }
});
test('collapsed optional fields expose their value or None without opening the editor',()=>{
 const {MemoryEditOptionalField}=load('memory-edit-optional-field.tsx');
 for(const value of ['Shelf 2','']){
  const b=nodes(MemoryEditOptionalField({label:'Location',value,onChangeText:()=>{},disabled:true})).find(n=>n.type==='Pressable');
  assert.equal(b.props.accessibilityLabel,'Edit Location');assert.equal(b.props.accessibilityValue.text,value||'None');
  assert.equal(b.props.onAccessibilityTap,undefined);
  assert.equal(b.props.accessibilityState.disabled,true);assert.equal(b.props.accessibilityState.expanded,false);
 }
});
