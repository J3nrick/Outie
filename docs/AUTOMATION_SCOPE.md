# DEPART — proactive departure assistant

**Current behavior (0.5.0):** [Unchecked reminders and item evidence](UNCHECKED_REMINDERS.md) supersedes conflicting earlier policy below. Current-outing confirmations filter exit alerts; all checked suppresses delivery. Selected saved areas, historical confirmation/recorded-location details and matching-reminder acknowledgement are implemented. See TESTING.md for 52-test/native notification evidence and the simulator geofencing limitation. Earlier design/roadmap sections remain historical.

Revised October 9, 2026, Asia/Manila. The user selected both phone-only preparation alerts and later tracker-assisted separation detection. This is a scope/design revision; none of the new automation is represented as implemented.

## Product promise

DEPART prepares for the user's next activity and prompts them about unresolved essentials before or around leaving a saved place. Later, supported item trackers provide additional evidence of possible separation. The product must distinguish a predicted need from an observed physical signal.

## Primary journey

1. User sets up Home or another saved departure place, essential belongings, optional calendar access, location monitoring, and notification preferences. Explain each permission at its point of use; monitoring can be paused.
2. AI interprets upcoming events and user-approved routines to generate a structured preparation plan with relevant items and reasons. Ambiguous context requests a brief clarification; unsupported inferences remain uncertain.
3. DEPART schedules a preparation reminder before a known event and persists the plan. User checks an item once; confirmation belongs to this departure, not every future trip.
4. An OS location signal indicates the phone exited a saved area. The alert policy evaluates the latest valid stored plan and unresolved important items. It does not depend on fresh language inference completing during background execution.
5. Send one concise local alert per departure episode: “Heading to your presentation? Your company ID and charger haven’t been checked.” Actions: open check, confirm, intentionally leave behind, or snooze. Group items instead of sending one alert each.
6. Later, a supported paired item tracker produces a sustained separation signal. Wording: “Possible separation from your keys. Check whether you have them.” Disconnection alone does not prove an item stayed at the saved place.
7. Explicit user feedback updates preferences. No response is not evidence of forgetting or carrying an item.

Unknown destinations get a user-approved everyday set. Do not invent a destination based only on region exit. Leaving a saved area is an approximate phone-location event, not doorway detection. Handle returns/re-exits with debounce, episode IDs, cooldowns, and explicit acknowledgement.

## Meaningful AI responsibilities

- Interpret event titles, locations, notes and explicit context into activity and preparation needs.
- Merge user preferences and corrections while preserving user additions, intentional exclusions, and confirmations.
- Extract categories and reusable preferences from explicit user statements such as “I keep a charger at the office”; request confirmation before applying a lasting rule.
- Explain relevance with grounded reasons and flag ambiguity. Do not let a model invent required documents or object presence.
- Optional camera analysis uses appropriate vision models to recognize/compare visible items, with uncertain and not-observed states. A language model and a camera preview alone are not item recognition.

AI proposes structured plans. Deterministic code validates data, enforces scopes, applies evidence rules, computes timing, handles permissions, and suppresses duplicate alerts. Use AI where it contributes context understanding; avoid continuously running inference or delegating factual sensor judgments to it.

## Evidence contract

Track need, evidence, and timestamp separately. Need: required by user, suggested by AI, optional. Evidence: not checked, manually confirmed, visually observed, tracker nearby, possible separation, intentionally excluded. Old observations expire at an explicit episode boundary or configured freshness limit. A visual observation does not mean packed; nearby tracker does not mean packed; no image match does not mean missing; no radio connection does not mean left behind.

## UI-first design

Keep React Native, San Francisco through the iOS system font, bundled Solar icons, and existing porcelain/teal tokens. Preserve the SwiftUI build as a working reference.

Today becomes the current departure context: destination/activity, time if known, unresolved essentials, and why suggested. Use “No planned departure” for absence of context. Essentials owns item metadata and later tracker association. Settings includes Connections (Calendar, Camera, Notifications, Location), saved places, automation pause, reminder timing and notification preferences. A brief setup flow creates the first place and everyday essentials. A notification opens the precise departure episode rather than a generic dashboard.

