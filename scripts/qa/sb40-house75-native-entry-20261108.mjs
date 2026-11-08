
import {connectDevice} from '/Volumes/FA-Development/Designs-by-FA/Tools/Mobilewright/node_modules/mobilewright/dist/index.js';
import fs from 'node:fs/promises';import {execFileSync} from 'node:child_process';
const out='/Volumes/FA-Development/Designs-by-FA/QA-Evidence/CasitaDex/sb40-house75-owner-journey-20261108';
const rows=JSON.parse(await fs.readFile(out+'/house75-items.json','utf8'));
const uid='A4ED0D8B-C90A-4940-9B71-4F570D7DC597',bundle='com.designsbyfa.casitadex.sb40qa';
const limit=Number(process.env.HOUSE75_LIMIT||75);
const journal=out+'/entry-journal.jsonl';let events=[];try{events=(await fs.readFile(journal,'utf8')).trim().split('\n').filter(Boolean).map(JSON.parse);}catch{}
const done=new Set(events.filter(e=>e.status==='saved-and-persisted').map(e=>e.id));
const readCode="import pathlib,sqlite3,json,sys; p=next(pathlib.Path(sys.argv[1]).rglob('casitadex-development-v1.db')); c=sqlite3.connect(p.as_uri()+'?mode=ro',uri=True); print(c.execute('SELECT payload FROM eng_state_v2 WHERE slot=1').fetchone()[0]); c.close()";
const container=execFileSync('xcrun',['simctl','get_app_container',uid,bundle,'data'],{encoding:'utf8'}).trim();
const snapshot=()=>JSON.parse(execFileSync('python3',['-c',readCode,container],{encoding:'utf8'}));
const d=await connectDevice({platform:'ios',deviceId:uid,actionTimeout:6000});
const field=label=>d.screen.getByType('TextField').and(d.screen.getByLabel(label,{exact:true}));
async function log(e){e={at:new Date().toISOString(),...e};await fs.appendFile(journal,JSON.stringify(e)+'\n');console.log(JSON.stringify(e));}
async function returnKey(){await d.screen.gesture({pointers:[[{x:200,y:480,time:0},{x:200,y:330,time:500}]]});}
try{
 await d.launchApp(bundle);
 await d.screen.getByLabel('Add Memory',{exact:true}).waitFor({state:'visible',timeout:15000});
 if(!done.size){await fs.writeFile(out+'/baseline.json',JSON.stringify(snapshot(),null,2));}
 for(let i=0;i<limit;i++){
  const r=rows[i];if(done.has(r.id))continue;
  const start=Date.now();await log({id:r.id,index:i+1,status:'started',title:r.title});
  await d.screen.getByLabel('Add Memory',{exact:true}).tap();
  await d.screen.getByLabel('Save',{exact:true}).waitFor({state:'visible',timeout:8000});
  await field('Memory name (Required)').waitFor({state:'visible',timeout:5000});
  if(await d.screen.getByLabel('What do you want to remember?',{exact:true}).exists())throw Error('Wrong Add flow detected: stop');
  await field('Memory name (Required)').fill(r.title);await returnKey();
  await d.screen.getByType('TextView').and(d.screen.getByLabel('Description',{exact:true})).fill(r.answer+' Location: '+r.location+'. Fictional QA household.');
  if(await field('Memory name (Required)').getValue()!==r.title)throw Error('Title field value mismatch before Save');
  if(await d.screen.getByType('TextView').and(d.screen.getByLabel('Description',{exact:true})).getValue()!==r.answer+' Location: '+r.location+'. Fictional QA household.')throw Error('Description field mismatch before Save');
  await d.screen.getByLabel('Save',{exact:true}).tap();
  await d.screen.getByLabel('Add Memory',{exact:true}).waitFor({state:'visible',timeout:12000});
  const s=snapshot();const m=s.data.memories.find(m=>m.title===r.title);
  if(!m||m.answer!==r.answer+' Location: '+r.location+'. Fictional QA household.')throw Error('Persisted readback mismatch');
  await log({id:r.id,index:i+1,status:'saved-and-persisted',title:r.title,memoryId:m.id,elapsedMs:Date.now()-start,total:s.data.memories.length});
 }
 await log({status:'entry-phase-complete',entered:limit});
 await fs.writeFile(out+'/after-entry.json',JSON.stringify(snapshot(),null,2));
}catch(error){await fs.writeFile(out+'/failure.png',await d.screen.screenshot());await fs.writeFile(out+'/failure-tree.json',JSON.stringify(await d.screen.viewTree(),null,2));await log({status:'blocked',error:String(error)});throw error;}finally{await d.close();}
