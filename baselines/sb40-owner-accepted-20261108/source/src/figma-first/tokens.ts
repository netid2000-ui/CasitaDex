import { useColorScheme } from "react-native";
import { useData } from "../state";
/** Figma A.2 observed component tokens. Node IDs: Android Home 28:265, Apple Home 28:38, CTA 109:111. */
export type FAPlatform = "ios" | "android";
export type FATheme = "light" | "dark";
export type FAControlState = "enabled" | "disabled" | "focused";
export const figmaHome = Object.freeze({
  page: "#F7F2E8", brandSurface: "#E8DECB", actionSurface: "#1E4635",
  actionIconSurface: "#477E65", actionInk: "#FFFFFF",
  eyebrowInk: "#1E4635", headingInk: "#254736", secondaryInk: "#566357",
  actionWidth: 370, actionHeight: 78, actionRadius: 17, iconSize: 42,
});
export function figmaPrimaryCta(platform:FAPlatform,theme:FATheme,state:FAControlState) {
  const dark = theme === "dark";
  return {
    height: 49, minWidth: 0, radius: platform === "ios" ? 11 : 24,
    backgroundColor: state === "disabled" ? "#87948C" : dark ? "#C5DFC7" : "#174C38",
    color: dark ? "#173D2E" : "#FFFFFF",
    pressedBackgroundColor: dark ? "#AED1B1" : "#103C30", focusColor: dark ? "#173D2E" : "#F2A640", focusWidth: state === "focused" ? 3 : 0, focusHaloColor: "#F2A640",
  } as const;
}

export function useFigmaTheme(){
 const {appearance}=useData();
 const system=useColorScheme();
 const dark=appearance==="Dark"||(appearance==="System"&&system==="dark");
 return dark?{
 ...figmaHome,
 page:"#101C17",brandSurface:"#294334",actionSurface:"#244838",actionIconSurface:"#477E65",
 actionInk:"#FFFFFF",eyebrowInk:"#D5E7D7",headingInk:"#E7EFE9",secondaryInk:"#B5C6BA",
 }:figmaHome;
}
