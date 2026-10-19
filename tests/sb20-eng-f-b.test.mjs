import test from 'node:test';import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';import {createHash} from 'node:crypto';
import * as fs from 'node:fs';import * as path from 'node:path';import {tmpdir} from 'node:os';
import {initJournal,register,advance,inspect} from '../src/sb20-eng-f-b-journal.mjs';
const hash=b=>createHash('sha256').update(b).digest('hex');
const bytes=Buffer.from('synthetic-photo-no-user-data');
function fixture(){
 const root=fs.mkdtempSync(path.join(tmpdir(),'SB20-ENG-F-B-SYNTHETIC-'));
 fs.mkdirSync(path.join(root,'private-media'));
 let db=new DatabaseSync(path.join(root,'journal.sqlite'));initJournal(db);
 return {root,get db(){return db},reopen(){db.close();db=new DatabaseSync(path.join(root,'journal.sqlite'))},
 write(id='p1'){fs.writeFileSync(path.join(root,'private-media',id+'.bin'),bytes)},
 register(id='p1'){register(db,{id,draft:'d1',sha:hash(bytes),bytes:bytes.length})},
 close(){db.close();fs.rmSync(root,{recursive:true,force:true})}};
}
test('pending journal survives SQLite reopen and retains bytes',()=>{
 const x=fixture();try{x.register();x.write();x.reopen();
 assert.deepEqual(inspect(x.db,x.root).map(x=>x.status),['reconcile-pending']);
 assert.equal(fs.existsSync(path.join(x.root,'private-media','p1.bin')),true);
 }finally{x.close()}
});
test('staged and promoted interruptions require reconciliation, never cleanup',()=>{
 const x=fixture();try{x.register();x.write();advance(x.db,'p1','pending','staged');x.reopen();
 assert.equal(inspect(x.db,x.root)[0].status,'reconcile-staged');
 advance(x.db,'p1','staged','promoted');x.reopen();
 assert.equal(inspect(x.db,x.root)[0].status,'reconcile-promoted');
 }finally{x.close()}
});
test('only committed owned media is marked verified',()=>{
 const x=fixture();try{x.register();x.write();
 advance(x.db,'p1','pending','staged');advance(x.db,'p1','staged','promoted');advance(x.db,'p1','promoted','committed');
 assert.equal(inspect(x.db,x.root)[0].status,'owner-review');
 assert.equal(inspect(x.db,x.root,new Set(['p1']))[0].status,'verified');
 }finally{x.close()}
});
test('corruption/missing file fails read-only without destructive action',()=>{
 const x=fixture();try{x.register();
 assert.equal(inspect(x.db,x.root)[0].status,'missing');
 x.write();fs.writeFileSync(path.join(x.root,'private-media','p1.bin'),'bad');
 assert.equal(inspect(x.db,x.root)[0].status,'corrupt');
 assert.equal(x.db.prepare('SELECT COUNT(*) n FROM f_b_journal').get().n,1);
 }finally{x.close()}
});
test('illegal progression and duplicate IDs fail closed',()=>{
 const x=fixture();try{x.register();
 assert.throws(()=>x.register(),/UNIQUE/);
 assert.throws(()=>advance(x.db,'p1','staged','promoted'),/Journal conflict/);
 assert.throws(()=>advance(x.db,'p1','pending','committed'),/Illegal transition/);
 assert.equal(x.db.prepare('SELECT phase FROM f_b_journal').get().phase,'pending');
 }finally{x.close()}
});
test('transaction abort rolls back journal transition',()=>{
 const x=fixture();try{x.register();x.write();
 x.db.exec("CREATE TRIGGER halt BEFORE UPDATE ON f_b_journal BEGIN SELECT RAISE(ABORT,'fault'); END");
 assert.throws(()=>advance(x.db,'p1','pending','staged'),/fault/);
 x.reopen();assert.equal(x.db.prepare('SELECT phase FROM f_b_journal').get().phase,'pending');
 assert.equal(inspect(x.db,x.root)[0].status,'reconcile-pending');
 }finally{x.close()}
});
