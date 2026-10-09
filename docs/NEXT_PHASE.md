# Phase 2 handoff — real on-device preparation generation

> Active Outie handoff: the simple outing flow is implemented. Next verify actual physical Home entry/exit, locked/background notification delivery, pause/off and permission loss, then compatible-iPhone offline local inference with a previously unseen Calendar event. See SIMPLE_OUTING_PLAN.md and TESTING.md. The original SwiftUI phase handoff below is retained as historical reference.

This integration handoff is deferred until the React Native mock-data UI is finalized. The immediate next work is described in `DEVELOPMENT_DIRECTION.md`; this document preserves the future AI acceptance criteria.

The phase 0–1 foundation ends at native navigation, scoped persistence, manual checklist editing, and runtime model availability. Start Phase 2 after reviewing the physical-device checks in the environment report.

## Implementation

1. Introduce a local preparation-provider interface and a Foundation Models implementation using `SystemLanguageModel.default` and a local `LanguageModelSession`. Do not use Private Cloud Compute or a cloud fallback.
2. Define a structured result containing an activity category and item suggestions with names and reasons. Use the SDK's supported guided-generation APIs and check model/language availability before each request.
3. Provide explicit event input: the labeled demo event or a user-entered title/context. EventKit integration remains Phase 3. Remove sensitive event details that do not help preparation.
4. Validate and normalize generated names/reasons/category before persistence. Reject empty, malformed, excessive, or unsupported output with a recoverable state. Ambiguous events should invite clarification rather than invent details.
5. Merge generated suggestions with category preferences and existing essential associations. Preserve user-added items, removals, and confirmations. Add a durable dismissed-suggestion record before regeneration so a removed AI suggestion is not silently resurrected; the current manual fixture flow does not implement this merge yet.
6. Persist the plan with an honest `localAI` source only after real generation succeeds. Keep Demo Mode labeling independent of whether inference is real. Preserve manual editing during unavailable/error states.

## Acceptance evidence

- Connect the actual demo phone, confirm signing/install, and record model/iOS/runtime availability.
- Prepare the on-device model before disconnecting. Enable Airplane Mode and disable any remaining Wi-Fi connection.
- Enter an event title that has not previously been processed, generate a checklist using real local inference, and retain evidence of its result.
- Confirm there are no cloud requests and that model output survives app termination and relaunch.
- Regenerate a plan containing a user-added item, a removed suggestion, and a manual confirmation; verify those choices survive.
- Exercise available, disabled, not-ready, unsupported, cancelled, and failed-generation states through deterministic provider tests. Record actual measured durations only if measured.

After Phase 2: Phase 3 connects genuine EventKit events; phases 4–5 register belongings and perform real local visual comparison; Phase 6 implements departure calculations and local notifications.
