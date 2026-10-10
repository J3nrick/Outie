import { test } from "node:test";
import assert from "node:assert/strict";
import { initialState, reduce } from "../data/model.ts";
import { decodeSnapshot } from "../data/storage.ts";
import { itemChecked, CHECK_LIFETIME } from "./checks.ts";
import { transition } from "./automation.ts";
import { reminderPreview, canDeliverOuting } from "./outing-policy.ts";
import { widgetProps, widgetTimeline, lockWidgetProps } from "./widget-data.ts";
const now = Date.parse("2026-10-10T00:00:00Z");
function state() {
  let s = reduce(initialState(), { type: "outingHome", place: { id: "home", name: "Home", description: "", radius: 200, latitude: 14.5, longitude: 121 } });
  s = reduce(s, { type: "essential", name: "Keys" }); s = reduce(s, { type: "essential", name: "Wallet" });
  s = reduce(s, { type: "newOuting", at: now });
  return { ...s, outing: { ...s.outing, enabled: true }, connections: { ...s.connections, Location: true, Notifications: true } };
}
function check(s: ReturnType<typeof state>, name: string, checked = true) { return reduce(s, { type: "checkThing", name, checked, checklistId: s.outing.checklist.id, at: now }); }
test("checked items are excluded from actual departure intent and widget counts", () => {
  const s = check(state(), "Keys");
  const exit = transition(s, { inside: ["home"] }, "home", false, now + 1000);
  assert.deepEqual(exit.episode.pending!.reminder!.items.map(i => i.name), ["Wallet"]);
  assert.doesNotMatch(exit.episode.pending!.reminder!.body, /Keys/);
  assert.match(exit.episode.pending!.reminder!.body, /Your phone left the Home area.*Wallet/);
  assert.equal(widgetProps(s, now).count, 1);
});
test("all checked suppresses departure delivery; unchecking restores that item", () => {
  const s = check(check(state(), "Keys"), "Wallet");
  assert.equal(transition(s, { inside: ["home"] }, "home", false, now + 1000).episode.pending, undefined);
  assert.equal(reminderPreview(s, now).items.length, 0);
  assert.match(lockWidgetProps(widgetProps(s, now)).note, /Confirmed/);
  assert.deepEqual(reminderPreview(check(s, "Wallet", false), now).items.map(i => i.name), ["Wallet"]);
});
test("return/new outing clears checks while retaining evidence and recorded places", () => {
  let s = check(state(), "Keys");
  s = reduce(s, { type: "recordThingLocation", name: "Keys", label: "Desk at Home", source: "user", at: now });
  const exit = transition(s, { inside: ["home"] }, "home", false, now + 1000);
  const returned = transition(exit.state, exit.episode, "home", true, now + 300000);
  assert.equal(itemChecked(returned.state, "Keys", now + 300000), false);
  assert.equal(returned.state.outing.evidence[0].confirmedAt, now);
  assert.equal(returned.state.outing.evidence[0].location?.label, "Desk at Home");
  assert.equal(itemChecked(reduce(s, { type: "newOuting", at: now + 1 }), "Keys", now + 1), false);
});
test("stale item handlers cannot confirm a later outing", () => {
  const s = state(), next = reduce(s, { type: "newOuting", at: now + 1 });
  assert.equal(reduce(next, { type: "checkThing", name: "Keys", checked: true, checklistId: s.outing.checklist.id, at: now + 2 }), next);
});
test("checks expire after 12 hours and widgets include a future unchecked fallback", () => {
  const s = check(check(state(), "Keys"), "Wallet");
  assert.equal(itemChecked(s, "Keys", now + CHECK_LIFETIME), false);
  const timeline = widgetTimeline(s, now);
  assert.equal(timeline[0].props.count, 0);
  assert.equal(timeline.at(-1)!.props.count, 2);
});
test("recording a place does not confirm an item or claim tracking; GPS validation is enforced", () => {
  const s = state();
  const recorded = reduce(s, { type: "recordThingLocation", name: "Keys", label: "Phone near Home", at: now, source: "phone", latitude: 14.5, longitude: 121 });
  assert.equal(itemChecked(recorded, "Keys", now), false);
  assert.equal(recorded.outing.evidence[0].location?.source, "phone");
  assert.equal(reduce(s, { type: "recordThingLocation", name: "Keys", label: "Bad coordinates", at: now, source: "phone", latitude: 99, longitude: 121 }), s);
});
test("acknowledgement only clears the matching outing and never confirms belongings", () => {
  const exited = transition(state(), { inside: ["home"] }, "home", false, now + 1000);
  const s = { ...exited.state, automation: exited.episode };
  const unrelated = reduce(s, { type: "acknowledgeOuting", id: "old", at: now + 2000 });
  assert.equal(unrelated.automation?.pending?.id, s.automation.pending!.id);
  const ack = reduce(s, { type: "acknowledgeOuting", id: s.automation.id!, at: now + 2000 });
  assert.equal(ack.automation?.pending, undefined); assert.ok(ack.outing.history[0].acknowledgedAt);
  assert.equal(itemChecked(ack, "Keys", now + 2000), false);
  assert.equal(canDeliverOuting(ack, s.automation.pending!.reminder!, now + 2000), false);
});
test("selected non-Home location works and overlapping regions wait until final exit", () => {
  let s = reduce(state(), { type: "place", place: { id: "office", name: "Office", description: "", radius: 200, latitude: 14.5, longitude: 121.1 } });
  s = reduce(s, { type: "monitoredPlaces", ids: ["home", "office"] });
  const first = transition(s, { inside: ["home", "office"] }, "office", false, now);
  assert.equal(first.episode.pending, undefined); assert.deepEqual(first.episode.inside, ["home"]);
  const last = transition(first.state, first.episode, "home", false, now + 1);
  assert.ok(last.episode.pending);
  const onlyOffice = reduce(s, { type: "monitoredPlaces", ids: ["office"] });
  assert.match(transition(onlyOffice, { inside: ["office"] }, "office", false, now).episode.pending!.reminder!.body, /Office/);
});
test("v2 migration preserves personal records/evidence timestamps but cannot suppress a new outing", () => {
  const s = check(state(), "Keys");
  const { checklist: ignored, evidence: ignored2, monitoredPlaceIds: ignored3, ...old } = s.outing; void ignored; void ignored2; void ignored3;
  const migrated = decodeSnapshot(JSON.stringify({ version: 2, revision: 9, state: { ...s, outing: old } }));
  assert.equal(migrated.version, 3); assert.equal(migrated.revision, 9);
  assert.equal(itemChecked(migrated.state, "Keys", now), false);
  assert.deepEqual(migrated.state.outing.monitoredPlaceIds, ["home"]);
});
test("v3 persists checks, acknowledgement and item evidence; corrupt metadata fails", () => {
  const s = reduce(check(state(), "Keys"), { type: "recordThingLocation", name: "Keys", label: "Home shelf", source: "user", at: now });
  const restored = decodeSnapshot(JSON.stringify({ version: 3, revision: 1, state: s })).state;
  assert.equal(itemChecked(restored, "Keys", now), true); assert.equal(restored.outing.evidence[0].location?.label, "Home shelf");
  assert.throws(() => decodeSnapshot(JSON.stringify({ version: 3, revision: 1, state: { ...s, outing: { ...s.outing, checklist: null } } })));
});
