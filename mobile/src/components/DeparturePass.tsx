import { View, StyleSheet, useWindowDimensions } from "react-native";
import { router } from "expo-router";
import { Copy } from "./ui";
import { colors } from "../design/tokens";
import { Icon, type IconName } from "./Icon";
import { MotionPressable } from "./MotionPressable";

export function DeparturePass({
  title,
  time,
  destination,
}: {
  title: string;
  time: string;
  destination: string;
}) {
  const { fontScale } = useWindowDimensions();
  return (
    <View style={s.pass}>
      <View pointerEvents="none" accessible={false} style={s.doorAccent}>
        <View style={s.doorHandle} />
      </View>
      <View style={s.face}>
        <View style={s.heading}>
          <Icon name="door" size={19} color={colors.accentOnDark} />
          <Copy size={12} weight="500" style={{ color: colors.accentOnDark }}>
            Next departure
          </Copy>
        </View>
        <Copy
          size={fontScale > 2 ? 18 : 24}
          weight="700"
          style={{ color: "white", letterSpacing: -0.5 }}
        >
          {title}
        </Copy>
        <Copy size={13} style={{ color: "#BDC5C2" }}>
          {time}
          {"\n"}
          {destination || "Destination not set"}
        </Copy>
        <View style={s.departure}>
          <Copy size={12} style={{ color: "#BDC5C2" }}>
            Departure time
          </Copy>
          <Copy
            size={fontScale > 2 ? 20 : 28}
            weight="700"
            style={{ color: "white", letterSpacing: -0.6 }}
          >
            Not set yet
          </Copy>
          <Copy size={11} style={{ color: "#BDC5C2" }}>
            Travel estimate unavailable
          </Copy>
        </View>
      </View>
      <View style={s.actions}>
        <Quick
          icon="check"
          label="Check"
          onPress={() => router.push("/checklist")}
        />
        <Quick
          icon="calendar"
          label="Plan"
          onPress={() => router.push("/context")}
        />
        <Quick
          icon="location"
          label="Places"
          onPress={() => router.push("/places")}
        />
      </View>
    </View>
  );
}
function Quick({
  icon,
  label,
  onPress,
}: {
  icon: IconName;
  label: string;
  onPress: () => void;
}) {
  return (
    <View style={{ flex: 1 }}>
      <MotionPressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={
          label === "Check"
            ? "Check my essentials"
            : label === "Plan"
              ? "Plan an activity"
              : "Saved places"
        }
        style={{ alignItems: "center", gap: 5, minHeight: 64 }}
      >
        <View style={s.quick}>
          <Icon name={icon} color="#E8EEEB" size={22} />
        </View>
        <Copy size={12} weight="500" style={{ color: "#CBD3D0" }}>
          {label}
        </Copy>
      </MotionPressable>
    </View>
  );
}
const s = StyleSheet.create({
  pass: { backgroundColor: "#202425", borderRadius: 24, overflow: "hidden" },
  face: { padding: 22, gap: 10 },
  heading: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 2 },
  departure: {
    gap: 2,
    marginTop: 8,
    paddingLeft: 12,
    borderLeftWidth: 2,
    borderLeftColor: colors.accentOnDark,
  },
  doorAccent: {
    position: "absolute",
    top: -18,
    right: 22,
    width: 60,
    height: 94,
    borderWidth: 1,
    borderColor: "rgba(199,221,215,0.13)",
    borderRadius: 16,
  },
  doorHandle: {
    position: "absolute",
    right: 10,
    bottom: 22,
    width: 3,
    height: 12,
    borderRadius: 2,
    backgroundColor: "rgba(199,221,215,0.13)",
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    marginHorizontal: 22,
    borderTopWidth: 1,
    borderTopColor: "#3A4340",
    paddingTop: 16,
    paddingBottom: 18,
  },
  quick: {
    width: 42,
    height: 42,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#4C5853",
    backgroundColor: "#2A3230",
    alignItems: "center",
    justifyContent: "center",
  },
});
