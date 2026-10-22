import {usableNativeSpace,requireNativeCapacity} from "./storage-space.native";
import {protectedStorageReport} from "./storage-safety";
import {sqliteWriteTransaction} from "./sqlite-write-transaction";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { openDatabaseAsync } from "expo-sqlite";
import { File, FileMode, Paths } from "expo-file-system";
import * as FileSystem from "expo-file-system/legacy";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { createEngStore, legacyEngSnapshot, validateEngSnapshot } from "./eng-store";
import { sqliteRepository, type Database } from "./sqlite-repository";
import { createNativeMediaStore } from "./media-store.native";
import { mediaFileByPath } from "./media-attachment.native";
import { sha256Media } from "./media-hash.native";
import { stageMedia } from "./media-staging";
import { validateAddDraft } from "./draft-sqlite";
import { fullBackupLimit } from "./eng-backup";
import { writeEngStreamV4, openEngStreamCompatible } from "./eng-stream-v4";
import { snapshotStandaloneRemindersForBackup } from "./standalone-reminders.native";
import type { EngSnapshot } from "./eng-types";
const environment=Constants.expoConfig?.extra?.appEnvironment||"development";
export const engEnabled=environment==="development";
let pending:Promise<ReturnType<typeof createEngStore>>|undefined;
export function getEngStore(){
  if(!engEnabled)return Promise.reject(Error("Full ENG is enabled only in Development"));
  pending??=(async()=>{
    const raw=await openDatabaseAsync("casitadex-development-v1.db");
    const db:Database={execAsync:raw.execAsync.bind(raw),runAsync:raw.runAsync.bind(raw),getFirstAsync:raw.getFirstAsync.bind(raw),getAllAsync:raw.getAllAsync.bind(raw),
      async withExclusiveTransactionAsync(fn){await sqliteWriteTransaction(raw,fn);}};
    const legacy=sqliteRepository(db,AsyncStorage,"development");
    await db.execAsync("PRAGMA foreign_keys=ON; PRAGMA journal_mode=WAL; PRAGMA synchronous=FULL;");
    const files={read:async(path:string)=>mediaFileByPath(path).bytes(),hash:sha256Media,
      put:async(entry:import("./media-manifest").MediaEntry,bytes:Uint8Array)=>{
        await requireNativeCapacity(entry.bytes+4_000_000);
        await stageMedia(createNativeMediaStore(),entry,bytes,sha256Media);
      },
      capacity:async(required:number)=>{
        await requireNativeCapacity(required);
      }};
    return createEngStore(db,files,async()=>{
      const data=await legacy.load();
      const mediaTable=await db.getFirstAsync("SELECT name FROM sqlite_master WHERE type='table' AND name='media_v2'");
      const rows=mediaTable?await db.getAllAsync<{id:string;card_id:string;relative_path:string;mime:string;byte_count:number;sha256:string}>("SELECT id,card_id,relative_path,mime,byte_count,sha256 FROM media_v2 ORDER BY id"):[];
      const snapshot=legacyEngSnapshot(JSON.stringify(data),{version:2,media:rows.map(r=>({id:r.id,cardId:r.card_id,path:r.relative_path,mime:r.mime,bytes:r.byte_count,sha256:r.sha256}))});
      const draftTable=await db.getFirstAsync("SELECT name FROM sqlite_master WHERE type='table' AND name='add_draft_v1'");
      if(draftTable){
        const row=await db.getFirstAsync<{payload:string}>("SELECT payload FROM add_draft_v1 WHERE slot=1");
        if(row){const d=validateAddDraft(JSON.parse(row.payload));snapshot.draft={id:d.id,attempt:d.attempt,memoryId:d.memoryId,checkpoint:d.checkpoint,title:d.title,answer:d.answer,location:d.location,spaceId:d.spaceId,legacyContext:d.context,categoryIds:[],photos:[]};}
      }
      const attemptTable=await db.getFirstAsync("SELECT name FROM sqlite_master WHERE type='table' AND name='add_attempt_v1'");
      if(attemptTable){const attempts=await db.getAllAsync<{token:string;memory_id:string}>("SELECT token,memory_id FROM add_attempt_v1");snapshot.attempts=Object.fromEntries(attempts.map(a=>[a.token,a.memory_id]));}
      return validateEngSnapshot(snapshot);
    });
  })().catch(e=>{pending=undefined;throw e;});
  return pending;
}
export function engPhotoUri(path:string){return mediaFileByPath(path).uri;}
export async function chooseEngPhoto(camera:boolean|"files"){
  if(camera==="files"){
    const result=await DocumentPicker.getDocumentAsync({type:"image/*",copyToCacheDirectory:true,multiple:false});
    if(result.canceled)return null;const asset=result.assets[0];if(!asset)throw Error("No image selected");
    const file=new File(asset.uri);if(file.size>10_000_000)throw Error("Choose a photo up to 10 MB");return file.bytes();
  }
  if(camera){const permission=await ImagePicker.requestCameraPermissionsAsync();if(!permission.granted)throw Error("Camera permission was not granted. Your draft is kept. You can choose a photo instead.");}
  const options:ImagePicker.ImagePickerOptions={mediaTypes:["images"],allowsEditing:false,quality:1,exif:false};
  const result=camera?await ImagePicker.launchCameraAsync(options):await ImagePicker.launchImageLibraryAsync(options);
  if(result.canceled)return null;
  const asset=result.assets[0];if(!asset)throw Error("No photo selected");
  if(asset.fileSize&&asset.fileSize>10_000_000)throw Error("Choose a photo up to 10 MB");
  const file=new File(asset.uri);
  if(file.size>10_000_000)throw Error("Choose a photo up to 10 MB");
  return file.bytes();
}
export type EngBackupSource={snapshot:EngSnapshot;read:(path:string)=>Promise<Uint8Array>;hash:(bytes:Uint8Array)=>Promise<string>};
function reader(file:File){return {size:file.size,read:async(offset:number,length:number)=>{
  const handle=file.open(FileMode.ReadOnly);
  try{handle.offset=offset;return handle.readBytes(length);}finally{handle.close();}
}};}
export async function writeEngBackup(source:EngBackupSource){
  const reminders=await snapshotStandaloneRemindersForBackup();
  const reminderBytes=new TextEncoder().encode(JSON.stringify(reminders)).length;
  const size=10+reminderBytes+10+new TextEncoder().encode(JSON.stringify(source.snapshot)).length+
    [...source.snapshot.data.media.media,...(source.snapshot.draft?.photos??[])].reduce((n,e)=>n+4+e.bytes,0);
  if(size>fullBackupLimit)throw Error("Full backup exceeds the supported format limit");
  await requireNativeCapacity(size*2+4_000_000);
  const permission=await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
  if(!permission.granted)return "Backup canceled. Your memories and draft are kept.";
  const name="CasitaDex-full-"+new Date().toISOString().replace(/[:.]/g,"-")+".cdxe";
  let uri:string|undefined;
  const readback=new File(Paths.cache,"eng-backup-check-"+Date.now()+"-"+Math.random().toString(36).slice(2)+".cdxe");
  try{
    uri=await FileSystem.StorageAccessFramework.createFileAsync(permission.directoryUri,name,"application/octet-stream");
    const file=new File(uri);
    // SAF FileHandle drops its ParcelFileDescriptor owner in this SDK. Each
    // append uses a scoped native stream so GC cannot close a live descriptor.
    const expected=await writeEngStreamV4(source.snapshot,reminders,source.read,source.hash,{write:async bytes=>{file.write(bytes,{append:true});}});
    await requireNativeCapacity(size+4_000_000);
    // Copy through native scoped streams, then index a private local file.
    await file.copy(readback);
    const checked=await openEngStreamCompatible(reader(readback),source.hash);
    if(checked.size!==expected.size||checked.headerHash!==await source.hash(new TextEncoder().encode(JSON.stringify(expected.snapshot)))||checked.source!=="Full v4"||JSON.stringify(checked.reminders)!==JSON.stringify(reminders))throw Error("Backup read-back verification failed");
    return "Full v4 backup saved and verified, including standalone reminders, unfinished draft and photos. Keep a second copy.";
  }catch(e){
    if(uri){try{await FileSystem.deleteAsync(uri,{idempotent:true});}catch{throw Error("Backup failed. An incomplete file may remain in the selected folder.");}}
    throw e;
  }finally{if(readback.exists)readback.delete();}
}
export async function pickEngBackup(){
  const result=await DocumentPicker.getDocumentAsync({type:"*/*",copyToCacheDirectory:true,multiple:false});
  if(result.canceled)return null;
  const asset=result.assets[0];if(!asset)throw Error("No backup selected");
  const file=new File(asset.uri);if(file.size>fullBackupLimit)throw Error("Full backup exceeds 154 MB");
  const opened=await openEngStreamCompatible(reader(file),sha256Media);
  // Archive validation always completes before any consumer restore preview.
  // SB24 production-path interruption and genuine Android ENOSPC acceptance passed.
  return opened;
}
export type EngStore=Awaited<ReturnType<typeof getEngStore>>;
export type EngBackup={snapshot:EngSnapshot;source:string;read:(path:string)=>Promise<Uint8Array>;reminders:import("./reminder-backup-v4").ReminderBackupSection|null};

