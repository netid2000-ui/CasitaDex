import {connectDevice} from '/Volumes/FA-Development/Designs-by-FA/Tools/Mobilewright/node_modules/mobilewright/dist/index.js';
import fs from 'node:fs/promises';import {execFileSync} from 'node:child_process';import assert from 'node:assert/strict';
const out='/Volumes/FA-Development/Designs-by-FA/QA-Evidence/CasitaDex/sb40-four-items-20261108';
const uid='A4ED0D8B-C90A-4940-9B71-4F570D7DC597',bid='com.designsbyfa.casitadex.sb40qa';
const container=execFileSync('xcrun',['simctl','get_app_container',uid,bid,'data'],{encoding:'utf8'}).trim();
const read=()=>JSON.parse(execFileSync('python3',['-c',"import pathlib,sqlite3,sys,json; p=next(pathlib.Path(sys.argv[1]).rglob('casitadex-development-v1.db')); c=sqlite3.connect(p.as_uri()+'?mode=ro',uri=True); print(c.execute('SELECT payload FROM eng_state_v2 WHERE slot=1').fetchone()[0]);c.close()",container],{encoding:'utf8'}));
const d=await connectDevice({platform:'ios',deviceId:uid,actionTimeout:6500});
const label=t=>d.screen.getByLabel(t,{exact:true});const field=t=>d.screen.getByType('TextField').and(label(t));
const title='SB40 four-item acceptance memory';const space='SB40 Acceptance Space';const category='SB40 Acceptance Category';
async function log(name,details={}){const row={at:new Date().toISOString(),case:name,status:'PASS',...details};console.log(JSON.stringify(row));await fs.appendFile(out+'/native-journal.jsonl',JSON.stringify(row)+'\n');}
async function drag(){await d.screen.gesture({pointers:[[{x:200,y:480,time:0},{x:200,y:330,time:500}]]});}
async function safe(l){for(let i=0;i<16;i++){const b=await l.boundingBox();const y=b.y+b.height/2;if(y>=315&&y<=700)return;if(y>700)await d.screen.gesture({pointers:[[{x:200,y:680,time:0},{x:200,y:380,time:500}]]});else await d.screen.gesture({pointers:[[{x:200,y:380,time:0},{x:200,y:680,time:500}]]});}throw Error('Control unreachable');}
async function tap(l){await safe(l);await l.tap();}
async function fill(t,value){const l=field(t);await safe(l);await l.fill(value);await drag();}
async function openTitle(value){await field('Search memories').fill(value);await drag();await tap(label('Open regular memory '+value));await label('Edit memory').waitFor({state:'visible',timeout:8000});}
try{
 await label('Cancel').tap();await label('‹ Results').tap();
 for(const q of ['20x25x1','20 X 25 X 1','20×25×1','20 25 1']){await field('Search memories').fill(q);await drag();await label('Open regular memory HVAC return filter size').waitFor({state:'visible',timeout:8000});await log('dimension-search',{query:q});}
 await fs.writeFile(out+'/normalized-search.png',await d.screen.screenshot());
 await label('CasitaDex logo, go to Home').tap();await label('Add Memory').tap();
 await fill('Memory name (Required)',title);
 const description=d.screen.getByType('TextView').and(label('Description'));await safe(description);await description.fill('Fictional QA record for Spaces, Categories and linked-reminder acceptance. Filter size 20 x 25 x 1.');await drag();
 for(const [kind,value,index] of [['Space',space,0],['Category',category,1]]){
  await tap(label('Choose ▾').nth(index));await tap(label('+ Create new '+kind+' ▾'));await fill('New '+kind+' name',value);await tap(label('Create and assign'));await d.screen.getByText(value,{exact:true}).first().waitFor({state:'visible',timeout:8000});
  await log('add-create-and-assign-'+kind.toLowerCase(),{value});
 }
 await label('Save').tap();await label('Find a memory').waitFor({state:'visible',timeout:8000});await label('Find a memory').tap();await openTitle(title);
 let snapshot=read(),m=snapshot.data.memories.find(m=>m.title===title);assert(m);assert.equal(snapshot.data.spaces.find(s=>s.id===m.spaceId).name,space);assert.deepEqual(m.categoryIds.map(id=>snapshot.data.categories.find(c=>c.id===id).name),[category]);await log('saved-space-category-associations',{memoryId:m.id});
 await fs.writeFile(out+'/taxonomy-saved-details.png',await d.screen.screenshot());
 await label('Edit memory').tap();
 await tap(label('Choose ▾').nth(0));await tap(label('Select Space ▾'));await tap(label('None'));
 await tap(label('Choose ▾').last());await tap(label('Select Categories ▾'));await tap(label('None'));
 await label('Cancel').tap();await label('Edit memory').waitFor({state:'visible',timeout:8000});
 const cancelled=read().data.memories.find(x=>x.id===m.id);assert.equal(cancelled.spaceId,m.spaceId);assert.deepEqual(cancelled.categoryIds,m.categoryIds);await log('cancel-taxonomy-assignment-edits');
 await label('More ···').tap();await label('Remind me later').tap();await field('Reminder title *').waitFor({state:'visible',timeout:8000});await label('Save Reminder').tap();
 await label('Edit memory').waitFor({state:'visible',timeout:10000});await d.screen.getByText(title,{exact:true}).first().waitFor({state:'visible',timeout:8000});await log('linked-reminder-save-returns-originating-memory',{memoryId:m.id});await fs.writeFile(out+'/linked-reminder-return.png',await d.screen.screenshot());
 await fs.writeFile(out+'/native-state-after.json',JSON.stringify(read(),null,2));await log('phase-one-complete');
}catch(error){await fs.writeFile(out+'/native-failure.json',JSON.stringify(await d.screen.viewTree(),null,2));await fs.writeFile(out+'/native-failure.png',await d.screen.screenshot());console.log('FAILED',String(error));throw error;}finally{await d.close();}
