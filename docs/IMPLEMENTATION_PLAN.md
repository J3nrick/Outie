# DEPART — final implementation plan

Finalized October 9, 2026, Asia/Manila. This document is the active implementation roadmap and supersedes conflicting delivery order in earlier reports. The original brief and SwiftUI evidence remain historical records. The user selected React Native, UI first with mock data, and both phone-only departure alerts and later tracker-assisted separation detection.

## Current implementation — October 10, 2026

**Latest direction:** [Simple Outie outing reminders](SIMPLE_OUTING_PLAN.md) replaces the checklist-first redesign below. The user chose a reminder for every outing, personal essentials plus contextual local-AI extras, and Open-Meteo weather for the noncommercial demo because their account is a free Personal Team. Implement the simple reminder/context policy before optional integrations. This is approved direction and planned work, not a claim that the new workflow is built.

The prior [Outie final redesign](FINAL_REDESIGN_PLAN.md), finalized through the five-question interview on October 10, is retained as a historical plan. Its checklist-first flow and four-tab navigation are superseded by the simple outing-reminder direction above. Resumable setup, explicit opt-in, actual permission readiness and personal/demo isolation remain engineering requirements.

The user authorized functional steps 1–7, superseding the UI-only integration gate. The React Native app now has native SQLite persistence, a real Foundation Models bridge with validated item output and protected regeneration, real device-service adapters, saved-region automation policy, and user-reviewed local Vision comparison. The current design uses bundled Satoshi, a minimalist charcoal departure board, and restrained glass navigation. See `FUNCTIONAL_ACCEPTANCE.md` and `TESTING.md` for observed results and remaining gates. Tracker support stays unavailable at the user's request until an accessory is selected. Cloud access is also unavailable.

The earlier sections below describe the full roadmap; they are not evidence that every feature passed acceptance. Calendar auto-selection, multi-plan planning/history, richer structured preference proposals, quiet hours, calibrated recognition and production delivery hardening remain future work.

## Readiness decision

Ready to begin the React Native frontend. Core interfaces, screens, data ownership and acceptance gates are defined below. Not ready to claim a fully automatic physical forgotten-item detector. On-device Apple Foundation Models validation needs compatible physical hardware; the connected SE cannot provide that evidence. Private Cloud Compute needs eligible account access and Apple's managed entitlement; the current Personal Team does not establish access. Tracker integration needs a chosen supported accessory. These gates do not block frontend development or manual preparation functionality.

## Product outcome

DEPART understands the next activity, prepares a personalized essentials plan, and prompts the user before or around leaving a saved place when important items remain unresolved. Later, a supported tracker can add evidence of possible separation. It must never infer physical presence solely from calendar text, silence, a camera non-match, or location exit.

Target first journey: set Home and everyday essentials → client-presentation context → contextual plan → confirm company ID while leaving charger unresolved → preparation reminder → location-exit grouped alert → open the exact departure checklist → confirm, exclude, or snooze → suppress duplicates for that episode.

## Implementation choices

- React Native + TypeScript + Expo development builds, Expo Router, react-native-svg for bundled Solar paths. Verify compatible stable versions when scaffolding; commit a lockfile. Native Swift modules provide Foundation Models and iOS integrations where Expo does not expose the required behavior. Expo Go is not the acceptance environment for custom AI modules.
- San Francisco through iOS system typography, text scaling enabled, native accessibility roles, 44-point minimum controls, keyboard-safe forms, reduced-motion and transparency support. Keep approved porcelain, ink, slate, teal and warning colors. Solar Linear for ordinary custom controls, Bold for selected navigation; include attribution.
- Place the new app under `mobile/` so the current SwiftUI project remains runnable. Use a separate development bundle identifier to prevent prototype installation from replacing existing SwiftUI data. Do not silently migrate or delete the existing store.
- Proposed React Native baseline: iOS 18+, subject to the selected supported Expo/RN version matrix. Guard Foundation Models at iOS 26+ and check runtime availability. Older or incompatible hardware uses manual/rule-based fallback with an honest unavailable label. Reassess minimum target explicitly if current dependencies require a newer version.
- Phase 1 prototype uses deterministic resettable fixture state. Phase 2 replaces it with a local SQLite repository (Expo SQLite), explicit save failures, schema migrations and distinct demo/personal scopes. No remote backend, login, analytics or cloud database is necessary for the core workflow.
- AI tools are read-only context retrieval by default. Model output is a proposal; validation and policy determine persisted changes and notification scheduling. Calendar notes and imported documents are untrusted data, never tool authorization.

## Screens and interaction contract

Setup: brief explanation, create a saved place, choose everyday essentials, optional event context. Ask permissions only when enabling the related feature; show a useful manual experience if declined.

