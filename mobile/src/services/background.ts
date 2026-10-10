import { publishSavedWidgets } from "./widgets";
import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";
import * as BackgroundTask from "expo-background-task";
import * as Device from "expo-device";
import { prepareDeviceContext } from "./context-runtime";

import * as Notifications from "expo-notifications";
import { loadSnapshot, saveSnapshot } from "../data/repository";
import { transition } from "./automation";
import {
  scheduleOuting,
  startMonitoring,
  syncReminder,
  permission,
} from "./device";
import type { State } from "../data/model";
import { errorMessage } from "./errors";
import { canDeliverOuting, contextKey } from "./outing-policy";
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});
TaskManager.defineTask<{
  eventType: Location.GeofencingEventType;
  region: Location.LocationRegion;
}>("depart-regions", async ({ data, error }) => {
  if (error || !data) return;
  if (
    (await permission("Location")) !== "granted" ||
    (await Location.getBackgroundPermissionsAsync()).status !== "granted"
  )
    return;
  for (let attempt = 0; attempt < 3; attempt++) {
    const saved = await loadSnapshot();
    if (!saved) return;
    const result = transition(
      saved.state,
      saved.state.automation ?? { inside: [] },
      data.region.identifier ?? "",
      data.eventType === Location.GeofencingEventType.Enter,
      Date.now(),
    );
    if (result.episode === saved.state.automation) {
      await deliverPending();
      return;
    }
    try {
      await saveSnapshot(
        {
          ...saved,
          revision: saved.revision + 1,
          state: { ...result.state, automation: result.episode },
        },
        saved.revision,
      );
    } catch (e) {
      if (attempt < 2) continue;
      throw e;
    }
    await deliverPending();
    await publishSavedWidgets();
    return;
  }
});
// iOS chooses execution time. Context preparation never blocks the departure callback.
const contextTask = "outie-context-refresh";
TaskManager.defineTask(contextTask, async () => {
  let expired = false;
  const listener = BackgroundTask.addExpirationListener(() => { expired = true; });
  try {
    const snapshot = await loadSnapshot();
    if (!snapshot || !snapshot.state.outing.enabled || snapshot.state.paused || snapshot.state.demo)
      return BackgroundTask.BackgroundTaskResult.Success;
    const context = await prepareDeviceContext(snapshot.state);
    for (let attempt = 0; attempt < 3 && !expired; attempt++) {
      const latest = await loadSnapshot();
      if (!latest || !latest.state.outing.enabled || latest.state.paused || latest.state.demo ||
          contextKey(latest.state) !== context.inputKey) return BackgroundTask.BackgroundTaskResult.Success;
      try {
        await saveSnapshot({ ...latest, revision: latest.revision + 1,
          state: { ...latest.state, outing: { ...latest.state.outing, context } } }, latest.revision);
        await publishSavedWidgets();
        return BackgroundTask.BackgroundTaskResult.Success;
      } catch (e) { if (attempt === 2) throw e; }
    }
    return BackgroundTask.BackgroundTaskResult.Failed;
  } catch { return BackgroundTask.BackgroundTaskResult.Failed; }
  finally { listener.remove(); }
});
async function syncContextRefresh(state: State) {
  // BGTaskScheduler has no simulator support. Geofencing and the UI still remain testable.
  if (!Device.isDevice) return;
  const registered = await TaskManager.isTaskRegisteredAsync(contextTask);
  const active = state.outing.enabled && !state.paused && !state.demo &&
    state.connections.Location && state.connections.Notifications && state.outing.onboardingComplete;
  if (!active) { if (registered) await BackgroundTask.unregisterTaskAsync(contextTask); return; }
  if (!registered && await BackgroundTask.getStatusAsync() === BackgroundTask.BackgroundTaskStatus.Available)
    await BackgroundTask.registerTaskAsync(contextTask, { minimumInterval: 15 });
}
// Pending intent is committed before scheduling; retry on the next task or app resume.
async function deliverPending() {
  const saved = await loadSnapshot();
  const pending = saved?.state.automation?.pending;
  if (!saved || !pending || pending.deliveredAt) return;
  const s = saved.state;
  if (
    !pending.reminder || !canDeliverOuting(s, pending.reminder, Date.now())
  )
    return;
  const delivered = await scheduleOuting(pending.reminder!, false);
  if (!delivered) {
    const latest = await loadSnapshot();
    if (latest?.state.automation?.pending?.id === pending.id) await saveSnapshot({ ...latest, revision: latest.revision + 1, state: { ...latest.state, automation: { ...latest.state.automation, pending: undefined } } }, latest.revision);
    return;
  }
  const latest = await loadSnapshot();
  if (latest?.state.automation?.pending?.id !== pending.id) return;
  await saveSnapshot(
    {
      ...latest,
      revision: latest.revision + 1,
      state: {
        ...latest.state,
        automation: {
          ...latest.state.automation,
          pending: { ...latest.state.automation.pending!, deliveredAt: Date.now() },
        },
      },
    },
    latest.revision,
  );
}
export async function reconcile(state: State) {
  const results = await Promise.allSettled([
    startMonitoring(state),
    syncReminder(state),
    syncContextRefresh(state),
  ]);
  const errors = results.filter(
    (r): r is PromiseRejectedResult => r.status === "rejected",
  );
  if (errors.length)
    throw new Error(errors.map((r) => errorMessage(r.reason)).join(" "));
  await deliverPending();
  return results[0].status === "fulfilled" ? results[0].value : null;
}
export function listenForNotifications(onOpen: (planId: string, outing?: boolean) => void) {
  const handler = (r: Notifications.NotificationResponse) => {
    const id = r.notification.request.content.data?.planId;
    const outing = r.notification.request.content.data?.outingId;
    if (typeof outing === "string") {
      onOpen(outing, true);
      void Notifications.clearLastNotificationResponseAsync();
      return;
    }
    if (typeof id === "string") {
      onOpen(id);
      void Notifications.clearLastNotificationResponseAsync();
    }
  };
  const subscription =
    Notifications.addNotificationResponseReceivedListener(handler);
  void Notifications.getLastNotificationResponseAsync().then((r) => {
    if (r) handler(r);
  });
  return () => subscription.remove();
}
