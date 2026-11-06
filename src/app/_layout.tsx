import React, { useEffect } from "react";
import { startReminderAlerts, startReminderResponses } from "../reminder-alerts";
import { StatusBar } from "expo-status-bar";
import { Pressable, Text, View, useWindowDimensions } from "react-native";
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Slot, router, usePathname, useRootNavigationState } from "expo-router";
import { Provider } from "../state";
import { useTheme } from "../ui";
import { BrandWebMeta } from "../brand-web-meta";

import { AcceptedNavigationIcon as NavigationIcon } from "../accepted-navigation-icon";
import { guardedNavigate, navigationIsGuarded } from "../eng-navigation";

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
  const rootState = useRootNavigationState();
  useEffect(() => {
    if (!rootState?.key) return;
    return startReminderResponses(route => {
      if (navigationIsGuarded()) return false;
      router.push(route);
      return true;
    });
  }, [rootState?.key]);
  const { colors, s, dark } = useTheme();
  const { width, fontScale } = useWindowDimensions();
  const { left, right } = useSafeAreaInsets();
  const useTwoRows = width - left - right < 365 * Math.max(1, fontScale);
  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
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
        <View style={[s.nav, useTwoRows && s.navWrapped]} accessibilityLabel="Primary navigation">
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
                  useTwoRows && s.navTabWrapped,
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
