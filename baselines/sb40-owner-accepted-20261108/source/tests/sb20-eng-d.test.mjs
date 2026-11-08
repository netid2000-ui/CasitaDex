import test from 'node:test';import assert from 'node:assert/strict';
import {mkdtempSync,rmSync,readFileSync,writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';import path from 'node:path';
import {createHash} from 'node:crypto';
import {Fixture} from '../src/sb20-native-fixture.mjs';
import {saveNativeDraft,verifyNativePhoto,inventoryNativeMedia} from '../src/sb20-native-adapter.ts';
const hash=b=>createHash('sha256').update(b).digest('hex');
const sha={sha256:async b=>hash(b)};
const payload=Buffer.from('synthetic-photo');
function harness(){
 const root=mkdtempSync(path.join(tmpdir(),'SB20-ENG-C-SYNTHETIC-D-'));
 const fixture=new Fixture(root);
 const photo={id:'photo1',draftId:'draft1',mime:'image/jpeg',sha256:hash(payload),bytes:payload.length,path:'media/photo1.jpg'};
 const files={
  copyPrivate:async()=>photo.path,
  readPrivate:async p=>{if(p!==photo.path)throw Error('Not found');return readFileSync(fixture.file(photo.id))}
 };
 const db={
  readDraft:async()=>fixture.draft(),
  readStaged:async id=>fixture.db.prepare('SELECT * FROM staged WHERE draft_id=?').all(id).map(x=>({...photo,sha256:x.hash,bytes:x.bytes})),
  findAttempt:async token=>fixture.getMemory(token)?.id??null,
  commitSave:async x=>{fixture.save(x.token,x.memoryId)},
 };
 return {root,fixture,files,db,photo,close(){fixture.close();rmSync(root,{recursive:true,force:true})}};
}
async function ready(h){
 h.fixture.begin('draft1');h.fixture.checkpoint('Water heater','');
 await h.fixture.stage('photo1','image/jpeg',payload,hash(payload));
}
test('native port Save commits photo-only record and retries idempotently',async()=>{
 const h=harness();try{await ready(h);
 assert.equal(await verifyNativePhoto(h.photo,h.files,sha),'verified');
 assert.equal(await saveNativeDraft(h.db,h.files,sha,'attempt1','memory1'),'memory1');
 assert.equal(await saveNativeDraft(h.db,h.files,sha,'attempt1','memory1'),'memory1');
 assert.equal(h.fixture.db.prepare('SELECT COUNT(*) n FROM memories').get().n,1);
 assert.equal(h.fixture.getPhotos('memory1').length,1);
 }finally{h.close()}
});
test('corrupted media blocks save before metadata mutation',async()=>{
 const h=harness();try{await ready(h);
 writeFileSync(h.fixture.file('photo1'),'corrupt');
 assert.equal(await verifyNativePhoto(h.photo,h.files,sha),'mismatch');
 await assert.rejects(saveNativeDraft(h.db,h.files,sha,'attempt1','memory1'),/corrupted staged media/);
 assert.ok(h.fixture.draft());assert.equal(h.fixture.getMemory('attempt1'),undefined);
 }finally{h.close()}
});
test('missing and unsafe media are read-only verdicts',async()=>{
 const h=harness();try{
 assert.equal(await verifyNativePhoto(h.photo,h.files,sha),'missing');
 assert.equal(await verifyNativePhoto({...h.photo,path:'../bad'},h.files,sha),'invalid-path');
 assert.deepEqual(await inventoryNativeMedia([h.photo],h.files,sha),[{id:'photo1',verdict:'missing'}]);
 }finally{h.close()}
});
test('uncertain commit acknowledgement preserves data for reconciliation',async()=>{
 const h=harness();try{await ready(h);
 const broken={...h.db,findAttempt:async()=>null};
 await assert.rejects(saveNativeDraft(broken,h.files,sha,'attempt1','memory1'),/outcome uncertain/);
 assert.equal(h.fixture.getMemory('attempt1').id,'memory1');
 assert.equal(h.fixture.getPhotos('memory1').length,1);
 }finally{h.close()}
});
