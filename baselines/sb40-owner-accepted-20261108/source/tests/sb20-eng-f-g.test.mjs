import test from 'node:test';import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';import fs from 'node:fs';import path from 'node:path';import {tmpdir} from 'node:os';
import {enumerateSyntheticOwners,reconcileSyntheticOwners} from '../src/sb20-eng-f-g-enumerator.ts';
const tables=['active','archived','deleted','draft','pending','rollback','legacy'];
const now=Date.UTC(2026,9,17);
function fixture(){
 const root=fs.mkdtempSync(path.join(tmpdir(),'SB20-ENG-F-G-SYNTHETIC-'));
 let db=new DatabaseSync(path.join(root,'fixture.sqlite'));
 for(const t of tables)db.exec('CREATE TABLE f_g_'+t+' (photo_id TEXT, owner_id TEXT, deleted_at INTEGER)');
 const sql={all:async q=>db.prepare(q).all()};
 return {root,sql,get db(){return db},reopen(){db.close();db=new DatabaseSync(path.join(root,'fixture.sqlite'))},close(){db.close();fs.rmSync(root,{recursive:true,force:true})}};
}
test('seven source tables independently enumerate protected photo references',async()=>{
 const x=fixture();try{
 for(let i=0;i<tables.length;i++)x.db.prepare('INSERT INTO f_g_'+tables[i]+' VALUES(?,?,?)').run('photo'+i,'owner'+i,tables[i]==='deleted'?now-86400000:null);
 x.reopen();
 const v=await enumerateSyntheticOwners(x.sql,now);
 assert.equal(v.refs.length,7);assert.deepEqual(new Set(v.refs.map(r=>r.kind)),new Set(['active','archived','recently_deleted','draft','pending','rollback','legacy']));
 const result=await reconcileSyntheticOwners(x.sql,v.refs.map(r=>({id:r.photoId,integrity:'valid',attemptState:'committed'})),now);
 assert.ok(result.decisions.every(d=>d.protected&&d.decision==='retain'));
 }finally{x.close()}
});
test('incomplete required source scan stops enumeration',async()=>{
 const x=fixture();try{
 const broken={all:async q=>{if(q.includes('f_g_legacy'))throw Error('missing');return x.sql.all(q)}};
 await assert.rejects(enumerateSyntheticOwners(broken,now),/Incomplete ownership inventory/);
 }finally{x.close()}
});
test('invalid parent and corrupt photo are retained for review',async()=>{
 const x=fixture();try{
 x.db.prepare('INSERT INTO f_g_active VALUES(?,?,?)').run('photo1','owner1',null);
 const v=await reconcileSyntheticOwners(x.sql,[{id:'photo1',integrity:'corrupt',attemptState:'recovery_needed'},{id:'orphan1',integrity:'valid',attemptState:'committed'}],now);
 assert.deepEqual(v.decisions.map(d=>d.decision),['integrity_failure','review']);
 assert.ok(v.decisions.every(d=>d.protected));
 }finally{x.close()}
});
test('wrong parent identifier and unsupported deletion timestamp fail closed',async()=>{
 const x=fixture();try{
 x.db.prepare('INSERT INTO f_g_draft VALUES(?,?,?)').run('photo1','../outside',null);
 await assert.rejects(enumerateSyntheticOwners(x.sql,now),/Unsafe owner/);
 }finally{x.close()}
 const y=fixture();try{
 y.db.prepare('INSERT INTO f_g_deleted VALUES(?,?,?)').run('photo1','owner1',now+86400000);
 await assert.rejects(enumerateSyntheticOwners(y.sql,now),/Invalid deletion time/);
 }finally{y.close()}
});
test('legacy record with more than five photos remains enumerated',async()=>{
 const x=fixture();try{
 for(let i=0;i<7;i++)x.db.prepare('INSERT INTO f_g_legacy VALUES(?,?,?)').run('legacy'+i,'owner1',null);
 assert.equal((await enumerateSyntheticOwners(x.sql,now)).refs.length,7);
 }finally{x.close()}
});
test('unknown Save attempt from enumerated owner remains unacknowledged',async()=>{
 const x=fixture();try{
 x.db.prepare('INSERT INTO f_g_pending VALUES(?,?,?)').run('photo1','draft1',null);
 const r=await reconcileSyntheticOwners(x.sql,[{id:'photo1',integrity:'valid',attemptState:'recovery_needed'}],now);
 assert.equal(r.decisions[0].decision,'review');assert.equal(r.doNotDelete,true);
 }finally{x.close()}
});
test('duplicate media ownership across sources remains protected',async()=>{
 const x=fixture();try{
 x.db.prepare('INSERT INTO f_g_active VALUES(?,?,?)').run('photo1','owner1',null);
 x.db.prepare('INSERT INTO f_g_rollback VALUES(?,?,?)').run('photo1','owner1',null);
 const v=await reconcileSyntheticOwners(x.sql,[{id:'photo1',integrity:'valid',attemptState:'committed'}],now);
 assert.equal(v.snapshot.refs.length,2);assert.equal(v.decisions[0].decision,'retain');
 }finally{x.close()}
});
