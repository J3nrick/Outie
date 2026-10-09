import SwiftUI

@main struct DepartApp: App {
    @State private var bootstrap = AppBootstrap()

    var body: some Scene {
        WindowGroup {
            Group {
                if let container = bootstrap.container {
                    RootView(viewModel: container.viewModel)
                } else {
                    ContentUnavailableView {
                        Label("Local data couldn’t be opened", systemImage: "externaldrive.badge.exclamationmark")
                    } description: {
                        Text("Depart keeps your plans on this device. Try opening your saved data again; it hasn’t been replaced or reset.")
                    } actions: {
                        Button("Try again", action: bootstrap.openStore)
                            .buttonStyle(.borderedProminent)
                    }
                }
            }
            .tint(DepartPalette.teal)
            .preferredColorScheme(.light)
        }
    }
}
