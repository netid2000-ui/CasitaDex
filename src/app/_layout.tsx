import React from "react";
import { StatusBar } from "expo-status-bar";
import { Pressable, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Slot, router, usePathname } from "expo-router";
import { Provider } from "../state";
import { useTheme } from "../ui";

import { guardedNavigate } from "../eng-navigation";

type Route = "/" | "/answers" | "/add" | "/more";
const destinations: { label: string; icon: string; route: Route }[] = [
  { label: "Home", icon: "⌂", route: "/" },
  { label: "Find", icon: "⌕", route: "/answers" },
  { label: "Add", icon: "+", route: "/add" },
  { label: "More", icon: "☰", route: "/more" },
];

function Shell() {
  const path = usePathname();
  const { colors, s, dark } = useTheme();
  return (
    <SafeAreaView
      edges={["top"]}
      style={{ flex: 1, backgroundColor: colors.paper }}
    >
      <StatusBar style={dark ? "light" : "dark"} />
      <View style={{ flex: 1 }}>
        <Slot />
      </View>
      <SafeAreaView
        edges={["bottom"]}
        style={{ backgroundColor: colors.white }}
      >
        <View style={s.nav} accessibilityLabel="Primary navigation">
          {destinations.map(({ label, icon, route }) => {
            const active =
              path === route || (route === "/answers" && path === "/card");
            return (
              <Pressable
                key={route}
                accessibilityRole="tab"
                accessibilityLabel={label}
                accessibilityState={{ selected: active }}
                onPress={() => guardedNavigate(() => router.navigate(route))}
                style={({ pressed }) => [
                  s.navTab,
                  label === "Add" && { backgroundColor: colors.ink, borderRadius: 999, alignSelf: "center", flex: 0, width: 62, minHeight: 62, elevation: 5 },
                  active && s.navTabActive,
                  pressed && { opacity: 0.75 },
                ]}
              >
                <Text
                  style={[
                    s.navIcon,
                    { color: label === "Add" ? colors.paper : active ? colors.ink : colors.muted },
                  ]}
                  accessibilityElementsHidden
                >
                  {icon}
                </Text>
                <Text
                  style={[
                    s.navLabel,
                    { color: label === "Add" ? colors.paper : active ? colors.ink : colors.muted },
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
  return (
    <SafeAreaProvider>
      <Provider>
        <Shell />
      </Provider>
    </SafeAreaProvider>
  );
}
