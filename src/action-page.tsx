import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View, useWindowDimensions, type ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, Copy, useTheme } from "./ui";
import { useData } from "./state";
import { actionColumns, actionRegionLimit } from "./action-page-layout";
import { useIOSFocusScroll } from "./use-ios-focus-scroll";

type Action = { label: string; onPress: () => void; disabled?: boolean; primary?: boolean };
/** Fixed action region, not fixed-height buttons. Extreme layouts scroll actions independently. */
export function ActionPage({ title, actions, feedback, children }: { title: string; actions: Action[]; feedback?: React.ReactNode; children: React.ReactNode }) {
  const { colors, s } = useTheme();
  const { large } = useData();
  const { fontScale } = useWindowDimensions();
  const { top } = useSafeAreaInsets();
  const focusScroll = useIOSFocusScroll();
  const [bounds, setBounds] = useState({ width: 0, height: 0 });
  const columns = actionColumns(bounds.width - 40, fontScale, large);
  const ios = Platform.OS === "ios";
  const actionViewport: ViewStyle = { flexGrow: 0, flexShrink: 1, minHeight: 0, overflow: "hidden", maxHeight: bounds.height ? actionRegionLimit(bounds.height) : "40%" };
  const contentViewport: ViewStyle = { flex: 1, minHeight: 0, overflow: "hidden" };
  // Clipping the iOS ScrollView itself overrides Yoga's scroll-axis measurement semantics.
  // Keep clipping on a bounded parent and let the native scroll view measure its full content.
  const clip = (id: string, style: ViewStyle, child: React.ReactNode) => ios
    ? <View testID={id} style={style} collapsable={false} accessible={false}>{child}</View>
    : child;
  // Shell places this view directly below its top safe area; keyboard coordinates are screen-relative.
  // Padding remeasures the inner viewport without height mode\'s cached initial-height rotation behavior.
  return <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : Platform.OS === "android" ? "padding" : undefined}
    keyboardVerticalOffset={Platform.OS === "web" ? 0 : top} style={{ flex: 1, minHeight: 0 }}>
    <View style={{ flex: 1, minHeight: 0, backgroundColor: colors.paper }}
      onLayout={event => { const { width, height } = event.nativeEvent.layout; setBounds(old => old.width === width && old.height === height ? old : { width, height }); }}>
      {clip("memory-action-clip", actionViewport, <ScrollView testID="memory-action-region" accessibilityLabel="Memory actions"
        style={ios ? { flexGrow: 0, flexShrink: 1, minHeight: 0, overflow: "scroll" } : actionViewport}
        keyboardShouldPersistTaps="handled" nestedScrollEnabled
        contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 10 }}>
        <View style={{ width: "100%", maxWidth: 760, alignSelf: "center", gap: 10 }}>
          <View style={{ flexDirection: columns === 2 ? "row" : "column", gap: 10 }}>
            {actions.map(action => <View key={action.label} style={{ flex: columns === 2 ? 1 : undefined, minWidth: 0 }}><Button {...action} /></View>)}
          </View>
          {feedback}
          <Copy accessibilityRole="header" kind="section" style={{ textAlign: "center", fontWeight: "700", borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.muted, paddingVertical: 8 }}>{title}</Copy>
        </View>
      </ScrollView>)}
      {clip("memory-content-clip", contentViewport, <ScrollView testID="memory-content-region" style={ios ? { flex: 1, minHeight: 0, overflow: "scroll" } : contentViewport} {...focusScroll} keyboardShouldPersistTaps="handled" automaticallyAdjustKeyboardInsets={Platform.OS !== "ios"} nestedScrollEnabled contentContainerStyle={s.page}>
        <View style={s.container}>{children}</View>
      </ScrollView>)}
    </View>
  </KeyboardAvoidingView>;
}
