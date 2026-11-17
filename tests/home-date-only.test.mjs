import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
import vm from 'node:vm';
const source=fs.readFileSync(new URL('../src/app/_layout.tsx',import.meta.url),'utf8');
const component=source.slice(source.indexOf('function HomeDate(){'),source.indexOf('function Shell()'));
test('Home renders local date only, with no clock separator or time',()=>{
 const React={createElement:(type,props,...children)=>({type,props,children})};
 const fixed=new Date(2026,10,17,21,47);
 const code=ts.transpileModule(component+'\nexports.render=HomeDate;', {compilerOptions:{jsx:ts.JsxEmit.React,module:ts.ModuleKind.CommonJS}}).outputText;
 const exports={};
 vm.runInNewContext(code,{exports,React,Text:'Text',useTheme:()=>({colors:{ink:'#222'}}),useState:()=>[fixed,()=>{}],useEffect:()=>{},editorialFonts:{body:'Inter'}});
 const output=exports.render();
 assert.deepEqual(Array.from(output.children),[fixed.toLocaleDateString(undefined,{month:'short',day:'numeric',year:'numeric'})]);
 assert.doesNotMatch(component,/toLocaleTimeString|hour:|minute:| · /);
});
test('date remains above borderless Settings, preserving right-hand wordmark and four tabs',()=>{
 assert.match(source,/<HomeDate\/><Pressable[^>]+accessibilityLabel="Settings"/);
 assert.match(source,/logo-right-dark\.png/);assert.match(source,/logo-right-light\.png/);
 assert.match(source,/label:"Home",route:"\/".*label:"Photos".*label:"Reminders".*label:"Find"/);
 const header=source.slice(source.indexOf('{path==="/"||primaryTitle?'),source.indexOf('<View style={{ flex: 1 }}>'));
 assert.doesNotMatch(header,/borderWidth|borderBottomWidth/);
 assert.match(component,/AppState\.addEventListener/);
});
