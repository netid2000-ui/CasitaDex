import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import ts from "typescript";

const root = process.env.CASITADEX_KEYBOARD_SOURCE_ROOT || path.resolve(import.meta.dirname, "..");
function fixture(os = "android") {
  let bounds = { width: 0, height: 0 };
  const state = { top: 24, fontScale: 2, large: false };
  const react = {
    createElement: (type, props, ...children) => ({ type, props: { ...props, children } }),
    useState: () => [bounds, update => { bounds = typeof update === "function" ? update(bounds) : update; }],
  };
  function load(file, mocks) {
    const code = ts.transpileModule(fs.readFileSync(path.join(root, "src", file), "utf8"), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.React },
    }).outputText;
    const mod = { exports: {} };
    vm.runInNewContext(code, { module: mod, exports: mod.exports,
      require: name => { assert.ok(name in mocks, "Unexpected import " + name); return mocks[name]; } });
    return mod.exports;
  }
  const layout = load("action-page-layout.ts", {});
  const { ActionPage } = load("action-page.tsx", {
    react,
    "react-native": { Platform: { OS: os }, KeyboardAvoidingView: "KeyboardAvoidingView",
      ScrollView: "ScrollView", View: "View", useWindowDimensions: () => ({ fontScale: state.fontScale }) },
    "react-native-safe-area-context": { useSafeAreaInsets: () => ({ top: state.top, left: 0, right: 0, bottom: 0 }) },
    "./ui": { Button: "Button", Copy: "Copy", useTheme: () => ({ colors: { paper: "paper", muted: "muted" }, s: { page: {}, container: {} } }) },
    "./state": { useData: () => ({ large: state.large }) },
    "./action-page-layout": layout,
    "./use-ios-focus-scroll": { useIOSFocusScroll: () => undefined },
  });
  const calls = [], save = () => calls.push("save"), cancel = () => calls.push("cancel");
  const editor = { type: "EditorProbe", props: { session: { id: "same-edit" }, children: [] } };
  const props = { title: "Editing memory", actions: [{ label: "Cancel", onPress: cancel },
    { label: "Save", onPress: save }], children: editor };
  const flat = n => Array.isArray(n) ? n.flatMap(flat) : n && typeof n === "object" ? [n, ...flat(n.props.children)] : [];
  const render = () => ActionPage(props);
  function measure(width, height) {
    const tree = render();
    flat(tree).find(n => n.props.onLayout).props.onLayout({ nativeEvent: { layout: { width, height } } });
    return render();
  }
  const parent = (tree, child) => flat(tree).find(n => n.props.children.flat(Infinity).includes(child));
  return { state, calls, save, cancel, editor, flat, render, measure, parent, props };
}
for (const os of ["android", "ios", "web"]) {
  test(os + " ActionPage uses rotation-safe native padding and current top inset only", () => {
    const f = fixture(os), tree = f.render();
    assert.equal(tree.type, "KeyboardAvoidingView");
    assert.equal(tree.props.behavior, os === "web" ? undefined : "padding");
    assert.equal(tree.props.keyboardVerticalOffset, os === "web" ? 0 : 24);
    f.state.top = 62;
    assert.equal(f.render().props.keyboardVerticalOffset, os === "web" ? 0 : 62);
    f.state.top = 0;
    assert.equal(f.render().props.keyboardVerticalOffset, 0);
    assert.equal(f.render().props.key, undefined, "Do not remount the editor to reset a cached height");
  });
  test(os + " actual action/content scroll viewports clip overflow and retain tap/scroll contracts", () => {
    const f = fixture(os), tree = f.measure(914, 149), nodes = f.flat(tree);
    for (const id of ["memory-action-region", "memory-content-region"]) {
      const n = nodes.find(n => n.props.testID === id);
      assert.ok(n);
      if (os === "ios") {
        assert.equal(n.props.style.overflow, "scroll", "Keep native ScrollView scroll-axis measurement semantics");
        const clip = f.parent(tree, n);
        assert.equal(clip.type, "View");
        assert.equal(clip.props.style.overflow, "hidden", "Clip on the bounded parent, never remove visual clipping");
        assert.equal(clip.props.style.minHeight, 0);
        assert.equal(clip.props.collapsable, false);
        assert.equal(clip.props.accessible, false);
      } else {
        assert.equal(n.props.style.overflow, "hidden");
        assert.equal(f.parent(tree, n), tree.props.children[0], "Keep Android/web layout structure unchanged");
      }
      assert.equal(n.props.style.minHeight, 0);
      assert.equal(n.props.keyboardShouldPersistTaps, "handled");
      assert.equal(n.props.nestedScrollEnabled, true);
    }
    const content = nodes.find(n => n.props.testID === "memory-content-region");
    assert.equal(content.props.automaticallyAdjustKeyboardInsets, os !== "ios",
      "Do not add double iOS keyboard-inset handling");
  });
}
test("actual ActionPage re-budgets after keyboard and both rotation directions without remounting actions", () => {
  const f = fixture("android");
  for (const [width, height] of [[411, 795], [914, 277], [914, 149], [411, 420], [914, 149], [914, 277]]) {
    const tree = f.measure(width, height), nodes = f.flat(tree);
    const actions = nodes.find(n => n.props.testID === "memory-action-region");
    assert.ok(nodes.includes(f.editor), "Preserve the same editor child/session identity");
    assert.equal(tree.props.key, undefined);
    assert.ok(actions.props.style.maxHeight > 0);
    assert.ok(actions.props.style.maxHeight <= height * .4);
    assert.ok(height - actions.props.style.maxHeight >= height * .6);
    assert.equal(nodes.find(n => n.type === "Button" && n.props.label === "Save").props.onPress, f.save);
    assert.equal(nodes.find(n => n.type === "Button" && n.props.label === "Cancel").props.onPress, f.cancel);
  }
  f.save(); f.cancel(); assert.deepEqual(f.calls, ["save", "cancel"]);
});

