import type {DataV2} from './sb20-contract';
export function photoPermutation(current:readonly string[],requested:readonly string[]):string[]{
 if(!requested.length||requested.length!==current.length||new Set(requested).size!==requested.length||requested.some(id=>!current.includes(id)))throw Error('Photos changed. Reload before arranging them.');
 return [...requested];
}
export function movedPhoto(ids:readonly string[],id:string,destination:number):string[]{
 const from=ids.indexOf(id);if(from<0||!Number.isInteger(destination)||destination<0||destination>=ids.length)throw Error('Photo unavailable for this position');
 const result=[...ids];result.splice(from,1);result.splice(destination,0,id);return result;
}
export function orderedMemoryPhotos(data:DataV2,memoryId:string){
 const memory=data.memories.find(m=>m.id===memoryId);if(!memory)return [];
 const owned=data.media.media.filter(p=>p.cardId===memoryId),byId=new Map(owned.map(p=>[p.id,p]));
 // Legacy projections may omit mediaIds. Valid stored snapshots always have them.
 return memory.mediaIds?memory.mediaIds.flatMap(id=>byId.has(id)?[byId.get(id)!]:[]):owned;
}
