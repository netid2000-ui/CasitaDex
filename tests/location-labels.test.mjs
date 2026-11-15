import test from 'node:test';
import assert from 'node:assert/strict';
import {setup,verified,add,restore} from './eng-fixture.mjs';
import {createEngStore,newEngDraft,validateEngSnapshot} from '../src/eng-store.ts';
import {createTextBackup,readTextBackup} from '../src/eng-text-backup.ts';

test('legacy locations index without changing text, photos, history or lifecycle; restart is stable',async()=>{
 const initial=verified();initial.data.memories[0].location='  Private shelf  ';delete initial.data.locations;
 const x=setup(initial);try{const s=await x.store.load();assert.equal(s.data.locations[0].name,'Private shelf');assert.deepEqual(s.data.memories,initial.data.memories);
 const reopened=createEngStore(x.db,x.port,async()=>{throw Error('must not migrate again')});assert.deepEqual(await reopened.load(),s);
 }finally{x.close();}
});
test('same names allowed in different Spaces; duplicates and stale rename cannot write',async()=>{
 const x=setup(verified());try{let s=await x.store.taxonomy('space','Garage');const garage=s.data.spaces.at(-1).id;
 s=await x.store.taxonomy('location','Top shelf',s.revision,'home');const first=s.data.locations.at(-1);
 s=await x.store.taxonomy('location','Top shelf',s.revision,garage);const second=s.data.locations.at(-1);
 for(const name of ['TOP SHELF',' Top shelf '])await assert.rejects(x.store.taxonomy('location',name,s.revision,garage),/already exists/);
 await assert.rejects(x.store.renameTaxonomy('location',first.id,'Middle shelf',s.revision-1),/changed/);
 await assert.rejects(x.store.taxonomy('location','',s.revision,garage),/name/);
 await assert.rejects(x.store.taxonomy('location','x'.repeat(201),s.revision,garage),/name/);
 await assert.rejects(x.store.taxonomy('location','Shelf',s.revision,'missing'),/Space unavailable/);
 assert.deepEqual(await x.store.load(),s);assert.notEqual(first.id,second.id);
 }finally{x.close();}
});
test('rename/removal update only scoped assignments including draft; review and stale removal are safe',async()=>{
 const x=setup(verified());try{let s=await x.store.taxonomy('space','Garage');const garage=s.data.spaces.at(-1).id;
 s=await add(x.store,{title:'Other room',spaceId:garage,location:'Private shelf'});
 const other=s.data.memories.find(m=>m.title==='Other room');
 const draft={...newEngDraft(),checkpoint:1,title:'Keep me',spaceId:'home',location:'Private shelf'};await x.store.checkpoint(draft);
 const before=await x.store.load(),label=before.data.locations.find(l=>l.spaceId==='home');
 const review=await x.store.taxonomyImpact('location',label.id);assert.equal(review.memories,1);assert.equal(review.draft,true);assert.deepEqual(await x.store.load(),before);
 s=await x.store.renameTaxonomy('location',label.id,'Middle shelf',review.revision);assert.equal(s.data.memories[0].location,'Middle shelf');assert.equal(s.draft.location,'Middle shelf');assert.deepEqual(s.data.memories.find(m=>m.id===other.id),other);
 await assert.rejects(x.store.removeTaxonomy('location',label.id,review.revision),/changed/);
 const fresh=await x.store.taxonomyImpact('location',label.id);s=await x.store.removeTaxonomy('location',label.id,fresh.revision);
 assert.equal(s.data.memories[0].location,'');assert.equal(s.draft.location,'');assert.equal(s.draft.title,'Keep me');assert.equal(s.data.memories.length,2);assert.deepEqual(s.data.media,before.data.media);assert.deepEqual(s.data.memories.find(m=>m.id===other.id),other);
 assert.equal(s.data.locations.some(l=>l.id===label.id),false);
 }finally{x.close();}
});
test('backup and text restore preserve unused locations; old backup derives locations; space removal preserves location text',async()=>{
 const x=setup(verified());try{let s=await x.store.taxonomy('location','Unused shelf',undefined,'home');
 const backup=(await x.store.backup()).snapshot;assert.deepEqual(readTextBackup(JSON.parse(createTextBackup(backup))).snapshot.data.locations,s.data.locations);
 s=await x.store.taxonomy('location','Temporary',s.revision,null);s=await restore(x.store,backup);assert.deepEqual(s.data.locations,backup.data.locations);
 s=await x.store.removeTaxonomy('space','home',s.revision);assert.equal(s.data.memories[0].spaceId,null);assert.equal(s.data.memories[0].location,'Private shelf');assert.ok(s.data.locations.every(l=>l.spaceId===null));
 const old=structuredClone(backup);delete old.data.locations;assert.equal(validateEngSnapshot(old).data.locations.length,1);
 }finally{x.close();}
});
test('invalid registry rejected; failed storage commit preserves data and previous save',async()=>{
 const x=setup(verified());try{let s=await x.store.load();const label=s.data.locations[0];
 const invalid=structuredClone(s);invalid.data.locations.push({...label,id:'duplicate'});assert.throws(()=>validateEngSnapshot(invalid),/duplicate location/);
 x.deny();await assert.rejects(x.store.renameTaxonomy('location',label.id,'Other',s.revision),/storage/);assert.deepEqual(await x.store.load(),s);
 }finally{x.close();}
});

test('moving a memory preserves its location text and adds the new scoped choice',async()=>{const x=setup(verified());try{let s=await x.store.taxonomy('space','Kitchen');const kitchen=s.data.spaces.at(-1).id;s=await x.store.updateMemory({...s.data.memories[0],spaceId:kitchen},s.revision);assert.equal(s.data.memories[0].location,'Private shelf');assert.equal(s.data.locations.filter(l=>l.name==='Private shelf').length,2);s=await x.store.taxonomy('location','Private shelf',s.revision,null);s=await x.store.removeTaxonomy('space',kitchen,s.revision);assert.equal(s.data.memories[0].location,'Private shelf');assert.equal(s.data.locations.filter(l=>l.spaceId===null&&l.name==='Private shelf').length,1);}finally{x.close();}});
