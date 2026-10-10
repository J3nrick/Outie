# Outie — simple contextual outing reminders

Revised October 10, 2026, Asia/Manila. This is the latest product direction and replaces the checklist-first journey and four-tab proposal in FINAL_REDESIGN_PLAN.md. The core flow is implemented in the React Native app. See the implementation evidence below; real physical departure delivery remains an acceptance gate.

## Latest policy update

The user subsequently requested unchecked-item departure alerts and restored item confirmation/location/time/acknowledgement controls. See UNCHECKED_REMINDERS.md; it supersedes the no-checklist/every-outing notification contract below. Existing data and native widgets are retained.

## Product promise

**When you head out, Outie reminds you what matters for today.**

One short reminder per detected outing combines the user's everyday essentials, relevant school/work routines, and grounded weather/calendar suggestions. Users do not need to create an activity, generate a plan manually, or maintain a daily checklist. Outie suggests what to bring; it cannot detect that an untracked belonging was physically left behind.

## Interview decisions

1. **Every outing**, including everyday essentials, rather than notifications only when new contextual advice exists. Suppress repeat signals for the same outing.
2. **My essentials + contextual AI extras**: a short initial routine setup, followed by local suggestions and optional corrections. No daily checklist requirement.
3. The user's account is a **free Personal Team**. Apple WeatherKit access is not established and is not part of this release.
4. **Use Open-Meteo now**, accurately attributed, for the noncommercial hackathon demo. Keep weather behind a replaceable provider so WeatherKit can follow after account/capability verification.

The installed grill-me skill says `Call the Skill tool with "grilling".` That tool is unavailable in this session. The root AGENTS.md direct-interview fallback was used for four focused questions, and all responses are recorded above.

## First use and daily use

```text
Welcome: Reminders for the things you forget when heading out
  → Save Home
  → Choose everyday essentials and optional school/work items
  → Connect Calendar (optional) and explain weather access
  → Enable notifications and background location
  → Preview an example reminder → Start reminders

Daily use: leave the saved Home area → one contextual reminder
```

Request permissions at their relevant steps, not on launch. Show the saved area before registering monitoring. GPS capture, notification access, and Always location access have distinct readiness states. Explicit Start reminders enables monitoring; merely granting a permission does not. Do this later leaves setup resumable and clearly marks reminders inactive.

Calendar is optional: reminders still include everyday essentials and available weather when access is denied. Weather access explains that forecast requests share coordinates with Open-Meteo, without sending calendar text or personal item names. No account or cloud language model is needed.

This release uses everyday-item chips, editable school/work/custom groups, and manual entry. Natural-language routine extraction with an approval step is a later convenience improvement. A reminder's suggestions never silently become permanent preferences.

Implemented navigation is **Today · My things · Settings**. Keep reminder configuration in Settings through a single guided flow, with a visible Pause control on Today. The separate Alerts tab, mandatory activity form, and mandatory checklist from the previous plan are removed from the core journey.

- **Today:** actual active/paused/needs-setup status; the next reminder preview; a short reason for contextual extras; context freshness; test reminder and Pause. Empty context still shows approved everyday items.
- **My things:** everyday, school, work, and custom routine groups; add/remove and optional preferences such as "I keep a charger at work" or "Don't suggest an umbrella." No required per-trip confirmations.
- **Settings:** Home, permissions/readiness, Calendar selection, weather source, actual local model availability, reminder preferences, and existing data management.

Retain Outie's doorway identity, Satoshi hierarchy, red accents, quiet gray surfaces, Solar icons, and restrained glass navigation. The main visual is one readable reminder preview, with native sheets and immediate press feedback. Avoid dashboard metrics, unknown departure-time heroes, extra connection cards, or decorative motion. Respect large text, VoiceOver, Reduce Motion, Reduce Transparency, and increased contrast.

## The reminder contract

Example with no event: "Heading out? Remember your keys and wallet. Rain is forecast near Home later today—bring an umbrella."

Example with a relevant event: "Heading out? Remember your keys and wallet. If you're heading to class, take your school ID and calculator. Rain is forecast—consider an umbrella."

Event proximity is context, not proof of destination. Use conditional wording unless the user explicitly selected the destination. Do not assert that a calendar title proves a specific required document or that an item is missing. Never say "You forgot your umbrella" from weather or location alone.

Group items into one concise notification, deduplicate shared items, and keep reasons available on tap. Long lists are summarized with a remaining count, opening the full reminder. Notification tap opens the corresponding persisted outing; expired outings show a clear history/expiry state rather than another unrelated plan.

