import React from "react";
import type {DataV2} from "./sb20-contract";
import {locationKey} from "./locations";
import {TaxonomyPicker} from "./taxonomy-picker";
export function LocationPicker({data,spaceId,value,disabled,onSelect,onCreate,initiallyOpen=false}:{data:DataV2|undefined;spaceId:string|null;value:string;disabled:boolean;onSelect:(value:string)=>void;onCreate:(name:string)=>Promise<boolean>;initiallyOpen?:boolean}){
 const choices=(data?.locations??[]).filter(l=>l.spaceId===spaceId).map(l=>({id:l.name,name:l.name}));
 const current=choices.find(l=>locationKey(l.name)===locationKey(value))?.id??value;
 return <TaxonomyPicker key={spaceId??"unassigned"} label="Location" noun="Location" choices={choices} selected={current?[current]:[]} scope={data?.spaces.find(s=>s.id===spaceId)?.name??"Unassigned"} disabled={disabled} initiallyOpen={initiallyOpen} onSelect={ids=>onSelect(ids[0]??"")} onCreate={async name=>await onCreate(name)?name:null}/>;
}
