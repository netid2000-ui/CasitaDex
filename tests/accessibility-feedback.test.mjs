import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";

function load(file, mocks, extra = "") {
  const source = fs.readFileSync(new URL("../src/" + file, import.meta.url), "utf8");
  const js = ts.transpileModule(source, { compilerOptions: {
    module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.React,
  } }).outputText;
  const mod = { exports: {} };
  vm.runInNewContext(js + extra, {
    module: mod, exports: mod.exports, require: name => {
      if (!(name in mocks)) throw Error("Unexpected import: " + name);
      return mocks[name];
    }, Set, Math,
  });
  return mod.exports;
}
const react = {
  createElement: (type, props, ...children) => ({ type, props: { ...props, children } }),
  useState: initial => [typeof initial === "function" ? initial() : initial, () => {}],
  useRef: value => ({ current: value }),
  useMemo: fn => fn(), useCallback: fn => fn, useEffect: () => {},
};
function feedbackFixture(os = "ios", state = "active") {
  const spoken = [], changes = [], listeners = new Map();
  let resolveMotion, rejectMotion, removals = 0;
  const native = {
    Platform: { OS: os }, AppState: { currentState: state },
    AccessibilityInfo: {
      announceForAccessibilityWithOptions: (text, options) => spoken.push({ text, options }),
      isReduceMotionEnabled: () => new Promise((resolve, reject) => { resolveMotion = resolve; rejectMotion = reject; }),
      addEventListener: (name, fn) => {
        listeners.set(name, fn);
        return { remove: () => { removals++; listeners.delete(name); } };
      },
    },
  };
  const api = load("accessibility-feedback.ts", { react, "react-native": native });
  return { api, native, spoken, changes, listeners,
    resolve: value => resolveMotion(value), reject: () => rejectMotion(Error("unavailable")),
    removals: () => removals };
}
const tick = async () => { await Promise.resolve(); await Promise.resolve(); };

