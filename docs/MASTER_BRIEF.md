# MASTER DEVELOPMENT PROMPT
# PROJECT: DEPART
# TAGLINE: Never Leave Unprepared.
# PLATFORM: Native iOS
# HACKATHON: AppBuildersPH Hackathon 2026
# THEME: Local AI

You are an autonomous senior iOS engineer, AI/ML engineer,
software architect, product designer, and QA engineer.

Your task is to DESIGN, ARCHITECT, IMPLEMENT, TEST, and DOCUMENT
a functional native iOS application called DEPART.

You must approach this as a real software engineering project,
not as a UI prototype or proof-of-concept mockup.

The goal is to create a polished, reliable, privacy-first,
offline-capable AI product that can be demonstrated at
AppBuildersPH Hackathon 2026.

The project must be substantially implemented during the
hackathon and ready for submission before:

October 10, 2026 — 10:00 AM Philippine Time.

The submission deadline is strict.

Prioritize a reliable, fully working vertical slice over
a large collection of incomplete features.

Do not fabricate functionality, benchmarks, model outputs,
device capabilities, or integration status.

--------------------------------------------------
0. MANDATORY SKILL USAGE
--------------------------------------------------

Before implementing any user interface:

1. Inspect the available installed skills.
2. Find and invoke the installed frontend-design skill
   (or the exact equivalent specified by the environment).
3. Read its full instructions before designing the UI.
4. Apply its design principles throughout implementation.

The frontend-design skill should guide:

- Visual direction
- Typography
- Spacing
- Layout
- Interaction design
- Information hierarchy
- Component consistency
- Responsive and adaptive layouts
- Accessibility
- Microinteractions
- Overall interface quality

Important:

This is a native SwiftUI application.

Do not replace the native iOS implementation with a React
website merely because the frontend-design skill focuses
on web development.

Translate the skill's visual and interaction principles
into native SwiftUI components.

Use native iOS interaction patterns where appropriate.

If the requested skill is unavailable, clearly report that
limitation and continue with professional SwiftUI design
principles.

Do not claim to have used a skill that was not actually loaded.

--------------------------------------------------
1. PROJECT OVERVIEW
--------------------------------------------------

PROJECT NAME:
DEPART

TAGLINE:
Never Leave Unprepared.

PRODUCT CATEGORY:
Offline-first contextual personal assistant.

CORE IDEA:

Depart is a proactive AI assistant that understands
where the user is going, identifies what they should
prepare, and helps visually verify important belongings
before they leave.

The application connects:

1. Apple Calendar
2. Personal preparation preferences
3. On-device language intelligence
4. iPhone camera
5. On-device computer vision
6. Departure-time calculations
7. Local notifications
8. Locally stored personal context

Optional connected features may include:

- Current weather
- Traffic estimates
- Map routes
- Location awareness
- Cloud AI enhancement
- Apple Health

However, the core product must not depend on cloud AI.

PRODUCT PHILOSOPHY:

Traditional calendars tell users WHEN and WHERE
they need to go.

Depart helps users understand WHAT THEY NEED
and verifies whether important belongings have
been visually checked.

The product should feel proactive, contextual,
intelligent, calm, and trustworthy.

It must not feel like another generic AI chatbot.

--------------------------------------------------
2. THE PROBLEM
--------------------------------------------------

People frequently forget important belongings
when leaving for appointments, meetings, work,
travel, sports, and daily activities.

Examples:

- Forgetting a company ID before work
- Forgetting a laptop charger before a presentation
- Forgetting required documents for an appointment
- Forgetting gym shoes before a workout
- Forgetting an umbrella when rain is forecast
- Forgetting equipment for a scheduled activity

Existing productivity applications generally require
users to manually remember what needs preparation.

Depart should connect the context automatically.

The primary user problem is:

"I know where I need to go, but I sometimes forget
what I need to bring."

--------------------------------------------------
3. PRODUCT PRINCIPLES
--------------------------------------------------

Follow these principles throughout the project.

PRINCIPLE 1 — OFFLINE FIRST

Core language inference, visual verification,
personal preferences, checklists, departure
calculations, and local notifications must function
without an internet connection.

PRINCIPLE 2 — PRIVACY BY DESIGN

Personal calendar data and camera images should
remain on-device for the core workflow.

Do not upload personal images or calendar information
to cloud AI services.

Any future cloud enhancement must be explicitly
optional and transparent.

PRINCIPLE 3 — PROACTIVE, NOT CHAT-BASED

The primary experience must be driven by contextual
events and user actions.

Do not make a chatbot the central interface.

PRINCIPLE 4 — REAL AI, NOT SIMULATED AI

Use genuine local model inference for supported tasks.

Do not fake inference responses.

Do not use fixed responses while representing them
as generated AI output.

Deterministic business logic is encouraged for
calculations, scheduling, and state management.

