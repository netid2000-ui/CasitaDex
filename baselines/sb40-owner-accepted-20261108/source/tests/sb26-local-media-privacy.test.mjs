import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const native=fs.readFileSync('src/eng-runtime.native.ts','utf8');
const section=(start,end)=>native.split(start)[1]?.split(end)[0]??'';
for(const [name,start,end] of [
 ['photo picker','export async function chooseEngPhoto(', 'export async function writeEngBackup('],
 ['full backup','export async function writeEngBackup(','export async function pickEngBackup('],
 ['restore picker','export async function pickEngBackup(','export type EngStore='],
 ['photo sharing','export async function shareEngPhotos(','export async function writeEngText('],
 ['text export','export async function writeEngText(', '\nexport '],
]){
 test(`${name} flow has no explicit URL download/upload API`,()=>{
  const body=section(start,end);
  assert.ok(body.length>40,`${name} present`);
  assert.doesNotMatch(body,/\bfetch\s*\(|\bXMLHttpRequest\b|\bWebSocket\b|downloadAsync\s*\(|uploadAsync\s*\(|downloadResumableStartAsync\s*\(|https?:\/\//);
 });
}
