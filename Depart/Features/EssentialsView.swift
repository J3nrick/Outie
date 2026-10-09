import SwiftUI

struct EssentialsView: View {
    let viewModel: PreparationViewModel

    var body: some View {
        List {
            if viewModel.scope == .demo {
                Section { DemoBadge() }.listRowBackground(DepartPalette.background)
            }
            if viewModel.essentials.isEmpty {
                Section {
                    VStack(alignment: .leading, spacing: 16) {
                        Image(systemName: "square.grid.2x2").font(.largeTitle).foregroundStyle(DepartPalette.teal)
                            .accessibilityHidden(true)
                        Text("A place for your essentials").font(.title2.weight(.semibold))
                        Text("Your personal belongings will live here. Photo registration isn’t available in this build; you can confirm checklist items manually.")
                            .foregroundStyle(DepartPalette.slate)
                    }
                    .padding(.vertical, 16)
                    .accessibilityIdentifier("essentials-empty-state")
                }
            } else {
                Section {
                    ForEach(viewModel.essentials) { essential in
                        NavigationLink(value: essential.id) {
                            HStack(spacing: 16) {
                                Image(systemName: essential.name == "Company ID" ? "person.text.rectangle" : "powerplug")
                                    .font(.title2).foregroundStyle(DepartPalette.teal)
                                    .frame(width: 32).accessibilityHidden(true)
                                VStack(alignment: .leading, spacing: 4) {
                                    Text(essential.name).font(.headline)
                                    Text("\(essential.category.title) · No reference photos")
                                        .font(.subheadline).foregroundStyle(DepartPalette.slate)
                                }
                            }
                            .padding(.vertical, 8)
                        }
                    }
                } header: { Text(viewModel.scope == .demo ? "Demo essentials" : "Saved essentials") } footer: {
                    if viewModel.scope == .demo {
                        Text("These are sample belongings. No photos or visual matches have been created.")
                    }
                }
            }
        }
        .listRowBackground(DepartPalette.surface)
        .scrollContentBackground(.hidden)
        .background(DepartPalette.background)
        .navigationTitle("Essentials")
        .navigationDestination(for: UUID.self) { identifier in
            if let essential = viewModel.essentials.first(where: { $0.id == identifier }) {
                EssentialDetailView(essential: essential)
            }
        }
    }
}

private struct EssentialDetailView: View {
    let essential: RegisteredEssential
    var body: some View {
        List {
            if essential.scopeRaw == RecordScope.demo.rawValue { Section { DemoBadge() } }
            Section("About this essential") {
                LabeledContent("Category", value: essential.category.title)
                LabeledContent("Reference photos", value: "\(essential.referenceImagePaths.count)")
            }
            Section {
                Text("Reference photos haven’t been added, so this item can only be confirmed manually.")
                    .foregroundStyle(DepartPalette.slate)
            }
        }
        .scrollContentBackground(.hidden)
        .background(DepartPalette.background)
        .navigationTitle(essential.name)
        .navigationBarTitleDisplayMode(.inline)
    }
}