PRINCIPLE 5 — EVIDENCE OVER CONFIDENCE

The app must distinguish:

- AI suggestion
- Visually verified item
- User-confirmed item
- Unverified item
- Uncertain recognition

Seeing an object does not prove it has been packed.

Avoid representing visual similarity as certain
physical identification.

PRINCIPLE 6 — HONEST OFFLINE BEHAVIOR

Live traffic and weather are unavailable without
appropriate network access.

Cached information may still be displayed, but
must include source and freshness information.

Never present stale cached information as live.

PRINCIPLE 7 — VERTICAL SLICE FIRST

Complete one end-to-end workflow before implementing
additional integrations or visual enhancements.

--------------------------------------------------
4. CORE USER EXPERIENCE
--------------------------------------------------

The primary workflow should be:

1. User opens Depart.
2. Depart retrieves upcoming calendar events.
3. User selects or confirms an upcoming event.
4. Local AI interprets the activity.
5. Depart generates a preparation checklist.
6. The checklist incorporates saved user preferences.
7. User opens Depart Vision.
8. User scans registered essential belongings.
9. Local computer vision compares captured images
   against saved references.
10. Verification results update the checklist.
11. Depart calculates a recommended departure time.
12. Depart schedules a local reminder.
13. The workflow continues without internet access.

EXAMPLE:

Calendar event:

"Client Presentation"
9:00 AM
BGC, Taguig

Depart generates:

- Company ID
- Laptop
- Laptop charger
- Presentation materials

The user previously registered their company ID
and laptop charger.

Depart displays:

Company ID — Not checked
Laptop — Manual check available
Laptop charger — Not checked
Presentation materials — Manual check available

The user scans their company ID.

If the visual evidence passes the validated
matching threshold:

Company ID — Visually verified

The user scans their charger.

Laptop charger — Visually verified

Depart calculates a departure time using a
configured travel estimate and arrival buffer.

A local notification reminds the user before
departure.

All core AI operations must continue offline.

--------------------------------------------------
5. REQUIRED FEATURES
--------------------------------------------------

FEATURE A — SMART CALENDAR INTELLIGENCE

Use EventKit to read upcoming Apple Calendar events
after obtaining the necessary permission.

Requirements:

- Request calendar authorization appropriately.
- Retrieve events within a configurable time window.
- Default to the next 48 hours.
- Exclude expired events.
- Handle all-day events separately or exclude them
  from departure planning.
- Sort events by start date.
- Display relevant event information.
- Allow selecting an event.
- Handle missing event titles or locations.
- Handle denied authorization gracefully.

Do not invent calendar events.

For development and demonstrations, provide clearly
labeled sample events through an explicit Demo Mode.

The normal application must use real EventKit data.

FEATURE B — LOCAL AI PREPARATION ENGINE

Implement a dedicated local language intelligence
service.

Preferred implementation:

Apple Foundation Models framework.

Requirements:

- Check model availability at runtime.
- Handle unsupported devices.
- Handle model-not-ready states.
- Use structured generation where supported.
- Keep model instructions concise.
- Avoid unnecessarily sending sensitive information.
- Generate useful event categories.
- Generate preparation item suggestions.
- Explain why individual items may be useful.
- Respect saved preferences.
- Avoid inventing weather, traffic, or event details.
- Handle ambiguous events gracefully.

Example:

INPUT:

Event:
"Basketball with friends"

Preferences:
"Always bring knee support for basketball"

EXPECTED STRUCTURE:

{
  "category": "sports",
  "items": [
    {
      "name": "Basketball shoes",
      "reason": "Useful for the scheduled activity"
    },
    {
      "name": "Water bottle",
      "reason": "Useful for the scheduled activity"
    },
    {
      "name": "Knee support",
      "reason": "Saved personal preference"
    }
  ]
}

The exact text can vary.

The application must validate model output before
turning it into persistent checklist records.

MODEL COMPATIBILITY:

The Foundation Models framework requires a compatible
device, OS, and an available on-device model.

Inspect the installed SDK and deployment target.

Use only APIs supported by the actual development
environment.

If Foundation Models is unavailable:

- Report the compatibility limitation.
- Investigate a feasible alternative local model.
- Do not silently replace local inference with a
  cloud request.
- Keep the app functional in a degraded mode.
- Clearly label any non-AI fallback behavior.

The hackathon's local AI requirement must remain
a priority.

FEATURE C — PERSONAL ESSENTIALS LIBRARY

Users should be able to register important belongings.

Examples:

- Company ID
- Laptop charger
- Wallet
- Umbrella
- Keys
- Water bottle
- Documents
- Personal equipment

Each registered essential should contain:

- Unique identifier
- Item name
- Item category
- Optional description
- Associated event categories
- Reference image locations
- Creation timestamp
- Updated timestamp

Users must be able to:

