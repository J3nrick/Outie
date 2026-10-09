import { type Connection, type State, type Plan } from "../data/model";
import { synchronizeMonitoring } from "./monitoring";
import type { CalendarContext, OutingReminder } from "../data/outing";
import { canDeliverOuting, reminderPreview } from "./outing-policy";
export async function listCalendars() {
  if ((await permission("Calendar")) !== "granted") return [];
  const c = await import("expo-calendar");
  return (await c.getCalendars(c.EntityTypes.EVENT)).map(x => ({ id: x.id, title: x.title }));
}
export async function outingEvents(calendarIds: string[] = []): Promise<CalendarContext[]> {
  const c = await import("expo-calendar");
  if ((await permission("Calendar")) !== "granted") throw new Error("Calendar access is unavailable. Your everyday reminders still work.");
  const calendars = (await c.getCalendars(c.EntityTypes.EVENT)).filter(x => !calendarIds.length || calendarIds.includes(x.id));
  const now = Date.now();
  const lists = await Promise.all(calendars.map(x => x.listEvents(new Date(now - 12 * 3600000), new Date(now + 3 * 3600000))));
  return lists.flat().slice(0, 80).map(e => ({ id: e.id, calendarId: e.calendarId, title: e.title,
    destination: e.location ?? "", startsAt: new Date(e.startDate).toISOString(),
    endsAt: new Date(e.endDate).toISOString(), allDay: e.allDay, cancelled: String(e.status).toLowerCase() === "canceled" || String(e.status).toLowerCase() === "cancelled" }));
}
export async function scheduleOuting(reminder: OutingReminder, test = false) {
  const n = await import("expo-notifications");
  if ((await permission("Notifications")) !== "granted") throw new Error("Enable notifications to receive reminders.");
  const { loadSnapshot, saveSnapshot } = await import("../data/repository");
  const saved = await loadSnapshot();
  if (!saved) throw new Error("Save your routine first.");
  const s = saved.state;
  if (test ? s.demo || !s.connections.Notifications : !canDeliverOuting(s, reminder, Date.now())) return null;
  if (!test && (await (await import("expo-location")).getBackgroundPermissionsAsync()).status !== "granted") return null;
  const current = reminderPreview(s, Date.now(), reminder.id);
  if (!current.items.length) throw new Error("Add an everyday essential before testing a reminder.");
  if (!test) {
    // Keep the persisted tap destination identical to the fresh notification contents.
    const existing = [...await n.getAllScheduledNotificationsAsync(), ...await n.getPresentedNotificationsAsync()];
    if (existing.some(x => ("request" in x ? x.request.identifier : x.identifier) === reminder.id)) return reminder.id;
    await saveSnapshot({ ...saved, revision: saved.revision + 1, state: { ...s,
      outing: { ...s.outing, history: s.outing.history.map(r => r.id === current.id ? current : r) },
      automation: { ...s.automation!, pending: { ...s.automation!.pending!, reminder: current } },
    } }, saved.revision);
    const latest = await loadSnapshot();
    if (!latest || !canDeliverOuting(latest.state, current, Date.now())) return null;
  }
  await n.scheduleNotificationAsync({ identifier: reminder.id,
    content: { title: test ? "Outie · test reminder" : current.title, body: current.body,
      data: { outingId: reminder.id, url: "/reminder", test } },
    trigger: { type: n.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: 1, repeats: false },
  });
  return reminder.id;
}
export async function permission(
  kind: Connection,
  request = false,
): Promise<string> {
  if (kind === "Calendar") {
    const c = await import("expo-calendar");
    return (
      await (request
        ? c.requestCalendarPermissions()
        : c.getCalendarPermissions())
    ).status;
  }
  if (kind === "Camera") {
    const { Camera } = await import("expo-camera");
    return (
      await (request
        ? Camera.requestCameraPermissionsAsync()
        : Camera.getCameraPermissionsAsync())
    ).status;
  }
  if (kind === "Notifications") {
    const n = await import("expo-notifications");
    return (
      await (request ? n.requestPermissionsAsync() : n.getPermissionsAsync())
    ).status;
  }
  const l = await import("expo-location");
  return (
    await (request
      ? l.requestForegroundPermissionsAsync()
      : l.getForegroundPermissionsAsync())
  ).status;
}
export async function upcomingEvents() {
  const c = await import("expo-calendar");
  if ((await permission("Calendar")) !== "granted")
    throw new Error("Calendar access is not granted.");
  const calendars = await c.getCalendars(c.EntityTypes.EVENT);
  const end = new Date(Date.now() + 7 * 86400000);
  const lists = await Promise.all(
    calendars.map((calendar) => calendar.listEvents(new Date(), end)),
  );
  return lists
    .flat()
    .filter((e) => !e.allDay)
    .sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
    )
    .slice(0, 20)
    .map((e) => ({
      id: e.id,
      title: e.title,
      destination: e.location ?? "",
      startsAt: new Date(e.startDate).toISOString(),
    }));
}
export async function currentCoordinates() {
  const l = await import("expo-location");
  if ((await permission("Location", true)) !== "granted")
    throw new Error("Location access declined.");
  const result = await l.getCurrentPositionAsync({
    accuracy: l.Accuracy.Balanced,
  });
  if (result.coords.accuracy !== null && result.coords.accuracy > 200)
    throw new Error("Location is too imprecise. Try again outside.");
  return {
    latitude: result.coords.latitude,
    longitude: result.coords.longitude,
  };
}
export async function scheduleCheck(
  plan: Plan,
  seconds: number,
  identifier = `preparation-${plan.id}`,
) {
  const n = await import("expo-notifications");
  if ((await permission("Notifications")) !== "granted")
    throw new Error("Notifications are not enabled.");
  const { loadSnapshot } = await import("../data/repository");
  const latest = await loadSnapshot();
  if (
    latest &&
    (latest.state.paused ||
      latest.state.demo ||
      !latest.state.connections.Notifications ||
      latest.state.personal?.id !== plan.id)
  )
    throw new Error("This preparation is paused or no longer active.");
  const currentPlan = latest?.state.personal ?? plan;
  const pending = currentPlan.items.filter((i) => i.status === "unchecked");
  if (!pending.length) {
    await n.cancelScheduledNotificationAsync(identifier);
    return null;
  }
  await n.scheduleNotificationAsync({
    identifier,
    content: {
      title: `Prepare for ${plan.title}`,
      body: `Still to check: ${pending.map((i) => i.name).join(", ")}`,
      data: { planId: plan.id, url: "/checklist" },
    },
    trigger: {
      type: n.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: Math.max(1, seconds),
      repeats: false,
    },
  });
  return identifier;
}
export async function syncReminder(state: State) {
  const n = await import("expo-notifications");
  const scheduled = await n.getAllScheduledNotificationsAsync();
  const l = await import("expo-location");
  const allowed = state.outing.enabled && !state.paused && !state.demo && state.connections.Location && state.connections.Notifications &&
    (await permission("Notifications")) === "granted" && (await l.getBackgroundPermissionsAsync()).status === "granted";
  for (const request of scheduled) {
    // Retire old checklist/pre-event reminders, which do not implement every-outing behavior.
    if (/^(preparation|departure|snooze)-/.test(request.identifier) ||
        (request.identifier.startsWith("outing-") && (!allowed || !state.places.some(p => p.id === state.outing.homeId))))
      await n.cancelScheduledNotificationAsync(request.identifier);
  }
}
export async function startMonitoring(state: State) {
  const l = await import("expo-location");
  const tasks = await import("expo-task-manager");
  return synchronizeMonitoring(state, {
    isStarted: () => l.hasStartedGeofencingAsync("depart-regions"),
    stop: () => l.stopGeofencingAsync("depart-regions"),
    hasNotificationAccess: async () => (await permission("Notifications")) === "granted",
    hasBackgroundAccess: async () =>
      (await l.getBackgroundPermissionsAsync()).status === "granted" && (await l.getForegroundPermissionsAsync()).status === "granted",
    registeredRegions: async () => {
      const options = await tasks.getTaskOptionsAsync("depart-regions") as { regions?: unknown } | null;
      return options?.regions;
    },
    start: (regions) => l.startGeofencingAsync("depart-regions", regions),
  });
}
export async function backgroundPermission() {
  const l = await import("expo-location");
  return (await l.requestBackgroundPermissionsAsync()).status;
}
export async function capturePhoto() {
  const picker = await import("expo-image-picker");
  if ((await permission("Camera", true)) !== "granted")
    throw new Error("Camera access declined.");
  const result = await picker.launchCameraAsync({
    mediaTypes: ["images"],
    quality: 0.8,
  });
  return result.canceled ? null : result.assets[0].uri;
}
export async function saveReference(uri: string, itemId: string) {
  const { File, Paths } = await import("expo-file-system");
  const file = new File(
    Paths.document,
    `reference-${itemId}-${Date.now()}.jpg`,
  );
  new File(uri).copy(file);
  return file.uri;
}
