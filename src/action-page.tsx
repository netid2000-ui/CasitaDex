import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, Copy, useTheme } from "./ui";
import { useData } from "./state";
import { actionColumns, actionRegionLimit } from "./action-page-layout";

type Action = { label: string; onPress: () => void; disabled?: boolean; primary?: boolean };
/** Fixed action region, not fixed-height buttons. Extreme layouts scroll actions independently. */
export function ActionPage({ title, actions, children }: { title: string; actions: Action[]; children: React.ReactNode }) {
  const { colors, s } = useTheme();
  const { large } = useData();
  const { fontScale } = useWindowDimensions();
  const { top } = useSafeAreaInsets();
  const [bounds, setBounds] = useState({ width: 0, height: 0 });
  const columns = actionColumns(bounds.width - 40, fontScale, large);
  // Shell places this view directly below its top safe area; keyboard coordinates are screen-relative.
  // Padding remeasures the inner viewport without height mode\'s cached initial-height rotation behavior.
  return <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : Platform.OS === "android" ? "padding" : undefined}
    keyboardVerticalOffset={Platform.OS === "web" ? 0 : top} style={{ flex: 1, minHeight: 0 }}>
    <View style={{ flex: 1, minHeight: 0, backgroundColor: colors.paper }}
      onLayout={event => { const { width, height } = event.nativeEvent.layout; setBounds(old => old.width === width && old.height === height ? old : { width, height }); }}>
      <ScrollView testID="memory-action-region" accessibilityLabel="Memory actions"
        style={{ flexGrow: 0, flexShrink: 1, minHeight: 0, overflow: "hidden", maxHeight: bounds.height ? actionRegionLimit(bounds.height) : "40%" }}
        keyboardShouldPersistTaps="handled" nestedScrollEnabled
        contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 10 }}>
        <View style={{ width: "100%", maxWidth: 760, alignSelf: "center", gap: 10 }}>
          <View style={{ flexDirection: columns === 2 ? "row" : "column", gap: 10 }}>
            {actions.map(action => <View key={action.label} style={{ flex: columns === 2 ? 1 : undefined, minWidth: 0 }}><Button {...action} /></View>)}
          </View>
          <Copy accessibilityRole="header" kind="section" style={{ textAlign: "center", fontWeight: "700", borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.muted, paddingVertical: 8 }}>{title}</Copy>
        </View>
      </ScrollView>
      <ScrollView testID="memory-content-region" style={{ flex: 1, minHeight: 0, overflow: "hidden" }} keyboardShouldPersistTaps="handled" automaticallyAdjustKeyboardInsets={Platform.OS !== "ios"} nestedScrollEnabled contentContainerStyle={s.page}>
        <View style={s.container}>{children}</View>
      </ScrollView>
    </View>
  </KeyboardAvoidingView>;
}
