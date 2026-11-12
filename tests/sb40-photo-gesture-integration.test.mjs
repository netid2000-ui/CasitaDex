import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {boundedPhotoPan,photoSwipeDirection,photoZoomScale} from '../src/photo-zoom.ts';

test('SB40 bounded pan clamps visible image at 1x, 2x and 4x',()=>{
 assert.deepEqual(boundedPhotoPan(90,-90,1,300,500),{x:0,y:0});
 assert.deepEqual(boundedPhotoPan(500,-500,2,300,500),{x:150,y:-250});
 assert.deepEqual(boundedPhotoPan(-999,999,4,300,500),{x:-450,y:750});
 assert.deepEqual(boundedPhotoPan(NaN,Infinity,2,300,500),{x:0,y:0});
 assert.equal(photoZoomScale(50),4);
});
test('SB40 photo swipe chooses direction only at 1x with deliberate horizontal movement',()=>{
 assert.equal(photoSwipeDirection(-160,10,1),1);
 assert.equal(photoSwipeDirection(160,10,1),-1);
 for(const z of [1.2,2,4]) assert.equal(photoSwipeDirection(-160,10,z),0);
 assert.equal(photoSwipeDirection(-40,5,1),0);
 assert.equal(photoSwipeDirection(-160,120,1),0);
});
test('SB40 approved gallery and management must survive swipe/zoom integration',()=>{
 const p=readFileSync(new URL('../src/photo-memory-viewer.tsx',import.meta.url),'utf8');
 const gallery=readFileSync(new URL('../src/app/photos.tsx',import.meta.url),'utf8');
 for(const feature of ['Manage photos','Use as cover','Move earlier','Move later','Replace this photo','Remove this photo','Browse Files','View Memory','Previous photo','Next photo','Reset photo zoom','photoSwipeDirection','boundedPhotoPan'])assert.ok(p.includes(feature),feature);
 for(const feature of ['PhotoWorkspaceControls','FigmaPhotos','preservedPhotosScrollY','onViewPhoto','onViewMemory','setSelectedPhoto'])assert.ok(gallery.includes(feature),feature);
 assert.match(p,/onTouchEnd=\{swipeAtTouchEnd\}/);
 assert.match(p,/onLayout=\{event=>/);
 assert.match(p,/if\(success==='Cover photo saved\.'\|\|success==='Photo order saved\.'\)/,
  'post-arrange save must collapse the actions panel');
 assert.match(p,/actionsScrollRef\.current\?\.scrollTo\(\{y:0,animated:false\}\)/,
  'successful rearrangement must restore controls scroll position');

});
