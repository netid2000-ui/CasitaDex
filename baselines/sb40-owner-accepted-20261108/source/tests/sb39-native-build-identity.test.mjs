import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const configure=require('../app.config.js');
const base=require('../app.json').expo;
test('SB39 QA native identities are isolated from all accepted QA/dev apps and seed disabled',()=>{
 const prev=process.env.EXPO_PUBLIC_APP_ENV,flag=process.env.CASITADEX_SB39_QA;
 try{
  process.env.EXPO_PUBLIC_APP_ENV='development';delete process.env.CASITADEX_SB39_QA;
  const original=configure({config:base});process.env.CASITADEX_SB39_QA='1';const next=configure({config:base});
  assert.equal(next.ios.bundleIdentifier,'com.designsbyfa.casitadex.sb39qa');
  assert.equal(next.android.package,'com.designsbyfa.casitadex.sb39qa');
  assert.notEqual(original.ios.bundleIdentifier,next.ios.bundleIdentifier);
  assert.notEqual(original.android.package,next.android.package);
  assert.equal(next.extra.parityQaSeed,false);
  assert.equal(next.extra.productionAuthorized,false);
 }finally{if(prev===undefined)delete process.env.EXPO_PUBLIC_APP_ENV;else process.env.EXPO_PUBLIC_APP_ENV=prev;if(flag===undefined)delete process.env.CASITADEX_SB39_QA;else process.env.CASITADEX_SB39_QA=flag;}
});