test("iOS status announces a changed app-owned result at low priority once", () => {
  const f = feedbackFixture(), a = f.api.createStatusAnnouncer();
  a.update("Saved on this device."); a.update(" Saved on this device. ");
  assert.equal(f.spoken.length, 1);
  assert.equal(f.spoken[0].text, "Saved on this device.");
  assert.equal(f.spoken[0].options.priority, "low");
  assert.equal(f.spoken[0].options.queue, undefined);
});
test("initial existing status and empty or autosave chatter stay quiet", () => {
  const f = feedbackFixture(), a = f.api.createStatusAnnouncer("Saved on this device.");
  for (const text of ["Saved on this device.", "", "Draft has changes to save.", "Draft saved on this device.", "Reading your draft…"]) a.update(text);
  assert.equal(f.spoken.length, 0);
});
test("unknown errors do not disclose private memory contents or file paths", () => {
  const f = feedbackFixture(), a = f.api.createStatusAnnouncer();
  a.update("Unable to save Private medicine cabinet /private/user/photo.jpg");
  assert.equal(f.spoken[0].text, "Status updated. Review the status message for details.");
  assert.ok(!f.spoken[0].text.includes("medicine"));
  a.update("Unable to save another private record");
  assert.equal(f.spoken.length, 1);
});
test("known failed-save recovery guidance is announced without memory content", () => {
  const f = feedbackFixture(), a = f.api.createStatusAnnouncer();
  const text = "Change saved on this device, but the list could not refresh. Reopen this page to confirm the latest data.";
  a.update(text); assert.equal(f.spoken[0].text, text);
});
test("background/inactive/null states consume updates without replay after foreground", () => {
  for (const state of ["background", "inactive", null]) {
    const f = feedbackFixture("ios", state), a = f.api.createStatusAnnouncer();
    a.update("Saved on this device.");
    f.native.AppState.currentState = "active"; a.update("Saved on this device.");
    assert.equal(f.spoken.length, 0);
    a.update("Sharing canceled."); assert.equal(f.spoken.length, 1);
  }
});
test("consumed background changes do not suppress a later new foreground result", () => {
  for (const state of ["background", "inactive", null]) {
    const f = feedbackFixture(), a = f.api.createStatusAnnouncer();
    a.update("Saved on this device.");
    f.native.AppState.currentState = state;
    a.update("Operation failed. Your last confirmed save is kept.");
    f.native.AppState.currentState = "active";
    a.update("Operation failed. Your last confirmed save is kept.");
    assert.equal(f.spoken.length, 1, "no foreground replay of the background error");
    a.update("Saved on this device.");
    assert.equal(f.spoken.length, 2, "new foreground success may match an earlier success");
    assert.equal(f.spoken[1].text, "Saved on this device.");
  }
});
test("consumed non-iOS changes reset prior spoken deduplication", () => {
  const f = feedbackFixture(), a = f.api.createStatusAnnouncer();
  a.update("Saved on this device.");
  f.native.Platform.OS = "android";
  a.update("Reminder updated.");
  f.native.Platform.OS = "ios";
  a.update("Reminder updated.");
  assert.equal(f.spoken.length, 1);
  a.update("Saved on this device.");
  assert.equal(f.spoken.length, 2);
});
test("Android and web do not receive iOS status announcements", () => {
  for (const os of ["android", "web"]) {
    const f = feedbackFixture(os), a = f.api.createStatusAnnouncer();
    a.update("Saved on this device."); assert.equal(f.spoken.length, 0);
  }
});
test("disposed announcers cannot produce late speech", () => {
  const f = feedbackFixture(), a = f.api.createStatusAnnouncer();
  a.stop(); a.update("Saved on this device."); assert.equal(f.spoken.length, 0);
});
test("reminder results use meaningful app-owned copy", () => {
  const f = feedbackFixture(), a = f.api.createStatusAnnouncer();
  for (const status of ["Reminder saved on this device.", "Reminder updated.", "Reminder deleted."]) {
    a.update(status); assert.equal(f.spoken.at(-1).text, status);
  }
});
test("Reduce Motion starts conservative and resolves the current OS setting", async () => {
  const f = feedbackFixture(), stop = f.api.observeReduceMotion(v => f.changes.push(v));
  assert.deepEqual(f.changes, [true]);
  f.resolve(false); await tick(); assert.deepEqual(f.changes, [true, false]);
  stop(); assert.equal(f.removals(), 1);
});
test("Reduce Motion event wins over a stale asynchronous preference read", async () => {
  const f = feedbackFixture(), stop = f.api.observeReduceMotion(v => f.changes.push(v));
  f.listeners.get("reduceMotionChanged")(true); f.resolve(false); await tick();
  assert.deepEqual(f.changes, [true, true]); stop();
});
test("Reduce Motion read failure stays conservative", async () => {
  const f = feedbackFixture(), stop = f.api.observeReduceMotion(v => f.changes.push(v));
  f.reject(); await tick(); assert.deepEqual(f.changes, [true, true]); stop();
});
test("Reduce Motion disposal ignores late result and removes listener", async () => {
  const f = feedbackFixture(), stop = f.api.observeReduceMotion(v => f.changes.push(v));
  const lateEvent = f.listeners.get("reduceMotionChanged");
  stop(); lateEvent(false); f.resolve(false); await tick();
  assert.deepEqual(f.changes, [true]); assert.equal(f.listeners.size, 0);
});
function buttonFor(os, props) {
  const native = { Platform: { OS: os }, useColorScheme: () => "light",
    Pressable: "Pressable", ScrollView: "ScrollView", Text: "Text", TextInput: "TextInput", View: "View",
    StyleSheet: { create: value => value } };
  const api = load("ui.tsx", { react, "react-native": native,
    "./state": { useData: () => ({ appearance: "Light", large: false }) },
    "./theme": { lightColors: {}, darkColors: {} } });
  return api.Button({ label: "More details", onPress: () => {}, ...props }).props;
}
test("native disclosure state preserves selected and disabled independently", () => {
  for (const expanded of [false, true]) {
    const p = buttonFor("ios", { expanded, selected: true, disabled: true });
    assert.equal(p.accessibilityRole, "button");
    assert.equal(p.accessibilityState.expanded, expanded);
    assert.equal(p.accessibilityState.selected, true);
    assert.equal(p.accessibilityState.disabled, true);
    assert.equal(p["aria-expanded"], undefined);
  }
});
test("web disclosure uses aria-expanded without losing pressed or disabled semantics", () => {
  const p = buttonFor("web", { expanded: false, selected: true, disabled: true });
  assert.equal(p["aria-expanded"], false); assert.equal(p["aria-pressed"], true);
  assert.equal(p.accessibilityState.disabled, true);
});
test("ordinary buttons do not imply expandable content", () => {
  const p = buttonFor("ios", {});
  assert.equal(p.accessibilityState.expanded, undefined);
  assert.equal(p.accessibilityState.disabled, false);
});
test("photo modal begins without slide before motion preference resolves and escape closes", () => {
  let closed = 0; const announcementInputs = [], zoomSamples = [];
  const mocks = { react, "react-native": {
    Modal: "Modal", ScrollView: "ScrollView", View: "View", Image: "Image",
    useWindowDimensions: () => ({ width: 390, height: 844 }),
  }, "./ui": { Button: "Button", Copy: "Copy", useTheme: () => ({ colors: { paper: "#fff" } }) },
  "./accessibility-feedback": { useStatusAnnouncement: text => announcementInputs.push(text), observeReduceMotion: () => () => {} },
  "./photo-viewer-state": {
    clampPhotoIndex: (i,n) => Math.max(0,Math.min(i,n-1)),
    clampPhotoZoom: v => { zoomSamples.push(v); return Math.max(1,Math.min(4,v)); },
    clampPhotoPan: (x,y) => ({x,y}),
    touchDistance: ts => ts.length < 2 ? null : Math.hypot(ts[1].pageX-ts[0].pageX,ts[1].pageY-ts[0].pageY),
  },
  "./eng-find": { defaultFilter: () => ({}) }, "./eng-domain": { localDay: () => "" },
  "./eng-runtime": { engPhotoUri: value => value } };
  for (const name of ["./memory-navigation", "./action-page", "./share-session", "./reminder-alerts", "./backup-review", "./reminder-notification-target", "./reminder-notification-projection", "@react-native-community/datetimepicker", "expo-router", "./state", "./eng-store", "./standalone-reminders", "./eng-text-backup", "./eng-duplicates", "./eng-navigation", "./standalone-reminder-draft", "./brand", "./home-action", "./editorial-intro", "./model"]) mocks[name] ??= {};
  const api = load("eng-screens.tsx", mocks, "\nmodule.exports.testPhotoViewer = PhotoViewer;");
  const onClose = () => closed++;
  const modal = api.testPhotoViewer({ path: "local.jpg", label: "PRIVATE CONTENT", onClose });
  assert.equal(modal.type, "Modal"); assert.equal(modal.props.animationType, "none");
  assert.equal(modal.props.accessibilityViewIsModal, true);
  assert.equal(modal.props.onRequestClose, onClose);
  const scroll = modal.props.children[0];
  scroll.props.onAccessibilityEscape(); assert.equal(closed, 1);
  assert.deepEqual(announcementInputs, []);
  const closeButton = scroll.props.children.find(n => n?.props?.label === "Close photo");
  closeButton.props.onPress(); assert.equal(closed, 2);
  // Regression: real two-finger touchMove must zoom without a JS onResponderMove event.
  const imageRegion = scroll.props.children.find(n => n?.type === "View" && typeof n.props?.onTouchMove === "function");
  assert.ok(imageRegion, "photo image exposes direct multitouch move handling");
  imageRegion.props.onTouchStart({nativeEvent:{touches:[{pageX:0,pageY:0},{pageX:100,pageY:0}]}});
  imageRegion.props.onTouchMove({nativeEvent:{touches:[{pageX:0,pageY:0},{pageX:200,pageY:0}]}});
  assert.ok(zoomSamples.includes(2), "pinch-out updates zoom from actual touch movement");
});
