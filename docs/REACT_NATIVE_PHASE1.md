# React Native Phase 1 — frontend implementation report

October 9, 2026, Asia/Manila. This report covers the new React Native frontend, not the historical SwiftUI phases 0–1. Phase 1 is implemented and ready for UI review. Production integrations remain gated by that review; remaining accessibility/device checks below are not claimed as completed.

## Implemented

- Separate `mobile/` app, Expo SDK 57.0.27 / React Native 0.86.3 / React 19.2.3 / TypeScript 6 / Expo Router. Minimum iOS 18; bundle `ph.depart.preview`, display name Depart Preview. Lockfile included. SwiftUI source and store remain untouched.
- Calm porcelain/teal UI, system San Francisco on iOS, bundled Solar Linear/Bold SVGs and attribution. Native stack/modal navigation, tab navigation, immediate pressed feedback and solid surfaces.
- Two-step saved-place/everyday-essentials setup; honest personal empty state; manual activity/destination input creates a checklist from personal essentials.
- Explicit, persistently labeled Demo Mode with the presentation scenario. Its checklist never becomes the personal plan. Temporary edits survive navigation and mode changes, but reset on full app restart.
- Checklist confirmation/unchecking, time of user confirmation, addition/removal, normalized duplicate rejection, intentional exclusion/reinclusion and distinct evidence copy. No “packed” claims.
- Essentials editing, saved-place add/edit/remove, preview reminder lead time, pause control, preference review → explicit approval → forget.
- Calendar, Camera, Notifications and Location under Connections with working simulated enable/disable and denied states. They do not request actual permissions. Existing live Connections remain in the separate SwiftUI reference.
- Grouped alert preview, exact active demo checklist navigation, duplicate-exit suppression, pause/all-resolved suppression, explicit simulated snooze and return. A new sample departure resets stale confirmations/exclusions without deleting items.
- Nine fixtures: presentation, empty, loading, error, ambiguous activity, model unavailable, denied connection, stale plan and tracker loss. All are UI examples; no provider failure or radio event actually occurs.

Unknown departure/event times stay unset. User preferences are stored as their approved text, not represented as automatic model training. No cloud service, login, telemetry or remote backend was introduced.

## Validation executed

| Check | Observed result |
|---|---|
| ESLint / TypeScript | Passed after final layout change |
| Reducer tests | 8 passed, 0 failures |
| Expo Doctor | 21/21 passed after scene configuration |
| Web production export | Passed; exported all routes |
| iPhone 17 Pro simulator | Debug build, installation, native render and interaction verified on iOS 27 |
| iPhone SE | Signed Release build, installation and CLI launch passed; native welcome screen captured; user confirmed demo/checklist scrolling and interaction |
| Browser interaction | Setup, personal plan, all tabs, checklist editing, exclusion, grouped alert, duplicate exit, snooze, Connections, preference approval/forget, saved-place creation/edit/removal and unavailable fallback inspected |
| Layout | 390×844 and 375×667 browser viewports; native simulator and actual SE welcome layout reviewed |
| Larger text | Simulator accessibility-extra-large rendered wrapped text; original large category restored |
| Accessibility labels | Native accessibility tree exposes item name/status/checked state, tabs and descriptive controls; setup checkbox states present |

Tests cover demo isolation, unresolved alert text, repeated-exit/pause policy, duplicate/blank items, preference approval, all-resolved suppression, personal context and fresh-episode reset. They validate mock frontend policy, not persistence or native background delivery.

