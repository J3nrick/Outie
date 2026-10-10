import type { State } from "../data/model.ts";
import type { ItemEvidence, OutingSettings } from "../data/outing.ts";
export const CHECK_LIFETIME = 12 * 3600000;
export const itemKey = (name: string) => name.trim().toLowerCase();
export function checksCurrent(state: State, now: number) {
  const c = state.outing.checklist;
  return c.startedAt <= now && now - c.startedAt < CHECK_LIFETIME;
}
export function itemChecked(state: State, name: string, now: number) {
  return checksCurrent(state, now) && state.outing.checklist.checks.some(c => c.key === itemKey(name) && c.confirmedAt <= now);
}
export function nextChecklist(outing: OutingSettings, now: number): OutingSettings["checklist"] {
  const generation = outing.checklist.generation + 1;
  return { id: `preparation-${now}-${generation}`, generation, startedAt: now, checks: [] };
}
export function itemEvidence(state: State, name: string): ItemEvidence | undefined {
  return state.outing.evidence.find(e => e.key === itemKey(name));
}
