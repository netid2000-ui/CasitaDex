const { chromium } = require("playwright");
const assert = require("node:assert/strict");
(async () => {
  const browser = await chromium.launch({channel:"msedge",headless:true});
  try {
    const page = await browser.newPage({viewport:{width:390,height:844}});
    const errors=[];
    page.on("pageerror",e=>errors.push(e.message));
    await page.goto(process.env.CASITADEX_WEB_URL || "http://127.0.0.1:8765");
    for(const label of ["Add Memory","Add Photo Memory","Add Reminder"]) {
      const action=page.getByRole("button",{name:label,exact:true});
      await action.waitFor({timeout:12000});
      assert.equal(await action.isVisible(),true,label+" not visible");
      console.log("PASS approved home action "+label);
    }
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,"Horizontal overflow on mobile Home");
    console.log("PASS mobile Home horizontal fit");
    assert.deepEqual(errors,[],"Browser runtime errors");
    console.log("PASS no browser page errors");
  } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1});
