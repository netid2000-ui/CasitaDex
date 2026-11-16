import test from 'node:test';
import assert from 'node:assert/strict';
import {reminderNotificationDestination as destination} from '../src/reminder-notification-destination.ts';
test('standalone notification opens its exact saved reminder',()=>{
 assert.deepEqual(destination({id:'reminder-123',memoryId:null}),{pathname:'/reminders-manage',params:{id:'reminder-123'}});
});
test('linked notification opens the current saved memory association',()=>{
 assert.deepEqual(destination({id:'reminder-123',memoryId:'memory-current'},'memory-old'),{pathname:'/card',params:{id:'memory-current'}});
});
test('missing reminder retains the linked notification memory fallback',()=>{
 assert.deepEqual(destination(undefined,'memory-123'),{pathname:'/card',params:{id:'memory-123'}});
});
test('deleted standalone reminder safely opens the reminder list',()=>{
 assert.equal(destination(undefined),'/reminders');
});
