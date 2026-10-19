/** ENG-F-H disposable app-shaped SQLite reference+byte verifier. No cleanup. */
import {createHash} from "node:crypto";
import {readFile} from "node:fs/promises";
import {resolve,relative,sep} from "node:path";
import type {ReadonlySql} from "./sb20-eng-f-g-enumerator.ts";
export type HRow=Record<string,unknown>;
export type HResult={id:string;status:"valid"|"corrupt"|"missing"|"unsafe"|"parent_invalid"|"manifest_invalid";doNotDelete:true};
const valid=(v:unknown)=>typeof v==="string"&&/^[A-Za-z0-9_-]{1,100}$/.test(v);
const stages=["active","archived","deleted","draft","pending","rollback","legacy"] as const;
export async function verifySyntheticMedia(sql:ReadonlySql,root:string):Promise<HResult[]>{
 const manifest=await sql.all("SELECT id,parent_id,bytes,sha256 FROM h_media");
 const parents=new Map<string,string>();
 for(const stage of stages){
  const rows=await sql.all("SELECT id FROM h_"+stage);
  if(!Array.isArray(rows))throw Error("Incomplete parents "+stage);
  for(const row of rows){
   if(!valid(row.id))throw Error("Unsafe parent");
   const key=stage+":"+row.id;
   if(parents.has(key))throw Error("Duplicate parent");
   parents.set(key,stage);
  }
 }
 const refs=await sql.all("SELECT media_id,parent_id,owner_kind FROM h_refs");
 const refsByMedia=new Map<string,HRow[]>();
 for(const r of refs){
  if(!valid(r.media_id)||!valid(r.parent_id)||!stages.includes(r.owner_kind as typeof stages[number]))throw Error("Invalid media ownership");
  const entries=refsByMedia.get(r.media_id as string)??[];entries.push(r);refsByMedia.set(r.media_id as string,entries);
 }
 const results:HResult[]=[];
 const base=resolve(root);
 for(const m of manifest){
  const id=String(m.id);let status:HResult["status"]="valid";
  if(!valid(m.id)||!valid(m.parent_id))status="unsafe";
  else if(!Number.isSafeInteger(m.bytes)||Number(m.bytes)<1||typeof m.sha256!=="string"||!/^[a-f0-9]{64}$/.test(m.sha256))status="manifest_invalid";
  else {
   const owners=refsByMedia.get(id)??[];
   if(owners.length===0||owners.some(r=>r.parent_id!==m.parent_id||!parents.has(r.owner_kind+":"+r.parent_id)))status="parent_invalid";
   else {
    const file=resolve(base,id+".bin"),rel=relative(base,file);
    if(rel.startsWith("..")||rel.includes(sep)||resolve(file)===base)status="unsafe";
    else try{
     const bytes=await readFile(file);
     if(bytes.length!==m.bytes||createHash("sha256").update(bytes).digest("hex")!==m.sha256)status="corrupt";
    }catch(e){if((e as NodeJS.ErrnoException).code==="ENOENT")status="missing";else throw e}
   }
  }
  results.push({id,status,doNotDelete:true});
 }
 return results;
}
