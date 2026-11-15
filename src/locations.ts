import type {DataV2,LocationLabel} from "./sb20-contract.ts";
export const locationKey=(name:string)=>name.trim().toLocaleLowerCase();
export function sameLocation(value:{spaceId:string|null;location:string},label:LocationLabel){return value.spaceId===label.spaceId&&locationKey(value.location)===locationKey(label.name);}
/** Add a reusable index without rewriting any existing memory or draft text. */
export function indexLocations(data:DataV2,draft:{spaceId:string|null;location:string}|null){
 const labels=[...(data.locations??[])],ids=new Set(labels.map(l=>l.id));
 const keys=new Set(labels.map(l=>JSON.stringify([l.spaceId,locationKey(l.name)])));let sequence=1;
 for(const item of [...data.memories,...(draft?[draft]:[])]){
  if(!item.location.trim())continue;
  const key=JSON.stringify([item.spaceId,locationKey(item.location)]);if(keys.has(key))continue;
  while(ids.has("loc_"+sequence))sequence++;
  const id="loc_"+sequence++;ids.add(id);keys.add(key);
  labels.push({id,spaceId:item.spaceId,name:item.location.trim()});
 }
 if(labels.length>10000)throw Error("Too many saved locations");
 if(labels.length||data.locations)data.locations=labels;
}
export function unassignSpaceLocations(data:DataV2,spaceId:string){
 const seen=new Set<string>();
 data.locations=(data.locations??[]).map(l=>l.spaceId===spaceId?{...l,spaceId:null}:l).filter(l=>{
  const key=JSON.stringify([l.spaceId,locationKey(l.name)]);if(seen.has(key))return false;seen.add(key);return true;
 });
}
