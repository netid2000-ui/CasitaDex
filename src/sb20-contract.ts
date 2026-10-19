/** Canonical versioned contract, shared by the isolated fixtures and native ENG store. */
import { parseData, type Context, type Confidence, type HistoryEntry } from "./model.ts";
import { validateMediaManifest, type MediaManifest } from "./media-manifest.ts";
import { eventKinds, type MemoryEvent } from "./eng-domain.ts";
export type Lifecycle = "active" | "archived" | "recently_deleted";
export interface MemoryV2 {
  id:string; title:string; answer:string; spaceId:string|null;
  categoryIds:string[]; legacyContext:Context|null; location:string; notes:string;
  confidence:Confidence; source:string; verifiedAt?:string; due?:string;
  history:HistoryEntry[]; lifecycle:Lifecycle; deletedAt?:string;
  mediaIds:string[]; demo?:boolean;
  createdAt?:string; updatedAt?:string; archivedAt?:string; deletedInstant?:string;
  events?:MemoryEvent[];
}
export interface DataV2 {
  version:2; spaces:{id:string;name:string}[]; categories:{id:string;name:string}[];
  memories:MemoryV2[]; media:MediaManifest; draft:null;
}
const contexts = new Set(["Buy","Fix","Find","Maintain"]);
const confidences = new Set(["Verified","Needs checking","Unknown"]);
const ids = /^[a-zA-Z0-9_-]{1,100}$/;
function fail(reason:string):never { throw new Error("SB20 compatibility: "+reason); }
function record(x:unknown):Record<string,any>{
  if(!x||typeof x!=="object"||Array.isArray(x))fail("invalid object");return x as Record<string,any>;
}
function unique(items:string[], label:string, legacyTextIds=false) {
  if(items.some(x=>legacyTextIds ? typeof x!=="string"||!x.length||x.length>100 : !ids.test(x))||new Set(items).size!==items.length)fail("invalid or duplicate "+label);
}
function known(x:Record<string,any>, names:string[],label:string){
  if(Object.keys(x).some(k=>!names.includes(k)))fail("unknown "+label+" field");
}
function isDate(value:unknown):boolean {
  return typeof value==="string" && /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0,10)===value;
}
export function fromLegacyV1(raw:string, manifest?:unknown):DataV2 {
  const legacy=parseData(raw); // Real v1 validator preserves its current strict contract.
  const media=manifest===undefined ? {version:2 as const,media:[]} :
    validateMediaManifest(manifest,legacy.cards.map(c=>c.id));
  return {version:2,spaces:legacy.spaces.map(s=>({...s})),categories:[],
    memories:legacy.cards.map(c=>({
      id:c.id,title:c.title,answer:c.answer,spaceId:c.spaceId,categoryIds:[],
      legacyContext:c.context,location:c.location,notes:c.notes,
      confidence:c.confidence,source:c.source,...(c.verifiedAt?{verifiedAt:c.verifiedAt}:{}),
      ...(c.due?{due:c.due}:{}),history:c.history.map(h=>({...h})),
      lifecycle:"active" as const,...(c.demo?{demo:true}:{}),mediaIds:media.media.filter(m=>m.cardId===c.id).map(m=>m.id)
    })),media,draft:null};
}
/** Validate synthetic target contracts; verifiedMediaIds must come from independent byte/hash checks. */
export function validateV2(input:unknown, verifiedMediaIds:readonly string[]=[], allowLegacyIds=false):DataV2 {
  const d=record(input);
  known(d,["version","spaces","categories","memories","media","draft"],"root");
  if(d.version!==2||!Array.isArray(d.spaces)||!Array.isArray(d.categories)||
    !Array.isArray(d.memories)||d.memories.length>5000||d.draft!==null)fail("unsupported version or shape");
  const spaces=d.spaces.map((item:unknown)=>{
    const s=record(item);known(s,["id","name"],"space");
    if(typeof s.id!=="string"||typeof s.name!=="string"||!s.name.trim())fail("invalid space");
    return {id:s.id,name:s.name};
  });
  unique(spaces.map((s:{id:string})=>s.id),"space ID",allowLegacyIds);
  const categories=d.categories.map((item:unknown)=>{
    const c=record(item);known(c,["id","name"],"category");
    if(typeof c.id!=="string"||typeof c.name!=="string"||!c.name.trim())fail("invalid category");
    return {id:c.id,name:c.name};
  });
  unique(categories.map((c:{id:string})=>c.id),"category ID");
  const spaceIds=new Set(spaces.map((s:{id:string})=>s.id));
  const categoryIds=new Set(categories.map((c:{id:string})=>c.id));
  const memories=(d.memories as unknown[]).map(item=>{
    const m=record(item);
    known(m,["id","title","answer","spaceId","categoryIds","legacyContext","location","notes",
      "confidence","source","verifiedAt","due","history","lifecycle","deletedAt","mediaIds","demo",
      "createdAt","updatedAt","archivedAt","deletedInstant","events"],"memory");
    if(typeof m.id!=="string"||typeof m.title!=="string"||!m.title.trim()||
      m.title.length>200||typeof m.answer!=="string"||m.answer.length>1000||
      (m.spaceId!==null&&!spaceIds.has(m.spaceId))||
      !Array.isArray(m.categoryIds)||m.categoryIds.some((x:unknown)=>!categoryIds.has(x as string))||
      (m.legacyContext!==null&&!contexts.has(m.legacyContext))||
      typeof m.location!=="string"||typeof m.notes!=="string"||
      !confidences.has(m.confidence)||typeof m.source!=="string"||
      !Array.isArray(m.mediaIds)||!Array.isArray(m.history)||(m.demo!==undefined&&typeof m.demo!=="boolean")||
      !["active","archived","recently_deleted"].includes(m.lifecycle))fail("invalid memory");
    unique(m.categoryIds,"category membership");unique(m.mediaIds,"media membership");
    if(m.confidence==="Verified"&&(!m.source.trim()||!isDate(m.verifiedAt)))fail("verified evidence missing");
    if(m.verifiedAt!==undefined&&!isDate(m.verifiedAt))fail("invalid verification date");
    if(m.due!==undefined&&!isDate(m.due))fail("invalid reminder date");
    if(m.lifecycle==="recently_deleted"?!isDate(m.deletedAt):m.deletedAt!==undefined)
      fail("invalid deletion state");
    for(const field of ["createdAt","updatedAt","archivedAt","deletedInstant"]){
      if(m[field]!==undefined&&(typeof m[field]!=="string"||!Number.isFinite(Date.parse(m[field]))||new Date(m[field]).toISOString()!==m[field]))fail("invalid event timestamp");
    }
    if(m.events!==undefined){
      if(!Array.isArray(m.events)||m.events.length>10000)fail("invalid event history");
      const eventIds=new Set<string>();
      for(const value of m.events){
        const e=record(value);known(e,["id","type","at","source","confidence","due","note"],"event");
        if(typeof e.id!=="string"||!ids.test(e.id)||eventIds.has(e.id)||!eventKinds.includes(e.type)||typeof e.at!=="string"||!Number.isFinite(Date.parse(e.at))||new Date(e.at).toISOString()!==e.at||
          (e.source!==undefined&&(typeof e.source!=="string"||e.source.length>200))||
          (e.note!==undefined&&(typeof e.note!=="string"||e.note.length>4000))||
          (e.confidence!==undefined&&!confidences.has(e.confidence))||(e.due!==undefined&&!isDate(e.due)))fail("invalid event history");
        eventIds.add(e.id);
      }
    }
    return m as MemoryV2;
  });
  unique(memories.map(m=>m.id),"memory ID",allowLegacyIds);
  const media=validateMediaManifest(d.media,memories.map(m=>m.id));
  const indexed=new Map(media.media.map(m=>[m.id,m]));
  const verified=new Set(verifiedMediaIds);
  const linked=new Set<string>();
  for(const m of memories){
    if(!m.answer.trim()&&!m.mediaIds.some(id=>verified.has(id)&&indexed.get(id)?.cardId===m.id))
      fail("saved memory requires written answer or verified durable photo");
    for(const id of m.mediaIds){
      const entry=indexed.get(id);
      if(!entry||entry.cardId!==m.id||linked.has(id))fail("orphan or duplicate media reference");
      linked.add(id);
    }
    if(!Array.isArray(m.history)||m.history.length>10000)fail("invalid history");
    for(const h of m.history){
      if(!h||typeof h.id!=="string"||(allowLegacyIds?h.id.length>100:!ids.test(h.id))||!isDate(h.date)||
        typeof h.action!=="string")fail("invalid history entry");
    }
  }
  if(linked.size!==indexed.size)fail("unlinked media");
  return {version:2,spaces,categories,memories:memories.map(m=>JSON.parse(JSON.stringify(m))),media,draft:null};
}
export function previewLegacyV1(raw:string, manifest?:unknown) {
  const converted=fromLegacyV1(raw,manifest);
  return {sourceVersion:1,targetVersion:2,memories:converted.memories.length,
    spaces:converted.spaces.length,media:converted.media.media.length,
    contextsPreserved:converted.memories.filter(m=>m.legacyContext!==null).length,
    note:"Synthetic preview only; no database or device writes"};
}


