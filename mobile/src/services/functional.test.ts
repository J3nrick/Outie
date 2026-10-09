import { test } from "node:test";
import assert from "node:assert/strict";
import { initialState, reduce } from "../data/model.ts";
import { transition } from "./automation.ts";
import { validateSuggestions } from "./validation.ts";
test("AI rejects malformed, duplicate, and excessive suggestions", () => {
  assert.throws(() => validateSuggestions('{"items":[{"name":"X"}]}'));
  assert.throws(() =>
    validateSuggestions('{"items":[{"name":"Keys","reason":" "}]}'),
  );
  assert.throws(() =>
    validateSuggestions(
      JSON.stringify({
        items: [
          { name: "Keys", reason: "Entry" },
          { name: "keys", reason: "Entry" },
        ],
      }),
    ),
  );
  assert.equal(
    validateSuggestions('{"items":[{"name":"Keys","reason":"Entry"}]}')[0].name,
    "Keys",
  );
});
function enabled() {
  let s = reduce(initialState(), { type: "essential", name: "Keys" });
  s = reduce(s, { type: "outingHome", place: { id: "home", name: "Home", description: "", radius: 200, latitude: 14.55, longitude: 121.02 } });
  s = { ...s, connections: { ...s.connections, Location: true, Notifications: true } };
  return reduce(s, { type: "outingEnabled", enabled: true });
}
test("outing requires entry and explicit intent, suppresses duplicate exits, honors pause", () => {
  const s = enabled(), now = 1_000_000;
  assert.equal(transition(s, { inside: [] }, "home", false, now).episode.pending, undefined);
  const entered = transition(s, { inside: [] }, "home", true, now);
  const exited = transition(s, entered.episode, "home", false, now + 1000);
  assert.ok(exited.episode.pending?.reminder);
  assert.equal(transition(exited.state, exited.episode, "home", false, now + 2000).episode, exited.episode);
  for (const state of [{ ...s, paused: true }, { ...s, demo: true }, reduce(s, { type: "outingEnabled", enabled: false })])
    assert.equal(transition(state, entered.episode, "home", false, now + 1000).episode.pending, undefined);
});
test("every-outing reminder includes essentials despite historical confirmations and leaves records intact", () => {
  let s = reduce(enabled(), { type: "plan", title: "Old class", destination: "School" });
  s = reduce(s, { type: "toggle", id: s.personal!.items[0].id });
  const result = transition(s, { inside: ["home"] }, "home", false, 1_000_000);
  assert.match(result.episode.pending!.reminder!.body, /Keys/);
  assert.equal(result.state.personal, s.personal);
  assert.equal(result.state.personal!.items[0].status, "confirmed");
});
test("only the selected Home can start an outing; stale legacy event cannot contaminate it", () => {
  let s = reduce(enabled(), { type: "plan", title: "Old event", destination: "Old office", startsAt: "2000-01-01T00:00:00Z" });
  s = reduce(s, { type: "place", place: { id: "office", name: "Office", description: "", radius: 200, latitude: 0, longitude: 0 } });
  assert.equal(transition(s, { inside: ["office"] }, "office", false, Date.now()).episode.pending, undefined);
  const result = transition(s, { inside: ["home"] }, "home", false, Date.now());
  assert.doesNotMatch(result.episode.pending!.reminder!.body, /Old event|Old office/);
});
test("brief boundary return is suppressed but a stable return allows another outing without ten-minute lockout", () => {
  const s = enabled();
  const exit = transition(s, { inside: ["home"] }, "home", false, 1_000_000);
  const bounce = transition(exit.state, exit.episode, "home", true, 1_001_000);
  const quick = transition(bounce.state, bounce.episode, "home", false, 1_002_000);
  assert.equal(quick.episode.pending, undefined);
  const returned = transition(quick.state, quick.episode, "home", true, 1_003_000);
  const next = transition(returned.state, returned.episode, "home", false, 1_124_000);
  assert.ok(next.episode.pending);
  assert.equal(next.state.outing.history.length, 2);
});
test("acknowledging one outing cannot acknowledge another and preserves essentials", () => {
  const result = transition(enabled(), { inside: ["home"] }, "home", false, 1_000_000);
  const s = { ...result.state, automation: result.episode };
  assert.equal(reduce(s, { type: "acknowledge", planId: "different" }), s);
  const next = reduce(s, { type: "acknowledge", planId: s.automation.planId! });
  assert.equal(next.automation?.pending, undefined);
  assert.deepEqual(next.essentials, ["Keys"]);
});
