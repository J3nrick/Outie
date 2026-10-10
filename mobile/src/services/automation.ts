import type { State, Plan } from "../data/model.ts";
import type { OutingReminder } from "../data/outing.ts";
import { monitoredPlaces, departureReminder } from "./outing-policy.ts";
import { nextChecklist } from "./checks.ts";
export type Episode = {
  inside: string[]; enteredAt?: number; lastExit?: number; outside?: boolean;
  id?: string; planId?: string; placeId?: string; acknowledgedAt?: number;
  pending?: { id: string; plan: Plan; reminder?: OutingReminder; deliveredAt?: number };
};
export function transition(state: State, episode: Episode, placeId: string, enter: boolean, now: number): { state: State; episode: Episode } {
  if (state.demo || state.paused || !state.outing.enabled || !state.connections.Location ||
      !state.connections.Notifications || !monitoredPlaces(state).some(p => p.id === placeId)) return { state, episode };
  if (enter) {
    if (episode.inside.includes(placeId)) return { state, episode };
    const returned = episode.outside === true;
    const nextState = returned ? { ...state, outing: { ...state.outing, checklist: nextChecklist(state.outing, now) } } : state;
    return { state: nextState, episode: { ...episode, inside: [...episode.inside, placeId], enteredAt: returned || !episode.inside.length ? now : episode.enteredAt, outside: false, pending: undefined, acknowledgedAt: returned ? undefined : episode.acknowledgedAt } };
  }
  if (!episode.inside.includes(placeId)) return { state, episode };
  const inside = episode.inside.filter(id => id !== placeId);
  if (inside.length) return { state, episode: { ...episode, inside } }; // Wait until outside all overlapping selected areas.
  const id = `outing-${placeId}-${now}`;
  const next: Episode = { ...episode, inside: [], outside: true, lastExit: now, id, planId: id, placeId, pending: undefined, acknowledgedAt: undefined };
  if (episode.lastExit !== undefined && now - (episode.enteredAt ?? now) < 120000) return { state, episode: next };
  const reminder = departureReminder(state, now, placeId, id);
  if (!reminder.items.length) return { state, episode: next }; // All checked: no notification.
  const plan: Plan = { id, title: reminder.title, destination: "", time: "Departure reminder", items: reminder.items.map((i, index) => ({
    id: `${id}-${index}`, name: i.name, reason: i.reason, source: i.source === "ai" ? "ai" : "user", status: "unchecked",
  })) };
  return {
    state: { ...state, outing: { ...state.outing, history: [reminder, ...state.outing.history].slice(0, 20) } },
    episode: { ...next, id, planId: id, pending: { id, plan, reminder } },
  };
}
