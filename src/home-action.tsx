import React from "react";
import { Pressable, Text, View } from "react-native";
import { Copy, useTheme } from "./ui";
import { useData } from "./state";
import { AcceptedNavigationIcon } from "./accepted-navigation-icon";

// Selectively reconciled from figma-first-native-qa FigmaHome/HomeActionCard/tokens.
// The current store, draft controls and notification/navigation guards stay authoritative.
const light = { surface: "#E8DECB", action: "#1E4635", icon: "#477E65", heading: "#254736", secondary: "#566357" };
const dark = { surface: "#294334", action: "#244838", icon: "#477E65", heading: "#E7EFE9", secondary: "#B5C6BA" };
type Icon = "Memories" | "Photos" | "Reminders" | "Find";
export function HomeIntro({ onSettings }: { onSettings: () => void }) {
  const { dark: isDark, colors } = useTheme();
  const { large } = useData();
  const palette = isDark ? dark : light;
  const scale = large ? 2 : 1;
  return <View style={{ gap: 12 }}>
    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
      <Copy kind="small" style={{ flex: 1, fontSize: 12 * scale, lineHeight: 17 * scale, fontWeight: "700", letterSpacing: 1.1, color: palette.heading }}>YOUR PERSONAL REFERENCE</Copy>
      <Pressable accessibilityRole="button" accessibilityLabel="Settings" accessibilityHint="Opens settings, backup and recovery" onPress={onSettings}
        style={({ pressed }) => ({ minWidth: 48, minHeight: 48, borderRadius: 12, borderWidth: 1, borderColor: colors.muted, backgroundColor: palette.surface, alignItems: "center", justifyContent: "center", opacity: pressed ? 0.88 : 1 })}>
        <Text accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={{ fontSize: 26, color: palette.heading }}>⚙</Text>
      </Pressable>
    </View>
    <Copy accessibilityRole="header" style={{ fontSize: 25 * scale, lineHeight: 32.5 * scale, fontWeight: "700", color: palette.heading }}>The details that matter.</Copy>
    <Copy style={{ fontSize: 14 * scale, lineHeight: 21 * scale, color: palette.secondary }}>A calmer place to keep useful things.</Copy>
  </View>;
}
export function HomeAction({ title, detail, icon, primary=false, disabled=false, disabledDetail="Finish your existing draft first", onPress }: { title:string; detail:string; icon:Icon; primary?:boolean; disabled?:boolean; disabledDetail?:string; onPress:()=>void }) {
  const { dark: isDark, colors } = useTheme();
  const { large } = useData();
  const palette = isDark ? dark : light;
  const scale = large ? 2 : 1;
  const ink = primary ? "#FFFFFF" : palette.heading;
  return <Pressable accessibilityRole="button" accessibilityLabel={title} accessibilityHint={disabled ? disabledDetail : detail}
    disabled={disabled} accessibilityState={{disabled}} onPress={onPress} style={({pressed})=>({
      backgroundColor:primary?palette.action:palette.surface,borderRadius:17,
      borderWidth:disabled?1:0,borderColor:colors.muted,borderStyle:disabled?"dashed":"solid",
      paddingHorizontal:16,paddingVertical:14,flexDirection:"row",alignItems:"center",gap:14,minHeight:78,opacity:pressed?0.88:1
    })}>
    <View accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants"
      style={{width:42,height:42,borderRadius:12,backgroundColor:primary?palette.icon:palette.action,alignItems:"center",justifyContent:"center"}}>
      <AcceptedNavigationIcon name={icon} color="#FFFFFF" />
    </View>
    <View style={{flex:1,minWidth:0,gap:3}}>
      <Copy style={{fontSize:17*scale,lineHeight:22.1*scale,fontWeight:"700",color:ink}}>{title}</Copy>
      <Copy style={{fontSize:13*scale,lineHeight:16.9*scale,color:primary?"#E3F0E8":palette.secondary}}>{disabled?disabledDetail:detail}</Copy>
    </View>
  </Pressable>;
}
