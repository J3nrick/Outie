# Verification reports

## October 10, 2026 — final code cleanup

Removed unused Expo starter images/Icon Composer template, the source-reset scaffold command and three unused React imports. Enabled noUnusedLocals/noUnusedParameters for future checks. Removed starter files are backed up outside the repository at /tmp/outie-unused-starter-backup. Retained referenced Outie artwork, font licences, existing feature routes and the SwiftUI reference.

After cleanup: 52 tests passed with zero failures, strict TypeScript and Expo lint passed, web export passed, and the signed simulator Release build succeeded. Installed and launched the cleaned build; Today/My things/Settings navigation and a fresh native local-model sample call succeeded. Build warnings came from generated Hermes/Expo/Pods tooling; no application compilation errors were observed.

The independent video project lives in video/ and does not add dependencies to the mobile app. Removed the video starter’s optional lint/format dependency chain after npm reported an unpatched braces development-tool advisory; its subsequent dependency audit reports zero vulnerabilities. Strict video TypeScript checks passed. Six representative 1920 × 1080 frames were rendered and visually reviewed; Studio reports 1800 frames at 30 fps (60 seconds) and no current runtime error. The preview is caption-led without audio; an MP4 export has not been performed. Logs are /tmp/outie-submission-clean-tests.log, /tmp/outie-submission-clean-native.log and /tmp/outie-submission-clean-web.log.

## October 10, 2026 — notification identity cache refresh

The shipping iOS AppIcon was inspected directly: it contains the red Outie doorway asset and the built plist registers AppIcon as its primary icon. The earlier green DEPART Preview notification identity was an OS cache artifact after upgrading the same bundle. Restarted only the iPhone 17 Pro simulator, without uninstalling the app or clearing data. A fresh real OS test banner visibly showed the red Outie doorway logo with Outie · test reminder and the current unchecked Keys/Wallet. Typecheck and Expo lint passed. No rebuild or source change was necessary. Physical-device notification branding was not checked.

## October 10, 2026 — unchecked reminders and retained item evidence (0.5.0)

Implemented [current item-check policy](docs/UNCHECKED_REMINDERS.md), last confirmation/recorded-location details, matching-outing acknowledgement, multiple selected watched places and unchecked widget projections. This supersedes the earlier every-outing/no-checklist suppression policy below.

| Check actually executed | Result |
|---|---|
| TypeScript / Expo lint | Passed, no errors or warnings |
| Automated state/persistence/context/widget/error tests | **52 passed, 0 failed**; includes 10 new check/evidence/exit/migration tests and native error presentation |
| Signed simulator Release build and install | Passed; Outie 0.5.0 and embedded widget extension, existing data retained |
| Native check and persistence | Keys checked / Wallet unchecked; actual terminate/install/relaunch retained state and timestamp |
| Native notification scheduling/delivery | Actual OS test alert contained only Wallet, excluded Keys, and tapped through to the matching saved reminder |
| Acknowledgement | Got it became Acknowledged; Wallet remained unchecked; final build also showed new test history immediately without resuming the app |
| All checked | Native UI showed every item confirmed; Send a test reminder returned No test alert sent, without changing the latest notification record |
| Reset checks | Start a new outing restored unchecked Keys/Wallet while retaining Keys' last confirmation time |
| Widget regression | Native Lock Screen count updated to 1 unchecked item; unit cases cover all-checked presentation and 12-hour expiry fallback; prior small/medium placement evidence below remains applicable |
| Browser check/evidence | Recorded-place and checkbox state survived reload; all-checked presentation and reset retained historical evidence |
| Browser navigation/demo/guide | Three tabs, missing-item recovery, item details, both widget guide branches and all three demo steps passed; demo confirmation excluded sample Keys without changing personal essentials |
| Large text | Actual simulator accessibility-large layout inspected; text wraps, screen scrolls to the bottom, dock remains usable; original large size restored |
| Native location adapter | Explicitly simulated phone coordinates captured for a temporary saved place; removed after the test |
| Saved-area monitoring | **Blocked by simulator:** native GeofencingUnavailable / circular-region availability false. UI gives a short actionable message and never claims monitoring active. Actual exit delivery remains unverified. |
| Physical phone | Not changed; preserved the user's simulator-only verification preference |

