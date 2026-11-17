import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const source=fs.readFileSync(new URL('../src/photo-source-button.tsx',import.meta.url),'utf8');
test('approved chooser preserves callbacks, fixed Cancel, and adaptive source list',()=>{
 assert.match(source,/onRequestClose=\{close\}/);
 assert.match(source,/const close=\(\)=>setVisible\(false\)/);
 assert.match(source,/close\(\);onSelect\(source\)/);
 assert.match(source,/Choose a photo source/);
 assert.match(source,/<\/ScrollView>\s*<SourceAction label="Cancel"[^>]+onPress=\{close\}/);
 assert.match(source,/Platform.OS==='android'\?48:44/);
 assert.match(source,/maxHeight:height\*\.85/);
 assert.match(source,/maxWidth:330/);
 assert.match(source,/accessibilityLabel=\{label\}/);
 assert.match(source,/cancel\?'':' ›'/);
 assert.doesNotMatch(source,/allowFontScaling=\{false\}|numberOfLines/);
});
test('every approved chooser asset is local, nonempty and 16 by 16',()=>{
 for(const theme of ['light','dark']) for(const icon of ['camera','library','files','cancel']){
  const name=`${theme}-${icon}.svg`;const asset=fs.readFileSync(new URL('../assets/photo-source-figma/'+name,import.meta.url),'utf8');
  assert.match(asset,/<svg[^>]+width="16"[^>]+height="16"/);assert.ok(asset.length>100);assert.ok(source.includes(name));
 }
 assert.doesNotMatch(source,/https:\/\/www.figma.com\/api/);
});

// Exercise the real transpiled component handlers with a minimal host/hook stub.
// This is not a native renderer or a substitute for the recorded device checks.
import vm from 'node:vm';
import ts from 'typescript';
function harness(code=source,os='ios'){
 const events=[],slots=[];let cursor=0;
 const react={createElement:(type,props,...children)=>({type,props:{...props,children}}),Fragment:'Fragment',useState(initial){const i=cursor++;if(!(i in slots))slots[i]=initial;return [slots[i],value=>{slots[i]=value;events.push(['visible',value]);}];}};
 const colors={};const module={exports:{}};
 const modules={react,'react-native':{Keyboard:{dismiss:()=>events.push(['keyboard'])},Modal:'Modal',Platform:{OS:os},Pressable:'Pressable',ScrollView:'ScrollView',View:'View',useWindowDimensions:()=>({height:800})},'react-native-svg':{SvgXml:'SvgXml'},'./ui':{Button:'Button',Copy:'Copy',useTheme:()=>({colors,dark:false})},'./state':{useData:()=>({large:false})},'./memory-editor-controls':{MemoryEditorIcon:'MemoryEditorIcon'}};
 const js=ts.transpileModule(code,{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.React,esModuleInterop:true}}).outputText;
 vm.runInNewContext(js,{exports:module.exports,module,require:name=>{if(name.endsWith('.svg'))return '<svg/>';assert.ok(name in modules,'Unexpected import '+name);return modules[name];}});
 function nodes(node){if(!node||typeof node!=='object')return [];return [node,...(node.props?.children??[]).flat(Infinity).flatMap(nodes)];}
 function render(){cursor=0;return nodes(module.exports.PhotoSourceButton({onSelect:value=>events.push(['select',value])}));}
 function find(type,label){const matches=render().filter(n=>(typeof n.type==='function'?n.type.name:n.type)===type&&(label===undefined||n.props.label===label));assert.equal(matches.length,1,type+' '+label);return matches[0];}
 function open(){find('Button','+ Add Photo').props.onPress();assert.equal(find('Modal').props.visible,true);events.length=0;}
 return {events,find,open};
}
function verifySelection(code,label,expected){const h=harness(code);h.open();h.find('SourceAction',label).props.onPress();assert.deepEqual(h.events,[['visible',false],['select',expected]]);assert.equal(h.find('Modal').props.visible,false);}
function verifyDismiss(code,back){const h=harness(code,back?'android':'ios');for(let i=0;i<2;i++){h.open();if(back)h.find('Modal').props.onRequestClose();else h.find('SourceAction','Cancel').props.onPress();assert.deepEqual(h.events,[['visible',false]]);assert.equal(h.find('Modal').props.visible,false);}}
for(const [label,value] of [['Take Photo',true],['Choose from Library',false],['Browse Files','files']]){
 test(label+' closes chooser before selecting exactly its source',()=>verifySelection(source,label,value));
}
test('Cancel closes without selecting, including after reopening',()=>verifyDismiss(source,false));
test('Android Back onRequestClose closes without selecting, including after reopening',()=>verifyDismiss(source,true));
test('callback regressions are detected by behavior assertions',()=>{
 const swapped=source.replace('choose(true)','choose(SWAP)').replace('choose(false)','choose(true)').replace('choose(SWAP)','choose(false)');
 assert.throws(()=>verifySelection(swapped,'Take Photo',true),assert.AssertionError);
 assert.throws(()=>verifySelection(swapped,'Choose from Library',false),assert.AssertionError);
 const wrongFiles=source.replace("choose('files')",'choose(false)');
 assert.throws(()=>verifySelection(wrongFiles,'Browse Files','files'),assert.AssertionError);
 const selectsOnDismiss=source.replace('const close=()=>setVisible(false);',"const close=()=>{setVisible(false);onSelect('files');};");
 assert.throws(()=>verifyDismiss(selectsOnDismiss,false),assert.AssertionError);
 assert.throws(()=>verifyDismiss(selectsOnDismiss,true),assert.AssertionError);
});
