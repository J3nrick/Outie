import type { Place, State } from "../data/model.ts";
import { homePlace } from "./outing-policy.ts";

export type MonitoringStatus =
  | "off"
  | "paused"
  | "needs-place"
  | "needs-background-access"
  | "needs-notifications"
  | "active";

export function locatedPlaces(state: State) {
  return state.places.filter(
    (p): p is Place & { latitude: number; longitude: number } =>
      Number.isFinite(p.latitude) &&
      Number.isFinite(p.longitude) &&
      Math.abs(p.latitude!) <= 90 &&
      Math.abs(p.longitude!) <= 180 &&
      Number.isFinite(p.radius) && p.radius > 0,
  );
}

export function monitoringSetup(state: State): MonitoringStatus | null {
  if (state.demo || !state.outing.enabled) return "off";
  if (state.paused) return "paused";
  if (!locatedPlaces(state).some(p => p.id === state.outing.homeId)) return "needs-place";
  if (!state.connections.Notifications) return "needs-notifications";
  if (!state.connections.Location) return "needs-background-access";
  return null; // Native permission and registration still need checking.
}

export type Region = {
  identifier: string;
  latitude: number;
  longitude: number;
  radius: number;
  notifyOnEnter: boolean;
  notifyOnExit: boolean;
};
export type MonitoringDriver = {
  isStarted: () => Promise<boolean>;
  stop: () => Promise<void>;
  hasNotificationAccess?: () => Promise<boolean>;
  hasBackgroundAccess: () => Promise<boolean>;
  registeredRegions: () => Promise<unknown>;
  start: (regions: Region[]) => Promise<void>;
};

export async function synchronizeMonitoring(
  state: State,
  driver: MonitoringDriver,
): Promise<MonitoringStatus> {
  const stop = async () => {
    if (await driver.isStarted()) await driver.stop();
  };
  const setup = monitoringSetup(state);
  if (setup) {
    await stop();
    return setup;
  }
  if (driver.hasNotificationAccess && !(await driver.hasNotificationAccess())) {
    await stop();
    return "needs-notifications";
  }
  if (!(await driver.hasBackgroundAccess())) {
    await stop();
    return "needs-background-access";
  }
  const places = locatedPlaces(state).filter(p => p.id === homePlace(state)?.id);
  if (places.length > 20) {
    await stop();
    throw new Error("iOS supports up to 20 monitored places.");
  }
  const regions = places.map((p) => ({
    identifier: p.id,
    latitude: p.latitude,
    longitude: p.longitude,
    radius: p.radius,
    notifyOnEnter: true,
    notifyOnExit: true,
  }));
  if (await driver.isStarted()) {
    if (JSON.stringify(await driver.registeredRegions()) === JSON.stringify(regions))
      return "active";
  }
  await driver.start(regions);
  return "active";
}
