/** SB40 Edge web-shell boundary smoke: does NOT claim native storage or VoiceOver parity. */
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try {
  const results=[];
  for(const viewport of [{width:360,height:780},{width:390,height:844},{width:844,height:390}]){
   const page=await browser.newPage({viewport,reducedMotion:'reduce'});
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.goto(process.env.CASITADEX_QA_URL||'http://127.0.0.1:8765');
   await page.getByRole('tab',{name:'Home',exact:true}).waitFor();
   const names=await page.getByRole('tab').evaluateAll(xs=>xs.map(x=>x.getAttribute('aria-label')));
   assert.deepEqual(names,['Home','Photos','Reminders','Find']);
   assert.equal(await page.getByRole('tab',{name:'Home'}).getAttribute('aria-selected'),'true');
   assert.equal(await page.getByText('Your saved memories could not be loaded. No data was changed.').count(),1,'Expected web-only native-storage boundary warning');
   assert.deepEqual(errors,[],'Unexpected JavaScript error');
   const clipped=await page.locator('button,[role="button"],[role="tab"]').evaluateAll(xs=>xs.filter(x=>{const r=x.getBoundingClientRect();return r.width>0&&(r.left < -1||r.right>innerWidth+1)}).map(x=>x.getAttribute('aria-label')||x.textContent));
   assert.deepEqual(clipped,[],'Horizontal clipping');
   results.push({viewport,tabCount:names.length,jsErrors:0,clippedControls:0,storage:'EXPECTED_NATIVE_ONLY_UNAVAILABLE'});
   await page.close();
  }
  console.log(JSON.stringify({status:'PASS_WEB_BOUNDARY_ONLY',results,nativeStorage:'NOT_TESTED',nativeScreenReader:'NOT_TESTED',endToEnd:'NOT_TESTED'},null,2));
 } finally {await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
