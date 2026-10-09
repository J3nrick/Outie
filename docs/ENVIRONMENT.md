# Environment validation — October 9, 2026

## Active React Native release — October 10

Outie 0.3.0 uses Expo 57 / React Native 0.86.3 / TypeScript / Expo Router with SQLite, bundled Satoshi and a local Swift Foundation Models bridge. It targets iOS 18+; local Apple inference is runtime-gated to iOS 26+ and actual model availability. The SwiftUI deployment target and dependency-free evidence below apply only to the preserved reference app.

Observed host: Xcode 27.0 (27A266a), Apple Swift 6.4, installed iOS/simulator SDK 27.0. The new Release build compiled for iPhone 17 Pro, iOS 27.0, UUID `1523E7BD-3450-4D04-AC42-2DFA020AED4F`; installed and launched unsigned in Device Hub. A real native local-model call with sample outing context completed successfully in this simulator. No physical inference or background exit claim follows from it.

The user reports a free Personal Team. Open-Meteo is the approved weather source; WeatherKit and Private Cloud Compute are not configured. A live sample-coordinate forecast request returned validated hourly data. Expo BackgroundTask was installed through `expo install`, generated its processing mode/permitted identifier, and compiled; actual iOS background scheduling requires separate physical testing. Existing app data and the SwiftUI reference were retained.

## Observed

| Check | Result |
|---|---|
| Initial repository | Empty working tree, no existing application or commits |
| Xcode | 27.0, build 27A266a |
| Swift compiler | Apple Swift 6.4, swiftlang-6.4.0.34.1 |
| Installed iOS/device and simulator SDK | 27.0 |
| App deployment target | iOS 26.0 |
| Dependencies | Native Apple frameworks only; no external packages |
| Selected simulator | iPhone 18 Pro, iOS 27.0, A596E342-2D3C-4706-8429-996A6B815561 |
| Simulator model availability | Settings displayed “Model available” using the real Foundation Models availability API |
| Connected physical iPhone | Initially none; follow-up detected a paired, wired iPhone XS on iOS 18.6 with Developer Mode enabled |

Installed simulators also include iPhone 18 Pro Max, iPhone 17e, iPhone Air, iPhone 17, and multiple iPads on iOS 27.0. Their availability is inventory evidence, not a claim they were tested.

`SystemLanguageModel.default` and its availability states are present in the actual SDK interface and available from iOS 26.0. The SDK also contains separate Private Cloud Compute APIs; DEPART does not use them.

Initial sandboxed compilation was blocked by CoreSimulator and Swift macro-server access. Builds and simulator tests ran with normal host access after escalation. The completed source uses Swift 6 mode, main-actor default isolation, approachable concurrency, and strict concurrency checking.

## Physical device gate

The user reports an Apple Intelligence-capable iPhone on iOS 26+. Its exact model and runtime state have not been independently verified. Before claiming device validation:

1. Connect and trust the actual phone, confirm its model/iOS version and Developer Mode.
2. Select the user's development team and an available bundle identifier, then sign, install, and launch.
3. Open Settings → On-device intelligence and record the actual availability result. Enable Apple Intelligence and complete initial model setup if needed.
4. Run Phase 2's novel-event Airplane Mode inference acceptance test after the provider exists.
5. Use an actual camera for registration/verification tests in phases 4–5. Simulator screenshots are not camera evidence.

A successful unsigned physical-SDK build establishes compilation only. Signing, installation, physical-device model availability, locked-state file protection, camera processing, and actual offline inference remain unverified.

## Phase status

The simulator project/build/launch foundation is implemented. Phase 1 is subject to the verification results in `TESTING.md`. Phase 0's physical-device checks remain pending hardware connection; they do not block the implemented simulator foundation.

## Device Hub and iPhone 17 Pro follow-up

October 10, 2026 compact-window setup: the installed Xcode contains DeviceHub.app and no separate Simulator.app in its developer applications. Selected iPhone 17 Pro (iOS 27.0, `1523E7BD-3450-4D04-AC42-2DFA020AED4F`) and clicked **Open in New Window** (help: **Switch to compact window**). This opens the standalone phone-shaped window matching the user's reference, with no device-list sidebar. **Show in Device Hub** expands it again. Verified native DEPART navigation from Today to Essentials and back in this compact window; left Today open for testing. No reinstall or app-data reset was needed.

iPhone 17 Pro on iOS 27.0 was created, booted, and launched DEPART via simctl (1523E7BD-3450-4D04-AC42-2DFA020AED4F). Xcode 27 includes DeviceHub.app under Contents/Applications. The earlier missing-Simulator.app diagnosis was premature; use Device Hub. No visible device window was verified. See `DEVELOPMENT_DIRECTION.md`.

## Physical phone follow-up — 9:03 PM onward

`xcrun devicectl list devices` and `device info details` confirmed the connected physical phone is an iPhone XS running iOS 18.6. Pairing and Developer Mode are enabled. The current SwiftUI app targets iOS 26.0, so it cannot install/run on this phone unchanged. No physical installation or launch was claimed or performed. The two Pro devices in Device Hub are simulators.

