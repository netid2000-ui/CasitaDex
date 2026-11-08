/** Saved active photo memories only; presentation sorting never mutates the collection. */
import type {DataV2} from '../sb20-contract';
import type {PhotoSummary} from './FigmaPhotos';
export type PhotoSort='updated'|'added';
export function photoSummaries(data:DataV2,sort?:PhotoSort):PhotoSummary[]{
 const count=new Map<string,number>();
 const saved=data.memories.filter(m=>m.lifecycle==='active');
 const savedIds=new Set(saved.map(m=>m.id));
 for(const media of data.media.media)if(savedIds.has(media.cardId))count.set(media.cardId,(count.get(media.cardId)??0)+1);
 const items=saved.filter(m=>(count.get(m.id)??0)>0).map((m,index)=>({m,index}));
 if(sort)items.sort((a,b)=>{const date=(m:typeof a.m)=>sort==='added'?m.createdAt:(m.updatedAt??m.createdAt);return (date(b.m)??'').localeCompare(date(a.m)??'')||a.index-b.index;});
 return items.map(({m})=>({id:m.id,title:m.title,photoCount:count.get(m.id)!}));
}
