import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {readFileSync} from 'node:fs';
const require=createRequire(import.meta.url);
const query=require('query-string');
test('Expo Router dependency graph includes query-string decoder: unresolved release exposure',()=>{
 const router=readFileSync(require.resolve('expo-router/build/fork/getPathFromState-forks'), 'utf8');
 const parser=readFileSync(require.resolve('query-string'), 'utf8');
 assert.match(router,/query-string/);
 assert.match(parser,/decode-uri-component/);
});
test('bounded, benign deep-link queries parse without unexpected modification',()=>{
 for(const [raw,expected] of [['label=Kitchen%20filter','Kitchen filter'],['label=%E2%9C%93','✓'],['label=%25%25','%%'],['label=%ZZ','%ZZ']]){
  assert.equal(query.parse(raw).label,expected);
 }
});
test('untrusted route names are not automatically promoted to production authorization',()=>{
 const configure=require('../app.config.js');
 const config=require('../app.json').expo;
 const old=process.env.EXPO_PUBLIC_APP_ENV;
 try{process.env.EXPO_PUBLIC_APP_ENV='production';assert.throws(()=>configure({config}));}
 finally{if(old===undefined)delete process.env.EXPO_PUBLIC_APP_ENV;else process.env.EXPO_PUBLIC_APP_ENV=old;}
});
