import { initialState, type State } from "./model.ts";
import { defaultOuting } from "./outing.ts";
export type Snapshot = { version: 3; revision: number; state: State };
function validOuting(o: State["outing"]) {
  const strings = (a: unknown): a is string[] => Array.isArray(a) && a.length <= 200 && a.every(x => typeof x === "string" && x.length <= 500);
  if (!o || typeof o.enabled !== "boolean" || typeof o.weatherEnabled !== "boolean" || typeof o.onboardingComplete !== "boolean" ||
      !(o.homeId === null || typeof o.homeId === "string") || !Number.isInteger(o.setupStep) || o.setupStep < 0 || o.setupStep > 3 ||
      !Number.isFinite(o.rainThreshold) || o.rainThreshold < 0 || o.rainThreshold > 100 || !strings(o.neverSuggest) || !strings(o.calendarIds) ||
      !Array.isArray(o.routines) || o.routines.length > 30 || !o.routines.every(r => r && typeof r.id === "string" && typeof r.name === "string" && strings(r.keywords) && strings(r.items)) ||
      !Array.isArray(o.history) || o.history.length > 20) return false;
  const validItems = (items: unknown): boolean => Array.isArray(items) && items.length <= 200 && items.every(i => i && typeof i.name === "string" && typeof i.reason === "string" && ["routine", "ai", "weather"].includes(i.source));
  if (!o.history.every(r => r && typeof r.id === "string" && Number.isFinite(r.createdAt) && typeof r.body === "string" && typeof r.title === "string" && validItems(r.items))) return false;
  const cl = o.checklist;
  if (!cl || typeof cl.id !== "string" || !Number.isInteger(cl.generation) || cl.generation < 0 || !Number.isFinite(cl.startedAt) ||
      !Array.isArray(cl.checks) || cl.checks.length > 200 || !cl.checks.every(x => x && typeof x.key === "string" && Number.isFinite(x.confirmedAt)) ||
      !strings(o.monitoredPlaceIds) || o.monitoredPlaceIds.length > 20 || !Array.isArray(o.evidence) || o.evidence.length > 200 ||
      !o.evidence.every(e => e && typeof e.key === "string" && typeof e.name === "string" && (e.confirmedAt === undefined || Number.isFinite(e.confirmedAt)) &&
        (!e.location || (typeof e.location.label === "string" && e.location.label.length <= 200 && Number.isFinite(e.location.at) && ["user", "phone"].includes(e.location.source) &&
          (e.location.source !== "phone" || (Number.isFinite(e.location.latitude) && Math.abs(e.location.latitude!) <= 90 && Number.isFinite(e.location.longitude) && Math.abs(e.location.longitude!) <= 180)))))) return false;
  if (!o.history.every(r => (!r.allItems || validItems(r.allItems)) && (r.checklistId === undefined || typeof r.checklistId === "string") && (r.acknowledgedAt === undefined || Number.isFinite(r.acknowledgedAt)) && (r.test === undefined || typeof r.test === "boolean"))) return false;
  const c = o.context;
  if (c !== null && (!c || typeof c.inputKey !== "string" || !Number.isFinite(c.preparedAt) || !Number.isFinite(c.expiresAt) ||
      c.expiresAt <= c.preparedAt || !validItems(c.items) || !Array.isArray(c.events) || c.events.length > 80 ||
      !c.events.every(e => e && typeof e.id === "string" && typeof e.title === "string" && typeof e.destination === "string" && Number.isFinite(Date.parse(e.startsAt))) ||
      ![c.modelStatus, c.weatherStatus, c.calendarStatus].every(x => typeof x === "string"))) return false;
  const f = c?.forecast;
  if (f && (f.provider !== "Open-Meteo" || !Number.isFinite(f.latitude) || Math.abs(f.latitude) > 90 || !Number.isFinite(f.longitude) || Math.abs(f.longitude) > 180 ||
      !Number.isFinite(f.fetchedAt) || !Number.isFinite(f.utcOffsetSeconds) || !Array.isArray(f.hours) || f.hours.length > 200 || !f.hours.every(h => h && Number.isFinite(h.at) && Number.isFinite(h.rainChance) && h.rainChance >= 0 && h.rainChance <= 100 && Number.isFinite(h.precipitation) && h.precipitation >= 0))) return false;
  return true;
}
export function decodeSnapshot(raw: string): Snapshot {
  const data = JSON.parse(raw) as { version: number; revision: number; state: State };
  const s = data?.state;
  if (
    ![1, 2, 3].includes(data.version) ||
    !Number.isInteger(data.revision) ||
    data.revision < 0 ||
    !s ||
    typeof s.demo !== "boolean" ||
    typeof s.setupComplete !== "boolean" ||
    !Array.isArray(s.essentials) ||
    !s.essentials.every((x) => typeof x === "string") ||
    !Array.isArray(s.memories) ||
    !s.memories.every((x) => typeof x === "string") ||
    !Array.isArray(s.places) ||
    !s.places.every(
      (p) =>
        typeof p.id === "string" &&
        typeof p.name === "string" &&
        Number.isFinite(p.radius),
    ) ||
    typeof s.paused !== "boolean" ||
    !s.sample ||
    !s.connections ||
    !["Calendar", "Camera", "Notifications", "Location"].every(
      (k) =>
        typeof s.connections[k as keyof typeof s.connections] === "boolean",
    ) ||
    !Number.isFinite(s.leadMinutes)
  )
    throw new Error(
      "Saved preparation data is invalid. It has not been replaced.",
    );
  for (const plan of [s.sample, s.personal].filter(Boolean)) {
    if (
      !plan ||
      typeof plan.id !== "string" ||
      typeof plan.title !== "string" ||
      !Array.isArray(plan.items) ||
      !plan.items.every(
        (i) =>
          typeof i.id === "string" &&
          typeof i.name === "string" &&
          ["unchecked", "confirmed", "excluded"].includes(i.status),
      )
    )
      throw new Error("Saved checklist is invalid.");
  }
  let outing = s.outing;
  if (!outing && data.version === 1) {
    const home = s.places.find(p => Number.isFinite(p.latitude) && Number.isFinite(p.longitude));
    outing = { ...defaultOuting(), homeId: home?.id ?? null };
    // Preserve old plans/preferences, but require an explicit opt-in to the changed reminder policy.
  }
  if (data.version < 3 && outing) outing = { ...defaultOuting(), ...outing, checklist: defaultOuting().checklist, evidence: [], monitoredPlaceIds: outing.homeId ? [outing.homeId] : [] };
  if (!validOuting(outing)) throw new Error("Saved outing settings are invalid. Your data has not been replaced.");
  return { ...data, version: 3, state: { ...initialState(), ...s, outing, automation: data.version < 3 && s.automation ? { ...s.automation, pending: undefined } : s.automation } };
}