- Add an essential
- Rename an essential
- Delete an essential
- View registered essentials
- Assign essentials to activity categories
- Capture reference photos

Store personal images in the app's private storage.

Use appropriate file protection for sensitive data.

Do not upload reference images.

FEATURE D — DEPART VISION

This is a major differentiating feature.

Implement guided single-object visual verification.

Do not begin with complex multi-object detection.

REGISTRATION FLOW:

1. User selects Add Essential.
2. User enters the name.
3. User opens the camera.
4. User positions the object inside a guide frame.
5. User captures reference photographs.
6. The app stores reference images securely.
7. The app generates local visual representations.
8. The object becomes available for future scans.

VERIFICATION FLOW:

1. User selects an unverified checklist item.
2. User taps Scan Essential.
3. Camera opens.
4. User positions the object inside the guide frame.
5. User captures an image.
6. App crops the relevant image region.
7. Vision generates an image feature print.
8. App compares it with registered references.
9. Verification engine evaluates similarity.
10. App displays the result.

USE:

- AVFoundation for camera capture
- Vision for local image analysis
- VNGenerateImageFeaturePrintRequest for similarity
- Optional VNRecognizeTextRequest for OCR

VISUAL VERIFICATION STATES:

NOT_CHECKED
POSSIBLE_MATCH
VISUALLY_VERIFIED
MANUALLY_CONFIRMED

These states must remain distinguishable.

IMAGE COMPARISON:

Use Apple's feature-print distance comparison.

Do not hardcode an arbitrary similarity threshold
and claim that it is scientifically validated.

Test reference images and negative examples.

Support an uncertain result.

A possible match should allow manual confirmation.

For similar-looking ID cards, optional OCR may
help distinguish the registered reference.

Avoid unnecessary storage of sensitive ID text.

IMPORTANT:

Visual verification means the object was observed.

It does not prove that the object was placed
inside the user's bag or remained with them.

Do not claim otherwise.

FEATURE E — SMART CHECKLIST

The checklist combines:

- Generated AI suggestions
- Saved personal essentials
- User-created items
- Manual confirmations
- Visual verification results

Required interactions:

- Check an item manually
- Uncheck an item
- Scan a registered item
- Add a custom item
- Remove a suggested item
- Save personal preferences
- Display verification status

Checklist edits must persist between app launches.

AI regeneration must not silently overwrite
user-created items or confirmations.

FEATURE F — DEPARTURE ENGINE

Use deterministic Swift code to calculate
departure times.

Formula:

RecommendedDeparture =
EventStart
- EstimatedTravelDuration
- ArrivalBuffer

Requirements:

- Configurable arrival buffer
- Configurable travel estimate
- Support unknown travel duration
- Handle events occurring soon
- Handle departure times in the past
- Handle event time changes
- Avoid duplicate notifications

If no reliable travel estimate exists:

Ask the user to provide a manual estimate.

Do not invent a travel duration.

FEATURE G — LOCAL NOTIFICATIONS

Use UserNotifications.

Schedule:

1. Preparation reminder
2. Departure reminder

Example:

"Leaving in 15 minutes? Your company ID hasn't
been visually checked."

Notifications should be generated from saved
preparation plans.

Do not require background LLM inference at the
exact time a notification is delivered.

If an event changes, update corresponding
pending notifications.

Respect authorization settings.

FEATURE H — OFFLINE CAPABILITY

The application must continue supporting:

- Locally available events and saved event snapshots
- Local language inference
- Preparation checklist generation
- Personal preferences
- Camera image processing
- Essential verification
- Departure calculations
- Local notifications

Implement a connectivity state indicator.

Distinguish actual network unavailability
from a user-selected simulation.

Provide a reproducible Airplane Mode test.

--------------------------------------------------
6. OPTIONAL FEATURES — ONLY AFTER CORE MVP
--------------------------------------------------

The following are stretch goals.

Do not prioritize them before completing the
core workflow.

OPTIONAL A — WEATHERKIT

Retrieve weather forecasts while online.

Use the forecast to suggest useful items.

Example:

Rain forecast:
Suggest umbrella.

Cache snapshots with timestamps.

Show stale data honestly.

OPTIONAL B — MAPKIT

Retrieve online travel estimates when available.

Cache travel duration and route metadata.

Never imply cached ETA reflects current traffic.

OPTIONAL C — CORE LOCATION

Allow users to save home and office locations.

Support location-aware departure context.

Eventually support geofence entry and exit events.

For the hackathon, implement simulated departure
triggers before complex background geofencing.

OPTIONAL D — HEALTHKIT

Optional and permission-based.

Do not derive medical conclusions from general
activity metrics.

Only integrate if it materially improves a
well-defined departure feature.

OPTIONAL E — CLOUD AI

The product may use cloud AI as an optional
enhancement when online.

Cloud AI must never become a dependency for:

