import React, { useState, useMemo } from "react";
import {
  Platform,
  useColorScheme,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextProps,
} from "react-native";
import { useData } from "./state";
import { lightColors, darkColors } from "./theme";
export function useTheme() {
  const { appearance } = useData();
  const system = useColorScheme();
  const dark =
    appearance === "Dark" || (appearance === "System" && system === "dark");
  const colors = dark ? darkColors : lightColors;
  const s = useMemo(() => makeStyles(colors), [colors]);
  return { colors, s, dark };
}
export function Copy({
  children,
  kind = "body",
  ...props
}: TextProps & { kind?: "body" | "title" | "answer" | "small" }) {
  const { large } = useData();
  const { colors } = useTheme();
  const size =
    { body: 17, title: 31, answer: 29, small: 14 }[kind] * (large ? 2 : 1);
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
        kind === "title" || kind === "answer"
          ? { fontWeight: "700", letterSpacing: -0.4 }
          : null,
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
  const { colors, s } = useTheme();
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
  const { s } = useTheme();
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
  const { s, colors } = useTheme();
  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={s.page}
    >
      <View style={s.container}>
        <Copy
          kind="small"
          style={{ color: colors.muted, fontWeight: "700", letterSpacing: 1.1 }}
        >
          YOUR HOME, REMEMBERED
        </Copy>
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
const makeStyles = (colors: typeof lightColors) =>
  StyleSheet.create({
    page: {
      paddingHorizontal: 21,
      paddingTop: 20,
      paddingBottom: 40,
      backgroundColor: colors.paper,
      flexGrow: 1,
    },
    container: { width: "100%", maxWidth: 820, alignSelf: "center", gap: 16 },
    gap: { gap: 8 },
    row: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
    panel: {
      backgroundColor: colors.white,
      padding: 18,
      borderRadius: 19,
      borderWidth: 1,
      borderColor: colors.line,
      gap: 11,
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
      paddingTop: 7,
      paddingBottom: 8,
      paddingHorizontal: 7,
      flexDirection: "row",
      borderTopWidth: 1,
      borderColor: colors.line,
      gap: 5,
    },
    navTab: {
      flex: 1,
      minHeight: 55,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 14,
      paddingVertical: 5,
    },
    navTabActive: { backgroundColor: colors.accent },
    navIcon: { fontSize: 25, lineHeight: 28, fontWeight: "600" },
    navLabel: { fontSize: 12, fontWeight: "700" },
  });
