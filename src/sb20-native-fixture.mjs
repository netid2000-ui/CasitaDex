/** ENG-C disposable SQLite/filesystem test fixture; not wired to Android. */
import {DatabaseSync} from 'node:sqlite';
import {Buffer} from 'node:buffer';
import * as fs from 'node:fs';
import * as path from 'node:path';
import {createHash} from 'node:crypto';
const safe=x=>{if(typeof x!=='string'||!/^[A-Za-z0-9_-]{1,100}$/.test(x))throw Error('Invalid ID');return x};
const hash=b=>createHash('sha256').update(b).digest('hex');
const fault=(fn,at)=>fn?.(at);
export class Fixture {
 constructor(root){
  if(!root.includes('SB20-ENG-C-SYNTHETIC'))throw Error('Unsafe sandbox');
  this.root=root;fs.mkdirSync(root,{recursive:true});
  this.dir=path.join(root,'private-media');fs.mkdirSync(this.dir,{recursive:true});
  this.db=new DatabaseSync(path.join(root,'fixture.sqlite'));
  this.db.exec('PRAGMA foreign_keys=ON');
  this.db.exec('CREATE TABLE IF NOT EXISTS draft(id TEXT PRIMARY KEY,title TEXT NOT NULL,answer TEXT NOT NULL,checkpoint INTEGER NOT NULL)');
  this.db.exec('CREATE TABLE IF NOT EXISTS staged(id TEXT PRIMARY KEY,draft_id TEXT NOT NULL,mime TEXT NOT NULL,hash TEXT NOT NULL,bytes INTEGER NOT NULL,status TEXT NOT NULL)');
  this.db.exec('CREATE TABLE IF NOT EXISTS memories(id TEXT PRIMARY KEY,title TEXT NOT NULL,answer TEXT NOT NULL,attempt TEXT UNIQUE NOT NULL)');
  this.db.exec('CREATE TABLE IF NOT EXISTS media(id TEXT PRIMARY KEY,memory_id TEXT NOT NULL REFERENCES memories(id),hash TEXT NOT NULL,bytes INTEGER NOT NULL)');
 }
 close(){this.db.close()}
 file(id){return path.join(this.dir,safe(id)+'.bin')}
 draft(){return this.db.prepare('SELECT * FROM draft LIMIT 1').get()??null}
 begin(id){safe(id);if(this.draft())throw Error('Draft exists');this.db.prepare('INSERT INTO draft VALUES(?,?,?,?)').run(id,'','',0)}
 checkpoint(title,answer,inject){
  const d=this.draft();if(!d)throw Error('No draft');
  fault(inject,'before-checkpoint');
  this.db.prepare('UPDATE draft SET title=?,answer=?,checkpoint=checkpoint+1 WHERE id=?').run(title,answer,d.id);
  return this.draft().checkpoint;
 }
 async stage(id,mime,bytes,expected,inject){
  safe(id);const d=this.draft();if(!d)throw Error('No draft');
  if(!['image/jpeg','image/png','image/webp'].includes(mime)||!Buffer.isBuffer(bytes)||bytes.length<1||bytes.length>10000000)throw Error('Invalid media');
  if(hash(bytes)!==expected)throw Error('Hash mismatch');
  if(this.db.prepare('SELECT COUNT(*) n FROM staged WHERE draft_id=?').get(d.id).n>=5)throw Error('Five maximum');
  if(fs.existsSync(this.file(id)))throw Error('Media ID collision');
  const tmp=path.join(this.dir,safe(id)+'.partial');
  if(fs.existsSync(tmp))throw Error('Pending partial conflict');
  const fd=fs.openSync(tmp,'wx');
  try{fs.writeSync(fd,bytes);fs.fsyncSync(fd)}finally{fs.closeSync(fd)}
  fault(inject,'after-temp-write');
  fs.renameSync(tmp,this.file(id));fault(inject,'after-rename');
  if(hash(fs.readFileSync(this.file(id)))!==expected)throw Error('Stage verification failed');
  this.db.prepare('INSERT INTO staged VALUES(?,?,?,?,?,?)').run(id,d.id,mime,expected,bytes.length,'staged');
 }
 inspect(){
  const errors=[];const photos=this.db.prepare('SELECT * FROM staged').all();
  for(const p of photos){
   const name=this.file(p.id);
   if(!fs.existsSync(name)||fs.statSync(name).size!==p.bytes||hash(fs.readFileSync(name))!==p.hash)errors.push(p.id);
  }
  return {errors,photos};
 }
 save(attempt,id,inject){
  safe(attempt);safe(id);
  const prior=this.db.prepare('SELECT * FROM memories WHERE attempt=?').get(attempt);
  if(prior)return prior;
  const d=this.draft();if(!d||!d.title.trim())throw Error('Meaningful title required');
  const staged=this.db.prepare('SELECT * FROM staged WHERE draft_id=?').all(d.id);
  if(!d.answer.trim()&&!staged.length)throw Error('Written answer or photo required');
  if(this.inspect().errors.length)throw Error('Media integrity failure');
  fault(inject,'before-transaction');
  this.db.exec('BEGIN IMMEDIATE');
  try {
   this.db.prepare('INSERT INTO memories VALUES(?,?,?,?)').run(id,d.title,d.answer,attempt);
   for(const p of staged){
    this.db.prepare('INSERT INTO media VALUES(?,?,?,?)').run(p.id,id,p.hash,p.bytes);
    this.db.prepare("UPDATE staged SET status='committed' WHERE id=?").run(p.id);
   }
   this.db.prepare('DELETE FROM draft WHERE id=?').run(d.id);
   fault(inject,'during-transaction');
   this.db.exec('COMMIT');
  }catch(e){this.db.exec('ROLLBACK');throw e}
  fault(inject,'after-transaction');
  return this.db.prepare('SELECT * FROM memories WHERE attempt=?').get(attempt);
 }
 inventoryUnreferenced(){
  const owned=new Set(this.db.prepare('SELECT id FROM staged').all().map(x=>x.id));
  const observed=fs.readdirSync(this.dir);
  return observed.filter(name=>name.endsWith('.bin')&&!owned.has(name.slice(0,-4)))
    .map(name=>({name,verdict:'orphan-inspect-never-auto-delete'}));
 } getMemory(attempt){return this.db.prepare('SELECT * FROM memories WHERE attempt=?').get(attempt)}
 getPhotos(id){return this.db.prepare('SELECT * FROM media WHERE memory_id=?').all(id)}
}

