import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
function config(env={}) {
 const module={exports:{}};
 vm.runInNewContext(fs.readFileSync(new URL('../app.config.js',import.meta.url),'utf8'),{module,process:{env}});
 return module.exports({config:{ios:{},android:{},extra:{}}});
}
test('isolated StoreKit identity carries only a local test product',()=>{
 const c=config({CASITADEX_PLUS_STORE_QA:'1'});
 assert.equal(c.ios.bundleIdentifier,'com.designsbyfa.casitadex.plusstoreqa');
 assert.equal(c.ios.infoPlist.CasitaDexPlusProductID,'local.casitadex.plus.qa');
 assert.equal(c.ios.infoPlist.CasitaDexPlusStoreEnvironment,'Xcode');
 assert.equal(c.extra.productionAuthorized,false);
});
test('ordinary builds do not acquire StoreKit QA configuration',()=>{
 for(const env of [{},{CASITADEX_SB40_QA:'1'},{EXPO_PUBLIC_APP_ENV:'staging'}]) assert.equal(config(env).ios.infoPlist,undefined);
});
test('isolated identities cannot be mixed and production stays blocked',()=>{
 for(const flag of ['CASITADEX_SB29_QA','CASITADEX_SB39_QA','CASITADEX_SB40_QA']) assert.throws(()=>config({CASITADEX_PLUS_STORE_QA:'1',[flag]:'1'}),/Only one/);
 assert.throws(()=>config({CASITADEX_PLUS_STORE_QA:'1',EXPO_PUBLIC_APP_ENV:'production'}),/Production configuration/);
});
