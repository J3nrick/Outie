import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
export function useOutingClock() {
  const [now, setNow] = useState(Date.now);
  useFocusEffect(useCallback(() => {
    setNow(Date.now());
    const timer = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(timer);
  }, []));
  return [now, setNow] as const;
}
