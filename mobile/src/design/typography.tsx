import { createContext, useContext } from "react";
export const FontReadyContext = createContext(false);
export function useAppFont(weight: string | number = 400) {
  const ready = useContext(FontReadyContext);
  const numeric = Number(weight) || (weight === "bold" ? 700 : 400);
  return ready
    ? numeric >= 700
      ? "SatoshiBold"
      : numeric >= 500
        ? "SatoshiMedium"
        : "SatoshiRegular"
    : undefined;
}
