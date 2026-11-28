import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const source=readFileSync(new URL("../src/figma-first/FigmaReminders.tsx",import.meta.url),"utf8");
test("enlarged reminder filters scroll with content while the standard header remains sticky",()=>{
 assert.match(source,/const compactHeader=large\|\|fontScale>=1\.35/);
 assert.match(source,/stickyHeaderIndices=\{compactHeader\?\[\]:\[0\]\}/);
 assert.match(source,/flexBasis:compactHeader\?"45%":"22%"/);
});
