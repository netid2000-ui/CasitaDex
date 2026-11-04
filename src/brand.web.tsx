// Web Image already supplies an accessible img; do not duplicate its role on the wrapper.
import React, { useEffect, useState } from "react";
import { AppState, Image, View } from "react-native";
import { Copy, useTheme } from "./ui";

const illustrations = {
  home: require("../assets/brand/illustration-home.jpg"),
  find: require("../assets/brand/illustration-find.jpg"),
  backup: require("../assets/brand/illustration-backup.jpg"),
};

/** Approved full-color master, selected by appearance; never redraw geometry. */
export function BrandLogo({ width = 96 }: { width?: number }) {
  const { dark } = useTheme();
  return <Image source={dark ? require("../assets/brand/logo-color-dark.png") : require("../assets/brand/logo-color-light.png")}
    resizeMode="contain" accessibilityLabel="CasitaDex" style={{ width, height: width * 550 / 545, flexShrink: 0 }} />;
}
function LocalDate() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const refresh = () => setNow(new Date());
    const timer = setInterval(refresh, 60000);
    const listener = AppState.addEventListener("change", state => { if (state === "active") refresh(); });
    return () => { clearInterval(timer); listener.remove(); };
  }, []);
  const { colors } = useTheme();
  return <View accessibilityLabel={now.toLocaleDateString(undefined, { dateStyle: "full" })} style={{ alignItems: "flex-end", flexShrink: 1 }}>
    <Copy kind="small" style={{ color: colors.muted }}>{now.toLocaleDateString(undefined, { weekday: "long" })}</Copy>
    <Copy style={{ fontWeight: "700", textAlign: "right" }}>{now.toLocaleDateString(undefined, { month: "long", day: "numeric" })}</Copy>
    <Copy kind="small" style={{ color: colors.muted }}>{now.getFullYear()}</Copy>
  </View>;
}

export function BrandHeader() {
  const { colors } = useTheme();
  return <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12, width: "100%", borderWidth: 1, borderColor: colors.muted, borderRadius: 16, paddingHorizontal: 12, paddingVertical: 8 }}>
    <BrandLogo width={96} />
    <LocalDate />
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
