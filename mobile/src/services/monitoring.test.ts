import { test } from "node:test";
import assert from "node:assert/strict";
import { initialState, reduce } from "../data/model.ts";
import { decodeSnapshot } from "../data/storage.ts";
import { locatedPlaces, synchronizeMonitoring, type MonitoringDriver, type Region } from "./monitoring.ts";

function enabledState() {
  let s = reduce(initialState(), { type: "connection", kind: "Location", enabled: true });
  s = reduce(s, { type: "connection", kind: "Notifications", enabled: true });
  return reduce(s, { type: "outingEnabled", enabled: true });
}
function savedState() {
  return reduce(enabledState(), { type: "outingHome", place: {
    id: "home", name: "Home", description: "", radius: 200, latitude: 14.55, longitude: 121.02,
  } });
}
function driver() {
  const calls: string[] = [];
  let registered: Region[] = [];
  let started = false;
  let allowed = true;
  const port: MonitoringDriver = {
    isStarted: async () => started,
    stop: async () => { calls.push("stop"); started = false; registered = []; },
    hasBackgroundAccess: async () => { calls.push("permission"); return allowed; },
    registeredRegions: async () => registered,
    start: async (regions) => { calls.push("start"); registered = regions; started = true; },
  };
  return { port, calls, deny: () => { allowed = false; }, regions: () => registered };
}

test("enabled permission without a saved GPS place is setup, not an exception", async () => {
  const d = driver();
  const s = reduce(enabledState(), { type: "place", place: {
    id: "home", name: "Home", description: "Makati", radius: 200,
  } });
  assert.equal(await synchronizeMonitoring(s, d.port), "needs-place");
  assert.deepEqual(d.calls, []);
});
test("saving coordinates starts monitoring; an unchanged reconcile does not restart it", async () => {
  const d = driver();
  const s = savedState();
  const restored = decodeSnapshot(JSON.stringify({ version: 1, revision: 1, state: s })).state;
  assert.equal(await synchronizeMonitoring(restored, d.port), "active");
  assert.equal(d.regions()[0].identifier, "home");
  assert.equal(await synchronizeMonitoring(restored, d.port), "active");
  assert.equal(d.calls.filter((c) => c === "start").length, 1);
});
test("disconnect, pause, demo and removal of the last GPS place stop registered monitoring", async () => {
  const s = savedState();
  for (const [state, expected] of [
    [reduce(s, { type: "connection", kind: "Location", enabled: false }), "needs-background-access"],
    [{ ...s, paused: true }, "paused"],
    [{ ...s, demo: true }, "off"],
    [reduce(s, { type: "removePlace", id: "home" }), "needs-place"],
  ] as const) {
    const d = driver();
    await synchronizeMonitoring(s, d.port);
    assert.equal(await synchronizeMonitoring(state, d.port), expected);
    assert.equal(d.calls.at(-1), "stop");
    assert.deepEqual(d.regions(), []);
  }
});
test("revoked background permission stops old regions and reports the specific setup requirement", async () => {
  const d = driver();
  await synchronizeMonitoring(savedState(), d.port);
  d.deny();
  assert.equal(await synchronizeMonitoring(savedState(), d.port), "needs-background-access");
  assert.deepEqual(d.regions(), []);
});
test("invalid and partial coordinates never register, but zero coordinates are valid", () => {
  const s = savedState();
  const place = s.places[0];
  assert.equal(locatedPlaces({ ...s, places: [
    { ...place, latitude: NaN }, { ...place, longitude: undefined },
    { ...place, latitude: 91 }, { ...place, longitude: -181 },
    { ...place, radius: 0 },
  ] }).length, 0);
  assert.equal(locatedPlaces({ ...s, places: [{ ...place, latitude: 0, longitude: 0 }] }).length, 1);
});
test("only Home registers even with many stored places; native failures remain real errors", async () => {
  const s = savedState();
  const many = driver();
  assert.equal(await synchronizeMonitoring({ ...s, places: [s.places[0], ...Array.from({ length: 21 }, (_, i) => ({ ...s.places[0], id: String(i) }))] }, many.port), "active");
  assert.equal(many.regions().length, 1);
  assert.equal(many.regions()[0].identifier, "home");
  const d = driver();
  d.port.start = async () => { throw new Error("Native registration failed"); };
  await assert.rejects(synchronizeMonitoring(s, d.port), /Native registration failed/);
});

test("revoked native notifications reports notification access rather than location", async () => {
  const d = driver();
  await synchronizeMonitoring(savedState(), d.port);
  d.port.hasNotificationAccess = async () => false;
  assert.equal(await synchronizeMonitoring(savedState(), d.port), "needs-notifications");
  assert.deepEqual(d.regions(), []);
});
