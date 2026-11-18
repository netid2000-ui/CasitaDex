import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const component=fs.readFileSync(new URL('../src/header-logo.tsx',import.meta.url),'utf8');
for(const mode of ['light','dark'])test(`${mode} header logo uses transparent approved vector artwork`,()=>{
 const svg=fs.readFileSync(new URL(`../assets/home-brand/logo-right-${mode}.svg`,import.meta.url),'utf8');
 assert.doesNotMatch(svg,/<rect width="394" height="95" fill="#F5F5F5"/);
 assert.match(svg,/viewBox="0 0 394 95"/);assert.match(svg,/<path /);
 assert.ok(component.includes(`const ${mode}Logo=${JSON.stringify(svg)};`),'rendered vector matches retained source');
 assert.match(component,/width=\{148\} height=\{36\}/);
});
