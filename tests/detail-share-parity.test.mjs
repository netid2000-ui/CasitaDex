import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fixture,root,deferred,settle} from './helpers/detail-share-harness.mjs';

test('detail and edit actions are outside the content scroll, with no duplicates',()=>{
 const f=fixture();const tree=f.render();assert.equal(tree.type,'ActionPage');
 assert.equal(f.node('Edit memory').type,'FixedAction');f.press('Edit memory');
 assert.equal(f.node('Cancel').type,'FixedAction');assert.equal(f.node('Save & return to details').type,'FixedAction');
 assert.equal(f.nodes().filter(n=>n.props.label==='Edit memory').length,0);f.unmount();
});
test('save success returns to same details; repeated gestures write only once',async()=>{
 const f=fixture();f.render();f.press('Edit memory');f.change('Memory name','Edited title');f.saveGate=deferred();
 const action=f.node('Save & return to details').props.onPress;action();action();await settle();assert.equal(f.updates.length,1);
 f.saveGate.resolve();await settle();f.render();assert.equal(f.node('Memory name'),undefined);assert.equal(f.snapshot.data.memories[0].title,'Edited title');assert.equal(f.nav.length,0);f.unmount();
});
test('failed save preserves values and Cancel makes no write',async()=>{
 const f=fixture();f.render();f.press('Edit memory');f.change('Notes','Unsaved note');f.saveError='Synthetic failure';f.press('Save & return to details');await settle();f.render();assert.equal(f.node('Notes').props.value,'Unsaved note');
 f.press('Cancel');assert.equal(f.node('Notes'),undefined);assert.equal(f.snapshot.data.memories[0].notes,'Private notes');assert.equal(f.updates.length,1);f.unmount();
});
test('identity switch resets clean edit; dirty switch is guarded and remains original',()=>{
 const f=fixture();f.render();f.press('Edit memory');f.params={id:'two'};f.render();assert.equal(f.node('Memory name'),undefined);
 f.press('Edit memory');f.change('Memory name','Unsaved two');f.params={id:'one'};f.render();assert.equal(f.node('Memory name').props.value,'Unsaved two');assert.equal(f.params.id,'two');assert.equal(f.guard(),true);f.unmount();
});
test('cold detail has an honest Find fallback and missing memory has no edit/share',()=>{
 const f=fixture();f.canBack=false;f.params={id:'missing'};f.render();assert.equal(f.node('Edit memory'),undefined);assert.equal(f.node('Share memory'),undefined);f.press('Find memories');assert.deepEqual(f.nav,[['replace','/answers']]);f.unmount();
});
test('Share memory opens one separate route and keeps original card identity',()=>{
 const f=fixture();f.render();const action=f.node('Share memory').props.onPress;action();action();assert.equal(f.nav.length,1);assert.equal(f.nav[0][1].pathname,'/share');assert.equal(f.nav[0][1].params.id,'one');assert.equal(f.node('Include notes'),undefined);f.unmount();
});
test('share defaults exclude private fields and Cancel never transmits',()=>{
 const f=fixture('EngShare');f.render();assert.equal(f.node('Include notes').props.selected,false);f.press('Cancel sharing');assert.deepEqual(f.nav,[['back']]);assert.equal(f.shares.length,0);f.unmount();
});
test('explicit share sends the exact displayed selected text and returns on OS cancel',async()=>{
 const f=fixture('EngShare');f.render();f.press('Include notes');const text=f.nodes().find(n=>n.type==='Copy'&&n.props.selectable).props.children[0];
 f.press('Share selected details');await settle();f.render();assert.equal(f.shares.length,1);assert.equal(f.shares[0].message,text);assert.match(text,/Private notes/);assert.doesNotMatch(text,/Private location|Private source/);assert.deepEqual(f.nav,[['back']]);f.unmount();
});
test('share double taps do not repeat; stale native completion cannot navigate',async()=>{
 const f=fixture('EngShare');f.shareGate=deferred();f.render();const action=f.node('Share selected details').props.onPress;action();action();await settle();assert.equal(f.shares.length,1);
 f.press('Memory details');f.focused=false;f.render();f.shareGate.resolve();await settle();assert.equal(f.nav.length,1);f.unmount();
});
test('source revision change fails closed before presentation',async()=>{
 const f=fixture('EngShare');f.render();f.snapshot={...f.snapshot,revision:8};f.press('Share selected details');await settle();f.render();assert.equal(f.shares.length,0);assert.match(f.nodes().filter(n=>n.type==='Copy').map(n=>n.props.children.join('')).join(' '),/changed/);f.unmount();
});
test('background interruption before presentation never opens a share sheet',async()=>{
 const f=fixture('EngShare');f.render();f.native.AppState.currentState='background';f.press('Share selected details');await settle();assert.equal(f.shares.length,0);f.unmount();
});
test('photo preparation cancellation and source changes prevent presentation',async()=>{
 for(const variant of ['cancel','revision']){const f=fixture('EngShare');f.snapshot.data.memories[0].mediaIds=['photo'];f.snapshot.data.media.media=[{id:'photo',cardId:'one',path:'photo.jpg',mime:'image/jpeg',bytes:2,sha256:'hash'}];f.prepareGate=deferred();f.render();f.press('Include photo 1');f.press('Share selected details');await settle();
 if(variant==='cancel')f.press('Cancel sharing');else f.snapshot={...f.snapshot,revision:8};f.prepareGate.resolve();await settle();assert.equal(f.photoShares.length,0);f.unmount();}
});
test('missing/deleted share memory cannot transmit and cold share returns to same card',()=>{
 const f=fixture('EngShare');f.snapshot.data.memories[0].lifecycle='recently_deleted';f.params={id:'one'};f.canBack=false;f.render();assert.equal(f.node('Share selected details').props.disabled,true);f.press('Memory details');assert.equal(f.nav[0][1].pathname,'/card');assert.equal(f.nav[0][1].params.id,'one');f.unmount();
});
test('share route uses Find selection and runtime validates after ZIP creation',()=>{
 const shell=fs.readFileSync(path.join(root,'src/app/_layout.tsx'),'utf8');assert.match(shell,/path === "\/share"/);
 const runtime=fs.readFileSync(path.join(root,'src/eng-runtime.native.ts'),'utf8');assert.match(runtime,/writeShareZip[\s\S]*await beforePresent\?\.\(\);await Sharing\.shareAsync/);
});
test('same-revision memory replacement still fails closed',async()=>{
 const f=fixture('EngShare');f.render();f.snapshot={...f.snapshot,data:{...f.snapshot.data,memories:f.snapshot.data.memories.map(m=>m.id==='one'?{...m,answer:'Replaced answer'}:m)}};
 f.press('Share selected details');await settle();assert.equal(f.shares.length,0);f.unmount();
});
test('deletion during editing never writes and cancel remains available',async()=>{
 const f=fixture();f.render();f.press('Edit memory');f.change('Notes','Unsaved');f.e.snapshot={...f.snapshot,data:{...f.snapshot.data,memories:[]}};f.render();assert.equal(f.node('Save & return to details').props.disabled,true);f.press('Cancel');await settle();assert.equal(f.updates.length,0);f.unmount();
});
test('new share identity resets selection and prevents old async completion routing',async()=>{
 const f=fixture('EngShare');f.shareGate=deferred();f.render();f.press('Include notes');f.press('Share selected details');await settle();f.params={id:'two',from:'detail'};f.render();assert.equal(f.node('Include notes').props.selected,false);f.shareGate.resolve();await settle();assert.equal(f.nav.length,0);f.unmount();
});
test('repeated and mixed exit gestures navigate only once',()=>{
 const d=fixture();d.render();const back=d.node('Back').props.onPress;back();back();assert.equal(d.nav.length,1);d.unmount();
 for(const hardware of [false,true]){const s=fixture('EngShare');s.render();if(hardware)s.back();else s.node('Memory details').props.onPress();s.node('Cancel sharing').props.onPress();assert.equal(s.nav.length,1);s.unmount();}
});
test('only matching preceding card history permits pop; untrusted params fall back safely',()=>{
 for(const prior of ['home','card']){const f=fixture('EngShare');f.navigationState={index:1,routes:[{name:prior,params:{id:'two'}},{name:'share',params:{id:'one'}}]};f.params={id:'one',from:'detail'};f.render();f.press('Memory details');assert.equal(f.nav[0][0],'replace');assert.equal(f.nav[0][1].params.id,'one');f.unmount();}
});
test('actual useEng: committed save survives failed refresh without stale editor',async()=>{
 const f=fixture('EngDetail',true);f.render();await settle();f.render();f.press('Edit memory');f.change('Notes','Durable note');const read=f.store.load;f.store.load=async()=>{if(f.updates.length)throw Error('Synthetic readback failure');return read();};
 f.press('Save & return to details');await settle();f.render();assert.equal(f.node('Notes'),undefined);assert.equal(f.snapshot.data.memories[0].notes,'Durable note');assert.ok(f.nodes().some(n=>n.type==='Copy'&&n.props.children.includes('Durable note')));assert.ok(f.nodes().some(n=>n.type==='Copy'&&n.props.children.join(' ').includes('Change saved on this device, but the list could not refresh')));f.unmount();
});
test('leaving sessions cannot start new sharing, editing or saving before blur',async()=>{
 const s=fixture('EngShare');s.render();const send=s.node('Share selected details').props.onPress;s.node('Cancel sharing').props.onPress();send();await settle();assert.equal(s.shares.length,0);s.unmount();
 const d=fixture();d.render();const share=d.node('Share memory').props.onPress,edit=d.node('Edit memory').props.onPress;d.node('Back').props.onPress();share();edit();d.render();assert.equal(d.nav.length,1);assert.equal(d.node('Memory name'),undefined);d.unmount();
});


test('failed edit feedback belongs beside actions and clears on Cancel without changing data',async()=>{
 const f=fixture('EngDetail',true);f.render();await settle();f.render();
 const original=structuredClone(f.snapshot);f.press('Edit memory');f.change('Memory name','');f.saveError='Synthetic validation failure';
 f.press('Save & return to details');await settle();const failed=f.render();
 assert.equal(f.node('Memory name').props.value,'');
 assert.equal(failed.props.feedback?.props.text,'Synthetic validation failure');
 assert.deepEqual(f.snapshot,original);
 f.press('Cancel');const detail=f.render();
 assert.equal(detail.props.feedback,null);assert.equal(f.node('Memory name'),undefined);
 assert.ok(!f.nodes().some(n=>n.type==='Copy'&&n.props.children.includes('Synthetic validation failure')));
 f.press('Edit memory');assert.equal(f.render().props.feedback.props.text,'');
 assert.equal(f.node('Memory name').props.value,'Memory one');assert.deepEqual(f.snapshot,original);f.unmount();
});