The first native launch failed because SDK 57 defaults to the old app lifecycle when built against iOS 27. Fixed using supported `expo-build-properties` → `ios.enableSceneSupport: true`, then regenerated native files and verified launch. No hand-edited generated native workaround. [Expo guidance](https://github.com/expo/fyi/blob/main/ios-scene-lifecycle.md), [Apple scene requirement](https://developer.apple.com/documentation/uikit/transitioning-to-the-uikit-scene-based-life-cycle).

The first SE capture showed clipped tab labels. The final tab bar uses a 64-point content height plus bottom safe-area inset and corrected padding; a fresh physical-device capture verifies all three labels are visible. Native signing required user keychain approval. A separate bundle avoids replacing the SwiftUI app or its data.

Actual captures: [Today](screenshots/react-native-today.png), [larger text](screenshots/react-native-large-text.png), [physical SE](screenshots/react-native-iphone-se.png). The simulator Debug app may show Expo developer tools; Release omits them. Captures show real rendered UI, not AI-generated mockups.

## Remaining checks and boundaries

Full VoiceOver spoken navigation, largest accessibility text on the physical SE, software-keyboard traversal, Reduce Motion native transition behavior, and broader iPad/Android layouts still need dedicated review. The frontend has no custom animations and uses opaque surfaces, but that does not establish a completed assistive-technology audit.

`npm audit` on the stable SDK 57 template reported 29 dependency advisories (18 high, 11 moderate), largely inherited CLI/Metro/config dependency chains, including braces, node-forge, decode-uri-component and uuid. Compatible upstream patches were not established; automatic suggested fixes downgrade Expo/RN or move to a beta. No forced incompatible upgrade was applied. Resolve or reassess the relevant chains before production distribution; this preview is not production-release certification. Expo Doctor confirms compatibility, not security.

No React Native persistence, local inference, calendar access, camera capture/recognition, notification scheduling, location monitoring, PCC or tracker integration is complete. Restarting the preview intentionally resets data. Real integration tests from SwiftUI do not validate this React Native app.

## Next gate and Phase 2 handoff

Review Depart Preview on the SE: Today hierarchy, icon style, readability, checklist states, navigation, Connections and alert copy. Record any revisions, then explicit UI approval opens Phase 2.

Phase 2: local SQLite repository with migrations/failure UI and separate scopes; stable plan/item/episode IDs; native local AI bridge and actual availability; validated structured proposals; user-edit-preserving merge; approved preference rules; explicit event entry and read-only calendar context. Preserve the frontend UI contract while replacing mocks. Existing confirmations, removals and exclusions must survive regeneration for their episode.

Acceptance requires a compatible physical Apple Intelligence iPhone: offline generation for a new event, persisted result after relaunch, preserved user edits, and unavailable/failure behavior without mock substitution. The connected SE can validate frontend/manual fallback but cannot prove Apple Foundation Models inference. PCC and supported accessory access remain later external gates.

## Liquid-glass navigation follow-up

The user's later request replaces the solid bottom bar with floating Liquid Glass and a transparent navigation surround. Spring selection and subtle press feedback are implemented with Reanimated, with accessibility fallbacks. See `DESIGN.md` for executed validation, material behavior and recorded motion. This remains frontend work and does not connect production providers.

## Motion and Expo Blur follow-up — October 10, 2026

Floating navigation now has an interruptible stretching lens, glint and icon lift, quick tab fades, and native stack/modal transitions with reduced-motion alternatives. Buttons, navigable rows, and checklist state changes have subtle feedback. Expo Blur softens the top scroll edge while the Demo Mode label stays legible. TypeScript, lint, web export, simulator build/launch, and corrected signed Release build passed. Simulator tabs, checklist push, checking, and scrolling blur were verified. User chose simulator-only completion; installation on the locked SE and physical Release feel-check remain deferred. See TESTING.md and the [native motion recording](screenshots/navigation-motion-scroll-blur.mp4).

## Minimalist reference redesign

The latest user reference replaces the porcelain/teal visual treatment with gray canvas, a charcoal departure pass, compact white checklist sections and a dark floating dock with a white active lens. The pass includes functional Check/Plan/Places routes and an etched route motif. Existing restrained motion and Expo Blur remain. Final TypeScript, lint, web export and signed Release build passed; native simulator checks covered the checklist route and confirmation state. Larger-text overflow was corrected and captured; normal text size restored. User chose to finish with existing checks after the Mac locked. No physical installation or full VoiceOver/motion audit is claimed.

## Ticket and typography refinement

The departure panel now has a left-aligned dark ticket face, perforated divider, and light action strip. Bundled Roboto Slab replaces app text typography. A door control opens the welcome route without resetting preparation state; returning resumes the provider. No account authentication is implemented. Glass motion, native navigation, and Expo scroll blur remain. Simulator rendering and checklist confirmation were checked; the Mac locked before exit/resume verification. See TESTING.md for final build evidence and remaining checks.

## Functional follow-on, October 10

The user subsequently authorized steps 1–7. The mock-only gate is superseded. Read `FUNCTIONAL_ACCEPTANCE.md` for the actual native SQLite, AI, device service, saved-area policy and Vision implementation and the remaining physical acceptance gates. Original UI-only evidence remains historical.
