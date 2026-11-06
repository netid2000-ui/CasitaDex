import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';
export const root=process.env.CASITADEX_PARITY_SOURCE_ROOT||path.resolve(import.meta.dirname,'../..');
export function load(file,mocks={},extra='') {
  const code=ts.transpileModule(fs.readFileSync(path.join(root,'src',file),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.React}}).outputText;
  const mod={exports:{}};
  vm.runInNewContext(code+extra,{module:mod,exports:mod.exports,require:name=>name in mocks?mocks[name]:{},Date,JSON,Set,Math,Promise,Error});return mod.exports;
}
export function memory(id='one') {return {id,title:'Memory '+id,answer:'Answer '+id,location:'Private location',notes:'Private notes',source:'Private source',spaceId:null,categoryIds:[],mediaIds:[],confidence:'Unknown',lifecycle:'active',history:[],events:[]};}
export const deferred=()=>{let resolve,reject;const promise=new Promise((a,b)=>{resolve=a;reject=b;});return {promise,resolve,reject};};
export async function settle(){for(let i=0;i<50;i++)await Promise.resolve();}
export function fixture(screen='EngDetail',realEng=false){
  const scopes=new Map();let scope,queue,visited,tree,guard;
  const f={params:{id:'one',from:'detail'},route:screen==='EngShare'?'/share':'/card',nav:[],shares:[],photoShares:[],alerts:[],updates:[],focused:true,canBack:true};
  f.navigationState={index:1,routes:[{name:'card',params:{id:'one'}},{name:'share',params:{id:'one'}}]};
  f.snapshot={revision:7,data:{memories:[memory(),memory('two')],spaces:[],categories:[],media:{media:[]}}};
  f.e={setSnapshot:value=>{f.e.snapshot=value;},snapshot:f.snapshot,busy:false,status:'',setStatus:text=>f.e.status=text,refresh:async()=>true};
  f.store={load:async()=>f.snapshot,updateMemory:async(m,revision)=>{f.updates.push({memory:m,revision});if(f.saveGate)await f.saveGate.promise;if(f.saveError)throw Error(f.saveError);f.snapshot={...f.snapshot,revision:f.snapshot.revision+1,data:{...f.snapshot.data,memories:f.snapshot.data.memories.map(row=>row.id===m.id?structuredClone(m):row)}};return f.snapshot;}};
  f.e.run=async task=>{if(f.e.busy)return false;f.e.busy=true;try{await task(f.store);f.e.snapshot=f.snapshot;return true;}catch(error){f.e.status=error.message;return false;}finally{f.e.busy=false;}};
  const slot=create=>{const index=scope.index++;return scope.slots[index]??(scope.slots[index]=create());};
  const equal=(a,b)=>a&&b&&a.length===b.length&&a.every((x,i)=>Object.is(x,b[i]));
  const react={Fragment:'Fragment',createElement:(type,props,...children)=>({type,props:{...props,children}}),
    useState:initial=>{const cell=slot(()=>({value:typeof initial==='function'?initial():initial}));return[cell.value,value=>{cell.value=typeof value==='function'?value(cell.value):value;f.changed=true;}];},
    useRef:initial=>slot(()=>({current:initial})),
    useMemo:(fn,deps)=>{const cell=slot(()=>({}));if(!equal(cell.deps,deps)){cell.value=fn();cell.deps=deps;}return cell.value;},
    useCallback:(fn,deps)=>react.useMemo(()=>fn,deps),
    useEffect:(fn,deps)=>{const cell=slot(()=>({}));if(!equal(cell.deps,deps)){cell.deps=deps;queue.push(()=>{cell.cleanup?.();cell.cleanup=fn();});}},
    useReducer:(reducer,initial)=>{const [value,set]=react.useState(initial);return[value,action=>set(reducer(value,action))];}};
  const native={Platform:{OS:'ios'},AppState:{currentState:'active'},BackHandler:{addEventListener:(_name,fn)=>{f.back=fn;return {remove(){}};}},
    Alert:{alert:(...args)=>f.alerts.push(args)},Share:{dismissedAction:'dismissedAction',share:async payload=>{f.shares.push(payload);if(f.shareGate)await f.shareGate.promise;return {action:'dismissedAction'};}},
    View:'View',Image:'Image',ScrollView:'ScrollView',Pressable:'Pressable',Modal:'Modal',useWindowDimensions:()=>({width:390,height:844,fontScale:1})};
  f.native=native;
  const ui={Button:'Button',Copy:'Copy',Field:'Field',Page:'Page',useTheme:()=>({s:{},colors:{}})};
  const domain=load('eng-domain.ts');
  const sharing=fs.existsSync(path.join(root,'src/share-session.ts'))?load('share-session.ts',{'./eng-domain':domain}):{};
  const navigation={navigationIsGuarded:()=>!!guard?.(),registerEditGuard:check=>{guard=check;return()=>{if(guard===check)guard=null;};}};
  const router={canGoBack:()=>f.canBack,back:()=>f.nav.push(['back']),replace:route=>f.nav.push(['replace',route]),push:route=>f.nav.push(['push',route]),setParams:params=>{f.nav.push(['params',params]);f.params={...f.params,...params};}};
  const runtime={getEngStore:async()=>f.store,engPhotoUri:path=>path,shareEngPhotos:async(payload,beforePresent)=>{if(f.prepareGate)await f.prepareGate.promise;await beforePresent?.();f.photoShares.push(payload);if(f.shareGate)await f.shareGate.promise;}};
  const mocks={react,'react-native':native,'expo-router':{router,useLocalSearchParams:()=>f.params,usePathname:()=>f.route,useRootNavigationState:()=>f.navigationState,useFocusEffect:fn=>react.useEffect(()=>f.focused?fn():undefined,[fn,f.focused])},'./ui':ui,'./action-page':{ActionPage:'ActionPage'},'./share-session':sharing,'./memory-navigation':load('memory-navigation.ts'),'./eng-domain':domain,'./eng-runtime':runtime,'./eng-navigation':navigation,'./eng-find':{defaultFilter:()=>({})},'./state':{useData:()=>({large:false})},'./model':{confidences:[]},'./accessibility-feedback':{useStatusAnnouncement(){},useVisibleStatusAnnouncement(){}},'./backup-review':{emptyBackupReview:()=>({})}};
  const screens=load('eng-screens.tsx',mocks,'\nmodule.exports.__setEng=value=>{useEng=()=>value;};');if(!realEng)screens.__setEng(f.e);
  function renderNode(node,key){if(Array.isArray(node))return node.map((n,i)=>renderNode(n,key+'.'+i));if(!node||typeof node!=='object')return node;
    const own=key+':'+(node.props?.key??'');if(typeof node.type==='function'){const old=scope;scope=scopes.get(own)||{slots:[],index:0};scopes.set(own,scope);scope.index=0;visited.add(own);const result=node.type(node.props);scope=old;return renderNode(result,own+'.out');}
    return {...node,props:{...node.props,children:renderNode(node.props?.children,own+'.children')}};}
  f.render=()=>{assert.equal(typeof screens[screen],'function','Expected separate '+screen+' screen');let loops=0;do{queue=[];visited=new Set();f.changed=false;tree=renderNode({type:screens[screen],props:{}},'root');for(const[key,cell]of scopes)if(!visited.has(key)){for(const hook of cell.slots)hook.cleanup?.();scopes.delete(key);}for(const effect of queue)effect();assert.ok(++loops<8,'stable render');}while(f.changed);return tree;};
  f.unmount=()=>{for(const cell of scopes.values())for(const hook of cell.slots)hook.cleanup?.();scopes.clear();};
  const flat=node=>Array.isArray(node)?node.flatMap(flat):node&&typeof node==='object'?[node,...(node.props?.actions??[]).map(action=>({type:'FixedAction',props:action})),...flat(node.props?.children)]:[];
  f.nodes=()=>flat(tree);f.node=label=>f.nodes().find(n=>n.props.label===label);
  f.press=label=>{const node=f.node(label);assert.ok(node,'Missing '+label);if(!node.props.disabled)node.props.onPress();f.render();};
  f.change=(label,value)=>{const node=f.node(label);assert.ok(node,'Missing field '+label);node.props.onChangeText(value);f.render();};
  f.guard=navigation.navigationIsGuarded;return f;
}
