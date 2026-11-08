import test from "node:test";
import assert from "node:assert/strict";
import { examples,empty } from "../src/model.ts";
import { fromLegacyV1, validateV2, previewLegacyV1 } from "../src/sb20-contract.ts";
const copy = x => structuredClone(x);
const legacy = () => examples();
const migrated = () => fromLegacyV1(JSON.stringify(legacy()));
const photo = (id="photo-1",cardId="p1")=>({id,cardId,path:`media/${id}.jpg`,
  mime:"image/jpeg",bytes:5,sha256:"a".repeat(64)});
test("empty legacy import preserves default Space and creates no fabricated records",()=>{
  const v=fromLegacyV1(JSON.stringify(empty()));assert.equal(v.memories.length,0);
  assert.equal(v.spaces[0].id,"home");assert.deepEqual(v.categories,[]);
  assert.equal(v.version,2);assert.deepEqual(validateV2(v),v);
});
test("legacy records preserve exact metadata and Context as compatibility field",()=>{
  const before=legacy(),after=migrated();
  for(let i=0;i<before.cards.length;i++){
    const c=before.cards[i],m=after.memories[i];
    for(const key of ["id","title","answer","location","notes","source","confidence","due","verifiedAt","history"]){
      assert.deepEqual(m[key],c[key],key);
    }
    assert.equal(m.legacyContext,c.context);assert.equal(m.spaceId,c.spaceId);
    assert.equal(m.lifecycle,"active");assert.equal(m.deletedAt,undefined);
  }
  assert.equal(previewLegacyV1(JSON.stringify(before)).memories,before.cards.length);
});
test("new photo-only memory needs independently verified media hash bytes",()=>{
  const v=fromLegacyV1(JSON.stringify(empty()));
  v.memories.push({id:"p1",title:"Water heater",answer:"",spaceId:null,categoryIds:[],
    legacyContext:null,location:"",notes:"",confidence:"Unknown",source:"",
    history:[],lifecycle:"active",mediaIds:["photo-1"]});
  v.media.media.push(photo());
  assert.throws(()=>validateV2(v),/requires written answer or verified durable photo/);
  assert.equal(validateV2(v,["photo-1"]).memories[0].answer,"");
});
test("cannot save title alone, placeholder does not get inserted",()=>{
  const v=fromLegacyV1(JSON.stringify(empty()));
  v.memories.push({id:"p1",title:"Water heater",answer:"",spaceId:null,categoryIds:[],
    legacyContext:null,location:"",notes:"",confidence:"Unknown",source:"",
    history:[],lifecycle:"active",mediaIds:[]});
  assert.throws(()=>validateV2(v),/requires written answer/);
});
test("custom labels, archived, deletion metadata, due and verification gates",()=>{
  const v=migrated();v.categories.push({id:"equipment",name:"Equipment"});
  v.memories[0].categoryIds=["equipment"];v.memories[0].lifecycle="archived";
  assert.equal(validateV2(v).memories[0].lifecycle,"archived");
  v.memories[0].lifecycle="recently_deleted";
  assert.throws(()=>validateV2(v),/deletion state/);
  v.memories[0].deletedAt="2026-10-17";
  assert.equal(validateV2(v).memories[0].deletedAt,"2026-10-17");
  v.memories[0].spaceId="missing";assert.throws(()=>validateV2(v),/invalid memory/);
});
test("unsupported version, unknown field, lost media parent and duplicates fail closed",()=>{
  const v=migrated();const future=copy(v);future.version=3;
  assert.throws(()=>validateV2(future),/unsupported version/);
  const unknown=copy(v);unknown.memories[0].untracked="data";
  assert.throws(()=>validateV2(unknown),/unknown memory field/);
  const duplicate=copy(v);duplicate.memories.push(copy(duplicate.memories[0]));
  assert.throws(()=>validateV2(duplicate),/duplicate memory ID/);
  const orphan=copy(v);orphan.media.media.push(photo("ghost","absent"));
  assert.throws(()=>validateV2(orphan),/Missing media card reference/);
});
test("v1 future versions and damaged inputs cannot be silently coerced",()=>{
  const v=legacy();v.version=2;assert.throws(()=>fromLegacyV1(JSON.stringify(v)));
  assert.throws(()=>fromLegacyV1("{truncated"),SyntaxError);
});
test("synthetic transformations never mutate input source",()=>{
  const initial=legacy(),before=JSON.stringify(initial);
  fromLegacyV1(before);assert.equal(JSON.stringify(initial),before);
});
test("legacy demo marker is preserved rather than dropped",()=>{
  const old=legacy();old.cards[0].demo=true;
  const next=fromLegacyV1(JSON.stringify(old));
  assert.equal(next.memories[0].demo,true);
  assert.equal(validateV2(next).memories[0].demo,true);
});
