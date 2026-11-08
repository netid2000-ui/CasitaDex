import test from "node:test";
import assert from "node:assert/strict";
import { lightColors, darkColors } from "../src/theme.ts";
function luminance(hex) {
  const values = hex
    .slice(1)
    .match(/../g)
    .map((x) => parseInt(x, 16) / 255)
    .map((x) => (x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4));
  return values[0] * 0.2126 + values[1] * 0.7152 + values[2] * 0.0722;
}
function contrast(a, b) {
  const x = luminance(a),
    y = luminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}
test("both actual palettes meet text and control-boundary contrast targets", () => {
  for (const colors of [lightColors, darkColors]) {
    for (const bg of [colors.paper, colors.white, colors.accent])
      assert.ok(contrast(colors.ink, bg) >= 4.5);
    for (const bg of [colors.paper, colors.white])
      assert.ok(contrast(colors.line, bg) >= 3);
    assert.ok(contrast(colors.muted, colors.white) >= 3);
  }
});
