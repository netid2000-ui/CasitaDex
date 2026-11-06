import { useEffect, useRef, useState } from "react";
import { AccessibilityInfo, AppState, Platform } from "react-native";

// Only app-owned copy is spoken automatically. Unknown errors may contain file
// paths or saved memory text, so direct users to the visible status instead.
const spokenStatuses = new Set([
  "This reading setting applies now but could not be saved. Select it again to retry.",
  "Your reading settings could not be loaded. Choose them again to save.",
  "Saved on this device.",
  "Reminder saved on this device.",
  "Reminder updated.",
  "Reminder deleted.",
  "Memory reminders could not refresh.",
  "Add a history note first",
  "Collection changed. Review the text backup again.",
  "Review this backup again",
  "Full collection restored and verified.",
  "Previous full save recovered and verified.",
  "Change saved on this device, but the list could not refresh. Reopen this page to confirm the latest data.",
  "Add a name and either an answer or a photo",
  "Check the name, answer or photo, source and dates before saving. Your last confirmed save is kept.",
  "Operation failed. Your last confirmed save is kept.",
  "A similar saved memory or matching photo exists. Review it before saving another.",
  "Photo selection canceled. Your draft is kept.",
  "Photo selection canceled. Your memory is kept.",
  "Camera canceled. Your memory is kept.",
  "Replacement canceled. Original photo kept.",
  "Photo saved with your draft.",
  "Photo saved with this memory.",
  "Photo added to saved memory.",
  "Photo replacement saved. Previous snapshot retained.",
  "Draft photo replaced and verified.",
  "Photo removed from draft. Previous save remains recoverable.",
  "Space created and selected.",
  "Space renamed. Draft kept.",
  "Category renamed. Draft kept.",
  "Category created. Select it to add it to your memory.",
  "Draft discarded. Your saved memories are kept.",
  "Draft deleted. Saved memories were kept.",
  "Sharing canceled.",
  "Share sheet opened. Delivery is handled by the selected app.",
  "Backup checked. Review before replacing your collection.",
  "Backup selection canceled. Current data kept.",
  "Restore canceled. Your collection and draft are kept.",
  "Reminder change saved on this device. Reopen Reminders to refresh the list.",
  "Reminders are saved locally. CasitaDex could not refresh notification schedules.",
  "Open CasitaDex in your device Settings to allow notifications.",
]);
const quietStatuses = new Set([
  "", "Draft saved on this device.", "Draft has changes to save.",
  "Reading your draft…", "Reading your draft...", "Reading memory…",
]);
export function statusAnnouncement(text: string): string | null {
  const status = text.trim();
  if (quietStatuses.has(status)) return null;
  if (spokenStatuses.has(status)) return status;
  return "Status updated. Review the status message for details.";
}
export function createStatusAnnouncer(initialText = "") {
  let previous = initialText.trim(), stopped = false, lastSpoken = "";
  return {
    update(text: string) {
      const current = text.trim();
      if (stopped || current === previous) return;
      previous = current;
      const speech = statusAnnouncement(current);
      if (!speech) { lastSpoken = ""; return; }
      // Consume background updates without replaying private/outdated state later.
      if (Platform.OS !== "ios" || AppState.currentState !== "active") { lastSpoken = ""; return; }
      if (speech === lastSpoken) return;
      lastSpoken = speech;
      // Low priority does not interrupt existing speech and avoids an app-side
      // deferred queue that could replay after the app backgrounds.
      AccessibilityInfo.announceForAccessibilityWithOptions(speech, { priority: "low" });
    },
    stop() { stopped = true; },
  };
}
export function useStatusAnnouncement(text: string) {
  const initialText = useRef(text);
  const announcer = useRef<ReturnType<typeof createStatusAnnouncer> | null>(null);
  useEffect(() => {
    const current = createStatusAnnouncer(initialText.current);
    announcer.current = current;
    return () => { current.stop(); if (announcer.current === current) announcer.current = null; };
  }, []);
  useEffect(() => { announcer.current?.update(text); }, [text]);
}


// A conditional panel may mount with an old error. Consume hidden updates and
// visibility transitions without replay; only a change while visible is new.
export function createVisibleStatusAnnouncer(initialText = "", initiallyVisible = false) {
  let current = createStatusAnnouncer(initialText), wasVisible = initiallyVisible, stopped = false;
  return {
    update(text: string, visible: boolean) {
      if (stopped) return;
      if (!visible || !wasVisible) {
        current.stop();
        current = createStatusAnnouncer(text);
      } else current.update(text);
      wasVisible = visible;
    },
    stop() { stopped = true; current.stop(); },
  };
}
export function useVisibleStatusAnnouncement(text: string, visible: boolean): "polite" | "none" {
  const initial = useRef({ text: text.trim(), visible });
  const announcer = useRef<ReturnType<typeof createVisibleStatusAnnouncer> | null>(null);
  const active = AppState.currentState === "active", currentText = text.trim();
  const [observed, setObserved] = useState(() => ({
    text: currentText, visible, active, liveRegion: "none" as "polite" | "none",
  }));
  let liveRegion = observed.liveRegion;
  if (observed.text !== currentText || observed.visible !== visible || observed.active !== active) {
    liveRegion = Platform.OS === "android" && active && observed.active &&
      visible && observed.visible && observed.text !== currentText &&
      statusAnnouncement(text) !== null ? "polite" : "none";
    setObserved({ text: currentText, visible, active, liveRegion });
  }
  useEffect(() => {
    const current = createVisibleStatusAnnouncer(initial.current.text, initial.current.visible);
    announcer.current = current;
    return () => { current.stop(); if (announcer.current === current) announcer.current = null; };
  }, []);
  useEffect(() => { announcer.current?.update(text, visible); }, [text, visible]);
  // Keep an eligible Android live region stable until its input changes. Old
  // mounted/revealed errors and background transitions remain non-live.
  return liveRegion;
}

// Start conservatively before the asynchronous OS preference resolves. An event
// newer than the query wins, and disposal ignores late promise completion.
export function observeReduceMotion(onChange: (enabled: boolean) => void) {
  let stopped = false, revision = 0;
  onChange(true);
  const subscription = AccessibilityInfo.addEventListener("reduceMotionChanged", enabled => {
    revision += 1;
    if (!stopped) onChange(enabled);
  });
  const queryRevision = revision;
  void AccessibilityInfo.isReduceMotionEnabled().then(enabled => {
    if (!stopped && revision === queryRevision) onChange(enabled);
  }).catch(() => {
    if (!stopped && revision === queryRevision) onChange(true);
  });
  return () => { stopped = true; subscription.remove(); };
}
