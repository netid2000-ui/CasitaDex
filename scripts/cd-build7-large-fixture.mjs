import { open } from 'node:fs/promises';
import { createHash, randomFillSync } from 'node:crypto';
import { crc32, deflateSync } from 'node:zlib';
import { empty } from '../src/model.ts';
import { legacyEngSnapshot } from '../src/eng-store.ts';
import { writeEngStreamV4, openEngStreamCompatible } from '../src/eng-stream-v4.ts';
const [output]=process.argv.slice(2);
if(!output)throw Error('Usage: node scripts/cd-build7-large-fixture.mjs output.cdxe');
const hash=async b=>createHash('sha256').update(b).digest('hex');
function chunk(type,data){const t=Buffer.from(type),l=Buffer.alloc(4),c=Buffer.alloc(4);l.writeUInt32BE(data.length);c.writeUInt32BE(crc32(Buffer.concat([t,data])));return Buffer.concat([l,t,data,c]);}
const width=1800,height=1750,raw=Buffer.alloc((width*3+1)*height);
randomFillSync(raw);
for(let row=0;row<height;row++)raw[row*(width*3+1)]=0;
const ihdr=Buffer.alloc(13);ihdr.writeUInt32BE(width);ihdr.writeUInt32BE(height,4);ihdr[8]=8;ihdr[9]=2;
const photo=Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',ihdr),chunk('IDAT',deflateSync(raw,{level:0})),chunk('IEND',Buffer.alloc(0))]);
if(photo.length>10_000_000)throw Error('Photo exceeds 10 MB');
const sha256=await hash(photo),data=empty(),media=[];
for(let i=1;i<=100;i++){
 const n=String(i).padStart(3,'0'),id='scale_'+n;
 data.cards.push({id,spaceId:'home',title:'QA Scale Item '+n,answer:'Synthetic home inventory '+n,location:'QA Room',notes:'Synthetic only',context:'Maintain',confidence:'Unknown',source:'QA',history:[]});
 if(i<=17)media.push({id:'scale_photo_'+n,cardId:id,path:'media/scale_photo_'+n+'.png',mime:'image/png',bytes:photo.length,sha256});
}
const snapshot=legacyEngSnapshot(JSON.stringify(data),{version:2,media});
const reminders={version:1,rows:[{id:'r_qa_scale',title:'QA Scale Linked Reminder',notes:'Synthetic only',memoryId:'scale_001',dueDate:'2026-12-01',dueTime:'09:00',repeat:'once',anchorDay:1,completed:false,createdAt:'2026-11-26T12:00:00Z',updatedAt:'2026-11-26T12:00:00Z'}]};
const file=await open(output,'wx+');let at=0;const archiveHash=createHash('sha256');
try{
 await writeEngStreamV4(snapshot,reminders,async()=>photo,hash,{write:async b=>{archiveHash.update(b);let n=0;while(n<b.length){const r=await file.write(b,n,b.length-n,at+n);if(!r.bytesWritten)throw Error('write failure');n+=r.bytesWritten;}at+=b.length;}});
 const verified=await openEngStreamCompatible({size:at,read:async(o,n)=>{const b=Buffer.alloc(n);const r=await file.read(b,0,n,o);return b.subarray(0,r.bytesRead);}},hash);
 if(at<150_000_000||verified.snapshot.data.memories.length!==100||verified.snapshot.data.media.media.length!==17||await hash(await verified.read('media/scale_photo_017.png'))!==sha256)throw Error('fixture mismatch');
 console.log(JSON.stringify({bytes:at,sha256:archiveHash.digest('hex'),memories:100,photos:17,photoBytes:photo.length,photoSha:sha256,linkedReminders:1}));
}finally{await file.close();}