Everyday items remain eligible even if an old checklist recorded them as checked. The new default reminder policy must not use existing unchecked-only scheduling as its gate. Optional corrections or "Not needed this outing" can affect this outing; lasting changes require explicit approval. Do not send an empty notification when the user has no applicable items.

## Local AI and context preparation

Use the existing Foundation Models bridge to interpret calendar events, match approved routine groups, propose bounded additional essentials, and produce concise grounded reasons. Apple Intelligence does not automatically read other apps: Outie supplies authorized context from the Calendar and weather adapters.

1. Read selected calendars with permission; select ongoing/upcoming plausible events, not every event that day. Start with a three-hour upcoming window as a configurable implementation default. Exclude cancelled and clearly remote events when sufficient metadata exists; unknown or ambiguous events do not become certain destinations. All-day events need distinct handling.
2. Fetch hourly rain probability/precipitation near Home for the remaining local day. Home weather is labelled as such, not as a destination forecast. Persist forecast location, fetch time, covered interval and provider. Support destination weather later only with verified coordinates.
3. Build a bounded local context from approved items/routines, relevant events, and validated weather facts. Validate structured AI output, source references and time validity. Calendar notes are untrusted input, never instructions to invoke tools or change configuration.
4. Store suggestions and their source/expiry before departure. Recompute when meaningful inputs change, when the app is opened, and during OS-granted background opportunities when supported. Background refresh and inference are best effort, not a guarantee of a fresh model run on every exit.
5. At departure, use persisted context and deterministic notification policy. Never require a network request or fresh language inference to finish before sending the reminder.

Rain is a factual forecast input, not a fact invented by the language model. This release uses a 50% hourly precipitation probability in the remaining-day forecast; this is a product default to validate, not an accuracy guarantee. An umbrella override wins over generated suggestions.