Today: current departure/activity, source and freshness, time if known, unresolved essentials, reasons and one main preparation action. Empty state says “No planned departure”; unknown departure time stays unset. In prototype mode, show a persistent Demo badge and label simulated signals.

Checklist: tap to confirm/uncheck; add/remove; intentionally exclude for this episode; targeted scan later. Show timestamps and evidence type. Regeneration preserves all explicit user choices. No “packed” status from camera or tracker evidence.

Essentials: editable item metadata, everyday/activity preferences, reference photos later, supported tracker association later.

Settings: Connections (Calendar, Camera, Notifications, Location, intelligence availability), saved places, automation pause, preparation reminder lead time, quiet preferences, approved memory management and data deletion. Cloud enhancement is unavailable/hidden until eligibility is established; prototype treatment must be labeled.

Notification landing: open the exact persisted episode. Offer Check now, Snooze and intentionally leave behind through an explicit item list. Never bulk-confirm unseen items from ambiguous AI output. Handle deleted/expired plans gracefully.

## Data contracts

Persist EventContext (source, title, optional location/start/end, source revision), Essential, PreferenceRule (explicit/approved provenance), SavedPlace, PreparationPlan, PlanItem, EvidenceObservation, DepartureEpisode and AlertRecord. IDs remain stable across generation and navigation. Store content hashes and timestamps to detect changes/staleness.

Separate item need (user-required, AI-suggested, optional) from evidence (unchecked, manually confirmed, visually observed, tracker nearby, possible separation, intentionally excluded). Observation records include source, timestamp and episode. Confirmations/exclusions do not carry into new departures automatically. Each item retains its origin and user-edit marker.

AI output: activity/category, normalized suggested items, concise grounded reasons, supporting context references, clarification questions, and optional preference-rule proposals. Schema validity is not factual accuracy: bound list/string sizes, reject duplicates and unsupported context references, and ask for clarification instead of inventing requirements. Keep suggestion confidence separate from object evidence; do not display invented calibrated percentages.

Adapters: PreparationRepository, CalendarProvider, LocalAIProvider, optional CloudAIProvider, LocationMonitor, NotificationService, CameraProvider, VisionProvider, optional TrackerProvider. Use mock and production adapters behind the same TypeScript contracts, with typed unavailable/error/cancelled results. Native APIs own permission and sensor state.

## AI routing

Local first: interpret individual events, generate essentials with reasons, extract explicit preference proposals, combine the day's plans, and revise suggestions after context changes. Persist user-approved rules rather than claiming the model automatically trains itself.

Optional PCC later: complex multi-day itinerary reasoning, many conflicting activities, or user-provided document synthesis that exceeds local capability. Use a visible “Enhanced planning” opt-in with a clear data summary; send only relevant authorized context, validate responses and cache the result. No cloud request during an offline core acceptance test. Network/entitlement/model failure falls back to existing saved plan or manual editing, never fabricated output. Cloud language reasoning does not imply camera-model or tracker capability.

The user selects enhancement or the app recommends it for a defined complexity threshold; no silent cloud escalation. A cloud model returning a different plan must not overwrite confirmed items, removed suggestions or intentional exclusions. Verify PCC API, device, region and distribution eligibility before implementation.

## Phase 1 — frontend and design approval

Scaffold `mobile/`, tokens, icon wrapper, typed mock providers and navigation. Build setup, Today, checklist, Essentials, saved places, Connections, preference-memory review, and notification landing. Include empty/loading/error, ambiguous event, unavailable model, denied permissions, stale plan, repeated exits and tracker-loss demo scenarios. Prototype controls operate locally; fixtures visibly label all generated/observed data.

Acceptance: launch on the iPhone simulator and connected SE; complete the presentation journey; edit checklist, saved places and preferences; inspect long names, larger text, VoiceOver labels, Reduce Motion, keyboard and safe areas. Review real screenshots and interactive behavior. UI approval gates production integration.

## Phase 2 — persisted local intelligence vertical slice

Add local repository, explicit event input, calendar adapter, native AI bridge, availability reporting, schema validation, merging and approved memory. Port behavior from the SwiftUI reference where useful; do not claim its tests validate React Native. Read upcoming calendar events without writes and preserve manual event entry if access is unavailable. Regenerate only when relevant context changes, using cancellation and stale-result protection.

Acceptance: on a supported physical phone, enter a new event while offline and generate a real local plan, save it, relaunch and verify it. Regenerate after adding/removing/confirming/excluding items; all user choices survive. Confirm explicit preference approval affects a subsequent relevant plan. Test malformed, unavailable, cancelled and failed providers without production mock substitution.

## Phase 3 — phone-only departure automation

