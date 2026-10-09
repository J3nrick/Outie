import { useState, type ReactNode } from "react";
import { Pressable, type PressableProps, type ViewStyle } from "react-native";
import Animated, { cubicBezier } from "react-native-reanimated";
import { useMaterialPreferences } from "./useMaterialPreferences";

// Only two React updates per touch; interpolation runs on the UI runtime.
export function MotionPressable({
  children,
  style,
  ...props
}: Omit<PressableProps, "style" | "children"> & {
  children: ReactNode;
  style?: ViewStyle;
}) {
  const [pressed, setPressed] = useState(false);
  const { reduceMotion } = useMaterialPreferences();
  return (
    <Pressable
      {...props}
      pressRetentionOffset={16}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
    >
      <Animated.View
        style={[
          style,
          {
            opacity: props.disabled ? 0.45 : pressed ? 0.75 : 1,
            transform: [{ scale: pressed && !reduceMotion ? 0.97 : 1 }],
            transitionProperty: ["transform", "opacity"],
            transitionDuration: 120,
            transitionTimingFunction: cubicBezier(0.23, 1, 0.32, 1),
          },
        ]}
      >
        {children}
      </Animated.View>
    </Pressable>
  );
}
