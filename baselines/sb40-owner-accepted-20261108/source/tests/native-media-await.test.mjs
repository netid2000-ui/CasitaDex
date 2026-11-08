import test from 'node:test';
import assert from 'node:assert/strict';
import {registerHooks} from 'node:module';
const files=new Map();let releaseMove;
const uri=parts=>parts.map(p=>typeof p==='string'?p:p.uri).join('/');
class Directory{constructor(...parts){this.uri=uri(parts);}create(){}}
class File{
 constructor(...parts){this.uri=uri(parts);}
 get exists(){return files.has(this.uri);}
 create(){if(this.exists)throw Error('exists');files.set(this.uri,new Uint8Array());}
 write(b){files.set(this.uri,b.slice());}
 async bytes(){if(!this.exists)throw Error('missing');return files.get(this.uri).slice();}
 delete(){files.delete(this.uri);}
 async move(destination){await new Promise(resolve=>{releaseMove=resolve;});files.set(destination.uri,files.get(this.uri));files.delete(this.uri);this.uri=destination.uri;}
}
test('native media promotion waits for Expo asynchronous move before acknowledging private ownership',async()=>{
 globalThis.__engFileFixture={Directory,File,Paths:{document:'private:'}};
 const hook=registerHooks({resolve(specifier,context,next){if(specifier==='expo-file-system')return {url:'data:text/javascript,export const {Directory,File,Paths}=globalThis.__engFileFixture',shortCircuit:true};return next(specifier,context);}});
 try{
  const {createNativeMediaStore}=await import('../src/media-store.native.ts');const store=createNativeMediaStore();
  const bytes=Uint8Array.from([137,80,78,71,13,10,26,10]);await store.writeTemporary('pending_photo',bytes);
  let done=false;const promoting=store.promote('pending_photo','media/pending_photo.png').then(()=>{done=true;});await new Promise(resolve=>setImmediate(resolve));
  assert.equal(done,false,'An unresolved native move must not acknowledge promotion');
  assert.ok([...files.keys()].some(k=>k.endsWith('/staging/pending_photo.tmp')));releaseMove();await promoting;
  assert.equal(done,true);assert.deepEqual(files.get('private:/casitadex-media-v2/media/pending_photo.png'),bytes);
 }finally{hook.deregister();delete globalThis.__engFileFixture;}
});
