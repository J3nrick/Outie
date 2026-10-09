import { test } from "node:test";
import assert from "node:assert/strict";
import { initialState, reduce, activePlan, unresolved } from "./model.ts";
test("demo edits never become personal plans", () => {
  let s = reduce(initialState(), { type: "demo", enabled: true });
  s = reduce(s, { type: "add", id: "agenda", name: "Agenda" });
  s = reduce(s, { type: "demo", enabled: false });
  assert.equal(activePlan(s), null);
  assert.ok(s.sample.items.some((i) => i.id === "agenda"));
});
test("confirmed and intentionally excluded items are absent from alert text", () => {
  let s = reduce(initialState(), { type: "demo", enabled: true });
  s = reduce(s, { type: "toggle", id: "id", at: "2026-10-09T14:00:00Z" });
  s = reduce(s, { type: "exclude", id: "notes" });
  assert.deepEqual(
    unresolved(activePlan(s)).map((i) => i.id),
    ["charger"],
  );
  s = reduce(s, { type: "depart" });
  assert.match(s.notice, /Laptop charger/);
  assert.doesNotMatch(s.notice, /Company ID|Presentation notes/);
});
test("one alert per episode and pause suppress repeated checks", () => {
  let s = reduce(initialState(), { type: "demo", enabled: true });
  s = reduce(s, { type: "depart" });
  s = reduce(s, { type: "depart" });
  assert.match(s.notice, /No duplicate/);
  s = reduce(s, { type: "return" });
  s = reduce(s, { type: "pause", enabled: true });
  s = reduce(s, { type: "depart" });
  assert.match(s.notice, /paused/);
  assert.equal(s.notifiedEpisode, null);
});
test("duplicate normalized items and empty items are rejected", () => {
  let s = reduce(initialState(), { type: "demo", enabled: true });
  const count = s.sample.items.length;
  s = reduce(s, { type: "add", id: "dupe", name: " company ID " });
  s = reduce(s, { type: "add", id: "empty", name: "   " });
  assert.equal(s.sample.items.length, count);
});
test("preferences require an explicit approval action", () => {
  let s = initialState();
  assert.deepEqual(s.memories, []);
  s = reduce(s, { type: "memory", text: "I keep a charger at work" });
  assert.equal(s.memories.length, 1);
  s = reduce(s, { type: "forget", text: s.memories[0] });
  assert.deepEqual(s.memories, []);
});
test("all resolved suppresses an alert and personal mode cannot simulate a departure", () => {
  let s = reduce(initialState(), { type: "demo", enabled: true });
  for (const i of unresolved(activePlan(s)))
    s = reduce(s, { type: "exclude", id: i.id });
  s = reduce(s, { type: "depart" });
  assert.match(s.notice, /No alert needed/);
  s = reduce(s, { type: "demo", enabled: false });
  s = reduce(s, { type: "depart" });
  assert.match(s.notice, /Demo Mode only/);
});
test("manual context uses approved everyday essentials rather than AI fixtures", () => {
  let s = initialState();
  s = reduce(s, { type: "essential", name: "Keys" });
  s = reduce(s, { type: "plan", title: "Work", destination: "Office" });
  assert.equal(activePlan(s)?.items[0].source, "user");
  assert.equal(s.demo, false);
  assert.equal(s.sample.items.length, 4);
});

test("returning starts a fresh episode without carrying stale confirmations", () => {
  let s = reduce(initialState(), { type: "demo", enabled: true });
  s = reduce(s, { type: "toggle", id: "id", at: "2026-10-09T14:00:00Z" });
  s = reduce(s, { type: "exclude", id: "notes" });
  s = reduce(s, { type: "return" });
  assert.equal(s.episode, 2);
  assert.equal(unresolved(activePlan(s)).length, 4);
  assert.ok(s.sample.items.every((i) => i.checkedAt === undefined));
});
