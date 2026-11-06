import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { primaryNavigationRows } from "../src/primary-navigation-layout.ts";

const tabs = ["Home", "Photos", "Reminders", "Find"];
for (const [name, width, fontScale, columns] of [
  ["ordinary portrait", 402, 1, 4],
  ["ordinary landscape safe width", 874 - 62 - 62, 1, 4],
  ["narrow portrait", 320, 1, 2],
  ["at the normal breakpoint", 365, 1, 4],
  ["below the normal breakpoint", 364.99, 1, 2],
  ["smaller system text keeps the normal breakpoint", 365, 0.8, 4],
  ["max portrait", 402, 3.571, 2],
  ["max landscape safe width", 874 - 62 - 62, 3.571, 2],
  ["large text at the scaled breakpoint", 730, 2, 4],
  ["large text below the scaled breakpoint", 729.99, 2, 2],
  ["landscape side insets change the decision", 874 - 62 - 62, 2.1, 2],
]) {
  test(`primary navigation: ${name}`, () => {
    const rows = primaryNavigationRows(tabs, width, fontScale);
    assert.deepEqual(rows.map(row => row.length), columns === 4 ? [4] : [2, 2]);
    assert.deepEqual(rows.flat(), tabs);
    assert.equal(rows.length <= 2, true, "never four full-height rows");
  });
}

test("navigation recovers across rotation and font-scale changes without losing a destination", () => {
  for (const [width, scale] of [[402, 3.571], [750, 3.571], [750, 1], [402, 1], [402, 3.571]]) {
    assert.deepEqual(primaryNavigationRows(tabs, width, scale).flat(), tabs);
  }
});

test("shell uses explicit safe-area rows and leaves full scalable text and scrollable content intact", () => {
  const shell = fs.readFileSync("src/app/_layout.tsx", "utf8");
  const ui = fs.readFileSync("src/ui.tsx", "utf8");
  const navStyles = ui.slice(ui.indexOf("    nav: {"));
  assert.match(shell, /primaryNavigationRows\([\s\S]*width - left - right,[\s\S]*fontScale/);
  assert.match(shell, /rows\.map\(/);
  assert.match(shell, /style=\{s\.navRow\}/);
  assert.match(shell, /row\.map\(/);
  assert.match(shell, /<Slot \/>/);
  assert.match(ui, /<ScrollView/);
  assert.match(navStyles, /navRow: \{ flexDirection: "row", gap: 5 \}/);
  assert.match(navStyles, /minHeight: 55/);
  assert.match(navStyles, /alignSelf: "stretch"/);
  assert.doesNotMatch(navStyles, /flexWrap|flexBasis: "[^"]+%"/);
  assert.doesNotMatch(shell, /numberOfLines|maxFontSizeMultiplier|adjustsFontSizeToFit|allowFontScaling=\{false\}/);
  assert.match(shell, /edges=\{\["top", "left", "right"\]\}/);
  assert.match(shell, /edges=\{\["bottom"\]\}/);
});
