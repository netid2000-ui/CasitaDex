import * as DocumentPicker from "expo-document-picker";
import { File, Directory, Paths } from "expo-file-system";
import { openDatabaseAsync } from "expo-sqlite";
import { sniffImageMime } from "./media-integrity";
import { sha256Media } from "./media-hash.native";
import { prepareMediaTable, listAttachedMedia } from "./media-sqlite";
import { prepareMediaJournal } from "./media-journal";
import { attachWithJournal } from "./media-journal-flow";
import { createNativeMediaStore } from "./media-store.native";
import type { Database, SQL } from "./sqlite-repository";
const root=new Directory(Paths.document,"casitadex-media-v2","media");
const safe=/^media\/[A-Za-z0-9_-]{1,100}\.(jpg|png|webp)$/;
const stores=new Map<string,Promise<Database>>();
function database(environment:string):Promise<Database>{
 if(!["development","staging"].includes(environment))throw Error("Invalid environment");
 if(!stores.has(environment))stores.set(environment,openDatabaseAsync(`casitadex-${environment}-v1.db`).then(async db=>{
  await db.execAsync("PRAGMA foreign_keys=ON; PRAGMA journal_mode=WAL; PRAGMA synchronous=FULL;");
  const adapter:Database={execAsync:db.execAsync.bind(db),runAsync:db.runAsync.bind(db),getAllAsync:db.getAllAsync.bind(db),getFirstAsync:db.getFirstAsync.bind(db),withExclusiveTransactionAsync:async(task:(tx:SQL)=>Promise<void>)=>{await db.withExclusiveTransactionAsync(task)}};
  return adapter;
 }).catch(error=>{stores.delete(environment);throw error}));
 return stores.get(environment)!;
}
function fileUri(path:string){if(!safe.test(path))throw Error("Unsafe image path");return new File(root,path.slice(6)).uri}
export async function listCardImages(environment:string,cardId:string){
 const db=await database(environment);await prepareMediaTable(db);
 const entries=await listAttachedMedia(db,cardId);
 for(const entry of entries){if(!mediaFileByPath(entry.path).exists)throw Error("An attached image file is missing. Keep your backup and retry recovery.");}
 return entries.map(entry=>({...entry,uri:fileUri(entry.path)}));
}
export async function pickAndAttachImage(environment:string,cardId:string){
 const picked=await DocumentPicker.getDocumentAsync({type:"image/*",copyToCacheDirectory:true,multiple:false});
 if(picked.canceled)return false;
 const asset=picked.assets[0];if(!asset)throw Error("No image was selected");
 if(asset.size&&asset.size>10_000_000)throw Error("Image exceeds 10 MB limit");
 const bytes=await new File(asset.uri).bytes();
 if(!bytes.length||bytes.length>10_000_000)throw Error("Invalid image size");
 const mime=sniffImageMime(bytes);if(!mime)throw Error("Unsupported image format (JPEG, PNG or WebP only)");
 const ext=mime==="image/jpeg"?"jpg":mime==="image/png"?"png":"webp";
 const id=`m_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,10)}`;
 const entry={id,cardId,path:`media/${id}.${ext}`,mime,bytes:bytes.length,sha256:await sha256Media(bytes)};
 const db=await database(environment);await prepareMediaTable(db);await prepareMediaJournal(db);
 await attachWithJournal(db,createNativeMediaStore(),entry,bytes,sha256Media);
 return true;
}
export async function removeCardImage(environment:string,cardId:string,imageId:string){
 const db=await database(environment);await prepareMediaTable(db);
 let path:string|undefined;
 await db.withExclusiveTransactionAsync(async tx=>{
  const row=await tx.getFirstAsync<{relative_path:string}>("SELECT relative_path FROM media_v2 WHERE id=? AND card_id=?",imageId,cardId);
  if(!row)throw Error("Image not found");path=row.relative_path;
  if(!safe.test(path))throw Error("Unsafe image path");
  await tx.runAsync("DELETE FROM media_v2 WHERE id=? AND card_id=?",imageId,cardId);
 });
 if(path) {
  const recovery=await db.getFirstAsync<{value:string}>("SELECT value FROM metadata WHERE key=?","recovery_media_v2");
  const protectedPaths=recovery ? (JSON.parse(recovery.value) as {media:{path:string}[]}).media.map(m=>m.path) : [];
  if(!protectedPaths.includes(path))await createNativeMediaStore().removeUnreferenced(path);
 }
}
export function mediaDatabase(environment:string){return database(environment)}
export function mediaFileByPath(path:string){if(!safe.test(path))throw Error("Unsafe image path");return new File(root,path.slice(6))}
