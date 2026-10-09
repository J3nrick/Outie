import Foundation
import SwiftData

nonisolated enum RecordScope: String, Codable, Sendable { case personal, demo }
nonisolated enum EventCategory: String, Codable, CaseIterable, Sendable {
    case work, travel, sports, appointment, other
    var title: String { rawValue.capitalized }
}
nonisolated enum PreparationSource: String, Codable, Sendable {
    case localAI, personalPreference, user, demo
    var title: String {
        switch self {
        case .localAI: "AI suggestion"
        case .personalPreference: "Saved preference"
        case .user: "Added by you"
        case .demo: "Demo example"
        }
    }
}
nonisolated enum GenerationSource: String, Codable, Sendable { case localAI, manual, demo }
nonisolated enum VerificationStatus: String, Codable, CaseIterable, Sendable {
    case notChecked, possibleMatch, visuallyVerified, manuallyConfirmed
    var title: String {
        switch self {
        case .notChecked: "Not checked"
        case .possibleMatch: "Possible match"
        case .visuallyVerified: "Visually checked"
        case .manuallyConfirmed: "Confirmed by you"
        }
    }
    var isChecked: Bool { self == .visuallyVerified || self == .manuallyConfirmed }
}
nonisolated enum VerificationMethod: String, Codable, Sendable { case visionFeaturePrint, manual }

@Model final class CalendarEvent {
    @Attribute(.unique) var id: UUID
    var externalIdentifier: String?
    var title: String
    var startDate: Date
    var endDate: Date
    var destination: String?
    var isAllDay: Bool
    var scopeRaw: String
    var capturedAt: Date

    init(title: String, startDate: Date, destination: String?, scope: RecordScope) {
        id = UUID()
        self.title = title
        self.startDate = startDate
        endDate = startDate.addingTimeInterval(3600)
        self.destination = destination
        isAllDay = false
        scopeRaw = scope.rawValue
        capturedAt = .now
    }
}

@Model final class DeparturePlan {
    @Attribute(.unique) var id: UUID
    var calendarEventID: UUID?
    var eventTitle: String
    var eventStartDate: Date
    var destination: String?
    var categoryRaw: String
    var scopeRaw: String
    var estimatedTravelMinutes: Int?
    var arrivalBufferMinutes: Int
    var recommendedDepartureDate: Date?
    var summary: String
    var generationSourceRaw: String
    var createdAt: Date
    var updatedAt: Date
    @Relationship(deleteRule: .cascade, inverse: \PreparationItem.plan)
    var items: [PreparationItem]

    var scope: RecordScope { RecordScope(rawValue: scopeRaw) ?? .personal }
    var category: EventCategory { EventCategory(rawValue: categoryRaw) ?? .other }
    var orderedItems: [PreparationItem] {
        items.sorted { $0.sortOrder == $1.sortOrder ? $0.createdAt < $1.createdAt : $0.sortOrder < $1.sortOrder }
    }
    var checkedCount: Int { items.filter { $0.status.isChecked }.count }
    var visuallyCheckedCount: Int { items.filter { $0.status == .visuallyVerified }.count }
    var manuallyCheckedCount: Int { items.filter { $0.status == .manuallyConfirmed }.count }

    init(eventTitle: String, eventStartDate: Date, destination: String?, scope: RecordScope,
         category: EventCategory = .work, source: GenerationSource = .manual) {
        id = UUID()
        self.eventTitle = eventTitle
        self.eventStartDate = eventStartDate
        self.destination = destination
        scopeRaw = scope.rawValue
        categoryRaw = category.rawValue
        arrivalBufferMinutes = 15
        summary = ""
        generationSourceRaw = source.rawValue
        createdAt = .now
        updatedAt = .now
        items = []
    }
}

@Model final class PreparationItem {
    @Attribute(.unique) var id: UUID
    var name: String
    var reason: String
    var sourceRaw: String
    var relatedEssentialID: UUID?
    var statusRaw: String
    var isRequired: Bool
    var sortOrder: Int
    var createdAt: Date
    var updatedAt: Date
    var checkedAt: Date?
    var plan: DeparturePlan?

    var source: PreparationSource { PreparationSource(rawValue: sourceRaw) ?? .user }
    var status: VerificationStatus {
        get { VerificationStatus(rawValue: statusRaw) ?? .notChecked }
        set { statusRaw = newValue.rawValue }
    }

    init(name: String, reason: String = "", source: PreparationSource = .user, sortOrder: Int = 0) {
        id = UUID()
        self.name = name
        self.reason = reason
        sourceRaw = source.rawValue
        statusRaw = VerificationStatus.notChecked.rawValue
        isRequired = true
        self.sortOrder = sortOrder
        createdAt = .now
        updatedAt = .now
    }
}

@Model final class RegisteredEssential {
    @Attribute(.unique) var id: UUID
    var name: String
    var categoryRaw: String
    var notes: String
    var associatedCategoryNames: [String]
    var referenceImagePaths: [String]
    var scopeRaw: String
    var createdAt: Date
    var updatedAt: Date

    var category: EventCategory { EventCategory(rawValue: categoryRaw) ?? .other }

    init(name: String, category: EventCategory, scope: RecordScope) {
        id = UUID()
        self.name = name
        categoryRaw = category.rawValue
        notes = ""
        associatedCategoryNames = [category.rawValue]
        referenceImagePaths = []
        scopeRaw = scope.rawValue
        createdAt = .now
        updatedAt = .now
    }
}

@Model final class UserPreferences {
    @Attribute(.unique) var id: String
    var demoEnabled: Bool
    var arrivalBufferMinutes: Int
    var preparationReminderMinutes: Int
    var manualTravelMinutes: Int?
    var manualTravelEstimates: [String: Int]
    var categoryItemPreferences: [String: [String]]
    var notificationsEnabled: Bool

    init() {
        id = "preferences"
        demoEnabled = false
        arrivalBufferMinutes = 15
        preparationReminderMinutes = 15
        manualTravelEstimates = [:]
        categoryItemPreferences = [:]
        notificationsEnabled = false
    }
}

@Model final class EssentialVerification {
    @Attribute(.unique) var id: UUID
    var essentialID: UUID
    var preparationItemID: UUID
    var statusRaw: String
    var similarityDistance: Float?
    var verifiedAt: Date
    var methodRaw: String

    init(essentialID: UUID, preparationItemID: UUID, status: VerificationStatus,
         method: VerificationMethod, similarityDistance: Float? = nil) {
        id = UUID()
        self.essentialID = essentialID
        self.preparationItemID = preparationItemID
        statusRaw = status.rawValue
        self.similarityDistance = similarityDistance
        verifiedAt = .now
        methodRaw = method.rawValue
    }
}

@Model final class CachedTravelEstimate {
    @Attribute(.unique) var id: UUID
    var destination: String
    var durationMinutes: Int
    var source: String
    var capturedAt: Date

    init(destination: String, durationMinutes: Int, source: String) {
        id = UUID()
        self.destination = destination
        self.durationMinutes = durationMinutes
        self.source = source
        capturedAt = .now
    }
}
