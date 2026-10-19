import type { DataV2, MemoryV2 } from './sb20-contract';
export type FindFilter={lifecycle:MemoryV2['lifecycle'];space:'all'|string|null;categories:string[];uncategorized:boolean;confidence:string;reminder:string;attachment:string};
export const defaultFilter=():FindFilter=>({lifecycle:'active',space:'all',categories:[],uncategorized:false,confidence:'all',reminder:'all',attachment:'all'});
const tokens=(s:string)=>s.toLocaleLowerCase().match(/[\p{L}\p{N}]+(?:[-/.][\p{L}\p{N}]+)*/gu)??[];
export function searchIndex(data:DataV2){
 const spaces=new Map(data.spaces.map(x=>[x.id,x.name])),categories=new Map(data.categories.map(x=>[x.id,x.name]));
 const photos=new Set(data.media.media.map(x=>x.cardId));
 return data.memories.map((memory,index)=>({memory,index,photo:photos.has(memory.id),fields:[memory.title,memory.answer,[memory.location,memory.notes,memory.legacyContext,spaces.get(memory.spaceId??''),...memory.categoryIds.map(id=>categories.get(id))].join(' ')].map(tokens)}));
}
export function findMemories(index:ReturnType<typeof searchIndex>,query:string,f:FindFilter,today:string){
 const terms=tokens(query);const matches=(a:string,b:string)=>/\d/.test(b)?a===b:a.startsWith(b);
 return index.flatMap(row=>{const m=row.memory;if(m.lifecycle!==f.lifecycle||(f.space!=='all'&&m.spaceId!==f.space)||f.uncategorized&&m.categoryIds.length||f.categories.length&&!f.categories.some(id=>m.categoryIds.includes(id))||f.confidence!=='all'&&m.confidence!==f.confidence||f.attachment==='photos'&&!row.photo||f.attachment==='text'&&row.photo)return [];
 if(f.reminder!=='all'&&(m.lifecycle!=='active'||(f.reminder==='none'?!!m.due:f.reminder==='overdue'?!(m.due&&m.due<today):f.reminder==='today'?m.due!==today:f.reminder==='future'?!(m.due&&m.due>today):!(m.due&&m.due<=today))))return [];
 let score=0;for(const term of terms){const position=row.fields.findIndex(field=>field.some(word=>matches(word,term)));if(position<0)return [];score+=[30,15,5][position];}if(query.trim().toLocaleLowerCase()===m.title.toLocaleLowerCase())score+=100;
 return [{...row,score}];}).sort((a,b)=>b.score-a.score||a.index-b.index).map(x=>x.memory);
}
export function homeMemories(data:DataV2,today:string){
 const active=data.memories.filter(m=>m.lifecycle==='active');
 return {active:active.length,recent:active.map((m,i)=>({m,i})).sort((a,b)=>a.m.createdAt&&b.m.createdAt?b.m.createdAt.localeCompare(a.m.createdAt):a.m.createdAt?-1:b.m.createdAt?1:b.i-a.i).slice(0,2).map(x=>x.m),due:active.filter(m=>m.due&&m.due<=today).sort((a,b)=>a.due!.localeCompare(b.due!)).slice(0,2)};
}
