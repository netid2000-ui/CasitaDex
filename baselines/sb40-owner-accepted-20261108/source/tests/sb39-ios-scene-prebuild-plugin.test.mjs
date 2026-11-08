import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const config=require('../app.config.js')({config:require('../app.json').expo});
test('iOS scene lifecycle uses official SDK 57 expo-build-properties supported opt-in',()=>{
 const p=config.plugins.find(p=>Array.isArray(p)&&p[0]==='expo-build-properties');
 assert.ok(p,'official Expo scene support plugin must be present');
 assert.equal(p[1].ios.enableSceneSupport,true);
 assert.ok(!config.plugins.includes('./plugins/with-ios-scene-factory'));
});
