import React from "react";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Slot, router, usePathname } from "expo-router";
import { Provider } from "../state";
import { Button, useTheme } from "../ui";
function Shell() {
  const path = usePathname();
  const { colors, s, dark } = useTheme();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.paper }}>
      <StatusBar style={dark ? "light" : "dark"} />
      <View style={s.nav}>
        {[
          ["Today", "/"],
          ["Answers", "/answers"],
          ["Add", "/add"],
          ["More", "/more"],
        ].map(([label, route]) => (
          <Button
            key={route}
            label={label}
            selected={path === route}
            onPress={() =>
              router.navigate(route as "/" | "/answers" | "/add" | "/more")
            }
          />
        ))}
      </View>
      <View style={{ flex: 1 }}>
        <Slot />
      </View>
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
