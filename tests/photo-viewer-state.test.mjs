import test from 'node:test';
import assert from 'node:assert/strict';
import {clampPhotoIndex,clampPhotoZoom,photoSwipeStep,touchDistance} from '../src/photo-viewer-state.ts';
test('five-photo navigation stays within saved order and clamps boundaries without wrap',()=>{
 const paths=['a','b','c','d','e'];let index=2;
 index=clampPhotoIndex(index+1,paths.length);assert.equal(paths[index],'d');
 index=clampPhotoIndex(index-1,paths.length);assert.equal(paths[index],'c');
 assert.equal(clampPhotoIndex(-1,5),0);assert.equal(clampPhotoIndex(5,5),4);
 assert.deepEqual(paths,['a','b','c','d','e']);assert.equal(clampPhotoIndex(3,0),0);
});
test('gallery swipes require deliberate horizontal movement at base zoom',()=>{
 assert.equal(photoSwipeStep(-90,5,1),1);assert.equal(photoSwipeStep(90,5,1),-1);
 for(const args of [[-20,0,1],[-90,90,1],[-90,0,2],[NaN,0,1]])assert.equal(photoSwipeStep(...args),0);
});
test('pinch zoom uses finite positive two-touch distance and cannot exceed 1x–4x',()=>{
 assert.equal(touchDistance([{pageX:0,pageY:0},{pageX:3,pageY:4}]),5);
 assert.equal(touchDistance([{pageX:0,pageY:0}]),null);
 assert.equal(touchDistance([{pageX:0,pageY:0},{pageX:0,pageY:0}]),null);
 assert.equal(clampPhotoZoom(0),1);assert.equal(clampPhotoZoom(8),4);assert.equal(clampPhotoZoom(1.5),1.5);assert.equal(clampPhotoZoom(NaN),1);
});
