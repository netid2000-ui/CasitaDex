import test from 'node:test';
import assert from 'node:assert/strict';
import {registerHooks} from 'node:module';
test('legacy Development photo removal cannot mutate metadata or delete protected files',async()=>{
 let opens=0,deletions=0;
 globalThis.__cleanupGuardPort={open:async()=>{opens++;throw Error('Database must not open')},remove:()=>{deletions++}};
 const mocks={
 'expo-document-picker':'export const getDocumentAsync=()=>{};',
 'expo-file-system':'export class Directory{constructor(...p){this.uri=p.join("/")}};export class File{};export const Paths={document:"private:"};',
 'expo-sqlite':'export const openDatabaseAsync=globalThis.__cleanupGuardPort.open;',
 './media-integrity':'export const sniffImageMime=()=>{};',
 './media-hash.native':'export const sha256Media=()=>{};',
 './media-sqlite':'export const prepareMediaTable=()=>{};export const listAttachedMedia=()=>{};',
 './media-journal':'export const prepareMediaJournal=()=>{};',
 './media-journal-flow':'export const attachWithJournal=()=>{};',
 './media-store.native':'export const createNativeMediaStore=()=>({removeUnreferenced:globalThis.__cleanupGuardPort.remove});'
 };
 const hook=registerHooks({resolve(s,ctx,next){
  if(mocks[s])return{url:'data:text/javascript,'+encodeURIComponent(mocks[s]),shortCircuit:true};
  return next(s,ctx);
 }});
 try{
  const {removeCardImage}=await import('../src/media-attachment.native.ts');
  await assert.rejects(removeCardImage('development','saved_memory','protected_photo'),/cleanup is disabled/);
  assert.equal(opens,0);assert.equal(deletions,0);
 }finally{hook.deregister();delete globalThis.__cleanupGuardPort}
});
