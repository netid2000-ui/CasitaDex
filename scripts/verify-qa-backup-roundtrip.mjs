import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {DatabaseSync} from 'node:sqlite';
import {decodeEngBackup} from '../src/eng-backup.ts';import {createEngStore,legacyEngSnapshot,allEngMedia} from '../src/eng-store.ts';import {empty} from '../src/model.ts';
const [expectedPath,actualPath,proofPath]=process.argv.slice(2);if(!proofPath)throw Error('Expected backup, actual exported backup and proof JSON paths required');
const hash=async b=>createHash('sha256').update(b).digest('hex');
const expected=await decodeEngBackup(new Uint8Array(fs.readFileSync(expectedPath)),hash),actual=await decodeEngBackup(new Uint8Array(fs.readFileSync(actualPath)),hash);
for(const key of ['data','draft','attempts'])assert.deepEqual(actual.snapshot[key],expected.snapshot[key],key+' differs');
const root=fs.mkdtempSync('/home/fa-dev/projects/casitadex-independent-acceptance-');
const resolve=p=>{assert.match(p,/^media\/[A-Za-z0-9_-]+\.(png|jpg|webp)$/);return path.join(root,p);};
function open(){
 const raw=new DatabaseSync(path.join(root,'restore.sqlite'));
 const db={execAsync:async q=>raw.exec(q),runAsync:async(q,...p)=>raw.prepare(q).run(...p),getFirstAsync:async(q,...p)=>raw.prepare(q).get(...p)??null,getAllAsync:async(q,...p)=>raw.prepare(q).all(...p),withExclusiveTransactionAsync:async f=>{raw.exec('BEGIN IMMEDIATE');try{await f(db);raw.exec('COMMIT')}catch(e){raw.exec('ROLLBACK');throw e}}};
 const files={hash,read:async p=>new Uint8Array(fs.readFileSync(resolve(p))),put:async(e,b)=>{fs.mkdirSync(path.dirname(resolve(e.path)),{recursive:true});fs.writeFileSync(resolve(e.path),b,{flag:'wx'})},capacity:async n=>{const s=fs.statfsSync(root);if(s.bavail*s.bsize<n)throw Error('Insufficient proof-disk capacity')}};
 return {raw,files,store:createEngStore(db,files,async()=>legacyEngSnapshot(JSON.stringify(empty())))};
}
let target=open();const token=await target.store.restoreToken();await target.store.stageRestore(actual.snapshot,actual.read,token);await target.store.restore(actual.snapshot,'incoming',token);target.raw.close();
target=open();const restored=await target.store.load();for(const key of ['data','draft','attempts'])assert.deepEqual(restored[key],expected.snapshot[key],key+' differs after SQLite reopen');
for(const e of allEngMedia(restored))assert.equal(await hash(await target.files.read(e.path)),e.sha256);target.raw.close();
const bytes=fs.readFileSync(actualPath),proof={result:'PASS',expected:path.basename(expectedPath),actual:path.basename(actualPath),actualBytes:bytes.length,actualSha256:await hash(bytes),data:'EXACT',draft:'EXACT',attempts:'EXACT',records:restored.data.memories.length,savedPhotos:restored.data.media.media.length,draftPhotos:restored.draft?.photos.length??0,independentFilesystemSQLiteReopen:'PASS',allPhotoHashes:'PASS',proofDirectory:root,revisionDifference:'Expected restore/checkpoint revision only'};
fs.mkdirSync(path.dirname(proofPath),{recursive:true});fs.writeFileSync(proofPath,JSON.stringify(proof,null,2));console.log(JSON.stringify(proof));
