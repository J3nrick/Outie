import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { PreparationProvider } from "../data/store";
import { colors } from "../design/tokens";
import { useMaterialPreferences } from "../components/useMaterialPreferences";
import { useFonts } from "expo-font";
import { FontReadyContext } from "../design/typography";
export default function Layout() {
  const [fontsLoaded, fontError] = useFonts({
    SatoshiRegular: require("../../assets/fonts/Satoshi-Regular.ttf"),
    SatoshiMedium: require("../../assets/fonts/Satoshi-Medium.ttf"),
    SatoshiBold: require("../../assets/fonts/Satoshi-Bold.ttf"),
  });
  const { reduceMotion } = useMaterialPreferences();
  if (!fontsLoaded && !fontError) return null;
  return (
    <FontReadyContext.Provider value={fontsLoaded}>
      <SafeAreaProvider>
        <PreparationProvider>
          <StatusBar style="dark" />
          <Stack
            screenOptions={{
              animation: reduceMotion ? "fade" : "default",
              headerStyle: { backgroundColor: colors.background },
              headerTitleStyle: {
                fontFamily: fontsLoaded ? "SatoshiBold" : undefined,
                fontWeight: "normal",
              },
              headerTintColor: colors.accent,
              headerShadowVisible: false,
              contentStyle: { backgroundColor: colors.background },
              headerBackButtonDisplayMode: "minimal",
            }}
          >
            <Stack.Screen name="widgets" options={{ title: "Outie widgets" }} />
            <Stack.Screen name="reminder" options={{ title: "Outing reminder" }} />
            <Stack.Screen name="reminders" options={{ title: "Departure reminders", presentation: "modal" }} />
            <Stack.Screen name="demo" options={{ title: "Try Outie", presentation: "modal" }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="welcome" options={{ headerShown: false }} />
            <Stack.Screen
              name="setup"
              options={{
                title: "Set up reminders",
                presentation: "modal",
              }}
            />
            <Stack.Screen
              name="checklist"
              options={{ title: "Your essentials" }}
            />
            <Stack.Screen
              name="context"
              options={{ title: "Plan an activity", presentation: "modal" }}
            />
            <Stack.Screen name="places" options={{ title: "Saved places" }} />
            <Stack.Screen
              name="memory"
              options={{ title: "Your preferences" }}
            />
            <Stack.Screen
              name="connection"
              options={{ title: "Connections" }}
            />
            <Stack.Screen
              name="notification"
              options={{ title: "Departure check", presentation: "modal" }}
            />
            <Stack.Screen
              name="scenarios"
              options={{ title: "Preview scenarios" }}
            />
          </Stack>
        </PreparationProvider>
      </SafeAreaProvider>
    </FontReadyContext.Provider>
  );
}
