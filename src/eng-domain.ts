import type { DataV2, MemoryV2 } from "./sb20-contract.ts";

/** Household dates follow the device's local calendar; event instants remain UTC. */
export function localDay(value = new Date()): string {
  return `${value.getFullYear()}-${String(value.getMonth()+1).padStart(2,"0")}-${String(value.getDate()).padStart(2,"0")}`;
}
export function validDay(value: unknown): value is string {
  if(typeof value!=="string"||!/^\d{4}-\d{2}-\d{2}$/.test(value))return false;
  const d=new Date(value+"T12:00:00Z");return Number.isFinite(d.getTime())&&d.toISOString().slice(0,10)===value;
}
export type MemoryEventKind = "created"|"answer_edited"|"source_changed"|"verified"|"verification_changed"|"reminder_scheduled"|"reminder_completed"|"reminder_rescheduled"|"archived"|"deleted"|"restored"|"labels_changed";
export interface MemoryEvent { id:string; type:MemoryEventKind; at:string; source?:string; confidence?:MemoryV2["confidence"]; due?:string; note?:string }
export const eventKinds: readonly string[] = ["created","answer_edited","source_changed","verified","verification_changed","reminder_scheduled","reminder_completed","reminder_rescheduled","archived","deleted","restored","labels_changed"];
export function eventText(event: MemoryEvent): string {
  const labels:Record<MemoryEventKind,string>={created:"Memory saved",answer_edited:"Answer edited — needs checking",source_changed:"Source changed — reconfirm the answer",verified:"Answer confirmed against source",verification_changed:"Verification status changed",reminder_scheduled:"Reminder scheduled",reminder_completed:"Reminder completed",reminder_rescheduled:"Reminder rescheduled",archived:"Memory archived",deleted:"Moved to Recently Deleted",restored:"Memory restored",labels_changed:"Organization changed"};
  return [labels[event.type],event.confidence,event.source,event.due,event.note].filter(Boolean).join(" · ");
}
/** Saved memory order belongs to mediaIds; manifest order is an implementation detail. */
export function orderedMemoryPhotos(memory:Pick<MemoryV2,"id"|"mediaIds">|undefined, manifest:readonly DataV2["media"]["media"][number][]=[]){
  if(!memory)return [];
  return memory.mediaIds.flatMap(id=>{
    const photo=manifest.find(p=>p.id===id&&p.cardId===memory.id);
    return photo?[photo]:[];
  });
}
export type ShareField = "location"|"notes"|"source"|"space"|"categories"|"verification"|"reminder";
export interface ShareSelection { fields:ShareField[]; photoIds:string[] }
export function sharePreview(memory:MemoryV2,data:DataV2,selection:ShareSelection={fields:[],photoIds:[]}) {
  const allowed:ShareField[]=["location","notes","source","space","categories","verification","reminder"];
  if(new Set(selection.fields).size!==selection.fields.length||selection.fields.some(f=>!allowed.includes(f)))throw Error("Review the selected share fields");
  if(new Set(selection.photoIds).size!==selection.photoIds.length||selection.photoIds.some(id=>!memory.mediaIds.includes(id)))throw Error("Review the selected photos");
  const lines=[memory.title,memory.answer||"Photo memory"];
  for(const f of selection.fields){
    if(f==="location"&&memory.location)lines.push("Location: "+memory.location);
    if(f==="notes"&&memory.notes)lines.push("Notes: "+memory.notes);
    if(f==="source"&&memory.source)lines.push("Source: "+memory.source);
    if(f==="space"){const space=data.spaces.find(s=>s.id===memory.spaceId)?.name;if(space)lines.push("Space: "+space);}
    if(f==="categories"){
      const categories=memory.categoryIds.map(id=>data.categories.find(c=>c.id===id)?.name).filter(Boolean);
      if(categories.length)lines.push("Categories: "+categories.join(", "));
    }
    if(f==="verification")lines.push("User verification: "+memory.confidence+(memory.verifiedAt?" · "+memory.verifiedAt:""));
    if(f==="reminder"&&memory.due)lines.push("Reminder: "+memory.due);
  }
  return {text:lines.join("\n"),photos:orderedMemoryPhotos(memory,data.media.media).filter(p=>selection.photoIds.includes(p.id)),includesPhotos:selection.photoIds.length>0};
}
