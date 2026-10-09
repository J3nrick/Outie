import type { State, Plan } from "../data/model.ts";
import type { OutingReminder } from "../data/outing.ts";
import { homePlace, reminderPreview } from "./outing-policy.ts";
export type Episode = {
  inside: string[]; enteredAt?: number; lastExit?: number; outside?: boolean;
  id?: string; planId?: string; acknowledgedAt?: number;
  pending?: { id: string; plan: Plan; reminder?: OutingReminder; deliveredAt?: number };
};
export function transition(state: State, episode: Episode, placeId: string, enter: boolean, now: number): { state: State; episode: Episode } {
  const home = homePlace(state);
  if (state.demo || state.paused || !state.outing.enabled || !state.connections.Location ||
      !state.connections.Notifications || home?.id !== placeId ||
      !Number.isFinite(home.latitude) || !Number.isFinite(home.longitude)) return { state, episode };
  if (enter) {
    if (episode.inside.includes(placeId)) return { state, episode };
    return { state, episode: { ...episode, inside: [placeId], enteredAt: now, outside: false, pending: undefined } };
  }
  if (!episode.inside.includes(placeId) || episode.outside) return { state, episode };
  const next: Episode = { ...episode, inside: [], outside: true, lastExit: now, pending: undefined };
  // A brief return/boundary bounce belongs to the existing outing. A stable return permits a new reminder.
  if (episode.lastExit !== undefined && now - (episode.enteredAt ?? now) < 120000) return { state, episode: next };
  const id = `outing-${placeId}-${now}`;
  const reminder = reminderPreview(state, now, id);
  if (!reminder.items.length) return { state, episode: next };
  const plan: Plan = { id, title: reminder.title, destination: "", time: "Departure reminder", items: reminder.items.map((i, index) => ({
    id: `${id}-${index}`, name: i.name, reason: i.reason, source: i.source === "ai" ? "ai" : "user", status: "unchecked",
  })) };
  return {
    state: { ...state, outing: { ...state.outing, history: [reminder, ...state.outing.history].slice(0, 20) } },
    episode: { ...next, id, planId: id, pending: { id, plan, reminder } },
  };
}
