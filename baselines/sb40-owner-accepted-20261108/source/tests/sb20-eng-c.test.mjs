import test from 'node:test';import assert from 'node:assert/strict';
import {mkdtempSync,rmSync,readFileSync,existsSync} from 'node:fs';
import {tmpdir} from 'node:os';import path from 'node:path';
import {createHash} from 'node:crypto';
import {Fixture} from '../src/sb20-native-fixture.mjs';
const hash=b=>createHash('sha256').update(b).digest('hex');
function setup(){const root=mkdtempSync(path.join(tmpdir(),'SB20-ENG-C-SYNTHETIC-'));return {root,db:new Fixture(root)}}
function stop(x){x.db.close();rmSync(x.root,{recursive:true,force:true})}
const photo=Buffer.from('synthetic-photo-payload');
test('real SQLite draft checkpoint survives close and reopen',()=>{const x=setup();try{
 x.db.begin('draft1');x.db.checkpoint('Water heater','');
 x.db.close();x.db=new Fixture(x.root);
 assert.equal(x.db.draft().checkpoint,1);assert.equal(x.db.draft().title,'Water heater');
 assert.throws(()=>x.db.checkpoint('WRONG','',()=>{throw Error('interrupt')}),/interrupt/);
 assert.equal(x.db.draft().title,'Water heater');
}finally{stop(x)}});
test('verified staged byte file survives reopen',async()=>{const x=setup();try{
 x.db.begin('draft1');await x.db.stage('img1','image/jpeg',photo,hash(photo));
 x.db.close();x.db=new Fixture(x.root);
 assert.deepEqual(x.db.inspect().errors,[]);assert.equal(readFileSync(x.db.file('img1')).toString(),photo.toString());
}finally{stop(x)}});
test('wrong hash and path rejected without attachment',async()=>{const x=setup();try{
 x.db.begin('draft1');await assert.rejects(x.db.stage('img1','image/jpeg',photo,'bad'),/Hash mismatch/);
 await assert.rejects(x.db.stage('../escape','image/jpeg',photo,hash(photo)),/Invalid ID/);
 assert.equal(x.db.inspect().photos.length,0);
}finally{stop(x)}});
test('mid-transaction failure rolls back metadata and retains draft',async()=>{const x=setup();try{
 x.db.begin('draft1');x.db.checkpoint('Water heater','');
 await x.db.stage('img1','image/jpeg',photo,hash(photo));
 assert.throws(()=>x.db.save('attempt1','memory1',at=>{if(at==='during-transaction')throw Error('power loss')}),/power loss/);
 x.db.close();x.db=new Fixture(x.root);
 assert.equal(x.db.draft().id,'draft1');assert.equal(x.db.getMemory('attempt1'),undefined);
 assert.deepEqual(x.db.inspect().errors,[]);
 assert.equal(x.db.save('attempt1','memory1').id,'memory1');
 assert.equal(x.db.getPhotos('memory1').length,1);
}finally{stop(x)}});
test('post-commit lost acknowledgement retries without duplicates',async()=>{const x=setup();try{
 x.db.begin('draft1');x.db.checkpoint('Water heater','');
 await x.db.stage('img1','image/jpeg',photo,hash(photo));
 assert.throws(()=>x.db.save('attempt1','memory1',at=>{if(at==='after-transaction')throw Error('response lost')}),/response lost/);
 x.db.close();x.db=new Fixture(x.root);
 assert.equal(x.db.draft(),null);
 assert.equal(x.db.save('attempt1','memory1').id,'memory1');
 assert.equal(x.db.db.prepare('SELECT COUNT(*) n FROM memories').get().n,1);
 assert.equal(x.db.getPhotos('memory1').length,1);
}finally{stop(x)}});
test('partial stage interruption leaves record uncommitted and inspectable',async()=>{const x=setup();try{
 x.db.begin('draft1');x.db.checkpoint('Water heater','');
 await assert.rejects(x.db.stage('img1','image/jpeg',photo,hash(photo),at=>{if(at==='after-rename')throw Error('halt')}),/halt/);
 x.db.close();x.db=new Fixture(x.root);
 assert.equal(x.db.inspect().photos.length,0);
 assert.equal(existsSync(x.db.file('img1')),true);
 assert.equal(x.db.draft().id,'draft1');
}finally{stop(x)}});
test('orphan inventory marks ambiguous files but never deletes bytes',async()=>{const x=setup();try{
 x.db.begin('draft1');await assert.rejects(x.db.stage('img1','image/jpeg',photo,hash(photo),at=>{if(at==='after-rename')throw Error('halt')}),/halt/);
 assert.deepEqual(x.db.inventoryUnreferenced(),[{name:'img1.bin',verdict:'orphan-inspect-never-auto-delete'}]);
 assert.equal(existsSync(x.db.file('img1')),true);
}finally{stop(x)}});
test('corrupted staged file reported without modifying saved draft',async()=>{const x=setup();try{
 x.db.begin('draft1');x.db.checkpoint('Water heater','');
 await x.db.stage('img1','image/jpeg',photo,hash(photo));
 const {writeFileSync}=await import('node:fs');writeFileSync(x.db.file('img1'),'corrupt');
 assert.deepEqual(x.db.inspect().errors,['img1']);
 assert.throws(()=>x.db.save('attempt1','memory1'),/Media integrity failure/);
 assert.equal(x.db.draft().title,'Water heater');
}finally{stop(x)}});
