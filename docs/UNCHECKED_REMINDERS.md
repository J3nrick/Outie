# Outie — unchecked departure reminders and item evidence

The user authorized restoring item checks, recorded location/time details and acknowledgement on October 10, 2026. This replaces the earlier every-outing/no-checklist notification policy.

## Behavior

- Today lists everyday essentials plus valid Calendar/local-AI/weather extras. A tap confirms an item for the current outing. Notifications contain only unchecked items. When every applicable item is confirmed, no departure alert is scheduled.
- Checks belong to a persisted preparation ID. Known return to a watched area creates a new preparation; Start a new outing explicitly resets checks. They also expire after 12 hours to prevent old confirmations suppressing later reminders when location callbacks were missed. Previous checklist confirmations never silently become current checks.
- My things and Today open item details. Details show last manual confirmation time and retained personal visual-check timestamps, separately from current check state. Users can record a place themselves or explicitly record their phone’s current coordinates. The latter is labelled as phone location; neither option locates an untracked object or proves packing.
- Saved Home remains the weather reference. Departure reminders can watch up to 20 selected saved locations. Unselected or invalid regions do not trigger the policy. Known entry is required; overlapping selected areas wait for the final exit. A short return/exit boundary bounce is suppressed by the existing two-minute inside debounce.
- A detected valid exit commits an outing reminder before scheduling. The notification says the phone left the named area and lists unchecked items, without asserting that a belonging was physically forgotten. Delivery rechecks current checks, preparation identity, permissions, selected region, pause and acknowledgement. No fresh inference or network call is required at exit.
- Got it acknowledges only the corresponding persisted outing. It does not mark items confirmed, remove essentials, disable monitoring or acknowledge a later outing. Acknowledged queued/presented notifications are retired during native reconciliation.
- Widgets project the remaining unchecked count and items. All-checked widgets say Confirmed for this outing. Future timelines restore unchecked essentials when checks expire. Lock Screen payloads still omit item names, event titles and coordinates.

## Persistence and retained data

Snapshot version 3 adds the preparation/check state, item evidence and selected watched-place IDs. Versions 1–2 migrate without importing historical check status into current suppression. Old plans, confirmation/photo evidence, preferences, routines, places, context and widget integration remain retained. Legacy pending notifications are dropped during policy migration. Metadata and confirmation/location actions save through the same explicit atomic repository; save failures remain visible.

## Validation and limits

52 policy/state/context/widget/error tests passed, with zero failures. TypeScript, Expo lint, web export and the signed native simulator Release build passed. New tests cover unchecked-only exit intent, all-checked suppression, unchecking, return/reset with retained evidence, stale handlers, 12-hour/widget expiry, phone-location validation, acknowledgement isolation, multiple/overlapping regions and version-3 persistence/migration.

Browser checks confirmed confirmation and recorded-place persistence after reload, all-checked presentation, and reset without deleting evidence. Native UI confirmed Keys checked, Wallet unchecked, and a real recorded confirmation timestamp. The native location adapter captured explicitly simulated coordinates for a temporary saved-place test.

**Unusual platform result:** iPhone 17 Pro / iOS 27 simulator reports `CLLocationManager.isMonitoringAvailable(for: CLCircularRegion.self)` false. Native Expo registration throws GeofencingUnavailable even with location access. The UI presents a short remedy rather than the framework stack, and never claims monitoring is active. Automatic background exit delivery remains a physical-iPhone acceptance gate. The user’s simulator-only preference is preserved; the SE was not updated in this milestone.

The actual OS test notification contained only Wallet after Keys was confirmed; tapping opened the corresponding saved reminder. Got it acknowledged that test without checking Wallet. Native terminate/relaunch preserved the checks and confirmation timestamp, and the Lock Screen widget updated to one unchecked item. Final tests also verified immediate history refresh and reset with retained evidence. Temporary simulator place and browser essential were removed, simulated GPS cleared, and monitoring left off. Labelled test notification history is retained. The complete regression report and screenshots are in TESTING.md. Unit policy tests establish routing/filtering correctness, not physical geofence latency or guaranteed OS background execution. Calendar/weather/AI context and tracker availability retain the previously documented provider/hardware limitations.
