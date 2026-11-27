import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {empty} from '../src/model.ts';
import {legacyEngSnapshot,validateEngSnapshot} from '../src/eng-store.ts';
import {writeEngStreamV4,openEngStreamCompatible} from '../src/eng-stream-v4.ts';
const [photoPath,out]=process.argv.slice(2);if(!photoPath||!out)throw Error('Usage: node scripts/cd-build6-fixture.mjs synthetic.png output.cdxe');
const photo=new Uint8Array(await readFile(photoPath));
const hash=async b=>createHash('sha256').update(b).digest('hex');
const data=empty();for(let i=1;i<=21;i++){const n=String(i).padStart(2,'0');data.cards.push({id:'qa_slot_'+n,spaceId:'home',title:i===21?'QA Deleted Photo':'QA Slot '+n,answer:'Synthetic household fixture '+n,location:'QA Room',notes:'Synthetic only',context:'Maintain',confidence:'Unknown',source:'QA',history:[]});}
const snapshot=legacyEngSnapshot(JSON.stringify(data),{version:2,media:[{id:'qa_deleted_photo',cardId:'qa_slot_21',path:'media/qa_deleted_photo.png',mime:'image/png',bytes:photo.length,sha256:await hash(photo)}]});
const deleted=snapshot.data.memories.find(m=>m.id==='qa_slot_21');deleted.lifecycle='recently_deleted';deleted.deletedAt='2026-11-26';deleted.deletedInstant='2026-11-26T12:00:00.000Z';
const reminders={version:1,rows:[{id:'r_qa_linked_reminder',title:'QA Linked Filter',notes:'Synthetic only',memoryId:'qa_slot_01',dueDate:'2026-12-01',dueTime:'09:00',repeat:'once',anchorDay:1,completed:false,createdAt:'2026-11-26T12:00:00Z',updatedAt:'2026-11-26T12:00:00Z'}]};
const chunks=[];await writeEngStreamV4(validateEngSnapshot(snapshot),reminders,async()=>photo,hash,{write:async b=>chunks.push(Buffer.from(b))});const bytes=Buffer.concat(chunks);
const verified=await openEngStreamCompatible({size:bytes.length,read:async(o,n)=>bytes.subarray(o,o+n)},hash);
if(verified.snapshot.data.memories.length!==21||verified.reminders.rows[0].memoryId!=='qa_slot_01')throw Error('Fixture mismatch');
await writeFile(out,bytes,{flag:'wx'});console.log(JSON.stringify({bytes:bytes.length,sha256:await hash(bytes),active:20,deleted:1,photos:1,linked:1}));
