import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';

// Inspect the actual JSX props, rather than duplicating the UI guard in a helper.
const source = fs.readFileSync(new URL('../src/eng-screens.tsx', import.meta.url), 'utf8');
const tree = ts.createSourceFile('eng-screens.tsx', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
function buttons(functionName) {
  const result = [];
  const fn = tree.statements.find(n => ts.isFunctionDeclaration(n) && n.name?.text === functionName);
  assert.ok(fn);
  function visit(node) {
    if ((ts.isJsxSelfClosingElement(node) || ts.isJsxOpeningElement(node)) && node.tagName.getText(tree) === 'Button') {
      const attrs = Object.fromEntries(node.attributes.properties.filter(ts.isJsxAttribute).map(a => [a.name.getText(tree), a.initializer]));
      result.push({ label: attrs.label && ts.isStringLiteral(attrs.label) ? attrs.label.text : attrs.label?.getText(tree), disabled: attrs.disabled?.expression?.getText(tree) });
    }
    ts.forEachChild(node, visit);
  }
  visit(fn);
  return result;
}
function isDisabled(expression, values) {
  assert.ok(expression, 'control must have a disabled prop');
  return Function(...Object.keys(values), `return (${expression});`)(...Object.values(values));
}
const draft = buttons('EngAdd').filter(b => ['Take photo', 'Choose photo', 'Browse image files'].includes(b.label));
const saved = buttons('DetailSession').filter(b => ['Add a photo', 'Take another photo'].includes(b.label));

test('detail route mounts the session that owns saved-memory photo controls', () => {
  const detail = tree.statements.find(n => ts.isFunctionDeclaration(n) && n.name?.text === 'EngDetail');
  assert.ok(detail);
  assert.match(detail.getText(tree), /return <DetailSession key=\{id\} id=\{id\} \/>/);
});


test('all five draft picker entry points stop at five, allow below limit, and retain busy protection', () => {
  assert.equal(draft.length, 5); // Photo-first camera/library plus lower camera/files/library.
  for (const button of draft) {
    for (const count of [0, 1, 4, 5, 6]) for (const disabled of [false, true]) {
      assert.equal(isDisabled(button.disabled, { disabled, form: { photos: Array(count) } }), disabled || count >= 5, `${button.label}: ${count}, busy=${disabled}`);
    }
    assert.equal(isDisabled(button.disabled, { disabled: false, form: null }), false);
  }
});
test('both saved-memory pickers count attached IDs, including unavailable image entries, and retain busy protection', () => {
  assert.equal(saved.length, 2);
  for (const button of saved) for (const count of [0, 1, 4, 5, 6]) for (const busy of [false, true]) {
    assert.equal(isDisabled(button.disabled, { e: { busy }, m: { mediaIds: Array(count) }, photos: [] }), busy || count >= 5, `${button.label}: ${count}, busy=${busy}`);
  }
});
test('removal and draft replacement remain available at the limit and blocked while busy', () => {
  for (const [name, values] of [['EngAdd', { disabled: false, form: { photos: Array(5) } }], ['DetailSession', { e: { busy: false }, m: { mediaIds: Array(5) } }]]) {
    const controls = buttons(name).filter(b => /Remove (draft|saved) photo|Replace draft photo/.test(b.label));
    assert.equal(controls.length, name === 'EngAdd' ? 2 : 1);
    for (const control of controls) {
      assert.equal(isDisabled(control.disabled, values), false);
      assert.equal(isDisabled(control.disabled, { ...values, disabled: true, e: { busy: true } }), true);
    }
  }
});
test('both limit states expose readable recovery hints through existing accessible Copy styling', () => {
  assert.match(source, /\(form\?\.photos.length\?\?0\)>=5\?<Copy kind="small" accessibilityLiveRegion="polite">Five photos added\. Remove a photo before adding another\./);
  assert.match(source, /m.mediaIds.length>=5\?<Copy kind="small" accessibilityLiveRegion="polite">Five photos attached\. Remove a photo before adding another\./);
  const ui = fs.readFileSync(new URL('../src/ui.tsx', import.meta.url), 'utf8');
  assert.match(ui, /accessibilityState=\{[\s\S]*?disabled/);
});
