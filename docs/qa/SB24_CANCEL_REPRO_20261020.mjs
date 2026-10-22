import {setup,verified} from '../../tests/eng-fixture.mjs';
const f=setup();
try {
 const before=await f.store.load();
 await f.store.restoreV4(verified(),{version:1,rows:[]},'cancel',await f.store.restoreToken());
 const after=await f.store.load();
 console.log(JSON.stringify({scenario:'Full v4 cancellation',database:'disposable in-memory SQLite',beforeMemories:before.data.memories.length,afterMemories:after.data.memories.length,beforeRevision:before.revision,afterRevision:after.revision,unchanged:JSON.stringify(before)===JSON.stringify(after)}));
 if(JSON.stringify(before)!==JSON.stringify(after))process.exitCode=1;
} finally {f.close()}
