import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const config=JSON.parse(readFileSync(new URL('../app.json',import.meta.url),'utf8')).expo;
test('development configuration does not authorize production',()=>{
 assert.equal(config.extra.productionAuthorized,false);
 assert.equal(config.extra.appEnvironment,'development');
});
test('store evidence identifies iPad and Android SDK verification obligations',()=>{
 const doc=readFileSync(new URL('../docs/design/MOBILE_STORE_PUBLICATION_STANDARD_20261024.md',import.meta.url),'utf8');
 assert.equal(config.ios.supportsTablet,true);
 assert.match(doc,/iPad UI and required screenshots/);
 assert.match(doc,/merged manifest/);
});
