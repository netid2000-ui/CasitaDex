import React from "react";
import { Image, View } from "react-native";

type Name = "Home" | "Memories" | "Photos" | "Reminders" | "Find";
const icons = {
  Home: require("../assets/ui-icons/figma-approved-v1/home.png"),
  Memories: require("../assets/ui-icons/figma-approved-v1/memories.png"),
  Photos: require("../assets/ui-icons/figma-approved-v1/photos.png"),
  Reminders: require("../assets/ui-icons/figma-approved-v1/reminders.png"),
  Find: require("../assets/ui-icons/figma-approved-v1/find.png"),
};
/** Accepted CasitaDex 24px outline pictograms; current platform color drives active state. */
export function AcceptedNavigationIcon({ name, color }: { name: Name; color: string }) {
  return <View accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={{width: 26, height: 26, alignItems: "center", justifyContent: "center"}}>
    <Image source={icons[name]} resizeMode="contain" style={{width: 24, height: 24, tintColor: color}} />
  </View>;
}
