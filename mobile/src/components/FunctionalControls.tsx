import { useEffect, useRef, useState } from "react";
import { Image, View, AppState } from "react-native";
import { Copy, Button, Panel, Action } from "./ui";
import { usePreparation } from "../data/store";
import {
  bridge,
  generateEssentials,
  modelAvailability,
} from "../services/intelligence";
import { capturePhoto, saveReference, scheduleCheck } from "../services/device";
import { type Item } from "../data/model";
export function IntelligenceStatus() {
  const [availability, setAvailability] = useState("Checking local model…");
  useEffect(() => {
    const refresh = () =>
      void modelAvailability()
        .then(setAvailability)
        .catch((e) => setAvailability(String(e)));
    refresh();
    const listener = AppState.addEventListener("change", (s) => {
      if (s === "active") refresh();
    });
    return () => listener.remove();
  }, []);
  return (
    <>
      <Copy weight="500">Local AI</Copy>
      <Copy muted>
        {availability === "available" ? "On-device model ready" : availability}
      </Copy>
    </>
  );
}
export function GenerateControls() {
  const { state, dispatch } = usePreparation();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const request = useRef(0);
  useEffect(
    () => () => {
      request.current++;
    },
    [],
  );
  const plan = state.demo ? null : state.personal;
  const attempted = useRef<string | null>(null);
  useEffect(() => {
    if (!plan || plan.generatedAt || attempted.current === plan.id) return;
    attempted.current = plan.id;
    const id = ++request.current;
    void modelAvailability()
      .then(async (available) => {
        if (available !== "available" || id !== request.current) return;
        setBusy(true);
        setMessage("Generating on this device…");
        try {
          const items = await generateEssentials({
            title: plan.title,
            destination: plan.destination,
            startsAt: plan.startsAt,
            everyday: state.essentials,
            approvedPreferences: state.memories,
            existingItems: plan.items.map((i) => i.name),
          });
          if (id === request.current) {
            const saved = await dispatch({
              type: "generated",
              planId: plan.id,
              items,
              at: new Date().toISOString(),
            });
            setMessage(
              saved
                ? "Local suggestions added. Review before confirming."
                : "Suggestions could not be saved. Retry generation.",
            );
          }
        } catch (e) {
          if (id === request.current) setMessage(String(e));
        } finally {
          if (id === request.current) setBusy(false);
        }
      })
      .catch((e) => setMessage(String(e)));
  }, [plan, state.essentials, state.memories, dispatch]);
  if (!plan) return null;
  async function generate() {
    if (!plan) return;
    const id = ++request.current;
    setBusy(true);
    setMessage("Generating on this device…");
    try {
      const items = await generateEssentials({
        title: plan.title,
        destination: plan.destination,
        startsAt: plan.startsAt,
        everyday: state.essentials,
        approvedPreferences: state.memories,
        existingItems: plan.items.map((i) => i.name),
      });
      if (id !== request.current) return;
      const saved = await dispatch({
        type: "generated",
        planId: plan.id,
        items,
        at: new Date().toISOString(),
      });
      setMessage(
        saved
          ? "Local suggestions generated. Review each item before confirming."
          : "Suggestions could not be saved. Retry generation.",
      );
    } catch (e) {
      if (id === request.current) setMessage(String(e));
    } finally {
      if (id === request.current) setBusy(false);
    }
  }
  return (
    <Panel>
      <Button
        label={busy ? "Generating…" : "Suggest essentials with local AI"}
        disabled={busy}
        onPress={() => void generate()}
      />
      {busy && (
        <Button
          secondary
          label="Cancel generation"
          onPress={() => {
            request.current++;
            setBusy(false);
            setMessage("Result discarded. Your checklist is unchanged.");
          }}
        />
      )}
      {state.automation?.pending?.plan.id === plan.id && (
        <Button
          secondary
          label="Acknowledge departure alert"
          onPress={() => {
            void dispatch({ type: "acknowledge", planId: plan.id }).then(
              (saved) => {
                if (saved)
                  setMessage(
                    "Departure alert acknowledged. Items remain unchanged.",
                  );
              },
            );
          }}
        />
      )}
      <Button
        secondary
        label="Remind me in 5 minutes"
        onPress={() =>
          void scheduleCheck(plan, 300, `snooze-${plan.id}`)
            .then((id) =>
              setMessage(
                id
                  ? "Reminder scheduled for this plan."
                  : "Everything is resolved; no reminder is needed.",
              ),
            )
            .catch((e) => setMessage(String(e)))
        }
      />
      {!!message && <Copy muted>{message}</Copy>}
    </Panel>
  );
}
export function ObservationControls({ item }: { item: Item }) {
  const { state, dispatch } = usePreparation();
  const [capture, setCapture] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [expanded, setExpanded] = useState(false);
  if (state.demo) return null;
  if (!expanded)
    return (
      <View style={{ gap: 6 }}>
        <Action label="Photo checks" onPress={() => setExpanded(true)} />
        {item.observedAt && (
          <Copy muted size={13}>
            Visually checked · manual confirmation remains separate.
          </Copy>
        )}
      </View>
    );
  async function photo(reference: boolean) {
    setBusy(true);
    try {
      const uri = await capturePhoto();
      if (!uri) return;
      if (reference) {
        const saved = await saveReference(uri, item.id);
        dispatch({ type: "reference", id: item.id, uri: saved });
        setMessage("Reference saved on this device.");
      } else {
        setCapture(uri);
        if (item.referenceUri && bridge) {
          const distance = await bridge.compare(item.referenceUri, uri);
          setMessage(
            `Local image comparison distance: ${distance.toFixed(2)}. This is not a match verdict. Compare the photos and decide whether this item is visible.`,
          );
        } else
          setMessage(
            "Review the photo. Automatic comparison requires iOS with the native module.",
          );
      }
    } catch (e) {
      setMessage(String(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <View style={{ gap: 8 }}>
      <Button
        secondary
        disabled={busy}
        label={
          item.referenceUri
            ? "Replace reference photo"
            : "Register reference photo"
        }
        onPress={() => void photo(true)}
      />
      {!!item.referenceUri && (
        <Image
          source={{ uri: item.referenceUri }}
          style={{ width: 100, height: 100, borderRadius: 12 }}
          accessibilityLabel={`Reference photo for ${item.name}`}
        />
      )}
      <Button
        secondary
        disabled={busy}
        label={`Visually check ${item.name}`}
        onPress={() => void photo(false)}
      />
      {capture && (
        <>
          <Image
            source={{ uri: capture }}
            style={{ width: 160, height: 160, borderRadius: 12 }}
            accessibilityLabel={`Current photo for ${item.name}`}
          />
          <Button
            label="I can see this item in the photo"
            onPress={() => {
              dispatch({
                type: "observe",
                id: item.id,
                at: new Date().toISOString(),
                detail:
                  "Photo reviewed by you; item visible. Packing not verified.",
              });
              setCapture(null);
            }}
          />
        </>
      )}
      {item.observedAt && (
        <Copy muted size={13}>
          Visually checked · {new Date(item.observedAt).toLocaleString()}.
          Manual confirmation remains separate.
        </Copy>
      )}
      {!!message && (
        <Copy muted size={13}>
          {message}
        </Copy>
      )}
    </View>
  );
}
