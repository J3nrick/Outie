import { HStack, Image, Spacer, Text, VStack } from "@expo/ui/swift-ui";
import { accessibilityLabel, containerBackground, font, foregroundStyle, lineLimit, privacySensitive, widgetURL } from "@expo/ui/swift-ui/modifiers";
import { createWidget, type WidgetEnvironment } from "expo-widgets";
import type { WidgetProps } from "../services/widget-data";

function HomeLayout(props: WidgetProps, environment: WidgetEnvironment) {
  "widget";
  const dark = environment.colorScheme === "dark";
  const fullColor = environment.widgetRenderingMode === "fullColor";
  const ink = fullColor ? dark ? "#F2F4F3" : "#20292B" : { type: "hierarchical" as const, style: "primary" as const };
  const secondary = fullColor ? dark ? "#C1CBC6" : "#5B686C" : { type: "hierarchical" as const, style: "secondary" as const };
  const accent = fullColor ? dark ? "#FFA49B" : "#B9352D" : { type: "hierarchical" as const, style: "primary" as const };
  const items = props.items ?? [];
  const count = props.count ?? 0;
  const small = environment.widgetFamily === "systemSmall";
  const visible = items.slice(0, small ? 2 : 4);
  return <VStack alignment="leading" spacing={6} modifiers={[
    widgetURL(props.url || "depart-preview:///welcome"),
    containerBackground(dark ? "#20292B" : "#F6F5F1", "widget"),
  ]}>
    <HStack spacing={7}>
      <Image systemName="door.left.hand.open" modifiers={[font({ textStyle: "headline" }), foregroundStyle(accent)]} />
      <Text modifiers={[font({ textStyle: small ? "subheadline" : "headline", weight: "bold" }), foregroundStyle(ink), lineLimit(small ? 2 : 1)]}>Before you go</Text>
    </HStack>
    <Text modifiers={[font({ textStyle: "caption", weight: "medium" }), foregroundStyle(secondary), lineLimit(small ? 2 : 1)]}>{props.note || "Open Outie to choose your things"}</Text>
    <Spacer />
    {count ? <VStack alignment="leading" spacing={3}>
      {small ? visible.map((name, index) => <Text key={index} modifiers={[font({ textStyle: "subheadline", weight: "semibold" }), foregroundStyle(ink), lineLimit(1), privacySensitive()]}>{name}</Text>) :
        <Text modifiers={[font({ textStyle: "body", weight: "semibold" }), foregroundStyle(ink), lineLimit(2), privacySensitive()]}>{visible.join(" · ")}</Text>}
      {(count > visible.length || !small) && <Text modifiers={[font({ textStyle: "caption2" }), foregroundStyle(secondary), lineLimit(1)]}>{count > visible.length ? `+${count - visible.length} more` : `${count} ${count === 1 ? "thing" : "things"} to remember`}</Text>}
    </VStack> : <Text modifiers={[font({ textStyle: "subheadline", weight: "semibold" }), foregroundStyle(ink), lineLimit(2)]}>{props.total ? "Confirmed by you for this outing" : "Choose your everyday things in Outie"}</Text>}
    <Spacer />
    <HStack spacing={4}>
      <Text modifiers={[font({ textStyle: "caption2" }), foregroundStyle(secondary), lineLimit(1)]}>{props.updated || "Open Outie to get started"}</Text>
      {!small && <><Spacer /><Text modifiers={[font({ textStyle: "caption2" }), foregroundStyle(secondary), lineLimit(1)]}>{props.status || ""}</Text></>}
    </HStack>
  </VStack>;
}
function LockLayout(props: WidgetProps, environment: WidgetEnvironment) {
  "widget";
  const count = props.count ?? 0;
  const note = props.note || "Open Outie to get started";
  const url = props.url || "depart-preview:///welcome";
  if (environment.widgetFamily === "accessoryInline") return <Text modifiers={[widgetURL(url), accessibilityLabel(`Outie. ${note}`)]}>Outie · {note}</Text>;
  if (environment.widgetFamily === "accessoryCircular") return <VStack spacing={1} modifiers={[widgetURL(url), accessibilityLabel(`Outie. ${note}`)]}>
    <Image systemName={props.rain ? "umbrella.fill" : "door.left.hand.open"} modifiers={[font({ textStyle: "headline" })]} />
    <Text modifiers={[font({ textStyle: "caption2", weight: "semibold" })]}>{count ? `${count} ${count === 1 ? "thing" : "things"}` : "Outie"}</Text>
  </VStack>;
  return <VStack alignment="leading" spacing={2} modifiers={[widgetURL(url), containerBackground("#00000000", "widget")]}>
    <HStack spacing={5}><Image systemName={props.rain ? "umbrella.fill" : "door.left.hand.open"} modifiers={[font({ textStyle: "caption" })]} />
      <Text modifiers={[font({ textStyle: "headline", weight: "semibold" }), lineLimit(1)]}>Before you go</Text></HStack>
    <Text modifiers={[font({ textStyle: "caption" }), lineLimit(2)]}>{note}</Text>
  </VStack>;
}
export const homeWidget = createWidget<WidgetProps>("OutieBeforeYouGo", HomeLayout);
export const lockWidget = createWidget<WidgetProps>("OutieQuickReminder", LockLayout);
