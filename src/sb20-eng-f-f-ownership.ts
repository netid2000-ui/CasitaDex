/** ENG-F-F isolated media ownership and uncertain-outcome policy. No delete APIs. */
export type OwnerKind="active"|"archived"|"recently_deleted"|"draft"|"pending"|"rollback"|"legacy";
export type OwnerRef={photoId:string;ownerId:string;kind:OwnerKind;deletedAt?:number};
export type OwnershipSnapshot={complete:boolean;refs:OwnerRef[];checkedAt:number;deletedRetentionMs:number};
export type MediaInspection={id:string;integrity:"valid"|"missing"|"corrupt"|"unknown";attemptState:"committed"|"pending"|"recovery_needed"|"unknown"};
export type MediaDecision={photoId:string;decision:"retain"|"review"|"integrity_failure";reason:string;protected:boolean};
const safe=(s:string)=>{if(typeof s!=="string"||!/^[A-Za-z0-9_-]{1,100}$/.test(s))throw Error("Unsafe identity");return s};
const kinds=new Set<OwnerKind>(["active","archived","recently_deleted","draft","pending","rollback","legacy"]);
export function inventoryOwners(snapshot:OwnershipSnapshot){
 if(!snapshot.complete)throw Error("Incomplete owner sources; cleanup forbidden");
 if(snapshot.deletedRetentionMs<30*86400000)throw Error("Insufficient deleted retention");
 const byPhoto=new Map<string,OwnerRef[]>();
 for(const r of snapshot.refs){
  safe(r.photoId);safe(r.ownerId);
  if(!kinds.has(r.kind))throw Error("Unknown owner kind");
  if(r.kind==="recently_deleted"&&(!Number.isFinite(r.deletedAt)||r.deletedAt!>snapshot.checkedAt))throw Error("Invalid deletion time");
  const refs=byPhoto.get(r.photoId)??[];refs.push(r);byPhoto.set(r.photoId,refs);
 }
 return byPhoto;
}
export function classifyMedia(snapshot:OwnershipSnapshot,media:MediaInspection[]):MediaDecision[]{
 const owners=inventoryOwners(snapshot);
 return media.map(item=>{
  safe(item.id);
  const refs=owners.get(item.id)??[];
  if(item.integrity==="missing"||item.integrity==="corrupt")return {photoId:item.id,decision:"integrity_failure",reason:item.integrity,protected:true};
  if(item.integrity!=="valid"||item.attemptState==="unknown"||item.attemptState==="recovery_needed")return {photoId:item.id,decision:"review",reason:"Uncertain media or Save outcome",protected:true};
  if(refs.length)return {photoId:item.id,decision:"retain",reason:"Protected reference: "+refs.map(r=>r.kind).join(","),protected:true};
  return {photoId:item.id,decision:"review",reason:"Unreferenced; manual review required",protected:true};
 });
}
export type RecoveryVerdict="confirmed"|"needs_inspection"|"unconfirmed_write"|"integrity_failure";
export interface RecoveryReadPort{
 committed(token:string):Promise<string|null>;
 operation(token:string):Promise<{memoryId:string;phase:string}|null>;
 recordDecision(token:string,verdict:RecoveryVerdict):Promise<void>;
}
export async function resolveSave(port:RecoveryReadPort,token:string,expectedMemoryId:string,
 decisions:MediaDecision[],errorRecordingFailed=false):Promise<{verdict:RecoveryVerdict;safeToAcknowledge:boolean}>{
 safe(token);safe(expectedMemoryId);
 let stored:string|null,operation:{memoryId:string;phase:string}|null;
 try{stored=await port.committed(token);operation=await port.operation(token)}
 catch{return {verdict:"unconfirmed_write",safeToAcknowledge:false}}
 let verdict:RecoveryVerdict;
 if(stored!==null&&stored!==expectedMemoryId)verdict="integrity_failure";
 else if(decisions.some(x=>x.decision==="integrity_failure"))verdict="integrity_failure";
 else if(stored===expectedMemoryId&&operation?.memoryId===expectedMemoryId&&operation.phase==="committed"&&decisions.every(x=>x.decision==="retain"))verdict="confirmed";
 else verdict=errorRecordingFailed?"unconfirmed_write":"needs_inspection";
 if(verdict!=="confirmed"){
  try{await port.recordDecision(token,verdict)}
  catch{return {verdict:"unconfirmed_write",safeToAcknowledge:false}}
 }
 return {verdict,safeToAcknowledge:verdict==="confirmed"};
}
