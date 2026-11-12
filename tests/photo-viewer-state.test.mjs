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
test('double-tap toggles 1x to 2x and any enlarged zoom back to 1x',async()=>{
 const {isPhotoDoubleTap,doubleTapPhotoZoom}=await import('../src/photo-viewer-state.ts');
 const a={time:1000,x:20,y:50};
 assert.equal(isPhotoDoubleTap(a,{time:1200,x:23,y:60}),true);
 assert.equal(isPhotoDoubleTap(a,{time:1400,x:23,y:60}),true);
 assert.equal(isPhotoDoubleTap(a,{time:1500,x:23,y:60}),false);
 assert.equal(isPhotoDoubleTap(a,{time:1200,x:65,y:60}),false);
 assert.equal(isPhotoDoubleTap(null,{time:1200,x:20,y:50}),false);
 assert.equal(doubleTapPhotoZoom(1),2);
 assert.equal(doubleTapPhotoZoom(2),1);
 assert.equal(doubleTapPhotoZoom(4),1);
});
test('photo pan remains within enlarged image bounds and resets at 1x',async()=>{
 const {clampPhotoPan}=await import('../src/photo-viewer-state.ts');
 assert.deepEqual(clampPhotoPan(999,-999,2,300,400),{x:150,y:-200});
 assert.deepEqual(clampPhotoPan(-999,999,4,300,400),{x:-450,y:600});
 assert.deepEqual(clampPhotoPan(100,100,1,300,400),{x:0,y:0});
 assert.deepEqual(clampPhotoPan(NaN,Infinity,2,300,400),{x:0,y:0});
});