Audit fixes: raw native geofencing stack messages, nested web buttons, missing return destinations for item/Places flows, and newly scheduled test history not refreshing until app resume. No test fixture is described as AI output or a real departure. Temporary place/browser essential were removed; simulated GPS cleared; reminders off. Labelled test history and genuine historical evidence remain retained.

### Final feature inventory and remaining gates

- Navigation, checks, details, save/reload, demo separation, acknowledgement, notification-tap routing and widget projection have the executed evidence above.
- Calendar selection, foreground camera/Vision review, Open-Meteo fetch/expiry and native local inference retain their existing integration/tests and prior results. This audit does **not** establish real Calendar event selection, actual-object camera comparison or compatible-phone offline inference. Native Settings reports actual model availability; a fresh isolated sample call in the final 0.5.0 build returned Local suggestions prepared on this device. The sample Calendar/weather remain simulated. Browser fallback is explicit.
- Automatic region exit policy has unchecked/all-checked, known-entry, overlap, return, duplicate, pause/disabled and stale-context coverage. Locked/background physical exits, permission revocation, force quit/reboot, Focus and OS latency still need hardware acceptance.
- Accessibility checkbox labels/states were observed. The new Today screen was also inspected at accessibility-large; spoken VoiceOver, full new-flow Reduce Motion/Transparency and physical widget placement remain dedicated checks.
- Persistence corruption/migration checks pass; injected native disk-write failure is still an open acceptance gate. No tracker or cloud AI provider was enabled.

Logs: `/tmp/outie-unchecked-final-tests.log`, `/tmp/outie-unchecked-web.log`, `/tmp/outie-unchecked-reviewed-release.log`. Captures: `docs/screenshots/outie-unchecked-notification.png`, `docs/screenshots/outie-acknowledged-test.png`, `docs/screenshots/outie-unchecked-large-text.png`.

Next: install 0.5.0 on an unlocked physical iPhone, verify a selected saved-area known entry → exit with one unchecked item, then all checked, return/reset, acknowledgement, pause/off and permission revocation. Use an Apple Intelligence-compatible iPhone for separate offline inference acceptance; the SE tests the essentials fallback.

## October 10, 2026 — Home Screen and Lock Screen widgets

Implemented [Outie widgets](docs/WIDGETS.md) and Settings → Add Outie widgets in version 0.4.0. The existing reminder flow, personal records and SwiftUI reference remain intact.

| Check actually executed | Result |
|---|---|
| TypeScript / Expo lint | Passed, no errors or warnings |
| State/context/widget tests | 41 passed, 0 failed; 5 new widget projection/privacy/timeline cases |
| Browser export and guide | Passed; both Home Screen and Lock Screen guide branches rendered |
| Native simulator Release build | Passed with the embedded `ExpoWidgetsTarget.appex` |
| Simulator App Group | Confirmed `group.ph.depart.preview` container; both targets use matching simulated entitlements |
| Home Screen small widget | Added through the real system gallery; title and separate item rows render saved Keys/Wallet |
| Home Screen medium widget | Resized through the real context menu; saved items, total count, preparation time and Reminders off render correctly |
| Widget update | Added a temporary Widget test item in My things; widget reflected the extra item, then returned to the original essentials after removal |
| Lock Screen rectangular widget | Added through the system picker, saved and visually verified; displays Before you go / 2 things to remember without item names or event details |
| Widget taps | Both Home Screen and Lock Screen taps opened Today |
| Native guide | Settings entry, both instruction sets, actual publication time and refresh control observed; shared timeline readback verified by the service |
| Signed iPhone SE / iOS 27.0.1 build | Passed using the existing Personal Team; widget/App Group provisioning succeeded |
| Physical phone installation | Updated `ph.depart.preview` installed; existing app data retained |
| Physical launch / widget placement | **Not verified:** phone was locked and iOS denied launch. User selected “Finish with simulator verification for now.” No further physical launch or placement attempted. |

