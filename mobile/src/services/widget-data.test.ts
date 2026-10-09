import { test } from "node:test";
import assert from "node:assert/strict";
import { initialState, reduce } from "../data/model.ts";
import { contextKey } from "./outing-policy.ts";
import { widgetProps, lockWidgetProps, widgetTimeline } from "./widget-data.ts";
const now = Date.parse("2026-10-10T00:00:00Z");
function fixture() {
  let s = reduce(initialState(), { type: "essential", name: "Keys" });
  s = reduce(s, { type: "outingHome", place: { id: "home", name: "Private address", description: "", radius: 200, latitude: 14.5, longitude: 121 } });
  s.outing.weatherEnabled = true; s.connections.Calendar = true;
  s.outing.context = {
    inputKey: contextKey(s), preparedAt: now, expiresAt: now + 7200000,
    events: [{ id: "event", title: "Private appointment", destination: "Private clinic", startsAt: new Date(now + 1800000).toISOString(), endsAt: new Date(now + 3600000).toISOString() }],
    items: [{ name: "Private test document", reason: "Private clinical details", eventId: "event", source: "ai" }],
    forecast: { provider: "Open-Meteo", latitude: 14.5, longitude: 121, fetchedAt: now, utcOffsetSeconds: 28800, hours: [{ at: now, rainChance: 80, precipitation: 2 }] },
    modelStatus: "Local suggestions prepared on this device", calendarStatus: "Upcoming event found", weatherStatus: "Forecast updated",
  };
  return s;
}
test("widget uses personal reminder policy without exposing calendar titles or reasons", () => {
  const props = widgetProps(fixture(), now);
  assert.deepEqual(props.items, ["Keys", "Private test document", "Umbrella"]);
  assert.equal(props.rain, true);
  assert.doesNotMatch(JSON.stringify(props), /Private appointment|Private clinic|Private address|clinical details|latitude/);
  assert.match(props.note, /Rain near Home/);
});
test("Lock Screen payload contains only a count and generic rain advice", () => {
  const props = lockWidgetProps(widgetProps(fixture(), now));
  assert.equal(props.count, 3); assert.deepEqual(props.items, []);
  assert.doesNotMatch(JSON.stringify(props), /Keys|Private|121|14\.5/);
  assert.equal(props.note, "Consider an umbrella · 3 things");
});
test("future timeline expires rain and event extras even without another app launch", () => {
  const entries = widgetTimeline(fixture(), now);
  assert.equal(entries[0].date.getTime(), now);
  assert.equal(entries[0].props.count, 3);
  assert.equal(entries.some(e => e.date.getTime() > now + 3600000 && e.props.count === 1), true);
  assert.deepEqual(entries.at(-1)!.props.items, ["Keys"]);
  assert.equal(entries.at(-1)!.props.rain, false);
  assert.equal(entries.at(-1)!.props.updated, "Saved essentials");
  for (let i = 1; i < entries.length; i++) assert.ok(entries[i].date > entries[i - 1].date);
});
test("changed preferences invalidate extras and demo/history never replace widget data", () => {
  const s = reduce(fixture(), { type: "essential", name: "Wallet" });
  s.demo = true;
  s.sample = { id: "demo", title: "Demo title", destination: "", time: "", items: [{ id: "demo-item", name: "Demo belonging", reason: "", source: "demo", status: "unchecked" }] };
  const before = JSON.stringify(s);
  assert.deepEqual(widgetProps(s, now).items, ["Keys", "Wallet"]);
  widgetTimeline(s, now);
  assert.equal(JSON.stringify(s), before);
});
test("empty, paused, and disabled states give honest status and correct tap destinations", () => {
  const s = initialState();
  assert.equal(widgetProps(s, now).count, 0);
  assert.match(widgetProps(s, now).url, /welcome/);
  assert.equal(widgetProps(s, now).status, "Reminders off");
  s.outing.enabled = true; s.paused = true; s.outing.onboardingComplete = true;
  assert.equal(widgetProps(s, now).status, "Reminders paused");
  assert.equal(widgetProps(s, now).url, "depart-preview:///");
});
