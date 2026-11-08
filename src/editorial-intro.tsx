import React from "react";
import { View } from "react-native";
import { Copy, useTheme } from "./ui";

/** Shared Warm Editorial hierarchy; native text remains scalable and accessible. */
export function EditorialIntro({ eyebrow, title, description }: { eyebrow:string; title:string; description:string }) {
  const { colors }=useTheme();
  return <View style={{ gap: 7, paddingTop: 14, paddingBottom: 20 }}>
    <Copy kind="small" maxFontSizeMultiplier={2} style={{ fontWeight: "800", letterSpacing: 1.1, color: colors.primary }}>{eyebrow.toUpperCase()}</Copy>
    <Copy kind="title" maxFontSizeMultiplier={2} accessibilityRole="header" style={{ fontWeight: "800", letterSpacing: -0.5 }}>{title}</Copy>
    <Copy maxFontSizeMultiplier={2} style={{ color: colors.muted }}>{description}</Copy>
  </View>;
}