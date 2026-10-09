import type { State } from "../data/model.ts";
import type { CalendarContext, Forecast, OutingContext, Routine, ContextItem } from "../data/outing.ts";
import { contextKey, homePlace, relevantEvents } from "./outing-policy.ts";
import { forecastIsFresh, WEATHER_MAX_AGE } from "./weather.ts";
export type Interpretation = {
  matches: { routineId: string; eventId: string }[];
  items: { name: string; reason: string; eventId: string }[];
};
export function validateInterpretation(raw: string, events: CalendarContext[], routines: Routine[]): Interpretation {
  const d = JSON.parse(raw);
  if (!Array.isArray(d.matches) || !Array.isArray(d.items) || d.matches.length > 12 || d.items.length > 12)
    throw new Error("Local AI returned invalid reminder suggestions.");
  const eventIds = new Set(events.map(e => e.id)), routineIds = new Set(routines.map(r => r.id));
  const seen = new Set<string>();
  for (const m of d.matches) {
    if (!m || !routineIds.has(m.routineId) || !eventIds.has(m.eventId)) throw new Error("AI referenced an unknown routine or event.");
    const key = `${m.routineId}:${m.eventId}`;
    if (seen.has(key)) throw new Error("AI duplicated a routine match.");
    seen.add(key);
  }
  seen.clear();
  for (const i of d.items) {
    if (!i || typeof i.name !== "string" || !i.name.trim() || i.name.length > 80 ||
        typeof i.reason !== "string" || !i.reason.trim() || i.reason.length > 240 || !eventIds.has(i.eventId))
      throw new Error("AI returned an ungrounded or invalid suggestion.");
    const key = i.name.trim().toLowerCase();
    if (seen.has(key)) throw new Error("AI duplicated an item.");
    seen.add(key);
  }
  return { matches: d.matches, items: d.items.map((i: Interpretation["items"][number]) => ({ ...i, name: i.name.trim(), reason: i.reason.trim() })) };
}
export type ContextPorts = {
  events: () => Promise<CalendarContext[]>;
  forecast: (latitude: number, longitude: number) => Promise<Forecast>;
  availability: () => Promise<string>;
  interpret: (context: object, events: CalendarContext[], routines: Routine[]) => Promise<Interpretation>;
};
function message(e: unknown) { return e instanceof Error ? e.message : String(e); }
export async function prepareOutingContext(s: State, ports: ContextPorts, now: number): Promise<OutingContext> {
  const home = homePlace(s), previous = s.outing.context;
  const cached = s.outing.weatherEnabled && home && forecastIsFresh(previous?.forecast, home.latitude!, home.longitude!, now) ? previous?.forecast : undefined;
  const results = await Promise.allSettled([
    s.connections.Calendar ? ports.events() : Promise.resolve([]),
    s.outing.weatherEnabled && home && Number.isFinite(home.latitude) && Number.isFinite(home.longitude)
      ? cached ? Promise.resolve(cached) : ports.forecast(home.latitude!, home.longitude!) : Promise.resolve(undefined),
    ports.availability(),
  ]);
  const [cal, weather, model] = results;
  const events = cal.status === "fulfilled" ? relevantEvents(cal.value, now) : [];
  const forecast = weather.status === "fulfilled" ? weather.value : undefined;
  let modelStatus = model.status === "fulfilled" ? model.value : message(model.reason);
  const items: ContextItem[] = [];
  // Explicit keyword matches work without AI; they are labelled as approved routine rules.
  for (const event of events) for (const routine of s.outing.routines) {
    const text = `${event.title} ${event.destination}`.toLowerCase();
    if (routine.keywords.some(k => k.trim() && text.includes(k.trim().toLowerCase())))
      items.push(...routine.items.map(name => ({ name, reason: `From your ${routine.name} routine.`, source: "routine" as const, routineId: routine.id, eventId: event.id })));
  }
  const reuseAI = previous?.inputKey === contextKey(s) && previous.expiresAt > now &&
    previous.modelStatus === "Local suggestions prepared on this device" &&
    JSON.stringify(previous.events) === JSON.stringify(events);
  if (modelStatus === "available" && events.length && reuseAI) {
    items.push(...previous.items.filter(i => i.source === "ai"));
    modelStatus = previous.modelStatus;
  } else if (modelStatus === "available" && events.length) {
    try {
      const result = await ports.interpret({
        events, routines: s.outing.routines, everyday: s.essentials,
        approvedPreferences: s.memories, neverSuggest: s.outing.neverSuggest,
        weather: forecast ? { source: forecast.provider, fetchedAt: forecast.fetchedAt } : null,
      }, events, s.outing.routines);
      for (const m of result.matches) {
        const routine = s.outing.routines.find(r => r.id === m.routineId)!;
        items.push(...routine.items.map(name => ({ name, reason: `Your ${routine.name} routine, matched to this event by local AI.`, source: "ai" as const, routineId: routine.id, eventId: m.eventId })));
      }
      items.push(...result.items.map(i => ({ ...i, source: "ai" as const })));
      modelStatus = "Local suggestions prepared on this device";
    } catch (e) { modelStatus = `Using saved routines. ${message(e)}`; }
  } else if (modelStatus === "available") modelStatus = "Model ready · no upcoming event to interpret";
  return {
    inputKey: contextKey(s), preparedAt: now, expiresAt: now + WEATHER_MAX_AGE, events, items, forecast,
    modelStatus,
    calendarStatus: !s.connections.Calendar ? "Calendar not connected" : cal.status === "rejected" ? message(cal.reason) : events.length ? "Upcoming event found" : "No relevant upcoming event",
    weatherStatus: !s.outing.weatherEnabled ? "Weather off" : !home || !Number.isFinite(home.latitude) ? "Save Home to use weather" : weather.status === "rejected" ? `Weather unavailable. ${message(weather.reason)}` : cached ? "Using recent forecast" : "Forecast updated",
  };
}
