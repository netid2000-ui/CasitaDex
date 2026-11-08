import fs from 'node:fs';import path from 'node:path';import {spawnSync} from 'node:child_process';import {createHash} from 'node:crypto';
import {household} from '../tests/household-fixture.mjs';import {newEngDraft} from '../src/eng-store.ts';import {encodeEngBackup,decodeEngBackup} from '../src/eng-backup.ts';
const out=process.argv[2];if(!out)throw Error('Explicit QA directory required');fs.mkdirSync(out,{recursive:true});
const image=path.join(out,'SYNTHETIC-large-photo.png');
const python=`import random,zlib,struct,sys
r=random.Random(20261019);w,h=2048,1536
raw=b''.join(b'\\0'+r.randbytes(w*3) for _ in range(h))
def chunk(k,d):return struct.pack('>I',len(d))+k+d+struct.pack('>I',zlib.crc32(k+d)&0xffffffff)
open(sys.argv[1],'wb').write(b'\\x89PNG\\r\\n\\x1a\\n'+chunk(b'IHDR',struct.pack('>IIBBBBB',w,h,8,2,0,0,0))+chunk(b'IDAT',zlib.compress(raw,1))+chunk(b'IEND',b''))
`;
const result=spawnSync('python3',['-c',python,image],{encoding:'utf8'});if(result.status!==0)throw Error(result.stderr);
const big=new Uint8Array(fs.readFileSync(image));if(big.length>10000000)throw Error('Synthetic photo exceeds supported import size');
const small=new Uint8Array(fs.readFileSync(new URL('../tests/fixtures/synthetic-equipment-label.png',import.meta.url))),f=await household(small);
try{let s=await f.store.load();const photo=s.data.memories.find(m=>!m.answer);
for(let i=0;i<4;i++)s=await f.store.addMemoryPhoto(photo.id,big);
s=await f.store.load();await f.store.discard(s.draft.id,s.draft.checkpoint);
const d={...newEngDraft(),checkpoint:1,title:'SYNTHETIC large-photo draft',notes:'Deterministic noise images for storage and recovery QA only.',spaceId:'rental',categoryIds:['cat_3'],due:'2026-12-'};
await f.store.checkpoint(d);for(let i=0;i<5;i++)await f.store.addPhoto(d.id,big);
const b=await f.store.backup(),raw=await encodeEngBackup(b.snapshot,b.read,b.hash),decoded=await decodeEngBackup(raw,b.hash);
const file='CasitaDex-synthetic-photo-stress.cdxe';fs.writeFileSync(path.join(out,file),raw);
const receipt={purpose:'SYNTHETIC LARGE-PHOTO ACCEPTANCE',file,bytes:raw.length,sha256:createHash('sha256').update(raw).digest('hex'),largePhotoBytes:big.length,records:decoded.snapshot.data.memories.length,savedPhotos:decoded.snapshot.data.media.media.length,draftPhotos:decoded.snapshot.draft.photos.length,independentDecode:'PASS'};
fs.writeFileSync(path.join(out,'stress-scenario-manifest.json'),JSON.stringify(receipt,null,2));console.log(JSON.stringify(receipt));}finally{f.close()}
