# Outie final redesign — implementation plan

Superseded for the core journey by [Simple Outie outing reminders](SIMPLE_OUTING_PLAN.md). The latest user direction removes mandatory daily activity/checklist use and adopts reminders for every outing with personal essentials, Calendar and weather context. Keep this document as the prior interview record; use the newer plan for implementation.

Finalized October 10, 2026, Asia/Manila, after the five-question interview. Ready to implement. This specifies upcoming work; it does not claim the redesign is already built. It refines the earlier roadmap for first use, navigation and automation setup. Existing physical acceptance limits remain in `FUNCTIONAL_ACCEPTANCE.md` and `TESTING.md`.

## Outcome

A first-time user or hackathon judge should understand that Outie prepares a checklist for the next activity and prompts them about unchecked essentials around leaving a saved area. Manual confirmation, camera observation and physical possession remain distinct. Phone-only monitoring does not establish that an object was forgotten.

## Accepted decisions

1. Welcome prioritises **Set up my routine**, with a secondary, clearly labelled **guided demo**. The demo entry needs no device permissions and remains separate from personal records.
2. Automatic departure alerts are offered during first setup through a skippable **Remind me when I leave** step, with **Do this later**. Saved GPS location, location permission and notifications belong to one guided flow. Skipping preserves manual checklist use; Home offers a clear way to finish alert setup.
3. The first activity uses a quick **What are you heading out for?** form, with Calendar as an optional shortcut. Date/time uses native controls instead of requiring an ISO string. Actual local suggestions are generated when the model is available; unavailable/manual states remain clearly identified.
4. Main navigation uses **Today · Essentials · Alerts · Settings**. Alerts owns saved places, setup readiness, pause/resume and reminder testing. Today provides a concise readiness summary and the next useful action; Settings retains app preferences and secondary connections.
5. Build a guided presentation demo targeting roughly **90 seconds**: fresh local suggestions when available → confirm one item → leave another unchecked → preview a clearly labelled simulated departure reminder. Model response time can extend the walkthrough.

## Findings from the current implementation

- Welcome presents several actions and feature descriptions before showing the workflow's result.
- The first setup saves a place name and everyday essentials, but no GPS coordinates. Completion can therefore leave automation unconfigured.
- Saved Places, foreground access, Always access and notification setup live in separate routes. Users can confuse enabled permissions with active monitoring.
- Some screens still describe implemented integrations as future work or a frontend preview.
- Activity time entry requires an ISO date string rather than a native date/time control.
- The Home departure board gives its strongest emphasis to an unavailable computed departure time; unresolved essentials and the useful next action appear lower down.
- Real local AI and fixture demonstration are distinct paths, but the opening experience does not make that distinction or benefit clear enough.

## Design foundations

Retain Outie's winking doorway identity, bundled Satoshi weight hierarchy, red accents, quiet gray canvas, charcoal feature surface, Solar icons, and restrained glass navigation. Focus the redesign on comprehension and task completion. Provide one primary action per step, clear back/skip/resume controls, native forms and transitions, 44-point controls, scalable layouts and existing accessibility material/motion fallbacks.

## Decision status

All five choices were accepted by the user. No product decision remains blocked on another interview answer. Implementation choices below resolve the details within those choices.

## Functional requirements to preserve

Persistent personal/demo separation, explicit save failures, actual OS permissions and model availability, validated local output, preservation of user-added/confirmed/excluded/removed items, typed monitoring setup state, cleanup when disconnected/paused, notification identity and stale-plan handling. AI and sensor/persistence work stay behind service interfaces. No new cloud, tracker or automatic object-presence claim.

## Welcome and personal setup

Keep **Head out. Less left behind.**, with a direct explanation: **A checklist for your next activity, with reminders for anything you haven't checked.** Show one compact, labelled example: “Client presentation → Company ID, laptop charger → reminder when leaving Home.” This illustrates the workflow; it is not live personal context.

Primary: **Set up my routine**. Secondary: **Try the 90-second demo**. Returning users get **Continue my preparation** as primary, with Edit my routine and the demo secondary. Do not hide entry actions below a long feature list or present several equal setup buttons. At standard SE text size, purpose and primary entry should be visible without scrolling; larger text can scroll without truncation.

```text
Welcome
  → Everyday essentials
  → First activity, or everyday preparation
  → Review checklist
  → Remind me when I leave, or Do this later
  → Ready summary → Today
```

**Everyday essentials:** selectable Keys, Phone, Wallet and useful presentation items, plus Add your own. Selections are approved routine choices, not confirmations. Empty selections can continue; manual additions or activity suggestions can fill the checklist.

**First activity:** short title, optional destination and a native date/time picker. Calendar is an optional shortcut, requesting read access only when used. No ISO-string typing. Allow skipping the activity and create an honest everyday checklist from explicitly selected essentials.

**Checklist review:** save the activity before requesting suggestions. If the local model is available, generate once for the saved context, show loading and reasons, and allow correction. Label local suggestions separately from user items. Unavailable, cancelled or failed generation preserves the manual checklist, with Add item and Retry where appropriate. No blank page or endless spinner.