- Event understanding
- Core preparation generation
- Visual verification
- Checklist management
- Departure calculations

Require user consent before sharing personal
context with any cloud provider.

--------------------------------------------------
7. SYSTEM ARCHITECTURE
--------------------------------------------------

Use a modular architecture with clear boundaries.

PREFERRED PATTERN:

SwiftUI
+ MVVM
+ Service Layer
+ Domain Services
+ Local Persistence
+ Local AI Providers

ARCHITECTURAL OVERVIEW:

┌──────────────────────────────────────────┐
│              PRESENTATION                │
│                                          │
│              SwiftUI Views               │
│                                          │
│ Today                                    │
│ Checklist                                │
│ Depart Vision                            │
│ Essentials Library                       │
│ Settings                                 │
└──────────────────┬───────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────┐
│             VIEW MODELS                  │
│                                          │
│ DashboardViewModel                       │
│ ChecklistViewModel                       │
│ VisionViewModel                          │
│ EssentialsViewModel                      │
└──────────────────┬───────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────┐
│              DOMAIN LAYER                │
│                                          │
│ DepartureEngine                          │
│ PreparationPlanner                       │
│ EssentialVerificationEngine              │
│ EventSelectionEngine                     │
│ ReminderCoordinator                      │
└──────────────────┬───────────────────────┘
                   │
         ┌─────────┴──────────┐
         │                    │
         ▼                    ▼
┌──────────────────┐  ┌─────────────────────┐
│   LOCAL AI       │  │   PLATFORM          │
│                  │  │   SERVICES          │
│ Foundation Models│  │                     │
│ Vision           │  │ EventKit            │
│ Feature Prints   │  │ AVFoundation        │
│ OCR              │  │ UserNotifications   │
│                  │  │ Core Location*      │
└─────────┬────────┘  └──────────┬──────────┘
          │                      │
          └──────────┬───────────┘
                     │
                     ▼
┌──────────────────────────────────────────┐
│           PERSISTENCE LAYER              │
│                                          │
│ SwiftData                                │
│ Private Local File Storage               │
│ Cached Event Data                        │
│ Registered Essentials                    │
│ Preparation Plans                        │
│ User Preferences                         │
└──────────────────────────────────────────┘

*Optional for MVP.

ARCHITECTURE RULES:

1. SwiftUI Views must not contain AI inference logic.

2. SwiftUI Views must not directly manage camera
   sessions or database persistence.

3. Local AI capabilities must be abstracted behind
   service interfaces.

4. Departure calculations must be independent
   of AI response generation.

5. Visual recognition must be separate from
   checklist presentation.

6. Persistence models should not depend directly
   on UI components.

7. Use dependency injection where practical.

8. Support preview or demo data without replacing
   real production integrations.

9. Design for graceful permission denial.

10. Avoid unnecessary external dependencies.

--------------------------------------------------
8. RECOMMENDED PROJECT STRUCTURE
--------------------------------------------------

Depart/
│
├── App/
│   ├── DepartApp.swift
│   ├── AppContainer.swift
│   └── AppState.swift
│
├── Core/
│   ├── Models/
│   │   ├── DeparturePlan.swift
│   │   ├── PreparationItem.swift
│   │   ├── RegisteredEssential.swift
│   │   ├── EssentialVerification.swift
│   │   ├── CalendarEvent.swift
│   │   ├── UserPreferences.swift
│   │   └── CachedTravelEstimate.swift
│   │
│   ├── Engines/
│   │   ├── DepartureEngine.swift
│   │   ├── PreparationPlanner.swift
│   │   ├── EventSelectionEngine.swift
│   │   └── EssentialVerificationEngine.swift
│   │
│   └── Utilities/
│       ├── DateUtilities.swift
│       └── ImageUtilities.swift
│
├── Intelligence/
│   ├── LocalAIService.swift
│   ├── FoundationModelsProvider.swift
│   ├── PreparationResult.swift
│   └── ModelAvailabilityService.swift
│
├── Vision/
│   ├── CameraService.swift
│   ├── FeaturePrintService.swift
│   ├── OCRService.swift
│   └── EssentialRecognitionService.swift
│
├── Integrations/
│   ├── CalendarService.swift
│   ├── NotificationService.swift
│   ├── ConnectivityService.swift
│   ├── LocationService.swift
│   ├── WeatherService.swift
│   └── RoutingService.swift
│
├── Persistence/
│   ├── LocalStore.swift
│   ├── EssentialRepository.swift
│   ├── DeparturePlanRepository.swift
│   └── ImageStorageService.swift
│
├── Features/
│   ├── Onboarding/
│   ├── Dashboard/
│   ├── Checklist/
│   ├── DepartVision/
│   ├── EssentialsLibrary/
│   └── Settings/
│
├── DesignSystem/
│   ├── Colors.swift
│   ├── Typography.swift
│   ├── Spacing.swift
│   ├── Components/
│   └── Animations/
│
├── Demo/
│   ├── DemoScenario.swift
│   └── DemoDataProvider.swift
│
└── Resources/
    └── Assets.xcassets