The first unsigned simulator build rendered blank widgets because no App Group container was assigned; the extension log reported “client is not entitled.” Rebuilding with simulator signing enabled and local identity `-` generated the simulated App Group entitlements, and the container and actual rendering were then verified. Do not use `CODE_SIGNING_ALLOWED=NO` when validating shared-data widgets in this simulator setup.

The Lock Screen customization overlay initially drew inconsistently in Device Hub. It recovered during native navigation; the widget was then saved, visually verified on the actual Lock Screen, and tapped successfully. Circular/inline variants are registered and compiled; the rectangular variant was the Lock Screen configuration exercised.

Logs: `/tmp/outie-widget-tests-final.log`, `/tmp/outie-widget-web.log`, `/tmp/outie-widget-simulator-polish.log`, `/tmp/outie-widget-phone-final.log`. Captures: `docs/screenshots/outie-home-widget.png`, `outie-home-widget-medium.png`, `outie-lock-widget.png`.

Next: on the SE, unlock and open Outie once, then follow Settings → Add Outie widgets. Verify physical placement, taps, light/dark/tinted modes, large text, VoiceOver and actual OS refresh/expiry while the app is closed. Native widget expiry is a supplied timeline; unit tests establish the correct future entries, not a guarantee of exact OS refresh time. Real Home-exit and compatible-phone offline inference acceptance remain separate from widget validation.

## October 10, 2026 — simple outing reminder release

Active scope: [SIMPLE_OUTING_PLAN.md](docs/SIMPLE_OUTING_PLAN.md). This supersedes the checklist-first main journey; historical reference evidence below remains intact.

| Check actually executed | Result |
|---|---|
| TypeScript / Expo lint | Passed, zero lint errors or warnings |
| State, persistence, context and monitoring tests | 36 passed, 0 failed |
| Web static export | Passed, `build/outie-outing-web` |
| Open-Meteo real request | Sample coordinates only; valid 48-hour probability/precipitation arrays, UTC+8 |
| Native iPhone 17 Pro / iOS 27 Release build | Passed, including the new guided Foundation Models interpretation bridge and Expo BackgroundTask |
| Simulator install and standalone launch | Passed, bundle `ph.depart.preview`; app data preserved |
| Native guided AI example | Real native model call returned validated structured output and “Local suggestions prepared on this device”; Calendar/weather inputs and departure remain explicitly simulated |
| Native setup persistence | Selected Keys/Wallet, terminated and relaunched; Continue setup reopened step 2 with both selected |
| Browser workflow at 375×667 | Welcome, all three demo steps, model-unavailable fallback, all four setup steps, skip activation, Today/My things/Settings navigation; setup and test-item persistence survived reload. Temporary browser test item removed. |
| Larger text | Actual simulator `accessibility-large` layout inspected; content wraps and scrolls. Glass material changed to regular with a light tint for navigation contrast over dark cards. Original `large` setting restored after checking. |

The iPhone simulator was deliberately left with Home unset and reminders disabled. Permission access and physical Home coordinates were not silently configured. Sample demo data does not enter personal records. Native Today → My things → Settings navigation passed, with actual model-ready status. Native accessibility labels/checkbox states were observed; spoken VoiceOver and full reduced-motion/transparency interaction testing were not repeated for this redesign.

New implementation: `mobile/src/data/outing.ts`, snapshot v2 migration/reducer, `services/outing-policy.ts`, `outing-context.ts`, `context-runtime.ts`, `weather.ts`, updated native/device/background monitoring, `screens/OutingScreens.tsx`, `OutingDemo.tsx`, and the native `interpretOuting` bridge. Background refresh is registered on real devices when reminders are explicitly enabled, but OS execution was **not** tested on hardware. Geofence exits use saved context without waiting for inference/network. An unchanged event reuses valid successful AI output.

