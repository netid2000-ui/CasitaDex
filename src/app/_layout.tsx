import React, {useEffect, useState} from "react";
import { StatusBar } from "expo-status-bar";
import { Image, Pressable, Text, View, useWindowDimensions } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Slot, router, useLocalSearchParams, useGlobalSearchParams, usePathname } from "expo-router";
import { Provider, useData } from "../state";
import { useTheme } from "../ui";
import { BrandWebMeta } from "../brand-web-meta";
import {editorialFonts} from "../theme";
import {useFonts} from "expo-font";
import {CormorantGaramond_700Bold} from "@expo-google-fonts/cormorant-garamond";
import {Inter_400Regular,Inter_600SemiBold} from "@expo-google-fonts/inter";
import {startPlusEntitlements} from "../plus-entitlement-runtime";

import {ApprovedIcon as NavigationIcon} from "../approved-icon";
import {AcceptedNavigationIcon} from "../accepted-navigation-icon";
import { guardedNavigate } from "../eng-navigation";
import {getEngStore} from "../eng-runtime";
import {listStandaloneReminders} from "../standalone-reminders";
import {addNotificationResponseReceivedListener,getLastNotificationResponseAsync} from "expo-notifications";

type Route = "/" | "/photos" | "/answers" | "/reminders";
const destinations: {label:"Home"|"Find"|"Photos"|"Reminders";route:Route}[]=[
 {label:"Home",route:"/"},{label:"Photos",route:"/photos"},{label:"Reminders",route:"/reminders"},{label:"Find",route:"/answers"},
];
function Shell() {
  const path = usePathname();
  const {mode:entryMode}=useLocalSearchParams<{mode?:string}>();
  const {mode:reminderMode,id:reminderId}=useGlobalSearchParams<{mode?:string;id?:string}>();
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
    "/reminders-manage":reminderId?["Editing a Reminder","Update your saved reminder."]:reminderMode==="new"?["Adding a Reminder","Set a reminder for something important."]:["Your Reminders","Manage reminders saved on this device."],
    "/more":["Settings","Manage your preferences and storage."],
    "/card":["Memory Details","Review a saved memory."],
    "/memories":["Your Memories","Browse your saved memories."],
  };
  const pageHeading=headings[path];
  const { colors, s, dark } = useTheme();
  const { fontScale, width } = useWindowDimensions();
  const {large:inAppLarge}=useData();
  const compactHeader=inAppLarge||fontScale>=1.35||width<360;
 const primaryTitle=({"/answers":"Find","/photos":"Photos","/more":"Settings","/memories":"Your Memories"} as Record<string,string>)[path];
 void pageHeading; void photoEntry;
  return (
    <SafeAreaView
      edges={["top"]}
      style={{ flex: 1, backgroundColor: colors.paper }}
    >
      <BrandWebMeta />
      <StatusBar style={dark ? "light" : "dark"} />
      {path==="/"||primaryTitle?<View style={{paddingHorizontal:18,paddingTop:8,paddingBottom:16,backgroundColor:colors.paper,gap:4}}>
        <View style={{minHeight:44,flexDirection:"row",alignItems:"center",justifyContent:"space-between"}}>
         <Pressable accessibilityRole="button" accessibilityLabel={path==="/more"?"Back to Home":"CasitaDex logo, go to Home"} onPress={()=>guardedNavigate(()=>router.navigate("/"))} style={{minHeight:44,justifyContent:"center"}}><Text style={{color:colors.ink,fontFamily:path==="/more"?editorialFonts.body:editorialFonts.heading,fontSize:path==="/more"?13:26}}>{path==="/more"?"‹  Home":"CasitaDex"}</Text></Pressable>
         {path==="/"?<Pressable accessibilityRole="button" accessibilityLabel="Settings" onPress={()=>guardedNavigate(()=>router.navigate("/more"))} style={{minHeight:44,justifyContent:"center"}}><Text style={{fontFamily:editorialFonts.body,color:colors.ink,fontSize:13}}>⚙  Settings</Text></Pressable>:null}
         {path==="/photos"&&!compactHeader?<View style={{position:"absolute",right:0,top:0,width:100,height:66,mixBlendMode:dark?"multiply":"normal"}}><Image accessible={false} source={require("../../assets/approved-refresh/homeDesign_imgWatercolorOliveBranch.jpg")} resizeMode="cover" style={{width:100,height:66}}/></View>:null}
        </View>
        {primaryTitle?<Text accessibilityRole="header" style={{color:colors.ink,fontFamily:editorialFonts.heading,fontSize:compactHeader?36:path==="/photos"?52:48}}>{primaryTitle}</Text>:null}
      </View>:null}
      <View style={{ flex: 1 }}>
        <Slot />
      </View>
      <SafeAreaView
        edges={["bottom"]}
        style={{ backgroundColor: colors.paper }}
      >
        <View style={s.nav} accessibilityLabel="Primary navigation">
          {destinations.map(({ label, route }) => {
            const active =
              path === route || (route === "/answers" && (path === "/card" || path === "/memories")) || (route === "/reminders" && path === "/reminders-manage");
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
                  active && {backgroundColor:dark?colors.white:colors.accent},
                  pressed && { opacity: 0.75 },
                ]}
              >
                {label==="Reminders"?<AcceptedNavigationIcon name="Reminders" color={active?colors.ink:colors.muted}/>:<NavigationIcon name={label}/> }
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
  const [fontsLoaded,fontError]=useFonts({CormorantGaramond_700Bold,Inter_400Regular,Inter_600SemiBold});
  useEffect(()=>startPlusEntitlements(),[]);
  const path = usePathname();
  if(!fontsLoaded&&!fontError)return <View style={{flex:1}}/>;
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
