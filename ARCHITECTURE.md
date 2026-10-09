# Architecture

## Responsibilities

`DepartApp` owns a bootstrap object. The bootstrap opens an `AppContainer`, which owns the local store, repository, model availability service, and observable preparation view model. Failure to open storage produces a retry screen, not an ephemeral replacement.

SwiftUI views render the view model and dispatch actions. They do not create database contexts, camera sessions, or model sessions. Today, Essentials, and Settings have native navigation stacks. Today and Essentials use explicit UUID paths, cleared on scope changes; destinations resolve only against the active scoped records so a previously opened demo checklist cannot remain visible in personal mode.

`PreparationViewModel` loads scoped plans and essential metadata, exposes actual model availability, and translates repository failures into actionable messages. Model state is observed by SwiftUI. The app refreshes saved records and model availability on becoming active.

`PreparationRepository` owns checklist operations, preference updates, scoped selection, and explicit demo creation. `LocalStore` owns the SwiftData container/context, disables autosave, saves mutations explicitly, and rolls back a failed mutation. Main-actor isolation keeps models and their context on one actor.

## Data flow

```text
User action
  -> SwiftUI view
  -> PreparationViewModel
  -> PreparationRepository
  -> LocalStore / SwiftData
  -> observed model state
  -> SwiftUI view
```

Model availability flows independently from `SystemLanguageModel.default.availability` through `ModelAvailabilityService` into Settings. No inference session exists yet.

## Models and boundaries

- `DeparturePlan` stores event snapshots, generation source, record scope, optional travel/departure values, and a cascade-owned checklist.
- `PreparationItem` stores source, order, required flag, optional essential identifier, and distinct verification status/timestamps.
- `CalendarEvent` stores a local event snapshot. Production EventKit fetching is a later integration.
- `RegisteredEssential` stores private reference paths and metadata. Demo objects contain metadata only and no photographs.
- `UserPreferences` stores Demo Mode and preparation settings.
- `EssentialVerification` and `CachedTravelEstimate` establish persistent domain records for later phases. This milestone does not fabricate their contents.

Stored raw values have typed enum accessors. A possible match does not count as checked. Manual toggling produces either manual confirmation or not-checked status, never a visual result. Removing a plan cascades through its checklist while leaving other scopes intact.

SwiftData uses a private local store with CloudKit explicitly disabled. The store directory is explicitly protected until first user authentication after boot. Physical-device locked-state behavior still requires device validation. Production data and demo records are separated by scope at every query boundary. Debug UI tests use a separate, UUID-named on-disk store and retain that store across test app relaunches.

## Extension points

Phase 2 adds a local inference provider and structured result validation outside views, followed by a merge that preserves user edits. EventKit, camera capture, visual matching, deterministic departure calculation, and notification coordination retain separate service/domain boundaries as specified in the master brief.