The iPhone XS is absent from Apple’s iOS 26 compatibility list. It can serve as a target for a compatible mock-data frontend after that build is created; it cannot validate the planned Apple Intelligence inference. React Native migration remains pending.

## Connected iPhone SE follow-up

Observed a paired, wired iPhone SE (iPhone12,8), running iOS 27.0 with Developer Mode enabled. It meets the existing app deployment target. Attempted a Debug build for this device with automatic provisioning updates; Xcode failed because Depart has no development team selected. Host signing inventory reported zero valid signing identities. Physical installation and launch remain pending signing setup. The React Native app has not yet been created.

## iPhone SE installation and launch completed

After Personal Team signing was configured in Xcode and keychain access approved, the Debug device build succeeded. `devicectl device install app` successfully installed ph.depart.app on the connected iPhone SE (iOS 27.0). The signed app verified on disk; the development profile includes the connected SE and expires October 16, 2026. Initial CLI launch attempts were rejected by the phone's developer-trust security gate. After completing developer trust, the user confirmed DEPART opens directly on the phone. Physical launch evidence is user-observed; no physical screenshot, model readiness check, or AI inference test was performed. This is the SwiftUI reference app.

## Launch status correction from phone screenshot

The subsequent user screenshot shows an Untrusted Developer alert for the signing identity. It supersedes the earlier user report that DEPART opens: physical installation succeeded, but app launch is still blocked by developer trust. Developer Mode and trusting the developer certificate are separate steps. No successful physical app launch is currently verified.

## Connections update — physical launch verified

Signed Debug Connections build succeeded and installed on the connected iPhone SE. `devicectl device process launch` returned “Launched application with ph.depart.app bundle identifier.” This supersedes the earlier developer-trust launch blocker. Granted permission, camera capture and notification delivery interactions have not yet been physically verified.

## React Native frontend environment update

Expo SDK 57.0.27, React Native 0.86.3, React 19.2.3, Node 24.21 and CocoaPods 1.17.0 were used for the frontend build. The new bundle `ph.depart.preview` targets iOS 18, opts into Expo scene support for the installed Xcode 27/iOS 27 SDK, and uses the user's configured development team without storing credentials. Debug simulator render and signed Release installation/launch on the SE succeeded; see `REACT_NATIVE_PHASE1.md`. Device Hub visibly rendered both devices. The SE remains unsupported hardware for Apple Foundation Models inference.

## React Native local intelligence validation — October 10

The updated simulator Debug build autolinks `modules/depart-intelligence` and compiled with the installed Swift 6.4 toolchain. In the iPhone 17 Pro iOS 27 simulator, Settings reported the actual local model available. A real guided Foundation Models generation for a new workshop context completed, persisted suggestions, and regenerated without overwriting confirmed/removed items. This extends the earlier availability-only evidence; it does not establish offline physical inference. The connected SE was not reinstalled during this functional pass, respecting the user's simulator-only preference. No cloud or tracker execution occurred.

## Updated iPhone SE Release — October 10

The user requested a new phone installation, superseding the simulator-only preference for this run. Latest red accents/icons/switches and glass navigation compiled in a signed Release build, installed through devicectl, and launched successfully on the connected iPhone SE (iOS 27.0.1). Device Hub visually showed the app's Settings screen with red icons and navigation. Screenshot: `docs/screenshots/iphone-se-red-release.png`; build log: `/tmp/depart-red-phone-build.log`. This establishes installation and visible launch, not physical AI/geofence/camera acceptance or measured animation performance.

Build recovery: removed regenerable DEPART simulator build caches to free disk space, retained source and test evidence. Added `mobile/plugins/with-local-notifications.cjs` to remove Expo's unused APNs entitlement after other transforms, allowing Personal Team signing for the local-notification app. Prebuild and CocoaPods succeeded; regenerated entitlements were verified without aps-environment; lint passed.

## Home polish — Device Hub retained

The user canceled the classic Simulator installation effort and chose Device Hub for continued testing. The updated Home notice and top-blur Release build was installed and launched on the existing iPhone 17 Pro iOS 27 simulator (ph.depart.preview). No Xcode replacement or physical-phone installation was performed. Simulator text size was temporarily increased for inspection and restored to its original `large` category. See TESTING.md for runtime limits and screenshots.

The follow-up Location setup fix was also installed as a Release simulator build. Device Hub confirmed system foreground access allowed with no saved places; this establishes the cause of the warning, not active geofence delivery. Connection disconnect/reconnect UI checks passed and the original connected preference was restored. No system permission or simulator location was changed.

## Outie display identity

Expo prebuild regenerated the iOS project under the display name Outie (`mobile/ios/Outie.xcworkspace`, scheme Outie). CocoaPods completed with the existing DepartIntelligence bridge and without an APNs entitlement. The bundle identifier remains ph.depart.preview. The final Release simulator build succeeded and installed/launched on the existing iPhone 17 Pro; the red doorway icon and Outie label were observed on the simulator Home Screen. No physical-phone installation or Xcode replacement in this pass.
