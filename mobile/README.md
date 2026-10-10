# Outie

The active DEPART project app is Outie: “Head out. Less left behind.” It reminds users of unchecked essentials when their phone leaves a selected saved area, with optional Calendar routines, local Apple Intelligence suggestions and Open-Meteo rain advice. Confirmations apply to the current outing; item details retain last confirmation and explicitly recorded location evidence. Got it acknowledges only one reminder. Setup is resumable, permissions are contextual, and the demo is isolated. Existing checklist/camera code and personal records remain recoverable outside the primary journey.

Read [the current unchecked-reminder policy and evidence](../docs/UNCHECKED_REMINDERS.md). The app uses SQLite, Satoshi, Solar icons, the native glass dock, and Expo scroll-edge blur. Real-device background delivery and compatible-iPhone offline inference remain acceptance gates.

## Run

Node 24 was used for validation. From this directory:

```sh
npm ci
npm start
npm run ios
npm run web
```

A native development build needs Metro. The installed Release build does not. Generated `ios/` and `android/` folders are ignored; change native settings in `app.json`, then use `npx expo prebuild --platform ios`. For Xcode 27, retain `expo-build-properties` → `ios.enableSceneSupport: true`. See [Expo scene support](https://github.com/expo/fyi/blob/main/ios-scene-lifecycle.md).

Bundle: `ph.depart.preview`, display name: Outie, minimum iOS 18. Use your own Apple team when building on another account. No signing keys are included. A local standalone device build, after prebuild and pod installation:

```sh
xcodebuild -workspace ios/Outie.xcworkspace -scheme Outie \
  -configuration Release -destination 'generic/platform=iOS' \
  -derivedDataPath ../build/RNPhoneDerivedData -allowProvisioningUpdates build
```

## Widgets

Version 0.5.0 includes small/medium Home Screen and private Lock Screen widgets. Open the installed app once, then use **Settings → Add Outie widgets** for both placement guides and a refresh action. The browser can show the guide but cannot install widgets. [Implementation and build notes](../docs/WIDGETS.md). Simulator widget validation needs signing enabled with local identity `-` so the App Group entitlement is applied; an unsigned build can launch the app but cannot share widget data.

## Review the journey

1. Open Outie. Use the permission-free rain + school example first; its departure is simulated and sample data never enters your personal records. Its optional AI button calls the actual provider on supported native builds.
2. Set up reminders: save Home, select everyday things, optionally connect Calendar/routines and enable rain advice, then explicitly Start. Do this later leaves monitoring off and setup editable.
3. Today previews only unchecked items and explains sources/freshness. Tap items to confirm them; all checked suppresses the alert. My things edits everyday/routine items and opens last confirmation/recorded-location details. Settings manages context, Home setup, approved preferences and actual model readiness.
4. Close/reopen the app and confirm setup/items persist. After Home and native access are configured, use Send a test reminder; this tests notification delivery, not geofencing.
5. On a physical phone, test selected saved-area entry → exit with one unchecked item, then all checked, return/reset, Got it, pause/off and permission revocation. The iOS 27 simulator currently reports circular-region monitoring unavailable, so use it for UI and test notifications rather than proof of an actual exit. Calendar and weather are optional; saved essentials remain available offline or without AI.

Outie cannot establish that an untracked item was physically left behind. Area exits are approximate and OS background execution is best effort. Weather requests share Home coordinates only after rain reminders are explicitly enabled.

## Validate

```sh
npm run lint
npm run typecheck
npm test
npx expo-doctor
npx expo export --platform web
```

Forty-one tests cover state/storage invariants, migration, every-outing policy, duplicate/pause handling, rain/stale/offline context, validated semantic matching, context reuse and monitoring cleanup. Native and visual evidence: `../TESTING.md`.

## Structure

`src/app/` contains Expo Router routes; `src/screens/` the feature views; `src/components/` shared native controls/icons; `src/design/` tokens; `src/data/` models, reducer, snapshot repository and provider; `src/services/` validated local intelligence, device adapters and background policy; `modules/depart-intelligence/` the Foundation Models/Vision Swift bridge. No network AI calls exist.

Solar icons © 480 Design, [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/), bundled from [Iconify Solar](https://icon-sets.iconify.design/solar/). The unchecked circle is a simple authored primitive. Native navigation controls use platform icons.

## Functional review

The acceptance gate is a real background Home exit on a physical phone, followed separately by genuine offline inference on an Apple Intelligence-compatible iPhone using a previously unprocessed Calendar event. Cached weather supports that offline check; fetching fresh weather itself requires internet. The SE supports saved essentials and context rules, with honest model-unavailable fallback. Expo Go lacks this app’s custom native bridge. Browser native permissions/automation are unavailable.

The old checklist/camera routes and SwiftUI reference remain retained outside the main journey. Cloud and trackers are deferred. Home Screen and Lock Screen widgets are included in the rebuilt native app; see Settings → Add Outie widgets and [widget implementation notes](../docs/WIDGETS.md). Full acceptance details: `../docs/FUNCTIONAL_ACCEPTANCE.md`.

Native signing: `plugins/with-local-notifications.cjs` removes the remote `aps-environment` entitlement after Expo's notification transforms. DEPART uses local notifications, which do not require APNs; this allows the existing Personal Team to sign the app. Preserve this plugin when prebuilding. After native directory regeneration, run CocoaPods before building the Xcode workspace.
