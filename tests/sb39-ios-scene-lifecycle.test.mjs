import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const config=require('../app.config.js')({config:require('../app.json').expo});
test('SB39 iOS 27 runtime config opts into scene lifecycle through Expo official plugin',()=>{
 assert.equal(config.plugins.find(x=>Array.isArray(x)&&x[0]==='expo-build-properties')[1].ios.enableSceneSupport,true);
 assert.equal(config.extra.productionAuthorized,false);
});
