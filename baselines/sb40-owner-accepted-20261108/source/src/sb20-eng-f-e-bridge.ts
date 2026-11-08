/** ENG-F-E isolated bridge; no application import and no real user database. */
import type {SqlitePort,PrivateExpoFilePort} from "./sb20-expo-ports.ts";
import {guardEngE} from "./sb20-expo-ports.ts";
import type {FdOp,FdPort,FdFiles} from "./sb20-eng-f-d-async.ts";
const safe=(v:string)=>{if(!/^[A-Za-z0-9_-]{1,100}$/.test(v))throw Error("Unsafe id");return v};
export async function createEngFEBridge(database:string,root:string,sql:SqlitePort,io:PrivateExpoFilePort):
 Promise<{journal:FdPort;files:FdFiles}> {
 guardEngE(database,root);
 await sql.execAsync("CREATE TABLE IF NOT EXISTS f_e_ops(token TEXT PRIMARY KEY,memoryId TEXT UNIQUE,draftId TEXT,phase TEXT,photoJson TEXT)");
 await sql.execAsync("CREATE TABLE IF NOT EXISTS f_e_saved(token TEXT PRIMARY KEY,memoryId TEXT UNIQUE,draftId TEXT)");
 const journal:FdPort={
  async get(token){
   const row=await sql.getFirstAsync<{token:string;memoryId:string;draftId:string;phase:FdOp["phase"];photoJson:string}>("SELECT * FROM f_e_ops WHERE token=?",safe(token));
   return row?{token:row.token,memoryId:row.memoryId,draftId:row.draftId,phase:row.phase,photos:JSON.parse(row.photoJson)}:null;
  },
  async put(op){await sql.runAsync("INSERT INTO f_e_ops VALUES(?,?,?,?,?)",safe(op.token),safe(op.memoryId),safe(op.draftId),op.phase,JSON.stringify(op.photos))},
  async transition(token,from,to){
   const result=await sql.runAsync("UPDATE f_e_ops SET phase=? WHERE token=? AND phase=?",to,safe(token),from) as {changes:number};
   return result.changes===1;
  },
  async committed(token){const row=await sql.getFirstAsync<{memoryId:string}>("SELECT memoryId FROM f_e_saved WHERE token=?",safe(token));return row?.memoryId??null},
  async atomicCommit(token,memoryId,draftId){
   await sql.withExclusiveTransactionAsync(async tx=>{
    await tx.runAsync("INSERT INTO f_e_saved VALUES(?,?,?)",safe(token),safe(memoryId),safe(draftId));
    const r=await tx.runAsync("UPDATE f_e_ops SET phase='committed' WHERE token=? AND phase='promoted'",token) as {changes:number};
    if(r.changes!==1)throw Error("Atomic journal conflict");
   });
  }
 };
 const file=(id:string,suffix:string)=>root+"/media/"+safe(id)+suffix;
 const files:FdFiles={
  async stage(id,bytes){
   const part=file(id,".part"),full=file(id,".bin");
   if(await io.exists(part)||await io.exists(full))throw Error("Media collision");
   await io.write(part,bytes);
  },
  async promote(id){
   const part=file(id,".part"),full=file(id,".bin");
   if(await io.exists(full))throw Error("Media collision");
   if(!await io.exists(part))throw Error("Missing staged file");
   const bytes=await io.read(part);
   // This adapter deliberately retains staging bytes. No destructive cleanup.
   await io.write(full,bytes);
  },
  async read(id){
   const full=file(id,".bin"),part=file(id,".part");
   if(await io.exists(full))return io.read(full);
   if(await io.exists(part))return io.read(part);
   return null;
  }
 };
 return {journal,files};
}

