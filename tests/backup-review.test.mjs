import test from 'node:test';
import assert from 'node:assert/strict';
import { emptyBackupReview, backupReviewReducer as reduce } from '../src/backup-review.ts';
const archive={source:'Full v4',snapshot:{revision:3},read:async()=>new Uint8Array(),reminders:{version:1,rows:[]}};
function selected(request={}){return reduce(reduce(emptyBackupReview(),{type:'begin',request}),{type:'selected',request,incoming:archive,restoreToken:'collection-3',reminderRestoreToken:'reminders-2'});}

test('choosing another archive immediately removes prior replacement authority even if new validation fails',()=>{
 let state=selected();state=reduce(state,{type:'draft',value:'keep'});
 assert.equal(state.incoming,archive);
 const request={};state=reduce(state,{type:'begin',request});
 assert.equal(state.incoming,null);assert.equal(state.restoreToken,null);assert.equal(state.reminderRestoreToken,null);assert.equal(state.conflict,null);
 assert.equal(state.confirmRecovery,false);assert.equal(state.textReview,null);
 // Rejection of the picker/validator does not dispatch selected; no previous archive remains confirmable.
 assert.equal(state.request,request);
});
test('Back and Cancel invalidate delayed picker results and cannot resurrect a reviewed archive',()=>{
 const request={};let state=reduce(emptyBackupReview(),{type:'begin',request});
 state=reduce(state,{type:'reset'});
 state=reduce(state,{type:'selected',request,incoming:archive,restoreToken:'old',reminderRestoreToken:'old'});
 assert.deepEqual(state,emptyBackupReview());
});
test('late first selection cannot replace a later reviewed backup',()=>{
 const first={},second={},newArchive={...archive,source:'replacement archive'};
 let state=reduce(emptyBackupReview(),{type:'begin',request:first});
 state=reduce(state,{type:'begin',request:second});
 state=reduce(state,{type:'selected',request:second,incoming:newArchive,restoreToken:'new',reminderRestoreToken:'new'});
 state=reduce(state,{type:'selected',request:first,incoming:archive,restoreToken:'old',reminderRestoreToken:'old'});
 assert.equal(state.incoming,newArchive);assert.equal(state.restoreToken,'new');
});
test('cancel, incomplete tokens and recovery review cannot retain a previous replacement confirmation',()=>{
 for(const action of [{type:'reset'},{type:'recovery'}]){
  const state=reduce(selected(),action);assert.equal(state.incoming,null);assert.equal(state.restoreToken,null);
 }
 for(const [incoming,token,reminderToken] of [[null,null,null],[archive,null,'x'],[archive,'x',null]]){
  const request={};const state=reduce(reduce(selected(),{type:'begin',request}),{type:'selected',request,incoming,restoreToken:token,reminderRestoreToken:reminderToken});
  assert.deepEqual(state,emptyBackupReview());
 }
});
test('limited text review also ignores asynchronous completion after leaving',()=>{
 const request={};let state=reduce(emptyBackupReview(),{type:'begin',request});state=reduce(state,{type:'reset'});
 assert.deepEqual(reduce(state,{type:'text',request,value:{snapshot:{revision:1},token:'old'}}),emptyBackupReview());
});
