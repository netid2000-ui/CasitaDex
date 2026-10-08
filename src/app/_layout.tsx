import React from "react";
import { View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Slot, router, usePathname } from "expo-router";
import { Provider } from "../state";
import { Button, colors, s } from "../ui";
function Shell() {
  const path = usePathname();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.paper }}>
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
