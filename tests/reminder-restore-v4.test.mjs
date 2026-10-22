import test from 'node:test';
import assert from 'node:assert/strict';
import {replaceReminderRowsInTransaction} from '../src/reminder-restore-v4.ts';
const row={id:'r_test_123',title:'Fixture',notes:'',dueDate:'2026-10-19',dueTime:'09:00',repeat:'once',anchorDay:19,completed:false,createdAt:'2026-10-19T00:00:00Z',updatedAt:'2026-10-19T00:00:00Z'};
test('replace validates entire section before issuing SQL',async()=>{
 const statements=[];const tx={runAsync:async(sql,...args)=>statements.push({sql,args})};
 await assert.rejects(replaceReminderRowsInTransaction(tx,{version:1,rows:[row,{...row}]}),/duplicate/);
 assert.equal(statements.length,0);
});
test('replacement is transaction-owned and retains full reminder fields',async()=>{
 const statements=[];const tx={runAsync:async(sql,...args)=>{statements.push({sql,args});}};
 assert.equal(await replaceReminderRowsInTransaction(tx,{version:1,rows:[row]}),1);
 assert.match(statements[0].sql,/DELETE FROM standalone_reminders_v1/);
 assert.match(statements[1].sql,/INSERT INTO standalone_reminders_v1/);
 assert.deepEqual(statements[1].args,[row.id,row.title,row.notes,row.dueDate,row.dueTime,row.repeat,row.anchorDay,0,row.createdAt,row.updatedAt]);
});
test('SQL failure propagates to owning transaction',async()=>{
 const tx={runAsync:async(sql)=>{if(sql.startsWith('INSERT'))throw Error('injected SQL failure');}};
 await assert.rejects(replaceReminderRowsInTransaction(tx,{version:1,rows:[row]}),/injected SQL failure/);
});
