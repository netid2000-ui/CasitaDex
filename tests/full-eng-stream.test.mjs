import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {empty} from '../src/model.ts';
import {newEngDraft,legacyEngSnapshot} from '../src/eng-store.ts';
import {encodeEngBackup} from '../src/eng-backup.ts';
import {writeEngStream,openEngStream} from '../src/eng-stream.ts';
const hash=async bytes=>createHash('sha256').update(bytes).digest('hex');
async function photoDraft(size=8_000_000,count=3){
 const snapshot=legacyEngSnapshot(JSON.stringify(empty())),bytes=new Uint8Array(size);bytes.set([137,80,78,71,13,10,26,10]);
 snapshot.draft={...newEngDraft(),title:'Large photo draft',checkpoint:1,photos:[]};
 const digest=await hash(bytes);
 for(let i=0;i<count;i++)snapshot.draft.photos.push({id:'photo_'+i,cardId:snapshot.draft.memoryId,path:'media/photo_'+i+'.png',mime:'image/png',bytes:size,sha256:digest});
 return {snapshot,bytes,read:async()=>bytes};
}
test('native streaming exports and preflights a valid >20 MB photo draft without full-buffer reads',async()=>{
 const source=await photoDraft(),reference=await encodeEngBackup(source.snapshot,source.read,hash),out=new Uint8Array(reference.length);let at=0,maxWrite=0,maxRead=0;
 const written=await writeEngStream(source.snapshot,source.read,hash,{write:async bytes=>{maxWrite=Math.max(maxWrite,bytes.length);out.set(bytes,at);at+=bytes.length;}});
 assert.ok(out.length>20_000_000);assert.deepEqual(out,reference);assert.ok(maxWrite<=65536);
 const opened=await openEngStream({size:out.length,read:async(offset,length)=>{maxRead=Math.max(maxRead,length);return out.subarray(offset,offset+length);}},hash);
 assert.equal(opened.size,written.size);assert.equal(opened.headerHash,written.headerHash);assert.equal(opened.snapshot.draft.photos.length,3);assert.ok(maxRead<=10_000_000);for(const p of opened.snapshot.draft.photos)assert.deepEqual(await opened.read(p.path),source.bytes);
});
test('stream write interruption and corrupt/truncated readback never mutate source draft',async()=>{
 const source=await photoDraft(1000,1),before=JSON.stringify(source.snapshot);let writes=0;
 await assert.rejects(writeEngStream(source.snapshot,source.read,hash,{write:async()=>{if(++writes===5)throw Error('destination failed');}}),/destination failed/);assert.equal(JSON.stringify(source.snapshot),before);
 const raw=await encodeEngBackup(source.snapshot,source.read,hash);const corrupt=raw.slice();corrupt[corrupt.length-1]^=1;
 await assert.rejects(openEngStream({size:corrupt.length,read:async(o,n)=>corrupt.slice(o,o+n)},hash),/SHA/);
 await assert.rejects(openEngStream({size:raw.length-1,read:async(o,n)=>raw.slice(o,o+n)},hash),/frame/);assert.equal(JSON.stringify(source.snapshot),before);
});
test('valid near-limit legacy text metadata converts without losing supported authored fields',async()=>{
 const data=empty();for(let i=0;i<5000;i++)data.cards.push({id:'old_'+i,spaceId:'home',title:'Filter '+i,answer:'Original '+i,location:'x'.repeat(100),notes:'y'.repeat(80),context:'Maintain',confidence:'Unknown',source:'',history:[]});
 const raw=new TextEncoder().encode(JSON.stringify(data));assert.ok(raw.length<2_000_000);
 const opened=await openEngStream({size:raw.length,read:async(o,n)=>raw.slice(o,o+n)},hash);assert.equal(opened.snapshot.data.memories.length,5000);assert.equal(opened.snapshot.data.memories[4999].answer,'Original 4999');
});
