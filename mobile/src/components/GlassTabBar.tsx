import { useEffect, useState, type ComponentProps } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  type ViewStyle,
} from "react-native";
import { Tabs } from "expo-router";
import { BlurView } from "expo-blur";
import {
  GlassView,
  isGlassEffectAPIAvailable,
  isLiquidGlassAvailable,
} from "expo-glass-effect";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  type SharedValue,
} from "react-native-reanimated";
import { Icon, type IconName } from "./Icon";
import { useMaterialPreferences } from "./useMaterialPreferences";
import { useAppFont } from "../design/typography";
import { colors } from "../design/tokens";
type BarProps = Parameters<
  NonNullable<ComponentProps<typeof Tabs>["tabBar"]>
>[0];
const icons: Record<string, [IconName, IconName]> = {
  index: ["door", "doorBold"],
  essentials: ["bag", "bagBold"],
  settings: ["settings", "settingsBold"],
};
// Keep navigation labels legible without letting the dock occupy the screen.
function barHeight(fontScale: number) {
  return fontScale <= 1.3 ? 76 : 48 + 15 * Math.min(fontScale, 1.6) * 2;
}
export function glassBarSpace(bottom: number, fontScale: number) {
  return barHeight(fontScale) + Math.max(bottom, 12) + 12;
}
function TabButton({
  label,
  icon,
  focused,
  reduceMotion,
  onPress,
  onLongPress,
  index,
  position,
  pressure,
}: {
  index: number;
  position: SharedValue<number>;
  pressure: SharedValue<number>;
  label: string;
  icon: IconName;
  focused: boolean;
  reduceMotion: boolean;
  onPress: () => void;
  onLongPress: () => void;
}) {
  const fontFamily = useAppFont(focused ? 700 : 500);
  const { fontScale } = useWindowDimensions();
  const scale = useSharedValue(1);
  const animated = useAnimatedStyle(() => ({
    transform: [{ scale: scale.get() }],
  }));
  const iconMotion = useAnimatedStyle(() => {
    const proximity = Math.max(0, 1 - Math.abs(position.get() - index));
    return {
      transform: [
        { translateY: reduceMotion ? 0 : -3 * proximity },
        { scale: reduceMotion ? 1 : 1 + 0.08 * proximity },
      ],
    };
  });
  useEffect(() => {
    if (reduceMotion) scale.set(1);
  }, [reduceMotion, scale]);
  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityLabel={label}
      accessibilityState={{ selected: focused }}
      onPress={onPress}
      onLongPress={onLongPress}
      pressRetentionOffset={16}
      onPressIn={() => {
        pressure.set(
          reduceMotion
            ? 0
            : withTiming(1, {
                duration: 100,
                reduceMotion: ReduceMotion.System,
              }),
        );
        scale.set(
          reduceMotion
            ? 1
            : withTiming(0.97, {
                duration: 120,
                reduceMotion: ReduceMotion.System,
              }),
        );
      }}
      onPressOut={() => {
        pressure.set(
          reduceMotion
            ? 0
            : withSpring(0, {
                duration: 400,
                dampingRatio: 1,
                reduceMotion: ReduceMotion.System,
              }),
        );
        scale.set(
          reduceMotion
            ? 1
            : withTiming(1, {
                duration: 120,
                reduceMotion: ReduceMotion.System,
              }),
        );
      }}
      style={({ pressed }) => [s.tab, { opacity: pressed ? 0.75 : 1 }]}
    >
      <Animated.View style={[s.tabContent, animated]}>
        <Animated.View style={iconMotion}>
          <Icon
            name={icon}
            size={25}
            color={focused ? colors.accent : colors.ink}
          />
        </Animated.View>
        <Text
          key={fontScale}
          maxFontSizeMultiplier={1.6}
          style={[
            s.label,
            {
              fontFamily,
              fontWeight: fontFamily ? "normal" : focused ? "700" : "500",
              color: focused ? colors.accent : colors.ink,
            },
          ]}
        >
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}
export function GlassTabBar({ state, descriptors, navigation }: BarProps) {
  const insets = useSafeAreaInsets();
  const { fontScale } = useWindowDimensions();
  const preferences = useMaterialPreferences();
  const solid = preferences.reduceTransparency || preferences.increaseContrast;
  const nativeGlass =
    Platform.OS === "ios" &&
    isLiquidGlassAvailable() &&
    isGlassEffectAPIAvailable() &&
    !solid;
  const [width, setWidth] = useState(0);
  const position = useSharedValue(state.index);
  const trailing = useSharedValue(state.index);
  const pressure = useSharedValue(0);
  useEffect(() => {
    if (preferences.reduceMotion) pressure.set(0);
    trailing.set(
      preferences.reduceMotion
        ? state.index
        : withSpring(state.index, {
            duration: 400,
            dampingRatio: 1,
            overshootClamping: true,
            reduceMotion: ReduceMotion.System,
          }),
    );
    position.set(
      preferences.reduceMotion
        ? state.index
        : withSpring(state.index, {
            duration: 300,
            dampingRatio: 1,
            overshootClamping: true,
            reduceMotion: ReduceMotion.System,
          }),
    );
  }, [state.index, preferences.reduceMotion, position, trailing, pressure]);
  const cellWidth = (width - 14) / state.routes.length;
  // Two critically damped edges give the lens a small directional stretch.
  // Retargeting uses the current presentation values, including rapid reversals.
  const indicator = useAnimatedStyle(() => {
    const stretch =
      Math.min(Math.abs(position.get() - trailing.get()), 0.38) * cellWidth;
    const center = (position.get() + trailing.get()) * 0.5 * cellWidth;
    return {
      width: Math.max(0, cellWidth + stretch),
      transform: [
        { translateX: center - stretch * 0.5 },
        { scaleY: preferences.reduceMotion ? 1 : 1 - 0.04 * pressure.get() },
      ],
    };
  });
  const glint = useAnimatedStyle(() => ({
    opacity:
      preferences.reduceMotion || solid
        ? 0
        : Math.min(
            Math.abs(position.get() - trailing.get()) * 3 +
              pressure.get() * 0.3,
            0.8,
          ),
    transform: [{ translateX: position.get() * cellWidth }],
  }));
  const webGlass: ViewStyle & {
    backdropFilter?: string;
    WebkitBackdropFilter?: string;
  } =
    Platform.OS === "web" && !solid
      ? {
          backgroundColor: "rgba(255,255,255,0.32)",
          backdropFilter: "blur(24px) saturate(180%)",
          WebkitBackdropFilter: "blur(24px) saturate(180%)",
        }
      : {
          backgroundColor: solid
            ? "#F7F8F7"
            : Platform.OS === "android"
              ? "rgba(247,248,247,0.9)"
              : "transparent",
        };
  return (
    <View
      pointerEvents="box-none"
      style={[s.position, { bottom: Math.max(insets.bottom, 12) }]}
    >
      <View
        style={[
          s.shadow,
          {
            minHeight: barHeight(fontScale),
            maxWidth: fontScale > 1.3 ? 420 : 340,
          },
        ]}
      >
        <View
          style={[
            s.shell,
            webGlass,
            preferences.increaseContrast && { borderColor: colors.slate },
          ]}
          onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
        >
          {nativeGlass && (
            <GlassView
              pointerEvents="none"
              colorScheme="light"
              tintColor="rgba(255,255,255,0.24)"
              glassEffectStyle="regular"
              style={StyleSheet.absoluteFill}
            />
          )}
          {!solid && !nativeGlass && Platform.OS === "ios" && (
            <BlurView
              pointerEvents="none"
              tint="systemUltraThinMaterialLight"
              intensity={70}
              style={StyleSheet.absoluteFill}
            />
          )}
          {!solid && <View pointerEvents="none" style={s.reflection} />}
          {!!width && (
            <Animated.View
              pointerEvents="none"
              style={[
                s.selection,
                {
                  width: Math.max(cellWidth, 0),
                  backgroundColor: solid ? colors.paleAccent : "rgba(255,255,255,0.55)",
                },
                indicator,
              ]}
            />
          )}
          {!!width && (
            <Animated.View
              pointerEvents="none"
              style={[s.glint, { width: cellWidth * 0.64 }, glint]}
            />
          )}
          <View
            accessibilityRole={Platform.OS === "web" ? "tablist" : undefined}
            style={s.tabs}
          >
            {state.routes.map((route, index) => {
              const focused = state.index === index;
              const options = descriptors[route.key].options;
              const label = options.title ?? route.name;
              return (
                <TabButton
                  key={route.key}
                  index={index}
                  position={position}
                  pressure={pressure}
                  label={label}
                  icon={(icons[route.name] ?? icons.index)[focused ? 1 : 0]}
                  focused={focused}
                  reduceMotion={preferences.reduceMotion}
                  onPress={() => {
                    const event = navigation.emit({
                      type: "tabPress",
                      target: route.key,
                      canPreventDefault: true,
                    });
                    if (!focused && !event.defaultPrevented)
                      navigation.navigate(route.name, route.params);
                  }}
                  onLongPress={() =>
                    navigation.emit({ type: "tabLongPress", target: route.key })
                  }
                />
              );
            })}
          </View>
        </View>
      </View>
    </View>
  );
}
const s = StyleSheet.create({
  position: {
    position: "absolute",
    left: 16,
    right: 16,
    alignItems: "center",
    backgroundColor: "transparent",
  },
  shadow: {
    width: "100%",
    maxWidth: 340,
    borderRadius: 38,
    shadowColor: "#20292B",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 22,
    elevation: 8,
    backgroundColor: "transparent",
  },
  shell: {
    flex: 1,
    borderRadius: 38,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.7)",
  },
  tabs: { flex: 1, flexDirection: "row", padding: 6 },
  tab: { flex: 1, minHeight: 60, justifyContent: "center", borderRadius: 30 },
  tabContent: {
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    paddingVertical: 6,
  },
  label: {
    width: "100%",
    flexShrink: 1,
    fontSize: 12,
    lineHeight: 15,
    fontWeight: "600",
    textAlign: "center",
  },
  reflection: {
    position: "absolute",
    left: 22,
    right: 22,
    top: 0,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.9)",
  },
  glint: {
    position: "absolute",
    left: 6,
    top: 7,
    height: 2,
    borderRadius: 2,
    backgroundColor: "white",
  },
  selection: {
    position: "absolute",
    left: 6,
    top: 6,
    bottom: 6,
    backgroundColor: "rgba(255,255,255,0.55)",
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.9)",
    shadowColor: colors.ink,
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
});