Logs: `/tmp/outie-outing-tests-final.log`, `/tmp/outie-outing-web-final.log`, `/tmp/outie-outing-release.log`, `/tmp/outie-outing-release-final.log`. Native captures: `docs/screenshots/outie-simple-demo.png`, `outie-simple-today.png`, and `outie-simple-large-text.png`.

Next acceptance: compatible physical iPhone, a previously unseen Calendar event, cached weather and disabled internet for actual local inference; then locked/background Home exits, stable return/new outing, duplicate suppression, notification-tap routing, pause/off and permission revocation. Also test reboot/force quit/Focus, OS latency, calendar changes and native save failures. Simulator success is not physical automation evidence. The SE can exercise the saved-essentials fallback; it does not establish Apple Intelligence support.

## October 10, 2026 — compact simulator window

Switched the booted iPhone 17 Pro (iOS 27.0) from Device Hub's management layout to its compact phone window using **Open in New Window**. Verified native DEPART Today → Essentials → Today navigation and visually confirmed the compact window. Left it open for user testing. This was a simulator presentation change; no source changes or new build were required.

React Native frontend validation is recorded in [the Phase 1 report](docs/REACT_NATIVE_PHASE1.md). The SwiftUI evidence below applies to the preserved reference app only.

## SwiftUI phases 0–1

Executed October 9, 2026 (Asia/Manila) with Xcode 27.0, Swift 6.4, and iOS 27.0 SDKs. The app targets iOS 26.0.

## Final results

| Check | Result |
|---|---|
| Simulator Debug build and launch | Passed |
| Repository/state tests | 9 Swift Testing functions passed, including a four-case parameterized status test |
| UI acceptance tests | 3 XCTest UI tests passed |
| Final result bundle | `build/Phase01Complete.xcresult`: Passed, 12 test functions, 15 invocations, 0 failures, 0 skips, no reported runtime warnings |
| Unsigned physical iOS SDK Release build | Passed; compilation only, not device installation |
| Whitespace/diff check | `git diff --check` passed |

Final simulator run: iPhone 18 Pro, iOS 27.0 (24A434), arm64, identifier `A596E342-2D3C-4706-8429-996A6B815561`. The final acceptance run finished at approximately 8:15 PM Philippine Time.

## Behaviors verified

Repository tests cover an initially empty personal/demo state, explicit demo creation, all four manual-toggle input statuses, edit preservation when toggling Demo Mode, reopening a disk-backed store, personal/demo isolation, blank/overlong-name rejection, cascade deletion, failed-transaction rollback, and excluding expired plans from next-departure selection.

UI tests launch with separate UUID-named on-disk stores. They exercise all three tabs; manual checking and unchecking; adding an item; disabling an empty save action; swipe removal; multiple terminate/relaunch cycles; preservation of confirmations, additions, removals, and the arrival buffer; hiding demo records in personal mode; and the real model-availability refresh action.

The large-text UI test uses a DEBUG-only Dynamic Type override to accessibility size 3. It confirms a long custom item can wrap, scroll into view, and be manually checked. Item controls expose specific names and distinct status/source values through the accessibility hierarchy. Live spoken VoiceOver navigation was not performed.

Reduce Motion, Reduce Transparency, and darker system colors were enabled in the test simulator. A small UIKit probe independently reported all three flags as `true` before the final acceptance run. This uses actual system accessibility signals, rather than fabricating writable SwiftUI environment values. Temporary simulator preference changes were restored after verification.

Seven real simulator captures are saved in `docs/screenshots`, including normal and demo Today, manual checking, large text and a long item, and actual model availability. Visual review confirmed the anchored primary action, wrapping, evidence labels, and native navigation.

## Commands

