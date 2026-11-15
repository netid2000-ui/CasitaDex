import type {DataV2,MemoryV2} from './sb20-contract';
import {sameLocation} from './locations.ts';
export type SearchFilters={spaceId?:string;categoryId?:string;locationId?:string};
/** Location identity includes its Space; identically named locations remain distinct. */
export function filterFindResults(results:readonly MemoryV2[],data:DataV2,filters:SearchFilters){
 const location=(data.locations??[]).find(l=>l.id===filters.locationId);
 return results.filter(m=>(!filters.spaceId||m.spaceId===filters.spaceId)&&(!filters.categoryId||m.categoryIds.includes(filters.categoryId))&&(!filters.locationId||!!location&&sameLocation(m,location)));
}
export function findLocationChoices(data:DataV2,spaceId=''){
 return (data.locations??[]).filter(l=>!spaceId||l.spaceId===spaceId).map(l=>({...l,label:spaceId?l.name:`${l.name} · ${data.spaces.find(s=>s.id===l.spaceId)?.name??'Unassigned'}`})).sort((a,b)=>a.name.localeCompare(b.name)||a.label.localeCompare(b.label));
}
export function locationAfterSpaceChange(data:DataV2|undefined,locationId:string,spaceId:string){
 return !spaceId||(data?.locations??[]).some(l=>l.id===locationId&&l.spaceId===spaceId)?locationId:'';
}

export function findPage<T>(results:readonly T[],page:number,pageSize:number){
 const size=Math.max(1,pageSize),pages=Math.max(1,Math.ceil(results.length/size));
 const current=Math.max(0,Math.min(page,pages-1));
 return {page:current,pages,items:results.slice(current*size,(current+1)*size)};
}