The structure may be simplified if necessary
to meet the hackathon deadline.

Avoid creating unnecessary abstraction layers
before the core workflow is working.

--------------------------------------------------
9. DATA MODELS
--------------------------------------------------

Implement clear and type-safe models.

DEPARTURE PLAN:

- id
- calendarEventId
- eventTitle
- eventStartDate
- destination
- category
- estimatedTravelMinutes
- arrivalBufferMinutes
- recommendedDepartureDate
- preparationItems
- summary
- generationSource
- createdAt
- updatedAt

PREPARATION ITEM:

- id
- name
- reason
- source
- relatedEssentialId
- verificationStatus
- isRequired
- createdAt
- updatedAt

REGISTERED ESSENTIAL:

- id
- name
- category
- description
- associatedEventCategories
- referenceImagePaths
- createdAt
- updatedAt

USER PREFERENCES:

- arrivalBufferMinutes
- preparationReminderMinutes
- manualTravelEstimates
- categoryItemPreferences
- notificationsEnabled

VERIFICATION RESULT:

- essentialId
- verificationStatus
- similarityDistance
- verifiedAt
- verificationMethod

Use enums for statuses instead of arbitrary strings
where practical.

Persist the data needed to survive app restarts
and offline operation.

--------------------------------------------------
10. DESIGN DIRECTION
--------------------------------------------------

The interface must feel like a polished consumer
iOS application.

Follow the loaded frontend-design skill.

DESIGN PERSONALITY:

- Minimal
- Calm
- Intelligent
- Premium
- Context-aware
- Privacy-focused
- Friendly but not childish

DESIGN INSPIRATION:

Use Apple-quality interaction principles.

Avoid creating a clone of Apple's system apps.

Build a distinctive identity for Depart.

VISUAL DIRECTION:

Primary background:
Warm off-white or a carefully balanced dark surface.

Typography:
Use native San Francisco typography.

Accent:
Choose one restrained, recognizable accent color.

Cards:
Clean surfaces, generous spacing, subtle depth.

Icons:
Use SF Symbols.

Animation:
Purposeful and subtle.

Do not use excessive gradients, glass effects,
neon colors, or decorative dashboards.

IMPORTANT:

Visual clarity matters more than ornamentation.

The interface should make the next important
action obvious.

PRIMARY NAVIGATION:

TODAY
ESSENTIALS
SETTINGS

The checklist and camera scanner should appear
as contextual flows rather than unrelated tabs.

--------------------------------------------------
11. SCREEN SPECIFICATIONS
--------------------------------------------------

SCREEN 1 — ONBOARDING

Purpose:
Introduce Depart and request relevant permissions.

Elements:

- Depart logo/wordmark
- Tagline
- Short explanation
- Get Started button
- Calendar permission setup
- Notification permission setup
- Optional personal preferences

Do not block the entire app when optional
permissions are denied.

SCREEN 2 — TODAY

This is the primary dashboard.

Elements:

- Greeting
- Current date
- Next event card
- Event start time
- Event location
- Recommended departure time
- Travel estimate source
- Preparation progress
- Smart checklist preview
- Scan Essentials button
- Offline intelligence status

PRIMARY CTA:

"Check My Essentials"

The next departure should dominate the layout.

SCREEN 3 — PREPARATION CHECKLIST

Elements:

- Event information
- Preparation checklist
- Item status
- AI-generated suggestions
- Personal item indicators
- Scan actions
- Add item action
- Completion progress

Allow manual edits.

SCREEN 4 — DEPART VISION

Elements:

- Camera preview
- Centered object guide
- Clear scanning instructions
- Target essential name
- Capture button
- Recognition status
- Match explanation
- Manual confirmation when uncertain

CAMERA STATES:

Idle
Capturing
Processing
Possible Match
Verified
Not Verified
Error

Use honest loading indicators.

Never display a successful verification before
real inference has completed.

SCREEN 5 — ESSENTIALS LIBRARY

Elements:

- Registered essential cards
- Item names
- Categories
- Image previews
- Add Essential action
- Edit and delete actions

SCREEN 6 — REGISTER ESSENTIAL

Elements:

- Item name
- Item category
- Reference photo capture
- Preview images
- Save action

Use a guided capture process.

SCREEN 7 — SETTINGS

Elements:

- Calendar permission status
- Camera permission status
- Notification permission status
- Arrival buffer
- Manual commute duration
- Local AI availability
- Connectivity status
- Privacy explanation
- Demo Mode access

--------------------------------------------------
12. IMPLEMENTATION PHASES
--------------------------------------------------

Execute development in the following order.

