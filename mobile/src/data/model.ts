import { defaultOuting, type OutingSettings, type OutingContext, type Routine } from "./outing.ts";
import { itemKey, checksCurrent, nextChecklist } from "../services/checks.ts";
import { contextKey } from "../services/outing-policy.ts";
export type Item = {
  id: string;
  name: string;
  reason: string;
  source: "user" | "demo" | "ai";
  referenceUri?: string;
  observedAt?: string;
  observation?: string;
  status: "unchecked" | "confirmed" | "excluded";
  checkedAt?: string;
};
export type Place = {
  id: string;
  name: string;
  description: string;
  radius: number;
  latitude?: number;
  longitude?: number;
};
export type Connection = "Calendar" | "Camera" | "Notifications" | "Location";
export type Scenario =
  | "presentation"
  | "empty"
  | "loading"
  | "error"
  | "ambiguous"
  | "unavailable"
  | "denied"
  | "stale"
  | "tracker";
export type Plan = {
  id: string;
  title: string;
  destination: string;
  time: string;
  items: Item[];
  startsAt?: string;
  generatedAt?: string;
  removedNames?: string[];
};
export type State = {
  outing: OutingSettings;
  automation?: import("../services/automation").Episode;
  setupComplete: boolean;
  demo: boolean;
  scenario: Scenario;
  personal: Plan | null;
  sample: Plan;
  essentials: string[];
  places: Place[];
  connections: Record<Connection, boolean>;
  paused: boolean;
  leadMinutes: number;
  memories: string[];
  episode: number;
  notifiedEpisode: number | null;
  notice: string;
  snoozed: boolean;
};
export function samplePlan(): Plan {
  return {
    id: "demo-presentation",
    title: "Client presentation",
    destination: "Client office · Makati",
    time: "10:30 AM · sample event",
    items: [
      {
        id: "id",
        name: "Company ID",
        reason: "For your visit to the client office.",
        source: "demo",
        status: "unchecked",
      },
      {
        id: "charger",
        name: "Laptop charger",
        reason: "Keep your laptop ready throughout the presentation.",
        source: "demo",
        status: "unchecked",
      },
      {
        id: "laptop",
        name: "Laptop",
        reason: "Your presentation materials are on this device.",
        source: "demo",
        status: "confirmed",
      },
      {
        id: "notes",
        name: "Presentation notes",
        reason: "A reference for the discussion.",
        source: "demo",
        status: "unchecked",
      },
    ],
  };
}
export function initialState(): State {
  return {
    outing: defaultOuting(),
    setupComplete: false,
    demo: false,
    scenario: "presentation",
    personal: null,
    sample: samplePlan(),
    essentials: [],
    places: [],
    connections: {
      Calendar: false,
      Camera: false,
      Notifications: false,
      Location: false,
    },
    paused: false,
    leadMinutes: 15,
    memories: [],
    episode: 1,
    notifiedEpisode: null,
    notice: "",
    snoozed: false,
  };
}
export function activePlan(s: State): Plan | null {
  return s.demo ? (s.scenario === "empty" ? null : s.sample) : s.personal;
}
export function unresolved(plan: Plan | null): Item[] {
  return plan?.items.filter((i) => i.status === "unchecked") ?? [];
}
export type Action =
  | { type: "checkThing"; name: string; checked: boolean; checklistId: string; at: number }
  | { type: "newOuting"; at: number }
  | { type: "recordThingLocation"; name: string; label: string; at: number; source: "user" | "phone"; latitude?: number; longitude?: number }
  | { type: "monitoredPlaces"; ids: string[] }
  | { type: "acknowledgeOuting"; id: string; at: number }
  | { type: "outingEnabled"; enabled: boolean }
  | { type: "outingHome"; place: Place }
  | { type: "setupStep"; step: number }
  | { type: "finishOnboarding" }
  | { type: "weatherEnabled"; enabled: boolean }
  | { type: "routine"; routine: Routine }
  | { type: "removeRoutine"; id: string }
  | { type: "neverSuggest"; name: string; enabled: boolean }
  | { type: "calendarIds"; ids: string[] }
  | { type: "outingContext"; context: OutingContext }
  | { type: "demo"; enabled: boolean }
  | { type: "setup"; place: Place; essentials: string[] }
  | { type: "plan"; title: string; destination: string; startsAt?: string }
  | {
      type: "generated";
      planId: string;
      items: { name: string; reason: string }[];
      at: string;
    }
  | { type: "reference"; id: string; uri: string }
  | { type: "observe"; id: string; at: string; detail: string }
  | { type: "toggle"; id: string; at?: string }
  | { type: "exclude"; id: string }
  | { type: "add"; name: string; id: string }
  | { type: "remove"; id: string }
  | { type: "essential"; name: string }
  | { type: "removeEssential"; name: string }
  | { type: "place"; place: Place }
  | { type: "removePlace"; id: string }
  | { type: "connection"; kind: Connection; enabled: boolean }
  | { type: "pause"; enabled: boolean }
  | { type: "lead"; minutes: number }
  | { type: "memory"; text: string }
  | { type: "forget"; text: string }
  | { type: "scenario"; scenario: Scenario }
  | { type: "depart" }
  | { type: "return" }
  | { type: "snooze" }
  | { type: "acknowledge"; planId: string }
  | { type: "clearNotice" }
  | { type: "reset" };
