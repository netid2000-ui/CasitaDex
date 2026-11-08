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
async function fill(t,value){const l=field(t);await safe(l);await l.tap();await l.fill(value);await drag();}
async function openTitle(value){await field('Search memories').fill(value);await drag();await tap(label('Open regular memory '+value));await label('Edit memory').waitFor({state:'visible',timeout:8000});}
try{
 await fill('New Category name','SB40 Acceptance Category B');await tap(label('Create and assign'));
 let snapshot=read(),m=snapshot.data.memories.find(m=>m.title===title);assert.equal(m.categoryIds.length,2);await log('direct-details-create-and-assign-second-category',{categories:m.categoryIds.map(id=>snapshot.data.categories.find(c=>c.id===id).name)});
 await label('Edit memory').tap();await label('Save & return to details').waitFor({state:'visible',timeout:8000});
 await tap(label('Choose ▾').nth(0));await tap(label('Select Space ▾'));await tap(label('None'));
 await label('Save & return to details').tap();await label('Edit memory').waitFor({state:'visible',timeout:8000});
 assert.equal(read().data.memories.find(x=>x.id===m.id).spaceId,null);await log('full-edit-save-space-unassignment');
 await label('CasitaDex logo, go to Home').tap();await label('Settings').waitFor({state:'visible',timeout:8000});await label('Settings').tap();await tap(label('Spaces & categories'));
 for(const [kind,original,renamed] of [['Spaces',space,space+' Renamed'],['Categories','SB40 Acceptance Category B','SB40 Acceptance Category B Renamed']]){
  await tap(label(kind));await tap(d.screen.getByType('Button').and(label(original)));await fill('Label name',renamed);await tap(label('Rename selected label'));
  snapshot=read();assert((kind==='Spaces'?snapshot.data.spaces:snapshot.data.categories).some(x=>x.name===renamed));await log('rename-'+kind.toLowerCase(),{from:original,to:renamed});
  await tap(label('Review label removal'));await tap(label('Cancel label removal'));snapshot=read();assert((kind==='Spaces'?snapshot.data.spaces:snapshot.data.categories).some(x=>x.name===renamed));await log('cancel-label-removal-'+kind.toLowerCase());
  await tap(label('Review label removal'));await fs.writeFile(out+'/label-removal-'+kind+'.png',await d.screen.screenshot());await tap(label('Confirm remove label only'));snapshot=read();assert(!(kind==='Spaces'?snapshot.data.spaces:snapshot.data.categories).some(x=>x.name===renamed));m=snapshot.data.memories.find(m=>m.title===title);assert(m);if(kind==='Spaces')assert.equal(m.spaceId,null);else assert.equal(m.categoryIds.length,1);await log('remove-label-keeps-memory-'+kind.toLowerCase());
 }
 const before=read();await fs.writeFile(out+'/before-final-relaunch.json',JSON.stringify(before,null,2));
 execFileSync('xcrun',['simctl','terminate',uid,bid]);execFileSync('xcrun',['simctl','launch',uid,bid]);await label('Find a memory').waitFor({state:'visible',timeout:12000});await label('Find a memory').tap();await openTitle(title);assert.deepEqual(read(),before);await log('taxonomy-survives-relaunch');
 await fs.writeFile(out+'/native-state-final.json',JSON.stringify(read(),null,2));await fs.writeFile(out+'/final-taxonomy-details.png',await d.screen.screenshot());
}catch(error){await fs.writeFile(out+'/native-phase3-failure.json',JSON.stringify(await d.screen.viewTree(),null,2));console.log('FAILED',String(error));throw error;}finally{await d.close();}
