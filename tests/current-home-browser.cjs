const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs"), http = require("node:http"), path = require("node:path");
(async () => {
  let server, url = process.env.CASITADEX_WEB_URL || "http://127.0.0.1:8765";
  if (process.env.CASITADEX_WEB_ROOT) {
    const root = path.resolve(process.env.CASITADEX_WEB_ROOT);
    const types = {".html":"text/html",".js":"application/javascript",".css":"text/css",".png":"image/png",".jpg":"image/jpeg",".svg":"image/svg+xml"};
    server = http.createServer((req,res)=>{
      let target = path.resolve(root, "." + decodeURIComponent(new URL(req.url,"http://localhost").pathname));
      if (target !== root && !target.startsWith(root + path.sep)) return res.writeHead(403).end();
      if (!fs.existsSync(target) || !fs.statSync(target).isFile()) target = path.join(root,"index.html");
      res.setHeader("Content-Type",types[path.extname(target)] || "application/octet-stream");
      fs.createReadStream(target).pipe(res);
    });
    await new Promise(resolve=>server.listen(0,"127.0.0.1",resolve));
    url = "http://127.0.0.1:" + server.address().port;
  }
  const browser = await chromium.launch({channel:"msedge",headless:true});
  try {
    const page = await browser.newPage({viewport:{width:390,height:844}});
    const errors=[];
    page.on("pageerror",e=>errors.push(e.message));
    await page.goto(url);
    const tabs = page.locator('[role="tab"][aria-label]');
    await tabs.first().waitFor();
    assert.deepEqual(await tabs.evaluateAll(nodes=>nodes.map(n=>n.getAttribute("aria-label"))), ["Home","Photos","Reminders","Find"], "Exact four-tab count, order and labels");
    console.log("PASS exact four tabs: Home, Photos, Reminders, Find");
    for(const label of ["Find a Memory","Add Memory","Add Photo Memory","Add Reminder"]) {
      const action=page.getByRole("button",{name:label,exact:true});
      await action.waitFor({timeout:12000});
      assert.equal(await action.isVisible(),true,label+" not visible");
      console.log("PASS approved home action "+label);
    }
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,"Horizontal overflow on mobile Home");
    console.log("PASS mobile Home horizontal fit");
    assert.equal(await page.getByRole("img",{name:"CasitaDex, Designs by F and A",exact:true}).count(),1,"Single accessible brand");
    await page.waitForFunction(()=>Array.from(document.images).every(im=>im.complete&&im.naturalWidth>0));
    if (process.env.CASITADEX_SCREENSHOT) await page.screenshot({path:process.env.CASITADEX_SCREENSHOT});
    await page.getByRole("button",{name:"Find a Memory",exact:true}).click();
    await page.waitForURL(u=>u.pathname==="/answers");
    // Web intentionally renders LegacyFindHome; native EngFind Browse is covered by component tests.
    console.log("PASS Home Find route; native Find Browse remains a native-only path");
    await page.locator('[role="tab"][aria-label="Home"]').click();
    await page.getByRole("button",{name:"Settings",exact:true}).click();
    await page.waitForURL(u=>u.pathname==="/more");
    await page.getByRole("button",{name:"Browse all memories",exact:true}).click();
    await page.waitForURL(u=>u.pathname==="/memories");
    console.log("PASS Home Settings and retained Settings Browse route");
    await page.locator('[role="tab"][aria-label="Home"]').click();
    for (const [label, route] of [["Photos","/photos"],["Reminders","/reminders"],["Find","/answers"],["Home","/"]]) {
      const tab=page.locator(`[role="tab"][aria-label="${label}"]`);
      await tab.click();
      await page.waitForURL(url=>url.pathname===route,{timeout:12000});
      assert.equal(await tab.getAttribute("aria-selected"),"true",label+" selected state");
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,label+" horizontal overflow");
      console.log("PASS navigation "+label+" "+route);
    }
    const addMemory=page.getByRole("button",{name:"Add Memory",exact:true});
    if(await addMemory.isDisabled()) {
      await page.getByText("Memory editing is available in the native app",{exact:true}).first().waitFor();
      await page.goto(url + "/add");
      console.log("PASS native startup guard retained on web");
    } else await addMemory.click();
    await page.waitForURL(url=>url.pathname==="/add");
    await page.getByText("Full ENG requires the native Development app",{exact:true}).waitFor();
    console.log("PASS Add route opens; native-only editor correctly gated on web");
    assert.deepEqual(errors,[],"Browser runtime errors");
    console.log("PASS no browser page errors");
  } finally {await browser.close();if(server) await new Promise(resolve=>server.close(resolve));}
})().catch(error=>{console.error(error);process.exitCode=1});