export function reduce(s: State, a: Action): State {
  if (a.type === "newOuting") return { ...s, outing: { ...s.outing, checklist: nextChecklist(s.outing, a.at) }, automation: s.automation ? { ...s.automation, pending: undefined } : undefined };
  if (a.type === "monitoredPlaces") return { ...s, outing: { ...s.outing, monitoredPlaceIds: [...new Set(a.ids)].slice(0, 20) }, automation: undefined };
  if (a.type === "checkThing") {
    if (a.checklistId !== s.outing.checklist.id || !a.name.trim() || !Number.isFinite(a.at)) return s;
    const key = itemKey(a.name);
    const checklist = checksCurrent(s, a.at) ? s.outing.checklist : nextChecklist(s.outing, a.at);
    const checks = checklist.checks.filter(c => c.key !== key);
    if (a.checked) checks.push({ key, confirmedAt: a.at });
    const previous = s.outing.evidence.find(e => e.key === key);
    const evidence = a.checked ? [...s.outing.evidence.filter(e => e.key !== key), { ...previous, key, name: a.name.trim(), confirmedAt: a.at }].slice(-200) : s.outing.evidence;
    return { ...s, outing: { ...s.outing, checklist: { ...checklist, checks }, evidence } };
  }
  if (a.type === "recordThingLocation") {
    if (!a.name.trim() || !a.label.trim() || a.label.trim().length > 200 || !Number.isFinite(a.at) ||
      (a.source === "phone" && (!Number.isFinite(a.latitude) || Math.abs(a.latitude!) > 90 || !Number.isFinite(a.longitude) || Math.abs(a.longitude!) > 180))) return s;
    const key = itemKey(a.name), previous = s.outing.evidence.find(e => e.key === key);
    return { ...s, outing: { ...s.outing, evidence: [...s.outing.evidence.filter(e => e.key !== key), { ...previous, key, name: a.name.trim(), location: { label: a.label.trim(), at: a.at, source: a.source, ...(a.source === "phone" ? { latitude: a.latitude, longitude: a.longitude } : {}) } }].slice(-200) } };
  }
  if (a.type === "acknowledgeOuting") {
    const history = s.outing.history.map(r => r.id === a.id ? { ...r, acknowledgedAt: a.at } : r);
    return { ...s, outing: { ...s.outing, history }, automation: s.automation?.id === a.id ? { ...s.automation, pending: undefined, acknowledgedAt: a.at } : s.automation };
  }
  if (a.type === "reset") return initialState();
  if (a.type === "outingEnabled") return {
    ...s, paused: a.enabled ? false : s.paused,
    outing: { ...s.outing, enabled: a.enabled },
    automation: a.enabled ? s.automation : undefined,
  };
  if (a.type === "outingHome") return {
    ...s, places: [...s.places.filter(p => p.id !== a.place.id), a.place],
    outing: { ...s.outing, homeId: a.place.id, context: null, monitoredPlaceIds: s.outing.monitoredPlaceIds.length ? s.outing.monitoredPlaceIds : [a.place.id] },
    automation: undefined,
  };
  if (a.type === "setupStep") return { ...s, outing: { ...s.outing, setupStep: Math.max(0, Math.min(3, a.step)) } };
  if (a.type === "finishOnboarding") return { ...s, demo: false, setupComplete: true, outing: { ...s.outing, onboardingComplete: true, setupStep: 3 } };
  if (a.type === "weatherEnabled") return { ...s, outing: { ...s.outing, weatherEnabled: a.enabled, context: null } };
  if (a.type === "routine") {
    const routine = { ...a.routine, name: a.routine.name.trim(), items: [...new Set(a.routine.items.map(x => x.trim()).filter(Boolean))] };
    if (!routine.name || !routine.items.length) return s;
    return { ...s, outing: { ...s.outing, context: null, routines: [...s.outing.routines.filter(r => r.id !== routine.id), routine] } };
  }
  if (a.type === "removeRoutine") return { ...s, outing: { ...s.outing, context: null, routines: s.outing.routines.filter(r => r.id !== a.id) } };
  if (a.type === "neverSuggest") return { ...s, outing: { ...s.outing, context: null, neverSuggest: a.enabled ? [...new Set([...s.outing.neverSuggest, a.name.toLowerCase()])] : s.outing.neverSuggest.filter(x => x !== a.name.toLowerCase()) } };
  if (a.type === "calendarIds") return { ...s, outing: { ...s.outing, calendarIds: [...new Set(a.ids)], context: null } };
  if (a.type === "outingContext") return contextKey(s) === a.context.inputKey ? { ...s, outing: { ...s.outing, context: a.context } } : s;
  if (a.type === "acknowledge")
    return s.automation?.planId === a.planId
      ? {
          ...s,
          automation: {
            ...s.automation,
            pending: undefined,
            acknowledgedAt: Date.now(),
          },
        }
      : s;
  if (a.type === "demo")
    return {
      ...s,
      demo: a.enabled,
      setupComplete: true,
      notice: "",
      snoozed: false,
    };
  if (a.type === "setup")
    return {
      ...s,
      setupComplete: true,
      places: [a.place],
      essentials: a.essentials,
    };
  if (a.type === "plan")
    return {
      ...s,
      personal: {
        id: `personal-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        title: a.title.trim(),
        destination: a.destination.trim(),
        time: a.startsAt
          ? new Date(a.startsAt).toLocaleString()
          : "Event time not set",
        startsAt: a.startsAt,
        items: s.essentials.map((name, index) => ({
          id: `personal-${index}`,
          name,
          reason: "From your everyday essentials.",
          source: "user",
          status: "unchecked",
        })),
      },
      demo: false,
    };
  if (a.type === "essential") {
    const name = a.name.trim();
    return !name ||
      s.essentials.some((x) => x.toLowerCase() === name.toLowerCase())
      ? s
      : { ...s, essentials: [...s.essentials, name] };
  }
  if (a.type === "removeEssential")
    return { ...s, essentials: s.essentials.filter((x) => x !== a.name) };
  if (a.type === "place")
    return {
      ...s,
      places: [...s.places.filter((x) => x.id !== a.place.id), a.place],
    };
  if (a.type === "removePlace")
    return { ...s, places: s.places.filter((x) => x.id !== a.id), outing: { ...s.outing, monitoredPlaceIds: s.outing.monitoredPlaceIds.filter(id => id !== a.id), context: s.outing.homeId === a.id ? null : s.outing.context }, automation: s.automation?.placeId === a.id ? undefined : s.automation };
  if (a.type === "connection")
    return { ...s, connections: { ...s.connections, [a.kind]: a.enabled } };
  if (a.type === "pause") return { ...s, paused: a.enabled };
  if (a.type === "lead")
    return { ...s, leadMinutes: Math.max(5, Math.min(60, a.minutes)) };
  if (a.type === "memory") {
    const text = a.text.trim();
    return !text || s.memories.includes(text)
      ? s
      : { ...s, memories: [...s.memories, text] };
  }
  if (a.type === "forget")
    return { ...s, memories: s.memories.filter((x) => x !== a.text) };
  if (a.type === "scenario")
    return {
      ...s,
      demo: true,
      setupComplete: true,
      scenario: a.scenario,
      notice: "",
      notifiedEpisode: null,
      snoozed: false,
    };
  if (a.type === "depart") {
    if (!s.demo)
      return {
        ...s,
        notice: "Departure simulation is available in Demo Mode only.",
      };
    if (s.paused) return { ...s, notice: "Preview automation is paused." };
    if (s.notifiedEpisode === s.episode)
      return {
        ...s,
        notice:
          "This departure already has an alert. No duplicate was created.",
      };
    if (s.scenario !== "presentation")
      return {
        ...s,
        notice: "Return to the presentation scenario to preview a departure.",
      };
    const items = unresolved(activePlan(s));
    return {
      ...s,
      notifiedEpisode: s.episode,
      notice: items.length
        ? `${items.map((i) => i.name).join(", ")} ${items.length === 1 ? "has" : "have"} not been checked.`
        : "All items are confirmed or intentionally excluded. No alert needed.",
      snoozed: false,
    };
  }
  if (a.type === "return")
    return {
      ...s,
      episode: s.episode + 1,
      notifiedEpisode: null,
      notice: "Sample return to Home. A new departure can now be previewed.",
      snoozed: false,
      sample: {
        ...s.sample,
        items: s.sample.items.map((i) => ({
          ...i,
          status: "unchecked",
          checkedAt: undefined,
        })),
      },
    };
  if (a.type === "snooze")
    return {
      ...s,
      snoozed: true,
      notice: "Snoozed in this preview. No system notification is scheduled.",
    };
  if (a.type === "clearNotice") return { ...s, notice: "" };
  const plan = activePlan(s);
  if (!plan) return s;
  if (a.type === "generated") {
    if (s.demo || plan.id !== a.planId) return s;
    const removed = new Set(
      (plan.removedNames ?? []).map((x) => x.toLowerCase()),
    );
    const names = new Set(plan.items.map((i) => i.name.toLowerCase()));
    const additions = a.items.filter(
      (i) =>
        !removed.has(i.name.toLowerCase()) && !names.has(i.name.toLowerCase()),
    );
    return {
      ...s,
      personal: {
        ...plan,
        generatedAt: a.at,
        items: [
          ...plan.items,
          ...additions.map((i, index) => ({
            ...i,
            id: `ai-${a.at}-${index}`,
            source: "ai" as const,
            status: "unchecked" as const,
          })),
        ],
      },
    };
  }
  if (a.type === "reference" || a.type === "observe") {
    const items = plan.items.map((i) =>
      i.id !== a.id
        ? i
        : a.type === "reference"
          ? { ...i, referenceUri: a.uri }
          : { ...i, observedAt: a.at, observation: a.detail },
    );
    return s.demo
      ? { ...s, sample: { ...plan, items } }
      : { ...s, personal: { ...plan, items } };
  }
  let items = plan.items;
  if (a.type === "add") {
    const name = a.name.trim();
    if (!name || items.some((x) => x.name.toLowerCase() === name.toLowerCase()))
      return s;
    items = [
      ...items,
      {
        id: a.id,
        name,
        reason: "Added by you for this departure.",
        source: "user",
        status: "unchecked",
      },
    ];
  }
  if (a.type === "remove") items = items.filter((i) => i.id !== a.id);
  if (a.type === "toggle")
    items = items.map((i) =>
      i.id === a.id
        ? {
            ...i,
            status: i.status === "confirmed" ? "unchecked" : "confirmed",
            checkedAt: i.status === "confirmed" ? undefined : a.at,
          }
        : i,
    );
  if (a.type === "exclude")
    items = items.map((i) =>
      i.id === a.id
        ? {
            ...i,
            status: i.status === "excluded" ? "unchecked" : "excluded",
            checkedAt: undefined,
          }
        : i,
    );
  const removedNames =
    a.type === "remove"
      ? [
          ...(plan.removedNames ?? []),
          ...plan.items.filter((i) => i.id === a.id).map((i) => i.name),
        ]
      : plan.removedNames;
  const next = { ...plan, items, removedNames };
  return s.demo ? { ...s, sample: next } : { ...s, personal: next };
}
