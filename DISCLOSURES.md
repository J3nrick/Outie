# Development disclosures

- The repository was initially empty; no existing application code was reused.
- The product requirements came from the user's supplied DEPART master brief, retained in `docs/MASTER_BRIEF.md`.
- The approved workflow used the installed frontend-design, apple-design, and write-swift skills. The grill-me file was read; its requested “grilling” tool was unavailable, so the design interview was performed directly. Global skill files were not changed.
- Code, tests, and documentation were authored with OpenAI Codex assistance.
- Apple frameworks: SwiftUI, SwiftData, Foundation, Observation, Foundation Models; Swift Testing and XCTest for validation.
- SF Symbols provide in-app iconography. The app icon is original code-rendered geometric artwork depicting a doorway and an outward arrow.
- No external packages, downloaded fonts, stock photographs, cloud AI providers, or analytics services were added.
- The Apple on-device system language model is queried for availability only. No model inference, fine-tuning, adapter, custom pretrained model, or image feature extraction is implemented in phases 0–1.
- Demo data contains fictional example belongings and a future presentation event. It is visibly labeled and never represented as a real calendar event, generated AI suggestion, or recognition result.
- No signing secrets, team credentials, personal calendar exports, or ID images are included.
- No public repository publication or hackathon submission has been performed. Organizer-specific disclosure requirements must be checked before submission.

## Connections follow-up

Settings now exposes real Calendar, Camera, and Notifications authorization. Calendar reads a bounded upcoming-event preview without editing or importing events into plans. Camera captures a temporary in-memory preview; no recognition or persistent photo storage is implemented. Notifications schedules only a user-requested 15-second local test, with cancellation. Permissions are never requested automatically. These features extend the SwiftUI reference app; React Native migration remains pending.
