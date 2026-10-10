# Functional implementation and acceptance

The user authorized steps 1–7 on October 10, 2026. This opens the live integration phase. The existing SwiftUI app remains separate.

## Latest active journey

The checklist-first paths below are historical retained integrations. The active UI is now Today · My things · Settings with optional Calendar/weather context and explicit Home departure reminders. See [UNCHECKED_REMINDERS.md](UNCHECKED_REMINDERS.md) and TESTING.md for the latest 52-test evidence. Only current-outing unchecked items appear in exit notifications; all checked suppresses the alert. Historical plan confirmations never silently suppress a new outing. Item details retain manual/visual timestamps and explicitly recorded location evidence; Got it acknowledges one reminder without checking items. Background context refresh is best effort, separate from the cached-context exit policy. No cloud AI or tracker access is claimed.

Home Screen/Lock Screen widgets and a Settings guide were subsequently added; see WIDGETS.md and TESTING.md. Actual simulator rendering/tap/update checks passed. The signed SE update installed, but physical launch and placement were not verified because the phone was locked and the user requested simulator-only completion.

The physical acceptance gates below remain open for the redesigned flow. A compiled Foundation Models bridge, simulator model status, or sample demo does not establish physical offline inference or locked-background departure delivery.

## Implemented paths

- Native SQLite snapshot repository with schema version, atomic writes, revision checks, separate personal/demo records, loading and save-error states. Browser uses persistent local storage through the same interface.
- Persisted plans, manual confirmations, exclusions, removal markers, everyday essentials, approved preferences, saved-place coordinates, settings and departure episodes.
- Local Expo module using Apple Foundation Models availability and guided generation. Suggestions are validated and merged without replacing existing items or reintroducing explicitly removed items. Requests are discarded when cancelled or when their plan is no longer active.
- Real Calendar permission/read adapter and upcoming-event selection. Explicit manual context remains available. No calendar writes.
- Real camera permission, foreground photo capture, local reference files, and Vision feature-print comparison. The distance is not classified as a match; the user reviews images. Visual observation and manual confirmation remain separate.
- Real local notification scheduling, plan identity in notification data, cold/warm launch handling, and outdated-plan landing protection.
- Saved-area background geofencing task, known-entry requirement, duplicate-exit suppression, cooldown, validated-return reset, pause/demo suppression, and approved everyday fallback for stale/missing event context. Background code uses persisted plans, never fresh AI inference.

## Acceptance gates

| Step | Gate |
| --- | --- |
| 1. UI | Full VoiceOver audio, reduced-motion/transparency, keyboard, and physical layouts need dedicated review after functional changes. |
| 2. Persistence | Native terminate/relaunch and browser reload observed; scoped round-trip/corrupt input unit tests pass. Injected native disk-write failure remains to test. |
| 3. AI | Simulator generation observed; compatible physical iPhone offline acceptance remains required. |
| 4. Device connections | Real simulator notification permission and OS banner observed. Native denial/revocation, real event selection, photo capture and physical delivery need hardware checks. Current outing test-notification tap landing passed in the simulator; physical cold/warm launch and permission-revocation checks remain. |
| 5. Automation | Unchecked/all-checked, known-entry, return/reset, selected/overlapping regions and acknowledgement policy tests pass. The iOS 27 simulator reports circular-region monitoring unavailable; real locked/background delivery and latency need a physical iPhone. |
| 6. Vision | Actual-object positive/negative comparison, lighting/occlusion and uncertainty testing required. No calibrated automatic recognition threshold is claimed. |
| 7. Cloud/trackers | Cloud provider unavailable without verified Apple access. User has no tracker; support remains unavailable until a documented accessory/SDK is selected. |

## Remaining engineering before production

- Archive/multiple-plan history beyond the single active personal plan.
- Explicit quiet-hour preferences and production delivery hardening. Pending alert intent now persists and retries on the next task/resume within 10 minutes using a stable notification identifier; a crash between OS delivery and receipt persistence can still duplicate delivery. Overlapping-region policy is unit-tested; reboot/force-quit behavior and latency need hardware measurements.
- Native cancellation of an in-flight Foundation Models session (current cancellation discards the eventual result).
- Calibrated vision recognition with a suitable model; current local comparison requires user review.
- Eligible PCC entitlement and opt-in provider, then a separately selected tracker adapter. No credentials, cloud endpoints, or accessory API are invented.
- Reassess existing dependency advisories before production distribution.

This document is an implementation and acceptance checklist, not a claim that all seven phases passed physical acceptance.

## Observed functional validation

- Updated native Debug simulator build and launch succeeded with the autolinked Swift module.
- Simulator reports the actual Foundation Models availability as available. A previously unprocessed manual workshop context generated real local suggestions; regeneration preserved a confirmed Laptop and did not reintroduce removed Notebook.
- SQLite checklist state survived app termination/relaunch. Browser demo confirmation survived reload.
- Native notifications permission was granted in the simulator. A real OS banner contained only unchecked Presentation materials, excluding confirmed Laptop. Evidence: `screenshots/local-notification.png`.
- TypeScript, lint and all 17 tests passed; web export succeeded. Release build outcome is recorded in TESTING.md.

No new physical-phone installation was performed; the user's simulator-only preference remains in effect. These results do not establish offline physical inference, background geofence latency, or calibrated recognition.

Updated native Release simulator build succeeded (`/tmp/depart-functional-release.log`), installed on the iPhone 17 Pro simulator, and launched. It embeds the JS bundle and does not require Metro.

Subsequent phone run: at the user's explicit request, the latest signed Release was installed and visibly launched on the SE. See TESTING.md. This supersedes the earlier simulator-only installation statement; other physical acceptance gates remain open.
