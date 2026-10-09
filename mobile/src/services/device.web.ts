import type { Connection, State, Plan } from "../data/model";
import type { MonitoringStatus } from "./monitoring";
import type { CalendarContext, OutingReminder } from "../data/outing";
export async function listCalendars(): Promise<{ id: string; title: string }[]> { return []; }
export async function outingEvents(_ids: string[] = []): Promise<CalendarContext[]> { throw unavailable(); }
export async function scheduleOuting(_reminder: OutingReminder, _test = false): Promise<string | null> { throw unavailable(); }
const unavailable = () =>
  new Error(
    "This connection requires the updated iOS app. The browser supports saved data and manual preparation.",
  );
export async function permission(
  _kind: Connection,
  _request = false,
): Promise<string> {
  return "unavailable";
}
export async function upcomingEvents(): Promise<
  { id: string; title: string; destination: string; startsAt: string }[]
> {
  throw unavailable();
}
export async function currentCoordinates(): Promise<{
  latitude: number;
  longitude: number;
}> {
  throw unavailable();
}
export async function scheduleCheck(
  _plan: Plan,
  _seconds: number,
  _identifier?: string,
): Promise<string | null> {
  throw unavailable();
}
export async function syncReminder(_state: State) {}
export async function startMonitoring(_state: State): Promise<MonitoringStatus> { return "off"; }
export async function backgroundPermission(): Promise<string> {
  throw unavailable();
}
export async function capturePhoto(): Promise<string | null> {
  throw unavailable();
}
export async function saveReference(
  _uri: string,
  _itemId: string,
): Promise<string> {
  throw unavailable();
}
