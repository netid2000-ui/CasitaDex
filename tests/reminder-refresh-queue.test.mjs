import test from "node:test";
import assert from "node:assert/strict";
import {createLatestReminderRefresh} from "../src/reminder-refresh-queue.ts";
test("later queued refresh reads current reminder rows instead of rearming deleted row",async()=>{
 let rows=["qa-old"],release,started;
 const entered=new Promise(resolve=>started=resolve);
 const pause=new Promise(resolve=>release=resolve);
 const snapshots=[];
 const refresh=createLatestReminderRefresh(async()=>[...rows],async snapshot=>{snapshots.push(snapshot);if(snapshots.length===1){started();await pause;}return snapshot;});
 const first=refresh();
 await entered;
 const later=refresh();rows=[];
 release();
 await first;await later;
 assert.deepEqual(snapshots,[["qa-old"],[]]);
});

test("a failed state read cannot block the next requested reconciliation",async()=>{
 let attempt=0;
 const refresh=createLatestReminderRefresh(async()=>{if(++attempt===1)throw Error("synthetic read failure");return ["current"];},async snapshot=>snapshot);
 await assert.rejects(refresh(),/synthetic read failure/);
 assert.deepEqual(await refresh(),["current"]);
});
