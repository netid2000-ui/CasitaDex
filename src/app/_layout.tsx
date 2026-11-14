import React, {useEffect, useState} from "react";
import { StatusBar } from "expo-status-bar";
import { Pressable, Text, View, useWindowDimensions } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Slot, router, useLocalSearchParams, usePathname } from "expo-router";
import { Provider, useData } from "../state";
import { useTheme } from "../ui";
import { BrandWebMeta } from "../brand-web-meta";
import { BrandHeader } from "../brand";

import { AcceptedNavigationIcon as NavigationIcon } from "../accepted-navigation-icon";
import { guardedNavigate } from "../eng-navigation";
import {getEngStore} from "../eng-runtime";
import {listStandaloneReminders} from "../standalone-reminders";
import {addNotificationResponseReceivedListener,getLastNotificationResponseAsync} from "expo-notifications";

type Route = "/" | "/memories" | "/photos" | "/reminders" | "/answers";
const destinations: { label: "Home" | "Memories" | "Photos" | "Reminders" | "Find"; route: Route }[] = [
  { label: "Home", route: "/" },
  { label: "Photos", route: "/photos" },
  { label: "Reminders", route: "/reminders" },
  { label: "Find", route: "/answers" },
];
function Shell() {
  const path = usePathname();
  const {mode:entryMode}=useLocalSearchParams<{mode?:string}>();
  const [draftHasPhotos,setDraftHasPhotos]=useState(false);
  useEffect(()=>{if(path!=="/add")return;let active=true;void getEngStore().then(store=>store.load()).then(snapshot=>{if(active)setDraftHasPhotos((snapshot.draft?.photos.length??0)>0);}).catch(()=>{});return()=>{active=false;};},[path,entryMode]);
  useEffect(()=>{
    let active=true;
    const openLinked=async(response:{notification:{request:{content:{data?:Record<string,unknown>}}}})=>{
      const data=response.notification.request.content.data;
      if(data?.casitaDexType!=="standalone-v1"||typeof data.casitaDexReminderId!=="string")return;
      try{const reminder=(await listStandaloneReminders()).find(r=>r.id===data.casitaDexReminderId);const memoryId=reminder?.memoryId??(typeof data.casitaDexMemoryId==="string"?data.casitaDexMemoryId:null);if(active&&memoryId)router.push({pathname:"/card",params:{id:memoryId}});else if(active)router.push("/reminders");}catch{if(active)router.push("/reminders");}
    };
    const subscription=addNotificationResponseReceivedListener(response=>{void openLinked(response);});
    void getLastNotificationResponseAsync().then(response=>{if(response&&active)void openLinked(response);}).catch(()=>{});
    return()=>{active=false;subscription.remove();};
  },[]);
  const photoEntry=path==="/add"&&(entryMode==="photo"||draftHasPhotos);
  const headings:Record<string,[string,string]>={
    "/add":photoEntry?["Adding a Photo Memory","Add photos and a description to remember."]:["Adding a Memory","Save a detail you want to remember."],
    "/answers":["Finding a Memory","Search or browse your saved memories."],
    "/photos":["Your Photos","View and manage memory photos."],
    "/reminders":["Your Reminders","Review your upcoming reminders."],
    "/reminders-manage":["Adding a Reminder","Set a reminder for something important."],
    "/more":["Settings","Manage your preferences and storage."],
    "/card":["Memory Details","Review a saved memory."],
    "/memories":["Your Memories","Browse your saved memories."],
  };
  const pageHeading=headings[path];
  const { colors, s, dark } = useTheme();
  const { fontScale, width } = useWindowDimensions();
  const {large:inAppLarge}=useData();
  const stackedHeader=inAppLarge||fontScale>=1.35||width<360;
  return (
    <SafeAreaView
      edges={["top"]}
      style={{ flex: 1, backgroundColor: colors.paper }}
    >
      <BrandWebMeta />
      <StatusBar style={dark ? "light" : "dark"} />
      <View style={{minHeight:64, flexDirection:stackedHeader?"column":"row",alignItems:"center",justifyContent:"space-between",paddingHorizontal:12,paddingVertical:6,backgroundColor:colors.white,borderBottomWidth:1,borderBottomColor:colors.separator}}>
        <Pressable accessibilityRole="button" accessibilityLabel="CasitaDex logo, go to Home" accessibilityHint="Opens the Home screen" onPress={() => guardedNavigate(() => router.navigate("/"))} style={{width:stackedHeader?"100%":undefined,flex:stackedHeader?undefined:1,marginRight:stackedHeader?0:8,minWidth:0}}><BrandHeader /></Pressable>

      </View>
      {pageHeading?<View style={{paddingHorizontal:16,paddingVertical:9,backgroundColor:colors.white,borderBottomWidth:1,borderBottomColor:colors.separator,gap:3}}><Text key={`heading-${fontScale}`} accessibilityRole="header" style={{color:colors.ink,fontSize:20,fontWeight:"700"}}>{pageHeading[0]}</Text><Text key={`description-${fontScale}`} style={{color:colors.muted,fontSize:13}}>{pageHeading[1]}</Text></View>:null}
      <View style={{ flex: 1 }}>
        <Slot />
      </View>
      <SafeAreaView
        edges={["bottom"]}
        style={{ backgroundColor: colors.white }}
      >
        <View style={s.nav} accessibilityLabel="Primary navigation">
          {destinations.map(({ label, route }) => {
            const active =
              path === route || (route === "/answers" && (path === "/card" || path === "/memories"));
            return (
              <Pressable
                key={route}
                accessibilityRole="tab"
                accessibilityLabel={label}
                accessibilityState={{ selected: active }}
                aria-selected={active}
                onPress={() => guardedNavigate(() => router.navigate(route))}
                style={({ pressed }) => [
                  s.navTab,
                  (fontScale >= 1.35 || inAppLarge) && { minHeight: 70 },

                  active && s.navTabActive,
                  pressed && { opacity: 0.75 },
                ]}
              >
                <NavigationIcon name={label} color={active ? colors.ink : colors.muted} />
                <Text maxFontSizeMultiplier={1.2} numberOfLines={1} adjustsFontSizeToFit
                  style={[
                    s.navLabel,
                    { color: active ? colors.ink : colors.muted, textAlign: "center" },
                  ]}
                >
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </SafeAreaView>
    </SafeAreaView>
  );
}

export default function Layout() {
  const path = usePathname();
  if (path === "/sb29-review") return <Slot />;
  if (path === "/photo-viewer") return <SafeAreaProvider><Provider><Slot /></Provider></SafeAreaProvider>;
  return (
    <SafeAreaProvider>
      <Provider>
        <Shell />
      </Provider>
    </SafeAreaProvider>
  );
}
