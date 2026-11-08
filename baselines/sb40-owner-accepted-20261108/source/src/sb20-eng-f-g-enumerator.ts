/** ENG-F-G disposable SQLite only: auditable reference enumeration. */
import {classifyMedia,type OwnerKind,type OwnershipSnapshot,type MediaInspection} from "./sb20-eng-f-f-ownership.ts";
export type ReadonlySql={all(sql:string):Promise<Record<string,unknown>[]>};
const tables:readonly [OwnerKind,string][]=[
 ["active","f_g_active"],["archived","f_g_archived"],
 ["recently_deleted","f_g_deleted"],["draft","f_g_draft"],
 ["pending","f_g_pending"],["rollback","f_g_rollback"],["legacy","f_g_legacy"]];
const id=(v:unknown)=>{if(typeof v!=="string"||!/^[A-Za-z0-9_-]{1,100}$/.test(v))throw Error("Unsafe owner or media ID");return v};
export async function enumerateSyntheticOwners(sql:ReadonlySql,checkedAt:number,retentionDays=30):Promise<OwnershipSnapshot>{
 if(!Number.isFinite(checkedAt)||retentionDays<30)throw Error("Invalid retention policy");
 const refs:OwnershipSnapshot["refs"]=[];
 for(const [kind,table] of tables){
  let rows:Record<string,unknown>[];
  try{rows=await sql.all("SELECT photo_id,owner_id,deleted_at FROM "+table)}
  catch{throw Error("Incomplete ownership inventory: "+table)}
  if(!Array.isArray(rows))throw Error("Invalid owner scan");
  for(const row of rows){
   const photoId=id(row.photo_id),ownerId=id(row.owner_id);
   if(kind==="recently_deleted"&&(typeof row.deleted_at!=="number"||!Number.isFinite(row.deleted_at)||row.deleted_at>checkedAt))throw Error("Invalid deletion time");
   refs.push({photoId,ownerId,kind,...(kind==="recently_deleted"?{deletedAt:row.deleted_at as number}:{})});
  }
 }
 return {complete:true,checkedAt,deletedRetentionMs:retentionDays*86400000,refs};
}
export async function reconcileSyntheticOwners(sql:ReadonlySql,media:MediaInspection[],checkedAt:number){
 const snapshot=await enumerateSyntheticOwners(sql,checkedAt);
 return {snapshot,decisions:classifyMedia(snapshot,media),doNotDelete:true};
}