export async function getEngStorage(){
  const references=await(await getEngStore()).audit();
  const report=protectedStorageReport(references);
  return {free:await usableNativeSpace(),total:Paths.totalDiskSpace,...report};
}

export async function shareEngPhotos(preview:{text:string;photos:import('./media-manifest').MediaEntry[]}){
  const Sharing=await import('expo-sharing');
  if(!await Sharing.isAvailableAsync())throw Error('No sharing app is available. Your memory is kept.');
  const bytes=preview.photos.reduce((n,p)=>n+p.bytes,0)+new TextEncoder().encode(preview.text).length+4096;
  await requireNativeCapacity(bytes+4_000_000);
  const file=new File(Paths.cache,'CasitaDex-share-'+Date.now()+'.zip');file.create();
  try{const {writeShareZip}=await import('./eng-share');await writeShareZip(preview.text,preview.photos,async path=>mediaFileByPath(path).bytes(),sha256Media,async chunk=>file.write(chunk,{append:true}));await Sharing.shareAsync(file.uri,{mimeType:'application/zip',dialogTitle:'Share reviewed memory'});return 'Share sheet opened. Delivery is handled by the selected app.';}
  catch(e){if(file.exists)file.delete();throw e;}
  // Keep successful cache file available to the selected receiving app; Android may reclaim cache later.
}
export async function writeEngText(text:string,backup=false){
  const size=new TextEncoder().encode(text).length;await requireNativeCapacity(size*2+4_000_000);
  const permission=await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();if(!permission.granted)return 'Text export canceled.';
  const uri=await FileSystem.StorageAccessFramework.createFileAsync(permission.directoryUri,'CasitaDex-text-'+(backup?'backup-':'report-')+Date.now()+(backup?'.json':'.txt'),backup?'application/json':'text/plain');
  try{await FileSystem.writeAsStringAsync(uri,text);if(await FileSystem.readAsStringAsync(uri)!==text)throw Error('Text export read-back failed');return backup?'Limited text backup saved and verified. Photos and the reviewed photo-only memories are excluded.':'Text report saved and verified. It contains no photos and cannot restore your collection.';}
  catch(e){await FileSystem.deleteAsync(uri,{idempotent:true});throw e;}
}
