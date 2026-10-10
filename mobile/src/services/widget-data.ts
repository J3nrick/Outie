import type { State } from "../data/model.ts";
import { contextKey, reminderPreview } from "./outing-policy.ts";
import { CHECK_LIFETIME } from "./checks.ts";
import { WEATHER_MAX_AGE } from "./weather.ts";

export type WidgetProps = {
  title: string; items: string[]; count: number; note: string;
  total: number; rain: boolean; updated: string; status: string; url: string;
};
export type WidgetEntry = { date: Date; props: WidgetProps };

// Only the personal outing settings feed widgets. Historical/demo plans are never exported.
export function widgetProps(state: State, now: number): WidgetProps {
  const reminder = reminderPreview(state, now);
  const context = state.outing.context;
  const current = !!context && context.inputKey === contextKey(state) &&
    context.preparedAt <= now && context.expiresAt > now;
  const rain = reminder.items.some(i => i.source === "weather");
  return {
    title: "Before you go", items: reminder.items.map(i => i.name), count: reminder.items.length,
    total: reminder.allItems?.length ?? reminder.items.length,
    note: !reminder.items.length && reminder.allItems?.length ? "Confirmed by you for this outing" : rain ? "Rain near Home · consider an umbrella" : reminder.items.some(i => i.eventId) ? "Things for your next event" : "Your everyday things",
    rain, updated: current ? `Updated ${new Date(context.preparedAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}` : "Saved essentials",
    status: state.paused && state.outing.enabled ? "Reminders paused" : !state.outing.enabled ? "Reminders off" : "Open Outie to check reminders",
    url: state.outing.onboardingComplete ? "depart-preview:///" : "depart-preview:///welcome",
  };
}
export function lockWidgetProps(props: WidgetProps): WidgetProps {
  // The Lock Screen shared payload contains no event title, item name, or location.
  return { ...props, items: [], note: props.rain ? `Consider an umbrella · ${props.count} things` : props.count ? `${props.count} ${props.count === 1 ? "thing" : "things"} to check` : props.total ? "Confirmed for this outing" : "Choose your things in Outie" };
}
export function widgetTimeline(state: State, now: number): WidgetEntry[] {
  const context = state.outing.context;
  const horizon = Math.max(now + WEATHER_MAX_AGE + 1000, state.outing.checklist.startedAt + CHECK_LIFETIME + 1000);
  const dates = new Set([now, horizon]);
  const add = (n: number) => { if (Number.isFinite(n) && n > now && n <= horizon) dates.add(n); };
  add(state.outing.checklist.startedAt + CHECK_LIFETIME + 1000);
  if (context) {
    add(context.expiresAt + 1000);
    for (const e of context.events) add((e.endsAt ? Date.parse(e.endsAt) : Date.parse(e.startsAt) + 3600000) + 1000);
    if (context.forecast) {
      add(context.forecast.fetchedAt + WEATHER_MAX_AGE + 1000);
      for (const h of context.forecast.hours) add(h.at + 3600000 + 1000);
      const local = now + context.forecast.utcOffsetSeconds * 1000;
      add((Math.floor(local / 86400000) + 1) * 86400000 - context.forecast.utcOffsetSeconds * 1000 + 1000);
    }
  }
  return [...dates].sort((a, b) => a - b).map(date => ({ date: new Date(date), props: widgetProps(state, date) }));
}
