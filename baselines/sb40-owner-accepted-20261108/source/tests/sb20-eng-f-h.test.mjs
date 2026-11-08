import test from 'node:test';import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';import {createHash} from 'node:crypto';
import fs from 'node:fs';import path from 'node:path';import {tmpdir} from 'node:os';
import {verifySyntheticMedia} from '../src/sb20-eng-f-h-verifier.ts';
const kinds=['active','archived','deleted','draft','pending','rollback','legacy'];
function setup(){
 const root=fs.mkdtempSync(path.join(tmpdir(),'SB20-H-SYNTHETIC-'));const db=new DatabaseSync(path.join(root,'h.sqlite'));
 db.exec('CREATE TABLE h_media(id TEXT PRIMARY KEY,parent_id TEXT,bytes INTEGER,sha256 TEXT)');
 db.exec('CREATE TABLE h_refs(media_id TEXT,parent_id TEXT,owner_kind TEXT)');
 for(const k of kinds)db.exec('CREATE TABLE h_'+k+'(id TEXT PRIMARY KEY)');
 const sql={all:async q=>db.prepare(q).all()};
 const add=(id='photo1',parent='owner1',kind='active',data=Buffer.from('isolated-synthetic-photo'))=>{
  db.prepare('INSERT OR IGNORE INTO h_'+kind+' VALUES(?)').run(parent);
  db.prepare('INSERT INTO h_refs VALUES(?,?,?)').run(id,parent,kind);
  db.prepare('INSERT INTO h_media VALUES(?,?,?,?)').run(id,parent,data.length,createHash('sha256').update(data).digest('hex'));
  fs.writeFileSync(path.join(root,id+'.bin'),data);
 };
 return {root,db,sql,add,close(){db.close();fs.rmSync(root,{recursive:true,force:true})}};
}
test('valid physical synthetic bytes and parent rows pass',async()=>{const x=setup();try{x.add();assert.equal((await verifySyntheticMedia(x.sql,x.root))[0].status,'valid')}finally{x.close()}});
test('changed file contents fail checksum without deletion',async()=>{const x=setup();try{x.add();fs.writeFileSync(path.join(x.root,'photo1.bin'),'modified synthetic contents');const r=await verifySyntheticMedia(x.sql,x.root);assert.equal(r[0].status,'corrupt');assert.equal(r[0].doNotDelete,true)}finally{x.close()}});
test('missing photo file classified not deleted',async()=>{const x=setup();try{x.add();fs.unlinkSync(path.join(x.root,'photo1.bin'));assert.equal((await verifySyntheticMedia(x.sql,x.root))[0].status,'missing')}finally{x.close()}});
test('wrong parent reference fails closed',async()=>{const x=setup();try{x.add();x.db.prepare("UPDATE h_refs SET parent_id='incorrect'").run();assert.equal((await verifySyntheticMedia(x.sql,x.root))[0].status,'parent_invalid')}finally{x.close()}});
test('incomplete parent table stops verification',async()=>{const x=setup();try{x.add();const bad={all:async q=>{if(q.includes('h_legacy'))throw Error('scan failure');return x.sql.all(q)}};await assert.rejects(verifySyntheticMedia(bad,x.root),/scan failure/)}finally{x.close()}});
test('invalid photo ID cannot traverse private root',async()=>{const x=setup();try{x.add();x.db.prepare("UPDATE h_media SET id='../outside'").run();assert.equal((await verifySyntheticMedia(x.sql,x.root))[0].status,'unsafe')}finally{x.close()}});
test('owner category across all seven parent tables resolves',async()=>{const x=setup();try{for(let i=0;i<kinds.length;i++)x.add('photo'+i,'parent'+i,kinds[i]);const r=await verifySyntheticMedia(x.sql,x.root);assert.equal(r.length,7);assert.ok(r.every(v=>v.status==='valid'))}finally{x.close()}});
test('legacy parent keeps more than five preexisting media files',async()=>{const x=setup();try{for(let i=0;i<7;i++)x.add('legacy'+i,'legacyOwner','legacy');assert.equal((await verifySyntheticMedia(x.sql,x.root)).filter(v=>v.status==='valid').length,7)}finally{x.close()}});
