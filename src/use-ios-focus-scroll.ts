import { useCallback, useEffect, useRef } from "react";
import { Keyboard, Platform, ScrollView, TextInput, type NativeScrollEvent, type NativeSyntheticEvent } from "react-native";
import { useNavigation } from "expo-router";

/** Reveal a focused field in this pane, not in an assumed full-screen scroll view. */
export function focusedScrollOffset(offset: number, contentHeight: number, viewportY: number, viewportHeight: number, inputY: number, inputHeight: number) {
  if (![offset, contentHeight, viewportY, viewportHeight, inputY, inputHeight].every(Number.isFinite) ||
      viewportHeight <= 0 || inputHeight <= 0 || contentHeight <= 0) return offset;
  const delta = inputHeight > viewportHeight
    // A larger control cannot fit completely: center the control rectangle, without shrinking text.
    ? inputY + inputHeight / 2 - viewportY - viewportHeight / 2
    : inputY < viewportY ? inputY - viewportY
    : Math.max(0, inputY + inputHeight - viewportY - viewportHeight);
  return Math.max(0, Math.min(contentHeight - viewportHeight, offset + delta));
}

/** iOS retains focus across rotation but does not reliably reveal it after large-text reflow. */
type FocusScrollState = {
  active: boolean; epoch: number; frame: number; offset: number; contentHeight: number; dragging: boolean;
  pending: { target: number; input: ReturnType<typeof TextInput.State.currentlyFocusedInput> } | null;
  reconcileAfterScroll: boolean;
};
export function useIOSFocusScroll() {
  const ref = useRef<ScrollView>(null);
  const state = useRef<FocusScrollState>({ active: false, epoch: 0, frame: 0, offset: 0, contentHeight: 0, dragging: false, pending: null, reconcileAfterScroll: false });
  const navigation = useNavigation();
  const ios = Platform.OS === "ios";

  const invalidate = useCallback(() => {
    const s = state.current;
    s.epoch += 1;
    if (s.frame) cancelAnimationFrame(s.frame);
    s.frame = 0;
  }, []);
  const schedule = useCallback(() => {
    invalidate();
    const s = state.current;
    if (!ios || !s.active || !navigation.isFocused() || s.dragging || !Keyboard.isVisible()) return;
    const scroll = ref.current, input = TextInput.State.currentlyFocusedInput();
    const native = scroll?.getNativeScrollRef();
    if (s.pending && s.pending.input !== input) { s.pending = null; s.reconcileAfterScroll = false; }
    if (s.pending) { s.reconcileAfterScroll = true; return; }
    if (!scroll || !native || !input || !native.contains(input)) return;
    const epoch = s.epoch, offset = s.offset;
    const current = () => s.active && navigation.isFocused() && !s.dragging && s.epoch === epoch && s.offset === offset &&
      ref.current === scroll && Keyboard.isVisible() &&
      TextInput.State.currentlyFocusedInput() === input && native.contains(input);
    // Wait for React Native's layout commit; completed keyboard events schedule a fresh measurement.
    s.frame = requestAnimationFrame(() => {
      s.frame = requestAnimationFrame(() => {
        s.frame = 0;
        if (!current()) return;
        native.measureInWindow((_x, y, _width, height) => {
          if (!current()) return;
          input.measureInWindow((_ix, iy, _iw, ih) => {
            if (!current()) return;
            const target = focusedScrollOffset(offset, s.contentHeight, y, height, iy, ih);
            if (Math.abs(target - offset) < 1) return;
            invalidate();
            s.pending = { target, input };
            scroll.scrollTo({ y: target, animated: false });
          });
        });
      });
    });
  }, [ios, invalidate, navigation]);
  useEffect(() => {
    if (!ios) return;
    const s = state.current;
    let subscriptions: { remove: () => void }[] = [];
    const deactivate = () => {
      s.active = false;
      s.dragging = false;
      s.pending = null;
      s.reconcileAfterScroll = false;
      invalidate();
      subscriptions.forEach(subscription => subscription.remove());
      subscriptions = [];
    };
    const hideKeyboard = () => { s.pending = null; s.reconcileAfterScroll = false; invalidate(); };
    const activate = () => {
      deactivate();
      s.active = true;
      subscriptions = [
        Keyboard.addListener("keyboardWillChangeFrame", invalidate),
        Keyboard.addListener("keyboardDidChangeFrame", schedule),
        Keyboard.addListener("keyboardDidShow", schedule),
        Keyboard.addListener("keyboardWillHide", hideKeyboard),
        Keyboard.addListener("keyboardDidHide", hideKeyboard),
      ];
      schedule();
    };
    const stopFocus = navigation.addListener("focus", activate);
    const stopBlur = navigation.addListener("blur", deactivate);
    if (navigation.isFocused()) activate();
    return () => { deactivate(); stopFocus(); stopBlur(); };
  }, [ios, navigation, invalidate, schedule]);
  const startDrag = () => {
    state.current.dragging = true; state.current.pending = null; state.current.reconcileAfterScroll = false; invalidate();
  };
  // Fabric also sends momentum-end after nonanimated scrollTo, without a user gesture.
  const stopDrag = () => {
    if (!state.current.dragging) return;
    state.current.dragging = false;
    invalidate();
  };
  return ios ? {
    ref,
    onLayout: schedule,
    onContentSizeChange: (_width: number, height: number) => { state.current.contentHeight = height; schedule(); },
    scrollEventThrottle: 16,
    onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offset = event.nativeEvent.contentOffset.y;
      const s = state.current;
      if (s.offset !== offset) { s.offset = offset; invalidate(); }
      // Movement alone may be a delayed pre-command event, not acknowledgment.
      const contentHeight = event.nativeEvent.contentSize?.height;
      const viewportHeight = event.nativeEvent.layoutMeasurement?.height;
      const nativeMaximum = Number.isFinite(contentHeight) && Number.isFinite(viewportHeight) &&
        contentHeight >= 0 && viewportHeight > 0 ? Math.max(0, contentHeight - viewportHeight) : undefined;
      const acknowledgedTarget = s.pending && nativeMaximum !== undefined
        ? Math.min(s.pending.target, nativeMaximum) : s.pending?.target;
      if (s.pending && acknowledgedTarget !== undefined && Math.abs(offset - acknowledgedTarget) < 1) {
        s.pending = null;
        if (s.reconcileAfterScroll) { s.reconcileAfterScroll = false; schedule(); }
      }
    },
    onScrollBeginDrag: startDrag,
    onScrollEndDrag: stopDrag,
    onMomentumScrollBegin: startDrag,
    onMomentumScrollEnd: stopDrag,
  } : undefined;
}
