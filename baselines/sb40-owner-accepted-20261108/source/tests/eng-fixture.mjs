import {DatabaseSync} from 'node:sqlite';
import {createHash} from 'node:crypto';
import {createEngStore,legacyEngSnapshot,newEngDraft} from '../src/eng-store.ts';
import {empty} from '../src/model.ts';
export const png=Uint8Array.from([137,80,78,71,13,10,26,10,1,2,3]);
export const hash=async b=>createHash('sha256').update(b).digest('hex');
export function setup(initial=legacyEngSnapshot(JSON.stringify(empty())),options={}){
 const raw=new DatabaseSync(':memory:'),files=new Map();let denied=false,putError=false;
 const db={execAsync:async q=>raw.exec(q),runAsync:async(q,...p)=>raw.prepare(q).run(...p),getFirstAsync:async(q,...p)=>raw.prepare(q).get(...p)??null,getAllAsync:async(q,...p)=>raw.prepare(q).all(...p),withExclusiveTransactionAsync:async f=>{raw.exec('BEGIN IMMEDIATE');try{await f(db);raw.exec('COMMIT')}catch(e){raw.exec('ROLLBACK');throw e}}};
 const port={hash,read:async p=>{if(!files.has(p))throw Error('Missing media');return files.get(p).slice()},put:async(e,b)=>{if(putError)throw Error('Injected private write');if(files.has(e.path))throw Error('Immutable destination');files.set(e.path,b.slice())},capacity:async()=>{if(denied)throw Error('Insufficient storage')}};
 return {raw,db,files,port,store:createEngStore(db,port,async()=>initial,options),deny(v=true){denied=v},failPut(v=true){putError=v},close(){raw.close()}};
}
export function verified(){const d=empty();d.cards=[{id:'legacy',title:'Filter',answer:'20x25',spaceId:'home',context:'Maintain',location:'Private shelf',notes:'Private note',confidence:'Verified',source:'Label A',verifiedAt:'2026-10-18',history:[{id:'old',date:'2026-10-18',action:'Original event'}]}];return legacyEngSnapshot(JSON.stringify(d))}
export async function add(store,patch={}){const d={...newEngDraft(),checkpoint:1,title:'Water shutoff',answer:'Garage wall',...patch};await store.checkpoint(d);return store.saveDraft(d.attempt,d.memoryId)}
export async function restore(store,s,choice='incoming'){const token=await store.restoreToken();return store.restore(s,choice,token)}
