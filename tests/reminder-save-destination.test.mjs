import test from 'node:test';import assert from 'node:assert/strict';
import {savedReminderDestination} from '../src/reminder-save-destination.ts';
test('linked reminder save returns to the exact originating memory, including Home origin',()=>{
 for(const origin of [undefined,'home'])assert.deepEqual(savedReminderDestination('memory-123',origin),{pathname:'/card',params:{id:'memory-123'}});
});
test('unlinked reminder saves retain Home or Reminders context',()=>{
 assert.equal(savedReminderDestination(undefined,'home'),'/');assert.equal(savedReminderDestination(),'/reminders');
});
