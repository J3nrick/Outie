import { useState, useRef, useId, useEffect } from "react";
import {
  View,
  Switch,
  Platform,
  ActivityIndicator,
  AppState,
  useWindowDimensions,
  Linking,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Image } from "expo-image";
import {
  Screen,
  Copy,
  Title,
  Button,
  Panel,
  Row,
  Action,
  Badge,
  SectionTitle,
  Field,
  Empty,
  ConnectionNotice,
} from "../components/ui";
import Animated, {
  LinearTransition,
  FadeOut,
  ReduceMotion,
} from "react-native-reanimated";
import { MotionPressable } from "../components/MotionPressable";
import { useMaterialPreferences } from "../components/useMaterialPreferences";
import { Icon, type IconName } from "../components/Icon";
import { colors as c } from "../design/tokens";
import {
  GenerateControls,
  IntelligenceStatus,
  ObservationControls,
} from "../components/FunctionalControls";
import * as device from "../services/device";
import { locatedPlaces, monitoringSetup } from "../services/monitoring";
import { errorMessage } from "../services/errors";
import { usePreparation } from "../data/store";
import {
  activePlan,
  unresolved,
  type Item,
  type Connection,
  type Scenario,
} from "../data/model";

import { DeparturePass } from "../components/DeparturePass";

const go = (
  path:
    | "/setup"
    | "/checklist"
    | "/context"
    | "/places"
    | "/memory"
    | "/notification"
    | "/scenarios",
) => router.push(path);
const ITEM_REFLOW = LinearTransition.duration(180).reduceMotion(
  ReduceMotion.System,
);
const ITEM_EXIT = FadeOut.duration(120).reduceMotion(ReduceMotion.System);
function ItemRow({
  item,
  editable = false,
  compact = false,
}: {
  item: Item;
  editable?: boolean;
  compact?: boolean;
}) {
  const { dispatch } = usePreparation();
  const { reduceMotion } = useMaterialPreferences();
  const resolved = item.status !== "unchecked";
  return (
    <Animated.View
      layout={reduceMotion ? undefined : ITEM_REFLOW}
      exiting={ITEM_EXIT}
      style={{
        paddingVertical: 16,
        borderBottomWidth: compact ? 0 : 1,
        borderColor: c.line,
        gap: 8,
      }}
    >
      <MotionPressable
        testID={`item-${item.id}`}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: resolved }}
        accessibilityLabel={`${item.name}. ${item.status === "confirmed" ? "Confirmed by you" : item.status === "excluded" ? "Intentionally left behind" : "Not checked"}`}
        onPress={() =>
          dispatch({
            type: "toggle",
            id: item.id,
            at: new Date().toISOString(),
          })
        }
        style={{
          flexDirection: "row",
          gap: 14,
          alignItems: "flex-start",
        }}
      >
        <Animated.View
          style={{
            transform: [{ scale: resolved ? 1 : 0.97 }],
            backgroundColor: resolved ? c.paleAccent : "transparent",
            borderRadius: 16,
            transitionProperty: ["transform", "backgroundColor"],
            transitionDuration: reduceMotion ? 0 : 150,
          }}
        >
          <Icon
            name={resolved ? "check" : "circle"}
            size={28}
            color={resolved ? c.accent : c.slate}
          />
        </Animated.View>
        <View style={{ flex: 1, gap: 4 }}>
          <Copy weight="600" size={compact ? 16 : 18}>
            {item.name}
          </Copy>
          <Copy size={compact ? 12 : 14} muted>
            {item.status === "confirmed"
              ? "Confirmed by you"
              : item.status === "excluded"
                ? "Intentionally left behind"
                : item.reason}
          </Copy>
          {editable && (
            <Copy size={12} muted>
              {item.source === "demo"
                ? "Demo example"
                : item.source === "ai"
                  ? "Suggested by local AI"
                  : "Added by you"}
            </Copy>
          )}
          {item.checkedAt && (
            <Copy size={12} muted>
              Checked at{" "}
              {new Date(item.checkedAt).toLocaleTimeString([], {
                hour: "numeric",
                minute: "2-digit",
              })}
            </Copy>
          )}
        </View>
      </MotionPressable>
      {editable && <ObservationControls item={item} />}
      {editable && (
        <View
          style={{
            flexDirection: "row",
            gap: 24,
            paddingLeft: 42,
            flexWrap: "wrap",
          }}
        >
          <Action
            label={
              item.status === "excluded" ? "Include again" : "Leave behind"
            }
            onPress={() => dispatch({ type: "exclude", id: item.id })}
          />
          <Action
            label="Remove"
            accessibilityLabel={`Remove ${item.name}`}
            danger
            onPress={() => dispatch({ type: "remove", id: item.id })}
          />
        </View>
      )}
    </Animated.View>
  );
}

