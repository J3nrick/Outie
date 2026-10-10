# DEPART

The active React Native app is now named **Outie**, with an original winking-doorway icon and the line “Head out. Less left behind.” See the [brand direction](docs/OUTIE_BRAND.md) and [current mobile app](mobile/README.md). The DEPART name below remains the original brief and SwiftUI reference identity.

**Never Leave Unprepared.**

A native, privacy-first iPhone preparation assistant for people who know where they are going but forget what to bring. The first milestone builds the application foundation around a professional preparing for a client presentation.

## Current application

Outie reminds users about unchecked things when their phone leaves a selected saved area. Everyday essentials combine with relevant Calendar routines and rain advice. Users save their things and places, explicitly enable notifications/background location, and confirm items before leaving. Last confirmation and recorded location stay available in item details; Got it dismisses one reminder. Checks reset for a new outing or known return and expire after 12 hours. [Current check and evidence policy](docs/UNCHECKED_REMINDERS.md).

The active app is in `mobile/`: React Native 0.86.3, Expo 57, TypeScript, Expo Router, native SQLite persistence, bundled Satoshi typography and Solar icons. Apple Foundation Models runs locally on compatible devices. Open-Meteo supplies optional weather after consent; unavailable context falls back to saved essentials. Existing plans and the SwiftUI reference remain preserved.

Home Screen and Lock Screen widgets are now included, with a guide under Settings → Add Outie widgets. [Widget implementation and validation](docs/WIDGETS.md).

Read [the current scope and evidence](docs/SIMPLE_OUTING_PLAN.md), [functional acceptance](docs/FUNCTIONAL_ACCEPTANCE.md) and [run instructions](mobile/README.md). Physical background departure and compatible-device inference acceptance are still required.

```sh
cd mobile
npm start
npm run ios
```

## Completed reference milestone: SwiftUI phases 0–1

- Native SwiftUI Today, Essentials, and Settings navigation.
- Contextual checklist with manual confirmation, unchecking, adding, and removal.
- SwiftData persistence for plans, checklist items, preferences, event snapshots, and essential metadata.
- Explicit Demo Mode with a sample presentation and example belongings, isolated from personal records.
- Actual Foundation Models availability checks, including unsupported devices, disabled Apple Intelligence, and a model that is not ready.
- Native Dynamic Type, accessible item labels and status values, and reduced-motion-aware press feedback.

The reference milestone originally excluded integrations. The Connections follow-up now adds real Calendar permission and event preview, Camera permission and temporary photo capture, and Notifications permission and an explicit test alert. It does not generate AI recommendations, compare photos, calculate departure times, or schedule automatic departure reminders. Manual checking never creates a visual verification result.

## SwiftUI reference — build and run

Requires macOS with Xcode 26 or later and an iOS 26+ SDK. This implementation was built with Xcode 27.0 and Swift 6.4 against the iOS 27.0 SDK, targeting iOS 26.0. There are no external package dependencies.

1. Open `Depart.xcodeproj` in Xcode.
2. Choose the shared **Depart** scheme and an iPhone simulator.
3. Run. Normal mode begins with an empty preparation state.
4. Tap **Explore Demo Mode**, or enable **Demo Mode** in Settings.
5. Open **Check My Essentials**. Tap an item to confirm/uncheck it, use **Add item**, and swipe an item to reveal **Remove**.

For a physical phone, select your own Apple development team in Signing & Capabilities and use an available bundle identifier. No signing credentials are stored in the repository. The preview config contains the local developer team identifier; use your own team for another account. Device signing, installation, camera behavior, and actual offline inference must be validated separately.

```sh
xcodebuild -project Depart.xcodeproj -scheme Depart \
  -destination 'generic/platform=iOS Simulator' \
  -derivedDataPath build/DerivedData CODE_SIGNING_ALLOWED=NO build

xcrun simctl list devices available
xcodebuild -project Depart.xcodeproj -scheme Depart \
  -destination 'platform=iOS Simulator,name=iPhone 18 Pro' \
  -derivedDataPath build/DerivedData \
  -parallel-testing-enabled NO CODE_SIGNING_ALLOWED=NO test
```

Use an installed simulator name or identifier from your machine. CoreSimulator and Swift macro compilation need normal Xcode host access; a restricted execution sandbox may block them.

## Data and privacy

Plans remain in the app's private, local SwiftData store. Demo and personal records carry separate scope values, and all feature queries filter by the active scope. Demo Mode defaults to off. Disabling it preserves the demo checklist without displaying it as personal data.

Connections requests camera, calendar, or notification permission only after an explicit Enable action. Calendar preview reads up to 20 events over 7 days without modifying them. Camera previews are temporary and discarded on exit; notification tests are scheduled only when explicitly requested. No cloud services, network clients, or analytics are included. A storage failure shows a retry state; it never replaces your data with an in-memory store.

## Offline foundation check

Enable Demo Mode, edit a checklist, disable internet, terminate and reopen the app, and verify your edits remain. This demonstrates local checklist persistence only. A previously unprocessed event producing real on-device AI output in Airplane Mode is the Phase 2 acceptance test; see `docs/NEXT_PHASE.md`.

## Project guidance

Actual simulator captures: [Today](docs/screenshots/today-demo.png), [Checklist](docs/screenshots/checklist-manual.png), [Large text](docs/screenshots/checklist-long-item-large-text.png), and [Model availability](docs/screenshots/settings-model-status.png). These are rendered app screens, not design mockups or evidence of AI inference.

- `AGENTS.md`: required design/Swift skills and interview fallback.
- `docs/MASTER_BRIEF.md`: original supplied brief.
- `docs/DESIGN.md`: approved interview decisions and visual system.
- `docs/ENVIRONMENT.md`: observed environment and remaining hardware checks.
- `docs/PHASE_REPORT.md`: completed behavior, verification, blockers, and the phase 2 handoff.
- `ARCHITECTURE.md`, `LOCAL_AI.md`, `TESTING.md`, `DISCLOSURES.md`: implementation boundaries and evidence.

The supplied hackathon deadline is **October 10, 2026, 10:00 AM Philippine Time**. This repository has not been published or submitted.

## Latest product scope

[Simple outing reminders](docs/SIMPLE_OUTING_PLAN.md) is the active implemented scope. The app combines everyday items, optional Calendar routines and validated Open-Meteo context into one reminder per detected Home outing, with local Apple AI for contextual suggestions. Simulator build/launch and sample AI inference passed; real background departure delivery and compatible physical-device offline inference remain acceptance gates. Historical checklist/scanning functionality and personal records are preserved.
