# Approved design and milestone

Approved in the design interview on October 9, 2026 (Asia/Manila).

## Latest direction — October 9, 2026

React Native replaces SwiftUI as the target UI stack. Use the latest approved Satoshi app typography and Solar icons from Iconify for custom app icons; keep platform-owned controls native. Keep the approved palette and departure-first hierarchy. Build interactive screens with labeled mock data and finalize the UI before functional integrations. Original SwiftUI decisions below remain reference history; see `DEVELOPMENT_DIRECTION.md`.

## Original decisions

- Primary user: a professional preparing for a client presentation; company ID and laptop charger illustrate the problem.
- Visual direction: calm daylight. Native San Francisco typography, left alignment, SF Symbols, and quiet surfaces.
- Hierarchy: departure information, then unresolved essentials, then “Check My Essentials.”
- Interaction: one-tap manual confirmation with targeted scanning for registered items once Vision is implemented.
- Skills: DEPART project workflow, using existing installed skills. No global skill changes.
- Milestone: phases 0–1 only, followed by a phase 2 handoff.
- Hardware: user reports an Apple Intelligence iPhone on iOS 26+. Its exact model, signing, and runtime model availability require device verification.

## Tokens

| Role | Hex |
|---|---|
| Warm porcelain background | #F6F5F1 |
| White surface | #FFFFFF |
| Ink primary text | #20292B |
| Slate secondary text | #5B686C |
| Deep teal accent | #0B6B60 |
| Amber brown warning | #9A5B0C |

Use semantic native text styles with Dynamic Type. Layout spacing follows an 8-point rhythm (8, 16, 24, 32). Use a rounded departure surface; list rows are separated by spacing and light rules instead of repeated cards. The initial release presents the approved light palette, including when the system is dark. Respect increased contrast independently.

## Layout comparison and review

Departure first (selected):          Essentials first (not selected):

```text
Today                              Today
Departure information              Still to check
Event and destination              Item rows
Still to check                     Departure information
Item rows                          Event and destination
Check My Essentials                Check My Essentials
```

The selected layout answers urgency before effort and matches the brief. A generic dashboard of equal-sized statistic cards would obscure that priority. The distinctive element is one departure panel with a small doorway motif and strong event typography. Avoid decorative progress rings, airline/boarding-pass styling, excessive glass, gradients, and entrance choreography. Screenshot review showed the primary action falling below the first viewport, especially with large text; anchor “Check My Essentials” above the native tab bar using a safe-area inset while the departure and checklist content scroll.

## States and language

- No computed departure: “Departure time not set.” Never invent a commute estimate.
- Normal mode without a plan: an honest empty state with a working route to Demo Mode.
- Demo fixture items: “Demo example.” They are not generated suggestions.
- Checklist evidence: “Not checked,” “Possible match,” “Visually checked,” and “Confirmed by you.” A possible match is unresolved.
- Completion counts do not mean packed or safe to leave. Keep the evidence explanation in the checklist.
- Camera/inference/calendar/notifications are not exposed as working actions in this milestone.

Native navigation and sheet transitions preserve spatial continuity. Press feedback starts immediately; use a critically damped spring for the custom primary button. With Reduce Motion, remove its scale effect. With Reduce Transparency, use solid toolbar/tab surfaces. Use 44-point minimum touch targets and avoid fixed-height text containers.

## Acceptance

Phase 0: build and launch the iOS 26+ project; record the actual environment and unresolved device evidence.

Phase 1: navigate Today/Essentials/Settings, edit the contextual checklist, verify disk persistence after relaunch, isolate personal/demo records, and test large text, accessibility labels, and reduced motion.

Next: phase 2 implements real on-device generation, preserving user edits and passing a new-event Airplane Mode test on the physical phone.

## Connections follow-up design

Settings Connections rows now navigate to native detail pages with a readable permission status and explicit Enable action. Use the existing palette and system text styles. Calendar preview, camera preview and notification tests have honest scope explanations. Permission denial routes to iPhone Settings. Demo fixtures remain separate from actual Calendar events; camera capture never confirms a checklist item. This scoped update extends the installed SwiftUI reference.

## Implemented React Native design review