PHASE 0 — ENVIRONMENT VALIDATION

OBJECTIVE:
Verify the actual development environment.

TASKS:

- Inspect repository state.
- Identify installed Xcode version.
- Identify available iOS SDK.
- Identify target deployment version.
- Check available devices and simulators.
- Validate Foundation Models compatibility.
- Confirm camera-testing requirements.
- Identify available frontend-design skill.
- Load the skill.
- Document technical constraints.

DELIVERABLE:

A working iOS project and a short environment report.

IMPORTANT:

Do not assume Foundation Models works on
an unsupported iPhone or simulator.

Do not claim physical camera functionality
has been tested without an actual camera.

PHASE 1 — CORE APPLICATION FOUNDATION

OBJECTIVE:
Create the application foundation.

TASKS:

- Set up SwiftUI app lifecycle.
- Create navigation.
- Create dependency container.
- Define core models.
- Set up SwiftData.
- Define visual design system.
- Build the initial Today screen.
- Build the checklist screen.

DELIVERABLE:

A working native application with functional
navigation and persistent state.

PHASE 2 — LOCAL AI ENGINE

OBJECTIVE:
Implement real on-device event understanding.

TASKS:

- Implement local AI provider.
- Check availability.
- Define structured output.
- Create event interpretation instructions.
- Generate preparation recommendations.
- Validate output.
- Merge saved user preferences.
- Persist generated plans.
- Test multiple events.
- Test offline inference.

DELIVERABLE:

Real event input produces useful preparation
suggestions using local inference.

ACCEPTANCE TEST:

Disable internet access.

Generate a preparation checklist for an event
that was not previously processed.

No cloud request should occur.

PHASE 3 — CALENDAR INTEGRATION

OBJECTIVE:
Connect actual calendar data.

TASKS:

- Request EventKit access.
- Fetch upcoming events.
- Select next relevant event.
- Display event details.
- Pass event context to Local AI.
- Persist prepared event plans.
- Handle permission denial.

DELIVERABLE:

A genuine Apple Calendar event appears
in Depart and produces a preparation checklist.

PHASE 4 — ESSENTIALS LIBRARY

OBJECTIVE:
Allow users to register important belongings.

TASKS:

- Build essential registration screen.
- Implement camera capture.
- Save reference images.
- Store essential metadata.
- Associate essentials with event categories.
- Enable editing and deletion.
- Persist essential data.

DELIVERABLE:

A user can register a real physical object,
restart the app, and retrieve its saved reference.

PHASE 5 — DEPART VISION

OBJECTIVE:
Implement genuine local visual verification.

TASKS:

- Create camera scanner.
- Implement guided image crop.
- Generate Vision feature prints.
- Compare scans against references.
- Implement verification decision logic.
- Display uncertain outcomes.
- Add manual confirmation.
- Update checklist verification status.
- Test positive and negative examples.

DELIVERABLE:

A registered object can be scanned and
compared locally.

ACCEPTANCE TESTS:

1. Registered object produces an appropriate match.
2. Unrelated object is not confidently verified.
3. Verification works in Airplane Mode.
4. Uncertain matches are handled gracefully.
5. Checklist updates after verification.

PHASE 6 — DEPARTURE AND NOTIFICATIONS

OBJECTIVE:
Connect preparation with time-based reminders.

TASKS:

- Implement departure calculator.
- Add manual travel estimates.
- Add arrival buffer settings.
- Schedule local notifications.
- Avoid duplicate notifications.
- Persist reminder state.
- Handle updated event times.
- Include checklist status in reminder content.

DELIVERABLE:

The user receives a scheduled preparation
or departure reminder.

PHASE 7 — OFFLINE VALIDATION

OBJECTIVE:
Prove the core application survives
cloud disconnection.

TASKS:

- Disable internet access.
- Reopen Depart.
- Access cached events.
- Generate a new local AI checklist.
- Scan a registered object.
- Update verification state.
- Calculate departure time.
- Schedule a notification.
- Restart the application.
- Verify persistence.

DELIVERABLE:

A reproducible offline demonstration.

PHASE 8 — POLISH AND DEMO MODE

OBJECTIVE:
Prepare for judging.

TASKS:

- Improve visual consistency.
- Add empty states.
- Add permission error states.
- Add model unavailable states.
- Add meaningful loading states.
- Improve camera guidance.
- Add a clearly labeled demo scenario.
- Add a simulated departure trigger.
- Build an intelligence diagnostics panel.

DIAGNOSTICS PANEL:

Show:

- Local AI availability
- Model status
- Network status
- Calendar access
- Camera access
- Number of registered essentials
- Current event category
- AI inference duration
- Verification method
- Data source freshness

Use actual measured values.

Do not fabricate benchmarks.

DELIVERABLE:

A visually polished and reliable
end-to-end demonstration.

