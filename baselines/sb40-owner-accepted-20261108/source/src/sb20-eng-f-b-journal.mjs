/** Isolated ENG-F-B journal: actual disposable SQLite/files, NOT native app runtime. */
import {createHash} from 'node:crypto';
import fs from 'node:fs';import path from 'node:path';
const valid=/^[A-Za-z0-9_-]{1,100}$/;
const check=x=>{if(!valid.test(x))throw Error('Unsafe id');return x};
const hash=b=>createHash('sha256').update(b).digest('hex');
export function initJournal(db){
 db.exec("CREATE TABLE IF NOT EXISTS f_b_journal (id TEXT PRIMARY KEY,draft TEXT NOT NULL,sha TEXT NOT NULL,bytes INTEGER NOT NULL,phase TEXT NOT NULL CHECK(phase IN ('pending','staged','promoted','committed')))");
}
export function register(db,{id,draft,sha,bytes}){
 check(id);check(draft);if(!/^[a-f0-9]{64}$/.test(sha)||!Number.isSafeInteger(bytes)||bytes<1||bytes>10000000)throw Error('Invalid media');
 db.prepare("INSERT INTO f_b_journal VALUES(?,?,?,?,?)").run(id,draft,sha,bytes,'pending');
}
export function advance(db,id,from,to){
 check(id);const allowed={pending:'staged',staged:'promoted',promoted:'committed'};
 if(allowed[from]!==to)throw Error('Illegal transition');
 const result=db.prepare("UPDATE f_b_journal SET phase=? WHERE id=? AND phase=?").run(to,id,from);
 if(result.changes!==1)throw Error('Journal conflict');
}
export function inspect(db,root,owners=new Set()){
 if(!root.includes('SB20-ENG-F-B-SYNTHETIC-'))throw Error('Outside synthetic fixture');
 const rows=db.prepare('SELECT * FROM f_b_journal').all();
 return rows.map(r=>{
  const f=path.join(root,'private-media',check(r.id)+'.bin');
  let status;
  if(!fs.existsSync(f))status='missing';
  else if(fs.statSync(f).size!==r.bytes||hash(fs.readFileSync(f))!==r.sha)status='corrupt';
  else if(r.phase==='committed'&&!owners.has(r.id))status='owner-review';
  else if(r.phase==='committed')status='verified';
  else status='reconcile-'+r.phase;
  return {id:r.id,status,phase:r.phase,protected:true};
 });
}