**Departure alerts:** offer Start setup or Do this later, using the same guided flow as Alerts below. Skipping completes personal onboarding without claiming alerts are active.

**Ready summary:** report the actual result: checklist ready, suggestions added/manual checklist, and alerts active/skipped/needs attention. Enter Today with the next useful action.

Persist progress and drafts. Back, closing a sheet, termination and relaunch resume the journey. Each stage commits relevant values; failed saves must not advance navigation or clear forms. Cancelled GPS capture or denied access preserves prior saved coordinates. Calendar and Camera never block manual preparation.

## Screen ownership and daily use

| Screen | Purpose and main actions |
| --- | --- |
| Today | Activity/everyday preparation, known event time, unresolved essentials, **Review essentials**, and compact alert readiness with a direct remedy. |
| Essentials | Everyday items and reusable metadata; add/edit/remove and register photos through item details. |
| Alerts | Unified departure setup, saved GPS areas, active/paused/readiness state, pause/resume/disable, reminder lead time and explicit notification test. |
| Settings | Calendar/Camera connections, model availability, approved preferences, replay demo, app information and existing data management. |
| Activity sheet | Quick context form, native date/time, optional Calendar selection, save and generate. |
| Checklist | Check/uncheck, exclude, add/remove, reasons, regeneration and targeted camera review. |
| Guided demo | Isolated presentation story, output-source labels and simulated reminder. |

Location/Notifications have one authoritative configuration in Alerts. Existing Connections routes link into this flow rather than maintaining another automation switch. Normal app screens use current functional wording; remove stale “frontend preview”, “after UI approval” and “recognition planned” copy where integrations already exist. Describe current Vision comparison as user-reviewed, without a calibrated recognition promise.

Today keeps a compact charcoal board near the top. Prioritise activity and review action; replace the giant unset-departure value/repeated travel-unavailable copy with truthful compact event metadata. Do not invent a travel estimate or leave time. Show up to three unresolved items and a clear checklist link. With no plan, offer Plan an activity or Use everyday essentials. Alert setup/readiness is a quiet status with a next action, rather than a generic warning dominating Home.

The doorway remains the brand symbol. Move the preview-exit action to a clearly named welcome/demo action in Settings; no authentication exists, so it must not imply account sign-out. Retain glass-lens navigation feedback, press feedback, native transitions and restrained checklist motion. The four-tab dock must keep labels readable and targets at least 44 points, including on small phones and with larger text. Preserve all accessibility material/motion fallbacks.

## Alerts activation and readiness

```text
Remind me when I leave
  → Name a place
  → Use my current location → review captured area → save
  → Enable Notifications
  → Allow background location
  → Review → Start departure alerts
```

Request foreground location at GPS capture and Always/background access later for departure alerts, never on launch. Give each requirement its actual state and a specific next action. Return from system settings to the exact unfinished step. Users should not need to assemble setup across unrelated screens.

Persist explicit **alerts enabled/requested** intent separately from permission and connection flags. Granting permission, saving a place or opening a screen must not silently opt a new user into monitoring. Start persists intent and reconciles native registration; report Active only after registration succeeds and notification requirements are satisfied. On failure, show a specific remedy/Retry rather than a success message.

| State | Behavior and user action |
| --- | --- |
| Not configured / skipped | Manual checklist works; **Set up departure alerts**. No monitoring. |
| Setup incomplete | Identify missing GPS place, Notifications or background access; **Continue setup**. |
| Checking / starting | Query permissions/registration; do not display cached Active as verified. |
| Active | Saved areas registered and permissions ready; **Pause alerts**. Schedule preparation reminders only with a known event time and unresolved items. |
| Paused | Stop owned monitoring/reminders under the pause contract; retain configuration; **Resume alerts**. |
| Needs attention | Previously enabled but revoked permission, removed last GPS area or native failure; specific remedy, no false Active state. |
| Disabled | Explicit opt-out; stop owned registrations/reminders and suppress pending departure delivery; retain editable configuration. |
| Platform unavailable | Explain the manual fallback; no fake sensor success. |

Recheck after configuration changes and on app resume. Associate async results with the revision/context checked so old work cannot restore stale warnings or Active labels. Stop obsolete registrations when disabled, paused or missing prerequisites. Native callbacks and pending-alert delivery recheck intent, permissions, current place, plan identity/expiry and unresolved items. Keep existing known-entry, overlap, cooldown, duplicate suppression and stale-context everyday fallback policy.

The explicit **Send test reminder** requires actual notification permission and uses unresolved items from the current personal plan. It demonstrates notification delivery, not geofence detection. A notification tap opens its matching checklist; expired/deleted plans get a recoverable landing state.

## Guided judge story

1. **Understand:** a sample presentation shows the preparation/reminder loop in one sentence.
2. **Generate:** when available, call the real local provider on the demo event and validate fresh output. Show both **Sample event** and **Generated on this device**. Prewritten fixture items never become labelled AI output. When unavailable, explain that and offer a clearly labelled sample checklist.
3. **Check:** guide confirmation of one item while leaving another unchecked. Use actual returned items instead of depending on the model producing exact names. Approved sample everyday items may stabilise the story with their own source labels.
4. **Preview leaving:** show **Simulated departure** and an in-app reminder listing only unresolved demo items. No actual location trigger or OS notification is asserted or scheduled.
5. **Finish:** explain the result and offer Set up my routine, Return to my preparation when applicable, and Replay.