The frontend now implements the approved palette, departure-first teal panel, quiet checklist rows, system San Francisco text scaling, locally bundled Solar icons, native stack/modal transitions, solid surfaces and immediate pressed opacity. Demo labeling stays above the scrollable content. Confirmed, unchecked and intentionally excluded are distinct; checking never says an item is packed. User confirmations show their time. Setup selections expose checkbox state, checklist controls expose names/status, reminder controls have descriptive accessibility labels, and decorative icons are hidden from accessibility. No custom motion depends on animation to communicate state.

Actual screenshots and remaining review scope are in `REACT_NATIVE_PHASE1.md`. The SE tab bar was given explicit safe-area spacing after its initial labels clipped. This implementation is ready for user design review; functional integration remains gated by that review.

## User-requested liquid-glass navigation — October 9, 2026

The bottom navigation now floats in a rounded glass capsule with transparent surroundings. Supported iOS devices use Expo GlassView's native clear Liquid Glass; web uses a translucent background and CSS backdrop blur. Unsupported platforms and Reduce Transparency/Increase Contrast use a readable solid fallback. Solar icons and the existing system font remain. The app's content retains its porcelain background; the navigation wrapper and primary-action surround are transparent.

A Reanimated selection pill uses a 400 ms critically damped spring with no overshoot; press feedback scales the icon/label to 0.97 over 120 ms. Native transforms run on the UI runtime. Reduce Motion skips translation/scale. Screen switches have no slide animation. Navigation forwards tab press/long press events and selected accessibility states. Content reserves the bar's safe-area and text-scaled height so the last control can scroll above it. Text views remount on font-scale changes to refresh native text measurement.

Validation: ESLint and TypeScript passed, web production export passed, native Release build passed, all three tabs navigated in the browser and simulator. Actual native glass refraction was observed over scrolling content. Larger accessibility text exposed stale text measurement, corrected by remounting text at a changed font scale; labels were then inspected and the simulator text size restored. OS Reduce Motion/Transparency event handling is implemented but not separately exercised in this update. Signed Release installation and launch on the SE passed; its [actual capture](screenshots/liquid-glass-iphone-se.png) verifies the floating bar and visible labels. This is separate from simulator motion evidence.

Captures: [Today](screenshots/liquid-glass-today.png), [glass over Essentials](screenshots/liquid-glass-essentials.png), [native motion clip](screenshots/liquid-glass-motion.mp4). Motion still needs a feel check on the physical SE; no frame-rate claim is made.

