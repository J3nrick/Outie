# DEPART project instructions

The active app is Outie, with a simple Home-outing reminder flow; read `docs/SIMPLE_OUTING_PLAN.md` for the latest accepted scope. DEPART uses React Native. Read `docs/IMPLEMENTATION_PLAN.md`, `docs/AUTOMATION_SCOPE.md`, `docs/DEVELOPMENT_DIRECTION.md`, `docs/MASTER_BRIEF.md`, and `docs/DESIGN.md` before changing product behavior. The tested SwiftUI phases 0–1 build remains a reference; The React Native frontend now lives in `mobile/`; read `docs/REACT_NATIVE_PHASE1.md` for current evidence and remaining checks. The user authorized steps 1–7 and live integrations on October 10, 2026; consult `docs/FUNCTIONAL_ACCEPTANCE.md` for current evidence. The latest user direction takes precedence over the original phase order.

## Required skills

- Before UI work, locate and read the installed `frontend-design` skill. Apply its visual planning, content, hierarchy, and self-critique workflow.
- Read `apple-design` for interaction, typography, motion, and accessibility work. Translate web examples into React Native interaction patterns; preserve native navigation, sheets, accessible controls, and the latest approved app typography (bundled Satoshi; native platform controls retain system typography). Use bundled Solar icons from Iconify for custom app iconography, with attribution; keep platform-owned controls native.
- Read `write-swift` before writing Swift. Confirm the actual compiler/SDK rather than assuming the skill's version examples match the environment.
- When the user requests a design interview, read `grill-me`. If its requested Skill/“grilling” tool is unavailable, report that limitation and interview directly: ask one focused decision or a small related set, challenge meaningful tradeoffs, recommend an answer, and record accepted choices. Do not claim the unavailable tool was invoked.
- Locate skills through the session's skill catalog or installed skill directories. If unavailable, report the limitation and use the documented native design direction. Do not change global skills as part of ordinary DEPART work.

## Engineering and evidence

- Keep AI, camera sessions, and persistence outside UI components. During frontend work, use deterministic, visibly labeled mock fixtures behind a replaceable data interface. Retain the approved UI while implementing the now-authorized live integrations. Preserve the SwiftUI reference source and test evidence.
- Use real on-device inference when phase 2 is implemented. No cloud AI dependency or fake inference output.
- Demo records must be visibly labeled and isolated from personal records. Fixture items are demo examples, never AI suggestions or recognition results.
- Manual confirmation and visual verification are distinct. Observing an object does not prove it is packed.
- Persist edits explicitly and expose save failures. Never replace a failed production store with an ephemeral store.
- Respect Dynamic Type, VoiceOver labels, Reduce Motion, Reduce Transparency, and increased contrast.
- Validate builds and meaningful state/persistence tests. Report simulator evidence separately from physical-device evidence.
- Do not claim calendar, camera, notifications, or inference work before their integrations exist and have appropriate verification.
- The supplied deadline is October 10, 2026, 10:00 AM Asia/Manila. Respect the organizer's actual code-freeze rules; publishing and submission are separate user actions.

## Phase reporting

Report implemented behavior, files, validation actually executed, blockers, and the next phase. Keep `TESTING.md` and the environment report accurate.
