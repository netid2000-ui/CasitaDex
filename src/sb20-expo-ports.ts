/** ENG-E Expo-facing adapters: injectable test ports, NOT wired into app. */
import type {NativeDraft,NativeDraftPort,NativeFilePort,NativePhoto} from "./sb20-native-adapter.ts";
export const ENG_E_DATABASE="casitadex-sb20-eng-e-synthetic-v1.db";
export const ENG_E_MEDIA_ROOT="casitadex-sb20-eng-e-synthetic-media";
const valid=/^[A-Za-z0-9_-]{1,100}$/;
function id(v:string){if(!valid.test(v))throw Error("Unsafe ID");return v}
export function guardEngE(database:string,root:string){
 if(database!==ENG_E_DATABASE||root!==ENG_E_MEDIA_ROOT)throw Error("ENG-E namespace guard denied");
 return {database,root};
}
export interface SqlitePort {
 execAsync(sql:string):Promise<void>;
 runAsync(sql:string,...params:unknown[]):Promise<unknown>;
 getFirstAsync<T>(sql:string,...params:unknown[]):Promise<T|null>;
 getAllAsync<T>(sql:string,...params:unknown[]):Promise<T[]>;
 withExclusiveTransactionAsync(fn:(tx:SqlitePort)=>Promise<void>):Promise<void>;
}
export interface PrivateExpoFilePort {
 write(path:string,bytes:Uint8Array):Promise<void>;
 read(path:string):Promise<Uint8Array>;
 exists(path:string):Promise<boolean>;
}
export function makeEngEFilePort(root:string,io:PrivateExpoFilePort):NativeFilePort{
 guardEngE(ENG_E_DATABASE,root);
 const name=(v:string)=>{const match=/^media\/([A-Za-z0-9_-]{1,100})\.(jpg|png|webp)$/.exec(v);if(!match)throw Error("Unsafe photo path");return root+"/"+v};
 return {
  async copyPrivate(input){
   const ext=input.mime==="image/jpeg"?"jpg":input.mime==="image/png"?"png":input.mime==="image/webp"?"webp":null;
   if(!ext||!(input.bytes instanceof Uint8Array)||input.bytes.length<1||input.bytes.length>10000000)throw Error("Invalid photo input");
   const relative="media/"+id(input.id)+"."+ext;
   if(await io.exists(name(relative)))throw Error("Media collision");
   await io.write(name(relative),input.bytes);
   return relative;
  },
  readPrivate:(p)=>io.read(name(p)),
 };
}
export function makeEngESqliteDraftPort(database:string,db:SqlitePort):NativeDraftPort{
 guardEngE(database,ENG_E_MEDIA_ROOT);
 return {
  readDraft:()=>db.getFirstAsync<NativeDraft>("SELECT id,title,answer,checkpoint FROM eng_e_draft LIMIT 1"),
  async writeCheckpoint(draft){
   id(draft.id);
   await db.withExclusiveTransactionAsync(async tx=>{
    const prior=await tx.getFirstAsync<{id:string}>("SELECT id FROM eng_e_draft LIMIT 1");
    if(prior&&prior.id!==draft.id)throw Error("Existing unfinished draft");
    await tx.runAsync("INSERT INTO eng_e_draft(id,title,answer,checkpoint) VALUES(?,?,?,?) ON CONFLICT(id) DO UPDATE SET title=excluded.title,answer=excluded.answer,checkpoint=excluded.checkpoint WHERE excluded.checkpoint>eng_e_draft.checkpoint",draft.id,draft.title,draft.answer,draft.checkpoint);
   });
  },
  readStaged:(draftId)=>db.getAllAsync<NativePhoto>("SELECT id,draftId,mime,sha256,bytes,path FROM eng_e_staged WHERE draftId=?",id(draftId)),
  async recordStaged(photo){
   id(photo.id);id(photo.draftId);
   if(!/^media\/[A-Za-z0-9_-]{1,100}\.(jpg|png|webp)$/.test(photo.path))throw Error("Unsafe photo path");
   await db.runAsync("INSERT INTO eng_e_staged(id,draftId,mime,sha256,bytes,path) VALUES(?,?,?,?,?,?)",photo.id,photo.draftId,photo.mime,photo.sha256,photo.bytes,photo.path);
  },
  async findAttempt(token){
   const row=await db.getFirstAsync<{id:string}>("SELECT id FROM eng_e_memories WHERE attempt=?",id(token));return row?.id??null;
  },
  async commitSave({token,memoryId,draft,photos}){
   id(token);id(memoryId);
   await db.withExclusiveTransactionAsync(async tx=>{
    const existing=await tx.getFirstAsync<{id:string}>("SELECT id FROM eng_e_memories WHERE attempt=?",token);
    if(existing){if(existing.id!==memoryId)throw Error("Attempt conflict");return}
    await tx.runAsync("INSERT INTO eng_e_memories(id,attempt,title,answer) VALUES(?,?,?,?)",memoryId,token,draft.title,draft.answer);
    for(const p of photos){
     await tx.runAsync("INSERT INTO eng_e_media(id,memoryId,sha256,bytes,path) VALUES(?,?,?,?,?)",p.id,memoryId,p.sha256,p.bytes,p.path);
    }
    await tx.runAsync("DELETE FROM eng_e_staged WHERE draftId=?",draft.id);
    await tx.runAsync("DELETE FROM eng_e_draft WHERE id=?",draft.id);
   });
  }
 };
}