Persist places and monitoring configuration; implement location permissions and saved-region transitions, pre-departure local reminders and alert-policy service. No continuous inference or general-purpose constant GPS polling. Precompute/save plans when app context is available. Background events use stored plans and deterministic policy; fallback to approved everyday essentials if context is missing, clearly labeled.

Use episode states preparing → outside → acknowledged/closed. Starting parameters: one exit alert per episode, 10-minute repeat cooldown, 5-minute explicit snooze, 15-minute preparation lead time, and a persisted user-configurable saved-area radius initially 200 m. These are product/test starting values, not guarantees of location accuracy or delivery time. Debounce repeated events and validate a return before starting another exit episode. Every callback rechecks permission, automation pause, episode, expiry and current item evidence. Never reuse an expired plan as a known destination.

Acceptance: physical phone backgrounded/locked; leave a real saved area; verify one grouped alert containing only unresolved relevant essentials and deep-link to the episode. Confirm and intentionally exclude items; suppress repeat alerts. Measure latency rather than promise doorway detection. Test no-event fallback, returns/re-exits, permission revocation, expired context, reboot, force quit, Focus settings and offline behavior. Document unsupported OS lifecycle conditions explicitly.

## Phase 4 — targeted vision

Register reference photos, use foreground capture and appropriate local Vision/Core ML processing, and provide uncertain-result/manual correction. Photos remain local. No background camera monitoring. Recognition is an observation, not proof of packing.

Acceptance: positive match, similar object, occlusion, poor lighting, no match, denied camera and cancellation on actual hardware. Verify no observation automatically changes a manual confirmation to an unsupported claim.

## Phase 5 — optional Private Cloud Compute

Check account eligibility, request managed entitlement through the user's authorized developer workflow, and verify supported deployment/distribution. Do not imply Personal Team installation grants PCC. Implement opt-in provider and routing only after access is available.

Acceptance: demonstrate a genuinely complex itinerary refined through real PCC, identify execution source, preserve all user edits, test denial/network/model failure, and repeat the local core journey offline. Cloud enhancement must remain optional. Access is an external gate, not a reason to block earlier phases.

## Phase 6 — supported trackers

Select documented accessory and SDK, verify pairing/radio/background support on target hardware, and map a tracker to an essential. Do not assume arbitrary AirTag/Find My integration. Add unreachable/battery/radio-off states and sustained-separation policy; nearby or disconnected alone is not packed or left-at-home evidence.

Acceptance: real item separation versus temporary radio loss, duplicate suppression, return/reconnect and background behavior. Exact thresholds depend on measured accessory behavior; select them after hardware validation.

## Implementation gates and deadline

Start Phase 1 now; no further product clarification is required to scaffold the UI. Phase 2 physical AI acceptance needs a supported device. Phase 3 needs permission and background testing, including compatibility of chosen native location implementation. Phase 5 needs eligible PCC access. Phase 6 needs supported tracker hardware. Never replace a blocked acceptance test with a mocked success claim.

The supplied submission deadline is October 10, 2026, 10:00 AM Philippine Time. This full roadmap is not a promise to finish every phase before that deadline. If submission remains the goal, prioritize the polished presentation journey with actual local inference; disclose any remaining automation/vision/cloud/tracker gaps. Preserve the already working SwiftUI build while React Native migration is incomplete. Publication and submission remain separate user actions.

## Existing evidence and next action

Current SwiftUI app: manual persisted checklists, separate Demo Mode, model availability reporting, calendar preview, temporary camera capture and local notification test. Connections update built for simulator and signed phone, installed and launched on the SE; 13 selected test functions passed. Real phone permission/capture/delivery scenarios still need interaction tests. React Native Phase 1 now exists under `mobile/`, with interactive labeled mock screens and a separate phone build. See `REACT_NATIVE_PHASE1.md`. This earlier evidence predates the functional implementation described above; PCC and tracker integration remain unavailable.

Next action: validate the native functional workflow on hardware, starting with offline local inference on a compatible Apple Intelligence iPhone and a real locked/background saved-area exit. The SE can review UI and device-service fallbacks; it cannot establish supported Apple Intelligence hardware acceptance.

References: [Foundation Models](https://developer.apple.com/documentation/foundationmodels), [PCC eligibility](https://developer.apple.com/private-cloud-compute/), [PCC integration](https://developer.apple.com/documentation/foundationmodels/adding-server-side-intelligence-with-private-cloud-compute), [Apple Intelligence requirements](https://support.apple.com/121115), [Core Location](https://developer.apple.com/documentation/corelocation/monitoring-the-user-s-proximity-to-geographic-regions), [Expo native modules](https://docs.expo.dev/workflow/customizing/).
