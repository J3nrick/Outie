import { test } from "node:test";
import assert from "node:assert/strict";
import { initialState, reduce } from "../data/model.ts";
import { decodeSnapshot } from "../data/storage.ts";
import { contextKey, relevantEvents, reminderPreview, canDeliverOuting } from "./outing-policy.ts";
import { parseForecast, rainToday, forecastIsFresh } from "./weather.ts";
import { prepareOutingContext, validateInterpretation, type ContextPorts } from "./outing-context.ts";
import { transition } from "./automation.ts";
const now = Date.parse("2026-10-10T00:00:00Z");
function state() {
  let s = reduce(initialState(), { type: "outingHome", place: { id: "home", name: "Home", description: "", radius: 200, latitude: 14.5, longitude: 121 } });
  s = reduce(s, { type: "essential", name: "Keys" });
  s = reduce(s, { type: "routine", routine: { id: "school", name: "School", keywords: ["class"], items: ["School ID"] } });
  s.connections.Calendar = true; s.connections.Location = true; s.connections.Notifications = true;
  s.outing.weatherEnabled = true; s.outing.enabled = true;
  return s;
}
const event = { id: "class", title: "Math class", destination: "School", startsAt: new Date(now + 3600000).toISOString(), endsAt: new Date(now + 7200000).toISOString() };
function forecast(chance = 80) { return parseForecast({ utc_offset_seconds: 28800, hourly: { time: [now / 1000, now / 1000 + 3600], precipitation_probability: [chance, chance], precipitation: [2, 2] } }, 14.5, 121, now); }
function ports(): ContextPorts { return { events: async () => [event], forecast: async () => forecast(), availability: async () => "Device not eligible", interpret: async () => { throw new Error("Should not infer"); } }; }
test("rain + school produces a grounded reminder without AI and removes expired context", async () => {
  const s = state(); s.outing.context = await prepareOutingContext(s, ports(), now);
  const r = reminderPreview(s, now);
  assert.deepEqual(r.items.map(i => i.name), ["Keys", "School ID", "Umbrella"]);
  assert.match(r.body, /If you're heading to Math class/);
  assert.equal(r.items[1].source, "routine");
  assert.deepEqual(reminderPreview(s, now + 4 * 3600000).items.map(i => i.name), ["Keys"]);
});
test("weather validates null/invalid probabilities, respects forecast day and expires", () => {
  assert.throws(() => parseForecast({ hourly: {} }, 0, 0, now));
  assert.throws(() => parseForecast({ utc_offset_seconds: 0, hourly: { time: [now / 1000], precipitation_probability: [null], precipitation: [0] } }, 0, 0, now));
  assert.equal(rainToday(forecast(0), now, 50), false);
  assert.equal(rainToday(forecast(), now, 50), true);
  assert.equal(forecastIsFresh(forecast(), 14.5, 121, now + 3 * 3600000), false);
  assert.equal(forecastIsFresh(forecast(), 15, 121, now), false);
  const tomorrow = { ...forecast(), hours: [{ at: now + 86400000, rainChance: 100, precipitation: 10 }] };
  assert.equal(rainToday(tomorrow, now, 50), false);
});
test("offline/denied services retain everyday essentials without fabricated context", async () => {
  const s = state(); const p = ports();
  p.events = async () => { throw new Error("Calendar denied"); };
  p.forecast = async () => { throw new Error("Offline"); };
  s.outing.context = await prepareOutingContext(s, p, now);
  assert.deepEqual(reminderPreview(s, now).items.map(i => i.name), ["Keys"]);
  assert.match(s.outing.context.weatherStatus, /Offline/);
});
test("current fresh weather cache survives network unavailability; consent off strips extras", async () => {
  const s = state(); s.outing.context = await prepareOutingContext(s, ports(), now);
  const p = ports(); p.forecast = async () => { throw new Error("Offline"); };
  s.outing.context = await prepareOutingContext(s, p, now + 60000);
  assert.match(s.outing.context.weatherStatus, /recent forecast/);
  assert.ok(reminderPreview(s, now + 60000).items.some(i => i.name === "Umbrella"));
  const off = reduce(s, { type: "weatherEnabled", enabled: false });
  assert.equal(reminderPreview(off, now + 60000).items.some(i => i.name === "Umbrella"), false);
});
test("local AI matches semantic routines with source IDs; invalid output rejected", async () => {
  const s = state(), p = ports();
  p.events = async () => [{ ...event, title: "Algebra assessment" }];
  p.availability = async () => "available";
  p.interpret = async () => validateInterpretation(JSON.stringify({ matches: [{ routineId: "school", eventId: "class" }], items: [{ name: "Pencil", reason: "For working through the assessment.", eventId: "class" }] }), [event], s.outing.routines);
  s.outing.context = await prepareOutingContext(s, p, now);
  assert.equal(reminderPreview(s, now).items.find(i => i.name === "School ID")!.source, "ai");
  assert.throws(() => validateInterpretation('{"matches":[],"items":[{"name":"Passport","reason":"Required","eventId":"unknown"}]}', [event], []));
  assert.throws(() => validateInterpretation('{"matches":[{"routineId":"fake","eventId":"class"}],"items":[]}', [event], []));
});
test("virtual, cancelled, all-day and far-future events do not imply a destination", () => {
  assert.equal(relevantEvents([{ ...event, title: "Online class" }, { ...event, cancelled: true }, { ...event, allDay: true }, { ...event, startsAt: new Date(now + 4 * 3600000).toISOString() }], now).length, 0);
});
test("changed routine invalidates in-flight context and exclusions suppress generated extras", async () => {
  const s = state(), context = await prepareOutingContext(s, ports(), now);
  const changed = reduce(s, { type: "essential", name: "Wallet" });
  assert.equal(reduce(changed, { type: "outingContext", context }), changed);
  const excluded = reduce(s, { type: "neverSuggest", name: "Umbrella", enabled: true });
  excluded.outing.context = await prepareOutingContext(excluded, ports(), now);
  assert.equal(reminderPreview(excluded, now).items.some(i => i.name === "Umbrella"), false);
  assert.notEqual(contextKey(s), contextKey(excluded));
});
test("pending alerts recheck enablement, Home, delivery receipt and expiry", () => {
  const result = transition(state(), { inside: ["home"] }, "home", false, now);
  const s = { ...result.state, automation: result.episode }, reminder = s.automation.pending!.reminder!;
  assert.equal(canDeliverOuting(s, reminder, now), true);
  assert.equal(canDeliverOuting(reduce(s, { type: "outingEnabled", enabled: false }), reminder, now), false);
  assert.equal(canDeliverOuting(reduce(s, { type: "removePlace", id: "home" }), reminder, now), false);
  assert.equal(canDeliverOuting({ ...s, paused: true }, reminder, now), false);
  assert.equal(canDeliverOuting(s, reminder, now + 600001), false);
  assert.equal(canDeliverOuting({ ...s, automation: { ...s.automation, pending: { ...s.automation.pending!, deliveredAt: now } } }, reminder, now), false);
});
test("v1 migration preserves records, selects existing Home but does not silently opt in", () => {
  let s = state(); s = reduce(s, { type: "plan", title: "Old plan", destination: "Office" });
  s = reduce(s, { type: "toggle", id: s.personal!.items[0].id });
  const { outing: ignored, ...legacy } = s; void ignored;
  const restored = decodeSnapshot(JSON.stringify({ version: 1, revision: 8, state: legacy }));
  assert.equal(restored.version, 3); assert.equal(restored.revision, 8);
  assert.equal(restored.state.outing.homeId, "home"); assert.equal(restored.state.outing.enabled, false);
  assert.equal(restored.state.personal!.items[0].status, "confirmed");
  assert.throws(() => decodeSnapshot(JSON.stringify({ version: 2, revision: 8, state: legacy })));
  assert.throws(() => decodeSnapshot(JSON.stringify({ version: 9, revision: 8, state: s })));
});
test("new snapshot round-trip preserves resumable setup, routines and forecast; corrupt config fails", async () => {
  const s = reduce(state(), { type: "setupStep", step: 2 });
  s.outing.context = await prepareOutingContext(s, ports(), now);
  const raw = JSON.stringify({ version: 2, revision: 2, state: s });
  assert.equal(decodeSnapshot(raw).state.outing.setupStep, 2);
  assert.equal(decodeSnapshot(raw).state.outing.context!.forecast!.hours.length, 2);
  assert.throws(() => decodeSnapshot(JSON.stringify({ version: 2, revision: 2, state: { ...s, outing: { ...s.outing, rainThreshold: -1 } } })));
});

test("unchanged event reuses successful AI context; changed event is interpreted again", async () => {
  const s = state(); let calls = 0;
  const api = { ...ports(), availability: async () => "available", interpret: async () => {
    calls++; return { matches: [], items: [{ name: "Notebook", reason: "For class notes", eventId: event.id }] };
  } };
  s.outing.context = await prepareOutingContext(s, api, now);
  assert.equal(calls, 1);
  const again = await prepareOutingContext(s, api, now + 60000);
  assert.equal(calls, 1); assert.equal(again.items.some(i => i.source === "ai"), true);
  await prepareOutingContext(s, { ...api, events: async () => [{ ...event, title: "Exam" }] }, now + 60000);
  assert.equal(calls, 2);
});
