import SwiftUI

enum DepartTab: Hashable { case today, essentials, settings }

struct RootView: View {
    @Bindable var viewModel: PreparationViewModel
    @State private var selectedTab: DepartTab = .today
    @State private var todayPath: [UUID] = []
    @State private var essentialsPath: [UUID] = []
    @Environment(\.scenePhase) private var scenePhase
    @Environment(\.accessibilityReduceTransparency) private var reduceTransparency

    var body: some View {
        tabs
            .alert("Couldn’t save your change", isPresented: Binding(
                get: { viewModel.errorMessage != nil },
                set: { if !$0 { viewModel.errorMessage = nil } })) {
                    Button("OK") { viewModel.errorMessage = nil }
                } message: { Text(viewModel.errorMessage ?? "Try again.") }
            .onChange(of: scenePhase) { _, phase in if phase == .active { viewModel.refresh() } }
            .onChange(of: viewModel.scope) { _, _ in
                todayPath.removeAll()
                essentialsPath.removeAll()
            }
            .onChange(of: viewModel.nextPlan?.id) { _, _ in todayPath.removeAll() }
            .modifier(UITestAccessibilityOverrides())
    }

    private var tabs: some View {
        TabView(selection: $selectedTab) {
            Tab("Today", systemImage: "door.left.hand.open", value: .today) {
                NavigationStack(path: $todayPath) { TodayView(viewModel: viewModel) }
            }
            Tab("Essentials", systemImage: "square.grid.2x2", value: .essentials) {
                NavigationStack(path: $essentialsPath) { EssentialsView(viewModel: viewModel) }
            }
            Tab("Settings", systemImage: "slider.horizontal.3", value: .settings) {
                NavigationStack { SettingsView(viewModel: viewModel) }
            }
        }
        .toolbarBackground(reduceTransparency ? DepartPalette.surface : DepartPalette.background, for: .tabBar)
        .toolbarBackground(.visible, for: .tabBar)
    }
}

private struct UITestAccessibilityOverrides: ViewModifier {
    func body(content: Content) -> some View {
        #if DEBUG
        if ProcessInfo.processInfo.arguments.contains("-ui-testing-accessibility") {
            content.environment(\.dynamicTypeSize, .accessibility3)
        } else {
            content
        }
        #else
        content
        #endif
    }
}