PHASE 9 — TESTING AND SUBMISSION

OBJECTIVE:
Prepare the public repository and submission.

TASKS:

- Run available tests.
- Compile the application.
- Resolve critical warnings.
- Verify permissions.
- Verify offline behavior.
- Validate sample workflow.
- Create README.
- Document architecture.
- Document local AI implementation.
- Document model and framework usage.
- Document required hardware.
- Document known limitations.
- Document existing assets.
- Disclose AI development tools.
- Prepare one-minute demo script.
- Provide reproduction instructions.

Do not make commits after the hackathon's
official code-freeze deadline.

Do not submit more than once.

--------------------------------------------------
13. TESTING REQUIREMENTS
--------------------------------------------------

Implement meaningful tests where feasible.

UNIT TESTS:

- Departure-time calculations
- Arrival buffer calculations
- Event selection logic
- Checklist state transitions
- Preference merging
- Essential verification state handling
- Date boundary behavior

INTEGRATION TESTS:

- EventKit event retrieval
- Plan persistence
- Reference image persistence
- Notification scheduling
- Local model availability handling

VISION TESTS:

- Same object, different image
- Different object
- Different lighting
- Different backgrounds
- Ambiguous similarity results

OFFLINE TESTS:

- No internet
- App relaunch
- Locally cached event
- New on-device inference
- Visual matching
- Checklist persistence
- Local reminders

Only report tests that were actually executed.

Separate simulator tests from physical device tests.

--------------------------------------------------
14. SECURITY AND PRIVACY REQUIREMENTS
--------------------------------------------------

The application processes sensitive personal context.

Requirements:

- Request permissions explicitly.
- Explain why permissions are needed.
- Minimize stored personal information.
- Store reference images privately.
- Avoid unnecessary retention of camera captures.
- Avoid uploading camera images.
- Avoid unnecessary storage of ID text.
- Support deleting registered essentials.
- Do not include secrets in the repository.
- Do not log sensitive calendar descriptions.
- Do not log raw personal image data.
- Use file protection where appropriate.

Any future cloud integration must use a clear
data-sharing boundary.

--------------------------------------------------
15. DEMO MODE REQUIREMENTS
--------------------------------------------------

Create a reliable demonstration without
misrepresenting implementation.

DEMO SCENARIO:

Upcoming event:
"Client Presentation"

Event time:
A configurable future time.

Essentials:
- Company ID
- Laptop charger
- Presentation materials

The demo should support:

1. Selecting the example event.
2. Generating a real local AI checklist.
3. Scanning a registered essential.
4. Updating verification status.
5. Calculating departure time.
6. Triggering a simulated departure.
7. Demonstrating actual offline inference.

Important:

Demo events may be predefined.

AI outputs and image recognition results must
come from actual processing when represented
as genuine AI functionality.

Show a visible Demo Mode label.

--------------------------------------------------
16. SUCCESS CRITERIA
--------------------------------------------------

The application is considered successful when:

[ ] It launches on the target device.

[ ] It uses real on-device language inference
    on supported hardware.

[ ] It can read a real Apple Calendar event.

[ ] It generates a preparation checklist.

[ ] It stores user preferences locally.

[ ] It allows registering a personal essential.

[ ] It captures a new image for verification.

[ ] It compares the image against saved references.

[ ] It handles uncertain visual matches.

[ ] It updates preparation status.

[ ] It calculates a departure time.

[ ] It can schedule a local notification.

[ ] It retains relevant data after restarting.

[ ] It performs core AI tasks offline.

[ ] It exposes truthful diagnostic information.

[ ] It includes reproducible build instructions.

[ ] It includes hackathon disclosures.

--------------------------------------------------
17. HACKATHON JUDGING OPTIMIZATION
--------------------------------------------------

Optimize the project for the following criteria.

PROBLEM & USEFULNESS — 25%

Demonstrate a recognizable everyday problem:

Forgetting important belongings before leaving.

LOCAL AI IMPLEMENTATION — 25%

Demonstrate genuine on-device:

- Natural-language event interpretation
- Preparation recommendations
- Visual feature extraction
- Image similarity analysis

TECHNICAL EXECUTION — 20%

Show:

- Clean architecture
- Native platform integration
- Persistent state
- Offline operation
- Graceful error handling
- Reliable workflow

INNOVATION — 15%

Highlight the combination of:

- Digital schedule awareness
- Contextual preparation
- Personal object memory
- Physical visual verification

PRODUCT & DEMO QUALITY — 15%

Create a polished and understandable workflow.

Prioritize clarity, responsiveness, and stability.

--------------------------------------------------
18. DEVELOPMENT PRIORITIES
--------------------------------------------------

If time becomes limited, use this order:

PRIORITY 0:
- Working SwiftUI app
- Real local AI inference
- AI-generated checklist
- Persistent user preferences

