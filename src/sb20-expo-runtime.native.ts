/** ENG-E ONLY: explicit opt-in factory. Not imported into app or executed during tests. */
import {openDatabaseAsync} from "expo-sqlite";
import {Directory,File,Paths} from "expo-file-system";
import {ENG_E_DATABASE,ENG_E_MEDIA_ROOT,guardEngE,makeEngESqliteDraftPort,makeEngEFilePort,type SqlitePort} from "./sb20-expo-ports";
const allowed=/^casitadex-sb20-eng-e-synthetic-media\/media\/([A-Za-z0-9_-]{1,100})\.(jpg|png|webp)$/;
export async function createIsolatedEngEExpoPorts() {
 guardEngE(ENG_E_DATABASE,ENG_E_MEDIA_ROOT);
 const db=await openDatabaseAsync(ENG_E_DATABASE);
 const wrap=(q:any):SqlitePort=>({
  execAsync:sql=>q.execAsync(sql),
  runAsync:(sql,...params)=>q.runAsync(sql,...params),
  getFirstAsync:(sql,...params)=>q.getFirstAsync(sql,...params),
  getAllAsync:(sql,...params)=>q.getAllAsync(sql,...params),
  withExclusiveTransactionAsync:async fn=>q.withExclusiveTransactionAsync(async (tx:any)=>fn(wrap(tx))),
 });
 const query=wrap(db);
 // Only new ENG-E tables in a uniquely named, disposable database.
 await query.execAsync("CREATE TABLE IF NOT EXISTS eng_e_draft(id TEXT PRIMARY KEY,title TEXT NOT NULL,answer TEXT NOT NULL,checkpoint INTEGER NOT NULL);");
 await query.execAsync("CREATE TABLE IF NOT EXISTS eng_e_staged(id TEXT PRIMARY KEY,draftId TEXT NOT NULL,mime TEXT NOT NULL,sha256 TEXT NOT NULL,bytes INTEGER NOT NULL,path TEXT NOT NULL);");
 await query.execAsync("CREATE TABLE IF NOT EXISTS eng_e_memories(id TEXT PRIMARY KEY,attempt TEXT UNIQUE NOT NULL,title TEXT NOT NULL,answer TEXT NOT NULL);");
 await query.execAsync("CREATE TABLE IF NOT EXISTS eng_e_media(id TEXT PRIMARY KEY,memoryId TEXT NOT NULL,sha256 TEXT NOT NULL,bytes INTEGER NOT NULL,path TEXT NOT NULL);");
 const root=new Directory(Paths.document,ENG_E_MEDIA_ROOT);
 const media=new Directory(root,"media");
 function file(p:string){
  const m=allowed.exec(p);if(!m)throw Error("ENG-E unsafe native media path");
  return new File(media,m[1]+"."+m[2]);
 }
 const io={
  async exists(p:string){return file(p).exists},
  async write(p:string,bytes:Uint8Array){
   root.create({idempotent:true});media.create({idempotent:true});
   const f=file(p);if(f.exists)throw Error("ENG-E media collision");
   f.create({overwrite:false});f.write(bytes);
  },
  async read(p:string){const f=file(p);if(!f.exists)throw Error("Missing ENG-E media");return f.bytes()},
 };
 return {drafts:makeEngESqliteDraftPort(ENG_E_DATABASE,query),files:makeEngEFilePort(ENG_E_MEDIA_ROOT,io)};
}
