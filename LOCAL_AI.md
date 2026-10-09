# Local intelligence status

## Implemented

`ModelAvailabilityService` queries `SystemLanguageModel.default.availability` from Apple's Foundation Models framework. The service distinguishes available, ineligible device, Apple Intelligence disabled, model not ready, and an unknown future unavailable reason. Settings can refresh the result and rechecks when the app becomes active.

The code uses APIs available from iOS 26.0 and is compiled against the installed iOS 27.0 SDK. Availability is a device/runtime fact, not evidence that checklist inference has been implemented.

## Phase 2 boundary

There is no `LanguageModelSession`, generated response, inference benchmark, or cloud fallback in this milestone. Demo items are explicit fixtures labeled “Demo example.” Manual confirmation is a user action, not AI output.

The next phase will use the on-device `SystemLanguageModel`, structured generation, output validation, and a service interface. It will not use the SDK's separate Private Cloud Compute model. Only the minimum event context and applicable preferences should enter the local session.

Validate the actual phone's runtime availability and language support before generation. Unsupported or unavailable model states must keep manual checklists functional and explain the limitation. Initial system-model setup/download may require connectivity; successful offline inference requires the model to be present and available first.

Apple guidance: [SystemLanguageModel](https://developer.apple.com/documentation/foundationmodels/systemlanguagemodel), [Generating content and performing tasks](https://developer.apple.com/documentation/FoundationModels/generating-content-and-performing-tasks-with-foundation-models).

## Offline evidence

This milestone has no network clients and persists checklist edits locally. It has not demonstrated offline language inference or image matching. Those require actual processing and separate acceptance evidence.
