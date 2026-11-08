import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system/legacy";
import { File } from "expo-file-system";
import { exportData, parseData, type Data } from "./model";
import { validateMediaManifest, type MediaEntry } from "./media-manifest";
import { createPortableMediaContainer, preflightPortableMediaContainer } from "./media-portable-container";
import { sha256Media } from "./media-hash.native";
import { mediaDatabase, mediaFileByPath } from "./media-attachment.native";
import { prepareMediaTable } from "./media-sqlite";
import { prepareMediaJournal, recordMediaOperation, advanceMediaOperation } from "./media-journal";
import { stageMedia } from "./media-staging";
import { createNativeMediaStore } from "./media-store.native";
import type { Database, SQL } from "./sqlite-repository";
const nativeCap=20_000_000;
function base64(bytes:Uint8Array):string {
 const abc="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
 let output="";const chunk=3*4096;
 for(let begin=0;begin<bytes.length;begin+=chunk){
  let piece="";
  for(let i=begin;i<Math.min(begin+chunk,bytes.length);i+=3){
   const a=bytes[i],hasB=i+1<bytes.length,hasC=i+2<bytes.length;
   const b=hasB?bytes[i+1]:0,c=hasC?bytes[i+2]:0;
   piece+=abc[a>>2]+abc[((a&3)<<4)|(b>>4)]+(hasB?abc[((b&15)<<2)|(c>>6)]:"=")+(hasC?abc[c&63]:"=");
  }
  output+=piece;
 }
 return output;
}
async function listManifest(db:Database,cardIds:string[]){
 await prepareMediaTable(db);
 const rows=await db.getAllAsync<{id:string;card_id:string;relative_path:string;mime:string;byte_count:number;sha256:string}>(
 "SELECT id,card_id,relative_path,mime,byte_count,sha256 FROM media_v2 ORDER BY id");
 return validateMediaManifest({version:2,media:rows.map(r=>({id:r.id,cardId:r.card_id,path:r.relative_path,mime:r.mime,bytes:r.byte_count,sha256:r.sha256}))},cardIds);
}
export async function saveMediaBackup(environment:string,data:Data){
 const db=await mediaDatabase(environment);
 const manifest=await listManifest(db,data.cards.map(c=>c.id));
 const raw=await createPortableMediaContainer(exportData(data),manifest,async path=>mediaFileByPath(path).bytes(),sha256Media);
 if(raw.length>nativeCap)throw Error("This version supports media backups up to 20 MB. No file was written.");
 const p=await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
 if(!p.granted)return "Export canceled; your answers were not changed.";
 const stamp=new Date().toISOString().replace(/[:.]/g,"-");
 let uri:string|undefined;
 try{
  uri=await FileSystem.StorageAccessFramework.createFileAsync(p.directoryUri,`CasitaDex-media-${stamp}.cdxm`,"application/octet-stream");
  const encoded=base64(raw);
  await FileSystem.writeAsStringAsync(uri,encoded,{encoding:FileSystem.EncodingType.Base64});
  const check=await FileSystem.readAsStringAsync(uri,{encoding:FileSystem.EncodingType.Base64});
  if(check!==encoded)throw Error("Media backup provider read-back failed");
  return `Media backup saved and read back (${manifest.media.length} images). Keep a second copy.`;
 }catch(error){
  if(uri){try{await FileSystem.deleteAsync(uri,{idempotent:true})}catch{throw Error("Backup failed; incomplete file may remain in selected folder")}}
  throw error;
 }
}
export async function pickMediaBackup(){
 const choice=await DocumentPicker.getDocumentAsync({type:"*/*",copyToCacheDirectory:true,multiple:false});
 if(choice.canceled)return null;
 const file=choice.assets[0];if(!file)throw Error("No media backup selected");
 if(file.size&&file.size>nativeCap)throw Error("Media backup exceeds 20 MB limit");
 const raw=await new File(file.uri).bytes();
 if(raw.length>nativeCap)throw Error("Media backup exceeds 20 MB limit");
 const opened=await preflightPortableMediaContainer(raw,sha256Media);
 return {raw,cardCount:opened.preview.text.cards.length,imageCount:opened.preview.manifest.media.length};
}
async function readCollection(sql:SQL):Promise<Data>{
 const spaces=await sql.getAllAsync<{id:string;name:string}>("SELECT id,name FROM spaces ORDER BY position");
 const cards=await sql.getAllAsync<{payload:string}>("SELECT payload FROM cards ORDER BY position");
 return parseData(JSON.stringify({version:1,spaces,cards:cards.map(c=>JSON.parse(c.payload)),media:[]}));
}
async function replaceCollection(tx:SQL,next:Data,media:MediaEntry[]){
 await tx.runAsync("DELETE FROM media_v2");
 await tx.runAsync("DELETE FROM cards");await tx.runAsync("DELETE FROM spaces");
 for(const [i,s] of next.spaces.entries())await tx.runAsync("INSERT INTO spaces(id,name,position) VALUES(?,?,?)",s.id,s.name,i);
 for(const [i,c] of next.cards.entries())await tx.runAsync("INSERT INTO cards(id,space_id,position,payload) VALUES(?,?,?,?)",c.id,c.spaceId,i,JSON.stringify(c));
 for(const m of media)await tx.runAsync("INSERT INTO media_v2(id,card_id,relative_path,mime,byte_count,sha256) VALUES(?,?,?,?,?,?)",m.id,m.cardId,m.path,m.mime,m.bytes,m.sha256);
}
async function verifyExisting(entries:MediaEntry[]){
 const {verifyMediaBytes}=await import("./media-integrity");
 for(const entry of entries)await verifyMediaBytes(entry,await mediaFileByPath(entry.path).bytes(),sha256Media);
}
export async function restoreMediaBackup(environment:string,raw:Uint8Array){
 const opened=await preflightPortableMediaContainer(raw,sha256Media);
 const db=await mediaDatabase(environment);await prepareMediaTable(db);await prepareMediaJournal(db);
 const previous=await readCollection(db);
 const priorImages=await listManifest(db,previous.cards.map(c=>c.id));
 await verifyExisting(priorImages.media);
 const staged:MediaEntry[]=[];
 const store=createNativeMediaStore();
 for(const original of opened.preview.manifest.media){
  const id=`r_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,10)}`;
  const suffix=original.mime==="image/jpeg"?"jpg":original.mime==="image/png"?"png":"webp";
  const entry={...original,id,path:`media/${id}.${suffix}`};
  await recordMediaOperation(db,entry);
  await stageMedia(store,entry,await opened.readEntry(original.path),sha256Media);
  await advanceMediaOperation(db,id,"pending","promoted");
  staged.push(entry);
 }
 await db.withExclusiveTransactionAsync(async tx=>{
  const current=await readCollection(tx);
  if(exportData(current)!==exportData(previous))throw Error("Current answers changed during media restore; recheck backup");
  const oldRows=await tx.getAllAsync<{id:string;sha256:string}>("SELECT id,sha256 FROM media_v2 ORDER BY id");
  if(JSON.stringify(oldRows.map(x=>[x.id,x.sha256]))!==JSON.stringify(priorImages.media.map(x=>[x.id,x.sha256])))throw Error("Attached images changed during restore");
  for(const entry of staged){
   const journal=await tx.getFirstAsync<{phase:string;relative_path:string;sha256:string}>("SELECT phase,relative_path,sha256 FROM media_ops_v2 WHERE id=?",entry.id);
   if(!journal||journal.phase!=="promoted"||journal.relative_path!==entry.path||journal.sha256!==entry.sha256)throw Error("Incomplete media staging journal");
  }
  await replaceCollection(tx,opened.preview.text,staged);
  await tx.runAsync("INSERT OR REPLACE INTO metadata(key,value) VALUES('recovery',?)",JSON.stringify(previous));
  await tx.runAsync("INSERT OR REPLACE INTO metadata(key,value) VALUES('recovery_media_v2',?)",JSON.stringify(priorImages));
  for(const entry of staged)await tx.runAsync("UPDATE media_ops_v2 SET phase='committed' WHERE id=? AND phase='promoted'",entry.id);
 });
}
export async function recoverMediaPrevious(environment:string){
 const db=await mediaDatabase(environment);await prepareMediaTable(db);
 const row=await db.getFirstAsync<{value:string}>("SELECT value FROM metadata WHERE key='recovery'");
 if(!row)throw Error("No previous save available");
 const text=parseData(row.value);
 const mediaRow=await db.getFirstAsync<{value:string}>("SELECT value FROM metadata WHERE key='recovery_media_v2'");
 const prior=validateMediaManifest(mediaRow?JSON.parse(mediaRow.value):{version:2,media:[]},text.cards.map(c=>c.id));
 await verifyExisting(prior.media);
 await db.withExclusiveTransactionAsync(async tx=>{
  const latest=await tx.getFirstAsync<{value:string}>("SELECT value FROM metadata WHERE key='recovery'");
  const latestMedia=await tx.getFirstAsync<{value:string}>("SELECT value FROM metadata WHERE key='recovery_media_v2'");
  if(latest?.value!==row.value||latestMedia?.value!==mediaRow?.value)throw Error("Recovery snapshot changed; recheck before recovering");
  await replaceCollection(tx,text,prior.media);
 });
}
