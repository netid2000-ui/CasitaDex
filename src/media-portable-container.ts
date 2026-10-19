import { previewMediaBackup, verifyPortableMediaPayload } from "./media-backup-v2";
import type { MediaManifest } from "./media-manifest";
import { verifyMediaBytes } from "./media-integrity";
const magic = [67,68,88,77,50,0];
const maximum = 110_000_000;
const headerMax = 2_000_000;
const enc = new TextEncoder();
const dec = new TextDecoder("utf-8", { fatal: true });
function frame(parts: Uint8Array[]): Uint8Array {
 const n=6+parts.reduce((s,p)=>s+4+p.length,0);
 if(n>maximum)throw Error("Oversized media backup");
 const out=new Uint8Array(n),view=new DataView(out.buffer);out.set(magic);let at=6;
 for(const p of parts){view.setUint32(at,p.length);at+=4;out.set(p,at);at+=p.length;}
 return out;
}
export async function createPortableMediaContainer(text:string, manifest:MediaManifest,
 read:(path:string)=>Promise<Uint8Array>,hash:(b:Uint8Array)=>Promise<string>){
 const preview=previewMediaBackup(text,manifest);
 const parts:Uint8Array[]=[enc.encode(text),enc.encode(JSON.stringify(preview.manifest))];
 if(parts.some(p=>p.length>headerMax))throw Error("Oversized backup header");
 for(const item of preview.manifest.media){const b=await read(item.path);await verifyMediaBytes(item,b,hash);parts.push(b);}
 return frame(parts);
}
export function openPortableMediaContainer(raw:Uint8Array){
 if(!(raw instanceof Uint8Array)||raw.length<14||raw.length>maximum||!magic.every((n,i)=>raw[i]===n))throw Error("Invalid media backup container");
 const view=new DataView(raw.buffer,raw.byteOffset,raw.byteLength);let at=6;
 function next(limit:number){
  if(at+4>raw.length)throw Error("Truncated backup frame");
  const n=view.getUint32(at);at+=4;
  if(n>limit||at+n>raw.length)throw Error("Truncated or oversized backup frame");
  const b=raw.slice(at,at+n);at+=n;return b;
 }
 const text=dec.decode(next(headerMax));
 const manifest=JSON.parse(dec.decode(next(headerMax))) as unknown;
 const preview=previewMediaBackup(text,manifest);
 const files=new Map<string,Uint8Array>();
 for(const item of preview.manifest.media)files.set(item.path,next(item.bytes));
 if(at!==raw.length)throw Error("Trailing backup bytes");
 return {preview,readEntry:async(path:string)=>{
  const value=files.get(path);if(!value)throw Error("Missing media entry");return value;
 }};
}
export async function preflightPortableMediaContainer(raw:Uint8Array,hash:(b:Uint8Array)=>Promise<string>){
 const opened=openPortableMediaContainer(raw);
 await verifyPortableMediaPayload(opened.preview,opened.readEntry,hash);
 return opened;
}

