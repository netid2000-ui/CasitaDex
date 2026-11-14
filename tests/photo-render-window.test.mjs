import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import {shouldRenderPhoto} from '../src/figma-first/photo-render-window.ts';
test('render window handles overscan, large text, jumps, and invalid measurements',()=>{
 assert.equal(shouldRenderPhoto({top:600,height:300},{offset:1000,height:500},20),true);
 assert.equal(shouldRenderPhoto({top:0,height:200},{offset:10000,height:500},0),false);
 assert.equal(shouldRenderPhoto({top:9000,height:3000},{offset:10000,height:500},40),true);
 assert.equal(shouldRenderPhoto(undefined,{offset:0,height:0},12),false);
 assert.equal(shouldRenderPhoto(undefined,{offset:NaN,height:500},0),true);
});
test('1000-card component mounts only nearby images and preserves every photo action',()=>{
 let cursor=0;const hooks=[],frames=[];
 const React={useRef:value=>{const i=cursor++;return hooks[i]??(hooks[i]={current:value});},useState:value=>{const i=cursor++;if(!(i in hooks))hooks[i]=value;return [hooks[i],v=>{hooks[i]=typeof v==='function'?v(hooks[i]):v;}];},useEffect:()=>{}};
 const jsx=(type,props,key)=>({type,props:props??{},key});
 const mocks={'react':React,'react/jsx-runtime':{jsx,jsxs:jsx},'react-native':{Image:'Image',Pressable:'Pressable',ScrollView:'ScrollView',Text:'Text',View:'View',useWindowDimensions:()=>({width:390,fontScale:1,height:800})},'../state':{useData:()=>({large:false})},'./tokens':{useFigmaTheme:()=>({})},'./photo-render-window':{shouldRenderPhoto}};
 const source=fs.readFileSync(new URL('../src/figma-first/FigmaPhotos.tsx',import.meta.url),'utf8');
 const compiled=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText;
 const module={exports:{}};
 vm.runInNewContext(compiled,{module,exports:module.exports,require:id=>mocks[id],requestAnimationFrame:fn=>{frames.push(fn);return frames.length;},cancelAnimationFrame:()=>{}});
 const items=Array.from({length:1000},(_,i)=>({id:'m'+i,title:'Item '+i,photoCount:1,photos:[{id:'p'+i,uri:'local:'+i}]}));
 let opened;
 const props={items,onAdd:()=>{},onOpen:()=>{},onViewPhoto:(m,p)=>{opened=[m,p];},hideControls:true,viewport:{offset:0,height:600}};
 function render(){cursor=0;return module.exports.FigmaPhotos(props);}
 function nodes(node){if(!node||typeof node!=='object')return [];if(Array.isArray(node))return node.flatMap(nodes);return [node,...nodes(node.props?.children)];}
 let tree=render();
 assert.equal(nodes(tree).filter(n=>n.type==='Image').length,12);
 const layouts=nodes(tree).filter(n=>n.props.onLayout);
 layouts[0].props.onLayout({nativeEvent:{layout:{y:80}}});
 for(let i=0;i<1000;i++)layouts[i+1].props.onLayout({nativeEvent:{layout:{y:Math.floor(i/2)*250,height:238}}});
 while(frames.length)frames.shift()();
 props.viewport={offset:100000,height:600};tree=render();
 const rendered=nodes(tree),images=rendered.filter(n=>n.type==='Image');
 assert.ok(images.length>0&&images.length<=20);
 assert.ok(images.every(n=>Number(n.props.source.uri.split(':')[1])>780));
 const buttons=rendered.filter(n=>n.type==='Pressable'&&n.props.accessibilityLabel?.includes('full screen'));
 assert.equal(buttons.length,1000);
 buttons[800].props.onPress();assert.deepEqual(opened,['m800','p800']);
 props.viewport={offset:0,height:600};tree=render();
 assert.ok(nodes(tree).some(n=>n.type==='Image'&&n.props.source.uri==='local:0'));
 assert.equal(nodes(tree).filter(n=>n.props.onLayout).length,1001);
});
