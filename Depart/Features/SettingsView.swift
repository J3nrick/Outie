import SwiftUI

struct SettingsView: View {
    @Bindable var viewModel: PreparationViewModel
    @State private var connections = ConnectionsService()
    @Environment(\.scenePhase) private var scenePhase
    var body: some View {
        Form {
            Section {
                Toggle("Demo Mode", isOn: Binding(get: { viewModel.preferences.demoEnabled }, set: viewModel.setDemoEnabled))
                    .accessibilityIdentifier("demo-mode-toggle")
            } header: { Text("Explore Depart") } footer: {
                Text("Uses a sample presentation and example belongings. Demo changes stay separate from your personal plans. Turning it off keeps your demo checklist saved.")
            }
            Section {
                Stepper(value: Binding(get: { viewModel.preferences.arrivalBufferMinutes }, set: viewModel.setArrivalBuffer), in: 0...120, step: 5) {
                    LabeledContent("Arrival buffer", value: "\(viewModel.preferences.arrivalBufferMinutes) min")
                }
                .accessibilityIdentifier("arrival-buffer")
            } header: { Text("Preparation preferences") } footer: {
                Text("Your buffer is saved for departure planning. Departure calculations and reminders aren’t available in this build.")
            }
            Section("On-device intelligence") {
                VStack(alignment: .leading, spacing: 8) {
                    Label(viewModel.modelStatus.title, systemImage: "cpu")
                        .font(.headline).accessibilityIdentifier("model-status")
                    Text(viewModel.modelStatus.explanation)
                        .font(.subheadline).foregroundStyle(DepartPalette.slate)
                }
                Button("Check model availability", action: viewModel.refreshModelStatus)
                    .frame(minHeight: 44)
                    .accessibilityIdentifier("refresh-model-status")
            }
            Section("Your privacy") {
                Label("Plans and preferences stay on this device", systemImage: "lock.shield")
                Text("Depart makes no cloud AI requests. This build checks local model availability and saves checklist changes; it does not generate AI suggestions. Calendar access and camera previews stay on this device.")
                    .font(.subheadline).foregroundStyle(DepartPalette.slate)
            }
            Section("Connections") {
                ForEach(ConnectionKind.allCases) { kind in
                    NavigationLink {
                        ConnectionDetailView(kind: kind, service: connections)
                    } label: {
                        VStack(alignment: .leading, spacing: 4) {
                            Label(kind.rawValue, systemImage: kind.symbol)
                            Text(connections.access(for: kind).title)
                                .font(.subheadline).foregroundStyle(DepartPalette.slate)
                        }
                    }
                    .accessibilityIdentifier("connection-\(kind.rawValue.lowercased())")
                }
            }
            Section {
                Text("DEPART").font(.headline)
                Text("Never Leave Unprepared.").font(.subheadline).foregroundStyle(DepartPalette.slate)
            }
        }
        .scrollContentBackground(.hidden)
        .background(DepartPalette.background)
        .navigationTitle("Settings")
        .onAppear { viewModel.refreshModelStatus() }
        .task { await connections.refresh() }
        .onChange(of: scenePhase) { _, phase in
            if phase == .active { Task { await connections.refresh() } }
        }
    }
}