Frontend fixtures must visibly label simulated departures, generated plans, tracker signals and vision results. Provide no-plan, unknown destination, permission denied, location unavailable, model unavailable, stale-plan, no-events and intentional-exclusion states.

## Delivery sequence and acceptance

A. React Native interactive frontend: build setup, saved-place editing, Today departure flow, essentials, Connections, and notification-response screens using clearly labeled fixtures. Approve the UI before connecting production adapters.
B. Real local AI: implement a native provider, typed output validation, persisted contextual plans, explicit preference merging, and a model-unavailable/manual fallback. Prove novel-event offline generation on supported physical hardware. Existing SE can test UI but does not meet Apple Intelligence hardware requirements.
C. Automatic phone-only alerts: implement location permission flow and saved-region monitoring, precompute plans, schedule pre-departure reminders, and route region-exit checks through deterministic evidence policy. Persist monitoring configuration and episode history. Test on physical devices before promising timing or reliability.
D. Vision: registered essentials, targeted capture and genuine local recognition/comparison, uncertain-result handling, observation freshness and no false claim of packing.
E. Tracker support: select a documented compatible accessory/SDK, pair and associate an item, and test foreground/background signal behavior on actual hardware. Do not assume access to arbitrary AirTags, Find My locations, or every Bluetooth accessory. Verify hardware capabilities before choosing UWB. Implement missing-battery/radio-off/unreachable states before separation alerts.

Phone-only acceptance: after setup, create a previously unprocessed event; prove actual local AI, persist output, confirm one essential and exclude another, background/lock phone, exit the saved region, and verify one grouped alert for remaining unresolved essentials. Repeat in Airplane Mode with required radios appropriate to the tested feature. Measure observed location-to-alert latency; never advertise instantaneous delivery. Test return/re-exit, all-items-resolved, no planned event, denied/revoked permissions, reboot, force quit, model unavailable, stale context, notification Focus settings, and disconnected calendar. Document behavior that iOS does not guarantee.

Tracker acceptance: demonstrate separation with a specific supported tagged item and separately demonstrate temporary radio loss. Suppress duplicate alerts and keep the distinction between possible separation and proven location. Record actual hardware/SDK and background limitations.

## Current implementation boundary

The app still ships SwiftUI with persistent manual checklists and Demo Mode. Connections supports a calendar event preview, temporary camera capture and a user-requested notification test. It has no real AI generation, location monitoring, automatic departure alerts, visual recognition or tracker integration. React Native has not been scaffolded.

This expanded product scope replaces the original deferral of geofencing. Given the supplied October 10, 2026, 10:00 AM Philippine Time deadline, prioritize one demonstrated local-AI preparation workflow; treat background departure behavior as an additional measured milestone and tracker support as later work. A simulated departure can demonstrate UI only, never background capability.

## Technical grounding

[Core Location monitoring](https://developer.apple.com/documentation/corelocation/monitoring-the-user-s-proximity-to-geographic-regions) supports region transitions; delivery is subject to OS heuristics and permission/lifecycle constraints. [Location notification triggers](https://developer.apple.com/documentation/usernotifications/unlocationnotificationtrigger) use boundary-crossing heuristics. [Background task scheduling](https://developer.apple.com/documentation/backgroundtasks/choosing-background-strategies-for-your-app) is controlled by the system, so inference must not be a prerequisite for time-sensitive alerts. [Foundation Models](https://developer.apple.com/documentation/foundationmodels) provides language inference subject to availability. [Apple Intelligence requirements](https://support.apple.com/121115) exclude the connected SE. [Vision](https://developer.apple.com/documentation/vision) analyzes images, not unseen contents of bags. [Nearby Interaction](https://developer.apple.com/documentation/nearbyinteraction) supports specific compatible hardware and has explicit background accessory requirements.
