import Foundation
import SwiftData

final class LocalStore {
    let container: ModelContainer
    let context: ModelContext

    static var schema: Schema {
        Schema([CalendarEvent.self, DeparturePlan.self, PreparationItem.self,
                RegisteredEssential.self, UserPreferences.self,
                EssentialVerification.self, CachedTravelEstimate.self])
    }

    init(url: URL? = nil, inMemory: Bool = false) throws {
        let schema = Self.schema
        let configuration: ModelConfiguration
        if inMemory {
            configuration = ModelConfiguration(schema: schema, isStoredInMemoryOnly: true, cloudKitDatabase: .none)
        } else {
            let storeURL: URL
            if let url {
                storeURL = url
            } else {
                let support = try FileManager.default.url(for: .applicationSupportDirectory, in: .userDomainMask,
                                                           appropriateFor: nil, create: true)
                storeURL = support.appending(path: "DepartData/Depart.store")
            }
            let directory = storeURL.deletingLastPathComponent()
            try FileManager.default.createDirectory(at: directory, withIntermediateDirectories: true)
            try FileManager.default.setAttributes([
                .protectionKey: FileProtectionType.completeUntilFirstUserAuthentication
            ], ofItemAtPath: directory.path)
            configuration = ModelConfiguration(schema: schema, url: storeURL, cloudKitDatabase: .none)
        }
        container = try ModelContainer(for: schema, configurations: [configuration])
        context = ModelContext(container)
        context.autosaveEnabled = false
    }

    func save(_ change: () throws -> Void) throws {
        do {
            try change()
            try context.save()
        } catch {
            context.rollback()
            throw error
        }
    }
}
