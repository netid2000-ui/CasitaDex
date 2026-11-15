import {Directory,File,Paths} from "expo-file-system";
import {Image} from "react-native";
import {manipulateAsync,SaveFormat} from "expo-image-manipulator";
import * as Crypto from "expo-crypto";
import {usableNativeSpace} from "./storage-space.native";
const cache=new Directory(Paths.cache,"casitadex-thumbnails-v1");
const pending=new Map<string,Promise<string>>();
let queue=Promise.resolve();
const budget=64*1024*1024;
function prune(needed:number){if(!cache.exists)return;const files=cache.list().filter((f):f is File=>f instanceof File);let total=files.reduce((n,f)=>n+f.size,0);for(const f of files.sort((a,b)=>(a.modificationTime??0)-(b.modificationTime??0))){if(total+needed<=budget)break;total-=f.size;f.delete();}}
/** Disposable derivatives only. Never writes, replaces or deletes an original. */
export function photoThumbnail(uri:string):Promise<string>{
 const existing=pending.get(uri);if(existing)return existing;
 const result=queue.then(async()=>{
  cache.create({idempotent:true,intermediates:true});
  const key=await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256,uri);
  const target=new File(cache,key+".jpg");
  if(target.exists&&target.size>0)return target.uri;
  // Do not consume the last few MB needed to save a draft.
  if(await usableNativeSpace()<8*1024*1024)throw Error("Preview storage unavailable");
  const size=await new Promise<{width:number;height:number}>((resolve,reject)=>Image.getSize(uri,(width,height)=>resolve({width,height}),reject));
  const dimension=size.width>=size.height?{width:Math.min(384,size.width)}:{height:Math.min(384,size.height)};
  const preview=await manipulateAsync(uri,[{resize:dimension}],{format:SaveFormat.JPEG,compress:0.8});
  const temporary=new File(preview.uri);
  try{prune(temporary.size);await temporary.copy(target);}finally{if(temporary.exists)temporary.delete();}
  return target.uri;
 });
 queue=result.then(()=>undefined,error=>{console.warn("CasitaDex thumbnail generation failed",error instanceof Error?error.message:String(error));});
 pending.set(uri,result);void result.finally(()=>pending.delete(uri)).catch(()=>{});
 return result;
}
export async function thumbnailStorageBytes(){return cache.exists?cache.list().filter((f):f is File=>f instanceof File).reduce((n,f)=>n+f.size,0):0;}
