import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { redirectReminderSystemPath } from '../src/android-reminder-intent.ts';
const require=createRequire(import.meta.url);
const {parseQueryParams}=require('../node_modules/expo-router/build/fork/getStateFromPath-forks.js');
const hook=readFileSync(new URL('../node_modules/expo-router/build/hooks/useLocalSearchParams.js',import.meta.url),'utf8');
function localParams(path) {
 const parsed=parseQueryParams(path,{name:path.split('?')[0].slice(1)});
 const module={exports:{}};
 const deps={react:{use:()=>parsed},'../Route':{LocalRouteParamsContext:{}},'../link/preview/PreviewRouteContext':{usePreviewInfo:()=>({})}};
 vm.runInNewContext(hook,{module,exports:module.exports,require:name=>deps[name]});
 return module.exports.useLocalSearchParams();
}
function cache(url, overrides={}) {
 let value=url, reads=0, clears=0;
 return {launch:{platform:'android',scheme:'casitadex-dev',getLinkingURL(){reads++;return value;},clearInitialURL(){clears++;value=null;},...overrides},counts:()=>({reads,clears})};
}
const root={path:'casitadex-dev:///',initial:true};
const tap='casitadex-dev:/reminders?reminder=r_cold';
test('initial root fallback recovers retained cold notification before hydration and consumes it once',()=>{
 const c=cache(tap);
 assert.equal(redirectReminderSystemPath(root,c.launch),'/reminders?reminder=r_cold');
 assert.equal(redirectReminderSystemPath(root,c.launch),root.path);
 assert.deepEqual(c.counts(),{reads:2,clears:2});
});
for(const [route,param] of [['card','id'],['reminders','reminder']]) test(`${route}: recovered IDs survive installed query parser and hook exactly`,()=>{
 for(const id of ['r_simple','literal%2F','slash/real','literal%252F','a?b#c&d+e','café 日本 🏠','%','%GG','x'.repeat(512)]) {
  const c=cache(`casitadex-dev:/${route}?${param}=${encodeURIComponent(id)}`);
  assert.equal(localParams(redirectReminderSystemPath(root,c.launch))[param],id);
 }
});
test('valid current routes, newer links, query/hash root and foreign root retain precedence',()=>{
 for(const path of ['/photos','/card?id=new','casitadex-dev:/reminders?reminder=new','casitadex-dev:///?mode=new','casitadex-dev:///#new','https://example.test/','casitadex-staging:///','not a URL']) {
  assert.equal(redirectReminderSystemPath({path,initial:true},cache(tap).launch),path);
 }
});
test('warm navigation consumes stale launch cache without replay or redirect',()=>{
 const c=cache(tap);
 assert.equal(redirectReminderSystemPath({path:'/photos',initial:false},c.launch),'/photos');
 assert.equal(redirectReminderSystemPath(root,c.launch),root.path);
});
test('iOS and web are exact pass-through without reading or clearing their cache',()=>{
 for(const platform of ['ios','web']) {
  const c=cache(tap,{platform});
  assert.equal(redirectReminderSystemPath(root,c.launch),root.path);
  assert.deepEqual(c.counts(),{reads:0,clears:0});
 }
});
test('normal launcher launch has no recovered target',()=>{
 for(const value of [null,'casitadex-dev:///','casitadex-dev:/photos']) assert.equal(redirectReminderSystemPath(root,cache(value).launch),root.path);
});
test('only the configured supported environment can supply a target',()=>{
 assert.equal(redirectReminderSystemPath({path:'/',initial:true},cache('casitadex-staging:/card?id=m',{scheme:'casitadex-staging'}).launch),'/card?id=m');
 for(const scheme of [undefined,null,[],['casitadex-dev'],'casitadex-prod','foreign']) assert.equal(redirectReminderSystemPath(root,cache(tap,{scheme}).launch),root.path);
});
test('malformed, missing, duplicate, cross-environment and unsupported targets fail closed',()=>{
 const bad=[
  'https://example.test/reminders?reminder=r','casitadex-staging:/reminders?reminder=r',
  'casitadex-dev://foreign/reminders?reminder=r','casitadex-dev:/reminders','casitadex-dev:/reminders?reminder=',
  'casitadex-dev:/reminders?id=r','casitadex-dev:/card?reminder=r','casitadex-dev:/photos?id=r',
  'casitadex-dev:/reminders?reminder=a&reminder=b','casitadex-dev:/reminders?reminder=r#fragment',
  ...['%GG','%E0%A4%A','%00','%7F','x'.repeat(513)].map(id=>'casitadex-dev:/reminders?reminder='+id),
 ];
 for(const value of bad) assert.equal(redirectReminderSystemPath(root,cache(value).launch),root.path,value);
});
test('missing or throwing native APIs never block launch',()=>{
 for(const override of [{getLinkingURL(){throw Error('unavailable');}},{clearInitialURL(){throw Error('unavailable');}}]) assert.equal(redirectReminderSystemPath(root,cache(tap,override).launch),root.path);
});
test('installed Router initial URL interception recovers async fallback and memoizes without a late push',async()=>{
 const c=cache(tap);
 const context=()=>({redirectSystemPath:options=>redirectReminderSystemPath(options,c.launch)});
 context.keys=()=>['./+native-intent.ts'];
 const module={exports:{}};
 const deps={
  'expo-modules-core':{Platform:{OS:'android'}},
  './constants':{INTERNAL_SLOT_NAME:'__root',SITEMAP_ROUTE_NAME:'_sitemap'},
  './getReactNavigationConfig':{getReactNavigationConfig:()=>({screens:{index:'',card:'card',reminders:'reminders'}})},
  './getRoutesRedirects':{applyRedirects:path=>path},
  './link/linking':{getInitialURL:()=>Promise.resolve(root.path),subscribe:()=>()=>{}},
  './react-navigation/native':{},
 };
 vm.runInNewContext(readFileSync(new URL('../node_modules/expo-router/build/getLinkingConfig.js',import.meta.url),'utf8'),{module,exports:module.exports,require:name=>{assert.ok(name in deps,name);return deps[name];}});
 const config=module.exports.getLinkingConfig({},context,()=>({}),{skipGenerated:true});
 const first=config.getInitialURL();
 assert.equal(await first,'/reminders?reminder=r_cold');
 assert.equal(config.getInitialURL(),first);
 assert.deepEqual(c.counts(),{reads:1,clears:1});
});
test('one/two/three-slash root fallbacks and local notification URIs are supported',()=>{
 for(const prefix of ['casitadex-dev:','casitadex-staging:']) for(const slash of ['/','//','///']) for(const tapSlash of ['/','//','///']) {
  const c=cache(`${prefix}${tapSlash}card?id=m`,{scheme:prefix.slice(0,-1)});
  assert.equal(redirectReminderSystemPath({path:prefix+slash,initial:true},c.launch),'/card?id=m');
 }
});
test('actual native-intent wrapper wires configured scheme and native APIs, leaving iOS untouched',()=>{
 const ts=require('typescript');
 const source=readFileSync(new URL('../src/app/+native-intent.ts',import.meta.url),'utf8');
 const code=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
 for(const platform of ['android','ios']) {
  const c=cache(tap,{platform});
  const module={exports:{}};
  const deps={
   'expo-constants':{__esModule:true,default:{expoConfig:{scheme:'casitadex-dev'}}},
   'expo-linking':{getLinkingURL:c.launch.getLinkingURL,clearInitialURL:c.launch.clearInitialURL},
   'react-native':{Platform:{OS:platform}},
   '../android-reminder-intent':{redirectReminderSystemPath},
  };
  vm.runInNewContext(code,{module,exports:module.exports,require:name=>{assert.ok(name in deps,name);return deps[name];}});
  assert.equal(module.exports.redirectSystemPath(root),platform==='android'?'/reminders?reminder=r_cold':root.path);
  assert.deepEqual(c.counts(),platform==='android'?{reads:1,clears:1}:{reads:0,clears:0});
 }
});
