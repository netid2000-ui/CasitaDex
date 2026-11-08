import test from 'node:test';import assert from 'node:assert/strict';import {registerHooks} from 'node:module';
import {setup,add,png,hash} from './eng-fixture.mjs';import {newEngDraft,createEngStore} from '../src/eng-store.ts';
const tick=()=>new Promise(resolve=>setImmediate(resolve));
test('actual consumer inventory protects all lifecycle, draft, recovery, legacy and journal owners and reports damaged bytes without removal',async()=>{const x=setup();try{
 for(const state of ['active','archived','recently_deleted']){let s=await add(x.store,{title:state}),m=s.data.memories.at(-1);await x.store.addMemoryPhoto(m.id,png);if(state!=='active')await x.store.lifecycle(m.id,state,'2026-10-19');}
 const d={...newEngDraft(),checkpoint:1,title:'Unfinished'};await x.store.checkpoint(d);const s=await x.store.addPhoto(d.id,png),entry=s.draft.photos[0];
 x.raw.exec('CREATE TABLE media_v2(id TEXT,card_id TEXT,relative_path TEXT,mime TEXT,byte_count INTEGER,sha256 TEXT); CREATE TABLE metadata(key TEXT PRIMARY KEY,value TEXT)');
 x.raw.prepare('INSERT INTO media_v2 VALUES(?,?,?,?,?,?)').run(entry.id,entry.cardId,entry.path,entry.mime,entry.bytes,entry.sha256);
 x.raw.prepare('INSERT INTO metadata VALUES(?,?)').run('recovery_media_v2',JSON.stringify({version:2,media:[entry]}));
 const original=new Map(x.files),audit=await x.store.audit(),owners=new Set(audit.map(r=>r.owner));for(const owner of ['active','archived','recently_deleted','draft','recovery','legacy-v1','legacy-recovery','journal:committed'])assert.ok(owners.has(owner),owner);
 x.files.set(entry.path,Uint8Array.of(0));const damaged=await x.store.audit();assert.ok(damaged.filter(r=>r.entry.path===entry.path).every(r=>r.verdict!=='verified'));assert.equal(x.files.size,original.size);assert.deepEqual(await x.store.load(),s);
 }finally{x.close()}});
