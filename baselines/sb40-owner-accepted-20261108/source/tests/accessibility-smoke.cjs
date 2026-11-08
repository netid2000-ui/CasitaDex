const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try{
  const page=await browser.newPage({viewport:{width:360,height:780},reducedMotion:'reduce'});
  await page.goto(process.env.CASITADEX_QA_URL||'http://127.0.0.1:8765',{waitUntil:'domcontentloaded'});
  const enter=page.getByRole('button',{name:'Explore example home'});
  if(await enter.count()) await enter.click();
  const tabs=[['Home','/'],['Memories','/memories'],['Photos','/photos'],['Reminders','/reminders'],['Find','/answers']];
  const checks=[];
  for(const [name,path] of tabs){
   const tab=page.getByRole('tab',{name,exact:true});
   await tab.waitFor({timeout:20000});
   assert.equal(await tab.count(),1,`Missing tab ${name}`);
   await tab.click();
   await page.waitForURL(url=>url.pathname===path,{timeout:15000});
   assert.equal(await tab.getAttribute('aria-selected'),'true',`Selected state ${name}`);
   checks.push(`${name} destination and selected state`);
  }
  await page.getByRole('tab',{name:'Home'}).click();
  const nativeHomeActions=['Add Memory','Add Photo Memory','Add Reminder'];
  const nativeCount=await page.getByRole('button',{name:'Add Memory',exact:true}).count();
  if(nativeCount){
    for(const name of nativeHomeActions){
      assert.ok(await page.getByRole('button',{name,exact:true}).count(),`Home action ${name}`);
      checks.push(`Home action ${name}`);
    }
  }else{
    checks.push('Legacy web Home identified; native Home actions NOT TESTED');
  }  const clipped=await page.locator('button,[role="button"],[role="tab"]').evaluateAll(items=>items.filter(el=>{const b=el.getBoundingClientRect();return b.width>0&&(b.left< -1||b.right>innerWidth+1)}).map(el=>el.textContent?.trim()));
  assert.deepEqual(clipped,[],'Horizontal clipping at 360px');
  checks.push('Home controls not horizontally clipped at 360px');
  console.log(JSON.stringify({status:'PASS',checks,nativeSpokenTalkBack:'NOT_TESTED'},null,2));
 } finally {await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
