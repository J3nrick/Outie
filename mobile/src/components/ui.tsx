import React, { useRef, type ReactNode } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  type TextStyle,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors as c } from "../design/tokens";
import { usePreparation } from "../data/store";
import { Icon, type IconName } from "./Icon";
import { BlurView, BlurTargetView } from "expo-blur";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
} from "react-native-reanimated";
import { MotionPressable } from "./MotionPressable";
import { useMaterialPreferences } from "./useMaterialPreferences";
import { useAppFont } from "../design/typography";
import { glassBarSpace } from "./GlassTabBar";
import { router } from "expo-router";
import { monitoringSetup } from "../services/monitoring";
export function Copy({
  children,
  muted = false,
  size = 16,
  weight = "400",
  style,
}: {
  children: ReactNode;
  muted?: boolean;
  size?: number;
  weight?: TextStyle["fontWeight"];
  style?: TextStyle;
}) {
  const fontFamily = useAppFont(weight);
  const { fontScale } = useWindowDimensions();
  return (
    <Text
      key={fontScale}
      style={[
        {
          color: muted ? c.slate : c.ink,
          fontSize: size,
          fontFamily,
          fontWeight: fontFamily ? "normal" : weight,
          lineHeight: size * 1.4,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}
export function Title({ children }: { children: ReactNode }) {
  return (
    <Copy
      size={28}
      weight="700"
      style={{ letterSpacing: -0.7, lineHeight: 34 }}
    >
      {children}
    </Copy>
  );
}
export function SectionTitle({
  children,
  action,
}: {
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <View style={styles.sectionTitle}>
      <Copy size={20} weight="700">
        {children}
      </Copy>
      {action}
    </View>
  );
}
export function Button({
  label,
  onPress,
  secondary = false,
  disabled = false,
  icon,
  testID,
}: {
  label: string;
  onPress: () => void;
  secondary?: boolean;
  disabled?: boolean;
  icon?: IconName;
  testID?: string;
}) {
  return (
    <MotionPressable
      testID={testID}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      onPress={onPress}
      disabled={disabled}
      style={{
        ...styles.button,
        backgroundColor: secondary ? c.surface : c.ink,
        opacity: disabled ? 0.45 : 1,
      }}
    >
      {icon && (
        <Icon name={icon} color={secondary ? c.ink : "white"} size={22} />
      )}
      <Copy
        weight="600"
        style={{
          color: secondary ? c.ink : "white",
          textAlign: "center",
          flexShrink: 1,
        }}
      >
        {label}
      </Copy>
    </MotionPressable>
  );
}
export function Action({
  label,
  onPress,
  danger = false,
  accessibilityLabel,
}: {
  label: string;
  onPress: () => void;
  danger?: boolean;
  accessibilityLabel?: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || label}
      onPress={onPress}
      style={({ pressed }) => ({
        paddingVertical: 10,
        minHeight: 44,
        justifyContent: "center",
        opacity: pressed ? 0.5 : 1,
      })}
    >
      <Copy weight="600" style={{ color: danger ? c.danger : c.accent }}>
        {label}
      </Copy>
    </Pressable>
  );
}
export function Badge({ children }: { children: ReactNode }) {
  return (
    <View style={styles.badge}>
      <Icon name="play" size={15} color={c.warning} />
      <Copy size={12} weight="600" style={{ color: c.warning }}>
        {children}
      </Copy>
    </View>
  );
}
export function ConnectionNotice() {
  const { state, integrationError, monitoringStatus } = usePreparation();
  const monitoring = monitoringSetup(state) ?? monitoringStatus;
  const placeNeeded = Platform.OS !== "web" && monitoring === "needs-place";
  const locationNeeded = monitoring === "needs-background-access";
  if (state.demo || (!integrationError && !placeNeeded && !locationNeeded)) return null;
  return (
    <View accessibilityRole="alert" style={styles.notice}>
      <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 10 }}>
        <View style={{ paddingTop: 2 }}>
          <Icon
            name={placeNeeded ? "home" : locationNeeded ? "location" : "bell"}
            size={20}
            color={c.warning}
          />
        </View>
        <View style={{ flex: 1, gap: 4 }}>
          <Copy size={14} weight="700">
            {placeNeeded ? "Save a starting point" : locationNeeded ? "Location access needed" : "Check your connections"}
          </Copy>
          <Copy size={13} muted>
            {placeNeeded
              ? 'Location is connected. In Saved Places, choose “Use my current location” and save a place to monitor.'
              : locationNeeded
              ? 'Choose “Always” for Location in iPhone Settings to enable saved-place departure alerts.'
              : integrationError}
          </Copy>
          <Action
            label={placeNeeded ? "Set up saved places" : locationNeeded ? "Review location access" : "Review connections"}
            onPress={() =>
              placeNeeded
                ? router.push("/places")
                : locationNeeded
                ? router.push({
                    pathname: "/connection",
                    params: { kind: "Location" },
                  })
                : router.navigate("/settings")
            }
          />
        </View>
      </View>
    </View>
  );
}
export function Screen({
  children,
  footer,
  tab = false,
  safeTop = false,
  legacyDemo = false,
}: {
  children: ReactNode;
  footer?: ReactNode;
  tab?: boolean;
  safeTop?: boolean;
  legacyDemo?: boolean;
}) {
  const inset = useSafeAreaInsets();
  const needsTopInset = tab || safeTop;
  const target = useRef<View | null>(null);
  const preferences = useMaterialPreferences();
  const offset = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((event) => {
    offset.set(Math.max(0, event.contentOffset.y));
  });
  const edgeStyle = useAnimatedStyle(() => ({
    opacity: Math.min(Math.max((offset.get() - 8) / 48, 0), 1),
  }));
  const { fontScale } = useWindowDimensions();
  const bottomSpace = tab ? glassBarSpace(inset.bottom, fontScale) : 0;
  const { state, saveError } = usePreparation();
  const showDemo = legacyDemo && state.demo;
  return (
    <KeyboardAvoidingView
      style={styles.fill}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {showDemo && (
        <View
          style={{
            paddingHorizontal: 24,
            paddingTop: needsTopInset ? inset.top + 10 : 8,
            paddingBottom: 8,
          }}
        >
          <Badge>Demo Mode · simulated data</Badge>
        </View>
      )}
      <View style={{ flex: 1 }}>
        <BlurTargetView ref={target} style={{ flex: 1 }}>
          <Animated.ScrollView
            onScroll={onScroll}
            scrollEventThrottle={16}
            keyboardShouldPersistTaps="handled"
            contentInsetAdjustmentBehavior="never"
            automaticallyAdjustContentInsets={false}
            contentContainerStyle={[
              styles.screen,
              {
                paddingTop: needsTopInset && !showDemo ? inset.top + 20 : 20,
                paddingBottom: footer ? 24 : 40 + bottomSpace,
              },
            ]}
          >
            {saveError && (
              <View accessibilityRole="alert" style={styles.notice}>
                <Copy size={14} weight="700">Your changes could not be saved</Copy>
                <Copy size={13}>{saveError}</Copy>
              </View>
            )}
            {children}
          </Animated.ScrollView>
        </BlurTargetView>
        <Animated.View
          pointerEvents="none"
          style={[
            {
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              height: needsTopInset && !showDemo ? inset.top + 8 : 8,
              overflow: "hidden",
            },
            edgeStyle,
          ]}
        >
          {preferences.reduceTransparency || preferences.increaseContrast ? (
            <View style={{ flex: 1, backgroundColor: c.background }} />
          ) : (
            <BlurView
              tint="systemUltraThinMaterialLight"
              intensity={30}
              blurTarget={target}
              blurMethod="dimezisBlurViewSdk31Plus"
              style={StyleSheet.absoluteFill}
            />
          )}
        </Animated.View>
      </View>
      {footer && (
        <View
          style={[
            styles.footer,
            {
              paddingBottom: tab ? bottomSpace : Math.max(inset.bottom, 16),
              ...(tab
                ? { backgroundColor: "transparent", borderTopWidth: 0 }
                : {}),
            },
          ]}
        >
          {footer}
        </View>
      )}
    </KeyboardAvoidingView>
  );
}
export function Panel({ children }: { children: ReactNode }) {
  return <View style={styles.panel}>{children}</View>;
}
export function Row({
  title,
  detail,
  icon,
  onPress,
  trailing,
  checked,
}: {
  title: string;
  detail?: string;
  icon?: IconName;
  onPress?: () => void;
  trailing?: ReactNode;
  checked?: boolean;
}) {
  const inner = (
    <>
      <View style={styles.rowLeading}>
        {icon && (
          <View style={styles.iconBox}>
            <Icon name={icon} color={c.accent} />
          </View>
        )}
        <View style={{ flex: 1 }}>
          <Copy weight="500">{title}</Copy>
          {detail && (
            <Copy muted size={14}>
              {detail}
            </Copy>
          )}
        </View>
      </View>
      {trailing ??
        (onPress ? <Icon name="arrow" size={18} color={c.slate} /> : null)}
    </>
  );
  return onPress ? (
    <MotionPressable
      accessibilityRole={checked === undefined ? "button" : "checkbox"}
      accessibilityState={checked === undefined ? undefined : { checked }}
      onPress={onPress}
      style={styles.row}
    >
      {inner}
    </MotionPressable>
  ) : (
    <View style={styles.row}>{inner}</View>
  );
}
export function Field({
  label,
  value,
  onChange,
  placeholder,
  multiline = false,
}: {
  label: string;
  value: string;
  onChange: (s: string) => void;
  placeholder?: string;
  multiline?: boolean;
}) {
  const fontFamily = useAppFont();
  return (
    <View style={{ gap: 8 }}>
      <Copy size={14} weight="600">
        {label}
      </Copy>
      <TextInput
        accessibilityLabel={label}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={c.slate}
        multiline={multiline}
        style={[
          styles.input,
          { fontFamily },
          multiline && { minHeight: 100, textAlignVertical: "top" },
        ]}
      />
    </View>
  );
}
export function Empty({
  icon = "door",
  title,
  detail,
  children,
}: {
  icon?: IconName;
  title: string;
  detail: string;
  children?: ReactNode;
}) {
  return (
    <View style={{ gap: 20, paddingVertical: 32 }}>
      <View style={styles.emptyIcon}>
        <Icon name={icon} size={32} color={c.accent} />
      </View>
      <Title>{title}</Title>
      <Copy muted>{detail}</Copy>
      {children}
    </View>
  );
}
export const styles = StyleSheet.create({
  fill: { flex: 1, backgroundColor: c.background },
  notice: {
    backgroundColor: c.paleWarning,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 6,
    gap: 4,
  },
  screen: {
    paddingHorizontal: 20,
    gap: 20,
    width: "100%",
    maxWidth: 720,
    alignSelf: "center",
  },
  button: {
    padding: 16,
    minHeight: 54,
    borderRadius: 16,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#E2E8E5",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
  },
  panel: {
    backgroundColor: c.surface,
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: c.line,
    minHeight: 60,
  },
  rowLeading: { flex: 1, flexDirection: "row", gap: 12, alignItems: "center" },
  iconBox: { padding: 8, borderRadius: 12, backgroundColor: c.paleAccent },
  footer: {
    backgroundColor: c.background,
    paddingHorizontal: 24,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: c.line,
  },
  input: {
    backgroundColor: c.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: c.line,
    padding: 16,
    minHeight: 54,
    color: c.ink,
    fontSize: 17,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: c.paleAccent,
    alignItems: "center",
    justifyContent: "center",
  },
});
