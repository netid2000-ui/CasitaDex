import {reminderNotificationDestination} from "../reminder-notification-destination";
import {beginFreshFind} from "../find-context";
import React, {useEffect, useState} from "react";
import { StatusBar } from "expo-status-bar";
import { AppState, Image, Pressable, Text, View, useWindowDimensions } from "react-native";
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
function HomeDate(){
  const {colors}=useTheme();
  const [now,setNow]=useState(()=>new Date());
  useEffect(()=>{
    let timer:ReturnType<typeof setTimeout>;
    function refresh(){
      clearTimeout(timer);
      const date=new Date();
      setNow(date);
      timer=setTimeout(refresh,60000-date.getTime()%60000);
    }
    refresh();
    const subscription=AppState.addEventListener("change",state=>{if(state==="active")refresh();else clearTimeout(timer);});
    return ()=>{clearTimeout(timer);subscription.remove();};
  },[]);
  return <Text style={{fontFamily:editorialFonts.body,color:colors.ink,fontSize:14}}>
    {now.toLocaleDateString(undefined,{month:"short",day:"numeric",year:"numeric"})}
  </Text>;
}
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
      try{const reminder=(await listStandaloneReminders()).find(r=>r.id===data.casitaDexReminderId);const destination=reminderNotificationDestination(reminder,typeof data.casitaDexMemoryId==="string"?data.casitaDexMemoryId:null);if(active)router.push(destination);}catch{if(active)router.push("/reminders");}
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
 const isPrimaryTab=destinations.some(destination=>destination.route===path);
 const primaryTitle=({"/answers":"Find","/photos":"Photos","/reminders":"Reminders","/more":"Settings","/memories":"Your Memories"} as Record<string,string>)[path];
 void pageHeading; void photoEntry;
  return (
    <SafeAreaView
      edges={["top"]}
      style={{ flex: 1, backgroundColor: colors.paper }}
    >
      <BrandWebMeta />
      <StatusBar style={dark ? "light" : "dark"} />
      {isPrimaryTab||primaryTitle?<View style={{paddingHorizontal:18,paddingTop:8,paddingBottom:16,backgroundColor:colors.paper,gap:4}}>
        {(isPrimaryTab||!compactHeader||!primaryTitle||path==="/more")?<View style={{minHeight:44,flexDirection:compactHeader?"column":"row",alignItems:compactHeader?"flex-start":"center",justifyContent:"space-between"}}>
         <Pressable accessibilityRole="button" accessibilityLabel={path==="/more"?"Back to Home":"CasitaDex logo, go to Home"} onPress={()=>guardedNavigate(()=>router.navigate("/"))} style={{minHeight:44,justifyContent:"center"}}>{path==="/more"
           ? <Text style={{color:colors.ink,fontFamily:editorialFonts.body,fontSize:13}}>‹  Home</Text>
           : <Image accessible={false} source={dark?require("../../assets/home-brand/logo-right-dark.png"):require("../../assets/home-brand/logo-right-light.png")} resizeMode="contain" style={{width:148,height:36}}/>}</Pressable>
         {isPrimaryTab?<View style={{alignItems:compactHeader?"flex-start":"flex-end",flexShrink:1}}><HomeDate/><Pressable accessibilityRole="button" accessibilityLabel="Settings" onPress={()=>guardedNavigate(()=>router.navigate("/more"))} style={{minHeight:44,justifyContent:"center"}}><Text style={{fontFamily:editorialFonts.body,color:colors.ink,fontSize:13}}>⚙  Settings</Text></Pressable></View>:null}
        </View>:null}
        {primaryTitle?<Text accessibilityRole="header" style={{color:colors.ink,fontFamily:editorialFonts.heading,fontSize:compactHeader?20:path==="/photos"?52:48}}>{primaryTitle}</Text>:null}
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
                onPress={() => guardedNavigate(() => route === "/answers" ? router.navigate({pathname:"/answers",params:{lifecycle:"active",fresh:beginFreshFind(),origin:"tab"}}) : route === "/reminders" ? router.navigate({pathname:"/reminders",params:{origin:"tab"}}) : router.navigate(route))}
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