```sh
xcodebuild -project Depart.xcodeproj -scheme Depart \
  -destination 'platform=iOS Simulator,id=A596E342-2D3C-4706-8429-996A6B815561' \
  -derivedDataPath build/DerivedData \
  -resultBundlePath build/Phase01Complete.xcresult \
  -parallel-testing-enabled NO CODE_SIGNING_ALLOWED=NO test

xcrun xcresulttool get test-results summary --path build/Phase01Complete.xcresult

xcodebuild -project Depart.xcodeproj -scheme Depart -configuration Release \
  -destination 'generic/platform=iOS' \
  -derivedDataPath build/DeviceDerivedData CODE_SIGNING_ALLOWED=NO build

git diff --check
```

Use your own installed simulator identifier and a new result-bundle path when rerunning. Xcode does not overwrite an existing result bundle.

## Issues found and resolved

- Restricted host access initially blocked CoreSimulator and Swift macro expansion; builds ran with normal host access.
- Compilation exposed a SwiftUI environment-key error, incorrect section syntax, a throwing expression, Swift Testing macro error handling, and XCTest initializer isolation. These were corrected before final verification.
- Checklist accessibility was initially exposed as a nested container. Controls now retain button semantics with explicit status values.
- Navigation paths explicitly clear on record-scope or active-plan changes, and destinations resolve against current scoped records.
- Screenshot review revealed the primary action below the first viewport. It now stays above the tab bar using a safe-area inset.
- UI automation was corrected to target the actual switch thumb, stable Stepper identifiers/values, and unobscured tap locations at large text sizes.

The build emits Xcode's informational App Intents metadata warning because this app has no App Intents dependency. No Swift compile warnings remain in the final application build. Earlier failed runs and their diagnostic artifacts are not the final acceptance evidence; use the named final result bundle.

## Not yet verified

- Physical phone model/OS, signing, installation, runtime model availability, or locked-state data protection.
- Real AI checklist generation, provider error handling, regeneration merging, or novel-event inference with internet disabled.
- Actual EventKit data and permission handling, camera/reference images, visual similarity, departure calculations, or notification delivery.
- Running on an actual iOS 26 device/runtime; iOS 26 API compatibility is enforced by deployment-target compilation, while execution used the installed iOS 27 simulator.

These are later-phase or hardware acceptance requirements. This report makes no production-readiness or physical-camera claim.

## Connections follow-up validation

Simulator build succeeded. `build/Connections.xcresult` reports 13 selected test functions passed, 16 invocations including parameterized repository cases, zero failures and zero runtime warnings. Selected suite: all DepartTests (existing persistence regression checks plus 3 permission-state tests) and the new Connections navigation UI test. Existing 3 UI tests were not repeated. The new UI test visits Calendar, Camera and Notifications without requesting access. Exported real simulator screenshots are under `docs/screenshots/connections-*.png`; Calendar layout visually reviewed.

Signed Debug build for the connected iPhone SE (iOS 27.0) succeeded and the update installed. Actual granted calendar reads, camera capture/cancellation, notification delivery, and denied/revoked permission refresh still require physical interaction and are not claimed as tested. Native notification tests require leaving the app or locking the phone; Focus may silence alerts. No recognition, plan import, or automatic departure reminder is implemented.

## React Native motion and scroll-blur refinement — October 10, 2026

- SDK-compatible Expo Blur installed; CocoaPods installation passed.
- TypeScript and ESLint passed after the native easing correction.
- Web export passed; browser preview verified tab selection and scroll behavior.
- iPhone 17 Pro simulator Debug build, installation, and launch passed. Interactive checks covered all tabs, native checklist push, manual checking, and deeper scrolling with the blur edge visible. A native-only Reanimated easing error was found and fixed before the final Release rebuild.
- Screenshot: `docs/screenshots/expo-scroll-blur.png`. Native recording: `docs/screenshots/navigation-motion-scroll-blur.mp4`.
- Reduce Motion/Transparency are implemented; system preference toggles and full VoiceOver testing were not repeated in this pass. Android was not device-tested. No measured frame-rate claim.
- Physical iPhone SE installation initially blocked because the phone is locked and its developer disk image cannot mount. User was asked to unlock it. Do not treat this as physical validation of the new motion.

