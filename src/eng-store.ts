import {fullRestoreCapacity} from "./storage-safety.ts";
import {qaGroups,qaAnswers,qaCount} from "./sb26-qa-seed.ts";
import {replaceReminderRowsInTransaction} from "./reminder-restore-v4.ts";
import {validateReminderBackupSection} from "./reminder-backup-v4.ts";
import type {ReminderBackupSection} from "./reminder-backup-v4.ts";
import { fromLegacyV1, validateV2, type DataV2, type MemoryV2 } from "./sb20-contract.ts";
import { validateMediaManifest, type MediaEntry } from "./media-manifest.ts";
import { sniffImageMime, verifyMediaBytes } from "./media-integrity.ts";
import type { Database, SQL } from "./sqlite-repository.ts";
import type { EngDraft, EngFiles, EngSnapshot, DraftConflict } from "./eng-types.ts";
import { localDay, validDay, type MemoryEvent, type MemoryEventKind } from "./eng-domain.ts";
const idPattern = /^[A-Za-z0-9_-]{1,100}$/;
export const engId = () => "e_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 12);
const clone = <T>(v:T):T => JSON.parse(JSON.stringify(v));
function refuseFuture(raw:string){
  let parsed:any;try{parsed=JSON.parse(raw);}catch{return;}
  if((typeof parsed?.version==="number"&&parsed.version>3)||(typeof parsed?.data?.version==="number"&&parsed.data.version>2))
    throw Error("This collection needs a newer CasitaDex build. Nothing was changed.");
}
function object(x:unknown):Record<string,any> {
  if (!x || typeof x !== "object" || Array.isArray(x)) throw Error("Invalid ENG object");
  return x as Record<string,any>;
}
function known(x:Record<string,any>, keys:string[]) {
  if (Object.keys(x).some(k=>!keys.includes(k))) throw Error("Unsupported ENG fields");
}
function id(x:unknown):asserts x is string {
  if(typeof x!=="string"||!idPattern.test(x))throw Error("Invalid ENG identity");
}
export function validateEngDraft(input:unknown,data:DataV2):EngDraft {
  const d=object(input);
  known(d,["id","attempt","memoryId","checkpoint","title","answer","location","spaceId","categoryIds","photos","legacyContext","notes","source","due"]);
  id(d.id);id(d.attempt);id(d.memoryId);
  if(!Number.isSafeInteger(d.checkpoint)||d.checkpoint<0||
    typeof d.title!=="string"||d.title.length>200||typeof d.answer!=="string"||d.answer.length>1000||
    typeof d.location!=="string"||d.location.length>4000||
    (d.spaceId!==null&&!data.spaces.some(s=>s.id===d.spaceId))||
    !Array.isArray(d.categoryIds)||d.categoryIds.length!==new Set(d.categoryIds).size||
    d.categoryIds.some((c:unknown)=>!data.categories.some(x=>x.id===c)))throw Error("Invalid draft fields");
  if(d.legacyContext!==null&&!["Buy","Fix","Find","Maintain"].includes(d.legacyContext))throw Error("Invalid draft context");
  if((d.notes!==undefined&&(typeof d.notes!=="string"||d.notes.length>4000))||
    (d.source!==undefined&&(typeof d.source!=="string"||d.source.length>200))||
    (d.due!==undefined&&(typeof d.due!=="string"||d.due.length>10)))throw Error("Check draft notes, source and reminder date");
  const photos=validateMediaManifest({version:2,media:d.photos},[d.memoryId]).media;
  if(photos.length>5)throw Error("A new memory can have up to five photos");
  return {...clone(d),photos} as EngDraft;
}
export function validateEngSnapshot(input:unknown):EngSnapshot {
  const s=object(input);
  known(s,["version","revision","data","draft","attempts"]);
  if(s.version!==3||!Number.isSafeInteger(s.revision)||s.revision<0)throw Error("Unsupported full backup version");
  // These IDs establish structural linkage only. Bytes are verified independently before any use/write.
  const structuralIds=Array.isArray(s.data?.media?.media)?s.data.media.media.map((m:MediaEntry)=>m.id):[];
  const data=validateV2(s.data,structuralIds,true);
  for(const m of data.memories) {
    if(m.location.length>4000||m.notes.length>4000||m.source.length>200||
      m.history.some(h=>h.action.length>4000))throw Error("Oversized memory field");
  }
  if(data.spaces.some(x=>x.name.length>200)||data.categories.some(x=>x.name.length>200)||
    data.categories.length>1000||data.spaces.length>1000)throw Error("Oversized taxonomy");
  const draft=s.draft===null?null:validateEngDraft(s.draft,data);
  const attempts=object(s.attempts);
  for(const [a,m] of Object.entries(attempts)){id(a);id(m);}
  if(Object.keys(attempts).length>10000)throw Error("Save history exceeds limit");
  const entries=[...data.media.media,...(draft?.photos??[])];
  if(new Set(entries.map(e=>e.id)).size!==entries.length||new Set(entries.map(e=>e.path)).size!==entries.length)
    throw Error("Duplicate draft and saved media ownership");
  if(draft&&(data.memories.some(m=>m.id===draft.memoryId)||Object.hasOwn(attempts,draft.attempt)))
    throw Error("Consumed or conflicting draft identity");
  const result={version:3 as const,revision:s.revision,data,draft,attempts:clone(attempts)};
  if(new TextEncoder().encode(JSON.stringify(result)).length>4_000_000)throw Error("Full backup metadata exceeds 4 MB");
  return result;
}
export function allEngMedia(s:EngSnapshot){return [...s.data.media.media,...(s.draft?.photos??[])];}
export async function verifyEngSnapshot(s:EngSnapshot,files:EngFiles){
  for(const e of allEngMedia(s))await verifyMediaBytes(e,await files.read(e.path),files.hash);
}
export function newEngDraft():EngDraft {
  return {id:engId(),attempt:engId(),memoryId:engId(),checkpoint:0,title:"",answer:"",location:"",notes:"",source:"",spaceId:null,legacyContext:null,categoryIds:[],photos:[]};
}
const schema=`CREATE TABLE IF NOT EXISTS eng_state_v2(slot INTEGER PRIMARY KEY CHECK(slot=1),payload TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS eng_recovery_v2(slot INTEGER PRIMARY KEY CHECK(slot=1),payload TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS eng_media_ops_v2(id TEXT PRIMARY KEY,payload TEXT NOT NULL,phase TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS eng_control_v2(key TEXT PRIMARY KEY,value TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS eng_damaged_v2(id INTEGER PRIMARY KEY AUTOINCREMENT,payload TEXT NOT NULL,reason TEXT NOT NULL);`;
/** One serial queue for collection, draft, media, export, restore and recovery.
 * Files are immutable and retained on uncertain outcomes; snapshot/recovery/journal owners are never swept. */
