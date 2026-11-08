import type { EngSnapshot } from './eng-types.ts';
import { validateEngSnapshot } from './eng-store.ts';
export const textBackupLimit=6_000_000;
export function textBackupPreview(input:EngSnapshot){
 const snapshot=validateEngSnapshot(input),omitted=snapshot.data.memories.filter(m=>!m.answer.trim());
 return {included:snapshot.data.memories.length-omitted.length,omitted:omitted.map(m=>({id:m.id,title:m.title,lifecycle:m.lifecycle})),savedPhotos:snapshot.data.media.media.length,draftPhotos:snapshot.draft?.photos.length??0};
}
export function createTextBackup(input:EngSnapshot){
 const snapshot=validateEngSnapshot(input),preview=textBackupPreview(snapshot);
 snapshot.data.memories=snapshot.data.memories.filter(m=>m.answer.trim()).map(m=>({...m,mediaIds:[]}));snapshot.data.media.media=[];if(snapshot.draft)snapshot.draft.photos=[];
 const result={kind:'CasitaDex text backup',textVersion:1,omissions:preview,snapshot:validateEngSnapshot(snapshot)};
 const text=JSON.stringify(result,null,2);if(new TextEncoder().encode(text).length>textBackupLimit)throw Error('Text backup exceeds its supported size. Use a full backup.');return text;
}
export function readTextBackup(input:unknown){
 const x=input as any;if(!x||typeof x!=='object'||x.kind!=='CasitaDex text backup')return null;
 if(x.textVersion!==1||Object.keys(x).some(k=>!['kind','textVersion','omissions','snapshot'].includes(k)))throw Error('Unsupported text backup version or fields');
 const snapshot=validateEngSnapshot(x.snapshot),o=x.omissions;
 if(snapshot.data.media.media.length||snapshot.draft?.photos.length||snapshot.data.memories.some(m=>m.mediaIds.length))throw Error('Text backup cannot contain photo references');
 if(!o||typeof o!=='object'||Object.keys(o).some(k=>!['included','omitted','savedPhotos','draftPhotos'].includes(k))||o.included!==snapshot.data.memories.length||![o.savedPhotos,o.draftPhotos].every(n=>Number.isSafeInteger(n)&&n>=0)||!Array.isArray(o.omitted)||o.omitted.length>5000||o.omitted.some((m:any)=>!m||typeof m!=='object'||Object.keys(m).some(k=>!['id','title','lifecycle'].includes(k))||typeof m.id!=='string'||m.id.length>100||typeof m.title!=='string'||m.title.length>200||!['active','archived','recently_deleted'].includes(m.lifecycle)))throw Error('Invalid text-backup omissions');
 return {snapshot,source:`Text-only v1; ${o.savedPhotos} saved photos and ${o.draftPhotos} draft photos excluded; ${o.omitted.length} photo-only saved memories omitted. Full written metadata and lifecycle are retained.`,read:async(_path:string):Promise<Uint8Array>=>{throw Error('Text backup has no photos');}};
}
