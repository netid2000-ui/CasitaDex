/** ENG-F-D isolated async port coordinator; not connected to the app. */
export type FdPhase="pending"|"staged"|"promoted"|"committed"|"recovery_needed";
export type FdPhoto={id:string;hash:string;bytes:number;owner:string};
export type FdOp={token:string;memoryId:string;draftId:string;phase:FdPhase;photos:FdPhoto[]};
export type FdPort={
 get(token:string):Promise<FdOp|null>;
 put(op:FdOp):Promise<void>;
 transition(token:string,expected:FdPhase,next:FdPhase):Promise<boolean>;
 atomicCommit(token:string,memoryId:string,draftId:string):Promise<void>;
 committed(token:string):Promise<string|null>;
};
export type FdFiles={
 stage(id:string,bytes:Uint8Array):Promise<void>;
 promote(id:string):Promise<void>;
 read(id:string):Promise<Uint8Array|null>;
};
export type FdDigest={sha256(bytes:Uint8Array):Promise<string>};
const valid=(s:string)=>{if(!/^[A-Za-z0-9_-]{1,100}$/.test(s))throw Error("Unsafe ID");return s};
export async function startAsync(db:FdPort,op:FdOp){
 valid(op.token);valid(op.memoryId);valid(op.draftId);
 if(op.phase!=="pending"||op.photos.length>5)throw Error("Invalid new operation");
 const ids=new Set<string>();
 for(const p of op.photos){
  valid(p.id);valid(p.owner);
  if(p.owner!==op.draftId||ids.has(p.id)||!(/^[a-f0-9]{64}$/.test(p.hash))||p.bytes<1||p.bytes>10000000)throw Error("Invalid media manifest");
  ids.add(p.id);
 }
 const existing=await db.get(op.token);
 if(existing){if(existing.memoryId!==op.memoryId||existing.draftId!==op.draftId)throw Error("Attempt conflict");return existing}
 await db.put(op);return op;
}
/** Durable uncertain state is required on any fault after operation registration. */
export async function saveAsync(db:FdPort,files:FdFiles,digest:FdDigest,
 op:FdOp,contents:Map<string,Uint8Array>,fault:(at:string)=>void=()=>{}){
 valid(op.token);
 const saved=await db.committed(op.token);if(saved){if(saved!==op.memoryId)throw Error("Attempt identity conflict");return saved}
 const current=await startAsync(db,op);
 if(current.phase!=="pending")throw Error("Recovery inspection required");
 try {
  for(const p of current.photos){
   const bytes=contents.get(p.id);
   if(!bytes||bytes.length!==p.bytes||await digest.sha256(bytes)!==p.hash)throw Error("Invalid media bytes");
   fault("before-stage");await files.stage(p.id,bytes);fault("after-stage");
   const staged=await files.read(p.id);
   if(!staged||staged.length!==p.bytes||await digest.sha256(staged)!==p.hash)throw Error("Staged hash mismatch");
  }
  if(!await db.transition(op.token,"pending","staged"))throw Error("Phase conflict");
  fault("after-stage-journal");
  for(const p of current.photos)await files.promote(p.id);
  if(!await db.transition(op.token,"staged","promoted"))throw Error("Phase conflict");
  fault("after-promote");
  await db.atomicCommit(op.token,op.memoryId,op.draftId);
  fault("after-commit");
  const confirmed=await db.committed(op.token);
  if(confirmed!==op.memoryId)throw Error("Save outcome unconfirmed");
  return confirmed;
 }catch(err){
  const confirmed=await db.committed(op.token);
  if(confirmed===op.memoryId)throw err;
  const now=await db.get(op.token);
  if(now&&now.phase!=="committed"&&now.phase!=="recovery_needed"){
   if(!await db.transition(op.token,now.phase,"recovery_needed"))throw Error("Failed to persist recovery state");
  }
  throw err;
 }
}
export async function inspectAsync(db:FdPort,files:FdFiles,digest:FdDigest,
 token:string,protectedOwners:Set<string>){
 const op=await db.get(valid(token));if(!op)return {status:"unknown",photos:[],doNotDelete:true};
 const committed=await db.committed(token);
 const photos=[];
 for(const p of op.photos){
  const bytes=await files.read(p.id).catch(()=>null);
  const integrity=bytes===null?"missing":bytes.length!==p.bytes||await digest.sha256(bytes)!==p.hash?"corrupt":"intact";
  photos.push({id:p.id,integrity,ownerProtected:protectedOwners.has(p.owner)});
 }
 const verified=committed===op.memoryId&&photos.every(p=>p.integrity==="intact"&&p.ownerProtected);
 return {status:verified?"committed-verified":"recovery-review",phase:op.phase,photos,doNotDelete:true};
}
