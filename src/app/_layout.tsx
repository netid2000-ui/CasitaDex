import React from "react";
import { StatusBar } from "expo-status-bar";
import { Pressable, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Slot, router, usePathname } from "expo-router";
import { Provider } from "../state";
import { useTheme } from "../ui";

import { NavigationIcon } from "../navigation-icon";
import { guardedNavigate } from "../eng-navigation";

type Route = "/" | "/answers" | "/add" | "/more";
const destinations: { label: "Home" | "Find" | "Add" | "More"; route: Route }[] = [
  { label: "Home", route: "/" },
  { label: "Find", route: "/answers" },
  { label: "Add", route: "/add" },
  { label: "More", route: "/more" },
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
          {destinations.map(({ label, route }) => {
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

                  active && s.navTabActive,
                  pressed && { opacity: 0.75 },
                ]}
              >
                <NavigationIcon name={label} color={active ? colors.ink : colors.muted} />
                <Text
                  style={[
                    s.navLabel,
                    { color: active ? colors.ink : colors.muted },
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
