import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {DatabaseSync} from 'node:sqlite';
import {join} from 'node:path';
const w=process.cwd(),[file,root]=process.argv.slice(2);
const {openEngStreamV4}=await import(w+'/src/eng-stream-v4.ts');
const hash=async bytes=>createHash('sha256').update(bytes).digest('hex');
const bytes=fs.readFileSync(file);
const a=await openEngStreamV4({size:bytes.length,read:async(o,n)=>bytes.subarray(o,o+n)},hash);
const data=a.snapshot.data;
for(const photo of data.media.media) assert.equal(await hash(await a.read(photo.path)),photo.sha256);
console.log('Verified archive', data.memories.length,'memories',data.media.media.length,'photos');
if(root){
 const db=new DatabaseSync(join(root,'Documents/SQLite/casitadex-development-v1.db'),{readOnly:true});
 const actual=JSON.parse(db.prepare('select payload from eng_state_v2 where slot=1').get().payload);
 assert.deepEqual(actual.data,data);
 for(const entry of data.media.media)assert.equal(await hash(fs.readFileSync(join(root,'Documents/casitadex-media-v2',entry.path))),entry.sha256);
 console.log('Recovered snapshot and all photo hashes match archive');
}
