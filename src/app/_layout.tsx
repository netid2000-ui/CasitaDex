import React, { useEffect } from "react";
import { startReminderAlerts } from "../reminder-alerts";
import { StatusBar } from "expo-status-bar";
import { Pressable, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Slot, router, usePathname } from "expo-router";
import { Provider } from "../state";
import { useTheme } from "../ui";
import { BrandWebMeta } from "../brand-web-meta";

import { AcceptedNavigationIcon as NavigationIcon } from "../accepted-navigation-icon";
import { guardedNavigate } from "../eng-navigation";

type Route = "/" | "/memories" | "/photos" | "/reminders" | "/answers";
const destinations: { label: "Home" | "Memories" | "Photos" | "Reminders" | "Find"; route: Route }[] = [
  { label: "Home", route: "/" },
  { label: "Memories", route: "/memories" },
  { label: "Photos", route: "/photos" },
  { label: "Reminders", route: "/reminders" },
  { label: "Find", route: "/answers" },
];
function Shell() {
  const path = usePathname();
  const { colors, s, dark } = useTheme();
  return (
    <SafeAreaView
      edges={["top"]}
      style={{ flex: 1, backgroundColor: colors.paper }}
    >
      <BrandWebMeta />
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
              path === route || (route === "/memories" && path === "/card");
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
  useEffect(startReminderAlerts, []);
  return (
    <SafeAreaProvider>
      <Provider>
        <Shell />
      </Provider>
    </SafeAreaProvider>
  );
}
