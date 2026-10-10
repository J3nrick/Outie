import { useState } from "react";
import { router } from "expo-router";
import { View } from "react-native";
import { Screen, Title, Copy, Button, Panel, Action } from "../components/ui";
import { initialState } from "../data/model";
import { reminderPreview, contextKey } from "../services/outing-policy";
import { prepareOutingContext } from "../services/outing-context";
import { modelAvailability } from "../services/intelligence";
import { interpretWithDeadline } from "../services/context-runtime";
import type { OutingContext } from "../data/outing";
import { colors as c } from "../design/tokens";

export function OutingDemo() {
  const [step, setStep] = useState(0), [busy, setBusy] = useState(false);
  const [context, setContext] = useState<OutingContext | null>(null);
  const [now] = useState(Date.now);
  const [keysChecked, setKeysChecked] = useState(false);
  const sample = initialState();
  sample.essentials = ["Keys", "Wallet"];
  sample.places = [{ id: "sample-home", name: "Home", description: "Sample location", radius: 200, latitude: 14.55, longitude: 121.02 }];
  sample.connections.Calendar = true;
  sample.outing = { ...sample.outing, checklist: { id: "sample-checklist", generation: 0, startedAt: now, checks: keysChecked ? [{ key: "keys", confirmedAt: now }] : [] }, homeId: "sample-home", weatherEnabled: true,
    routines: [{ id: "school", name: "School", keywords: ["class"], items: ["School ID", "Calculator"] }], context };
  const events = [{ id: "sample-class", title: "Math class", destination: "School", startsAt: new Date(now + 3600000).toISOString(), endsAt: new Date(now + 7200000).toISOString() }];
  const forecast = { provider: "Open-Meteo" as const, latitude: 14.55, longitude: 121.02, fetchedAt: now, utcOffsetSeconds: 28800,
    hours: [{ at: now, rainChance: 80, precipitation: 2 }] };
  const previewState = context ? sample : { ...sample, outing: { ...sample.outing, context: {
    inputKey: contextKey(sample), preparedAt: now, expiresAt: now + 3600000, events, forecast,
    items: [{ name: "School ID", reason: "Chosen in the sample school routine.", source: "routine" as const, eventId: "sample-class" },
      { name: "Calculator", reason: "Chosen in the sample school routine.", source: "routine" as const, eventId: "sample-class" }],
    modelStatus: "Sample routine, not AI output", calendarStatus: "Sample event", weatherStatus: "Sample forecast",
  } } };
  const reminder = reminderPreview(previewState, now);
  async function generate() {
    setBusy(true);
    try { setContext(await prepareOutingContext(sample, {
      events: async () => events, forecast: async () => forecast,
      availability: modelAvailability, interpret: interpretWithDeadline,
    }, now)); } finally { setBusy(false); }
  }
  return <Screen>
    <Copy size={14} weight="600" style={{ color: c.accent }}>Guided example · step {step + 1} of 3</Copy>
    <Title>{["A school day. Rain later.", "A reminder that fits today", "That’s the whole idea."][step]}</Title>
    <Copy muted>Sample Home, Calendar event, and forecast. No permissions requested and no personal data or monitoring changed.</Copy>
    {step === 0 && <>
      <Panel><Copy weight="600">Your sample essentials</Copy><Copy>Keys, wallet</Copy><Copy weight="600">School routine</Copy><Copy>School ID, calculator</Copy><Copy weight="600">Today’s example</Copy><Copy>Math class in an hour. An 80% rain probability near Home.</Copy></Panel>
      <Button label={busy ? "Preparing on-device suggestions…" : "Try Apple Intelligence with this sample"} secondary disabled={busy} onPress={() => void generate()} />
      {!!context && <Copy muted>{context.modelStatus}. The event and weather remain sample data.</Copy>}
      <Button label={keysChecked ? "Sample Keys confirmed · uncheck" : "Confirm sample Keys for this outing"} secondary onPress={() => setKeysChecked(!keysChecked)} />
      <Button label="Preview leaving Home" disabled={busy} onPress={() => setStep(1)} />
    </>}
    {step === 1 && <>
      <View accessibilityRole="alert" style={{ backgroundColor: "white", borderRadius: 24, padding: 22, gap: 10 }}>
        <Copy size={13} style={{ color: c.accent }} weight="600">Simulated departure · in-app preview</Copy>
        <Copy size={21} weight="700">{reminder.title}</Copy><Copy>{reminder.body}</Copy>
      </View>
      <Copy muted>No real departure or system notification occurred. {context ? context.modelStatus : "Items come from the sample routine and weather rule, not AI."}</Copy>
      <Button label="See how it works" onPress={() => setStep(2)} />
    </>}
    {step === 2 && <>
      <Panel><Copy>Save Home and the things you tend to forget. Outie combines them with relevant calendar and weather context, then reminds you only about things left unchecked when you leave.</Copy></Panel>
      <Copy muted>Checks apply to one outing. Local AI runs on supported iPhones; saved essentials work without it.</Copy>
      <Button label="Set up my reminders" onPress={() => router.replace("/setup")} />
      <Action label="Replay the example" onPress={() => { setStep(0); setContext(null); setKeysChecked(false); }} />
    </>}
    <Action label="Return to Outie" onPress={() => router.back()} />
  </Screen>;
}