- Corrected signed Release rebuild passed using generic iOS destination. User selected “Finish with the simulator for now”; physical installation and Release interaction feel-check are deferred.

## Minimalist reference redesign — October 10, 2026

- TypeScript, ESLint, web export, and signed generic-iOS Release build passed (`/tmp/depart-minimal-release.log`).
- Existing simulator development build renders the updated components with Expo Blur and native dark glass linked.
- Departure-pass Check action opened the native checklist; unchecking a confirmed item updated the count and Today pending list correctly.
- Physical installation remains deferred as requested. No new native dependencies were introduced in this redesign.
- Accessibility-extra-large simulator check exposed header/dock overflow. The header now stacks, the dock widens and wraps labels, and the departure title uses a smaller display style while preserving system font scaling. The corrected large-text screenshot confirms readable wrapping; default text size was restored. Full VoiceOver/audio and physical-device motion were not re-tested.
- Final corrected signed Release build and web export passed (`/tmp/depart-minimal-release-final.log`, `/tmp/depart-minimal-web-final.log`).

## Ticket card, door exit, and Roboto Slab — October 10, 2026

- Final TypeScript, ESLint, and web export passed (`/tmp/depart-slab-web-final.log`). Signed generic-iOS Release build passed (`/tmp/depart-slab-release-final.log`); this does not prove physical installation.
- Bundled Regular/SemiBold/Bold faces rendered in the existing native iPhone 17 Pro simulator development build. The departure ticket, door control, and app typography were visually inspected; checking Company ID removed it from Today’s unresolved list.
- A stray JSX whitespace string in the header caused a native Text warning. It was removed; the refreshed accessibility tree and screenshot no longer contain the warning.
- Accessibility-extra-large inspection exposed awkward broken dock labels. Dock labels now cap scaling at 1.6× while content retains full scaling. A corrected screenshot shows readable tab names. Normal text size was restored. Full VoiceOver, reduced-motion toggles, and lower-page large-text scrolling were not repeated.
- Evidence: `docs/screenshots/slab-ticket-today.png` and `docs/screenshots/slab-ticket-large-text.png`.
- The Mac locked before the door exit/resume round trip could be verified. Source inspection confirms both handlers navigate without dispatching state resets, but runtime verification remains pending. No phone installation was attempted; the user’s simulator-only preference remains in effect.
- Next: review this UI, verify exit/resume and full accessibility on an unlocked simulator/device, then proceed with the approved functional-integration phase.

## Minimalist departure board follow-up — October 10, 2026

- TypeScript, ESLint, and web export passed (`/tmp/depart-minimal-board-web.log`).
- Existing native iPhone 17 Pro simulator development build rendered the revised charcoal board, subtle doorway detail, and outlined actions; screenshot: `docs/screenshots/minimal-departure-board.png`. No new native dependencies or Release rebuild in this visual-only pass.
- Door exit opened welcome; “Return to my preparation” restored Today with the previous confirmation preserved. This resolves the prior exit/resume runtime-check limitation.
- Large-text and full VoiceOver/motion settings were not re-tested in this pass. Physical installation remains deferred by user preference.

## Local Satoshi font — October 10, 2026

- Bundled the user's unmodified static Regular, Medium, and Bold TTF files with their supplied license. Removed the unused Roboto Slab dependency.
- TypeScript, ESLint, and web export passed (`/tmp/depart-satoshi-web.log`).
- Reloaded Codex browser preview and visually verified the presentation dashboard and navigation text in Satoshi. Relaunched the existing native iPhone 17 Pro simulator development app and verified Satoshi rendering on welcome and Today. Screenshot: `docs/screenshots/satoshi-today.png`.
- No new native dependency, physical installation, or Release rebuild in this font-only update. Existing Dynamic Type and accessibility fallbacks remain; full accessibility testing was not repeated.