export function createEngStore(db:Database,files:EngFiles,migrate:()=>Promise<EngSnapshot>,options:{now?:()=>Date;fault?:(phase:string)=>void|Promise<void>}={}) {
  const now=()=>options.now?.()??new Date();
  function event(m:MemoryV2,type:MemoryEventKind,details:Partial<Omit<MemoryEvent,"id"|"type"|"at">>={}){
    const at=now().toISOString();m.updatedAt=at;
    m.events=[...(m.events??[]),{id:engId(),type,at,...details}];
  }
  const restoreChanged=()=>Error("Your collection or draft changed since the backup review. Review the current state again before replacing it.");
  const tokenFor=(raw:string|null)=>files.hash(new TextEncoder().encode(raw===null?"ENG-MISSING-PRIMARY":raw));
  let queue:Promise<unknown>=Promise.resolve();
  let initialized=false;
  let verifiedRevision:number|undefined;
  function serial<T>(fn:()=>Promise<T>):Promise<T>{
    const next=queue.then(fn);queue=next.catch(()=>undefined);return next;
  }
  async function read(sql:SQL):Promise<EngSnapshot>{
    const row=await sql.getFirstAsync<{payload:string}>("SELECT payload FROM eng_state_v2 WHERE slot=1");
    if(!row)throw Error("ENG collection unavailable");
    return validateEngSnapshot(JSON.parse(row.payload));
  }
  async function init(){
    if(initialized)return;
    await db.execAsync(schema);
    const marker=await db.getFirstAsync<{value:string}>("SELECT value FROM eng_control_v2 WHERE key='initialized'");
    if(marker&&marker.value!=="3")throw Error("This collection needs a newer CasitaDex build. Nothing was changed.");
    const primary=await db.getFirstAsync<{payload:string}>("SELECT payload FROM eng_state_v2 WHERE slot=1");
    if(primary)refuseFuture(primary.payload);
    const recovery=await db.getFirstAsync("SELECT payload FROM eng_recovery_v2 WHERE slot=1");
    if(!primary&&!marker&&!recovery){
      const initial=validateEngSnapshot(await migrate());await verifyEngSnapshot(initial,files);
      await db.withExclusiveTransactionAsync(async tx=>{
        if(!await tx.getFirstAsync("SELECT payload FROM eng_state_v2 WHERE slot=1"))
          await tx.runAsync("INSERT INTO eng_state_v2(slot,payload) VALUES(1,?)",JSON.stringify(initial));
        await tx.runAsync("INSERT OR IGNORE INTO eng_control_v2(key,value) VALUES('initialized','3')");
      });
    }else if(!marker)await db.runAsync("INSERT OR IGNORE INTO eng_control_v2(key,value) VALUES('initialized','3')");
    initialized=true;
  }
  async function commit(before:EngSnapshot,next:EngSnapshot,recovery=true,mediaIds:string[]=[],checkFiles=true){
    next.revision=before.revision+1;
    const valid=validateEngSnapshot(next);
    if(checkFiles)await verifyEngSnapshot(valid,files);
    // Bound simultaneous snapshot, recovery and WAL writes; this is an operation estimate,
    // not a calibrated device-pressure warning threshold.
    const nextBytes=new TextEncoder().encode(JSON.stringify(valid)).length;
    const previousBytes=new TextEncoder().encode(JSON.stringify(before)).length;
    await files.capacity(nextBytes*3+previousBytes*2+65536);
    await options.fault?.("before-state-commit");
    await db.withExclusiveTransactionAsync(async tx=>{
      const current=await read(tx);
      if(JSON.stringify(current)!==JSON.stringify(before))throw Error("Collection changed; reload before retrying");
      if(recovery)await tx.runAsync("INSERT OR REPLACE INTO eng_recovery_v2(slot,payload) VALUES(1,?)",JSON.stringify(before));
      if(recovery){const marker=await tx.getFirstAsync<{name:string}>("SELECT name FROM sqlite_master WHERE type='table' AND name='eng_reminder_recovery_v4'");if(marker)await tx.runAsync("DELETE FROM eng_reminder_recovery_v4 WHERE slot=1");}
      await tx.runAsync("UPDATE eng_state_v2 SET payload=? WHERE slot=1",JSON.stringify(valid));
      for(const mediaId of mediaIds)await tx.runAsync("UPDATE eng_media_ops_v2 SET phase='committed' WHERE id=?",mediaId);
    });
    if(checkFiles||verifiedRevision===before.revision)verifiedRevision=valid.revision;
    await options.fault?.("after-state-commit");
    return valid;
  }
  async function rawPrimary(){
    const row=await db.getFirstAsync<{payload:string}>("SELECT payload FROM eng_state_v2 WHERE slot=1");
    if(row)refuseFuture(row.payload);
    return row?.payload??null;
  }
  async function repair(raw:string|null,input:EngSnapshot){
    const next=validateEngSnapshot(input);next.revision++;
    const valid=validateEngSnapshot(next);await verifyEngSnapshot(valid,files);
    const text=JSON.stringify(valid);
    await files.capacity(new TextEncoder().encode(text).length*3+new TextEncoder().encode(raw??"").length+65536);
    await db.withExclusiveTransactionAsync(async tx=>{
      const current=await tx.getFirstAsync<{payload:string}>("SELECT payload FROM eng_state_v2 WHERE slot=1");
      if((current?.payload??null)!==raw)throw Error("Collection changed during recovery; review and retry");
      await tx.runAsync("INSERT INTO eng_damaged_v2(payload,reason) VALUES(?,'Explicit recovery of unreadable full snapshot')",raw??"");
      const marker=await tx.getFirstAsync<{name:string}>("SELECT name FROM sqlite_master WHERE type='table' AND name='eng_reminder_recovery_v4'");if(marker)await tx.runAsync("DELETE FROM eng_reminder_recovery_v4 WHERE slot=1");
      // The previous known-good full recovery is deliberately not replaced with damaged bytes.
      await tx.runAsync("INSERT OR REPLACE INTO eng_state_v2(slot,payload) VALUES(1,?)",text);
    });
    verifiedRevision=valid.revision;return valid;
  }
  async function loaded(){
    await init();const s=await read(db);
    if(verifiedRevision!==s.revision){await verifyEngSnapshot(s,files);verifiedRevision=s.revision;}
    return s;
  }
  async function mutate(fn:(s:EngSnapshot)=>void,recovery=true){
    const before=await loaded(),next=clone(before);fn(next);return commit(before,next,recovery);
  }
  async function stagePhoto(parentId:string,bytes:Uint8Array){
      const mime=sniffImageMime(bytes);
      if(!mime||!bytes.length||bytes.length>10_000_000)throw Error("Choose a JPEG, PNG or WebP up to 10 MB");
      await files.capacity(bytes.length*2+2_000_000);
      const photoId=engId(),ext=mime==="image/jpeg"?"jpg":mime==="image/png"?"png":"webp";
      const entry:MediaEntry={id:photoId,cardId:parentId,path:`media/${photoId}.${ext}`,mime,bytes:bytes.length,sha256:await files.hash(bytes)};
      await db.runAsync("INSERT INTO eng_media_ops_v2(id,payload,phase) VALUES(?,?,'pending')",entry.id,JSON.stringify(entry));
      await options.fault?.("after-media-journal");
      await files.put(entry,bytes);
      await options.fault?.("after-private-promotion");
      await verifyMediaBytes(entry,await files.read(entry.path),files.hash);
      await db.runAsync("UPDATE eng_media_ops_v2 SET phase='promoted' WHERE id=?",entry.id);
      await options.fault?.("after-media-verification");
      return entry;
  }
  return {
    seedSyntheticQa:()=>serial(()=>mutate(s=>{
      if(qaCount!==90||qaAnswers.length!==qaGroups.length)throw Error("QA fixture catalog incomplete");
      if(s.data.memories.some(m=>m.id.startsWith("sb26qa_")))throw Error("SB26 sample records already exist; nothing added");
      const spaces=["Sample Home","Sample Garage","Sample Office"].map((name,i)=>({id:`sb26space_${i}`,name}));
      for(const space of spaces)if(!s.data.spaces.some(x=>x.id===space.id))s.data.spaces.push(space);
      qaGroups.forEach(([name,items],i)=>{
        if(items.length!==6||qaAnswers[i]?.length!==6)throw Error("QA fixture group incomplete");
        const categoryId=`sb26cat_${i}`;
        if(!s.data.categories.some(c=>c.id===categoryId))s.data.categories.push({id:categoryId,name});
        items.forEach((title,j)=>{
          const index=i*6+j;
          const at=new Date(Date.UTC(2026,7,1+index)).toISOString();
          const due=index%7===0?new Date(Date.UTC(2026,9,22+(index%24))).toISOString().slice(0,10):undefined;
          s.data.memories.push({id:`sb26qa_${String(index+1).padStart(3,"0")}`,title:`[SAMPLE] ${title}`,
            answer:`${qaAnswers[i][j]}. This is a fictional example, not a verified household location.`,
            location:qaAnswers[i][j],notes:"Synthetic QA data only. Replace with your own confirmed information before relying on it.",
            source:"CasitaDex synthetic QA fixture",confidence:"Unknown",spaceId:spaces[i%3].id,
            categoryIds:[categoryId],legacyContext:null,history:[],lifecycle:"active",mediaIds:[],demo:true,
            createdAt:at,updatedAt:at,...(due?{due}:{})});
        });
      });
    })),    load:()=>serial(loaded),
    checkpoint:(input:EngDraft)=>serial(async()=>{
      const before=await loaded(),next=clone(before),d=validateEngDraft(input,before.data);
      if(Object.hasOwn(before.attempts,d.attempt))throw Error("Draft was already saved");
      const old=before.draft;
      if(old&&(old.id!==d.id||old.attempt!==d.attempt||old.memoryId!==d.memoryId))throw Error("Continue or discard the existing draft");
      if(old&&(old.checkpoint>d.checkpoint||(old.checkpoint===d.checkpoint&&JSON.stringify(old)!==JSON.stringify(d))))throw Error("Stale or conflicting checkpoint");
      if(JSON.stringify(old?.photos??[])!==JSON.stringify(d.photos))throw Error("Use photo operations to change durable draft photos");
      next.draft=d;return commit(before,next,false,[],false);
    }),
    discard:(draftId:string,checkpoint:number)=>serial(()=>mutate(s=>{
      if(!s.draft||s.draft.id!==draftId||s.draft.checkpoint!==checkpoint)throw Error("Draft changed; review before discarding");
      s.draft=null;
    })),
    addPhoto:(draftId:string,bytes:Uint8Array)=>serial(async()=>{
      const before=await loaded(),d=before.draft;
      if(!d||d.id!==draftId)throw Error("Save a draft checkpoint before adding a photo");
      if(d.photos.length>=5)throw Error("Five photos already added. Remove one before adding another.");
      const entry=await stagePhoto(d.memoryId,bytes);
      const next=clone(before);next.draft!.photos.push(entry);next.draft!.checkpoint++;
      return commit(before,next,false,[entry.id]);
    }),
    replacePhoto:(draftId:string,photoId:string,bytes:Uint8Array)=>serial(async()=>{
      const before=await loaded(),d=before.draft;
      if(!d||d.id!==draftId||!d.photos.some(p=>p.id===photoId))throw Error("Draft photo changed; review again");
      const entry=await stagePhoto(d.memoryId,bytes),next=clone(before);
      next.draft!.photos=next.draft!.photos.map(p=>p.id===photoId?entry:p);next.draft!.checkpoint++;
      return commit(before,next,false,[entry.id]);
    }),
    removePhoto:(draftId:string,photoId:string)=>serial(()=>mutate(s=>{
      if(!s.draft||s.draft.id!==draftId)throw Error("Draft changed");
      s.draft.photos=s.draft.photos.filter(p=>p.id!==photoId);s.draft.checkpoint++;
    })),
    saveDraft:(attempt:string,memoryId:string)=>serial(async()=>{
      id(attempt);id(memoryId);
      const before=await loaded();
      if(Object.hasOwn(before.attempts,attempt)){
        if(before.attempts[attempt]!==memoryId)throw Error("Save attempt conflict");
        if(!before.data.memories.some(m=>m.id===memoryId))throw Error("Saved memory is no longer available");
        await verifyEngSnapshot(before,files);return before;
      }
      const d=before.draft;
      if(!d||d.attempt!==attempt||d.memoryId!==memoryId)throw Error("Draft changed; reload before saving");
      if(!d.title.trim()||(!d.answer.trim()&&!d.photos.length))throw Error("Add a name and either an answer or a photo");
      if(d.due&&!validDay(d.due))throw Error("Use a complete reminder date (YYYY-MM-DD), or clear it. Your draft is kept.");
      const next=clone(before);
      const memory:MemoryV2={id:d.memoryId,title:d.title.trim(),answer:d.answer.trim(),location:d.location.trim(),
        notes:d.notes?.trim()??"",spaceId:d.spaceId,categoryIds:d.categoryIds,legacyContext:d.legacyContext,confidence:"Unknown",source:d.source?.trim()??"",history:[],lifecycle:"active",mediaIds:d.photos.map(p=>p.id),createdAt:now().toISOString(),...(d.due?{due:d.due}:{})};
      event(memory,"created");if(memory.due)event(memory,"reminder_scheduled",{due:memory.due});
      next.data.memories.push(memory);next.data.media.media.push(...d.photos);next.draft=null;
      Object.defineProperty(next.attempts,attempt,{value:memoryId,enumerable:true,writable:true,configurable:true});
      return commit(before,next,true,d.photos.map(p=>p.id));
    }),
    updateMemory:(memory:MemoryV2,revision:number)=>serial(()=>mutate(s=>{
      if(s.revision!==revision)throw Error("Memory changed; reload before saving edits");
      const index=s.data.memories.findIndex(m=>m.id===memory.id);
      if(index<0)throw Error("Memory unavailable");
      const old=s.data.memories[index];
      if(JSON.stringify(old.mediaIds)!==JSON.stringify(memory.mediaIds)||old.lifecycle!==memory.lifecycle||old.deletedAt!==memory.deletedAt)
        throw Error("Use the lifecycle and media operations");
      if(memory.confidence!==old.confidence||memory.verifiedAt!==old.verifiedAt)throw Error("Use Review to confirm verification evidence or change status");
      if(JSON.stringify(memory.events)!==JSON.stringify(old.events)||memory.createdAt!==old.createdAt||memory.updatedAt!==old.updatedAt||
        memory.archivedAt!==old.archivedAt||memory.deletedInstant!==old.deletedInstant||JSON.stringify(memory.history)!==JSON.stringify(old.history))throw Error("Use the history or review actions; existing events are preserved");
      const next=clone(memory);
      if(old.answer.trim()!==next.answer.trim()){
        next.confidence="Needs checking";delete next.verifiedAt;event(next,"answer_edited");
      }
      if(old.source.trim()!==next.source.trim()){
        next.confidence="Needs checking";delete next.verifiedAt;event(next,"source_changed",{source:next.source});
      }
      if(old.due!==next.due)event(next,old.due?"reminder_rescheduled":"reminder_scheduled",next.due?{due:next.due}:{note:"Reminder removed"});
      if(old.spaceId!==next.spaceId||JSON.stringify(old.categoryIds)!==JSON.stringify(next.categoryIds))event(next,"labels_changed");
      next.updatedAt=now().toISOString();s.data.memories[index]=next;
    })),
    reviewMemory:(memoryId:string,review:{confidence:MemoryV2["confidence"];source:string},revision:number)=>serial(()=>mutate(s=>{
      if(s.revision!==revision)throw Error("Memory changed; review it again before confirming");
      const m=s.data.memories.find(m=>m.id===memoryId);if(!m||m.lifecycle==="recently_deleted")throw Error("Memory unavailable for review");
      if(!["Verified","Needs checking","Unknown"].includes(review.confidence)||typeof review.source!=="string"||review.source.length>200)throw Error("Check the review fields");
      if(review.confidence==="Verified"&&!review.source.trim())throw Error("Identify the source before confirming this answer");
      m.source=review.source.trim();m.confidence=review.confidence;
      if(review.confidence==="Verified")m.verifiedAt=localDay(now());else delete m.verifiedAt;
      event(m,review.confidence==="Verified"?"verified":"verification_changed",{source:m.source,confidence:m.confidence});
    })),
    recordHistory:(memoryId:string,note:string,revision:number)=>serial(()=>mutate(s=>{
      if(s.revision!==revision)throw Error("Memory changed; reload before recording history");
      const m=s.data.memories.find(m=>m.id===memoryId);if(!m||m.lifecycle==="recently_deleted")throw Error("Memory unavailable");
      if(!note.trim()||note.length>4000)throw Error("Add a history note up to 4000 characters");
      m.history.push({id:engId(),date:localDay(now()),action:note.trim()});m.updatedAt=now().toISOString();
    })),
    completeReminder:(memoryId:string,revision:number,nextDue?:string)=>serial(()=>mutate(s=>{
      if(s.revision!==revision)throw Error("Memory changed; review the reminder again");
      const m=s.data.memories.find(m=>m.id===memoryId);if(!m||m.lifecycle!=="active"||!m.due)throw Error("No active reminder to complete");
      if(nextDue!==undefined&&!validDay(nextDue))throw Error("Use a valid next reminder date");
      event(m,"reminder_completed",{due:m.due});delete m.due;
      if(nextDue){m.due=nextDue;event(m,"reminder_rescheduled",{due:nextDue});}
    })),
    addMemoryPhoto:(memoryId:string,bytes:Uint8Array)=>serial(async()=>{
      const before=await loaded(),next=clone(before),m=next.data.memories.find(m=>m.id===memoryId);
      if(!m||m.lifecycle==="recently_deleted")throw Error("Memory unavailable for photo additions");
      if(m.mediaIds.length>=5)throw Error("Five photos already attached. Existing photos are preserved.");
      const entry=await stagePhoto(memoryId,bytes);m.mediaIds.push(entry.id);next.data.media.media.push(entry);
      m.confidence="Needs checking";delete m.verifiedAt;event(m,"answer_edited",{note:"Photo added"});
      return commit(before,next,true,[entry.id]);
    }),
    replaceMemoryPhoto:(memoryId:string,photoId:string,bytes:Uint8Array)=>serial(async()=>{
      const before=await loaded(),next=clone(before),m=next.data.memories.find(m=>m.id===memoryId);
      if(!m||m.lifecycle==="recently_deleted"||!m.mediaIds.includes(photoId))throw Error("Photo unavailable for replacement");
      const entry=await stagePhoto(memoryId,bytes);
      m.mediaIds=m.mediaIds.map(id=>id===photoId?entry.id:id);
      next.data.media.media=next.data.media.media.filter(p=>!(p.id===photoId&&p.cardId===memoryId));
      next.data.media.media.push(entry);
      m.confidence="Needs checking";delete m.verifiedAt;event(m,"answer_edited",{note:"Photo replaced"});
      return commit(before,next,true,[entry.id]);
    }),    removeMemoryPhoto:(memoryId:string,photoId:string)=>serial(()=>mutate(s=>{
      const m=s.data.memories.find(m=>m.id===memoryId);if(!m)throw Error("Memory unavailable");
      if(!m.answer.trim()&&m.mediaIds.length<=1)throw Error("Add a written answer before removing the last photo");
      if(!m.mediaIds.includes(photoId))throw Error("Photo unavailable");
      m.mediaIds=m.mediaIds.filter(id=>id!==photoId);s.data.media.media=s.data.media.media.filter(e=>e.id!==photoId||e.cardId!==memoryId);
      m.confidence="Needs checking";delete m.verifiedAt;event(m,"answer_edited",{note:"Photo removed"});
    })),
    purge:(memoryId:string,day:string)=>serial(()=>mutate(s=>{
      const m=s.data.memories.find(m=>m.id===memoryId);
      if(!m||m.lifecycle!=="recently_deleted"||!m.deletedAt)throw Error("Memory is not in Recently Deleted");
      const elapsed=Date.parse(day)-Date.parse(m.deletedAt);
      if(!Number.isFinite(elapsed)||elapsed<30*86400000)throw Error("Keep this memory for at least 30 days before permanent removal");
      s.data.memories=s.data.memories.filter(x=>x.id!==memoryId);s.data.media.media=s.data.media.media.filter(e=>e.cardId!==memoryId);
      // Immutable bytes and previous full snapshot remain protected; no filesystem deletion here.
    })),
    lifecycle:(memoryId:string,state:MemoryV2["lifecycle"],day:string)=>serial(()=>mutate(s=>{
      const m=s.data.memories.find(m=>m.id===memoryId);if(!m)throw Error("Memory unavailable");
      if(!validDay(day))throw Error("Use a valid local deletion date");
      const previous=m.lifecycle;m.lifecycle=state;
      if(state==="recently_deleted"){m.deletedAt=day;m.deletedInstant=now().toISOString();}else{delete m.deletedAt;delete m.deletedInstant;}
      if(state==="archived")m.archivedAt=now().toISOString();else delete m.archivedAt;
      if(previous!==state)event(m,state==="archived"?"archived":state==="recently_deleted"?"deleted":"restored");
    })),
    bulkLifecycle:(ids:string[],state:MemoryV2["lifecycle"],revision:number)=>serial(()=>mutate(s=>{
      if(s.revision!==revision)throw Error("Collection changed; review selected memories again");
      if(!ids.length||new Set(ids).size!==ids.length||ids.some(id=>!s.data.memories.some(m=>m.id===id)))throw Error("Review selected memories again");
      for(const m of s.data.memories.filter(m=>ids.includes(m.id))){
        if(m.lifecycle===state)continue;m.lifecycle=state;
        if(state==="recently_deleted"){m.deletedAt=localDay(now());m.deletedInstant=now().toISOString();}else{delete m.deletedAt;delete m.deletedInstant;}
        if(state==="archived")m.archivedAt=now().toISOString();else delete m.archivedAt;
        event(m,state==="archived"?"archived":state==="recently_deleted"?"deleted":"restored");
      }
    })),
    taxonomyImpact:(kind:"space"|"category",labelId:string)=>serial(async()=>{
      const s=await loaded();const list=kind==="space"?s.data.spaces:s.data.categories;
      const label=list.find(x=>x.id===labelId);if(!label)throw Error("Label unavailable");
      return {kind,id:labelId,name:label.name,revision:s.revision,memories:s.data.memories.filter(m=>kind==="space"?m.spaceId===labelId:m.categoryIds.includes(labelId)).length,draft:!!s.draft&&(kind==="space"?s.draft.spaceId===labelId:s.draft.categoryIds.includes(labelId))};
    }),
    renameTaxonomy:(kind:"space"|"category",labelId:string,name:string,revision:number)=>serial(()=>mutate(s=>{
      if(s.revision!==revision)throw Error("Organization changed; review again");
      const list=kind==="space"?s.data.spaces:s.data.categories,label=list.find(x=>x.id===labelId);
      if(!label)throw Error("Label unavailable");if(!name.trim()||name.trim().length>200)throw Error("Use a name up to 200 characters");
      if(list.some(x=>x.id!==labelId&&x.name.toLocaleLowerCase()===name.trim().toLocaleLowerCase()))throw Error("That name already exists");label.name=name.trim();
    })),
    removeTaxonomy:(kind:"space"|"category",labelId:string,revision:number)=>serial(()=>mutate(s=>{
      if(s.revision!==revision)throw Error("Organization changed; review affected memories again");
      const list=kind==="space"?s.data.spaces:s.data.categories;if(!list.some(x=>x.id===labelId))throw Error("Label unavailable");
      if(kind==="space")s.data.spaces=s.data.spaces.filter(x=>x.id!==labelId);else s.data.categories=s.data.categories.filter(x=>x.id!==labelId);
      for(const m of s.data.memories){if(kind==="space"&&m.spaceId===labelId){m.spaceId=null;event(m,"labels_changed");}if(kind==="category"&&m.categoryIds.includes(labelId)){m.categoryIds=m.categoryIds.filter(x=>x!==labelId);event(m,"labels_changed");}}
      if(s.draft){if(kind==="space"&&s.draft.spaceId===labelId)s.draft.spaceId=null;if(kind==="category")s.draft.categoryIds=s.draft.categoryIds.filter(x=>x!==labelId);s.draft.checkpoint++;}
    })),
    restoreToken:()=>serial(async()=>{await init();return tokenFor(await rawPrimary());}),
    taxonomy:(kind:"space"|"category",name:string,revision?:number)=>serial(()=>mutate(s=>{
      if(revision!==undefined&&s.revision!==revision)throw Error("Collection changed; keep edits and review before adding a label");
      if(!name.trim()||name.trim().length>200)throw Error("Use a name up to 200 characters");
      const list=kind==="space"?s.data.spaces:s.data.categories;
      if(list.some(x=>x.name.toLocaleLowerCase()===name.trim().toLocaleLowerCase()))throw Error("That name already exists");
      list.push({id:engId(),name:name.trim()});
    })),
    backup:()=>serial(async()=>{const s=await loaded();await verifyEngSnapshot(s,files);return {snapshot:s,read:files.read,hash:files.hash};}),
    stageRestore:(incoming:EngSnapshot,readIncoming:(path:string)=>Promise<Uint8Array>,expectedToken?:string)=>serial(async()=>{
      await init();const valid=validateEngSnapshot(incoming);
      if(expectedToken!==undefined&&expectedToken!==await tokenFor(await rawPrimary()))throw restoreChanged();
      const entries=allEngMedia(valid);
      await files.capacity(entries.reduce((n,e)=>n+e.bytes*2,0)+4_000_000);
      // Preflight every incoming byte before staging any file.
      for(const entry of entries)await verifyMediaBytes(entry,await readIncoming(entry.path),files.hash);
      for(const entry of entries){
        let existing:Uint8Array|undefined;
        try{existing=await files.read(entry.path);}catch{/* An absent private file can be staged. */}
        if(existing){await verifyMediaBytes(entry,existing,files.hash);continue;}
        await db.runAsync("INSERT OR REPLACE INTO eng_media_ops_v2(id,payload,phase) VALUES(?,?,'restore-pending')",entry.id,JSON.stringify(entry));
        await files.put(entry,await readIncoming(entry.path));
        await verifyMediaBytes(entry,await files.read(entry.path),files.hash);
        await db.runAsync("UPDATE eng_media_ops_v2 SET phase='restore-staged' WHERE id=?",entry.id);
      }
      return valid;
    }),
    restore:(incoming:EngSnapshot,conflict:DraftConflict,expectedToken?:string)=>serial(async()=>{
      if(conflict==="cancel")return loaded();
      await init();const raw=await rawPrimary();
      if(typeof expectedToken!=="string"||expectedToken!==await tokenFor(raw))throw restoreChanged();
      const next=validateEngSnapshot(incoming);await verifyEngSnapshot(next,files);
      let before:EngSnapshot;
      try{before=validateEngSnapshot(JSON.parse(raw??""));}catch{
        if(conflict==="keep")throw Error("The current draft cannot be read. Use the backed-up draft or cancel; damaged bytes will be retained.");
        return repair(raw,next);
      }
      if(before.draft&&conflict==="keep"){
        if(next.data.memories.some(m=>m.id===before.draft!.memoryId))throw Error("Current draft conflicts with an incoming saved memory; cancel or use backed-up draft");
        next.draft=clone(before.draft);
        if(next.draft.spaceId&&!next.data.spaces.some(s=>s.id===next.draft!.spaceId)){
          const space=before.data.spaces.find(s=>s.id===next.draft!.spaceId)!;next.data.spaces.push(space);
        }
        for(const categoryId of next.draft.categoryIds)if(!next.data.categories.some(c=>c.id===categoryId))next.data.categories.push(before.data.categories.find(c=>c.id===categoryId)!);
        delete next.attempts[next.draft.attempt];
      }
      return commit(before,next);
    }),
    reminderRestoreToken:()=>serial(async()=>{await init();const table=await db.getFirstAsync<{name:string}>("SELECT name FROM sqlite_master WHERE type='table' AND name='standalone_reminders_v1'");if(!table)return tokenFor("[]");const rows=await db.getAllAsync("SELECT * FROM standalone_reminders_v1 ORDER BY id");return tokenFor(JSON.stringify(rows));}),
    restoreV4:(incoming:EngSnapshot,reminders:ReminderBackupSection,conflict:DraftConflict,expectedToken:string,expectedReminderToken?:string)=>serial(async()=>{
      if(conflict==="cancel")return loaded();
      await init();
      const raw=await rawPrimary();
      if(expectedToken!==await tokenFor(raw))throw restoreChanged();
      const next=validateEngSnapshot(incoming);
      await verifyEngSnapshot(next,files);
      const current=await read(db);
      if(current.draft&&conflict==="keep"){
        if(next.data.memories.some(m=>m.id===current.draft!.memoryId))throw Error("Draft identity conflicts with incoming memory");
        next.draft=clone(current.draft);
        if(next.draft.spaceId&&!next.data.spaces.some(s=>s.id===next.draft!.spaceId)){
          const space=current.data.spaces.find(s=>s.id===next.draft!.spaceId);
          if(!space)throw Error("Missing draft Space");next.data.spaces.push(space);
        }
        for(const id of next.draft.categoryIds)if(!next.data.categories.some(c=>c.id===id)){
          const category=current.data.categories.find(c=>c.id===id);
          if(!category)throw Error("Missing draft category");next.data.categories.push(category);
        }
        delete next.attempts[next.draft.attempt];
      }
      next.revision=current.revision+1;
      const valid=validateEngSnapshot(next);
      await verifyEngSnapshot(valid,files);
      const oldBytes=JSON.stringify(current),newBytes=JSON.stringify(valid);
      const checkedReminders=validateReminderBackupSection(reminders);
      const reminderTable=await db.getFirstAsync("SELECT name FROM sqlite_master WHERE name='standalone_reminders_v1'");
      const reminderRows=reminderTable?await db.getAllAsync("SELECT * FROM standalone_reminders_v1 ORDER BY id"):[];
      await files.capacity(fullRestoreCapacity(oldBytes,newBytes,JSON.stringify(reminderRows),JSON.stringify(checkedReminders)));
      await options.fault?.("before-v4-transaction");
      await db.withExclusiveTransactionAsync(async tx=>{
        await tx.runAsync("CREATE TABLE IF NOT EXISTS standalone_reminders_v1 (id TEXT PRIMARY KEY,title TEXT NOT NULL,notes TEXT NOT NULL,due_date TEXT NOT NULL,completed INTEGER NOT NULL DEFAULT 0,created_at TEXT NOT NULL,updated_at TEXT NOT NULL,due_time TEXT NOT NULL DEFAULT '09:00',anchor_day INTEGER NOT NULL DEFAULT 0,repeat TEXT NOT NULL DEFAULT 'once')");
        const reviewedReminderRows=await tx.getAllAsync("SELECT * FROM standalone_reminders_v1 ORDER BY id");
        if(expectedReminderToken&&expectedReminderToken!==await tokenFor(JSON.stringify(reviewedReminderRows)))throw Error("Standalone reminders changed since backup review. Review again; no data changed.");
        const columns=await tx.getAllAsync<{name:string}>("PRAGMA table_info(standalone_reminders_v1)");
        for(const [column,definition] of [["due_time","TEXT NOT NULL DEFAULT '09:00'"],["anchor_day","INTEGER NOT NULL DEFAULT 0"],["repeat","TEXT NOT NULL DEFAULT 'once'"],["memory_id","TEXT"]] as const){if(!columns.some(c=>c.name===column))await tx.runAsync(`ALTER TABLE standalone_reminders_v1 ADD COLUMN ${column} ${definition}`);}
        const row=await tx.getFirstAsync<{payload:string}>("SELECT payload FROM eng_state_v2 WHERE slot=1");
        if((row?.payload??null)!==raw)throw restoreChanged();
        await tx.runAsync("INSERT OR REPLACE INTO eng_recovery_v2(slot,payload) VALUES(1,?)",oldBytes);
        await tx.runAsync("CREATE TABLE IF NOT EXISTS eng_reminder_recovery_v4 (slot INTEGER PRIMARY KEY CHECK(slot=1),payload TEXT NOT NULL)");
        const prior=await tx.getAllAsync<{id:string;title:string;notes:string;due_date:string;due_time:string;repeat:string;anchor_day:number;completed:number;created_at:string;updated_at:string}>("SELECT * FROM standalone_reminders_v1 ORDER BY id");

        const saved={version:1 as const,rows:prior.map(r=>({id:r.id,title:r.title,notes:r.notes,dueDate:r.due_date,dueTime:r.due_time,repeat:r.repeat as ReminderBackupSection['rows'][number]['repeat'],anchorDay:r.anchor_day||Number(r.due_date.slice(-2)),completed:r.completed===1,createdAt:r.created_at,updatedAt:r.updated_at}))};
        await tx.runAsync("INSERT OR REPLACE INTO eng_reminder_recovery_v4(slot,payload) VALUES(1,?)",JSON.stringify(saved));
        await files.capacity(fullRestoreCapacity(oldBytes,newBytes,JSON.stringify(prior),JSON.stringify(checkedReminders)));
        await replaceReminderRowsInTransaction(tx,checkedReminders);
        await options.fault?.("after-v4-reminder-write");
        await tx.runAsync("UPDATE eng_state_v2 SET payload=? WHERE slot=1",newBytes);
        await options.fault?.("after-v4-eng-write");
      });
      verifiedRevision=valid.revision;
      return valid;
    }),    hasV4Recovery:()=>serial(async()=>{await init();const table=await db.getFirstAsync<{name:string}>("SELECT name FROM sqlite_master WHERE type='table' AND name='eng_reminder_recovery_v4'");if(!table)return false;return !!await db.getFirstAsync("SELECT payload FROM eng_reminder_recovery_v4 WHERE slot=1");}),
    recoverV4:()=>serial(async()=>{
      await init();
      const current=await loaded();
      const table=await db.getFirstAsync<{name:string}>("SELECT name FROM sqlite_master WHERE type='table' AND name='eng_reminder_recovery_v4'");
      if(!table)throw Error("No previous Full v4 state available; current data kept");
      const previous=await db.getFirstAsync<{payload:string}>("SELECT payload FROM eng_recovery_v2 WHERE slot=1");
      const reminders=await db.getFirstAsync<{payload:string}>("SELECT payload FROM eng_reminder_recovery_v4 WHERE slot=1");
      if(!previous||!reminders)throw Error("No previous Full v4 state available; current data kept");
      const target=validateEngSnapshot(JSON.parse(previous.payload));target.revision=current.revision+1;
      await verifyEngSnapshot(target,files);
      const checked=validateReminderBackupSection(JSON.parse(reminders.payload));
      const reminderRows=await db.getAllAsync("SELECT * FROM standalone_reminders_v1 ORDER BY id");
      await files.capacity(fullRestoreCapacity(JSON.stringify(current),JSON.stringify(target),JSON.stringify(reminderRows),JSON.stringify(checked)));
      await db.withExclusiveTransactionAsync(async tx=>{
        const row=await tx.getFirstAsync<{payload:string}>("SELECT payload FROM eng_state_v2 WHERE slot=1");
        if(row?.payload!==JSON.stringify(current))throw restoreChanged();
        const prior=await tx.getAllAsync<{id:string;title:string;notes:string;due_date:string;due_time:string;repeat:string;anchor_day:number;completed:number;created_at:string;updated_at:string}>("SELECT * FROM standalone_reminders_v1 ORDER BY id");

        const saved={version:1 as const,rows:prior.map(r=>({id:r.id,title:r.title,notes:r.notes,dueDate:r.due_date,dueTime:r.due_time,repeat:r.repeat as ReminderBackupSection['rows'][number]['repeat'],anchorDay:r.anchor_day||Number(r.due_date.slice(-2)),completed:r.completed===1,createdAt:r.created_at,updatedAt:r.updated_at}))};
        await files.capacity(fullRestoreCapacity(JSON.stringify(current),JSON.stringify(target),JSON.stringify(prior),JSON.stringify(checked)));
        await tx.runAsync("UPDATE eng_reminder_recovery_v4 SET payload=? WHERE slot=1",JSON.stringify(saved));
        await replaceReminderRowsInTransaction(tx,checked);
        await tx.runAsync("UPDATE eng_recovery_v2 SET payload=? WHERE slot=1",JSON.stringify(current));
        await tx.runAsync("UPDATE eng_state_v2 SET payload=? WHERE slot=1",JSON.stringify(target));
      });
      verifiedRevision=target.revision;return target;
    }),
    recover:()=>serial(async()=>{
      await init();const raw=await rawPrimary(),row=await db.getFirstAsync<{payload:string}>("SELECT payload FROM eng_recovery_v2 WHERE slot=1");
      if(!row)throw Error("No previous full save available");
      const target=validateEngSnapshot(JSON.parse(row.payload));let before:EngSnapshot;
      try{before=validateEngSnapshot(JSON.parse(raw??""));}catch{return repair(raw,target);}
      return commit(before,target);
    }),
    audit:()=>serial(async()=>{
      await init();const s=await read(db);
      const damaged=await db.getFirstAsync<{n:number}>("SELECT COUNT(*) AS n FROM eng_damaged_v2");
      if(damaged?.n)throw Error("Recovered damaged snapshots are retained. Their photo ownership needs review; no files have been removed.");
      const recovery=await db.getFirstAsync<{payload:string}>("SELECT payload FROM eng_recovery_v2 WHERE slot=1");
      const owners=[...allEngMedia(s).map(e=>({owner:s.draft?.photos.some(p=>p.id===e.id)?"draft":s.data.memories.find(m=>m.id===e.cardId)?.lifecycle??"unknown",entry:e})),
        ...(recovery?allEngMedia(validateEngSnapshot(JSON.parse(recovery.payload))).map(entry=>({owner:"recovery",entry})):[])];
      const legacyTable=await db.getFirstAsync("SELECT name FROM sqlite_master WHERE type='table' AND name='media_v2'");
      if(legacyTable){
        const rows=await db.getAllAsync<{id:string;card_id:string;relative_path:string;mime:MediaEntry["mime"];byte_count:number;sha256:string}>("SELECT id,card_id,relative_path,mime,byte_count,sha256 FROM media_v2 ORDER BY id");
        for(const r of rows)owners.push({owner:"legacy-v1",entry:{id:r.id,cardId:r.card_id,path:r.relative_path,mime:r.mime,bytes:r.byte_count,sha256:r.sha256}});
      }
      const metaTable=await db.getFirstAsync("SELECT name FROM sqlite_master WHERE type='table' AND name='metadata'");
      if(metaTable){
        const oldRecovery=await db.getFirstAsync<{value:string}>("SELECT value FROM metadata WHERE key='recovery_media_v2'");
        if(oldRecovery){
          const media=JSON.parse(oldRecovery.value);
          const validated=validateMediaManifest(media,media.media.map((e:MediaEntry)=>e.cardId));
          for(const entry of validated.media)owners.push({owner:"legacy-recovery",entry});
        }
      }
      const journal=await db.getAllAsync<{payload:string;phase:string}>("SELECT payload,phase FROM eng_media_ops_v2 ORDER BY id");
      for(const row of journal)owners.push({owner:"journal:"+row.phase,entry:JSON.parse(row.payload)});
      const results=[];
      for(const owner of owners){
        try{await verifyMediaBytes(owner.entry,await files.read(owner.entry.path),files.hash);results.push({...owner,verdict:"verified"});}
        catch(e){results.push({...owner,verdict:e instanceof Error?e.message:"unreadable"});}
      }
      return results;
    }),
  };
}
export function legacyEngSnapshot(raw:string,manifest?:unknown):EngSnapshot {
  return {version:3,revision:0,data:fromLegacyV1(raw,manifest),draft:null,attempts:{}};
}
