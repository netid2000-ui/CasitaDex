import {test} from "node:test";
import assert from "node:assert/strict";
import {validateReminderBackupSection,encodeReminderBackupSection,decodeReminderBackupSection,preflightReminderRestore} from "../src/reminder-backup-v4.ts";
const row={id:"r_abc_123",title:"Water plants",notes:"",dueDate:"2027-01-31",dueTime:"09:00",repeat:"monthly",anchorDay:31,completed:false,createdAt:"2026-10-19T12:00:00.000Z",updatedAt:"2026-10-19T12:00:00.000Z"};
test("valid standalone reminder backup section",()=>{assert.equal(validateReminderBackupSection({version:1,rows:[row]}).rows[0].anchorDay,31);});
test("reject malformed or duplicate reminder records",()=>{
 for(const bad of [{version:1,rows:[row,row]},{version:2,rows:[row]},{version:1,rows:[{...row,dueDate:"2027-02-29"}]},{version:1,rows:[{...row,anchorDay:0}]},{version:1,rows:[{...row,dueTime:"25:00"}]}])assert.throws(()=>validateReminderBackupSection(bad));
});

test('reminder section binary round trip and corruption rejection',()=>{
 const bytes=encodeReminderBackupSection({version:1,rows:[row]});
 assert.deepEqual(decodeReminderBackupSection(bytes).rows[0],row);
 assert.throws(()=>decodeReminderBackupSection(new Uint8Array([255,254])));
 assert.throws(()=>decodeReminderBackupSection(new Uint8Array(5_000_001)));
});

test('restore preflight reports collisions and never mutates records',()=>{
 const existing={version:1,rows:[row]},incoming={version:1,rows:[{...row,title:'Changed'}]};
 const before=JSON.stringify(existing);
 assert.deepEqual(preflightReminderRestore(incoming,existing),{incoming:1,existing:1,collisions:[row.id],requiresExplicitReplacement:true});
 assert.equal(JSON.stringify(existing),before);
});
