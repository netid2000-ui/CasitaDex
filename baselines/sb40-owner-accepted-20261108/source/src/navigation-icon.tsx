import React from "react";
import { View, type ViewStyle } from "react-native";

// Original geometric line icons. No icon font, network asset, or platform glyph dependency.
export function NavigationIcon({ name, color }: { name: "Home" | "Memories" | "Photos" | "Reminders" | "Find"; color: string }) {
  const line = (style: ViewStyle, key: string) => <View key={key} style={[{ position: "absolute", backgroundColor: color, borderRadius: 1 }, style]} />;
  return <View accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={{ width: 26, height: 26 }}>
    {name === "Home" ? <>
      {line({ width: 15, height: 2, left: 1, top: 8, transform: [{ rotate: "-40deg" }] }, "roof-left")}
      {line({ width: 15, height: 2, right: 1, top: 8, transform: [{ rotate: "40deg" }] }, "roof-right")}
      <View style={{ position: "absolute", left: 5, right: 5, top: 11, bottom: 3, borderColor: color, borderWidth: 2, borderTopWidth: 0, borderBottomLeftRadius: 3, borderBottomRightRadius: 3 }} />
      {line({ left: 11, bottom: 3, width: 4, height: 7 }, "door")}
    </> : name === "Find" ? <>
      <View style={{ position: "absolute", width: 16, height: 16, top: 2, left: 2, borderWidth: 2, borderColor: color, borderRadius: 8 }} />
      {line({ width: 10, height: 2, left: 16, top: 20, transform: [{ rotate: "45deg" }] }, "handle")}
    </> : name === "Reminders" ? <>
      {line({ width: 18, height: 2, top: 12, left: 4 }, "horizontal")}
      {line({ width: 2, height: 18, top: 4, left: 12 }, "vertical")}
    </> : name === "Memories" ? <><View style={{ position: "absolute", left: 4, top: 3, width: 18, height: 20, borderWidth: 2, borderColor: color, borderRadius: 2 }} />{line({ left: 9, top: 9, width: 9, height: 2 }, "page-line-1")}{line({ left: 9, top: 15, width: 9, height: 2 }, "page-line-2")}</> : name === "Photos" ? <><View style={{ position: "absolute", left: 2, top: 4, width: 22, height: 18, borderWidth: 2, borderColor: color, borderRadius: 3 }} />{line({ left: 6, top: 16, width: 12, height: 2, transform: [{ rotate: "-28deg" }] }, "landscape")}</> : [5, 12, 19].map(left => <View key={left} style={{ position: "absolute", left, top: 11, width: 4, height: 4, borderRadius: 2, backgroundColor: color }} />)}
  </View>;
}
