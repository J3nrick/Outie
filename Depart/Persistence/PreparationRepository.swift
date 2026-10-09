import Foundation
import SwiftData

enum RepositoryError: LocalizedError {
    case emptyItemName, itemNameTooLong
    var errorDescription: String? {
        switch self {
        case .emptyItemName: "Enter an item name."
        case .itemNameTooLong: "Use an item name of 120 characters or fewer."
        }
    }
}

final class PreparationRepository {
    let store: LocalStore
    init(store: LocalStore) { self.store = store }

    func preferences() throws -> UserPreferences {
        if let existing = try store.context.fetch(FetchDescriptor<UserPreferences>()).first { return existing }
        let preferences = UserPreferences()
        try store.save { store.context.insert(preferences) }
        return preferences
    }

    func plans(scope: RecordScope) throws -> [DeparturePlan] {
        let scopeRaw = scope.rawValue
        return try store.context.fetch(FetchDescriptor<DeparturePlan>(
            predicate: #Predicate { $0.scopeRaw == scopeRaw },
            sortBy: [SortDescriptor(\DeparturePlan.eventStartDate)]))
    }

    func nextPlan(scope: RecordScope, now: Date = .now) throws -> DeparturePlan? {
        try plans(scope: scope).first { $0.eventStartDate >= now }
    }

    func essentials(scope: RecordScope) throws -> [RegisteredEssential] {
        let scopeRaw = scope.rawValue
        return try store.context.fetch(FetchDescriptor<RegisteredEssential>(
            predicate: #Predicate { $0.scopeRaw == scopeRaw },
            sortBy: [SortDescriptor(\RegisteredEssential.name)]))
    }

    /// Called only when the user explicitly enables Demo Mode. Never seeds a personal plan.
    func setDemoEnabled(_ enabled: Bool, now: Date = .now) throws {
        let preferences = try preferences()
        let needsScenario = if enabled { try nextPlan(scope: .demo, now: now) == nil } else { false }
        try store.save {
            if needsScenario { try insertDemoScenario(now: now) }
            preferences.demoEnabled = enabled
        }
    }

    private func insertDemoScenario(now: Date) throws {
        let event = CalendarEvent(title: "Client Presentation", startDate: now.addingTimeInterval(7200),
                                  destination: "BGC, Taguig", scope: .demo)
        store.context.insert(event)
        let plan = DeparturePlan(eventTitle: event.title, eventStartDate: event.startDate,
                                 destination: event.destination, scope: .demo, source: .demo)
        plan.calendarEventID = event.id
        store.context.insert(plan)
        let existingEssentials = try essentials(scope: .demo)
        for (index, name) in ["Company ID", "Laptop", "Laptop charger", "Presentation materials"].enumerated() {
            let item = PreparationItem(name: name, reason: "Example for the presentation demo.", source: .demo, sortOrder: index)
            if name == "Company ID" || name == "Laptop charger" {
                let essential: RegisteredEssential
                if let existing = existingEssentials.first(where: { $0.name == name }) {
                    essential = existing
                } else {
                    essential = RegisteredEssential(name: name, category: .work, scope: .demo)
                    store.context.insert(essential)
                }
                item.relatedEssentialID = essential.id
            }
            store.context.insert(item)
            item.plan = plan
        }
    }

    func toggleManualConfirmation(_ item: PreparationItem, now: Date = .now) throws {
        try store.save {
            item.status = item.status.isChecked ? .notChecked : .manuallyConfirmed
            item.checkedAt = item.status.isChecked ? now : nil
            item.updatedAt = now
            item.plan?.updatedAt = now
        }
    }

    @discardableResult
    func addItem(name: String, to plan: DeparturePlan, now: Date = .now) throws -> PreparationItem {
        let trimmed = name.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmed.isEmpty else { throw RepositoryError.emptyItemName }
        guard trimmed.count <= 120 else { throw RepositoryError.itemNameTooLong }
        let item = PreparationItem(name: trimmed, sortOrder: (plan.items.map(\.sortOrder).max() ?? -1) + 1)
        try store.save {
            store.context.insert(item)
            item.plan = plan
            plan.updatedAt = now
        }
        return item
    }

    func removeItem(_ item: PreparationItem, from plan: DeparturePlan) throws {
        try store.save {
            plan.items.removeAll { $0.id == item.id }
            store.context.delete(item)
            plan.updatedAt = .now
        }
    }

    func updateArrivalBuffer(_ value: Int) throws {
        let preferences = try preferences()
        try store.save { preferences.arrivalBufferMinutes = min(120, max(0, value)) }
    }
}
