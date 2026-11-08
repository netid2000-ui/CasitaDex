import {connectDevice} from '/Volumes/FA-Development/Designs-by-FA/Tools/Mobilewright/node_modules/mobilewright/dist/index.js';
import fs from 'node:fs';import {execFileSync} from 'node:child_process';import {createHash} from 'node:crypto';import assert from 'node:assert/strict';
export const out='/Volumes/FA-Development/Designs-by-FA/QA-Evidence/CasitaDex/sb40-photo-workspace-20261108',uid='A4ED0D8B-C90A-4940-9B71-4F570D7DC597',bid='com.designsbyfa.casitadex.sb40qa',title='SB40 Photo Workspace Acceptance';
const container=k=>execFileSync('xcrun',['simctl','get_app_container',uid,bid,k],{encoding:'utf8'}).trim();
const sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');assert.equal(sha(container('app')+'/main.jsbundle'),sha(out+'/ios-delivered.hbc'));
export const read=()=>JSON.parse(execFileSync('python3',['-c',"import pathlib,sqlite3,sys; p=next(pathlib.Path(sys.argv[1]).rglob('casitadex-development-v1.db')); c=sqlite3.connect(p.as_uri()+'?mode=ro',uri=True); print(c.execute('SELECT payload FROM eng_state_v2 WHERE slot=1').fetchone()[0]);c.close()",container('data')],{encoding:'utf8'}));
export const d=await connectDevice({platform:'ios',deviceId:uid,actionTimeout:8000});
export const label=t=>d.screen.getByLabel(t,{exact:true}),field=t=>d.screen.getByType('TextField').and(label(t));
export const log=(name,details={})=>{const row={case:name,status:'PASS',...details};console.log(JSON.stringify(row));fs.appendFileSync(out+'/ios-journal.jsonl',JSON.stringify(row)+'\n');};
export async function safe(l,min=180,max=735){for(let i=0;i<12;i++){const b=await l.boundingBox(),y=b.y+b.height/2;if(y>=min&&y<=max)return;await d.screen.gesture({pointers:[[{x:200,y:y>max?680:380,time:0},{x:200,y:y>max?380:680,time:500}]]});}throw Error('Unreachable control');}
export async function tap(l,min=180){await safe(l,min);await l.tap();}
export async function drag(){await d.screen.gesture({pointers:[[{x:200,y:480,time:0},{x:200,y:330,time:500}]]});}
export async function fill(l,value){await safe(l);await l.tap();await l.fill(value);await drag();}
export async function capture(name){fs.writeFileSync(out+'/'+name+'.json',JSON.stringify(await d.screen.viewTree(),null,2));fs.writeFileSync(out+'/'+name+'.png',await d.screen.screenshot());}
export async function foreground(){execFileSync('xcrun',['simctl','openurl',uid,'casitadex-sb40qa://']);await label('CasitaDex logo, go to Home').waitFor({state:'visible',timeout:15000});}
