# Phase 0–1 implementation report

The following records the completed SwiftUI reference milestone. The latest user direction is React Native with mock-data UI first; its implementation is pending. `DEVELOPMENT_DIRECTION.md` supersedes the immediate next-step order below.

## Phase 0 — environment validation

Implemented the dependency-free iOS 26+ SwiftUI project, shared app/test scheme, actual Foundation Models availability service, and environment report. Simulator build/launch and an unsigned physical-SDK Release build succeeded.

Hardware limitation: no physical iPhone is connected. Signing/install and phone-specific model readiness remain pending; see `ENVIRONMENT.md`. The user reports a compatible iPhone on iOS 26+.

## Phase 1 — core application foundation

Implemented the application bootstrap/dependency container, observable feature view model, local repository and explicit SwiftData saves, the brief's seven core persistent models, typed source/status accessors, and the approved calm daylight design system.

Today, Essentials, and Settings use native navigation. The contextual checklist supports manual confirmation/unchecking, validated custom items, and removal. Demo Mode is explicit, visibly labeled, persisted, and isolated from personal records. Scope and active-plan changes clear stale navigation. Unknown departure values remain visibly unset.

The main checklist action stays above the tab bar. Labels distinguish manual and visual evidence; checking never implies packing. Actual model availability is shown separately from inference functionality. Storage errors do not reset or replace saved data.

## Files and validation

Source is grouped under `Depart/App`, `Core`, `Persistence`, `Intelligence`, `Features`, and `DesignSystem`; the native project is `Depart.xcodeproj`. The required skill workflow is in root `AGENTS.md`, with the original brief and accepted interview decisions under `docs`.

`DepartTests` and `DepartUITests` verify persistence, checklist transitions, isolation, navigation, preferences, accessible labels, and large text. Final result: 9 repository test functions and 3 UI test functions passed, including four parameterized status cases; no failures. See `../TESTING.md` for commands, limitations, and screenshot evidence.

## Next — Phase 2

Connect the demo iPhone and validate signing and model readiness, then implement real structured local preparation generation behind a service boundary. Validate output, merge preferences, preserve user edits, and prove novel-event inference in Airplane Mode. Detailed handoff: `NEXT_PHASE.md`.

Phases 2 onward have not been represented as completed functionality. EventKit follows in Phase 3, registration/Vision in phases 4–5, and departure/reminders in Phase 6.

## Connections follow-up

Implemented real permission/status controls under Settings → Connections in the existing SwiftUI app. Calendar reads a bounded upcoming-event preview without writes or plan import. Camera opens native photo capture with temporary in-memory preview and discard. Notifications requests alert/sound authorization and schedules/cancels an explicit 15-second local test. Revoked access refreshes when returning to the app. Permissions are requested only by explicit Enable actions. Usage descriptions added for Calendar and Camera; no Photos or microphone access requested.

Simulator and signed-device builds succeeded, 13 selected test functions passed, and the signed update installed on the iPhone SE. End-to-end physical permission/capture/delivery validation is pending; see TESTING.md. React Native migration remains pending.