## Satoshi weight hierarchy follow-up

TypeScript and ESLint passed. Codex browser visual inspection confirmed bold heading/event/departure/section text, medium controls, regular supporting text, and bold active-tab text. No font or native dependency changes; no full accessibility or physical-device test repeated.

## React Native functional workflow — October 10, 2026

- Actual native Debug simulator build/launch succeeded, including the autolinked DepartIntelligence Swift module (Foundation Models and Vision).
- Browser persistence observed across reload; native SQLite manual checklist state observed after termination/relaunch. Personal/demo round-trip and corrupt-snapshot rejection tests pass.
- Actual simulator Foundation Models request generated suggestions for a previously unprocessed workshop event. A second request preserved confirmed Laptop and omitted the removed Notebook. This was actual inference, not fixture output. Compatible physical offline inference remains untested.
- Native notification permission and real OS banner observed, containing only unresolved Presentation materials. `docs/screenshots/local-notification.png`. Notification tap expired before interaction; deep-link handling exists but cold/warm tap behavior is not marked passed.
- `npm run typecheck`, `npm run lint`, and 17 focused tests pass. Web export succeeds.
- Camera comparison/capture, Calendar event selection, permission denial/revocation, locked/background real geofence delivery, VoiceOver audio, and full accessibility regression remain hardware/manual gates.
- Tracker support remains unavailable by explicit user choice (no accessory selected). Cloud provider remains unavailable without verified access.

Updated native Release simulator build succeeded (`/tmp/depart-functional-release.log`), installed on the iPhone 17 Pro simulator, and launched. It embeds the JS bundle and does not require Metro.

## Glass navigation refinement — October 10

TypeScript, lint, web export and incremental Release simulator build passed. Updated Release installed and launched on iPhone 17 Pro simulator. Today → Essentials → Settings → Today navigation and selected accessibility states were observed in both browser and native Release app. Native glass refraction over underlying content is visible; browser uses backdrop blur. Screenshots: `docs/screenshots/glass-navbar-web.png` and `docs/screenshots/glass-navbar-ios.png`. Reduced motion/transparency branches remain implemented; new physical performance and accessibility preference toggling were not tested in this pass.

Red text accents: browser Today and Settings visually verified after replacing green action/nav text and departure-board accent text with contrast-conscious red tones. Neutral text colors remain unchanged. Screenshot: `docs/screenshots/red-text-accents.png`. Native binary not rebuilt for this color-only pass.

