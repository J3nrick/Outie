import { decodeSnapshot, type Snapshot } from "./storage";
const key = "depart.preparation.v1";
export async function loadSnapshot(): Promise<Snapshot | null> {
  if (typeof localStorage === "undefined") return null;
  const raw = localStorage.getItem(key);
  return raw ? decodeSnapshot(raw) : null;
}
export async function saveSnapshot(
  snapshot: Snapshot,
  expectedRevision: number,
): Promise<void> {
  if (typeof localStorage === "undefined")
    throw new Error("Browser storage is unavailable.");
  const current = await loadSnapshot();
  if ((current?.revision ?? 0) !== expectedRevision)
    throw new Error("Data changed in another tab. Retry your change.");
  localStorage.setItem(key, JSON.stringify(snapshot));
}
