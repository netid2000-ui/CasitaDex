import test from 'node:test';
import assert from 'node:assert/strict';
import {reminderPickerDisplay} from '../src/reminder-picker-layout.ts';
test('calendar yields to wheels when narrow or either enlarged-text setting is active',()=>{
 assert.equal(reminderPickerDisplay('date',402,1,false),'inline');
 for (const [width,scale,large] of [[320,1,false],[389,1,false],[402,1.35,false],[402,2,false],[1024,2,false],[402,1,true]]) assert.equal(reminderPickerDisplay('date',width,scale,large),'spinner');
});
test('time wheels remain available at all supported sizes',()=>{
 for(const width of [320,402,1024])for(const scale of [1,2])assert.equal(reminderPickerDisplay('time',width,scale,false),'spinner');
});