export function Today({ welcome = false }: { welcome?: boolean } = {}) {
  const { fontScale } = useWindowDimensions();
  const { state, dispatch } = usePreparation();
  const plan = activePlan(state);
  const pending = unresolved(plan);
  if (welcome || !state.setupComplete)
    return (
      <Screen legacyDemo tab={!welcome} safeTop={welcome}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Copy size={20} weight="700">Outie</Copy>
        </View>
        <View style={{ paddingTop: 16, gap: 20 }}>
          <Image
            source={require("../../assets/images/outie-icon.png")}
            style={{ width: 88, height: 88, borderRadius: 22 }}
            contentFit="cover"
            accessibilityLabel="Outie, a winking open doorway"
          />
          <Title>Head out.{"\n"}Less left behind.</Title>
          <Copy muted size={18}>
            A little preparation for wherever your day takes you.
          </Copy>
          <Panel>
            <Row
              title="Know what to bring"
              detail="Essentials matched to your next activity."
              icon="bag"
            />
            <Row
              title="Check before you go"
              detail="Keep important belongings in view."
              icon="check"
            />
            <Row
              title="A timely nudge"
              detail="Explore the departure reminder preview."
              icon="bell"
            />
          </Panel>
          <Copy muted size={13}>
            Manual preparation works on every device. Local AI and device
            connections require a supported native app. Your data is saved
            locally.
          </Copy>
          {welcome && state.setupComplete && (
            <Button
              label="Return to my preparation"
              onPress={() => router.replace("/")}
            />
          )}
          <Button
            label="Set up my routine"
            onPress={() => go("/setup")}
            testID="start-setup"
          />
          <Button
            secondary
            label="Explore the presentation demo"
            onPress={() => {
              dispatch({ type: "demo", enabled: true });
              if (welcome) router.replace("/");
            }}
            testID="explore-demo"
          />
        </View>
      </Screen>
    );
  return (
    <Screen legacyDemo key={`${state.demo}-${state.scenario}`} tab>
      <View
        style={{
          flexDirection: fontScale > 1.5 ? "column" : "row",
          justifyContent: "space-between",
          alignItems: fontScale > 1.5 ? "flex-start" : "center",
        }}
      >
        <View
          style={{
            gap: 2,
            flex: fontScale > 1.5 ? undefined : 1,
            minWidth: 0,
            maxWidth: "100%",
          }}
        >
          <Copy size={21} weight="700" style={{ letterSpacing: -0.4 }}>
            Your day, at a glance
          </Copy>
          <Copy muted size={12}>
            Today
          </Copy>
        </View>
        <View style={{ flexDirection: "row", gap: 2 }}>
          <MotionPressable
            accessibilityRole="button"
            accessibilityLabel="Open Settings"
            onPress={() => router.navigate("/settings")}
            style={{
              width: 44,
              height: 44,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon name="settings" size={23} color={c.slate} />
          </MotionPressable>
          <MotionPressable
            accessibilityRole="button"
            accessibilityLabel="Leave preview and return to welcome"
            onPress={() => router.push("/welcome")}
            style={{
              width: 44,
              height: 44,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon name="door" size={23} color={c.slate} />
          </MotionPressable>
        </View>
      </View>
      {!state.demo && (
        <Copy muted size={13}>
          Personal preparation · saved locally
        </Copy>
      )}
      <ConnectionNotice />
      {state.demo && state.scenario === "loading" ? (
        <Panel>
          <View style={{ padding: 24, gap: 12 }}>
            <ActivityIndicator color={c.accent} />
            <Copy>Preparing the sample plan…</Copy>
            <Copy muted size={13}>
              Loading-state preview.
            </Copy>
            <Action
              label="Show prepared plan"
              onPress={() =>
                dispatch({ type: "scenario", scenario: "presentation" })
              }
            />
          </View>
        </Panel>
      ) : state.demo &&
        [
          "error",
          "ambiguous",
          "unavailable",
          "stale",
          "denied",
          "tracker",
        ].includes(state.scenario) ? (
        <ScenarioContent />
      ) : !plan ? (
        <Empty
          title="No planned departure"
          detail="Add an activity and choose what you need. You can also explore the sample presentation."
        >
          <Button label="Plan an activity" onPress={() => go("/context")} />
          <Button
            secondary
            label="Explore presentation demo"
            onPress={() =>
              dispatch({ type: "scenario", scenario: "presentation" })
            }
          />
        </Empty>
      ) : (
        <>
          <DeparturePass
            title={plan.title}
            time={plan.time}
            destination={plan.destination}
          />
          <View>
            <SectionTitle
              action={
                <Action label="View all" onPress={() => go("/checklist")} />
              }
            >
              {!plan.items.length
                ? "Add your essentials"
                : pending.length
                  ? "Still to check"
                  : "Checks complete"}
            </SectionTitle>
            {pending.slice(0, 3).map((item) => (
              <View
                key={item.id}
                style={{
                  backgroundColor: c.surface,
                  borderRadius: 20,
                  paddingHorizontal: 16,
                  marginTop: 10,
                }}
              >
                <ItemRow item={item} compact />
              </View>
            ))}
            {!pending.length && (
              <Copy muted>
                {plan.items.length
                  ? "All items are confirmed or intentionally excluded. Checking does not prove they are packed."
                  : "Your checklist is empty. Open Check to add items or request local suggestions."}
              </Copy>
            )}
            {pending.length > 3 && (
              <Copy muted size={14}>
                {pending.length - 3} more in your checklist
              </Copy>
            )}
          </View>
          <Copy muted size={12}>
            Checking confirms your choice, not that an item is packed.
          </Copy>
          {state.demo && (
            <Button
              secondary
              label="Preview leaving Home"
              icon="bell"
              onPress={() => {
                dispatch({ type: "depart" });
                go("/notification");
              }}
            />
          )}
        </>
      )}
      <Action label="Change activity" onPress={() => go("/context")} />
    </Screen>
  );
}

export function Checklist() {
  const { planId } = useLocalSearchParams<{ planId?: string }>();
  const { state, dispatch } = usePreparation();
  const plan = activePlan(state);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const prefix = useId();
  const serial = useRef(0);
  if (!plan || (planId && (state.demo || plan.id !== planId)))
    return (
      <Screen legacyDemo>
        <Empty
          title={
            planId ? "This departure is no longer active" : "No checklist yet"
          }
          detail={
            planId
              ? "Open Today to view your current preparation."
              : "Choose an activity to start preparing."
          }
        >
          <Button
            label="Plan an activity"
            onPress={() => router.replace("/context")}
          />
        </Empty>
      </Screen>
    );
  function add() {
    const clean = name.trim();
    if (!clean) return;
    if (plan?.items.some((i) => i.name.toLowerCase() === clean.toLowerCase())) {
      setError("This item is already in your checklist.");
      return;
    }
    dispatch({
      type: "add",
      name: clean,
      id: `custom-${prefix}-${++serial.current}`,
    });
    setName("");
    setError("");
  }
  return (
    <Screen legacyDemo>
      <Title>{plan.title}</Title>
      <GenerateControls />
      <Copy muted>
        {plan.items.filter((i) => i.status !== "unchecked").length} of{" "}
        {plan.items.length} items resolved
      </Copy>
      <Copy muted size={13}>
        Confirmed by you and intentionally left behind are separate choices.
        Neither proves an item is packed.
      </Copy>
      <View>
        {plan.items.map((item) => (
          <ItemRow key={item.id} item={item} editable />
        ))}
        {!plan.items.length && (
          <Copy muted>No items yet. Add your first essential below.</Copy>
        )}
      </View>
      <Field
        label="Add an essential"
        value={name}
        onChange={setName}
        placeholder="For example, printed agenda"
      />
      {!!error && <Copy style={{ color: c.danger }}>{error}</Copy>}
      <Button label="Add item" disabled={!name.trim()} onPress={add} />
      {state.demo && (
        <Button
          secondary
          label="Preview departure check"
          onPress={() => {
            dispatch({ type: "depart" });
            go("/notification");
          }}
        />
      )}
    </Screen>
  );
}

export function Essentials() {
  const { state, dispatch } = usePreparation();
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  return (
    <Screen legacyDemo tab>
      <Title>Essentials</Title>
      <Copy muted>Your everyday belongings, ready for the next plan.</Copy>
      <Copy muted size={13}>
        Your essentials · saved locally
      </Copy>
      {state.essentials.length ? (
        <Panel>
          {state.essentials.map((item) => (
            <Row
              key={item}
              title={item}
              icon="bag"
              trailing={
                <Action
                  label="Remove"
                  accessibilityLabel={`Remove ${item}`}
                  danger
                  onPress={() =>
                    dispatch({ type: "removeEssential", name: item })
                  }
                />
              }
            />
          ))}
        </Panel>
      ) : (
        <Empty
          icon="bag"
          title="Start with the everyday"
          detail="Add the things you usually take: keys, wallet, company ID."
        />
      )}
      <Field
        label="Essential name"
        value={name}
        onChange={setName}
        placeholder="Company ID"
      />
      <Button
        label="Add essential"
        disabled={!name.trim()}
        onPress={() => {
          if (
            state.essentials.some(
              (x) => x.toLowerCase() === name.trim().toLowerCase(),
            )
          ) {
            setMessage("This essential is already listed.");
            return;
          }
          dispatch({ type: "essential", name });
          setName("");
          setMessage("");
        }}
      />
      {!!message && <Copy style={{ color: c.danger }}>{message}</Copy>}
      <Panel>
        <Row
          title="Your preparation preferences"
          detail={`${state.memories.length} approved in this preview`}
          icon="memory"
          onPress={() => go("/memory")}
        />
        <Row
          title="Camera checks"
          detail="Recognition is planned; no scans run here."
          icon="camera"
          onPress={() =>
            router.push({ pathname: "/connection", params: { kind: "Camera" } })
          }
        />
        <Row
          title="Item trackers"
          detail="Supported accessory integration comes later."
          icon="location"
          onPress={() => {
            dispatch({ type: "scenario", scenario: "tracker" });
            router.navigate("/");
          }}
        />
      </Panel>
    </Screen>
  );
}

export function Settings() {
  const { state, dispatch } = usePreparation();
  const [confirmReset, setConfirmReset] = useState(false);
  return (
    <Screen legacyDemo tab>
      <Title>Settings</Title>
      <Copy muted>Make preparation fit your routine.</Copy>
      <Panel>
        <Row
          title="Demo Mode"
          detail="Sample plans stay separate from personal choices."
          icon="play"
          trailing={
            <Switch
              accessibilityLabel="Demo Mode"
              value={state.demo}
              onValueChange={(enabled) => {
                void dispatch({ type: "demo", enabled });
              }}
              trackColor={{ false: "#CED2D1", true: c.accent }}
              thumbColor="#FFFFFF"
              {...(Platform.OS === "web" ? { activeThumbColor: "#FFFFFF" } : {})}
            />
          }
        />
        <Row
          title="Pause automation"
          detail="Pauses saved-area monitoring and preparation reminders."
          icon="bell"
          trailing={
            <Switch
              accessibilityLabel="Pause automation"
              value={state.paused}
              onValueChange={(enabled) => {
                void dispatch({ type: "pause", enabled });
              }}
              trackColor={{ false: "#CED2D1", true: c.accent }}
              thumbColor="#FFFFFF"
              {...(Platform.OS === "web" ? { activeThumbColor: "#FFFFFF" } : {})}
            />
          }
        />
      </Panel>
      <SectionTitle>Connections</SectionTitle>
      <ConnectionNotice />
      <Panel>
        {(
          ["Calendar", "Camera", "Notifications", "Location"] as Connection[]
        ).map((kind) => (
          <Row
            key={kind}
            title={kind}
            detail={
              state.connections[kind]
                ? state.demo
                  ? "Enabled in demo"
                  : "Enabled · check system access"
                : "Not connected"
            }
            icon={connectionIcon[kind]}
            onPress={() =>
              router.push({ pathname: "/connection", params: { kind } })
            }
          />
        ))}
      </Panel>
      <SectionTitle>Your routine</SectionTitle>
      <Panel>
        <Row
          title="Saved places"
          detail={`${state.places.length} saved places`}
          icon="home"
          onPress={() => go("/places")}
        />
        <Row
          title="Preparation reminder"
          detail={`${state.leadMinutes} minutes before an event`}
          icon="clock"
          trailing={
            <View style={{ flexDirection: "row", gap: 14 }}>
              <Action
                label="−"
                accessibilityLabel="Decrease reminder lead time"
                onPress={() =>
                  dispatch({ type: "lead", minutes: state.leadMinutes - 5 })
                }
              />
              <Action
                label="+"
                accessibilityLabel="Increase reminder lead time"
                onPress={() =>
                  dispatch({ type: "lead", minutes: state.leadMinutes + 5 })
                }
              />
            </View>
          }
        />
        <Row
          title="Approved preferences"
          detail="You choose what becomes a lasting rule."
          icon="memory"
          onPress={() => go("/memory")}
        />
      </Panel>
      <SectionTitle>Intelligence</SectionTitle>
      <Panel>
        <IntelligenceStatus />
      </Panel>
      <Action
        label="Explore preview scenarios"
        onPress={() => go("/scenarios")}
      />
      <Button
        secondary
        label="Reset local preparation data"
        onPress={() => setConfirmReset(true)}
      />
      <View>
        {confirmReset && (
          <Panel>
            <View style={{ gap: 12, paddingVertical: 16 }}>
              <Copy weight="600">Reset local data?</Copy>
              <Copy muted>
                This permanently clears this app’s saved plans, places and
                preferences.
              </Copy>
              <Button
                label="Confirm reset"
                onPress={() => {
                  dispatch({ type: "reset" });
                  setConfirmReset(false);
                  router.navigate("/");
                }}
              />
              <Action
                label="Cancel reset"
                onPress={() => setConfirmReset(false)}
              />
            </View>
          </Panel>
        )}
      </View>
      <Copy muted size={12}>
        Outie · Head out. Less left behind.{"\n"}Solar icons by 480 Design · CC BY
        4.0.{"\n"}Personal preparation is saved on this device. Demo signals
        remain simulated.
      </Copy>
    </Screen>
  );
}

export function Setup() {
  const { dispatch } = usePreparation();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("Home");
  const [description, setDescription] = useState("");
  const [selected, setSelected] = useState(["Keys", "Phone", "Wallet"]);
  const options = ["Keys", "Phone", "Wallet", "Company ID", "Laptop charger"];
  return (
    <Screen legacyDemo
      footer={
        <Button
          label={step === 0 ? "Choose everyday essentials" : "Finish setup"}
          disabled={!name.trim()}
          onPress={() => {
            if (!step) setStep(1);
            else {
              dispatch({
                type: "setup",
                place: {
                  id: "home",
                  name: name.trim(),
                  description: description.trim(),
                  radius: 200,
                },
                essentials: selected,
              });
              router.dismiss();
            }
          }}
        />
      }
    >
      <Copy muted size={13}>
        Step {step + 1} of 2 · frontend preview
      </Copy>
      <Title>
        {step === 0 ? "Where do you leave from?" : "What comes with you?"}
      </Title>
      <Copy muted>
        {step === 0
          ? "Start with one familiar place. Location monitoring will be connected after UI approval."
          : "Choose your everyday essentials. You can change these any time."}
      </Copy>
      {step === 0 ? (
        <>
          <Field label="Place name" value={name} onChange={setName} />
          <Field
            label="Address or description"
            value={description}
            onChange={setDescription}
            placeholder="Your neighborhood or a helpful note"
          />
          <Panel>
            <Row
              title="Location stays in your control"
              detail="This form does not access GPS or create a geofence."
              icon="shield"
            />
          </Panel>
        </>
      ) : (
        <>
          <Panel>
            {options.map((item) => (
              <Row
                key={item}
                title={item}
                checked={selected.includes(item)}
                onPress={() =>
                  setSelected((current) =>
                    current.includes(item)
                      ? current.filter((x) => x !== item)
                      : [...current, item],
                  )
                }
                trailing={
                  <Icon
                    name={selected.includes(item) ? "check" : "circle"}
                    color={selected.includes(item) ? c.accent : c.slate}
                  />
                }
              />
            ))}
          </Panel>
          <Action label="Back to saved place" onPress={() => setStep(0)} />
        </>
      )}
      <Copy muted size={13}>
        Your routine is saved locally.
      </Copy>
    </Screen>
  );
}

export function Context() {
  const { dispatch } = usePreparation();
  const [title, setTitle] = useState("");
  const [destination, setDestination] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const validTime =
    !startsAt.trim() || Number.isFinite(new Date(startsAt).getTime());
  return (
    <Screen legacyDemo>
      <Title>Where are you headed?</Title>
      <Copy muted>
        Start with your everyday essentials, then request local AI suggestions
        from the checklist.
      </Copy>
      <Field
        label="Activity"
        value={title}
        onChange={setTitle}
        placeholder="Client presentation"
      />
      <Field
        label="Destination"
        value={destination}
        onChange={setDestination}
        placeholder="Client office"
      />
      <Field
        label="Event date and time (optional)"
        value={startsAt}
        onChange={setStartsAt}
        placeholder="2026-10-10T10:30:00+08:00"
      />
      {!validTime && (
        <Copy muted>Enter a valid date and time with a time zone.</Copy>
      )}
      <Button
        label="Create preparation plan"
        disabled={!title.trim() || !validTime}
        onPress={() => {
          void dispatch({
            type: "plan",
            title,
            destination,
            startsAt: startsAt.trim()
              ? new Date(startsAt).toISOString()
              : undefined,
          }).then((saved) => {
            if (saved) router.dismiss();
          });
        }}
      />
      <Button
        secondary
        label="Use the presentation demo"
        onPress={() => {
          dispatch({ type: "scenario", scenario: "presentation" });
          router.dismiss();
        }}
      />
    </Screen>
  );
}

export function Places() {
  const { state, dispatch } = usePreparation();
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [coordinates, setCoordinates] = useState<
    { latitude: number; longitude: number } | undefined
  >();
  const [locationMessage, setLocationMessage] = useState("");
  return (
    <Screen legacyDemo>
      <Title>Your starting points</Title>
      <Action label="Back to departure reminders" onPress={() => router.canGoBack() ? router.back() : router.replace("/reminders")} />
      <Copy muted>
        Save your current location for a place, then enable background
        monitoring in Departure reminders. Select which places to watch; area exits are approximate.
      </Copy>
      {state.places.length ? (
        <Panel>
          {state.places.map((place) => (
            <View key={place.id}>
              <Row
                title={place.name}
                detail={`${place.description || "No address set"} · ${place.radius} m area${place.latitude === undefined ? " · location not set" : " · location saved"}`}
                icon="home"
                onPress={() => {
                  setId(place.id);
                  setName(place.name);
                  setDescription(place.description);
                  setCoordinates(
                    place.latitude === undefined
                      ? undefined
                      : {
                          latitude: place.latitude,
                          longitude: place.longitude!,
                        },
                  );
                }}
              />
              <Action
                label={`Remove ${place.name}`}
                danger
                onPress={() => dispatch({ type: "removePlace", id: place.id })}
              />
            </View>
          ))}
        </Panel>
      ) : (
        <Copy muted>No places yet. Add one below.</Copy>
      )}
      <Field
        label="Place name"
        value={name}
        onChange={setName}
        placeholder="Home"
      />
      <Field
        label="Address or description"
        value={description}
        onChange={setDescription}
      />
      <Button
        secondary
        label="Use my current location"
        onPress={() =>
          void device
            .currentCoordinates()
            .then((value) => {
              setCoordinates(value);
              setLocationMessage(
                "Current location captured. Save this place to keep it.",
              );
            })
            .catch((e) => setLocationMessage(String(e)))
        }
      />
      {!!locationMessage && <Copy muted>{locationMessage}</Copy>}
      <Button
        label={id ? "Save place changes" : "Add place"}
        disabled={!name.trim()}
        onPress={async () => {
          const saved = await dispatch({
            type: "place",
            place: {
              id: id || `place-${Date.now()}`,
              name: name.trim(),
              description: description.trim(),
              radius: 200,
              ...coordinates,
            },
          });
          if (!saved) return;
          setId("");
          setName("");
          setDescription("");
          setCoordinates(undefined);
          setLocationMessage(coordinates
            ? "Place and GPS location saved. Select this place in Departure reminders."
            : "Place saved. Use my current location and save again to enable area monitoring.");
        }}
      />
      {!!id && (
        <Action
          label="Cancel edit"
          onPress={() => {
            setId("");
            setName("");
            setDescription("");
            setCoordinates(undefined);
            setLocationMessage("");
          }}
        />
      )}
    </Screen>
  );
}

export function Memory() {
  const { state, dispatch } = usePreparation();
  const [text, setText] = useState("");
  const [proposal, setProposal] = useState("");
  return (
    <Screen legacyDemo>
      <Title>Preparation that fits you</Title>
      <Copy muted>
        Only preferences you approve guide suggestions. Outie saves them on this device
        and does not train an AI model.
      </Copy>
      <Panel>
        {state.memories.map((memory) => (
          <Row
            key={memory}
            title={memory}
            detail="Approved by you · saved on this device"
            icon="memory"
            trailing={
              <Action
                label="Forget"
                onPress={() => dispatch({ type: "forget", text: memory })}
              />
            }
          />
        ))}
        {!state.memories.length && (
          <Row
            title="No approved preferences yet"
            detail="For example: I keep a charger at work."
            icon="memory"
          />
        )}
      </Panel>
      <Field
        label="Your preference"
        value={text}
        onChange={setText}
        placeholder="I keep a charger at work"
        multiline
      />
      <Button
        label="Review preference"
        disabled={!text.trim()}
        onPress={() => setProposal(text.trim())}
      />
      {!!proposal && (
        <Panel>
          <View style={{ gap: 12, paddingVertical: 14 }}>
            <Copy weight="600">Use this preference?</Copy>
            <Copy>{proposal}</Copy>
            <Copy muted size={13}>
              This is your own text. No AI extraction has run.
            </Copy>
            <Button
              label="Approve preference"
              onPress={async () => {
                if (await dispatch({ type: "memory", text: proposal })) {
                  setProposal("");
                  setText("");
                }
              }}
            />
            <Action label="Discard" onPress={() => setProposal("")} />
          </View>
        </Panel>
      )}
    </Screen>
  );
}

const connectionIcon: Record<Connection, IconName> = {
  Calendar: "calendar",
  Camera: "camera",
  Notifications: "bell",
  Location: "location",
};
export function ConnectionDetail() {
  const { kind: raw } = useLocalSearchParams<{ kind: string }>();
  const kind = (
    ["Calendar", "Camera", "Notifications", "Location"].includes(raw)
      ? raw
      : "Calendar"
  ) as Connection;
  const { state, dispatch, monitoringStatus } = usePreparation();
  const located = locatedPlaces(state);
  const monitoring = monitoringSetup(state) ?? monitoringStatus;
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("Checking system access…");
  const [message, setMessage] = useState("");
  const [events, setEvents] = useState<
    Awaited<ReturnType<typeof device.upcomingEvents>>
  >([]);
  useEffect(() => {
    const refresh = () =>
      void device
        .permission(kind)
        .then(setStatus)
        .catch((e) => setStatus(String(e)));
    refresh();
    const listener = AppState.addEventListener("change", (s) => {
      if (s === "active") refresh();
    });
    return () => listener.remove();
  }, [kind]);
  async function enable() {
    try {
      const access = await device.permission(kind, true);
      setStatus(access);
      const saved = await dispatch({ type: "connection", kind, enabled: access === "granted" });
      if (!saved) { setMessage("Connection change was not saved. Please retry."); return; }
      setMessage(
        access === "granted"
          ? kind === "Location"
            ? "Location connected. Background alerts also need a saved GPS location and Always access."
            : "Access granted. You can use this connection."
          : "Access is unavailable or declined. Manual preparation remains available.",
      );
    } catch (e) {
      setMessage(errorMessage(e));
    }
  }
  return (
    <Screen legacyDemo>
      <Title>{kind}</Title>
      <Copy muted>
        {state.demo
          ? "Demo records do not enable live automation. Turn off Demo Mode before using connections."
          : "Permissions are requested only when you enable this connection."}
      </Copy>
      <Panel>
        <Row
          title={
            {
              granted: "Access allowed",
              denied: "Access declined",
              undetermined: "Not requested",
              unavailable: "Available in the iOS app",
            }[status] ?? status
          }
          detail="Actual system permission state"
          icon={connectionIcon[kind]}
        />
      </Panel>
      <Button
        label={`Enable ${kind}`}
        disabled={state.demo || busy}
        onPress={() => void enable()}
      />
      <Button
        secondary
        label="Open system settings"
        onPress={() => void Linking.openSettings()}
      />
      {state.connections[kind] && (
        <Action
          label={`Disconnect ${kind}`}
          onPress={() => void dispatch({ type: "connection", kind, enabled: false }).then((saved) => {
            if (saved) setMessage(`${kind} disconnected in Outie. System permission stays under your control.`);
          })}
        />
      )}
      {!!message && <Copy muted>{message}</Copy>}
      {kind === "Calendar" && (
        <>
          <Copy muted>
            Calendar access reads upcoming events only. Outie does not write to
            your calendar.
          </Copy>
          <Button
            secondary
            label="Load upcoming events"
            disabled={state.demo}
            onPress={() =>
              void device
                .upcomingEvents()
                .then(setEvents)
                .catch((e) => setMessage(String(e)))
            }
          />
          {events.map((event) => (
            <Panel key={event.id}>
              <Row
                title={event.title}
                detail={new Date(event.startsAt).toLocaleString()}
                icon="calendar"
                onPress={() => {
                  void dispatch({
                    type: "plan",
                    title: event.title,
                    destination: event.destination,
                    startsAt: event.startsAt,
                  }).then((saved) => {
                    if (saved) router.replace("/checklist");
                  });
                }}
              />
            </Panel>
          ))}
        </>
      )}
      {kind === "Location" && (
        <>
          <Panel>
            <Row
              title={monitoring === "active" ? "Monitoring active" : monitoring === "paused" ? "Monitoring paused" : "Monitoring not active"}
              detail={monitoring === "needs-place"
                ? "Save a GPS location for a starting point."
                : monitoring === "needs-background-access"
                  ? "Always location access is required."
                  : monitoring === "active"
                    ? `${located.length} saved ${located.length === 1 ? "area" : "areas"} registered.`
                    : "Connect Location, save a place, and allow Always access."}
              icon="location"
            />
          </Panel>
          <Action label={located.length ? "Manage saved places" : "Set up saved places"} onPress={() => go("/places")} />
          <Copy muted>
            Saved locations need Always access for background monitoring.
            Location exits cannot identify belongings.
          </Copy>
          <Button
            secondary
            label="Enable background departure monitoring"
            disabled={state.demo || busy || state.paused || !located.length}
            onPress={async () => {
              setBusy(true);
              try {
                  const access = await device.backgroundPermission();
                  if (access !== "granted")
                    throw new Error("Always location access was not granted.");
                  const result = await device.startMonitoring({
                    ...state,
                    connections: { ...state.connections, Location: true },
                  });
                  if (result !== "active") throw new Error("Monitoring is not active. Check your saved places and location access.");
                  const saved = await dispatch({
                    type: "connection",
                    kind: "Location",
                    enabled: true,
                  });
                  if (!saved) {
                    await device.startMonitoring(state);
                    setMessage("Monitoring preference was not saved. Please retry.");
                    return;
                  }
                  setMessage("Saved-area monitoring enabled.");
              } catch (e) { setMessage(errorMessage(e)); }
              finally { setBusy(false); }
            }}
          />
        </>
      )}
      {kind === "Notifications" && (
        <Button
          secondary
          label="Send a test reminder in 10 seconds"
          disabled={state.demo || !state.personal}
          onPress={() =>
            state.personal &&
            void device
              .scheduleCheck(state.personal, 10, `test-${Date.now()}`)
              .then((id) =>
                setMessage(
                  id
                    ? "Test scheduled. Background the app to check delivery."
                    : "Everything is resolved; no reminder is needed.",
                ),
              )
              .catch((e) => setMessage(String(e)))
          }
        />
      )}
      {kind === "Camera" && (
        <Copy muted>
          Open an essential in the checklist to register a photo or perform a
          targeted visual check. Camera capture stays in the foreground.
        </Copy>
      )}
    </Screen>
  );
}

export function Notification() {
  const { state, dispatch } = usePreparation();
  const plan = activePlan(state);
  return (
    <Screen legacyDemo>
      <Badge>Simulated departure alert</Badge>
      <View
        style={{
          backgroundColor: c.paleWarning,
          borderRadius: 24,
          padding: 24,
          gap: 16,
        }}
      >
        <Icon name="bell" color={c.warning} size={32} />
        <Title>One more check{"\n"}before you go.</Title>
        <Copy>
          {state.notice || "No departure alert has been previewed yet."}
        </Copy>
      </View>
      <Copy muted>
        {plan ? `For ${plan.title}.` : "There is no active preparation plan."}{" "}
        No system notification or location event triggered this screen.
      </Copy>
      {plan && (
        <Button
          label="Check my essentials"
          onPress={() => router.replace("/checklist")}
        />
      )}
      <Button
        secondary
        label="Snooze preview"
        onPress={() => dispatch({ type: "snooze" })}
      />
      <Action
        label="Preview another exit"
        onPress={() => dispatch({ type: "depart" })}
      />
      <Action
        label="Preview returning Home"
        onPress={() => dispatch({ type: "return" })}
      />
      <Copy muted size={13}>
        One alert per sample departure. Returning Home starts another sample
        episode. A new episode resets confirmations and exclusions. Your
        checklist items remain.
      </Copy>
    </Screen>
  );
}

const scenarioNames: Record<Scenario, string> = {
  presentation: "Presentation ready",
  empty: "No planned departure",
  loading: "Preparing a plan",
  error: "Preparation error",
  ambiguous: "Ambiguous activity",
  unavailable: "Local AI unavailable",
  denied: "Connection access denied",
  stale: "Old plan needs review",
  tracker: "Tracker connection lost",
};
export function Scenarios() {
  const { dispatch } = usePreparation();
  return (
    <Screen legacyDemo>
      <Badge>Demo controls</Badge>
      <Title>Explore the moments that matter.</Title>
      <Copy muted>
        These scenarios change only mock data. They do not exercise real AI,
        system permissions, location or tracker hardware.
      </Copy>
      <Panel>
        {(Object.keys(scenarioNames) as Scenario[]).map((scenario) => (
          <Row
            key={scenario}
            title={scenarioNames[scenario]}
            onPress={() => {
              dispatch({ type: "scenario", scenario });
              router.navigate("/");
            }}
          />
        ))}
      </Panel>
    </Screen>
  );
}
function ScenarioContent() {
  const { state, dispatch } = usePreparation();
  const messages: Partial<Record<Scenario, [string, string]>> = {
    error: [
      "Couldn’t prepare this plan",
      "Error-state preview. Your own checklist would remain available if generation failed.",
    ],
    ambiguous: [
      "A little more context",
      "“Appointment” could mean many things. Add an activity or use the presentation example.",
    ],
    unavailable: [
      "Local AI isn’t available",
      "Model-unavailable preview. You can still prepare using your everyday essentials.",
    ],
    denied: [
      "Your access, your choice",
      "Permission-denied preview. Manual preparation remains available.",
    ],
    stale: [
      "This plan needs a review",
      "Stale-context preview. An old plan must not be treated as your current destination.",
    ],
    tracker: [
      "Connection lost, item location unknown",
      "Tracker-loss preview. A lost radio connection cannot prove that your keys were left behind.",
    ],
  };
  const message = messages[state.scenario] ?? [
    "No planned departure",
    "Choose an activity.",
  ];
  return (
    <Empty
      icon={state.scenario === "tracker" ? "location" : "shield"}
      title={message[0]}
      detail={message[1]}
    >
      <Button
        label="Plan an activity manually"
        onPress={() => go("/context")}
      />
      <Button
        secondary
        label="Return to presentation demo"
        onPress={() => dispatch({ type: "scenario", scenario: "presentation" })}
      />
    </Empty>
  );
}
