import { View } from "react-native";
import { SvgXml } from "react-native-svg";
import paths from "./solar.json";
export type IconName = keyof typeof paths;
export function Icon({
  name,
  size = 24,
  color = "#20292B",
}: {
  name: IconName;
  size?: number;
  color?: string;
}) {
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <SvgXml
        xml={`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">${paths[name].replaceAll("currentColor", color)}</svg>`}
        width={size}
        height={size}
      />
    </View>
  );
}
