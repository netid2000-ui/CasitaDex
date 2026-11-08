import {useData} from './state';
import React, { useEffect, useState } from "react";
import { AppState, Image, Text, View, useWindowDimensions } from "react-native";
import { Copy, useTheme } from "./ui";

const illustrations = {
  home: require("../assets/brand/illustration-home.jpg"),
  find: require("../assets/brand/illustration-find.jpg"),
  backup: require("../assets/brand/illustration-backup.jpg"),
};

/** Original Figma vector artwork rasterized without path edits; name remains real accessible text. */
export function BrandLogo({ width = 160 }: { width?: number }) {
  const { dark } = useTheme();
  const markWidth = Math.round(width * 0.39);
  const markHeight = markWidth * (366.3 / 495);
  const wordSize = Math.min(18, Math.max(12, width * 0.103));
  const wordColor = dark ? "#FFF9EC" : "#003F30";
  return <View accessible accessibilityRole="image" accessibilityLabel="CasitaDex, Designs by F and A"
    style={{ width, minHeight: 52, flexDirection: "row", alignItems: "center", gap: 6, flexShrink: 0 }}>
    <Image source={dark ? require("../assets/brand/logo-art-dark.png") : require("../assets/brand/logo-art-light.png")}
      accessible={false} resizeMode="contain" style={{ width: markWidth, height: markHeight, flexShrink: 0 }} />
    <View accessible={false} style={{ flex: 1, minWidth: 0, justifyContent: "center", gap: 3 }}>
      <Text allowFontScaling={false} numberOfLines={1}
        style={{ color: wordColor, fontSize: wordSize, fontWeight: "700", letterSpacing: -0.25 }}>CasitaDex</Text>
      <Text allowFontScaling={false} numberOfLines={1}
        style={{ color: wordColor, fontSize: Math.min(9, Math.max(7, width * 0.051)), fontWeight: "700", letterSpacing: 0.2 }}>DESIGNS BY F&A</Text>
    </View>
  </View>;
}
function LocalDate({compact=false}:{compact?:boolean}) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const refresh = () => setNow(new Date());
    const timer = setInterval(refresh, 60000);
    const listener = AppState.addEventListener("change", state => { if (state === "active") refresh(); });
    return () => { clearInterval(timer); listener.remove(); };
  }, []);
  const { colors } = useTheme();
  if(compact)return <View accessibilityLabel={now.toLocaleDateString(undefined,{dateStyle:"full"})}>
    <Copy maxFontSizeMultiplier={1.25} numberOfLines={2} style={{color:colors.ink,textAlign:"center",fontWeight:"600"}}>{now.toLocaleDateString(undefined,{dateStyle:"full"})}</Copy>
  </View>;
  return <View accessibilityLabel={now.toLocaleDateString(undefined, { dateStyle: "full" })} style={{ alignItems: "flex-end", flexShrink: 1 }}>
    <Copy kind="small" maxFontSizeMultiplier={1.35} numberOfLines={1} style={{ color: colors.muted }}>{now.toLocaleDateString(undefined, { weekday: "long" })}</Copy>
    <Copy maxFontSizeMultiplier={1.35} numberOfLines={1} style={{ fontWeight: "700", textAlign: "right" }}>{now.toLocaleDateString(undefined, { month: "long", day: "numeric" })}</Copy>
    <Copy kind="small" maxFontSizeMultiplier={1.35} numberOfLines={1} style={{ color: colors.muted }}>{now.getFullYear()}</Copy>
  </View>;
}

export function BrandHeader() {
  const { colors } = useTheme();
  const {fontScale}=useWindowDimensions();
  const {large:inAppLarge}=useData();
  const large=inAppLarge||fontScale>=1.35;
  return <View style={{ flexDirection:large?"column":"row", alignItems: "center", justifyContent: "space-between", gap:large?6:12, width: "100%", borderWidth: 1, borderColor: colors.muted, borderRadius: 16, minHeight: 81, paddingHorizontal: 12, paddingVertical: 8 }}>
    <BrandLogo width={large?150:176} />
    <LocalDate compact={large} />
  </View>;
}
/** Decorative; nearby live text conveys the meaning at every text size. */
export function BrandArt({ name, size = 104 }: { name: keyof typeof illustrations; size?: number }) {
  return <View accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants"
    aria-hidden style={{ width: size, maxWidth: "100%", aspectRatio: 1, borderRadius: 14,
      overflow: "hidden", backgroundColor: "#FAF8F2", alignSelf: "center", flexShrink: 0 }}>
    <Image source={illustrations[name]} accessible={false} resizeMode="contain"
      style={{ width: "100%", height: "100%" }} />
  </View>;
}

export function HomeArtwork() {
  return <View style={{ flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 16 }}>
    <BrandArt name="home" size={88} />
    <View style={{ flex: 1, minWidth: 160, gap: 4 }}>
      <Copy style={{ fontWeight: "600" }}>Keep the details that matter.</Copy>
      <Copy kind="small">A model number, a useful note, a place to find something.</Copy>
    </View>
  </View>;
}
