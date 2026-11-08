const { chromium } = require("playwright");
const http=require("node:http"),fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const root="\\\\wsl.localhost\\Ubuntu-24.04\\home\\fa-dev\\projects\\casitadex-eng-native-20261018\\dist";
const qa=path.join(process.env.LOCALAPPDATA,"Designs-by-FA","qa","brand-integration-20261019");fs.mkdirSync(qa,{recursive:true});
const types={".html":"text/html",".js":"text/javascript",".png":"image/png",".jpg":"image/jpeg",".webp":"image/webp",".ico":"image/x-icon",".webmanifest":"application/manifest+json"};
const server=http.createServer((req,res)=>{let name=decodeURIComponent(new URL(req.url,"http://localhost").pathname);let p=path.join(root,name);if(!p.startsWith(root)){res.writeHead(403);return res.end();}if(!fs.existsSync(p)||fs.statSync(p).isDirectory())p=path.join(root,"index.html");res.setHeader("Content-Type",types[path.extname(p)]||"application/octet-stream");fs.createReadStream(p).pipe(res);});
(async()=>{await new Promise(r=>server.listen(8767,"127.0.0.1",r));const browser=await chromium.launch({channel:"msedge",headless:true});const context=await browser.newContext({viewport:{width:390,height:844},colorScheme:"light"});const page=await context.newPage();const errors=[];page.on("pageerror",e=>errors.push(e.message));const checks=[];
try{
 await page.goto("http://127.0.0.1:8767");await page.getByRole("img",{name:"CasitaDex",exact:true}).waitFor();
 const decoded=async()=>{await page.waitForFunction(()=>Array.from(document.images).every(im=>im.complete&&im.naturalWidth>0));};
 const overflow=async()=>assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 await decoded();await overflow();await page.screenshot({path:path.join(qa,"web-home-light.png")});checks.push("Light Home logo and illustration decoded");
 const homeArt=await page.locator('img[src*="illustration-home"]').count();assert(homeArt>0);
 await page.getByRole("tab",{name:"More",exact:true}).click();await page.getByRole("button",{name:"Dark",exact:true}).click();
 await page.waitForFunction(()=>document.getElementById("casitadex-favicon").getAttribute("href").includes("dark"));
 await page.getByRole("tab",{name:"Home",exact:true}).click();await decoded();await page.screenshot({path:path.join(qa,"web-home-dark.png")});checks.push("Explicit Dark preference switches logo and favicon");
 await page.getByRole("textbox",{name:"Search your memories",exact:true}).fill("QA_NO_MATCH_20261019");await page.getByRole("button",{name:"Search memories",exact:true}).click();
 await page.getByText("No matching answers. Try another phrase or save what you want to remember.",{exact:true}).waitFor();
 await decoded();assert(await page.locator('img[src*="illustration-find"]').count()>0);await overflow();await page.screenshot({path:path.join(qa,"web-find-empty-dark.png")});checks.push("Empty Find illustration and guidance");
 await page.getByRole("tab",{name:"More",exact:true}).click();await decoded();assert(await page.locator('img[src*="illustration-backup"]').count()>0);checks.push("Backup artwork decoded");
 await page.getByRole("button",{name:"Light",exact:true}).click();
 await page.waitForFunction(()=>document.getElementById("casitadex-favicon").getAttribute("href").includes("light"));checks.push("Explicit Light preference restores favicon");
 await page.getByRole("button",{name:"Extra-large text: Off",exact:true}).click();await overflow();await page.getByRole("tab",{name:"Home",exact:true}).click();await overflow();await page.screenshot({path:path.join(qa,"web-home-large-text.png")});checks.push("Large text preserves page width and primary controls");
 await page.getByRole("tab",{name:"More",exact:true}).click();await page.getByRole("button",{name:"Extra-large text: On",exact:true}).click();await page.getByRole("button",{name:"System",exact:true}).click();
 await page.emulateMedia({colorScheme:"dark"});await page.waitForFunction(()=>document.getElementById("casitadex-favicon").getAttribute("href").includes("dark"));checks.push("System dark preference switches favicon");
 for(const width of [320,768,1280]){await page.setViewportSize({width,height:900});await page.getByRole("tab",{name:"Home",exact:true}).click();await decoded();await overflow();checks.push("No horizontal overflow at "+width);}
 const manifest=await (await page.request.get("http://127.0.0.1:8767/manifest.webmanifest")).json();
 for(const icon of manifest.icons){const response=await page.request.get("http://127.0.0.1:8767"+icon.src);assert(response.ok());assert.equal(response.headers()["content-type"],"image/png");}
 const apple=await page.request.get("http://127.0.0.1:8767/brand/apple-touch-icon.png");assert(apple.ok());checks.push("Manifest and touch icon URLs resolve");
 assert.deepEqual(errors,[]);fs.writeFileSync(path.join(qa,"web-brand-proof.json"),JSON.stringify({result:"PASS",checks,pageErrors:errors},null,2));console.log(JSON.stringify({result:"PASS",checks}));
}finally{await context.close();await browser.close();await new Promise(r=>server.close(r));}})().catch(e=>{console.error(e);process.exitCode=1;server.close();});
