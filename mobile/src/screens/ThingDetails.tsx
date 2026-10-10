import { useState } from "react";
import { View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Screen, Title, Copy, Panel, SectionTitle, Field, Button, Action } from "../components/ui";
import { usePreparation } from "../data/store";
import { itemChecked, itemEvidence, itemKey } from "../services/checks";
import { useOutingClock } from "../components/useOutingClock";
import { currentCoordinates } from "../services/device";

export function ThingDetails() {
  const { name: value } = useLocalSearchParams<{ name?: string }>();
  const name = (value || "").trim();
  const { state, dispatch } = usePreparation();
  const [location, setLocation] = useState("");
  const [busy, setBusy] = useState(false), [message, setMessage] = useState("");
  const [now, setNow] = useOutingClock();
  const evidence = itemEvidence(state, name);
  const legacy = [state.personal].flatMap(p => p?.items || []).filter(i => i.source !== "demo" && itemKey(i.name) === itemKey(name));
  const confirmed = Math.max(evidence?.confirmedAt || 0, ...legacy.map(i => Date.parse(i.checkedAt || "") || 0));
  const observed = Math.max(0, ...legacy.map(i => Date.parse(i.observedAt || "") || 0));
  if (!name) return <Screen><Title>Item details</Title><Copy>No item selected. Open an item from Today or My things.</Copy><Button label="Open My things" onPress={() => router.replace("/essentials")} /></Screen>;
  const checked = itemChecked(state, name, now);
  return <Screen>
    <Title>{name}</Title><Copy muted>{checked ? "Confirmed by you for this outing." : "Unchecked for this outing."}</Copy>
    <Button label={checked ? "Uncheck for this outing" : "I have this with me"} onPress={() => { const at = Date.now(); setNow(at); void dispatch({ type: "checkThing", name, checked: !checked, checklistId: state.outing.checklist.id, at }); }} />
    <Copy muted size={13}>Your confirmation is a manual choice. It doesn’t prove an item is packed. Checks reset on return, for a new outing, or after 12 hours.</Copy>
    <SectionTitle>Last confirmed / seen</SectionTitle>
    <Panel><View style={{ gap: 8, paddingVertical: 14 }}>
      <Copy weight="600">Last confirmed by you</Copy><Copy muted>{confirmed ? new Date(confirmed).toLocaleString() : "No confirmation recorded yet"}</Copy>
      {observed > 0 && <><Copy weight="600">Last visual check</Copy><Copy muted>{new Date(observed).toLocaleString()}. A recorded photo check is not proof of packing.</Copy></>}
    </View></Panel>
    <SectionTitle>Last recorded location</SectionTitle>
    <Panel><View style={{ gap: 8, paddingVertical: 14 }}><Copy weight="600">{evidence?.location?.label || "No location recorded"}</Copy>
      {evidence?.location && <Copy muted size={14}>{new Date(evidence.location.at).toLocaleString()}{"\n"}{evidence.location.source === "user" ? "Place entered by you" : "Your phone’s location when recorded; not a tracker location"}</Copy>}
    </View></Panel>
    <Field label="Where did you last have it?" value={location} onChange={setLocation} placeholder="Desk at Home, office drawer…" />
    <Button label="Save recorded place" secondary disabled={!location.trim()} onPress={async () => { if (await dispatch({ type: "recordThingLocation", name, label: location, at: Date.now(), source: "user" })) { setLocation(""); setMessage("Recorded place saved. This does not change your check status."); } }} />
    <Action label={busy ? "Getting your phone’s location…" : "Record my phone’s current location"} onPress={() => {
      if (busy) return; setBusy(true); setMessage("");
      void currentCoordinates().then(async coords => {
        if (await dispatch({ type: "recordThingLocation", name, label: `Phone near ${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`, ...coords, at: Date.now(), source: "phone" })) setMessage("Phone location recorded. Outie has not located this object.");
      }).catch(e => setMessage(e instanceof Error ? e.message : String(e))).finally(() => setBusy(false));
    }} />
    {!!message && <Copy muted>{message}</Copy>}
    <Action label="Open Today" onPress={() => router.replace("/")} />
  </Screen>;
}