for (const os of ["ios", "android", "web"]) test(os + " clips each region without sharing the focus ref or expanding short actions", () => {
  const f = fixture(os);
  for (const [width, height] of [[402, 484], [750, 178], [402, 692]]) {
    const tree = f.measure(width, height), nodes = f.flat(tree);
    const action = nodes.find(n => n.props.testID === "memory-action-region");
    const content = nodes.find(n => n.props.testID === "memory-content-region");
    const actionBound = os === "ios" ? f.parent(tree, action) : action;
    const contentBound = os === "ios" ? f.parent(tree, content) : content;
    assert.equal(actionBound.props.style.flexGrow, 0, "Short actions must not request spare space");
    assert.equal(actionBound.props.style.flexShrink, 1);
    assert.equal(actionBound.props.style.height, undefined, "No fixed action height, including short content");
    assert.equal(actionBound.props.style.flexBasis, undefined, "No basis forcing the full action budget");
    assert.equal(actionBound.props.style.minHeight, 0);
    assert.equal(actionBound.props.style.maxHeight, Math.floor(height * .4));
    assert.equal(contentBound.props.style.flex, 1);
    assert.equal(contentBound.props.style.minHeight, 0);
    assert.equal(contentBound.props.style.overflow, "hidden");
    assert.equal(action.props.style.flexGrow, 0);
    assert.equal(action.props.style.flexShrink, 1);
    assert.ok(nodes.includes(f.editor), "No editor remount or replaced session");
    assert.equal(tree.props.key, undefined);
    assert.equal(nodes.find(n => n.type === "Button" && n.props.label === "Save").props.onPress, f.save);
    assert.equal(nodes.find(n => n.type === "Button" && n.props.label === "Cancel").props.onPress, f.cancel);
  }
});

for(const os of ['ios','android','web'])test(os+' edit feedback stays with actions independently of form scrolling',()=>{
 const f=fixture(os),feedback={type:'FeedbackProbe',props:{children:[]}};f.props.feedback=feedback;
 const tree=f.measure(402,692),nodes=f.flat(tree);
 const actions=nodes.find(n=>n.props.testID==='memory-action-region'),content=nodes.find(n=>n.props.testID==='memory-content-region');
 assert.ok(f.flat(actions).includes(feedback));assert.ok(!f.flat(content).includes(feedback));
 assert.equal(nodes.filter(n=>n===feedback).length,1);assert.ok(nodes.includes(f.editor));
});
