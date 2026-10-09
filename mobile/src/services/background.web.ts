import type { State } from "../data/model";
export async function reconcile(_state: State) { return null; }
export function listenForNotifications(_onOpen: (planId: string, outing?: boolean) => void) {
  return () => {};
}
