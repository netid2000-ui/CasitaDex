import test from 'node:test';import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';import {createHash} from 'node:crypto';
import fs from 'node:fs';import path from 'node:path';import {tmpdir} from 'node:os';
import {reconcileSynthetic} from '../src/sb20-eng-f-i-hardening.ts';
const now=Date.UTC(2026,9,17),kinds=['active','archived','deleted','draft','pending','rollback','legacy'];
function fixture(){
 const root=fs.mkdtempSync(path.join(tmpdir(),'SB20-I-SYNTHETIC-')),db=new DatabaseSync(path.join(root,'i.sqlite'));
 for(const k of kinds)db.exec('CREATE TABLE i_'+k+'(id TEXT PRIMARY KEY,deleted_at INTEGER)');
 db.exec('CREATE TABLE i_refs(media_id TEXT,parent_id TEXT,owner_kind TEXT)');
 db.exec('CREATE TABLE i_media(id TEXT PRIMARY KEY,parent_id TEXT,bytes INTEGER,sha256 TEXT)');
 const b=Buffer.from('synthetic-byte-payload');
 const add=(id='photo1',owner='owner1',kind='active')=>{
  db.prepare('INSERT OR IGNORE INTO i_'+kind+' VALUES(?,?)').run(owner,kind==='deleted'?now-86400000:null);
  db.prepare('INSERT INTO i_refs VALUES(?,?,?)').run(id,owner,kind);
  db.prepare('INSERT INTO i_media VALUES(?,?,?,?)').run(id,owner,b.length,createHash('sha256').update(b).digest('hex'));
  fs.writeFileSync(path.join(root,id+'.bin'),b);
 };
 return {root,db,add,b,sql:{all:async q=>db.prepare(q).all()},close(){db.close();fs.rmSync(root,{recursive:true,force:true})}};
}
test('valid photo parent and file hashes pass',async()=>{const x=fixture();try{x.add();assert.deepEqual((await reconcileSynthetic(x.sql,x.root,now)).map(r=>r.status),['valid'])}finally{x.close()}});
test('dangling reference and orphaned manifest are classified without deletion',async()=>{const x=fixture();try{x.add();x.db.prepare('INSERT INTO i_refs VALUES(?,?,?)').run('unknown','owner1','active');const a=await reconcileSynthetic(x.sql,x.root,now);assert.equal(a.find(r=>r.photoId==='unknown').status,'dangling');assert.ok(a.every(r=>r.doNotDelete))}finally{x.close()}});
test('conflicting duplicate owner associations fail closed',async()=>{const x=fixture();try{x.add();x.db.prepare('INSERT INTO i_refs VALUES(?,?,?)').run('photo1','another','active');assert.equal((await reconcileSynthetic(x.sql,x.root,now)).find(r=>r.photoId==='photo1').status,'conflict')}finally{x.close()}});
test('corrupted actual synthetic bytes are flagged',async()=>{const x=fixture();try{x.add();fs.writeFileSync(path.join(x.root,'photo1.bin'),'changed');assert.equal((await reconcileSynthetic(x.sql,x.root,now))[0].status,'corrupt')}finally{x.close()}});
test('deleted lifecycle future timestamps fail closed',async()=>{const x=fixture();try{x.add('photo1','owner1','deleted');x.db.prepare('UPDATE i_deleted SET deleted_at=?').run(now+86400000);await assert.rejects(reconcileSynthetic(x.sql,x.root,now),/Invalid deleted lifecycle/)}finally{x.close()}});
test('missing mandatory source aborts enumeration',async()=>{const x=fixture();try{const broken={all:async q=>{if(q.includes('i_legacy'))throw Error('source unavailable');return x.sql.all(q)}};await assert.rejects(reconcileSynthetic(broken,x.root,now),/Incomplete parent source/)}finally{x.close()}});
test('all lifecycle ownership categories stay protected',async()=>{const x=fixture();try{for(let i=0;i<kinds.length;i++)x.add('photo'+i,'owner'+i,kinds[i]);const r=await reconcileSynthetic(x.sql,x.root,now);assert.equal(r.length,7);assert.ok(r.every(v=>v.status==='valid'&&v.doNotDelete))}finally{x.close()}});
test('symlink escape is rejected where supported',async(t)=>{const x=fixture();const outside=fs.mkdtempSync(path.join(tmpdir(),'SB20-I-OUTSIDE-'));try{x.add();fs.unlinkSync(path.join(x.root,'photo1.bin'));const target=path.join(outside,'secret.bin');fs.writeFileSync(target,x.b);try{fs.symlinkSync(target,path.join(x.root,'photo1.bin'))}catch(e){if(e.code==='EPERM'||e.code==='EACCES'){t.skip('Symlink privilege unavailable');return}throw e}assert.equal((await reconcileSynthetic(x.sql,x.root,now))[0].status,'unsafe')}finally{x.close();fs.rmSync(outside,{recursive:true,force:true})}});
test('manifest without any reference is classified orphan',async()=>{const x=fixture();try{x.add();x.db.prepare("DELETE FROM i_refs WHERE media_id='photo1'").run();const r=await reconcileSynthetic(x.sql,x.root,now);assert.equal(r[0].status,'orphan');assert.equal(r[0].doNotDelete,true)}finally{x.close()}});
