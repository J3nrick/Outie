# Outie widgets

The user authorized Home Screen and Lock Screen widgets and a Settings guide on October 10, 2026. This extends the simple outing reminder release without enabling monitoring automatically. The later unchecked-item policy in UNCHECKED_REMINDERS.md now supplies the widget counts.

## What they show

- **Before you go:** small and medium Home Screen sizes. Saved everyday and valid contextual items, rain advice when supported by a fresh forecast, preparation time and an honest reminder-intent label. Long lists summarize and open the app for full details.
- **Quick reminder:** rectangular, circular and inline Lock Screen sizes. Only the remaining unchecked item count, an all-confirmed status when applicable, and generic umbrella advice. Calendar titles, reasons, item names and coordinates are absent from the Lock Screen payload.
- Both tap through to Today, or Welcome when setup is incomplete. Native system typography scales with Dynamic Type; the app guide uses the existing Satoshi hierarchy and red/Solar visual language. Home widget colors adapt to dark and tinted rendering; Lock Screen appearance follows the system.
- Empty data directs users to choose things. Demo/checklist history does not feed the widget. Widgets do not detect a departure, run fresh AI, certify packing or claim that monitoring is active from stored permission flags.

## Data and updates

`src/services/widget-data.ts` projects the same validated personal reminder policy used on Today. Timeline entries are prepared at event end, weather expiry/hour boundaries, local midnight and context expiry, with a final everyday-only fallback. Changes to items or settings immediately invalidate old extras through the existing context input key.

`src/services/widgets.ios.ts` serializes publication, reads the latest persisted snapshot, and hands timelines to `expo-widgets`. The app provider publishes after hydration and saved changes; background context refresh and successful departure processing also publish saved state. Widget failures are separate from database-save failures, appear in the guide, and can be retried. Publishing data does not guarantee an immediate OS redraw.

`src/widgets/OutieWidgets.tsx` contains pure Expo UI widget layouts. The widget runtime performs no asynchronous work, permissions, weather requests or model inference. `expo-widgets` creates a WidgetKit extension (`ph.depart.preview.widgets`) sharing `group.ph.depart.preview` with the app. Push notifications/remote Live Activity updates are disabled. Existing native signing and local-notification configuration remain in place.

Widgets require the rebuilt native app; Expo Go and browser preview do not host them. The source guide is available under **Settings → Add Outie widgets** and `/widgets`. Users must open the installed app once to publish layout/data, then add widgets through iOS.

## User installation guide

Home Screen: hold an empty area → Edit → Add Widget → search Outie → choose Before you go and a size → Add Widget → Done.

Lock Screen: hold the unlocked Lock Screen → Customize → Lock Screen → Add Widgets → select Outie → choose Quick reminder → close picker → Done. Remove an existing widget if the area is full.

The app includes both step lists, live-data layout previews, publication status, a refresh control and a link to Apple's instructions. It does not present a fake button that promises automatic widget placement.

## Validation

Final source validation: TypeScript and lint passed; 41 tests passed. Five new tests verify the reminder projection, Lock Screen privacy, timeline expiry without app launch, input changes and demo isolation, and empty/paused/off states and tap routes. The web export and both guide branches render successfully. Native simulator build, actual small/medium Home Screen and rectangular Lock Screen rendering, live item-edit publication and both tap routes passed. The signed SE build and installation also passed; launch was blocked by the locked phone, and the user chose simulator-only completion. Physical widget placement/rendering is unverified. See TESTING.md for evidence and remaining checks.

## Sources

- [Expo SDK 57 Widgets](https://docs.expo.dev/versions/v57.0.0/sdk/widgets/): families, pure layout/runtime, App Group and timeline APIs.
- [Apple widget instructions](https://support.apple.com/en-us/118610): Home Screen and Lock Screen placement.
- [Apple capability table](https://developer.apple.com/help/account/reference/supported-capabilities-ios/): App Groups is listed for the no-cost Apple Developer tier as well as paid programs. Actual profiles and device signing must still be verified; no paid-membership requirement is assumed from older advice.

## Repeat the simulator build

Use local simulator signing so Xcode embeds the simulated App Group entitlements:

```sh
xcodebuild -workspace mobile/ios/Outie.xcworkspace -scheme Outie \
  -configuration Release -destination 'id=1523E7BD-3450-4D04-AC42-2DFA020AED4F' \
  -derivedDataPath build/RNPhoneDerivedData \
  CODE_SIGNING_ALLOWED=YES CODE_SIGNING_REQUIRED=YES CODE_SIGN_IDENTITY=- build
```

Keep signing settings for physical builds separate; their development profiles must include the same App Group on both targets. The existing Personal Team successfully provisioned both in this session.
