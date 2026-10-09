import SwiftUI

struct ChecklistView: View {
    let plan: DeparturePlan
    @Bindable var viewModel: PreparationViewModel
    @State private var showingAddItem = false

    var body: some View {
        List {
            Section {
                VStack(alignment: .leading, spacing: 12) {
                    if plan.scope == .demo { DemoBadge() }
                    Text(plan.eventTitle).font(.title2.weight(.semibold))
                    Text(plan.eventStartDate, format: .dateTime.month(.abbreviated).day().hour().minute())
                        .font(.subheadline).foregroundStyle(DepartPalette.slate)
                    EvidenceSummary(plan: plan)
                }
                .padding(.vertical, 8)
            }
            .listRowBackground(DepartPalette.surface)

            Section {
                if plan.items.isEmpty {
                    Text("Your checklist is empty. Add an item you want to bring.")
                        .foregroundStyle(DepartPalette.slate)
                        .accessibilityIdentifier("empty-checklist")
                }
                ForEach(plan.orderedItems) { item in
                    ChecklistItemRow(item: item) { viewModel.toggle(item) }
                        .swipeActions(edge: .trailing, allowsFullSwipe: false) {
                            Button("Remove", role: .destructive) { viewModel.remove(item, from: plan) }
                        }
                        .accessibilityAction(named: "Remove item") { viewModel.remove(item, from: plan) }
                }
            } header: { Text("Essentials to bring") } footer: {
                Text("Tap an item to confirm it yourself. Photo scanning isn’t available in this build. A possible visual match will remain unresolved until you confirm it.")
            }
            .listRowBackground(DepartPalette.surface)
        }
        .scrollContentBackground(.hidden)
        .background(DepartPalette.background)
        .navigationTitle("Checklist")
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .primaryAction) {
                Button("Add item", systemImage: "plus") { showingAddItem = true }
                    .accessibilityIdentifier("add-item")
            }
        }
        .sheet(isPresented: $showingAddItem) { AddItemSheet(plan: plan, viewModel: viewModel) }
    }
}

private struct AddItemSheet: View {
    let plan: DeparturePlan
    let viewModel: PreparationViewModel
    @Environment(\.dismiss) private var dismiss
    @State private var name = ""
    @State private var saveError: String?
    @FocusState private var nameFocused: Bool

    private var trimmedName: String { name.trimmingCharacters(in: .whitespacesAndNewlines) }
    private var validName: Bool { !trimmedName.isEmpty && trimmedName.count <= 120 }

    var body: some View {
        NavigationStack {
            Form {
                Section("What do you need to bring?") {
                    TextField("Item name", text: $name)
                        .textInputAutocapitalization(.sentences)
                        .focused($nameFocused)
                        .submitLabel(.done)
                        .onSubmit { if validName { save() } }
                        .accessibilityIdentifier("item-name-field")
                    if trimmedName.count > 120 {
                        Text("Use 120 characters or fewer.").foregroundStyle(DepartPalette.warning)
                    }
                    if let saveError { Text(saveError).foregroundStyle(DepartPalette.warning) }
                }
            }
            .navigationTitle("Add item")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) { Button("Cancel") { dismiss() } }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Save item", action: save).disabled(!validName)
                        .accessibilityIdentifier("save-item")
                }
            }
            .onAppear { nameFocused = true }
        }
        .presentationDragIndicator(.visible)
    }

    private func save() {
        if viewModel.addItem(name, to: plan) {
            dismiss()
        } else {
            saveError = viewModel.errorMessage
            viewModel.errorMessage = nil
        }
    }
}
