import type { EngDraft,EngSnapshot } from './eng-types';
const normalized=(s:string)=>s.trim().toLocaleLowerCase().replace(/\s+/g,' ');
const identifiers=(s:string)=>s.toLocaleLowerCase().match(/[\p{L}\p{N}]+(?:[-/.][\p{L}\p{N}]+)*/gu)?.filter(t=>/\d/.test(t))??[];
/** Advisory only, including archive/trash. Never merges or blocks an intentional save. */
export function duplicateCandidates(draft:EngDraft,snapshot:EngSnapshot){
 const hashes=new Set(draft.photos.map(p=>p.sha256)),title=normalized(draft.title),answer=normalized(draft.answer),ids=identifiers(draft.title+' '+draft.answer);
 return snapshot.data.memories.filter(m=>{
  if(snapshot.data.media.media.some(p=>p.cardId===m.id&&hashes.has(p.sha256)))return true;
  if(title&&title===normalized(m.title)&&answer===normalized(m.answer))return true;
  return title===normalized(m.title)&&ids.some(id=>identifiers(m.answer).includes(id));
 });
}
