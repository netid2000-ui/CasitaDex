export function measuredUsableSpace(freeBlocks:number,appAvailable:number):number {
 for(const n of [freeBlocks,appAvailable])if(!Number.isSafeInteger(n)||n<0)throw Error("Storage measurement unavailable. Check device storage and retry; your saved data is kept.");
 return Math.min(freeBlocks,appAvailable);
}
export function requireStorageCapacity(available:number,required:number){
 if(!Number.isSafeInteger(available)||available<0||!Number.isSafeInteger(required)||required<0)throw Error("Storage measurement or write estimate unavailable. Your saved data is kept.");
 if(available<required)throw Error(`Not enough usable storage: this operation needs at least ${required} bytes; ${available} bytes are available. Free space outside CasitaDex and retry. Your current memories and draft are kept.`);
}
export function fullRestoreCapacity(oldEng:string,newEng:string,oldReminders:string,newReminders:string){
 const bytes=new TextEncoder().encode(oldEng+newEng+oldReminders+newReminders).length;
 const required=bytes*3+65536;
 if(!Number.isSafeInteger(required))throw Error("Restore storage estimate exceeds safe limits");
 return required;
}
type Reference={owner:string;entry:{path:string;bytes:number;sha256:string};verdict:string};
const categories=["active","archived","recently_deleted","draft","recovery","legacy-v1","legacy-recovery","journal"] as const;
export function protectedStorageReport(references:readonly Reference[]){
 const paths=new Map<string,{bytes:number;sha256:string;verified:boolean}>();
 const owners=Object.fromEntries(categories.map(c=>[c,new Set<string>()])) as Record<typeof categories[number],Set<string>>;
 for(const r of references){
  const journal=/^journal:(pending|promoted|committed|restore-pending|restore-staged)$/.test(r.owner);
  const owner=journal?"journal":r.owner;
  if(!categories.includes(owner as typeof categories[number]))throw Error("Unknown media ownership. Cleanup remains disabled; keep your backup and review integrity.");
  const e=r.entry;
  if(!e||!/^media\/[A-Za-z0-9_-]{1,100}\.(jpg|png|webp)$/.test(e.path)||!Number.isSafeInteger(e.bytes)||e.bytes<1||e.bytes>10000000||!/^[a-f0-9]{64}$/.test(e.sha256))throw Error("Damaged media ownership. No cleanup is permitted.");
  const existing=paths.get(e.path);
  if(existing&&(existing.bytes!==e.bytes||existing.sha256!==e.sha256))throw Error("Conflicting media ownership. No cleanup is permitted.");
  paths.set(e.path,{bytes:e.bytes,sha256:e.sha256,verified:(existing?.verified??true)&&r.verdict==="verified"});
  owners[owner as typeof categories[number]].add(e.path);
 }
 const entries=[...paths.values()];
 return {protectedBytes:entries.filter(e=>e.verified).reduce((n,e)=>n+e.bytes,0),
 referencedBytes:entries.reduce((n,e)=>n+e.bytes,0),unreadable:entries.filter(e=>!e.verified).length,
 ownerCounts:Object.fromEntries(categories.map(c=>[c,owners[c].size])),cleanupAllowed:false as const};
}
