import { useState } from "react";
import { Linking, Platform, View } from "react-native";
import { Screen, Title, Copy, Panel, Button, Action, SectionTitle } from "../components/ui";
import { Icon } from "../components/Icon";
import { colors as c } from "../design/tokens";
import { usePreparation } from "../data/store";
import { lockWidgetProps, widgetProps } from "../services/widget-data";
import { widgetSupport } from "../services/widgets";

const homeSteps = [
  ["Hold an empty area", "On your iPhone Home Screen, touch and hold an empty area until the apps jiggle."],
  ["Open the widget gallery", "Tap Edit in the top corner, then Add Widget."],
  ["Find Outie", "Search for Outie. Choose Before you go, swipe to the size you want, then tap Add Widget."],
  ["Make it yours", "Drag the widget into place and tap Done. Tap it any time to open your full reminder."],
];
const lockSteps = [
  ["Customize your Lock Screen", "Unlock your iPhone, then touch and hold the Lock Screen. Tap Customize and select Lock Screen if asked."],
  ["Choose the widget area", "Tap Add Widgets or the widget area below the clock."],
  ["Find Outie", "Select Outie, then tap or drag Quick reminder into the widget area. Remove an existing widget if you need space."],
  ["Save your Lock Screen", "Close the widget picker and tap Done. Tap the Outie widget to open your reminder."],
];
export function WidgetsGuide() {
  const { state, refreshWidgets, widgetError, widgetLastSync } = usePreparation();
  const [placement, setPlacement] = useState<"home" | "lock">("home");
  const [busy, setBusy] = useState(false);
  const [now] = useState(Date.now);
  const props = widgetProps(state, now), lock = lockWidgetProps(props);
  const support = widgetSupport();
  const steps = placement === "home" ? homeSteps : lockSteps;
  async function refresh() { setBusy(true); try { await refreshWidgets(); } finally { setBusy(false); } }
  return <Screen>
    <Title>Outie at a glance</Title>
    <Copy muted>A helpful reminder on your Home Screen or Lock Screen. No need to open the app just to see your things.</Copy>
    <View style={{ flexDirection: "row", gap: 8 }}>
      <View style={{ flex: 1 }}><Button label="Home Screen" secondary={placement !== "home"} onPress={() => setPlacement("home")} /></View>
      <View style={{ flex: 1 }}><Button label="Lock Screen" secondary={placement !== "lock"} onPress={() => setPlacement("lock")} /></View>
    </View>
    <Copy size={13} muted>Layout preview · based on your saved things</Copy>
    {placement === "home" ? <View accessibilityLabel={`Home Screen widget preview. ${props.count ? props.items.slice(0, 4).join(", ") : "Choose your everyday things"}. ${props.note}`} style={{ backgroundColor: c.ink, borderRadius: 26, padding: 22, gap: 14 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}><Icon name="door" color={c.accentOnDark} size={22} /><Copy weight="700" size={20} style={{ color: "white" }}>Before you go</Copy></View>
      <Copy size={14} style={{ color: "#D0D8D4" }}>{props.note}</Copy>
      <Copy weight="600" style={{ color: "white" }}>{props.count ? props.items.slice(0, 4).join(" · ") + (props.count > 4 ? ` +${props.count - 4} more` : "") : "Choose your everyday things in Outie"}</Copy>
      <Copy size={12} style={{ color: "#BCC6C1" }}>{props.updated}</Copy>
    </View> : <View style={{ borderRadius: 26, backgroundColor: "#DDE2E0", padding: 24, gap: 18, alignItems: "center" }}>
      <Copy size={40} weight="600" style={{ color: c.ink }}>9:41</Copy>
      <View style={{ borderRadius: 18, borderWidth: 1, borderColor: "#A7B2AE", padding: 14, gap: 5, width: "100%" }}>
        <View style={{ flexDirection: "row", gap: 7, alignItems: "center" }}><Icon name="door" size={18} /><Copy weight="700">Before you go</Copy></View>
        <Copy size={14}>{lock.note}</Copy>
      </View>
      <Copy size={12} muted>Example clock · event titles and item names stay hidden</Copy>
    </View>}
    <SectionTitle>Add it to your {placement === "home" ? "Home Screen" : "Lock Screen"}</SectionTitle>
    <Copy muted size={14}>iOS lets you choose where widgets go. Follow these steps on your iPhone.</Copy>
    <Panel>{steps.map(([title, detail], i) => <View key={title} style={{ flexDirection: "row", gap: 12, paddingVertical: 15 }}>
      <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: c.paleAccent, alignItems: "center", justifyContent: "center" }}><Copy size={14} weight="700" style={{ color: c.accent }}>{i + 1}</Copy></View>
      <View style={{ flex: 1, gap: 5 }}><Copy weight="600">{title}</Copy><Copy size={14} muted>{detail}</Copy></View>
    </View>)}</Panel>
    <SectionTitle>Keep it useful</SectionTitle>
    <Copy muted size={14}>Widgets use the same saved suggestions as Today. Expired calendar and rain advice falls back to your everyday things. Refresh timing is controlled by iOS; a widget doesn’t detect a departure or prove something is packed.</Copy>
    <Copy muted size={14}>{support.detail}</Copy>
    {!!widgetError && <View accessibilityRole="alert"><Copy style={{ color: c.danger }}>Widget content needs attention: {widgetError}</Copy></View>}
    {!!widgetLastSync && <Copy size={13} muted>Content sent to widgets at {new Date(widgetLastSync).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}. iOS decides when to display updates.</Copy>}
    <Button label={busy ? "Refreshing widget content…" : "Refresh widget content"} secondary disabled={busy || !support.available} onPress={() => void refresh()} />
    <Copy muted size={13}>If Outie isn’t in the gallery, install the widget-enabled build, open it once, and search again. Widgets are available in the installed iPhone app, not the browser or Expo Go.</Copy>
    <Action label="Open Apple’s widget instructions" onPress={() => void Linking.openURL("https://support.apple.com/en-us/118610")} />
    {Platform.OS === "web" && <Copy size={12} muted>This is a browser guide. It cannot install an iPhone widget.</Copy>}
  </Screen>;
}
