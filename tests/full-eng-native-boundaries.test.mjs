import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {spawn} from 'node:child_process';
import {createHash} from 'node:crypto';
import {DatabaseSync} from 'node:sqlite';
import {createEngStore,newEngDraft,legacyEngSnapshot} from '../src/eng-store.ts';
import {empty} from '../src/model.ts';
function dbAdapter(raw){
 const db={execAsync:async sql=>raw.exec(sql),runAsync:async(sql,...p)=>raw.prepare(sql).run(...p),getFirstAsync:async(sql,...p)=>raw.prepare(sql).get(...p)??null,getAllAsync:async(sql,...p)=>raw.prepare(sql).all(...p),withExclusiveTransactionAsync:async fn=>{raw.exec('BEGIN IMMEDIATE');try{await fn(db);raw.exec('COMMIT');}catch(e){raw.exec('ROLLBACK');throw e;}}};return db;
}
const png=Uint8Array.from([137,80,78,71,13,10,26,10,4,5,6]);
const hash=async b=>createHash('sha256').update(b).digest('hex');
function diskFiles(root){return {hash,read:async p=>new Uint8Array(fs.readFileSync(path.join(root,p))),put:async(e,b)=>{assert.match(e.path,/^media\/[A-Za-z0-9_-]+\.(jpg|png|webp)$/);fs.mkdirSync(path.join(root,'media'),{recursive:true});fs.writeFileSync(path.join(root,e.path),b,{flag:'wx'});},capacity:async()=>{}};}
test('native-equivalent private bytes and draft ownership survive closing every database handle',async()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'cdx-eng-disk-')),file=path.join(root,'eng.sqlite'),files=diskFiles(root);let raw=new DatabaseSync(file);
 try{raw.exec('PRAGMA journal_mode=WAL; PRAGMA synchronous=FULL');let store=createEngStore(dbAdapter(raw),files,async()=>legacyEngSnapshot(JSON.stringify(empty())));const d={...newEngDraft(),checkpoint:1,title:'Photo draft'};await store.checkpoint(d);const staged=await store.addPhoto(d.id,png);const entry=staged.draft.photos[0];raw.close();raw=new DatabaseSync(file);raw.exec('PRAGMA journal_mode=WAL; PRAGMA synchronous=FULL');store=createEngStore(dbAdapter(raw),files,async()=>{throw Error('No reimport');});assert.deepEqual((await store.load()).draft,staged.draft);assert.deepEqual(await files.read(entry.path),png);const saved=await store.saveDraft(d.attempt,d.memoryId);assert.equal(saved.data.memories[0].answer,'');assert.equal(saved.data.media.media[0].sha256,await hash(png));assert.ok((await store.audit()).every(x=>x.verdict==='verified'));
 }finally{raw.close();fs.rmSync(root,{recursive:true,force:true});}
});
test('OS-killed writer cannot leave an acknowledged mixed draft/memory snapshot',{timeout:10000},async()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'cdx-eng-kill-')),file=path.join(root,'eng.sqlite'),raw=new DatabaseSync(file);let child;
 try{raw.exec('PRAGMA journal_mode=WAL; PRAGMA synchronous=FULL');const store=createEngStore(dbAdapter(raw),diskFiles(root),async()=>legacyEngSnapshot(JSON.stringify(empty())));const d={...newEngDraft(),checkpoint:1,title:'Keep draft',answer:'Original answer'};await store.checkpoint(d);const before=await store.load();
 const code=`const {DatabaseSync}=require('node:sqlite');const db=new DatabaseSync(process.argv[1]);db.exec('PRAGMA synchronous=FULL; BEGIN IMMEDIATE');db.prepare('UPDATE eng_state_v2 SET payload=? WHERE slot=1').run('corrupt uncommitted candidate');process.stdout.write('READY');setInterval(()=>{},1000);`;
 child=spawn(process.execPath,['-e',code,file],{stdio:['ignore','pipe','pipe']});await new Promise((resolve,reject)=>{child.once('error',reject);child.once('exit',c=>reject(Error('Child exited early: '+c)));child.stdout.on('data',b=>{if(b.toString().includes('READY'))resolve();});});
 child.kill('SIGKILL');await new Promise(resolve=>child.once('exit',resolve));assert.deepEqual(await store.load(),before);assert.equal((await store.load()).data.memories.length,0);assert.equal((await store.load()).draft.id,d.id);
 }finally{if(child&&!child.killed)child.kill('SIGKILL');raw.close();fs.rmSync(root,{recursive:true,force:true});}
});
