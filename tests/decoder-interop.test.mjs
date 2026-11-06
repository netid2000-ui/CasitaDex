import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {reminderNotificationTarget} from '../src/reminder-notification-target.ts';
const require=createRequire(import.meta.url);
const verify=require('../scripts/decoder-interop.cjs');
const query=require('query-string');
const decoder=require('decode-uri-component').default;
test('official decoder and maintained bridge are present with pinned hashes',()=>assert.equal(verify(),'already verified'));
const identities=['r_simple','literal%2Fvalue','literal%252Fvalue','literal%20value','literal%25','a?b#c&d+e','café 日本 🏠','%','%GG','%E0%A4%A','x'.repeat(512)];
for(const id of identities) test(`query preserves exact identity ${id.slice(0,32)}`,()=>{
 assert.equal(query.parse(query.stringify({reminder:id})).reminder,id);
 assert.equal(query.parseUrl('casitadex-dev://reminders?'+query.stringify({reminder:id})).query.reminder,id);
});
test('legacy literal fragment plus normalization and encoded plus stay distinct',()=>{
 assert.equal(query.parseUrl('/r#one+two',{parseFragmentIdentifier:true}).fragmentIdentifier,'one two');
 assert.equal(query.parseUrl('/r#one%2Btwo',{parseFragmentIdentifier:true}).fragmentIdentifier,'one+two');
 assert.equal(query.parse('a=one+two&b=one%2Btwo').a,'one two');
 assert.equal(query.parse('a=one+two&b=one%2Btwo').b,'one+two');
});
test('malformed input handling, Unicode, no second decoding and no prototype mutation',()=>{
 for(const [input,expected] of [['%GG','%GG'],['%E0%A4%A','%E0%A4%A'],['%FE%FF','\uFFFD\uFFFD'],['%C2','\uFFFD'],['%2541x%41%zz','%41xA%zz'],['%C0%AF','%C0%AF'],['%ED%A0%80','%ED%A0%80'],['%F4%90%80%80','%F4%90%80%80'],['%F0%9F%8F%A0','🏠']])assert.equal(decoder(input),expected,input);
 assert.throws(()=>decoder(null),TypeError);
 const parsed=query.parse('__proto__=x&constructor=y&toString=z');assert.equal(Object.getPrototypeOf(parsed),null);assert.equal(parsed.__proto__,'x');assert.equal({}.polluted,undefined);
});
test('query arrays duplicates empty values and boolean/number options',()=>{
 assert.deepEqual({...query.parse('a=1&a=2&empty&blank=')},{a:['1','2'],blank:'',empty:null});
 assert.deepEqual({...query.parse('n=2&b=true',{parseNumbers:true,parseBooleans:true})},{b:true,n:2});
 for(const arrayFormat of ['none','index','bracket','comma','separator','bracket-separator','colon-list-separator']) {
  const options={arrayFormat,arrayFormatSeparator:'|'};const encoded=query.stringify({a:['café','a+b']},options);assert.deepEqual(query.parse(encoded,options).a,['café','a+b'],arrayFormat);
 }
});
function load(file, overrides={}) {
 const local=createRequire(file),module={exports:{}};
 vm.runInNewContext(readFileSync(file,'utf8'),{module,exports:module.exports,require:s=>s in overrides?overrides[s]:local(s),process,console,URL,URLSearchParams},{filename:file,timeout:1000});return module.exports;
}
const forkFile=require.resolve('expo-router/build/fork/getPathFromState-forks.js');
// Only unrelated React Native export loading is stubbed. Both real stringify bodies execute.
const fork=load(forkFile,{'../react-navigation/native':{validatePathConfig:()=>{}}});
const outbound=load(require.resolve('expo-router/build/fork/getPathFromState.js'),{'./getPathFromState-forks':fork});
const fallback=require('expo-router/build/react-navigation/core/getStateFromPath.js');
test('both installed Router outbound stringifiers and vendored fallback retain identities',()=>{
 for(const id of identities) {
  const appended=fork.appendQueryAndHash('/reminders',{reminder:id});assert.equal(query.parseUrl(appended).query.reminder,id);
  const path=outbound.getPathFromState({routes:[{name:'reminders',params:{reminder:id}}]},{screens:{reminders:'reminders'}});assert.equal(query.parseUrl(path).query.reminder,id);
  const state=fallback.getStateFromPath(appended,{screens:{reminders:'reminders'}});assert.equal(state.routes[0].params.reminder,id);
 }
});

test('notification target validation never decodes a second time',()=>{for(const id of identities)assert.equal(reminderNotificationTarget(query.parse(query.stringify({reminder:id})).reminder),id);});