Use an isolated demo route/session. Generation, edits, replay and exit do not mutate personal plans, onboarding, permissions or alert settings. Do not stop personal monitoring merely because a user replays the demo. Production callbacks use persisted personal scope; simulated transitions never call production scheduling. Keep existing saved fixtures for regression scenarios outside the primary walkthrough.

Roughly 90 seconds is a walkthrough target, not staged AI timing. Show real loading/error/retry states. This demo does not establish physical offline inference or actual locked/background alert delivery.

## Data and service work

- Add versioned personal onboarding progress/drafts and separate explicit alert intent/configuration, using the existing local SQLite repository. No remote backend or login is needed.
- Migrate valid records without replacing user data. Preserve items, choices, photos, preferences, places and pause state. Preserve legacy alert intent only where the old Location flag plus valid GPS places imply configured monitoring; permission alone with no coordinates cannot become activation. Check OS readiness afterward. Legacy demo-only completion does not count as personal onboarding. Corrupt/future-version data remains an explicit error, never a silent reset.
- Derive readiness from saved intent/configuration plus fresh native results. Permission granted is not permanent truth.
- Persist activity source (manual/Calendar/demo), Calendar identity where available, and actual generation source/time. Keep formatted display text separate from stored dates.
- Keep inference, Calendar, location, notifications and camera behind adapters. Extend generation to the isolated demo session rather than weakening personal reducer safeguards.
- Preserve cancellation/stale-result protection and all user additions, confirmations, exclusions and removal markers during regeneration. New activities have distinct IDs and clear replacement behavior; multiple-plan history remains deferred.
- Route recovery/taps to the correct step/plan. Camera remains foreground; visual observation stays distinct from confirmation.

Primary touchpoints: data model/storage/repositories/provider; monitoring/device/background/automation/intelligence services; shared UI, departure board and glass dock; setup/activity/checklist screens and new Alerts/demo routes. Split setup, Alerts and demo into focused files instead of enlarging Screens.tsx.

## Implementation order

1. **Workflow foundation:** schema/migration, resumable setup state, explicit alert intent, readiness and background guards; focused state/migration/synchronization tests.
2. **First use:** welcome, essentials/activity/review/optional-alert journey, native time entry, save-before-navigation and permission recovery.
3. **Daily use:** four-tab navigation, Alerts, smaller useful Today board and consistent Settings/item actions.
4. **Judge demo:** isolated session, actual inference path, honest sample fallback and simulated reminder.
5. **Polish and verification:** native build/interactive persistence checks, small phone and accessibility review, physical acceptance where hardware permits; report simulator evidence separately.

The supplied deadline remains October 10, 2026, 10:00 AM Philippine Time. Prioritise this core journey before optional expansion. Publishing/submission is a separate user action.

## Acceptance checks

| Area | Required evidence |
| --- | --- |
| Understanding | A fresh tester explains Outie's purpose after welcome and finds setup/demo without assistance. Primary entry visible at standard SE text size. |
| Setup | Complete with/without alerts and Calendar; deny/cancel permissions; Back/relaunch resumes; failed saves do not advance; useful checklist exists at completion. |
| Migration | Existing scopes/items/photos/preferences/places preserved. No-GPS connection and demo-only completion do not become falsely active/complete. |
| Local AI | Provider invoked and source labelled accurately; unavailable/failure/cancel/stale states preserve checklist; regeneration preserves choices. Compatible physical offline inference remains a hardware gate. |
| Alerts | Permission alone cannot activate. Start/pause/resume/disable, revocation, last-place removal, native failure and stale async results yield correct state and cleanup. |
| Notifications | Real test delivery and warm/cold tap to matching plan; confirmed/excluded items omitted; disabled/paused/inactive plans suppressed. Physical background geofence delivery/latency tested separately. |
| Demo | Guided story targets about 90 seconds; context/inference/simulated-exit labels accurate; entry/replay/exit do not change personal data or alerts. |
| Accessibility | Four visible tab names, Dynamic Type/long text without overlap, VoiceOver roles/focus, reduced motion/transparency/contrast, keyboard/date-picker/permission return behavior. |
| Builds | Typecheck, lint, meaningful tests, Release build/launch, web fallback export, screenshots and updated TESTING.md. No simulator result represented as physical acceptance. |

## Scope and readiness

Ready to implement using the existing React Native/Expo/local-service stack. This covers frontend and local functions together. Defer cloud/PCC, trackers, background camera, automatic physical forgotten-item detection, travel-time calculation, multiple-plan history and unrelated integrations. Existing physical AI/geofence/Vision acceptance gates remain.

## Interview method

The installed grill-me skill requests a Skill/“grilling” tool unavailable in this session. The authorised direct-interview fallback was used: five focused choices, tradeoffs, recommendations and recorded answers. The user selected the recommended answer to each question.
