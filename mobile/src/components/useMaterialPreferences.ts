import { useEffect, useState } from "react";
import { AccessibilityInfo, Platform } from "react-native";
export function useMaterialPreferences() {
  const [reduceMotion, setMotion] = useState(true);
  const [reduceTransparency, setTransparency] = useState(true);
  const [increaseContrast, setContrast] = useState(false);
  useEffect(() => {
    if (Platform.OS === "web" && typeof window.matchMedia === "function") {
      const queries = [
        ["(prefers-reduced-motion: reduce)", setMotion],
        ["(prefers-reduced-transparency: reduce)", setTransparency],
        ["(prefers-contrast: more)", setContrast],
      ] as const;
      const cleanups = queries.map(([query, update]) => {
        const media = window.matchMedia(query);
        const change = () => update(media.matches);
        change();
        media.addEventListener("change", change);
        return () => media.removeEventListener("change", change);
      });
      return () => cleanups.forEach((cleanup) => cleanup());
    }
    let active = true;
    AccessibilityInfo.isReduceMotionEnabled().then(
      (value) => active && setMotion(value),
    );
    if (Platform.OS === "ios") {
      AccessibilityInfo.isReduceTransparencyEnabled().then(
        (value) => active && setTransparency(value),
      );
      AccessibilityInfo.isDarkerSystemColorsEnabled().then(
        (value) => active && setContrast(value),
      );
    }
    const subscriptions = [
      AccessibilityInfo.addEventListener("reduceMotionChanged", setMotion),
      AccessibilityInfo.addEventListener(
        "reduceTransparencyChanged",
        setTransparency,
      ),
      AccessibilityInfo.addEventListener(
        "darkerSystemColorsChanged",
        setContrast,
      ),
    ];
    return () => {
      active = false;
      subscriptions.forEach((subscription) => subscription.remove());
    };
  }, []);
  return { reduceMotion, reduceTransparency, increaseContrast };
}