PRIORITY 1:
- Real calendar integration
- Essential registration
- Camera image comparison

PRIORITY 2:
- Departure calculation
- Local notifications
- Offline demonstration

PRIORITY 3:
- UI polish
- Diagnostics
- Optional OCR

DEFER:
- HealthKit
- Live traffic
- WeatherKit
- Background geofencing
- Cloud LLM integration
- Multi-object real-time detection

Do not sacrifice functioning P0/P1 capabilities
to add deferred features.

--------------------------------------------------
19. REQUIRED DOCUMENTATION
--------------------------------------------------

Create:

README.md

Include:
- Project overview
- Problem statement
- Features
- Supported devices
- Installation instructions
- Required permissions
- How to run
- How to test offline
- Screenshots when available

ARCHITECTURE.md

Include:
- Component responsibilities
- System architecture
- Data flow
- Local inference boundary
- Storage approach

LOCAL_AI.md

Include:
- Models used
- Inference framework
- Input and output structure
- What runs locally
- What requires connectivity
- Known limitations

TESTING.md

Include:
- Tests performed
- Devices tested
- Results
- Known failures
- Reproduction steps

DISCLOSURES.md

Include:
- Existing code used
- Existing assets used
- Pretrained models
- External packages
- AI coding tools used
- Cloud services used
- Any other required hackathon disclosures

Do not fabricate disclosure details.

--------------------------------------------------
20. AGENT EXECUTION RULES
--------------------------------------------------

You are expected to implement the project,
not merely explain how to implement it.

Follow these rules:

1. Inspect the environment and repository first.

2. Invoke the frontend-design skill before UI work.

3. Verify platform compatibility before choosing
   model-dependent implementations.

4. Create a small, functional vertical slice first.

5. Prefer working native Apple frameworks.

6. Use real APIs and valid Swift syntax.

7. Compile and test whenever the environment permits.

8. Fix compile errors before progressing.

9. Do not create placeholder methods that silently
   report successful operations.

10. Do not simulate AI results in normal production mode.

11. Clearly separate Demo Mode from real operation.

12. Keep architecture modular but avoid overengineering.

13. Handle permissions and unavailable services gracefully.

14. Preserve user data and preferences across app launches.

15. Do not add unnecessary dependencies.

16. Keep the user informed of completed phases and blockers.

17. Never claim a feature is working without appropriate
    verification.

18. Never claim tests passed unless they were executed.

19. Do not commit secrets, private data, or personal ID images.

20. Respect the hackathon code-freeze deadline.

--------------------------------------------------
21. IMPLEMENTATION REPORTING
--------------------------------------------------

After each phase, provide a concise report:

PHASE:
Name

IMPLEMENTED:
What was actually completed

FILES CHANGED:
Relevant source files

VALIDATION:
Build or test commands executed and results

BLOCKERS:
Any actual technical constraints

NEXT:
Next development phase

Do not repeatedly stop for approval when the
requirements are clear and the next action is safe.

Continue implementing the highest-priority
remaining functionality.

Ask for clarification only when an essential
hardware or configuration decision cannot
be resolved through environment inspection.

--------------------------------------------------
22. FINAL DELIVERABLE
--------------------------------------------------

Deliver:

1. A working native iOS application.
2. Actual on-device AI functionality.
3. Actual local computer vision processing.
4. Functional preparation checklists.
5. Persistent registered essentials.
6. Calendar-based event planning.
7. Departure calculations and notifications.
8. An offline demonstration workflow.
9. Technical documentation.
10. Hackathon submission preparation materials.

If a requested capability cannot be completed,
report that clearly.

Do not claim production readiness.

Do not misrepresent simulated capabilities
as implemented native integrations.

--------------------------------------------------
23. FIRST ACTIONS — START NOW
--------------------------------------------------

Immediately perform the following:

STEP 1:
Inspect the repository and development environment.

STEP 2:
Locate and invoke the frontend-design skill.

STEP 3:
Verify iOS, Xcode, and Foundation Models compatibility.

STEP 4:
Create or validate the SwiftUI project.

STEP 5:
Implement the minimal local AI preparation workflow.

STEP 6:
Run the first available build and tests.

STEP 7:
Proceed through the remaining phases in priority order.

Do not spend the first development phase creating
only static mockups.

The first major milestone must demonstrate
genuine on-device inference.

PROJECT MISSION:

Build Depart as a reliable, polished,
offline-first AI assistant that understands
where users are going and helps them
visually verify essential belongings
before leaving.

The final product must answer:

"Why does this product benefit from running AI locally?"

ANSWER:

Because Depart combines private calendar context,
personal routines, and camera observations to help
users prepare for real-world activities.

Running AI locally keeps this sensitive information
on the device, provides immediate visual feedback,
and allows the core preparation workflow to function
even when cloud connectivity disappears.

DEPART.
Never leave unprepared.