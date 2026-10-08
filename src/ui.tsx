import React, { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextProps,
} from "react-native";
import { useData } from "./state";
export const colors = {
  paper: "#F5F2EA",
  ink: "#203F36",
  muted: "#52645C",
  line: "#CAD3C9",
  white: "#FFFFFF",
  accent: "#E8EDDB",
};
export function Copy({
  children,
  kind = "body",
  ...props
}: TextProps & { kind?: "body" | "title" | "answer" | "small" }) {
  const { large } = useData();
  const size =
    { body: 17, title: 32, answer: 29, small: 14 }[kind] * (large ? 2 : 1);
  return (
    <Text
      {...props}
      style={[
        {
          color: colors.ink,
          fontSize: size,
          lineHeight: size * 1.3,
          flexShrink: 1,
        },
        kind === "title" || kind === "answer" ? { fontWeight: "600" } : null,
        props.style,
      ]}
    >
      {children}
    </Text>
  );
}
export function Button({
  label,
  onPress,
  selected,
  disabled = false,
}: {
  label: string;
  onPress: () => void;
  selected?: boolean;
  disabled?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <Pressable
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      accessibilityRole="button"
      aria-pressed={Platform.OS === "web" ? selected : undefined}
      accessibilityState={
        Platform.OS === "web" ? { disabled } : { selected, disabled }
      }
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        s.button,
        selected && s.selected,
        (pressed || focused) && { borderColor: colors.ink, borderWidth: 1 },
        disabled && { opacity: 0.55 },
      ]}
    >
      <Copy style={selected ? { color: colors.white } : undefined}>
        {label}
      </Copy>
    </Pressable>
  );
}
export function Field({
  label,
  value,
  onChangeText,
  multiline = false,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  multiline?: boolean;
}) {
  const { large } = useData();
  return (
    <View style={s.gap}>
      <Copy>{label}</Copy>
      <TextInput
        accessibilityLabel={label}
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        maxLength={multiline ? 2000000 : 1000}
        style={[
          s.input,
          { fontSize: large ? 34 : 17, minHeight: multiline ? 120 : 52 },
        ]}
      />
    </View>
  );
}
export function Page({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  const { ready, error, busy, reload, recover } = useData();
  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={s.page}
    >
      <View style={s.container}>
        <Copy kind="small">CASITADEX · MY HOME</Copy>
        <Copy accessibilityRole="header" kind="title">
          {title}
        </Copy>
        {subtitle && <Copy>{subtitle}</Copy>}
        {error ? (
          <View accessibilityRole="alert" style={s.panel}>
            <Copy>{error}</Copy>
            <Button
              label="Retry loading"
              onPress={() => void reload()}
              disabled={busy}
            />
            <Button
              label="Recover previous save"
              onPress={() => void recover()}
              disabled={busy}
            />
          </View>
        ) : null}
        {ready ? children : !error ? <Copy>Opening your answers…</Copy> : null}
      </View>
    </ScrollView>
  );
}
export const s = StyleSheet.create({
  page: {
    padding: 24,
    paddingBottom: 48,
    backgroundColor: colors.paper,
    flexGrow: 1,
  },
  container: { width: "100%", maxWidth: 820, alignSelf: "center", gap: 18 },
  gap: { gap: 8 },
  row: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  panel: {
    backgroundColor: colors.white,
    padding: 22,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.line,
    gap: 12,
  },
  button: {
    minHeight: 52,
    minWidth: 48,
    paddingVertical: 12,
    paddingHorizontal: 17,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
    justifyContent: "center",
    flexShrink: 1,
  },
  selected: { backgroundColor: colors.ink, borderColor: colors.ink },
  input: {
    backgroundColor: colors.white,
    borderColor: colors.muted,
    borderWidth: 1,
    borderRadius: 10,
    padding: 14,
    color: colors.ink,
  },
  tag: { backgroundColor: colors.accent, padding: 10, borderRadius: 8 },
  nav: {
    backgroundColor: colors.white,
    padding: 12,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    borderBottomWidth: 1,
    borderColor: colors.line,
  },
});
