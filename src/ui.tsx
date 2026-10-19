import React, { useState, useMemo, useRef } from "react";
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
  primary = false,
}: {
  label: string;
  onPress: () => void;
  selected?: boolean;
  disabled?: boolean;
  primary?: boolean;
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
        (selected || primary) && s.selected,
        focused && { borderColor: colors.ink, borderWidth: 2 },
        pressed && { elevation: 1, shadowOpacity: 0.06, borderBottomWidth: 1, transform: [{ translateY: 3 }] },
        disabled && { opacity: 0.55 },
      ]}
    >
      <Copy style={selected || primary ? { color: colors.paper, fontWeight: "700", textAlign: "center" } : { fontWeight: "600", textAlign: "center" }}>
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
  onSubmitEditing,
  disabled=false,
  maxLength,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  multiline?: boolean;
  onSubmitEditing?: () => void;
  disabled?:boolean;
  maxLength?:number;
}) {
  const { large } = useData();
  const { s } = useTheme();
  return (
    <View style={s.gap}>
      <Copy>{label}</Copy>
      <TextInput
        accessibilityLabel={label}
        value={value}
        editable={!disabled}
        accessibilityState={{disabled}}
        onChangeText={onChangeText}
        multiline={multiline}
        onSubmitEditing={onSubmitEditing}
        returnKeyType={onSubmitEditing ? "search" : undefined}
        maxLength={maxLength??(multiline ? 2000000 : 1000)}
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
  independent = false,
  hideHeading = false,
  restoreScrollY = 0,
  restoreReady = true,
  onScrollY,
  children,
}: {
  title: string;
  subtitle?: string;
  independent?: boolean;
  hideHeading?: boolean;
  restoreScrollY?:number;
  restoreReady?:boolean;
  onScrollY?:(y:number)=>void;
  children: React.ReactNode;
}) {
  const scroll=useRef<ScrollView>(null),restored=useRef(false),viewport=useRef(0),contentHeight=useRef(0);
  function restorePosition(){if(!restoreReady||restored.current||viewport.current<=0||contentHeight.current<=0)return;const y=Math.min(restoreScrollY,Math.max(0,contentHeight.current-viewport.current));scroll.current?.scrollTo({y,animated:false});restored.current=true;}
  const { ready, error, busy, reload, recover } = useData();
  const { s, colors } = useTheme();
  return (
    <ScrollView
      ref={scroll}
      onLayout={event=>{viewport.current=event.nativeEvent.layout.height;restorePosition();}}
      scrollEventThrottle={100}
      onScroll={onScrollY?event=>{if(restored.current)onScrollY(event.nativeEvent.contentOffset.y);}:undefined}
      onContentSizeChange={(_width,height)=>{contentHeight.current=height;restorePosition();}}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={s.page}
    >
      <View style={s.container}>
        {!hideHeading ? <Copy
          kind="small"
          style={{ color: colors.muted, fontWeight: "700", letterSpacing: 1.1 }}
        >
          YOUR HOME, REMEMBERED
        </Copy> : null}
        {!hideHeading ? <Copy accessibilityRole="header" kind="title">
          {title}
        </Copy> : null}
        {subtitle ? <Copy>{subtitle}</Copy> : null}
        {error && !independent ? (
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
        {independent || ready ? children : !error ? <Copy>Opening your answers…</Copy> : null}
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
    container: { width: "100%", maxWidth: 820, alignSelf: "center", gap: 12 },
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
      paddingVertical: 11,
      paddingHorizontal: 17,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: colors.muted,
      borderBottomWidth: 2,
      borderBottomColor: colors.line,
      backgroundColor: colors.accent,
      elevation: 6,
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.17,
      shadowRadius: 8,
      justifyContent: "center",
      alignItems: "center",
      flexShrink: 1,
    },
    selected: { backgroundColor: colors.ink, borderColor: colors.ink, borderBottomColor: colors.ink },
    input: {
      backgroundColor: colors.white,
      borderColor: colors.muted,
      borderWidth: 1,
      borderRadius: 15,
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