Fresh weather requires internet. Use a bounded cache (initially three hours, and only within the forecast's covered date/time). If unavailable or stale, omit unsupported weather advice, retain the user's essentials and valid event context, and show Weather unavailable/last updated in the app. Do not fabricate a sunny or rainy day. Stale calendar-derived AI extras also expire. After extended inactivity, reminders can fall back to approved routines; freshness is never promised solely because monitoring is active.

Local inference requires compatible Apple Intelligence hardware and actual runtime availability. The user's SE can exercise manual routines and reminders but is not evidence of real Apple Intelligence inference. An unavailable/failed provider uses clearly identified saved routines and deterministic weather rules, never sample output labelled as AI. No cloud AI fallback.

## Departure automation

Use the existing saved-region service with explicit persisted reminder intent, native readiness and an outing policy adapted to this direction. Home-area exit is approximate and may arrive after the doorway; do not promise instantaneous door detection.

- Require known Home entry, then a valid exit. One notification per outing, with a durable ID and duplicate suppression.
- Stable return establishes a new outing after a documented debounce. Brief boundary crossings should not spam. Test the existing cooldown against the every-outing promise rather than retaining it blindly.
- Recheck enabled/paused state, notification/background-location permission, region validity and context expiry in callbacks and pending delivery. Stop registrations and owned notifications when disabled.
- Persist episode/context before delivery; handle retries, stale async work, interruption and notification taps without changing personal preferences.
- Test force quit, reboot, Focus, denied/revoked access, offline operation and background latency on a physical phone. OS constraints remain explicit in the evidence report.

## Reuse and changes

Reuse SQLite, routine/preferences storage, the real Foundation Models module, Calendar adapter, monitoring/readiness service, notification routing, episode policy, and tested persistence infrastructure. Preserve personal records and the SwiftUI reference.

Add a WeatherProvider and timestamped cache; a context-preparation service; bounded routine/context suggestion validation; an outing-reminder snapshot; and a new notification policy independent of checklist confirmation state. Migrate existing everyday essentials/preferences and Home coordinates without losing them. Existing checks remain historical/manual data; they do not silently suppress the new reminders. Demo state remains isolated from personal monitoring.

The user subsequently authorized Home Screen/Lock Screen widgets and a Settings guide; see WIDGETS.md for the extension and validation. Camera scanning, trackers, travel calculations, multi-place automation and cloud AI remain outside the core milestone. Widgets display the same saved reminder policy. Keep existing reference functionality recoverable rather than deleting personal data or native source.

## Implementation order and acceptance

1. **Reminder foundation:** new context/outing types, explicit opt-in, migrations, every-outing policy, persistence and focused tests for duplicates, expiry, permission revocation and existing checked items.
2. **Context:** authorized Calendar selection, Open-Meteo/cache/attribution, local routine matching and real validated AI suggestions. Exercise rain/no-rain/stale/offline/ambiguous-event/model-unavailable cases.
3. **Simple UI:** short setup and three tabs, real readiness and reminder preview, editable routines, test notification and pause/resume. No activity entry or checklist required for normal use.
4. **Demonstration and hardware:** isolated rain + school story, labelled simulated exit, then separately verify actual physical Home exit and compatible-iPhone offline local inference with previously unseen calendar context. Fresh weather fetching itself is online; cached context supports the offline inference test.

Acceptance: a new user can set Home and essentials, opt into automation, close the app, and receive one relevant reminder per physically tested outing. Everyday essentials still appear without Calendar/AI/network; extras have valid grounded context; old checks do not suppress the reminder; repeated exit signals do not duplicate it; pause/disable and permission loss stop it; tap opens the correct saved outing. Verify persistence, save failure, accessibility, lint/typecheck/tests and native build/launch. Report simulator evidence separately from physical results.

The supplied deadline remains October 10, 2026, 10:00 AM Philippine Time. Prioritize the core reminder path; publishing and submission remain separate user actions. Publishing and submission were not performed.

## Implementation evidence — October 10

- Outing settings and snapshot v2 migration preserve legacy plans, checks, essentials, preferences and places. Existing installs select saved Home when possible but start with reminders **off**; setup requires a fresh explicit opt-in.
- Three tabs, a four-step resumable setup, a charcoal reminder preview, editable routines and suppression controls replace required activity creation/checking. Bundled Satoshi hierarchy, red accents, Solar icons, native glass dock and scroll-edge blur are retained. The permission-free demo uses isolated school/rain fixtures and labels simulation. Its AI button calls the actual native bridge, with a bounded wait and honest fallback.
- Optional read-only Calendar selection and Open-Meteo adapter prepare timestamped context. Rain policy uses the remaining local day, a 50% threshold and at most a three-hour cache. Closed/remote/all-day/cancelled events are excluded from the initial timed-event policy. AI semantically matches routine/event IDs and adds validated contextual items; successful unchanged-event output is reused. Everyday items remain independent of old checklist confirmations.
- Home geofencing requires known entry, suppresses duplicate exits, and uses a two-minute stable-return debounce for later outings. Notifications use persisted snapshots, expiry, explicit enablement, native permissions and durable outing identity. Pause/off stop owned geofences, background context registrations and queued production reminders. Tap opens the matching saved outing. Background refresh is registered via Expo BackgroundTask on real devices; iOS controls when it runs. It never gates departure notification generation.
- Foreground context refresh occurs on open/resume, relevant configuration changes, manual refresh and every 15 minutes while active. Background work checks intent/input identity before writing and discards expired task results. No model/weather call is required by the exit callback.
- Automated checks: TypeScript and lint passed; 36 tests passed, covering migration, snapshot/state invariants, rain/no-rain/stale/offline context, validated semantic matching, AI reuse, known-entry/duplicate policy, old checks, pause/disable and permission revocation. Real Open-Meteo sample-coordinate fetch returned 48 hourly entries and UTC+8 offset. Browser walkthrough at 375×667 verified demo fallback, simulated reminder, resumable setup and optional permissions.
- Native iPhone 17 Pro/iOS 27 Release build, install and launch passed. Its sample AI call completed through the real provider. Native setup and item selections survived termination/relaunch. Final screens and large-text checks are tracked in TESTING.md. Compatible physical iPhone offline inference, locked/background Home exit, notification tap, latency, force quit/reboot/Focus, permission revocation, spoken VoiceOver and injected native save failure remain to verify. No physical result is inferred from simulator compilation or tests.

## Technical sources

- [Apple WeatherKit](https://developer.apple.com/weatherkit/): Apple Weather data, Developer Program requirement and attribution.
- [Open-Meteo forecast API](https://open-meteo.com/en/docs) and [pricing/attribution](https://open-meteo.com/en/pricing): forecast fields, noncommercial open-access limits and attribution. Reassess the provider plan before commercial distribution.
- [Apple Foundation Models](https://developer.apple.com/documentation/foundationmodels): local model integration and availability.
- [Core Location region monitoring](https://developer.apple.com/documentation/corelocation/monitoring-the-user-s-proximity-to-geographic-regions): approximate saved-area transitions.
- Existing integration evidence and physical acceptance limitations: FUNCTIONAL_ACCEPTANCE.md and TESTING.md.
