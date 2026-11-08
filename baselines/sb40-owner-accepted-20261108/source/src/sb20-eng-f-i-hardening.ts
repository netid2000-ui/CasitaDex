/** Isolated synthetic media reconciliation. Read-only; never deletes files. */
import {realpath,readFile} from "node:fs/promises";
import {resolve,relative,isAbsolute,sep} from "node:path";
import {createHash} from "node:crypto";
export type SqlRead={all(query:string):Promise<Record<string,unknown>[]>};
export type Finding={photoId:string;status:"valid"|"dangling"|"orphan"|"conflict"|"unsafe"|"corrupt"|"missing"|"invalid_lifecycle";doNotDelete:true};
const kinds=["active","archived","deleted","draft","pending","rollback","legacy"] as const;
const safe=(x:unknown):x is string=>typeof x==="string"&&/^[A-Za-z0-9_-]{1,100}$/.test(x);
const within=(root:string,path:string)=>{const r=relative(root,path);return r!==""&&!r.startsWith(".."+sep)&&r!==".."&&!isAbsolute(r)};
export async function reconcileSynthetic(sql:SqlRead,root:string,now:number):Promise<Finding[]>{
 if(!Number.isSafeInteger(now))throw Error("Invalid clock");
 const parentKeys=new Set<string>();
 for(const k of kinds){
  let rows:Record<string,unknown>[];
  try{rows=await sql.all("SELECT id, deleted_at FROM i_"+k)}catch{throw Error("Incomplete parent source: "+k)}
  if(!Array.isArray(rows))throw Error("Invalid parent source");
  for(const r of rows){
   if(!safe(r.id))throw Error("Unsafe parent");
   const key=k+":"+r.id;if(parentKeys.has(key))throw Error("Duplicate parent");
   parentKeys.add(key);
   if(k==="deleted"&&(!Number.isSafeInteger(r.deleted_at)||Number(r.deleted_at)>now))throw Error("Invalid deleted lifecycle");
  }
 }
 let refs:Record<string,unknown>[],manifests:Record<string,unknown>[];
 try{refs=await sql.all("SELECT media_id,parent_id,owner_kind FROM i_refs");manifests=await sql.all("SELECT id,parent_id,bytes,sha256 FROM i_media")}
 catch{throw Error("Incomplete media source")}
 if(!Array.isArray(refs)||!Array.isArray(manifests))throw Error("Invalid source result");
 const manifestIds=new Set<string>(), byId=new Map<string,Record<string,unknown>>();
 for(const m of manifests){if(!safe(m.id)||manifestIds.has(m.id))throw Error("Invalid or duplicate manifest");manifestIds.add(m.id);byId.set(m.id,m)}
 const refsById=new Map<string,Record<string,unknown>[]>();
 for(const r of refs){
  if(!safe(r.media_id)||!safe(r.parent_id)||!kinds.includes(r.owner_kind as typeof kinds[number]))throw Error("Unsafe reference");
  const rows=refsById.get(r.media_id)??[];rows.push(r);refsById.set(r.media_id,rows);
 }
 const results:Finding[]=[];
 const base=await realpath(resolve(root));
 for(const r of refs){
  const id=r.media_id as string;if(byId.has(id))continue;
  results.push({photoId:id,status:"dangling",doNotDelete:true});
 }
 for(const m of manifests){
  const id=m.id as string,owners=refsById.get(id)??[];
  let status:Finding["status"]="valid";
  if(!owners.length)status="orphan";
  else if(owners.some(r=>r.parent_id!==m.parent_id||!parentKeys.has(r.owner_kind+":"+r.parent_id)))status="conflict";
  else if(new Set(owners.map(r=>r.owner_kind+":"+r.parent_id)).size!==owners.length)status="conflict";
  else if(!Number.isSafeInteger(m.bytes)||Number(m.bytes)<1||typeof m.sha256!=="string"||!/^[a-f0-9]{64}$/.test(m.sha256))status="corrupt";
  else{
   const f=resolve(base,id+".bin");
   if(!within(base,f))status="unsafe";
   else try{
    const actual=await realpath(f);
    if(!within(base,actual))status="unsafe";
    else {
     const b=await readFile(actual);
     if(b.length!==m.bytes||createHash("sha256").update(b).digest("hex")!==m.sha256)status="corrupt";
    }
   }catch(e){if((e as NodeJS.ErrnoException).code==="ENOENT")status="missing";else throw e}
  }
  results.push({photoId:id,status,doNotDelete:true});
 }
 return results;
}
