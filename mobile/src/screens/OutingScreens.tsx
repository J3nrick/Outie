import { useEffect, useState } from "react";
import { View, Image, Switch, Platform, Linking } from "react-native";
import { Redirect, router, useLocalSearchParams } from "expo-router";
import { Screen, Copy, Title, SectionTitle, Button, Action, Panel, Row, Field } from "../components/ui";
import { Icon } from "../components/Icon";
import { colors as c } from "../design/tokens";
import { usePreparation } from "../data/store";
import { homePlace, reminderPreview, monitoredPlaces } from "../services/outing-policy";
import { useOutingClock } from "../components/useOutingClock";
import { itemChecked } from "../services/checks";
import { locatedPlaces, monitoringSetup } from "../services/monitoring";
import * as device from "../services/device";
import type { ContextItem, OutingReminder, Routine } from "../data/outing";
import { IntelligenceStatus } from "../components/FunctionalControls";
import { forecastIsFresh } from "../services/weather";

const presets: Routine[] = [
  { id: "school", name: "School", keywords: ["school", "class", "lecture", "exam"], items: ["School ID", "Notebook", "Calculator"] },
  { id: "work", name: "Work", keywords: ["work", "office", "client", "meeting"], items: ["Company ID", "Laptop charger"] },
  { id: "gym", name: "Gym", keywords: ["gym", "workout", "training"], items: ["Water bottle", "Gym shoes"] },
];
function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (value: boolean) => void }) {
  return <Switch accessibilityLabel={label} value={value} onValueChange={onChange}
    trackColor={{ false: "#CED2D1", true: c.accent }} thumbColor="#FFFFFF"
    {...(Platform.OS === "web" ? { activeThumbColor: "#FFFFFF" } : {})} />;
}
function Source({ item }: { item: ContextItem }) {
  return <Copy size={13} muted>{item.source === "ai" ? "Suggested by local AI" : item.source === "weather" ? "Weather rule · Open-Meteo" : "Chosen by you"}</Copy>;
}
function ReminderBoard({ reminder, sample = false, saved = false }: { reminder: OutingReminder; sample?: boolean; saved?: boolean }) {
  return <View style={{ backgroundColor: c.ink, borderRadius: 28, padding: 24, gap: 16, overflow: "hidden" }}>
    <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
      <Icon name="door" color={c.accentOnDark} size={22} />
      <Copy weight="600" size={14} style={{ color: c.accentOnDark }}>{sample ? "Sample reminder" : saved ? "Saved outing reminder" : "Your next reminder"}</Copy>
    </View>
    <Copy size={27} weight="700" style={{ color: "white", letterSpacing: -0.5 }}>Head out.
      {"\n"}Less left behind.</Copy>
    <View style={{ borderTopWidth: 1, borderColor: "#444A49", paddingTop: 18, gap: 8 }}>
      <Copy size={17} weight="600" style={{ color: "white" }}>{reminder.title}</Copy>
      <Copy size={16} style={{ color: "#DEE3E1" }}>{reminder.body}</Copy>
    </View>
    <Copy size={12} style={{ color: "#B8C0BC" }}>{sample ? "Example context · departure simulated" : "Only unchecked items trigger a departure reminder."}</Copy>
  </View>;
}
function ReadyStatus({ interactive = true }: { interactive?: boolean }) {
  const { state, monitoringStatus, integrationError } = usePreparation();
  const status = monitoringSetup(state) ?? monitoringStatus;
  const ready = status === "active" && !integrationError && Platform.OS !== "web";
  const title = Platform.OS === "web" ? "Preview on the web" : state.paused ? "Reminders paused" : ready ? "Reminders are on" : !state.outing.enabled ? "Finish reminder setup" : "Reminders need attention";
  const detail = Platform.OS === "web" ? "Departure detection and Apple Intelligence run in the iPhone app." : integrationError ||
    (state.paused ? "Resume when you’re ready to head out." : ready ? "We’ll remind you of unchecked things after a selected-area exit." : status === "needs-place" ? "Save and select a location to watch." : status === "needs-notifications" ? "Allow notifications in iPhone Settings." : status === "needs-background-access" ? "Choose Always location access in iPhone Settings." : state.outing.enabled ? "Checking system access and monitoring…" : "Save a place, then allow notifications and background location.");
  return <Panel><Row title={title} detail={detail} icon={ready ? "check" : "bell"}
    onPress={interactive ? () => router.push("/reminders") : undefined} /></Panel>;
}
function WeatherCredit() {
  return <Action label="Weather by Open-Meteo · source and licence" onPress={() => void Linking.openURL("https://open-meteo.com/")} />;
}
export function Welcome() {
  const { state } = usePreparation();
  return <Screen safeTop>
    <View style={{ flexDirection: "row", gap: 12, alignItems: "center", marginTop: 10 }}>
      <Image source={require("../../assets/images/outie-icon.png")} style={{ width: 62, height: 62, borderRadius: 16 }} accessibilityLabel="Outie’s winking doorway" />
      <Copy size={28} weight="700">Outie</Copy>
    </View>
    <Title>Remember what matters{ "\n"}when you head out.</Title>
    <Copy muted>Check your everyday things, with weather and calendar extras. Leave a selected place with something unchecked, and Outie reminds you.</Copy>
    <Button label={state.outing.onboardingComplete ? "Open my reminders" : state.outing.setupStep ? "Continue setup" : "Set up my reminders"} icon="door"
      testID="start-setup" onPress={() => router.replace(state.outing.onboardingComplete ? "/" : "/setup")} />
    <Action label="Try a permission-free example" onPress={() => router.push("/demo")} />
    <Panel><Row title="Rain forecast + a school day" detail="Remember your keys, school ID, and an umbrella." icon="bell" /></Panel>
    <Copy muted size={13}>Apple Intelligence adds contextual suggestions on supported iPhones. Your saved essentials work even when AI is unavailable.</Copy>
  </Screen>;
}
export function Today() {
  const { state, dispatch, contextBusy, refreshContext, reloadSavedState } = usePreparation();
  const [message, setMessage] = useState("");
  const [testing, setTesting] = useState(false);
  const [now, setNow] = useOutingClock();
  if (!state.outing.onboardingComplete) return <Redirect href="/welcome" />;
  const reminder = reminderPreview(state, now);
  const context = state.outing.context, home = homePlace(state);
  const weatherFresh = home && forecastIsFresh(context?.forecast, home.latitude!, home.longitude!, now);
  async function test() {
    setTesting(true); setMessage("");
    try {
      const id = await device.scheduleOuting(reminderPreview(state, Date.now(), `test-outing-${Date.now()}`), true);
      await reloadSavedState();
      setMessage(id ? "Unchecked-item test reminder scheduled. This tests notifications, not departure detection." : "No test alert sent. Confirmed items are excluded; also check notification access.");
    } catch (e) { setMessage(e instanceof Error ? e.message : String(e)); }
    finally { setTesting(false); }
  }
  return <Screen tab>
    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
      <View style={{ flex: 1 }}><Title>Before you go</Title><Copy muted>Your reminders, ready for the day.</Copy></View>
      <View style={{ backgroundColor: c.paleAccent, padding: 12, borderRadius: 20 }}><Icon name="door" color={c.accent} size={26} /></View>
    </View>
    <ReadyStatus />
    <ReminderBoard reminder={reminder} />
    <Button label={contextBusy ? "Updating today’s suggestions…" : "Refresh today’s suggestions"} disabled={contextBusy} secondary onPress={() => void refreshContext()} />
    <Action label={testing ? "Scheduling test…" : "Send a test reminder"} onPress={() => { if (!testing) void test(); }} />
    {!!message && <Copy muted>{message}</Copy>}
    <SectionTitle>Check before you leave</SectionTitle>
    <Copy muted size={13}>Tap an item to confirm it for this outing. Only unchecked items appear in departure alerts.</Copy>
    <Action label="Start a new outing · reset checks" onPress={() => { const at = Date.now(); setNow(at); void dispatch({ type: "newOuting", at }); }} />
    {!reminder.allItems?.length && <Button label="Choose my everyday things" onPress={() => router.push("/essentials")} />}
    {!!reminder.allItems?.length && <Panel>{reminder.allItems.map((i, index) => <View key={`${i.name}-${index}`} style={{ paddingVertical: 12, gap: 4 }}>
      <Row title={i.name} detail={itemChecked(state, i.name, now) ? "Confirmed by you for this outing" : "Still unchecked"} checked={itemChecked(state, i.name, now)}
        onPress={() => { const at = Date.now(); setNow(at); void dispatch({ type: "checkThing", name: i.name, checked: !itemChecked(state, i.name, at), checklistId: state.outing.checklist.id, at }); }}
        trailing={<Icon name={itemChecked(state, i.name, now) ? "check" : "circle"} color={c.accent} />} />
      <Copy size={14} muted>{i.reason}</Copy><Source item={i} />
      <Action label={`Details for ${i.name}`} onPress={() => router.push({ pathname: "/thing", params: { name: i.name } })} />
      {i.source !== "routine" && <Action label={`Don’t suggest ${i.name}`} onPress={() => void dispatch({ type: "neverSuggest", name: i.name, enabled: true })} />}
    </View>)}</Panel>}
    <Copy muted size={13}>{contextBusy ? "Checking available context. Your essentials stay ready." : context?.modelStatus || "Your essentials work while context is being prepared."}</Copy>
    {state.connections.Calendar && <Copy muted size={13}>{context?.calendarStatus || "Checking Calendar…"}</Copy>}
    {state.outing.weatherEnabled && <>
      <Copy muted size={13}>{weatherFresh ? `${context?.weatherStatus}. Updated ${new Date(context!.forecast!.fetchedAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}.` : context?.weatherStatus?.startsWith("Weather unavailable") ? context.weatherStatus : "Weather is unavailable or needs refreshing. No weather claim is added."}</Copy>
      <WeatherCredit />
    </>}
    <View style={{ flexDirection: "row", gap: 20, flexWrap: "wrap" }}>
      {state.outing.enabled && <Action label={state.paused ? "Resume reminders" : "Pause reminders"} onPress={() => void dispatch({ type: "pause", enabled: !state.paused })} />}
    </View>
    {!!state.outing.history.length && <Panel><Row title={state.outing.history[0].test ? "Last notification test" : "Last outing"} detail={new Date(state.outing.history[0].createdAt).toLocaleString()} icon="clock" onPress={() => router.push({ pathname: "/reminder", params: { outingId: state.outing.history[0].id } })} /></Panel>}
  </Screen>;
}
export function MyThings() {
  const { state, dispatch } = usePreparation();
  const [name, setName] = useState("");
  const [now] = useOutingClock();
  const [groupName, setGroupName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [groupItems, setGroupItems] = useState("");
  const [keywords, setKeywords] = useState("");
  return <Screen tab>
    <Title>My things</Title><Copy muted>Choose your things, then confirm them before an outing.</Copy>
    <SectionTitle>Everyday essentials</SectionTitle>
    <Panel>{state.essentials.map(item => <View key={item}>
      <Row title={item} detail={itemChecked(state, item, now) ? "Confirmed for this outing" : "Unchecked for this outing"} icon="bag"
        trailing={<Action label="Remove" accessibilityLabel={`Remove ${item}`} onPress={() => void dispatch({ type: "removeEssential", name: item })} />} />
      <Action label={`Details for ${item}`} onPress={() => router.push({ pathname: "/thing", params: { name: item } })} />
    </View>)}
      {!state.essentials.length && <Copy muted>Add the things you tend to forget.</Copy>}
    </Panel>
    <Field label="Everyday item" value={name} onChange={setName} placeholder="Keys, wallet, glasses…" />
    <Button label="Add everyday item" disabled={!name.trim()} secondary onPress={async () => { if (await dispatch({ type: "essential", name })) setName(""); }} />
    <SectionTitle>For school, work, and more</SectionTitle>
    <Copy muted size={14}>These items appear when a relevant calendar event is found. Local AI can match events to your routines by meaning.</Copy>
    {presets.filter(p => !state.outing.routines.some(r => r.id === p.id)).map(p => <Button key={p.id} label={`Add ${p.name.toLowerCase()} routine`} secondary onPress={() => void dispatch({ type: "routine", routine: p })} />)}
    {state.outing.routines.map(r => <Panel key={r.id}>
      <Row title={r.name} detail={r.items.join(", ")} icon="calendar" trailing={<Action label="Remove" accessibilityLabel={`Remove ${r.name} routine`} onPress={() => void dispatch({ type: "removeRoutine", id: r.id })} />} />
      <Action label={`Edit ${r.name}`} onPress={() => { setEditingId(r.id); setGroupName(r.name); setGroupItems(r.items.join(", ")); setKeywords(r.keywords.join(", ")); }} />
    </Panel>)}
    <SectionTitle>Your own routine</SectionTitle>
    <Field label="Routine name" value={groupName} onChange={setGroupName} placeholder="School" />
    <Field label="Things to bring (separate with commas)" value={groupItems} onChange={setGroupItems} placeholder="School ID, calculator" />
    <Field label="Calendar words to match (optional)" value={keywords} onChange={setKeywords} placeholder="school, lecture, exam" />
    <Button label="Save routine" disabled={!groupName.trim() || !groupItems.trim()} onPress={async () => {
      const existing = state.outing.routines.find(r => r.name.toLowerCase() === groupName.trim().toLowerCase());
      if (await dispatch({ type: "routine", routine: { id: editingId || existing?.id || `routine-${Date.now()}`, name: groupName,
        keywords: keywords.split(",").map(x => x.trim()).filter(Boolean), items: groupItems.split(",") } })) { setEditingId(null); setGroupName(""); setGroupItems(""); setKeywords(""); }
    }} />
    {!!state.outing.neverSuggest.length && <><SectionTitle>Hidden suggestions</SectionTitle><Panel>{state.outing.neverSuggest.map(item => <Row key={item} title={item}
      trailing={<Action label="Restore" accessibilityLabel={`Restore suggestion for ${item}`} onPress={() => void dispatch({ type: "neverSuggest", name: item, enabled: false })} />} />)}</Panel></>}
    <Action label="Manage approved preferences" onPress={() => router.push("/memory")} />
  </Screen>;
}
export function Setup() {
  const { state, dispatch } = usePreparation();
  const [busy, setBusy] = useState(false), [message, setMessage] = useState("");
  const [custom, setCustom] = useState("");
  const step = state.outing.setupStep, home = homePlace(state);
  const essentials = ["Keys", "Wallet", "Phone", "Glasses", "Water bottle"];
  const next = async () => { if (await dispatch({ type: "setupStep", step: step + 1 })) setMessage(""); };
  return <Screen>
    <Copy size={14} muted>Step {step + 1} of 4</Copy>
    <Title>{["Where do you head out from?", "What do you tend to forget?", "Make reminders fit your day", "Ready when you head out"][step]}</Title>
    {step === 0 && <>
      <Copy muted>Save Home once. Outie uses a 200 m area to detect departures, even when the app is in the background.</Copy>
      <Panel><Row title={home?.name || "Home"} detail={Number.isFinite(home?.latitude) ? `Location saved · ${home!.latitude!.toFixed(4)}, ${home!.longitude!.toFixed(4)}` : "Your Home location isn’t saved yet"} icon="home" /></Panel>
      <Button label={busy ? "Finding Home…" : "Use my current location for Home"} disabled={busy || Platform.OS === "web"} onPress={async () => {
        setBusy(true); setMessage("");
        try { const coords = await device.currentCoordinates();
          if (await dispatch({ type: "outingHome", place: { id: home?.id || "home", name: "Home", description: "Saved current location", radius: 200, ...coords } })) {
            await dispatch({ type: "connection", kind: "Location", enabled: true }); setMessage("Home saved. Check that you’re at Home before continuing.");
          }
        } catch (e) { setMessage(String(e)); } finally { setBusy(false); }
      }} />
      {Platform.OS === "web" && <Copy muted>Save your real Home location in the installed iPhone app. The browser can preview the rest of setup.</Copy>}
      <Button label="Continue" secondary disabled={busy} onPress={() => void next()} />
      <Copy muted size={13}>You can continue without Home and finish location setup later.</Copy>
    </>}
    {step === 1 && <>
      <Copy muted>Choose what to check before an outing. Confirmed things won’t trigger departure reminders.</Copy>
      <Panel>{essentials.map(name => <Row key={name} title={name} checked={state.essentials.includes(name)}
        onPress={() => void dispatch({ type: state.essentials.includes(name) ? "removeEssential" : "essential", name })}
        trailing={<Icon name={state.essentials.includes(name) ? "check" : "circle"} color={state.essentials.includes(name) ? c.accent : c.slate} />} />)}</Panel>
      <Field label="Something else you forget" value={custom} onChange={setCustom} placeholder="My headphones" />
      <Button label="Add my item" secondary disabled={!custom.trim()} onPress={async () => { if (await dispatch({ type: "essential", name: custom })) setCustom(""); }} />
      {!!state.essentials.filter(x => !essentials.includes(x)).length && <Copy muted>{state.essentials.filter(x => !essentials.includes(x)).join(", ")}</Copy>}
      <Button label="Continue" onPress={() => void next()} />
    </>}
    {step === 2 && <>
      <Copy muted>Calendar helps identify what you might be heading out for. Weather helps decide whether to suggest an umbrella.</Copy>
      <Panel><Row title="Calendar" detail={state.connections.Calendar ? "Connected" : "Optional · everyday reminders work without it"} icon="calendar" />
        <Button label={busy ? "Connecting…" : state.connections.Calendar ? "Calendar connected" : "Connect Calendar"} disabled={busy || state.connections.Calendar || Platform.OS === "web"} secondary onPress={async () => {
          setBusy(true); try { const access = await device.permission("Calendar", true);
            await dispatch({ type: "connection", kind: "Calendar", enabled: access === "granted" });
            if (access !== "granted") setMessage("Calendar wasn’t granted. Your everyday reminders still work.");
          } catch (e) { setMessage(String(e)); } finally { setBusy(false); }
        }} />
      </Panel>
      <Panel><Row title="Rain reminders" detail="Open-Meteo gets your Home coordinates for forecasts. Calendar text and item names stay on your device." icon="shield"
        trailing={<Toggle label="Enable rain reminders" value={state.outing.weatherEnabled} onChange={enabled => void dispatch({ type: "weatherEnabled", enabled })} />} /></Panel>
      <SectionTitle>Optional routines</SectionTitle>
      {presets.slice(0, 2).map(r => <Panel key={r.id}><Row title={r.name} detail={r.items.join(", ")} checked={state.outing.routines.some(x => x.id === r.id)}
        onPress={() => void dispatch(state.outing.routines.some(x => x.id === r.id) ? { type: "removeRoutine", id: r.id } : { type: "routine", routine: r })}
        trailing={<Icon name={state.outing.routines.some(x => x.id === r.id) ? "check" : "circle"} color={c.accent} />} /></Panel>)}
      <Button label="Continue" onPress={() => void next()} />
    </>}
    {step === 3 && <>
      <Copy muted>Outie needs notifications and Always location access to send a reminder after you leave the Home area.</Copy>
      <EnableReminders onFinished={async () => { if (await dispatch({ type: "finishOnboarding" })) router.replace("/"); }} />
      <Button label="Do this later" secondary onPress={async () => {
        if (await dispatch({ type: "finishOnboarding" })) router.replace("/");
      }} />
      <Copy muted size={13}>Area exits are approximate. Alerts can arrive after you pass the doorway. Suggestions don’t prove an item was left behind.</Copy>
    </>}
    {!!message && <Copy muted>{message}</Copy>}
    {step > 0 && <Action label="Back" onPress={() => void dispatch({ type: "setupStep", step: step - 1 })} />}
  </Screen>;
}
function EnableReminders({ onFinished }: { onFinished?: () => Promise<void> }) {
  const { state, dispatch } = usePreparation();
  const [busy, setBusy] = useState(false), [message, setMessage] = useState("");
  const selected = monitoredPlaces(state);
  async function enable() {
    setBusy(true); setMessage("");
    try {
      const notifications = await device.permission("Notifications", true);
      if (!await dispatch({ type: "connection", kind: "Notifications", enabled: notifications === "granted" })) return;
      if (notifications !== "granted") { setMessage("Allow notifications in iPhone Settings, then try again."); return; }
      const foreground = await device.permission("Location", true);
      if (foreground !== "granted") { setMessage("Allow location access in iPhone Settings, then try again."); return; }
      if (!await dispatch({ type: "connection", kind: "Location", enabled: true })) return;
      const background = await device.backgroundPermission();
      if (background !== "granted") { setMessage("Choose Always for Location in iPhone Settings. Your setup is saved; come back and try again."); return; }
      if (!await dispatch({ type: "outingEnabled", enabled: true })) return;
      if (onFinished) await onFinished();
      else setMessage("Your reminder preference is saved. The status above confirms whether monitoring is active.");
    } catch (e) { setMessage(e instanceof Error ? e.message : String(e)); }
    finally { setBusy(false); }
  }
  return <>
    {!selected.length && <Copy muted>Save and select a location before starting reminders.</Copy>}
    {!state.essentials.length && <Action label="Choose at least one everyday thing" onPress={() => router.push("/essentials")} />}
    <Button label={busy ? "Checking access…" : "Start my departure reminders"} disabled={busy || !state.essentials.length || !selected.length || Platform.OS === "web"} icon="bell" onPress={() => void enable()} />
    {!!message && <Copy muted>{message}</Copy>}
    {Platform.OS !== "web" && <Action label="Open iPhone Settings" onPress={() => void Linking.openSettings()} />}
  </>;
}
export function Reminders() {
  const { state, dispatch } = usePreparation();
  const home = homePlace(state);
  const locations = locatedPlaces(state);
  return <Screen>
    <Title>Departure reminders</Title><Copy muted>Leave a selected place with unchecked things, and Outie sends one reminder.</Copy>
    <ReadyStatus interactive={false} />
    <Panel><Row title={home?.name || "Save Home"} detail={Number.isFinite(home?.latitude) ? `${home!.radius} m area · location saved` : "Location not saved"} icon="home"
      onPress={async () => { if (await dispatch({ type: "setupStep", step: 0 })) router.push("/setup"); }} /></Panel>
    <SectionTitle>Locations to watch</SectionTitle><Copy muted size={13}>Select up to 20 saved areas. A known entry is required before an exit can trigger an alert.</Copy>
    <Panel>{locations.map(p => <Row key={p.id} title={p.name} detail={`${p.radius} m area`} checked={state.outing.monitoredPlaceIds.includes(p.id)}
      onPress={() => void dispatch({ type: "monitoredPlaces", ids: state.outing.monitoredPlaceIds.includes(p.id) ? state.outing.monitoredPlaceIds.filter(id => id !== p.id) : [...state.outing.monitoredPlaceIds, p.id] })}
      trailing={<Icon name={state.outing.monitoredPlaceIds.includes(p.id) ? "check" : "circle"} color={c.accent} />} />)}</Panel>
    <Action label="Add or edit a saved location" onPress={() => router.push("/places")} />
    <EnableReminders />
    {state.outing.enabled && <>
      <Button label={state.paused ? "Resume reminders" : "Pause reminders"} secondary onPress={() => void dispatch({ type: "pause", enabled: !state.paused })} />
      <Action label="Turn off departure reminders" onPress={() => void dispatch({ type: "outingEnabled", enabled: false })} />
    </>}
    <Copy muted size={13}>Calendar and weather add context. They don’t establish where you’re going or which things you have with you.</Copy>
  </Screen>;
}
export function Settings() {
  const { state, dispatch } = usePreparation();
  const [calendars, setCalendars] = useState<{ id: string; title: string }[]>([]);
  const [message, setMessage] = useState("");
  useEffect(() => { if (state.connections.Calendar) void device.listCalendars().then(setCalendars).catch(e => setMessage(String(e))); }, [state.connections.Calendar]);
  return <Screen tab>
    <Title>Settings</Title><Copy muted>Your reminders, in your control.</Copy>
    <ReadyStatus />
    <SectionTitle>Context for your day</SectionTitle>
    <Panel><Row title="Calendar" detail={state.connections.Calendar ? "Connected · Outie only reads events" : "Optional · no access requested until you connect"} icon="calendar"
      onPress={async () => { try {
        if (state.connections.Calendar) { await dispatch({ type: "connection", kind: "Calendar", enabled: false }); return; }
        const access = await device.permission("Calendar", true);
        await dispatch({ type: "connection", kind: "Calendar", enabled: access === "granted" });
        if (access !== "granted") setMessage("Calendar access is unavailable. Your essentials still work.");
      } catch (e) { setMessage(String(e)); } }} />
      <Row title="Rain reminders" detail="Shares Home coordinates with Open-Meteo for a fresh forecast. AI reasoning stays on-device." icon="shield"
        trailing={<Toggle label="Enable rain reminders" value={state.outing.weatherEnabled} onChange={enabled => void dispatch({ type: "weatherEnabled", enabled })} />} />
    </Panel>
    {state.connections.Calendar && calendars.length > 0 && <>
      <Copy muted size={14}>Calendars used for suggestions. None selected means all accessible calendars.</Copy>
      <Panel>{calendars.map(cal => <Row key={cal.id} title={cal.title} checked={state.outing.calendarIds.includes(cal.id)}
        onPress={() => void dispatch({ type: "calendarIds", ids: state.outing.calendarIds.includes(cal.id) ? state.outing.calendarIds.filter(id => id !== cal.id) : [...state.outing.calendarIds, cal.id] })}
        trailing={<Icon name={state.outing.calendarIds.includes(cal.id) ? "check" : "circle"} color={c.accent} />} />)}</Panel>
    </>}
    {!!message && <Copy muted>{message}</Copy>}
    <SectionTitle>At a glance</SectionTitle>
    <Panel><Row title="Add Outie widgets" detail="Home Screen and Lock Screen reminders · setup guide" icon="door" onPress={() => router.push("/widgets")} /></Panel>
    <SectionTitle>Apple Intelligence</SectionTitle><Panel><IntelligenceStatus /></Panel>
    <Action label="Manage my approved preferences" onPress={() => router.push("/memory")} />
    <Action label="Try the school and rain example" onPress={() => router.push("/demo")} />
    <Action label="Replay setup" onPress={async () => { if (await dispatch({ type: "setupStep", step: 0 })) router.push("/setup"); }} />
    <WeatherCredit />
    <Copy size={12} muted>Outie · Head out. Less left behind.{"\n"}Solar icons © 480 Design, CC BY 4.0. Weather data by Open-Meteo, CC BY 4.0. Rain reminders are advice derived from forecast probabilities.</Copy>
  </Screen>;
}
export function Reminder() {
  const { state, dispatch } = usePreparation();
  const [now, setNow] = useOutingClock();
  const { outingId } = useLocalSearchParams<{ outingId?: string }>();
  const test = outingId?.startsWith("test-outing-");
  const reminder = state.outing.history.find(r => r.id === outingId) || (test ? reminderPreview(state, now, outingId) : undefined);
  return <Screen>
    <Title>{test ? "Test reminder" : "Your outing reminder"}</Title>
    {reminder ? <>
      <Copy muted>{test ? "A notification test using your current unchecked items." : `Saved ${new Date(reminder.createdAt).toLocaleString()}. These items were unchecked at departure.`}</Copy>
      <ReminderBoard reminder={reminder} saved />
      {<Button label={reminder.acknowledgedAt ? "Acknowledged" : test ? "Got it · dismiss this test" : "Got it · acknowledge this outing"} disabled={!!reminder.acknowledgedAt} onPress={() => void dispatch({ type: "acknowledgeOuting", id: reminder.id, at: Date.now() })} />}
      <Copy muted size={13}>Acknowledging dismisses this outing’s alert. It does not mark items checked or disable future reminders.</Copy>
      {(reminder.checklistId === state.outing.checklist.id) && <Panel>
        {(reminder.allItems || reminder.items).map(i => <Row key={i.name} title={i.name} checked={itemChecked(state, i.name, now)}
          onPress={() => { const at = Date.now(); setNow(at); void dispatch({ type: "checkThing", name: i.name, checked: !itemChecked(state, i.name, at), checklistId: state.outing.checklist.id, at }); }}
          trailing={<Icon name={itemChecked(state, i.name, now) ? "check" : "circle"} color={c.accent} />} />)}
      </Panel>}
      <Panel>{reminder.items.map((i, n) => <View key={`${i.name}-${n}`} style={{ paddingVertical: 14, gap: 5 }}><Copy weight="600">{i.name}</Copy><Copy muted>{i.reason}</Copy><Source item={i} /></View>)}</Panel>
    </> : <Copy muted>This outing is no longer in your recent history. Your current checklist is available on Today.</Copy>}
    <Button label="Open Today" onPress={() => router.replace("/")} />
  </Screen>;
}
