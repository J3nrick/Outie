# Outie AppBuilders PH submission draft

Outie helps people remember what to bring when heading out. This submission covers the active React Native app, its local AI and optional weather context, and the evidence available on October 10, 2026, Asia/Manila. Team details and publication links remain to fill in before submission.

## The project

| Field | Submission text |
| --- | --- |
| Project name | Outie |
| Short description | Outie combines your everyday essentials, relevant calendar context, and weather advice into a helpful departure reminder. Local AI on supported iPhones adds contextual suggestions, while saved essentials remain usable without AI. Head out. Less left behind. |
| Team name | [Add team name] |
| Team members | [Add each member's name and role] |
| GitHub repository | https://github.com/J3nrick/DEPART — the repository retains its original project name; the active app is Outie under `mobile/`. Confirm judge access and the final submission commit. |
| Physical hardware tested on | iPhone SE, second generation (`iPhone12,8`), iOS 27.0.1: signed installation and visible launch of an earlier React Native release were observed. A later app/widget update installed, but launch was blocked by the locked phone. This device does not support the local Apple Intelligence model; physical widget rendering, offline AI and background departure delivery are not established. |
| Simulator tested on | iPhone 17 Pro, iOS 27.0: native Release build, installation, launch, persistence, real local-model requests, and Home Screen/Lock Screen widget rendering were observed. Simulator results are separate from physical-device results. |

## The proof

| Field | Submission text or attachment |
| --- | --- |
| Demo video around one minute | [Add final video file or judge-accessible URL]. Use the application-only hackathon script below. The video is not yet recorded in this chat. |
| Screenshots | Existing captures are listed below. Add a new capture of the actual hackathon reminder before using it as the main submission example. |
| X or LinkedIn video URL | [Add published post URL]. No social post has been published as part of this preparation. |
| What runs locally | Apple Foundation Models inference on supported, model-ready iPhones; saved essentials/routines/preferences; SQLite storage; processing authorized locally available calendar events; reminder composition and duplicate suppression; saved-area monitoring and local notifications through iOS; widget projection from saved data. These paths require relevant permissions and OS support. Physical background delivery and offline inference acceptance remain open. |
| What requires internet | Fetching a fresh Open-Meteo forecast. Requests send forecast coordinates to Open-Meteo, without calendar text or item names. Cached forecasts can support advice while within the freshness window; stale or unavailable forecasts do not produce weather claims. Calendar accounts may separately need internet to sync new events into the device. No cloud language model is required. |

### Existing screenshots

- [Today reminder preview](screenshots/outie-simple-today.png): native simulator capture with saved keys/wallet; reminder setup is visibly incomplete.
- [Guided contextual example](screenshots/outie-simple-demo.png): native simulator capture; school/rain context and departure are explicitly sample/simulated. A real local-model call produced the displayed model-status message; this is not physical departure evidence.
- [Medium Home Screen widget](screenshots/outie-home-widget-medium.png): native simulator widget with saved essentials and reminders visibly off.
- [Lock Screen widget](screenshots/outie-lock-widget.png): simulator widget evidence.
- [Earlier physical iPhone SE release](screenshots/iphone-se-red-release.png): physical launch evidence for the earlier interface, not the current hackathon scenario.

### Application only demo script

Scenario: the developer is attending AppBuilders PH Hackathon in Makati at 1:00 PM. Record the actual event, your own saved items and actual provider results. The existing permission-free example remains a school/rain story; it has not been changed to the hackathon story. Label any simulated departure, and do not describe chosen items as generated AI suggestions.

| Time | Screen | Voiceover |
| --- | --- | --- |
| 0:00–0:10 | Welcome, then Today | This is Outie. I’m attending AppBuilders PH Hackathon in Makati at one PM. Let’s make sure my charger attends too. |
| 0:10–0:20 | Home setup, then My things | I save Home and choose my essentials: keys, wallet, laptop, and charger. Set up once—because I already have enough tasks in my backlog. |
| 0:20–0:32 | Calendar context, then refresh suggestions | With Calendar connected, Outie gets context for today. On supported iPhones, local AI interprets the event and suggests useful extras, with reasons I can review. |
| 0:32–0:44 | Reminder preview, then item reasons | Here’s my reminder preview: everyday essentials alongside relevant suggestions. One clear reminder for heading out. Apparently, remembering to commit my code doesn’t mean remembering to bring my laptop. |
| 0:44–0:54 | Actual model status, My things, Pause control | The AI runs on-device, without cloud AI. My saved essentials still work when AI is unavailable, and I can edit my things or pause reminders. |
| 0:54–1:00 | Today, then app icon and tagline | Outie. One less bug in my day. Head out. Less left behind. |

## The disclosures

- **Models used:** Apple's on-device Foundation Models language model on supported iPhones. No custom training or cloud AI. Retained Vision image comparison is outside the core demo.
- **Technologies and frameworks:** React Native, Expo, TypeScript, Expo Router, SQLite, Swift, Reanimated and iOS widgets.
- **APIs and cloud services:** Apple Calendar, Location and local Notifications; optional Open-Meteo weather requests share forecast coordinates. Fresh weather requires internet.
- **Existing code and assets:** Expo scaffold and open-source packages; earlier DEPART implementations retained. Solar icons by 480 Design (CC BY 4.0), licensed Satoshi fonts, and an OpenAI-generated app icon. Demo fixtures are labelled.
- **AI development tools:** Codex and ChatGPT only, with OpenAI's built-in image generation used for the icon.

## Remaining submission items

- Fill team name and member names/roles.
- Confirm judge access to the repository and the final submitted commit.
- Record the approximately one-minute application demo and capture the hackathon reminder.
- Add the final video attachment/URL and the X or LinkedIn post URL after publication.
- Keep physical-device and simulator claims distinct; compatible-phone offline inference and real background Home exit are not yet physically verified.

Evidence: [Current outing implementation](SIMPLE_OUTING_PLAN.md), [functional acceptance](FUNCTIONAL_ACCEPTANCE.md), [environment](ENVIRONMENT.md), [widgets](WIDGETS.md), [testing](../TESTING.md), and [brand](OUTIE_BRAND.md). This draft does not publish, post or submit the project.