Red controls: remaining teal icon/status/navigation tints and green icon backgrounds replaced with shared red accents. Enabled switches use red tracks with white knobs (including RN Web's separate activeThumbColor); disabled tracks stay gray. Settings browser screenshot verified: `docs/screenshots/red-icons-switches.png`. TypeScript and lint pass. Native binary not rebuilt in this color-only pass.

## Updated iPhone SE Release — October 10

The user requested a new phone installation, superseding the simulator-only preference for this run. Latest red accents/icons/switches and glass navigation compiled in a signed Release build, installed through devicectl, and launched successfully on the connected iPhone SE (iOS 27.0.1). Device Hub visually showed the app's Settings screen with red icons and navigation. Screenshot: `docs/screenshots/iphone-se-red-release.png`; build log: `/tmp/depart-red-phone-build.log`. This establishes installation and visible launch, not physical AI/geofence/camera acceptance or measured animation performance.

Build recovery: removed regenerable DEPART simulator build caches to free disk space, retained source and test evidence. Added `mobile/plugins/with-local-notifications.cjs` to remove Expo's unused APNs entitlement after other transforms, allowing Personal Team signing for the local-notification app. Prebuild and CocoaPods succeeded; regenerated entitlements were verified without aps-environment; lint passed.

## Home notice and top blur polish — October 10

- Removed navigator-level error banners that overlapped the status bar. Connection notices now live within Today and Settings scroll content; save failures remain visible within screen content. Repeated leading `Error:` prefixes are normalized, with a focused regression test.
- TypeScript, ESLint, and all 18 tests passed. Release simulator build succeeded (`/tmp/depart-home-polish-build.log`), installed and launched on the iPhone 17 Pro iOS 27 simulator in Device Hub.
- Native inspection confirmed an unobstructed status bar, clear Home header, inline location notice, and working “Review location access” navigation to the Location connection page. No permissions were changed or geofence behavior claimed fixed.
- Top Expo blur now uses a thinner, lighter material, is absent at rest, and fades in between 8 and 56 points of scroll. The static resting appearance was observed; automated Device Hub scrolling did not move the viewport reliably, so the new scrolling fade remains a manual runtime check.
- Accessibility-large text wraps in the header and notice. Content extends below the floating dock and requires scrolling; lower-page interaction at that size, VoiceOver audio, and accessibility preference toggles were not verified. Original standard text size was restored.
- Evidence: `docs/screenshots/home-notice-polish.png` and `docs/screenshots/home-notice-large-text.png`. No physical-phone installation in this pass.

## Location connected without a GPS place — October 10

The user's warning was reproduced: Location was connected with system access allowed, but Saved Places contained zero records. Connecting permission alone cannot define a monitored area. Missing coordinates and background permission now return typed setup states instead of generic exceptions. Region synchronization stops obsolete registrations when disconnected, paused, in demo, missing the last valid place, or lacking background access. Real native failures still surface. Provider results belong to the state they checked, preventing obsolete errors from appearing after newer edits.

TypeScript, ESLint, and all 24 tests passed. Six new tests cover no-GPS setup, persisted coordinates and idempotent registration, disabling/pause/demo/removal cleanup, revoked background access, invalid coordinates, the region limit and native registration errors. These use a driver test double; they do not prove OS geofence delivery.

Release simulator build passed (`/tmp/depart-location-setup-build.log`), installed and launched in Device Hub on iPhone 17 Pro. Observed the specific Home setup notice, direct link to Saved Places, zero-place empty state, separate “Access allowed” / “Monitoring not active” labels, and disabled background-enable control before coordinates exist. Disconnecting Location removed the notice from Settings and Home; reconnecting restored the appropriate setup notice. Original connected preference was restored; no place, GPS coordinate or system permission was changed during these checks.

Evidence: `docs/screenshots/location-setup-home.png`, `docs/screenshots/location-monitoring-setup.png`. Saving actual coordinates and background exit delivery remain manual/hardware checks. No physical-phone update in this pass.

## Outie icon and display name — October 10

Generated an original ivory winking-doorway mascot on red using the built-in imagegen tool, with the user's icon collage as style direction. Preserved the source image; prepared and verified the shipping 1024 × 1024 opaque PNG. Expo uses it for the launcher, favicon and welcome artwork. Display name and human-facing React Native brand/permission copy now use Outie. Native project regenerated through Expo, followed by successful CocoaPods installation; the local intelligence bridge and local-only notification entitlement configuration were retained.

Final TypeScript and ESLint checks passed. Release build succeeded (`/tmp/outie-icon-final-build.log`), installed and launched on the existing iPhone 17 Pro simulator in Device Hub. The original personal workshop plan and unresolved item appeared after upgrade. The simulator Home Screen visibly showed the new Outie name and icon at actual launcher size. Welcome inspection exposed missing top safe-area padding on the standalone route; corrected it and rebuilt. Final screenshot confirms the wordmark below the status bar and readable mascot/tagline. No physical installation, Android build, full accessibility regression or new AI/geofence acceptance in this identity pass.

Evidence: `docs/screenshots/outie-home-screen.png` and `docs/screenshots/outie-welcome.png`. [Brand specification, asset paths and generation prompt](docs/OUTIE_BRAND.md). Existing data/bundle identity remains unchanged. The app is left on welcome for review, with Return to my preparation available.

Final web export also passed after the safe-area correction (`/tmp/outie-web-export-final.log`).
