import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {usesCompactReminderHeader} from "../src/reminder-list-layout.ts";
const source=readFileSync(new URL("../src/figma-first/FigmaReminders.tsx",import.meta.url),"utf8");
test("enlarged reminder filters scroll with content while the standard header remains sticky",()=>{
 assert.match(source,/const compactHeader=usesCompactReminderHeader\(large,fontScale\)/);
 assert.match(source,/stickyHeaderIndices=\{compactHeader\?\[\]:\[0\]\}/);
 assert.match(source,/flexBasis:compactHeader\?"45%":"22%"/);
});

test("standard scale keeps sticky header, both enlarged-text choices disable it at the boundary",()=>{
 for(const scale of [0.85,1,1.34])assert.equal(usesCompactReminderHeader(false,scale),false);
 for(const scale of [1.35,1.6,2,3])assert.equal(usesCompactReminderHeader(false,scale),true);
 for(const scale of [0.85,1,1.34,2])assert.equal(usesCompactReminderHeader(true,scale),true);
});
