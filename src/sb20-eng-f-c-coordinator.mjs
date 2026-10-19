/** ENG-F-C opt-in disposable coordination protocol; not wired into Android. */
import {createHash} from 'node:crypto';
const safe=id=>{if(typeof id!=='string'||!/^[A-Za-z0-9_-]{1,100}$/.test(id))throw Error('Unsafe ID');return id};
const sha=b=>createHash('sha256').update(b).digest('hex');
export function prepare(db){
 db.exec("CREATE TABLE IF NOT EXISTS fc_operations(token TEXT PRIMARY KEY,memory_id TEXT UNIQUE NOT NULL,draft_id TEXT NOT NULL,phase TEXT NOT NULL CHECK(phase IN ('pending','staged','promoted','committed','recovery_needed')))");
 db.exec("CREATE TABLE IF NOT EXISTS fc_media(id TEXT PRIMARY KEY,token TEXT NOT NULL REFERENCES fc_operations(token),hash TEXT NOT NULL,length INTEGER NOT NULL,phase TEXT NOT NULL CHECK(phase IN ('pending','staged','promoted','committed')))");
 db.exec("CREATE TABLE IF NOT EXISTS fc_memories(id TEXT PRIMARY KEY,attempt TEXT UNIQUE NOT NULL,draft_id TEXT NOT NULL)");
}
export function start(db,token,memoryId,draftId,photos){
 safe(token);safe(memoryId);safe(draftId);
 const prior=db.prepare('SELECT * FROM fc_operations WHERE token=?').get(token);
 if(prior){if(prior.memory_id!==memoryId||prior.draft_id!==draftId)throw Error('Attempt identity conflict');return prior}
 if(photos.length>5)throw Error('Too many new photos');
 db.exec('BEGIN IMMEDIATE');
 try{
 db.prepare("INSERT INTO fc_operations VALUES(?,?,?,'pending')").run(token,memoryId,draftId);
 for(const p of photos){
  safe(p.id);if(!/^[a-f0-9]{64}$/.test(p.hash)||!Number.isSafeInteger(p.length)||p.length<1)throw Error('Invalid media manifest');
  db.prepare("INSERT INTO fc_media VALUES(?,?,?,?, 'pending')").run(p.id,token,p.hash,p.length);
 }
 db.exec('COMMIT');
 }catch(e){db.exec('ROLLBACK');throw e}
 return db.prepare('SELECT * FROM fc_operations WHERE token=?').get(token);
}
export function state(db,token){return db.prepare('SELECT * FROM fc_operations WHERE token=?').get(safe(token))??null}
export function mediaState(db,token){return db.prepare('SELECT * FROM fc_media WHERE token=? ORDER BY id').all(safe(token))}
export async function perform(db,files,{token,memoryId,draftId,photos},inject=()=>{}){
 const op=start(db,token,memoryId,draftId,photos);
 const committed=db.prepare('SELECT id FROM fc_memories WHERE attempt=?').get(token);
 if(committed)return committed.id;
 if(op.phase==='recovery_needed')throw Error('Outcome uncertain; inspect before replay');
 if(op.phase!=='pending')throw Error('Interrupted operation requires reconciliation');
 const found=mediaState(db,token);
 for(const p of photos){
  const manifest=found.find(x=>x.id===p.id);
  if(!manifest||manifest.hash!==sha(p.bytes)||manifest.length!==p.bytes.length)throw Error('Media hash mismatch');
  inject('before-stage');
  await files.stage(p.id,p.bytes);
  inject('after-stage');
  const stored=await files.read(p.id);
  if(sha(stored)!==manifest.hash)throw Error('Staged bytes corrupted');
 }
 db.prepare("UPDATE fc_operations SET phase='staged' WHERE token=? AND phase='pending'").run(token);
 db.prepare("UPDATE fc_media SET phase='staged' WHERE token=?").run(token);
 inject('after-journal-stage');
 for(const p of photos)await files.promote(p.id);
 db.prepare("UPDATE fc_operations SET phase='promoted' WHERE token=? AND phase='staged'").run(token);
 db.prepare("UPDATE fc_media SET phase='promoted' WHERE token=?").run(token);
 inject('after-promote');
 db.exec('BEGIN IMMEDIATE');
 try{
  db.prepare('INSERT INTO fc_memories VALUES(?,?,?)').run(memoryId,token,draftId);
  db.prepare("UPDATE fc_operations SET phase='committed' WHERE token=?").run(token);
  db.prepare("UPDATE fc_media SET phase='committed' WHERE token=?").run(token);
  inject('before-sql-commit');db.exec('COMMIT');
 }catch(e){db.exec('ROLLBACK');throw e}
 inject('after-sql-commit');
 return memoryId;
}
export function reconcile(db,files,token,owners=new Set()){
 const op=state(db,token);if(!op)return {status:'unknown'};
 const committed=db.prepare('SELECT id FROM fc_memories WHERE attempt=?').get(token);
 const media=mediaState(db,token).map(p=>{
  const actual=files.peek(p.id);
  return {id:p.id,status:actual===null?'missing':sha(actual)!==p.hash?'corrupt':!owners.has(p.id)?'unverified-owner':'verified'};
 });
 const status=committed&&media.every(p=>p.status==='verified')?'committed-verified':committed?'committed-review':'recovery-needed';
 return {status,phase:op.phase,media,doNotDelete:true};
}
