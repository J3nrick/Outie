import Foundation
import Observation

final class AppContainer {
    let store: LocalStore
    let repository: PreparationRepository
    let availability: ModelAvailabilityService
    let viewModel: PreparationViewModel

    init(store: LocalStore) throws {
        self.store = store
        repository = PreparationRepository(store: store)
        availability = ModelAvailabilityService()
        viewModel = try PreparationViewModel(repository: repository, availability: availability)
    }

    static func live() throws -> AppContainer {
        var url: URL?
        #if DEBUG
        // UI automation gets a separate on-disk store, retained across test app relaunches.
        let arguments = ProcessInfo.processInfo.arguments
        if let index = arguments.firstIndex(of: "-ui-testing-store"), arguments.indices.contains(index + 1),
           let identifier = UUID(uuidString: arguments[index + 1]) {
            let directory = try FileManager.default.url(for: .applicationSupportDirectory, in: .userDomainMask,
                                                        appropriateFor: nil, create: true)
            url = directory.appending(path: "UITests/\(identifier.uuidString)/Depart.store")
        }
        #endif
        return try AppContainer(store: LocalStore(url: url))
    }
}

@Observable final class AppBootstrap {
    var container: AppContainer?
    var failed = false
    init() { openStore() }

    func openStore() {
        do {
            container = try AppContainer.live()
            failed = false
        } catch {
            container = nil
            failed = true
        }
    }
}
