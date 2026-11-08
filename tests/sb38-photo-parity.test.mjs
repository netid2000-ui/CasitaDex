import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
test('iOS photo gallery uses singular label and real saved-photo wording',()=>{
 const s=read('src/figma-first/FigmaPhotos.tsx');
 assert.ok(s.includes('count===1?"1 photo"'));
 assert.ok(s.includes('photoCountLabel(item.photoCount)'));
 assert.ok(s.includes('Saved photo for'));
 assert.ok(!s.includes('Sample photo for'));
});
test('iOS viewer retains zoom, navigation, safe removal and accessible close',()=>{
 const s=read('src/photo-memory-viewer.tsx');
 for(const marker of ['PanResponder.create','lastTap.current','Previous photo','Next photo','Remove this photo','accessibilityLabel="Close photo"',"Alert.alert('Remove photo?'"]) assert.ok(s.includes(marker),marker);
});
test('iOS synthetic QA illustrations do not depend on Android resource URIs',()=>{
 const s=read('src/app/photos.tsx');
 assert.ok(s.includes('qaIllustrationBytes'));
 assert.ok(!s.includes('file:///android_res/'));
});
