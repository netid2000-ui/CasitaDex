import test from 'node:test';
import assert from 'node:assert/strict';
import {materialTokens,materialContrast} from '../src/platform/material-tokens.ts';
test('material tones preserve 4.5:1 contrast including conflicting input palettes',()=>{
 for(const surface of ['#FFFFFF','#222222','#777777']) for(const ink of ['#222222','#FFFFFF','#777777']) for(const accent of ['#F2B423','#FF0000','#0043A5']){
   const tokens=materialTokens(surface,accent,ink);
   assert.ok(materialContrast(tokens.tone,ink)>=4.5);
   assert.equal(tokens.glassTint,accent+'24');
 }
});
import {lightColors,darkColors} from '../src/theme.ts';
test('both approved editorial palettes and photo viewer remain legible',()=>{
 for(const p of [lightColors,darkColors]) assert.ok(materialContrast(materialTokens(p.paper,p.focus,p.ink).tone,p.ink)>=4.5);
 assert.ok(materialContrast(materialTokens('#081611','#B3CBB7','#FFFFFF').tone,'#FFFFFF')>=4.5);
});

import {parseMaterialAppearance,DEFAULT_MATERIAL_APPEARANCE} from '../src/platform/material-tokens.ts';
test('enhanced is default; appearance modes have distinct tint strength and legible fallback',()=>{
 assert.equal(DEFAULT_MATERIAL_APPEARANCE,'enhanced'); assert.equal(parseMaterialAppearance(null),'enhanced'); assert.equal(parseMaterialAppearance('unknown'),'enhanced');
 for(const mode of ['subtle','enhanced','expressive']) assert.equal(parseMaterialAppearance(mode),mode);
 const modes=['subtle','enhanced','expressive'].map(m=>materialTokens('#FFFDF8','#E99C27','#273924',m));
 assert.equal(new Set(modes.map(m=>m.glassTint)).size,3);assert.equal(new Set(modes.map(m=>m.tone)).size,3);
 for(const m of modes)assert.ok(materialContrast(m.tone,'#273924')>=4.5);
});
