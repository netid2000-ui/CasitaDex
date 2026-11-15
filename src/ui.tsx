import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  AccessibilityInfo,
  Platform,
  Keyboard,
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
import { lightColors, darkColors, editorialFonts } from "./theme";
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
}: TextProps & { kind?: "body" | "title" | "answer" | "small" | "section" }) {
  const { large } = useData();
  const { colors } = useTheme();
  const size =
    { body: 14, title: 48, answer: 32, small: 13, section: 24 }[kind] * (large ? 1.6 : 1);
  return (
    <Text
      {...props}
      style={[
        {
          color: colors.ink,
          fontFamily:kind === "title" || kind === "answer" || kind === "section" ? editorialFonts.heading : editorialFonts.body,
          fontSize: size,
          lineHeight: size * 1.3,
          flexShrink: 1,
          minWidth: 0,
        },
        kind === "title" || kind === "answer"
          ? { letterSpacing: -0.4 }
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
  variant = "tonal",
  compact = false,
  icon,
  editorial=false,
  displayLabel,
  trailing,
}: {
  icon?:React.ReactNode;
  trailing?:React.ReactNode;
  editorial?:boolean;
  displayLabel?:string;
  label: string;
  onPress: () => void;
  selected?: boolean;
  disabled?: boolean;
  primary?: boolean;
  variant?: "tonal" | "quiet";
  compact?: boolean;
}) {
  const { colors, s } = useTheme();
  const [focused, setFocused] = useState(false);
  return (
    <Pressable
      accessibilityLabel={label.replace(/^✓\s*/,"")}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      accessibilityRole="button"
      aria-pressed={Platform.OS === "web" ? selected : undefined}
      accessibilityState={
        Platform.OS === "web" ? { disabled } : { selected, disabled }
      }
      disabled={disabled}
      onPress={onPress}
      onAccessibilityTap={disabled?undefined:onPress}
      style={({ pressed }) => [
        s.button,
        compact && s.compact,
        variant === "quiet" && s.quiet,
        selected && s.selected,
        primary && s.primary,
        editorial && {minHeight:Platform.OS === "android" ? 48 : 44,borderWidth:0,borderBottomWidth:0},
        editorial && variant==="quiet" && {backgroundColor:"transparent"},
        focused && { borderColor: colors.focus, borderWidth: 2 },
        pressed && { opacity: 0.82, elevation: 0, shadowOpacity: 0, transform: [{ translateY: 1 }] },
        disabled && (primary ? { opacity: 0.62, borderStyle: "solid" as const, backgroundColor: colors.primary, borderColor: colors.primary } : { opacity: 1, borderStyle: "dashed" as const, backgroundColor: colors.accent, borderColor: colors.line }),
      ]}
    >
      <View style={{flexDirection:"row",alignItems:"center",gap:8,minWidth:0,maxWidth:"100%",flexShrink:1,width:editorial&&trailing?"100%":undefined}}>{icon}{selected!==undefined?<Text accessible={false} style={{width:20,color:colors.ink,textAlign:"center"}}>{selected?"✓":""}</Text>:null}<Copy kind={editorial?"body":compact ? "small" : "body"} style={editorial?{color:primary?colors.onPrimary:colors.ink,fontWeight:"400",flex:trailing?1:undefined}:primary ? { color: colors.onPrimary, fontWeight: "700", textAlign: "center" } : { color: colors.ink, fontWeight: "700", textAlign: "center" }}>
        {displayLabel??label.replace(/^✓\s*/,"")}
      </Copy>{trailing}</View>
    </Pressable>
  );
}
export function Field({
  label,
  value,
  onChangeText,
  multiline = false,
  compactMultiline = false,
  onSubmitEditing,
  disabled=false,
  maxLength,
  iosTextView=false,
  nativeEditing=false,
  editorial=false,
  accessibilityFocusOnMount=false,
}: {
  accessibilityFocusOnMount?:boolean;
  editorial?:boolean;
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  multiline?: boolean;
  compactMultiline?: boolean;
  onSubmitEditing?: () => void;
  disabled?:boolean;
  maxLength?:number;
  iosTextView?:boolean;
  nativeEditing?:boolean;
}) {
  const { large } = useData();
  const { s, colors } = useTheme();
  const [focused, setFocused] = useState(false);
  // Isolated QA workaround for character loss in iOS single-line native input.
  const nativeTextView=iosTextView&&Platform.OS==='ios';
  // Let UIKit retain its selection during QA reminder edits. Only genuine
  // external changes (e.g. asynchronous reminder loading) write text back.
  const nativeOwned=nativeTextView&&nativeEditing;
  const inputRef=useRef<TextInput>(null);
  useEffect(()=>{
    if(!accessibilityFocusOnMount)return;
    const timer=setTimeout(()=>{if(inputRef.current)AccessibilityInfo.sendAccessibilityEvent(inputRef.current,"focus");},300);
    return ()=>clearTimeout(timer);
  },[accessibilityFocusOnMount]);
  const [initialValue]=useState(value);
  const latestNativeValue=useRef(value);
  useEffect(()=>{
    if(nativeOwned&&latestNativeValue.current!==value){
      latestNativeValue.current=value;
      inputRef.current?.setNativeProps({text:value});
    }
  },[nativeOwned,value]);
  return (
    <View style={[s.gap,editorial&&{gap:6}]}>
      <Copy style={{ fontWeight: editorial?"400":"600" }}>{label}</Copy>
      <TextInput
        ref={inputRef}
        accessibilityLabel={label}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        selectionColor={colors.focus}
        cursorColor={colors.focus}
        textAlignVertical={multiline ? "top" : "center"}
        value={nativeOwned?undefined:value}
        defaultValue={nativeOwned?initialValue:undefined}
        editable={!disabled}
        accessibilityState={{disabled}}
        onChangeText={text=>{latestNativeValue.current=text;onChangeText(text);}}
        multiline={multiline||nativeTextView}
        submitBehavior={nativeTextView&&!multiline?'blurAndSubmit':undefined}
        onSubmitEditing={onSubmitEditing}
        returnKeyType={onSubmitEditing ? "search" : undefined}
        maxLength={maxLength??(multiline ? 2000000 : 1000)}
        style={[
          s.input,
          editorial && {borderColor:colors.line},
          focused && { borderColor: colors.focus, borderWidth: 2 },
          disabled && { opacity: 1, borderStyle: "dashed" as const },
          { fontSize: large ? 22 : 14, minHeight: multiline ? (compactMultiline ? 76 : editorial?108:120) : editorial?48:52 },
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
  stickyActions,
  androidKeyboardAware = false,
  children,
}: {
  title: string;
  subtitle?: string;
  independent?: boolean;
  hideHeading?: boolean;
  restoreScrollY?:number;
  restoreReady?:boolean;
  onScrollY?:(y:number)=>void;
  stickyActions?:React.ReactNode;
  androidKeyboardAware?:boolean;
  children: React.ReactNode;
}) {
  const scroll=useRef<ScrollView>(null),restored=useRef(false),viewport=useRef(0),contentHeight=useRef(0);
  function restorePosition(){if(!restoreReady||restored.current||viewport.current<=0||contentHeight.current<=0)return;const y=Math.min(restoreScrollY,Math.max(0,contentHeight.current-viewport.current));scroll.current?.scrollTo({y,animated:false});restored.current=true;}
  const [keyboardInset,setKeyboardInset]=useState(0);
  const keyboardTop=useRef<number|null>(null),scrollOffset=useRef(0);
  const revealFocusedInput=React.useCallback(()=>{
    if(!androidKeyboardAware||Platform.OS!=="android")return;
    requestAnimationFrame(()=>{
      const input=TextInput.State.currentlyFocusedInput();
      const top=Keyboard.metrics()?.screenY??keyboardTop.current;
      if(input&&top!==null)input.measureInWindow((_x,y,_width,height)=>{
        const hidden=y+height-top+24;
        if(hidden>0)scroll.current?.scrollTo({y:scrollOffset.current+hidden,animated:true});
      });
    });
  },[androidKeyboardAware]);
  useEffect(()=>{
    if(!androidKeyboardAware||Platform.OS!=="android")return;
    const shown=Keyboard.addListener("keyboardDidShow",event=>{
      keyboardTop.current=event.endCoordinates.screenY;
      setKeyboardInset(event.endCoordinates.height);
      revealFocusedInput();
    });
    const hidden=Keyboard.addListener("keyboardDidHide",()=>{keyboardTop.current=null;setKeyboardInset(0);});
    return ()=>{shown.remove();hidden.remove();};
  },[androidKeyboardAware,revealFocusedInput]);
  const { ready, error, busy, reload, recover } = useData();
  const { s, colors } = useTheme();
  return (
    <View style={{flex:1,backgroundColor:colors.paper}}>
    {stickyActions?<View style={{paddingHorizontal:20,paddingVertical:10,borderBottomWidth:1,borderBottomColor:colors.line,backgroundColor:colors.paper,zIndex:2}}>{stickyActions}</View>:null}
    <ScrollView
      ref={scroll}
      keyboardDismissMode="on-drag"
      onLayout={event=>{viewport.current=event.nativeEvent.layout.height;restorePosition();}}
      scrollEventThrottle={100}
      onScroll={event=>{scrollOffset.current=event.nativeEvent.contentOffset.y;if(restored.current)onScrollY?.(scrollOffset.current);}}
      onContentSizeChange={(_width,height)=>{contentHeight.current=height;restorePosition();}}
      keyboardShouldPersistTaps="always"
      automaticallyAdjustKeyboardInsets
      onFocus={androidKeyboardAware&&Platform.OS==="android"?revealFocusedInput:undefined}
      contentContainerStyle={[s.page,keyboardInset>0?{paddingBottom:keyboardInset+24}:undefined]}
    >
      <View style={s.container}>
        {!hideHeading ? <Copy
          kind="small"
          style={{ color: colors.muted, fontWeight: "600", letterSpacing: 0.7 }}
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
    </View>
  );
}
const makeStyles = (colors: typeof lightColors) =>
  StyleSheet.create({
    page: {
      paddingHorizontal: 18,
      paddingTop: 16,
      paddingBottom: 40,
      backgroundColor: colors.paper,
      flexGrow: 1,
    },
    container: { width: "100%", maxWidth: 720, alignSelf: "center", gap: 16 },
    gap: { gap: 8 },
    row: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
    panel: {
      backgroundColor: colors.white,
      padding: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.separator,
      gap: 11,
    },
    button: {
      minHeight: Platform.OS === "android" ? 48 : 44,
      minWidth: 48,
      maxWidth: "100%",
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.line,
      borderBottomWidth: 1,
      borderBottomColor: colors.line,
      backgroundColor: colors.white,
      elevation: 0,
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0,
      shadowRadius: 3,
      justifyContent: "center",
      alignItems: "center",
      flexShrink: 1,
    },
    compact: { minHeight: 48, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, backgroundColor: colors.white, elevation: 0, shadowOpacity: 0 },
    selected: { backgroundColor: colors.accent, borderColor: colors.focus, borderWidth: 2 },
    primary: { backgroundColor: colors.primary, borderColor: colors.primary, borderBottomColor: colors.primary, elevation: 0, shadowOpacity: 0 },
    quiet: { backgroundColor: colors.accent, borderColor: colors.line, borderWidth: 1.5, elevation: 0, shadowOpacity: 0 },
    input: {
      backgroundColor: colors.white,
      borderColor: colors.muted,
      borderWidth: 1,
      borderRadius: 8,
      padding: 12,
      fontFamily: editorialFonts.body,
      color: colors.ink,
    },
    tag: { backgroundColor: colors.accent, padding: 10, borderRadius: 8 },
    nav: {
      backgroundColor: colors.paper,
      paddingTop: 12,
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
      borderRadius: 8,
      paddingVertical: 5,
    },
    navTabActive: { backgroundColor: colors.white },
    navIcon: { fontSize: 25, lineHeight: 28, fontWeight: "600" },
    navLabel: { fontSize: 12, fontFamily: editorialFonts.body },
  });
