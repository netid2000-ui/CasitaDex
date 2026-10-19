/** ENG-B synthetic-only crash-safe media/draft model, NO filesystem or SQLite binding. */
export type MediaPhase="staged"|"promoted"|"committed";
export interface Photo {id:string;owner:string;mime:string;bytes:Uint8Array;sha256:string;phase:MediaPhase}
export interface Draft {id:string;title:string;answer:string;photoIds:string[];checkpoint:number}
export interface Memory {id:string;title:string;answer:string;photoIds:string[];attempt:string}
export interface StoreState {
  draft:Draft|null;photos:Record<string,Photo>;memories:Record<string,Memory>;
  attempts:Record<string,string>;journals:Record<string,"pending"|"committed">;
}
export function emptyState():StoreState{return {draft:null,photos:{},memories:{},attempts:{},journals:{}};}
const allowed=new Set(["image/jpeg","image/png","image/webp"]);
function requireId(id:string){if(!/^[A-Za-z0-9_-]{1,100}$/.test(id))throw Error("Invalid ID");}
export function beginDraft(s:StoreState,id:string){requireId(id);if(s.draft)throw Error("Existing draft must be continued or discarded");s.draft={id,title:"",answer:"",photoIds:[],checkpoint:0};}
export function checkpoint(s:StoreState,patch:{title?:string;answer?:string},fault?:()=>void){
  if(!s.draft)throw Error("No draft");
  const next={...s.draft,...patch,checkpoint:s.draft.checkpoint+1};
  if(typeof next.title!=="string"||typeof next.answer!=="string")throw Error("Invalid draft fields");
  fault?.();s.draft=next;return next.checkpoint;
}
export async function stagePhoto(s:StoreState,input:{id:string;mime:string;bytes:Uint8Array;sha256:string},
 hash:(bytes:Uint8Array)=>Promise<string>,fault?:(phase:string)=>void){
  if(!s.draft)throw Error("No draft");requireId(input.id);
  if(s.draft.photoIds.includes(input.id)||s.photos[input.id])throw Error("Duplicate media ID");
  if(s.draft.photoIds.length>=5)throw Error("Five photos maximum");
  if(!allowed.has(input.mime)||!(input.bytes instanceof Uint8Array)||
      input.bytes.length<1||input.bytes.length>10_000_000)throw Error("Invalid photo bytes/type");
  if(!/^[a-f0-9]{64}$/.test(input.sha256)||await hash(input.bytes)!==input.sha256)throw Error("Photo hash mismatch");
  fault?.("copy");const bytes=new Uint8Array(input.bytes);
  fault?.("stage");const photo:Photo={...input,bytes,owner:s.draft.id,phase:"staged"};
  // An interrupted write leaves prior durable state intact.
  s.photos[input.id]=photo;s.draft={...s.draft,photoIds:[...s.draft.photoIds,input.id],checkpoint:s.draft.checkpoint+1};
}
export function cloneState(s:StoreState):StoreState{return structuredClone(s);}
/** Simulates two independent durable stores: media bytes and transactional metadata. */
export function reconcile(s:StoreState) {
  const referenced=new Set<string>(s.draft?.photoIds??[]);
  for(const m of Object.values(s.memories))for(const id of m.photoIds)referenced.add(id);
  const problems:string[]=[];
  for(const id of referenced)if(!s.photos[id])problems.push("Missing photo "+id);
  for(const [id,p] of Object.entries(s.photos)){
    const memory=Object.values(s.memories).find(m=>m.photoIds.includes(id));
    if(memory && (p.owner!==memory.id||p.phase!=="committed"))problems.push("Uncommitted photo "+id);
    if(s.draft?.photoIds.includes(id)&&p.owner!==s.draft.id)problems.push("Wrong draft owner "+id);
  }
  return {problems,protectedIds:referenced};
}
export function removeUnreferenced(s:StoreState,id:string,extraOwners:ReadonlySet<string>=new Set()){
  if(extraOwners.has(id)||reconcile(s).protectedIds.has(id)||s.journals[id])
    throw Error("Photo still protected");
  if(!s.photos[id])return false;
  delete s.photos[id];return true;
}
/** Save replay is keyed by attempt. Pending operations may be resumed without duplicates. */
export function save(s:StoreState,attempt:string,memoryId:string,fault?:(phase:string)=>void) {
  requireId(attempt);requireId(memoryId);
  const existing=s.attempts[attempt];
  if(existing){
    const m=s.memories[existing];if(!m)throw Error("Attempt mapping corruption");
    return structuredClone(m);
  }
  if(!s.draft)throw Error("No draft");
  const d=s.draft;
  if(!d.title.trim()||(!d.answer.trim()&&!d.photoIds.length))throw Error("Title and content required");
  if(s.memories[memoryId])throw Error("Memory ID already exists");
  for(const id of d.photoIds){
    const p=s.photos[id];if(!p||p.owner!==d.id||!["staged","promoted"].includes(p.phase))throw Error("Missing staged photo");
  }
  fault?.("before-promote");
  // Simulate promotable media: metadata commit can fail and reconciliation must keep bytes.
  const next=cloneState(s);
  for(const id of d.photoIds){next.photos[id].phase="promoted";next.journals[id]="pending";}
  s.photos=next.photos;s.journals=next.journals;
  fault?.("after-promote");
  // Metadata and final journal update are a single atomic transaction in the simulator.
  const tx=cloneState(s);
  const m:Memory={id:memoryId,title:d.title,answer:d.answer,photoIds:[...d.photoIds],attempt};
  for(const id of d.photoIds){tx.photos[id].owner=memoryId;tx.photos[id].phase="committed";tx.journals[id]="committed";}
  tx.memories[memoryId]=m;tx.attempts[attempt]=memoryId;tx.draft=null;
  fault?.("before-transaction");
  Object.assign(s,tx);
  fault?.("after-transaction");
  return structuredClone(m);
}

export function settleJournal(s:StoreState,id:string){
  if(s.journals[id]!=="committed")throw Error("Uncommitted journal");
  if(!Object.values(s.memories).some(m=>m.photoIds.includes(id)))throw Error("No committed owner");
  delete s.journals[id];
}
export function discardDraft(s:StoreState){
  if(!s.draft)return [];
  const ids=[...s.draft.photoIds];s.draft=null;
  // Cleanup requires independent reference and journal reconciliation.
  return ids;
}
