import test from 'node:test';
import assert from 'node:assert/strict';
import { createReminderResponseDrain, reminderResponseRoute } from '../src/reminder-response-routing.ts';

const response = (token='one', kind='standalone', sourceId='literal%20value') => ({token,kind,sourceId});
function fixture(rows=[response()]) {
 const navigations=[], acks=[];
 let guarded=false, failAck=false;
 const inbox={
  pendingResponse:async()=>rows[0]??null,
  acknowledgeResponse:async token=>{if(failAck){failAck=false;throw Error('retry');}acks.push(token);if(rows[0]?.token===token)rows.shift();},
 };
 const drain=createReminderResponseDrain(inbox, route=>{if(guarded)return false;navigations.push(route);return true;});
 return {rows,navigations,acks,drain,setGuard:value=>guarded=value,failAck:()=>failAck=true};
}
test('validated response routes protect identity for the installed router and distinguish linked/standalone',()=>{
 for(const id of ['r_one','hall light','café & filter','literal%20value','a/b?c#d']) {
  assert.deepEqual(reminderResponseRoute(response('one','standalone',id)),{pathname:'/reminders',params:{reminder:encodeURIComponent(id)}});
  assert.deepEqual(reminderResponseRoute(response('one','memory',id)),{pathname:'/card',params:{id:encodeURIComponent(id)}});
 }
 for(const input of [null,{},response('','memory','a'),response('x','unknown','a'),response('x','memory',''),response('x','memory','x\n'),response('x','memory','x'.repeat(513))]) assert.equal(reminderResponseRoute(input),null);
});
test('cold pending response opens once and is acknowledged; repeat wakeups do not reroute',async()=>{
 const x=fixture();await x.drain.refresh();await x.drain.refresh();
 assert.equal(x.navigations.length,1);assert.deepEqual(x.acks,['one']);
});
test('warm response and multiple queued taps drain in order',async()=>{
 const x=fixture([]);await x.drain.refresh();x.rows.push(response(),response('two','memory','filter'));
 await Promise.all([x.drain.refresh(),x.drain.refresh()]);
 assert.deepEqual(x.acks,['one','two']);assert.equal(x.navigations[1].params.id,'filter');
});
test('dirty or saving editor retains response until guard is clear',async()=>{
 const x=fixture();x.setGuard(true);await x.drain.refresh();
 assert.equal(x.navigations.length,0);assert.equal(x.rows.length,1);assert.equal(x.acks.length,0);
 x.setGuard(false);await x.drain.refresh();assert.equal(x.navigations.length,1);assert.equal(x.rows.length,0);
});
test('acknowledgement failure retries without opening the same response twice',async()=>{
 const x=fixture();x.failAck();await assert.rejects(x.drain.refresh(),/retry/);await x.drain.refresh();
 assert.equal(x.navigations.length,1);assert.deepEqual(x.acks,['one']);
});
test('unmount while reading leaves cold response available to next mount',async()=>{
 let resolve;const acks=[],routes=[];
 const drain=createReminderResponseDrain({pendingResponse:()=>new Promise(r=>resolve=r),acknowledgeResponse:async token=>acks.push(token)},route=>{routes.push(route);return true;});
 const pending=drain.refresh();drain.stop();resolve(response());await pending;
 assert.deepEqual(routes,[]);assert.deepEqual(acks,[]);
});
test('invalid native payload is discarded without selecting an unrelated record',async()=>{
 const x=fixture([response('bad','unexpected','other')]);await x.drain.refresh();
 assert.equal(x.navigations.length,0);assert.deepEqual(x.acks,['bad']);
});
