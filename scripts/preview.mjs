import http from "node:http";
import fs from "node:fs";
import path from "node:path";
const root = path.resolve("dist");
const types = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
};
http
  .createServer((req, res) => {
    const url = new URL(req.url, "http://127.0.0.1");
    let target = path.resolve(root, "." + decodeURIComponent(url.pathname));
    if (target !== root && !target.startsWith(root + path.sep)) {
      res.writeHead(403).end();
      return;
    }
    if (!fs.existsSync(target) || !fs.statSync(target).isFile())
      target = path.join(root, "index.html");
    res.setHeader(
      "Content-Type",
      types[path.extname(target)] || "application/octet-stream",
    );
    res.setHeader("Cache-Control", "no-store");
    fs.createReadStream(target)
      .on("error", () => res.end())
      .pipe(res);
  })
  .listen(8765, "127.0.0.1", () =>
    console.log("CasitaDex local review: http://127.0.0.1:8765"),
  );
