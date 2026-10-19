import { allEngMedia, legacyEngSnapshot, validateEngSnapshot } from "./eng-store.ts";
import { verifyMediaBytes } from "./media-integrity.ts";
import type { EngSnapshot } from "./eng-types.ts";
import { readTextBackup, textBackupLimit } from "./eng-text-backup.ts";
const magic=[67,68,88,69,51,0];
export const fullBackupLimit=154_010_000;
const encoder=new TextEncoder(),decoder=new TextDecoder("utf-8",{fatal:true});
export async function encodeEngBackup(input:EngSnapshot,read:(path:string)=>Promise<Uint8Array>,hash:(bytes:Uint8Array)=>Promise<string>){
  const snapshot=validateEngSnapshot(input),header=encoder.encode(JSON.stringify(snapshot));
  const entries=allEngMedia(snapshot);
  const size=10+header.length+entries.reduce((n,e)=>n+4+e.bytes,0);
  if(size>fullBackupLimit)throw Error("Full backup exceeds the current 154 MB limit. Nothing was exported.");
  const raw=new Uint8Array(size),view=new DataView(raw.buffer);raw.set(magic);view.setUint32(6,header.length);raw.set(header,10);
  let at=10+header.length;
  for(const entry of entries){
    const bytes=await read(entry.path);await verifyMediaBytes(entry,bytes,hash);
    view.setUint32(at,bytes.length);at+=4;raw.set(bytes,at);at+=bytes.length;
  }
  return raw;
}
export async function decodeEngBackup(raw:Uint8Array,hash:(bytes:Uint8Array)=>Promise<string>){
  if(!(raw instanceof Uint8Array)||raw.length>fullBackupLimit)throw Error("Full backup exceeds 154 MB");
  if(magic.every((x,i)=>raw[i]===x)){
    const view=new DataView(raw.buffer,raw.byteOffset,raw.byteLength);let at=6;
    function next(limit:number){
      if(at+4>raw.length)throw Error("Truncated full backup");
      const length=view.getUint32(at);at+=4;
      if(length>limit||at+length>raw.length)throw Error("Invalid full backup frame");
      const value=raw.slice(at,at+length);at+=length;return value;
    }
    const snapshot=validateEngSnapshot(JSON.parse(decoder.decode(next(4_000_000))));
    const files=new Map<string,Uint8Array>();
    for(const entry of allEngMedia(snapshot)){
      const bytes=next(entry.bytes);await verifyMediaBytes(entry,bytes,hash);files.set(entry.path,bytes);
    }
    if(at!==raw.length)throw Error("Trailing full backup bytes");
    return {snapshot,source:"Full v3" as string,read:async(path:string)=>{const bytes=files.get(path);if(!bytes)throw Error("Missing backup image");return bytes;}};
  }
  if([67,68,88,77,50,0].every((x,i)=>raw[i]===x)){
    const view=new DataView(raw.buffer,raw.byteOffset,raw.byteLength);let at=6;
    function next(limit:number){
      if(at+4>raw.length)throw Error("Truncated legacy backup");
      const length=view.getUint32(at);at+=4;
      if(length>limit||at+length>raw.length)throw Error("Invalid legacy backup frame");
      const value=raw.slice(at,at+length);at+=length;return value;
    }
    const text=decoder.decode(next(2_000_000)),manifest=JSON.parse(decoder.decode(next(2_000_000)));
    const snapshot=legacyEngSnapshot(text,manifest),files=new Map<string,Uint8Array>();
    for(const entry of allEngMedia(snapshot)){
      const bytes=next(entry.bytes);await verifyMediaBytes(entry,bytes,hash);files.set(entry.path,bytes);
    }
    if(at!==raw.length)throw Error("Trailing legacy backup bytes");
    return {snapshot,source:"Legacy CDXM2; no unfinished draft, categories or deleted states",read:async(path:string)=>{const bytes=files.get(path);if(!bytes)throw Error("Missing legacy photo");return bytes;}};
  }
  // A future binary version must never fall through to legacy import.
  if(raw[0]!==123&&raw[0]!==32&&raw[0]!==10&&raw[0]!==13)throw Error("Unsupported full backup format");
  if(raw.length<=textBackupLimit){const text=readTextBackup(JSON.parse(decoder.decode(raw)));if(text)return text;}
  return {snapshot:legacyEngSnapshot(decoder.decode(raw)),source:"Legacy v1 text; no photos, unfinished draft, categories or deleted states",read:async(_path:string):Promise<Uint8Array>=>{throw Error("Text backup has no photos");}};
}
