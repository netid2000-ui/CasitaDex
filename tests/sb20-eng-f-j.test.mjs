import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {reconcileSynthetic} from '../src/sb20-eng-f-i-hardening.ts';
import {DatabaseSync} from 'node:sqlite';
const name='SB20-ENG-F-J-SYNTHETIC-';
function setup(){
 const root=fs.mkdtempSync(path.join(os.tmpdir(),name));
 const media=path.join(root,'media');const outside=path.join(root,'outside');
 fs.mkdirSync(media);fs.mkdirSync(outside);
 const db=new DatabaseSync(path.join(root,'fixture.sqlite'));
 for(const kind of ['active','archived','deleted','draft','pending','rollback','legacy'])
  db.exec('CREATE TABLE i_'+kind+'(id TEXT PRIMARY KEY,deleted_at INTEGER)');
 db.exec('CREATE TABLE i_refs(media_id TEXT,parent_id TEXT,owner_kind TEXT)');
 db.exec('CREATE TABLE i_media(id TEXT PRIMARY KEY,parent_id TEXT,bytes INTEGER,sha256 TEXT)');
 db.prepare('INSERT INTO i_active VALUES(?,?)').run('owner1',null);
 db.prepare('INSERT INTO i_refs VALUES(?,?,?)').run('linkphoto','owner1','active');
 const bytes=Buffer.from('synthetic-link-test');
 const hash=requireHash(bytes);
 db.prepare('INSERT INTO i_media VALUES(?,?,?,?)').run('linkphoto','owner1',bytes.length,hash);
 fs.writeFileSync(path.join(outside,'payload.bin'),bytes);
 return {root,media,outside,db,sql:{all:async q=>db.prepare(q).all()},close(){db.close()}};
}
function requireHash(bytes){return (awaitHash(bytes))}
function awaitHash(bytes){return createHash('sha256').update(bytes).digest('hex')}

test('file symlink pointing outside synthetic root is rejected, if permitted',async t=>{
 const x=setup();
 try{
  try{fs.symlinkSync(path.join(x.outside,'payload.bin'),path.join(x.media,'linkphoto.bin'),'file')}
  catch(e){if(['EPERM','EACCES'].includes(e.code)){t.skip('Windows file symlink privilege unavailable');return}throw e}
  const results=await reconcileSynthetic(x.sql,x.media,Date.now());
  assert.equal(results[0].status,'unsafe');
 }finally{x.close()}
});
test('junction portal cannot be addressed through guarded media ID',async t=>{
 const x=setup();
 try{
  const portal=path.join(x.media,'portal');
  try{fs.symlinkSync(x.outside,portal,'junction')}
  catch(e){if(['EPERM','EACCES'].includes(e.code)){t.skip('Windows junction creation unavailable');return}throw e}
  assert.equal(fs.realpathSync(portal),fs.realpathSync(x.outside));
  x.db.prepare("UPDATE i_media SET id='portal/linkphoto'").run();
  await assert.rejects(reconcileSynthetic(x.sql,x.media,Date.now()),/Invalid or duplicate manifest/);
 }finally{x.close()}
});
