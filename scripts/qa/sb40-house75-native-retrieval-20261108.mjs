
import {connectDevice} from '/Volumes/FA-Development/Designs-by-FA/Tools/Mobilewright/node_modules/mobilewright/dist/index.js';
import fs from 'node:fs/promises';
const out='/Volumes/FA-Development/Designs-by-FA/QA-Evidence/CasitaDex/sb40-house75-owner-journey-20261108';
const rows=JSON.parse(await fs.readFile(out+'/house75-items.json','utf8'));
const d=await connectDevice({platform:'ios',deviceId:'A4ED0D8B-C90A-4940-9B71-4F570D7DC597',actionTimeout:6500});
const file=out+'/retrieval-journal.jsonl';
async function log(e){e={at:new Date().toISOString(),...e};await fs.appendFile(file,JSON.stringify(e)+'\n');console.log(JSON.stringify(e));}
async function drag(){await d.screen.gesture({pointers:[[{x:200,y:480,time:0},{x:200,y:330,time:500}]]});}
const q=d.screen.getByType('TextField').and(d.screen.getByLabel('Search memories',{exact:true}));
async function find(query){await q.fill(query);await drag();}
try{
 await d.launchApp('com.designsbyfa.casitadex.sb40qa');
 await d.screen.getByLabel('Find a memory',{exact:true}).waitFor({state:'visible',timeout:15000});await d.screen.getByLabel('Find a memory',{exact:true}).tap();
 await q.waitFor({state:'visible',timeout:8000});
 for(let i=0;i<75;i+=5){
  const r=rows[i];await find(r.title);
  const result=d.screen.getByLabel('Open regular memory '+r.title,{exact:true});await result.waitFor({state:'visible',timeout:8000});await result.tap();
  await d.screen.getByLabel('Edit memory',{exact:true}).waitFor({state:'visible',timeout:8000});
  await d.screen.getByText(r.title,{exact:true}).first().waitFor({state:'visible',timeout:6000});
  const expected=r.answer+' Location: '+r.location+'. Fictional QA household.';
  await d.screen.getByText(expected,{exact:true}).first().waitFor({state:'visible',timeout:6000});
  await d.screen.getByLabel('‹ Results',{exact:true}).tap();await q.waitFor({state:'visible',timeout:8000});
  const restored=await q.getValue();await log({id:r.id,title:r.title,status:'search-open-return-pass',queryPreserved:restored===r.title,restoredQuery:restored});
 }
 for(const query of ['RF-DEMO-02','20x25x1','20 25 1','pantry','grout','where are the spare filters','zzznomatchhouse75']){
  await find(query);const tree=await d.screen.viewTree();await log({status:'exploratory-query',query,labels:tree.map(n=>n.label).filter(Boolean).slice(0,18)});
 }
 await find('');await fs.writeFile(out+'/final-find.png',await d.screen.screenshot());await fs.writeFile(out+'/final-find-tree.json',JSON.stringify(await d.screen.viewTree(),null,2));
 await log({status:'retrieval-phase-complete'});
}catch(error){await fs.writeFile(out+'/retrieval-failure.png',await d.screen.screenshot());await fs.writeFile(out+'/retrieval-failure-tree.json',JSON.stringify(await d.screen.viewTree(),null,2));await log({status:'blocked',error:String(error)});throw error;}finally{await d.close();}
