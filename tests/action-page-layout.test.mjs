import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {load,root} from './helpers/detail-share-harness.mjs';
const {actionRegionLimit,actionColumns}=load('action-page-layout.ts');
for(const height of [96,150,220,360,650,900])test(`actions reserve content in measured ${height}pt parent`,()=>{const limit=actionRegionLimit(height);assert.ok(limit>0);assert.ok(limit<=height*.4);assert.ok(height-limit>=height*.6);});
test('action columns adapt to available width, app large text and system scaling',()=>{
 assert.equal(actionColumns(350,1,false),2);assert.equal(actionColumns(280,1,false),1);
 assert.equal(actionColumns(750,2,false),2);assert.equal(actionColumns(750,3.571,false),1);
 assert.equal(actionColumns(350,1,true),1);assert.equal(actionColumns(750,3.571,true),1);
});
test('actual action page has independent bounded scroll and keyboard-safe shrinkable content',()=>{
 const file=fs.readFileSync(path.join(root,'src/action-page.tsx'),'utf8');
 assert.match(file,/nativeEvent.layout/);assert.match(file,/actionRegionLimit\(bounds.height\)/);
 assert.match(file,/flexGrow: 0, flexShrink: 1, minHeight: 0/);
 assert.match(file,/testID="memory-content-region" style=\{\{ flex: 1, minHeight: 0, overflow: "hidden" \}\}/);
 assert.match(file,/KeyboardAvoidingView behavior=\{Platform.OS === "ios" \? "padding"/);
 assert.doesNotMatch(file,/maxFontSizeMultiplier|numberOfLines|allowFontScaling=\{false\}|position: "absolute"/);
});
