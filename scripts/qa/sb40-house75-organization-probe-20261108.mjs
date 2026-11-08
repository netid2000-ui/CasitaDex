
import {connectDevice} from '/Volumes/FA-Development/Designs-by-FA/Tools/Mobilewright/node_modules/mobilewright/dist/index.js';import fs from 'node:fs/promises';
const out='/Volumes/FA-Development/Designs-by-FA/QA-Evidence/CasitaDex/sb40-house75-owner-journey-20261108';
const d=await connectDevice({platform:'ios',deviceId:'A4ED0D8B-C90A-4940-9B71-4F570D7DC597',actionTimeout:6500});
const field=l=>d.screen.getByType('TextField').and(d.screen.getByLabel(l,{exact:true}));
async function drag(){await d.screen.gesture({pointers:[[{x:200,y:480,time:0},{x:200,y:330,time:500}]]});}
async function safe(l){for(let i=0;i<12;i++){const b=await l.boundingBox();const y=b.y+b.height/2;if(y>=315&&y<=700)return;if(y>700)await d.screen.gesture({pointers:[[{x:200,y:680,time:0},{x:200,y:380,time:500}]]});else await d.screen.gesture({pointers:[[{x:200,y:380,time:0},{x:200,y:680,time:500}]]});}throw Error('Target outside content viewport');}
async function tap(l){await safe(l);await l.tap();}
try{
 await field('Search memories').fill('HVAC return filter size');await drag();await tap(d.screen.getByLabel('Open regular memory HVAC return filter size',{exact:true}));
 await d.screen.getByLabel('Edit memory',{exact:true}).waitFor({state:'visible',timeout:8000});
 for(const [type,index,value]of [['Space',0,'House75 QA Home'],['Category',1,'House75 Maintenance']]){
  await tap(d.screen.getByLabel('Edit ✎',{exact:true}).nth(index));
  await tap(d.screen.getByLabel('+ Create new '+type+' ▾',{exact:true}));
  const f=field('New '+type+' name');await safe(f);await f.fill(value);await drag();await tap(d.screen.getByLabel('Create and assign',{exact:true}));
  await d.screen.getByText(value,{exact:true}).first().waitFor({state:'visible',timeout:8000});
  await fs.appendFile(out+'/workflow-journal.jsonl',JSON.stringify({case:'create-and-assign-'+type.toLowerCase(),status:'PASS_UI',value,memory:'HVAC return filter size'})+'\n');console.log('CREATED',type,value);
 }
 await fs.writeFile(out+'/organized-memory.png',await d.screen.screenshot());await d.screen.getByLabel('‹ Results',{exact:true}).tap();
}catch(error){await fs.writeFile(out+'/taxonomy-failure.json',JSON.stringify(await d.screen.viewTree(),null,2));console.log('TAXONOMY_BLOCKED',String(error));throw error;}finally{await d.close();}
