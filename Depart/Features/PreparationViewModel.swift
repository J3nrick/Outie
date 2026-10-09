import Foundation
import Observation

@Observable final class PreparationViewModel {
    private let repository: PreparationRepository
    private let availability: ModelAvailabilityService
    let preferences: UserPreferences
    var nextPlan: DeparturePlan?
    var essentials: [RegisteredEssential] = []
    var modelStatus: LocalModelStatus = .unknown
    var errorMessage: String?

    var scope: RecordScope { preferences.demoEnabled ? .demo : .personal }

    init(repository: PreparationRepository, availability: ModelAvailabilityService) throws {
        self.repository = repository
        self.availability = availability
        preferences = try repository.preferences()
        try loadRecords()
        refreshModelStatus()
    }

    private func loadRecords() throws {
        nextPlan = try repository.nextPlan(scope: scope)
        essentials = try repository.essentials(scope: scope)
    }

    func refresh() {
        perform(error: "Your saved plans couldn’t be loaded. Try again.") { try loadRecords() }
        refreshModelStatus()
    }

    func refreshModelStatus() { modelStatus = availability.currentStatus() }

    func setDemoEnabled(_ enabled: Bool) {
        perform(error: "Demo Mode couldn’t be saved. Try again.") {
            try repository.setDemoEnabled(enabled)
            try loadRecords()
        }
    }

    func toggle(_ item: PreparationItem) {
        perform(error: "Your checklist change couldn’t be saved. Try again.") {
            try repository.toggleManualConfirmation(item)
        }
    }

    @discardableResult
    func addItem(_ name: String, to plan: DeparturePlan) -> Bool {
        perform(error: "Your item couldn’t be saved. Try again.") { try repository.addItem(name: name, to: plan) }
    }

    func remove(_ item: PreparationItem, from plan: DeparturePlan) {
        perform(error: "Your item couldn’t be removed. Try again.") { try repository.removeItem(item, from: plan) }
    }

    func setArrivalBuffer(_ value: Int) {
        perform(error: "Your arrival buffer couldn’t be saved. Try again.") { try repository.updateArrivalBuffer(value) }
    }

    @discardableResult
    private func perform(error message: String, _ action: () throws -> Void) -> Bool {
        do {
            try action()
            errorMessage = nil
            return true
        } catch let error as RepositoryError {
            errorMessage = error.localizedDescription
            return false
        } catch {
            errorMessage = message
            return false
        }
    }
}
