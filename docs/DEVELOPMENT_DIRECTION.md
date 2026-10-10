# Updated development direction — October 9, 2026

**Current behavior (0.5.0):** [Unchecked reminders and item evidence](UNCHECKED_REMINDERS.md) supersedes conflicting earlier policy below. Current-outing confirmations filter exit alerts; all checked suppresses delivery. Selected saved areas, historical confirmation/recorded-location details and matching-reminder acknowledgement are implemented. See TESTING.md for 52-test/native notification evidence and the simulator geofencing limitation. Earlier design/roadmap sections remain historical.

## Latest user direction — October 10, 2026

Use [Simple Outie outing reminders](SIMPLE_OUTING_PLAN.md) for upcoming product changes. The user selected reminders for every outing, their essentials plus contextual local-AI suggestions, and Open-Meteo weather for the noncommercial demo. Daily activity entry and checklist maintenance are no longer the primary workflow. This replaces the previous checklist-first redesign; earlier evidence below remains historical, and existing physical acceptance gates still apply.

## Current evidence

The repository contains a functional SwiftUI reference app with Today, Essentials, Settings, contextual checklist editing, isolated Demo Mode, SwiftData persistence, and actual model availability reporting. Twelve test functions passed; simulator build/launch and unsigned device-SDK Release compilation succeeded. These results apply only to SwiftUI. React Native Phase 1 is now implemented under `mobile/`; current frontend evidence is in `REACT_NATIVE_PHASE1.md`. The later Connections update was signed, installed and launched on the connected SE; actual AI inference remains unverified.

## Approved change

- Target UI stack: React Native.
- Typography: San Francisco through the iOS system font; do not bundle Apple's font files. Other platforms use their system font unless separately approved.
- Custom icons: Solar via Iconify, bundled locally for offline rendering. Proposed treatment: Linear for ordinary controls, Bold for selected tabs. Include Solar/480 Design CC BY 4.0 attribution.
- Build interactive frontend screens with mock data first. Keep fixture/demo labeling visible and distinguish simulated AI/scan results from real integrations.
- Preserve the approved porcelain/teal palette, departure-first hierarchy, one-tap checking, and accessibility requirements.
- Preserve existing SwiftUI code and verification as a reference during migration.

## Proposed implementation stack

React Native + TypeScript + Expo, Expo Router for navigation, and react-native-svg for bundled Solar SVG paths. Use an Expo development build when adding custom Swift modules for Foundation Models or Vision. Exact compatible dependency versions must be verified when scaffolding. Expo SDK 57 is installed with React Native 0.86.3; the lockfile records the compatible stack.

Use typed fixture objects behind a preparation data interface. Keep prototype state local and resettable. Do not add a remote backend simply for mock data. Future local intelligence, persistence, calendar, scanning, and reminders can replace adapters after UI approval.

## Revised delivery order

1. Frontend foundation: scaffold React Native, port tokens, typography, icon wrapper, tabs, and mock-data interface. Validate launch on the iPhone 17 Pro simulator.
2. UI completion: Today, contextual checklist, Essentials, Settings; add/remove/check interactions; empty, loading, error, long-content and simulated unavailable states. Review large text, VoiceOver labels, motion settings, keyboard behavior, and safe areas.
3. UI approval: review the complete interactive presentation journey and approve screen layouts, copy, icon style, and state behavior. Acceptance means frontend completion, not production persistence or AI completion.
4. Functional integrations: implement local persistence and real on-device AI, followed by calendar, registration/scanning, departure calculations and reminders. Revalidate persistence and user-edit preservation in the React Native implementation; SwiftUI tests do not prove it works.

The immediate next step is UI review of the installed Depart Preview with labeled presentation fixtures. AI implementation no longer comes immediately after the original SwiftUI phases 0–1.

## Simulator guidance correction

Xcode 27 includes `/Applications/Xcode.app/Contents/Applications/DeviceHub.app`. Its presence was verified locally. Apple documents simulator management through Xcode → Open Developer Tool → Device Hub. The absence of the older Simulator.app path alone does not establish a broken Xcode installation.

The iPhone 17 Pro instance (iOS 27.0) was created and booted; DEPART installed and launched via simctl. UUID: 1523E7BD-3450-4D04-AC42-2DFA020AED4F. The Device Hub window and running React Native preview have now been visually verified.

Open Xcode, choose Open Developer Tool → Device Hub, select the existing iPhone 17 Pro and open its simulator display. Alternatively launch Device Hub directly:

```sh
open /Applications/Xcode.app/Contents/Applications/DeviceHub.app
```

If Device Hub fails, quit/reopen Xcode and Device Hub, inspect Xcode Settings → Components for installation errors, and confirm the active developer directory. iOS 27 runtime is already installed and booting; do not erase simulator data or reinstall Xcode as the first troubleshooting step. Only repair/reinstall Xcode if its installed components actually fail.

Sources: [Apple Device Hub](https://developer.apple.com/documentation/xcode/managing-your-simulated-and-physical-devices-in-device-hub), [Apple components](https://developer.apple.com/documentation/xcode/downloading-and-installing-additional-xcode-components), [Expo native code](https://docs.expo.dev/workflow/customizing/), [Expo fonts](https://docs.expo.dev/develop/user-interface/fonts/), [Apple fonts](https://developer.apple.com/documentation/technologyoverviews/fonts), [Solar icons](https://icon-sets.iconify.design/solar/).

## User-requested Connections follow-up

The subsequent explicit request adds live Connections controls to the installed SwiftUI reference app ahead of the React Native migration. This is a scoped exception to UI-first mock data: Calendar event preview, Camera temporary capture preview, and local notification test. It does not implement plan generation, recognition, or automatic reminders. React Native remains the target stack for migration.

## Latest product scope

The user selected a proactive departure assistant: phone-only contextual reminders first, supported tracker-assisted separation later. See `AUTOMATION_SCOPE.md`. React Native and UI-first delivery remain the target direction. New automation is scoped, not implemented.

## Final roadmap

`IMPLEMENTATION_PLAN.md` is now the active implementation roadmap, including optional PCC, data contracts, acceptance criteria and hardware/account gates. Earlier milestone descriptions remain reference history.
