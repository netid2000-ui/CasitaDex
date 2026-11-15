import {useTheme} from "../ui";
export type FAPlatform="ios"|"android";
export type FATheme="light"|"dark";
export type FAControlState="enabled"|"disabled"|"focused";
export const figmaHome=Object.freeze({page:"#F7F2E9",brandSurface:"#E2E7D4",actionSurface:"#273924",actionIconSurface:"#374727",actionInk:"#FFFBF2",eyebrowInk:"#273924",headingInk:"#273924",secondaryInk:"#675E53",actionWidth:370,actionHeight:48,actionRadius:8,iconSize:18});
export function figmaPrimaryCta(platform:FAPlatform,theme:FATheme,state:FAControlState){const dark=theme==="dark";return {height:48,minWidth:0,radius:8,backgroundColor:state==="disabled"?"#87948C":dark?"#232C23":"#273924",color:dark?"#EFEADC":"#FFFBF2",pressedBackgroundColor:dark?"#3A4B2F":"#374727",focusColor:dark?"#B8C7A5":"#374727",focusWidth:state==="focused"?3:0,focusHaloColor:"#B5AB9E"};}
export function useFigmaTheme(){const {colors}=useTheme();return {...figmaHome,page:colors.paper,brandSurface:colors.white,actionSurface:colors.primary,actionIconSurface:colors.accent,actionInk:colors.onPrimary,eyebrowInk:colors.ink,headingInk:colors.ink,secondaryInk:colors.muted};}
