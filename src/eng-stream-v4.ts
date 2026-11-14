import {assertStreamedBackupSize,reminderMetadataLimit} from "./backup-capacity.ts";
import {writeEngStream,openEngStream,type RandomReader,type SequentialWriter} from "./eng-stream.ts";
import {encodeReminderBackupSection,decodeReminderBackupSection,type ReminderBackupSection} from "./reminder-backup-v4.ts";
import type {EngSnapshot} from "./eng-types.ts";
import {allEngMedia,validateEngSnapshot} from "./eng-store.ts";
const magic=Uint8Array.from([67,68,88,69,52,0]);
const frame=(n:number)=>{const b=new Uint8Array(4);new DataView(b.buffer).setUint32(0,n);return b;};
export async function writeEngStreamV4(snapshot:EngSnapshot,reminders:ReminderBackupSection,read:(p:string)=>Promise<Uint8Array>,hash:(b:Uint8Array)=>Promise<string>,writer:SequentialWriter){
 const section=encodeReminderBackupSection(reminders);
 const checked=validateEngSnapshot(snapshot);
 const payloadSize=10+new TextEncoder().encode(JSON.stringify(checked)).length+allEngMedia(checked).reduce((sum,e)=>sum+4+e.bytes,0);
 const size=10+section.length+payloadSize;
 assertStreamedBackupSize(size);
 await writer.write(magic);await writer.write(frame(section.length));await writer.write(section);
 const result=await writeEngStream(checked,read,hash,writer);
 if(result.size!==payloadSize)throw Error("Full v4 size mismatch");
 return {size,reminders:decodeReminderBackupSection(section),snapshot:result.snapshot};
}
export async function openEngStreamV4(file:RandomReader,hash:(b:Uint8Array)=>Promise<string>){
 assertStreamedBackupSize(file.size);
 const prefix=await file.read(0,10);
 if(prefix.length!==10||!magic.every((v,i)=>prefix[i]===v))throw Error("Not a Full v4 backup");
 const n=new DataView(prefix.buffer,prefix.byteOffset+6,4).getUint32(0);
 if(n>reminderMetadataLimit||10+n>=file.size)throw Error("Invalid Full v4 reminder frame");
 const section=await file.read(10,n);if(section.length!==n)throw Error("Truncated reminders");
 const reminders=decodeReminderBackupSection(section),offset=10+n;
 const opened=await openEngStream({size:file.size-offset,read:(at,len)=>file.read(offset+at,len)},hash);
 if(opened.source!=="Full v3")throw Error("Invalid Full v4 collection payload");
 return {...opened,source:"Full v4",reminders,size:file.size};
}

/** Read-only archive dispatcher: legacy archives never imply reminder recovery. */
export async function openEngStreamCompatible(file:RandomReader,hash:(b:Uint8Array)=>Promise<string>){
 if(file.size<6)throw Error("Invalid backup size");
 const prefix=await file.read(0,6);
 if(prefix.length!==6)throw Error("Incomplete backup header");
 if(magic.every((v,i)=>prefix[i]===v))return openEngStreamV4(file,hash);
 const opened=await openEngStream(file,hash);
 return {...opened,reminders:null};
}
