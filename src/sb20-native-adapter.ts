/** ENG-D integration boundary. Not wired into Android runtime; synthetic ports only. */
export interface NativePhoto {
 id:string; draftId:string; mime:"image/jpeg"|"image/png"|"image/webp";
 sha256:string; bytes:number; path:string;
}
export interface NativeDraft {
 id:string; title:string; answer:string; checkpoint:number;
}
export interface NativeDraftPort {
 readDraft():Promise<NativeDraft|null>;
 writeCheckpoint(draft:NativeDraft):Promise<void>;
 readStaged(draftId:string):Promise<NativePhoto[]>;
 recordStaged(photo:NativePhoto):Promise<void>;
 findAttempt(token:string):Promise<string|null>;
 commitSave(input:{token:string;memoryId:string;draft:NativeDraft;photos:NativePhoto[]}):Promise<void>;
}
export interface NativeFilePort {
 copyPrivate(input:{id:string;bytes:Uint8Array;mime:string}):Promise<string>;
 readPrivate(path:string):Promise<Uint8Array>;
}
export interface NativeHash {sha256(bytes:Uint8Array):Promise<string>}
export type MediaVerdict="verified"|"missing"|"mismatch"|"invalid-path";
const idRe=/^[A-Za-z0-9_-]{1,100}$/;
export function safeId(id:string) {
 if(!idRe.test(id))throw Error("Unsafe record or media ID");
 return id;
}
export function photoPathValid(photo:NativePhoto){
 return new RegExp("^media/"+safeId(photo.id)+"\\.(jpg|png|webp)$").test(photo.path);
}
export async function verifyNativePhoto(photo:NativePhoto,files:NativeFilePort,hash:NativeHash):Promise<MediaVerdict>{
 if(!photoPathValid(photo))return "invalid-path";
 let bytes:Uint8Array;try{bytes=await files.readPrivate(photo.path)}catch{return "missing"}
 if(bytes.length!==photo.bytes||await hash.sha256(bytes)!==photo.sha256)return "mismatch";
 return "verified";
}
/** Interface-level Save. Port implementation MUST atomically commit metadata,
 * attempt token and draft consumption; filesystem remains a separate resource. */
export async function saveNativeDraft(db:NativeDraftPort,files:NativeFilePort,hash:NativeHash,
 token:string,memoryId:string):Promise<string>{
 safeId(token);safeId(memoryId);
 const existing=await db.findAttempt(token);
 if(existing)return existing;
 const draft=await db.readDraft();
 if(!draft||!draft.title.trim())throw Error("Meaningful title required");
 const photos=await db.readStaged(draft.id);
 if(!draft.answer.trim()&&photos.length===0)throw Error("Written answer or saved photo required");
 if(photos.length>5)throw Error("New-memory photo cap exceeded");
 for(const photo of photos){
  if(photo.draftId!==draft.id||await verifyNativePhoto(photo,files,hash)!=="verified")
   throw Error("Unsafe or corrupted staged media");
 }
 // No optimistic acknowledgement: commitSave is responsible for durable atomic metadata.
 await db.commitSave({token,memoryId,draft,photos});
 const committed=await db.findAttempt(token);
 if(committed!==memoryId)throw Error("Save outcome uncertain; preserve staged files");
 return committed;
}
/** No media removal: inspect and classify for explicit reconciliation. */
export async function inventoryNativeMedia(photos:NativePhoto[],files:NativeFilePort,hash:NativeHash){
 const results=[] as {id:string;verdict:MediaVerdict}[];
 for(const p of photos)results.push({id:p.id,verdict:await verifyNativePhoto(p,files,hash)});
 return results;
}
