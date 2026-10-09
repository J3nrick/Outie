import Foundation
import SwiftData
import Testing
@testable import Depart

@MainActor struct PreparationRepositoryTests {
    private func repository() throws -> PreparationRepository {
        PreparationRepository(store: try LocalStore(inMemory: true))
    }

    @Test func `normal mode starts empty and demo is an explicit choice`() throws {
        let repository = try repository()
        #expect(try !repository.preferences().demoEnabled)
        #expect(try repository.plans(scope: .personal).isEmpty)
        #expect(try repository.plans(scope: .demo).isEmpty)
        try repository.setDemoEnabled(true)
        let plan = try #require(try repository.nextPlan(scope: .demo))
        #expect(plan.items.count == 4)
        #expect(plan.items.allSatisfy { $0.source == .demo && $0.status == .notChecked })
        #expect(plan.recommendedDepartureDate == nil)
        #expect(try repository.essentials(scope: .demo).count == 2)
        #expect(try repository.plans(scope: .personal).isEmpty)
    }

    @Test(arguments: VerificationStatus.allCases)
    func `manual toggles never manufacture visual evidence`(initial: VerificationStatus) throws {
        let repository = try repository()
        try repository.setDemoEnabled(true)
        let plan = try #require(try repository.nextPlan(scope: .demo))
        let item = try #require(plan.items.first)
        try repository.store.save { item.status = initial }
        let timestamp = Date(timeIntervalSince1970: 1_700_000_000)
        try repository.toggleManualConfirmation(item, now: timestamp)
        #expect(item.status == (initial.isChecked ? .notChecked : .manuallyConfirmed))
        #expect(item.checkedAt == (initial.isChecked ? nil : timestamp))
        #expect(plan.visuallyCheckedCount == 0)
    }

    @Test func `edited demo is not reseeded when toggled`() throws {
        let repository = try repository()
        try repository.setDemoEnabled(true)
        let plan = try #require(try repository.nextPlan(scope: .demo))
        let item = try #require(plan.items.first)
        try repository.toggleManualConfirmation(item)
        try repository.addItem(name: "  Printed agenda  ", to: plan)
        let removed = try #require(plan.items.first(where: { $0.name == "Laptop" }))
        try repository.removeItem(removed, from: plan)
        try repository.setDemoEnabled(false)
        try repository.setDemoEnabled(true)
        let reloaded = try #require(try repository.nextPlan(scope: .demo))
        #expect(reloaded.id == plan.id)
        #expect(reloaded.items.contains { $0.name == "Printed agenda" && $0.source == .user })
        #expect(!reloaded.items.contains { $0.name == "Laptop" })
        #expect(item.status == .manuallyConfirmed)
        #expect(try repository.plans(scope: .demo).count == 1)
    }

    @Test func `disk reopen preserves edits preferences essentials and event snapshot`() throws {
        let url = FileManager.default.temporaryDirectory.appending(path: "\(UUID())/Depart.store")
        defer { try? FileManager.default.removeItem(at: url.deletingLastPathComponent()) }
        var planID: UUID?
        do {
            let repository = PreparationRepository(store: try LocalStore(url: url))
            try repository.setDemoEnabled(true)
            let plan = try #require(try repository.nextPlan(scope: .demo))
            planID = plan.id
            let item = try #require(plan.items.first(where: { $0.name == "Company ID" }))
            try repository.toggleManualConfirmation(item)
            try repository.addItem(name: "Printed agenda", to: plan)
            let removed = try #require(plan.items.first(where: { $0.name == "Laptop" }))
            try repository.removeItem(removed, from: plan)
            try repository.updateArrivalBuffer(25)
        }
        let repository = PreparationRepository(store: try LocalStore(url: url))
        let plan = try #require(try repository.nextPlan(scope: .demo))
        #expect(plan.id == planID)
        #expect(try repository.preferences().demoEnabled)
        #expect(try repository.preferences().arrivalBufferMinutes == 25)
        #expect(plan.items.first { $0.name == "Company ID" }?.status == .manuallyConfirmed)
        #expect(plan.items.contains { $0.name == "Printed agenda" && $0.source == .user })
        #expect(!plan.items.contains { $0.name == "Laptop" })
        #expect(try repository.essentials(scope: .demo).count == 2)
        #expect(try repository.store.context.fetch(FetchDescriptor<CalendarEvent>()).count == 1)
    }

    @Test func `personal records are isolated from demo edits`() throws {
        let repository = try repository()
        let personal = DeparturePlan(eventTitle: "Personal appointment", eventStartDate: .now.addingTimeInterval(3600),
                                     destination: nil, scope: .personal)
        try repository.store.save { repository.store.context.insert(personal) }
        try repository.addItem(name: "Personal documents", to: personal)
        try repository.setDemoEnabled(true)
        let demo = try #require(try repository.nextPlan(scope: .demo))
        try repository.toggleManualConfirmation(try #require(demo.items.first))
        try repository.setDemoEnabled(false)
        let selected = try #require(try repository.nextPlan(scope: .personal))
        #expect(selected.id == personal.id)
        #expect(selected.items.count == 1)
        #expect(selected.items[0].status == .notChecked)
        #expect(try repository.essentials(scope: .personal).isEmpty)
    }

    @Test func `blank or overlong names leave the checklist unchanged`() throws {
        let repository = try repository()
        try repository.setDemoEnabled(true)
        let plan = try #require(try repository.nextPlan(scope: .demo))
        #expect(throws: RepositoryError.self) { try repository.addItem(name: " \n ", to: plan) }
        #expect(throws: RepositoryError.self) { try repository.addItem(name: String(repeating: "a", count: 121), to: plan) }
        #expect(plan.items.count == 4)
    }

    @Test func `deleting a plan deletes its checklist without deleting other scopes`() throws {
        let repository = try repository()
        try repository.setDemoEnabled(true)
        let demo = try #require(try repository.nextPlan(scope: .demo))
        let personal = DeparturePlan(eventTitle: "Appointment", eventStartDate: .now.addingTimeInterval(3600),
                                     destination: nil, scope: .personal)
        try repository.store.save { repository.store.context.insert(personal) }
        try repository.addItem(name: "Documents", to: personal)
        try repository.store.save { repository.store.context.delete(demo) }
        let items = try repository.store.context.fetch(FetchDescriptor<PreparationItem>())
        #expect(items.count == 1)
        #expect(items[0].name == "Documents")
    }

    @Test func `failed save transaction rolls back an edited state`() throws {
        enum SaveFailure: Error { case deliberate }
        let repository = try repository()
        try repository.setDemoEnabled(true)
        let plan = try #require(try repository.nextPlan(scope: .demo))
        let item = try #require(plan.items.first)
        #expect(throws: SaveFailure.self) {
            try repository.store.save {
                item.status = .manuallyConfirmed
                throw SaveFailure.deliberate
            }
        }
        #expect(item.status == .notChecked)
    }

    @Test func `expired plans are not the next departure`() throws {
        let repository = try repository()
        let now = Date.now
        let expired = DeparturePlan(eventTitle: "Past", eventStartDate: now.addingTimeInterval(-60), destination: nil, scope: .personal)
        let upcoming = DeparturePlan(eventTitle: "Next", eventStartDate: now.addingTimeInterval(60), destination: nil, scope: .personal)
        try repository.store.save {
            repository.store.context.insert(expired)
            repository.store.context.insert(upcoming)
        }
        #expect(try repository.nextPlan(scope: .personal, now: now)?.id == upcoming.id)
    }
}
