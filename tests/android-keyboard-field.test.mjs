import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import ts from "typescript";

const root = process.env.CASITADEX_IME_SOURCE_ROOT || path.resolve(import.meta.dirname, "..");
function renderField(os, props = {}, large = false) {
  const react = {
    createElement: (type, props, ...children) => ({ type, props: { ...props, children } }),
    useState: initial => [initial, () => {}],
    useMemo: fn => fn(),
    useRef: initial => ({ current: initial }),
  };
  const mocks = {
    react,
    "react-native": {
      Platform: { OS: os }, useColorScheme: () => "light",
      Pressable: "Pressable", ScrollView: "ScrollView", Text: "Text",
      TextInput: "TextInput", View: "View", StyleSheet: { create: styles => styles },
    },
    "./state": { useData: () => ({ large, appearance: "Light" }) },
    "./theme": { lightColors: {}, darkColors: {} },
  };
  const code = ts.transpileModule(fs.readFileSync(path.join(root, "src/ui.tsx"), "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.React },
  }).outputText;
  const mod = { exports: {} };
  vm.runInNewContext(code, {
    module: mod, exports: mod.exports,
    require: name => { assert.ok(name in mocks, "Unexpected import " + name); return mocks[name]; },
  });
  const tree = mod.exports.Field({ label: "Memory name", value: "Synthetic memory", onChangeText() {}, ...props });
  const input = tree.props.children.find(node => node.type === "TextInput");
  assert.ok(input, "The actual shared Field must render its native TextInput");
  return input.props;
}

for (const multiline of [false, true]) {
  test("Android " + (multiline ? "multiline" : "single-line") + " Field refuses the fullscreen extract editor", () => {
    const input = renderField("android", { multiline });
    assert.equal(input.disableFullscreenUI, true);
    assert.equal(input.multiline, multiline);
  });
}
for (const os of ["ios", "web"]) for (const multiline of [false, true]) {
  test(os + " " + (multiline ? "multiline" : "single-line") + " Field does not receive an Android keyboard override", () => {
    assert.equal(renderField(os, { multiline }).disableFullscreenUI, undefined);
  });
}
for (const os of ["android", "ios", "web"]) {
  test(os + " keyboard change preserves editing, accessibility, validation, and text sizing contracts", () => {
    const changes = [], submits = [];
    const onChangeText = value => changes.push(value);
    const onSubmitEditing = () => submits.push("submitted");
    const input = renderField(os, { label: "Notes", value: "Private synthetic note", multiline: true,
      disabled: true, maxLength: 123, onChangeText, onSubmitEditing }, true);
    assert.equal(input.value, "Private synthetic note");
    assert.equal(input.accessibilityLabel, "Notes");
    assert.equal(input.accessibilityValue.text, "Private synthetic note");
    assert.equal(input.accessibilityState.disabled, true);
    assert.equal(input.editable, false);
    assert.equal(input.maxLength, 123);
    assert.equal(input.multiline, true);
    assert.equal(input.textAlignVertical, "top");
    assert.equal(input.returnKeyType, "search");
    assert.equal(input.onChangeText, onChangeText);
    assert.equal(input.onSubmitEditing, onSubmitEditing);
    input.onChangeText("new synthetic note"); input.onSubmitEditing();
    assert.deepEqual(changes, ["new synthetic note"]); assert.deepEqual(submits, ["submitted"]);
    assert.equal(input.style.at(-1).fontSize, 34);
    assert.equal(input.style.at(-1).minHeight, 120);
    assert.equal(input.allowFontScaling, undefined);
    assert.equal(input.maxFontSizeMultiplier, undefined);
    const single = renderField(os);
    assert.equal(single.editable, true); assert.equal(single.maxLength, 1000);
    assert.equal(single.style.at(-1).fontSize, 17); assert.equal(single.style.at(-1).minHeight, 52);
    assert.equal(renderField(os, { multiline: true }).maxLength, 2000000);
  });
}
