/** Pure projection: never exposes media paths or mutates the store. */
import type {DataV2} from '../sb20-contract';
import type {PhotoSummary} from './FigmaPhotos';
export function photoSummaries(data:DataV2):PhotoSummary[]{
 const count=new Map<string,number>();
 const savedIds=new Set(data.memories.filter(m=>m.lifecycle==='active').map(m=>m.id));
 for(const media of data.media.media){if(savedIds.has(media.cardId))count.set(media.cardId,(count.get(media.cardId)??0)+1);}
 return data.memories.filter(m=>m.lifecycle==='active'&&(count.get(m.id)??0)>0).map(m=>({id:m.id,title:m.title,photoCount:count.get(m.id)!}));
}