References: [Expo SDK 57 GlassEffect](https://docs.expo.dev/versions/v57.0.0/sdk/glass-effect/), [Reanimated spring](https://docs.swmansion.com/react-native-reanimated/docs/animations/withSpring/).

## Motion refinement and scrolling blur — October 10, 2026

The user requested distinctive navbar motion, screen transitions, and Expo Blur while scrolling. The floating glass capsule remains the visual focus; the porcelain background and San Francisco typography are unchanged.

The selected lens has two interruptible, critically damped edges (300/400 ms, no overshoot). Their separation produces a bounded stretch as it travels; a brief white glint indicates movement. The destination icon lifts 3 points and scales to 1.08. Repeated selections retarget existing presentation values. Transparent surroundings remain intact. Reduce Motion removes the lens movement, glint, icon lift, and press scale.

Tabs now use a quick 140 ms navigator-owned fade at the user's request (80 ms with Reduce Motion). Deeper destinations use native stack pushes and modal presentations; reduced motion uses native fades. This updates the earlier no-transition tab choice without introducing lateral tab slides. Buttons and navigable rows use 120 ms press feedback at scale 0.97. Checklist confirmations gain a quiet tint/scale change; removed items fade and remaining rows reflow. No looping, staggered card entrances, or haptics were added.

`expo-blur` 57.0.3 is installed and linked. The shared Screen renders a fixed-intensity BlurView after its scroll target, with opacity driven by the first 32 points of scrolling on Reanimated's UI runtime. The top edge is 24 points (plus the status inset in normal tab mode); the fixed Demo Mode label remains outside the effect. Android uses BlurTargetView and the SDK-31-plus method; older devices and Reduce Transparency/increased contrast receive a solid fallback. Android rendering is not device-tested.

Sources checked: [Expo SDK 57 BlurView](https://docs.expo.dev/versions/v57.0.0/sdk/blur-view/), [Reanimated transition easing](https://docs.swmansion.com/react-native-reanimated/docs/css-transitions/transition-timing-function/), and [Expo native stack](https://docs.expo.dev/router/advanced/stack/). Native press easing uses the `cubicBezier` object API; a CSS string worked on web but caused a native render error, which simulator testing found and the implementation corrects.

Evidence: native simulator launch, all three tabs, checklist push and manual confirmation, and scrolling blur were checked interactively. [Scroll blur](screenshots/expo-scroll-blur.png) and [navigation motion recording](screenshots/navigation-motion-scroll-blur.mp4) capture the rendered app. The recording includes tab switches/checklist confirmation; the deeper scroll-blur screenshot was taken afterward. Release feel and physical installation are recorded in TESTING.md separately.

## Minimalist reference redesign — October 10, 2026

The user's supplied finance-app reference now guides the visual direction: cool gray canvas, a single dark feature surface with round quick actions, compact white sections, and a floating black dock with a white active lens. This supersedes the warm porcelain/teal hero treatment. Current tokens: background #ECEDED, surface #FFFFFF, ink #202425, slate #626B6C, teal #0B6B60. Teal is reserved for checks and small actionable accents. System San Francisco and font scaling remain enabled.

DEPART's twist is an etched route motif on the departure pass, built with existing SVG assets/primitives. The dark panel shows real preview context and honestly states that departure time is unset and travel estimates unavailable. Check, Plan, and Places are working route actions. Pending essentials appear in compact white sections. The former secondary explanatory panel is replaced by a short verification note. Normal onboarding/empty states remain available; demo data remains labeled and isolated.

The floating dock keeps its interruptible lens stretch and small icon lift, now on dark glass with a white selection. Tab fades, native push/modal navigation, 120 ms press feedback, checklist state/reflow motion, and Expo scroll blur are retained. No auto-playing decoration, financial metrics, fabricated departure estimates, or AI claims are copied from the reference. Larger-text layouts remain scrollable and labels remain visible.

Implementation: `mobile/src/components/DeparturePass.tsx`, shared tokens/UI, Today screen, and GlassTabBar. TypeScript, lint, web export and signed Release build passed. Interactive native simulator checks verified the pass Check action and checking/unchecking. Physical installation remains deferred by user preference. This is a frontend design refinement; backend/AI integration still waits for UI approval.

## Ticket card and slab-serif refinement — October 10, 2026

The user requested another card design, a door-shaped exit control, and slab-serif text. The departure surface now uses left-aligned information on a dark face, a perforated divider with edge notches, and a light action strip. It replaces the previous centered layout and etched route motif. Check, Plan, and Places retain their existing destinations; departure time remains honestly unset.

Bundled Roboto Slab Regular, SemiBold, and Bold now style app text, fields, tab labels, and stack titles. Fonts load through the already-linked Expo Font module without network requests; loading failure falls back to system typography. This supersedes the earlier San Francisco app-text choice. Native platform controls keep their system appearance. Screen text retains Dynamic Type; dock labels scale up to 1.6× to avoid breaking words or consuming the viewport at extreme accessibility sizes. Full accessible tab names remain available. Font license: `licenses/RobotoSlab-Apache-2.0.txt`.

The header has Settings and a door control with the accessibility label “Leave preview and return to welcome.” It navigates to a standalone welcome route, whose “Return to my preparation” button resumes the existing provider state. There is no authentication provider, so this is an exit from the preview, not account sign-out. Both handlers navigate without resetting data. Existing press feedback, glass-lens motion, tab fades, native transitions, scroll blur, and reduced-motion/transparency behavior remain.

Native simulator rendering and manual confirmation were observed. The Mac locked before the exit/resume interaction could be verified. The normal-size screenshot is `screenshots/slab-ticket-today.png`; large-text inspection prompted a dock-label sizing correction. Physical installation remains deferred. UI approval still gates live integrations.

## Minimalist departure board — October 10, 2026

The latest user preference refines the top departure board into one continuous charcoal surface. The ticket perforation, cutouts, and light footer are removed. A faint doorway outline in the upper-right corner and a thin muted teal rule beside departure information provide restrained identity. Quiet outlined quick actions remain below a hairline divider. Roboto Slab, the door exit control, glass navigation, and existing motion remain.

Simulator inspection confirms the rendered board and readable normal-size text. The previously pending door exit/resume round trip now passed: welcome opened, return restored Today, and the confirmed Company ID remained absent from the unresolved list. Screenshot: `screenshots/minimal-departure-board.png`.

## Satoshi typography — October 10, 2026

The user's supplied Satoshi_Complete directory replaces Roboto Slab as the approved app font. Unmodified static TTF Regular, Medium, and Bold files are bundled in `mobile/assets/fonts/`, along with the supplied license. Shared text and input components, dock labels, and stack titles use Satoshi; 400 maps to Regular, 500–600 to Medium, and 700+ to Bold. The neutral `useAppFont` helper avoids tying future typography choices to a slab serif. Existing font-scaling, dock-label scaling limit, system fallback, and native platform controls are preserved.

The unused Roboto Slab package was removed. The Codex browser preview was reloaded and its presentation demo visually inspected. TypeScript, lint, and web export passed. Fonts load through existing Expo Font runtime support; no new native dependency is required. API reference checked: [Expo SDK 57 Font](https://docs.expo.dev/versions/v57.0.0/sdk/font/).

## Satoshi weight hierarchy

Bold (700) now identifies page/section headings, the event title, departure value, stack titles, and selected navigation. Medium (500; existing 600 requests map to the same supplied Medium face) identifies controls, item names, field labels, and unselected navigation. Regular (400) carries descriptions, metadata, and supporting notes. Separate bundled faces provide the weight changes without synthetic bold. Font size and color reinforce this hierarchy. Browser visual inspection and TypeScript/lint passed.

## Glass navigation refinement — October 10, 2026

The user requested glassmorphism and liquid glass with animation. The bottom navigation now uses a light translucent material rather than an opaque charcoal fill: native clear GlassView on supported iOS, Expo Blur on older iOS, and CSS backdrop blur in the browser. A translucent selected lens has a white rim and subtle shadow, with ink inactive labels and deep-teal active labels in Satoshi. Its leading/trailing critically damped springs create a restrained directional stretch and moving glint; pressing briefly compresses the lens. Motion is action-driven, without loops. Peer screens switch immediately. Reduce Motion removes translation/deformation, while Reduce Transparency or increased contrast uses an opaque readable surface. Physical animation performance still needs device review.

Text accent update: the user requested red in place of green-tinted text. Actions and active navigation labels use `#B63830`; the departure-board accent uses `#F3BBB5` for contrast on charcoal. Active navigation icons match the new label color. Neutral text and other status colors retain their existing roles.

The red accent now also applies to formerly green iconography, checked-item marks, active switch tracks, native navigation tint and their pale background tints. Accent tokens are `accent`, `accentOnDark`, and `paleAccent`; neutral and warning colors preserve their roles.

## Home notice and scroll edge polish — October 10

Connection errors appear as quiet, rounded notices inside Today and Settings rather than banners above navigation. The missing background-location permission has a plain-language title, explanation, and “Review location access” action to its connection page. It remains visible until the underlying condition is resolved. Save failures also stay within scroll content. This avoids covering the status bar and keeps the permission limitation honest.

Manual safe-area padding is now explicit, without automatic scroll insets. The top Expo blur covers the status area plus a short eight-point edge on normal tab screens, with ultra-thin material at intensity 30. It stays transparent at rest and fades in over 48 points after the first eight points of scrolling. Existing solid-surface accessibility fallbacks and glass dock remain.

## Location setup state clarification

Location permission and registered departure areas are distinct. Missing GPS coordinates now produce a “Save a starting point” setup notice, with a direct Saved Places action, instead of a generic connection exception. The Location page separately shows foreground permission and actual monitoring registration; the background-enable button requires a saved GPS area. Connections have a disconnect action. Disconnected, paused and demo states do not show a location setup warning. The service stops obsolete regions when prerequisites are removed, and stale reconciliation results cannot replace the current UI status.

## Outie identity — October 10

The user's indie-icon reference inspired a new playful identity: Outie, “Head out. Less left behind.” A warm ivory winking doorway sits on vivid red with restrained ceramic depth. The mascot lives in the launcher icon and welcome screen; Solar interface icons, Satoshi, the charcoal departure board and glass navigation retain their established roles. App display name and permission copy use Outie. [Brand specification and generation prompt](OUTIE_BRAND.md).