test('journal restart retains uncertain photo ownership and permits safe new attachment without replay duplication',async()=>{let armed=false;const x=setup(undefined,{fault:p=>{if(armed&&p==='after-private-promotion')throw Error('interrupted')}});try{const d={...newEngDraft(),checkpoint:1,title:'Retained',answer:'Answer'};await x.store.checkpoint(d);armed=true;await assert.rejects(x.store.addPhoto(d.id,png));const pending=x.raw.prepare('SELECT payload FROM eng_media_ops_v2').get();const oldEntry=JSON.parse(pending.payload);const reopened=createEngStore(x.db,x.port,async()=>{throw Error('Must not migrate again')});assert.equal((await reopened.load()).draft.photos.length,0);assert.ok((await reopened.audit()).some(r=>r.entry.id===oldEntry.id&&r.owner==='journal:pending'&&r.verdict==='verified'));const next=await reopened.addPhoto(d.id,png);assert.equal(next.draft.photos.length,1);assert.notEqual(next.draft.photos[0].id,oldEntry.id);assert.ok(x.files.has(oldEntry.path))}finally{x.close()}});
test('actual native staging composition rolls back consumer metadata through write/readback/promotion failures and awaits native move',async()=>{
 const disk=new Map();let fault='',releaseMove,reads=0;
 const uri=parts=>parts.map(p=>typeof p==='string'?p:p.uri).join('/');
 class Directory{constructor(...p){this.uri=uri(p)}create(){}}
 class File{constructor(...p){this.uri=uri(p)}get exists(){return disk.has(this.uri)}create(){if(this.exists)throw Error('exists');disk.set(this.uri,new Uint8Array())}write(b){if(fault==='write')throw Error('disk full');disk.set(this.uri,b.slice())}async bytes(){reads++;if(fault==='read')throw Error('read denied');return fault==='corrupt'?Uint8Array.of(0):disk.get(this.uri)?.slice()}delete(){disk.delete(this.uri)}async move(to){if(fault==='move')throw Error('promotion denied');if(fault==='delay')await new Promise(r=>{releaseMove=r});disk.set(to.uri,disk.get(this.uri));disk.delete(this.uri);this.uri=to.uri}}
 globalThis.__engComposition={Directory,File,Paths:{document:'private:'}};
 const hook=registerHooks({resolve(specifier,context,next){if(specifier==='expo-file-system')return {url:'data:text/javascript,export const {Directory,File,Paths}=globalThis.__engComposition',shortCircuit:true};try{return next(specifier,context)}catch(e){if(specifier.startsWith('.'))return next(specifier+'.ts',context);throw e}}});
 try{const {createNativeMediaStore}=await import('../src/media-store.native.ts'),{stageMedia}=await import('../src/media-staging.ts');
  for(const mode of ['write','read','corrupt','move','delay']){disk.clear();const x=setup();try{const native=createNativeMediaStore(),port={...x.port,put:(entry,b)=>stageMedia(native,entry,b,hash),read:async path=>new File('private:','casitadex-media-v2',path).bytes()};const store=createEngStore(x.db,port,async()=>x.store.load());await x.store.load();const d={...newEngDraft(),checkpoint:1,title:'Native path',answer:'Kept'};await store.checkpoint(d);const before=await store.load();fault=mode;const saving=store.addPhoto(d.id,png);if(mode==='delay'){for(let i=0;i<30&&!releaseMove;i++)await tick();assert.ok(releaseMove);assert.equal(JSON.parse(x.raw.prepare('SELECT payload FROM eng_state_v2').get().payload).draft.photos.length,0);fault='';releaseMove();releaseMove=undefined;const saved=await saving;assert.equal(saved.draft.photos.length,1)}else{await assert.rejects(saving);fault='';assert.deepEqual(await store.load(),before);assert.equal([...disk.keys()].filter(p=>p.includes('/media/')).length,0)}}finally{x.close()}}
  assert.ok(reads>0);
 }finally{hook.deregister();delete globalThis.__engComposition;}
});

test("saved draft photo bytes match source after store reinitialization",async()=>{
 const x=setup();try{
 const d={...newEngDraft(),checkpoint:1,title:"Byte integrity",answer:"Preserved"};
 await x.store.checkpoint(d);
 const saved=await x.store.addPhoto(d.id,png);
 const entry=saved.draft.photos[0];
 assert.deepEqual(x.files.get(entry.path),png);
 assert.equal(await hash(x.files.get(entry.path)),entry.sha256);
 const reopened=createEngStore(x.db,x.port,async()=>{throw Error("Unexpected migration")});
 const after=await reopened.load();
 assert.equal(after.draft.photos[0].sha256,entry.sha256);
 assert.deepEqual(x.files.get(after.draft.photos[0].path),png);
 assert.ok((await reopened.audit()).some(item=>item.entry.id===entry.id&&item.verdict==="verified"));
 }finally{x.close();}
});

test("photo attachment rejects one-byte-below required storage before journal or file mutation",async()=>{
 const x=setup();try{
  const draft={...newEngDraft(),checkpoint:1,title:"Low storage boundary",answer:"Keep"};
  await x.store.checkpoint(draft);
  const before=await x.store.load();
  const priorFiles=[...x.files.entries()];
  let required=0;
  x.port.capacity=async bytes=>{required=bytes; if(bytes>png.length*2+2_000_000-1)throw Error("Insufficient storage at threshold")};
  await assert.rejects(x.store.addPhoto(draft.id,png),/Insufficient storage at threshold/);
  assert.equal(required,png.length*2+2_000_000);
  assert.deepEqual(await x.store.load(),before);
  assert.deepEqual([...x.files.entries()],priorFiles);
  assert.equal(x.raw.prepare("SELECT COUNT(*) AS n FROM eng_media_ops_v2").get().n,0);
 }finally{x.close()}
});
