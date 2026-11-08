import test from 'node:test';
import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import {photoSummaries} from '../src/figma-first/photo-summaries.ts';
const sample={memories:[{id:'a',title:'Keys',lifecycle:'active'},{id:'b',title:'Old',lifecycle:'archived'},{id:'c',title:'Plain',lifecycle:'active'}],media:{media:[{id:'p1',cardId:'a',path:'private'},{id:'p2',cardId:'a',path:'private2'},{id:'p3',cardId:'b',path:'private3'}]}};
test('photo gallery projects active photo memories and counts only',()=>{
 const original=structuredClone(sample);
 assert.deepEqual(photoSummaries(sample),[{id:'a',title:'Keys',photoCount:2}]);
 assert.deepEqual(sample,original);
});
test('photo gallery handles no photos without leaking paths',()=>{
 assert.deepEqual(photoSummaries({...sample,media:{media:[]}}),[]);
});

test('gallery labels singular photos and saved media truthfully',()=>{
 const source=readFileSync(new URL('../src/figma-first/FigmaPhotos.tsx',import.meta.url),'utf8');
 assert.ok(source.includes('count===1?"1 photo"'));
 assert.ok(source.includes('Saved photo for'));
 assert.ok(!source.includes('Sample photo for'));
});
test('orphaned media and unfinished drafts never enter saved Photos gallery',()=>{
 const withOrphan={...sample,media:{media:[...sample.media.media,{id:'orphan',cardId:'not-a-saved-memory',path:'private4'}]},draft:{photos:[{id:'draftphoto',cardId:'draft',path:'private5'}]}};
 assert.deepEqual(photoSummaries(withOrphan),[{id:'a',title:'Keys',photoCount:2}]);
 const gallery=readFileSync(new URL('../src/app/photos.tsx',import.meta.url),'utf8');
 assert.match(gallery,/onViewPhoto=\{\(memoryId,photoId\)/);
});

test('gallery viewer provides direct navigation to owning saved memory',()=>{
 const viewer=readFileSync(new URL('../src/app/photo-viewer.tsx',import.meta.url),'utf8');
 assert.match(viewer,/PhotoMemoryViewer/);
 assert.match(readFileSync(new URL('../src/photo-memory-viewer.tsx',import.meta.url),'utf8'),/View Memory/);
 assert.match(viewer,/router\.replace\(\{pathname:'\/card',params:\{id:memoryId\}\}\)/);
});

test('thumbnail images do not intercept the enclosing photo button touch',()=>{
 const gallery=readFileSync(new URL('../src/figma-first/FigmaPhotos.tsx',import.meta.url),'utf8');
 assert.match(gallery,/View pointerEvents="none"/);
 assert.match(gallery,/onViewPhoto\(item.id,photo.id,photo.uri/);
});

test('photo tile navigates to the same proven memory details route as its title',()=>{
 const screen=readFileSync(new URL('../src/app/photos.tsx',import.meta.url),'utf8');
 assert.match(screen,/onViewPhoto=\{\(memoryId,photoId\)=>\{rememberPhoto\(memoryId\);setSelectedPhoto/);
});

test('photo gallery opens a local modal rather than switching root navigation layouts',()=>{const screen=readFileSync(new URL('../src/app/photos.tsx',import.meta.url),'utf8');assert.match(screen,/<Modal visible=\{!!selectedPhoto\}/);assert.match(screen,/PhotoMemoryViewer/);});
