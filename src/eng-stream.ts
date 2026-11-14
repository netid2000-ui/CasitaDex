import {assertStreamedBackupSize,snapshotMetadataLimit} from "./backup-capacity.ts";
import { textBackupLimit } from "./eng-text-backup.ts";
import { allEngMedia, legacyEngSnapshot, validateEngSnapshot } from "./eng-store.ts";
import { decodeEngBackup } from "./eng-backup.ts";
import { verifyMediaBytes } from "./media-integrity.ts";
import type { EngSnapshot } from "./eng-types.ts";
export interface RandomReader {size:number;read(offset:number,length:number):Promise<Uint8Array>}
export interface SequentialWriter {write(bytes:Uint8Array):Promise<void>}
const fullMagic=[67,68,88,69,51,0],legacyMagic=[67,68,88,77,50,0];
const encode=new TextEncoder(),decode=new TextDecoder("utf-8",{fatal:true});
const headerLimit=snapshotMetadataLimit,chunkSize=65536;
function lengthFrame(length:number){const b=new Uint8Array(4);new DataView(b.buffer).setUint32(0,length);return b;}
/** Native-safe writer: no accumulated full archive or base64 string. */
export async function writeEngStream(input:EngSnapshot,read:(path:string)=>Promise<Uint8Array>,hash:(b:Uint8Array)=>Promise<string>,writer:SequentialWriter){
  const snapshot=validateEngSnapshot(input),header=encode.encode(JSON.stringify(snapshot)),entries=allEngMedia(snapshot);
  const size=10+header.length+entries.reduce((n,e)=>n+4+e.bytes,0);
  assertStreamedBackupSize(size);
  if(header.length>headerLimit)throw Error("Full backup exceeds the supported format limits");
  await writer.write(Uint8Array.from(fullMagic));await writer.write(lengthFrame(header.length));await writer.write(header);
  for(const entry of entries){
    const bytes=await read(entry.path);await verifyMediaBytes(entry,bytes,hash);await writer.write(lengthFrame(bytes.length));
    for(let at=0;at<bytes.length;at+=chunkSize){
      await writer.write(bytes.subarray(at,Math.min(bytes.length,at+chunkSize)));
      if(at%(chunkSize*16)===0)await new Promise<void>(resolve=>setTimeout(resolve,0));
    }
  }
  return {size,headerHash:await hash(header),snapshot};
}
/** Indexes immutable/cache-private bytes; preflights one <=10 MB image at a time. */
export async function openEngStream(file:RandomReader,hash:(b:Uint8Array)=>Promise<string>){
  if(!Number.isSafeInteger(file.size)||file.size<2)throw Error("Invalid or oversized full backup");
  async function exact(offset:number,length:number){
    if(offset<0||length<0||offset+length>file.size)throw Error("Truncated backup frame");
    const bytes=await file.read(offset,length);if(!(bytes instanceof Uint8Array)||bytes.length!==length)throw Error("Incomplete backup read");return bytes;
  }
  const prefix=await exact(0,Math.min(6,file.size));
  const full=fullMagic.every((x,i)=>prefix[i]===x),legacy=legacyMagic.every((x,i)=>prefix[i]===x);
  if(!full&&!legacy){
    if(file.size>textBackupLimit)throw Error("Text backup exceeds 6 MB or uses an unsupported format");
    const opened=await decodeEngBackup(await exact(0,file.size),hash);return {...opened,size:file.size,headerHash:null};
  }
  assertStreamedBackupSize(file.size);
  let at=6;
  async function frame(limit:number){const prefix=await exact(at,4);const n=new DataView(prefix.buffer,prefix.byteOffset,prefix.byteLength).getUint32(0);at+=4;if(n>limit||at+n>file.size)throw Error("Invalid backup frame size");const offset=at;at+=n;return {offset,length:n};}
  const first=await frame(full?headerLimit:2_000_000),header=await exact(first.offset,first.length);
  let snapshot:EngSnapshot;
  if(full)snapshot=validateEngSnapshot(JSON.parse(decode.decode(header)));
  else{const manifest=await frame(2_000_000);snapshot=validateEngSnapshot(legacyEngSnapshot(decode.decode(header),JSON.parse(decode.decode(await exact(manifest.offset,manifest.length)))));}
  const offsets=new Map<string,{offset:number;length:number}>();
  for(const entry of allEngMedia(snapshot)){
    const location=await frame(entry.bytes);if(location.length!==entry.bytes)throw Error("Photo frame size mismatch");
    await verifyMediaBytes(entry,await exact(location.offset,location.length),hash);offsets.set(entry.path,location);
  }
  if(at!==file.size)throw Error("Trailing backup bytes");
  return {snapshot,source:full?"Full v3":"Legacy CDXM2; no unfinished draft, categories or deleted states",size:file.size,headerHash:full?await hash(header):null,
    read:async(path:string)=>{const location=offsets.get(path);if(!location)throw Error("Missing backup photo");return exact(location.offset,location.length);}};
}
