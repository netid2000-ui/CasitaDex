import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
const app='ios/build-sb38/Build/Products/Release-iphonesimulator/CasitaDexDev.app';
test('isolated simulator release embeds the updated Photos and viewer code',{skip: !existsSync(`${app}/main.jsbundle`) && 'Release artifact absent from this source-only worktree; native release build acceptance remains open'},()=>{
 const path=`${app}/main.jsbundle`;
 assert.ok(existsSync(path),'expected isolated SB38 release bundle');
 const source=readFileSync(path,'utf8');
 for(const marker of ['photoCountLabel','1 photo','Saved photo for','GestureHandlerRootView','Remove this photo','Previous photo','Next photo']) assert.ok(source.includes(marker),`missing ${marker}`);
 assert.ok(!source.includes('1 photos'),'legacy gallery label in embedded release bundle');
});
