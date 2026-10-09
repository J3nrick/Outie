import type { State } from "../data/model.ts";
import type { CalendarContext, ContextItem, OutingReminder } from "../data/outing.ts";
import { forecastIsFresh, rainToday } from "./weather.ts";
export function homePlace(s: State) { return s.places.find(p => p.id === s.outing.homeId); }
export function contextKey(s: State) {
  const home = homePlace(s);
  return JSON.stringify({ home: home ? [home.id, home.latitude, home.longitude] : null,
    essentials: s.essentials, routines: s.outing.routines, preferences: s.memories,
    calendar: s.connections.Calendar, calendarIds: s.outing.calendarIds,
    weather: s.outing.weatherEnabled, threshold: s.outing.rainThreshold, never: s.outing.neverSuggest });
}
export function relevantEvents(events: CalendarContext[], now: number) {
  return events.filter(e => {
    const start = Date.parse(e.startsAt), end = e.endsAt ? Date.parse(e.endsAt) : start + 3600000;
    return !e.cancelled && !e.allDay && Number.isFinite(start) && start <= now + 3 * 3600000 &&
      end > now && !/\b(zoom|teams|google meet|virtual|online|video call)\b/i.test(`${e.title} ${e.destination}`);
  }).sort((a, b) => Date.parse(a.startsAt) - Date.parse(b.startsAt)).slice(0, 1);
}
export function reminderPreview(s: State, now: number, id = `outing-${now}`): OutingReminder {
  const items: ContextItem[] = s.essentials.map(name => ({ name, reason: "Your everyday essential.", source: "routine" }));
  const c = s.outing.context;
  const valid = c && c.inputKey === contextKey(s) && c.preparedAt <= now && c.expiresAt > now;
  const events = valid ? relevantEvents(c.events, now) : [];
  const allowed = new Set(events.map(e => e.id));
  if (valid) items.push(...c.items.filter(i => !!i.eventId && allowed.has(i.eventId)));
  const home = homePlace(s);
  if (valid && s.outing.weatherEnabled && home &&
      forecastIsFresh(c.forecast, home.latitude!, home.longitude!, now) &&
      rainToday(c.forecast!, now, s.outing.rainThreshold))
    items.push({ name: "Umbrella", reason: `Rain is forecast near ${home.name} later today.`, source: "weather" });
  const seen = new Set<string>();
  const unique = items.filter(i => {
    const key = i.name.trim().toLowerCase();
    if (!key || seen.has(key) || (i.source !== "routine" && s.outing.neverSuggest.includes(key))) return false;
    // An explicit exclusion also applies to contextual routine items, never everyday essentials.
    if (i.eventId && s.outing.neverSuggest.includes(key)) return false;
    seen.add(key); return true;
  });
  const base = unique.filter(i => !i.eventId && i.source !== "weather");
  const extras = unique.filter(i => i.eventId);
  const weather = unique.some(i => i.source === "weather");
  const list = (names: string[]) => names.slice(0, 4).join(", ") + (names.length > 4 ? ` and ${names.length - 4} more` : "");
  let body = base.length ? `Remember ${list(base.map(i => i.name))}.` : "Heading out?";
  if (extras.length && events.length) body += ` If you're heading to ${events[0].title}, bring ${list(extras.map(i => i.name))}.`;
  if (weather) body += " Rain is forecast near Home—consider an umbrella.";
  if (body.length > 360) body = `Remember ${list(unique.map(i => i.name))}. Tap to see why.`;
  return { id, createdAt: now, title: "Heading out?", body, items: unique, eventTitle: events[0]?.title };
}
export function canDeliverOuting(s: State, reminder: OutingReminder, now: number) {
  const pending = s.automation?.pending;
  return s.outing.enabled && !s.paused && !s.demo && s.connections.Location && s.connections.Notifications &&
    Number.isFinite(homePlace(s)?.latitude) && Number.isFinite(homePlace(s)?.longitude) && pending?.reminder?.id === reminder.id && !pending.deliveredAt &&
    s.automation?.outside === true && now >= reminder.createdAt && now - reminder.createdAt <= 600000;
}
