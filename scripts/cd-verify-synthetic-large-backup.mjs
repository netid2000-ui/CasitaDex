import {open,stat} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {createReadStream} from 'node:fs';
import {openEngStreamCompatible} from '../src/eng-stream-v4.ts';
const path=process.argv[2];
if(!path)throw Error('Usage: node scripts/cd-verify-synthetic-large-backup.mjs archive.cdxe');
const size=(await stat(path)).size,file=await open(path,'r'),hash=async b=>createHash('sha256').update(b).digest('hex'),archiveHash=createHash('sha256');
try{
 const opened=await openEngStreamCompatible({size,read:async(o,n)=>{const b=Buffer.alloc(n);const r=await file.read(b,0,n,o);return b.subarray(0,r.bytesRead);}},hash);
 let verified=0;
 for(const photo of opened.snapshot.data.media.media){if(await hash(await opened.read(photo.path))!==photo.sha256)throw Error('Original photo mismatch');verified++;}
 for await(const chunk of createReadStream(path))archiveHash.update(chunk);
 if(size<150_000_000||opened.snapshot.data.memories.length!==100||verified!==17||opened.reminders.rows.length!==1||opened.reminders.rows[0].memoryId!=='scale_001')throw Error('Synthetic scale fixture mismatch');
 console.log(JSON.stringify({size,source:opened.source,archiveSha:archiveHash.digest('hex'),memories:100,originalsVerified:verified,linkedReminders:1,linkedMemory:'scale_001'}));
}finally{await file.close();}
