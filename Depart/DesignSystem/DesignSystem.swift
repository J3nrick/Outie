import SwiftUI

enum DepartPalette {
    static let background = Color(red: 246 / 255, green: 245 / 255, blue: 241 / 255)
    static let surface = Color.white
    static let ink = Color(red: 32 / 255, green: 41 / 255, blue: 43 / 255)
    static let slate = Color(red: 91 / 255, green: 104 / 255, blue: 108 / 255)
    static let teal = Color(red: 11 / 255, green: 107 / 255, blue: 96 / 255)
    static let warning = Color(red: 154 / 255, green: 91 / 255, blue: 12 / 255)
}

struct DepartPrimaryButtonStyle: ButtonStyle {
    @Environment(\.accessibilityReduceMotion) private var reduceMotion

    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(.headline)
            .frame(maxWidth: .infinity, minHeight: 24)
            .padding(16)
            .foregroundStyle(.white)
            .background(DepartPalette.teal.opacity(configuration.isPressed ? 0.84 : 1), in: RoundedRectangle(cornerRadius: 16))
            .scaleEffect(configuration.isPressed && !reduceMotion ? 0.98 : 1)
            .animation(reduceMotion ? nil : .spring(response: 0.3, dampingFraction: 1), value: configuration.isPressed)
    }
}

struct DemoBadge: View {
    var body: some View {
        Label("Demo Mode", systemImage: "play.rectangle")
            .font(.subheadline.weight(.semibold))
            .foregroundStyle(DepartPalette.warning)
            .accessibilityIdentifier("demo-badge")
    }
}

struct ChecklistItemRow: View {
    let item: PreparationItem
    let onToggle: () -> Void
    @Environment(\.colorSchemeContrast) private var contrast

    private var symbol: String {
        switch item.status {
        case .notChecked: "circle"
        case .possibleMatch: "questionmark.circle"
        case .visuallyVerified: "viewfinder.circle.fill"
        case .manuallyConfirmed: "checkmark.circle.fill"
        }
    }

    var body: some View {
        Button(action: onToggle) {
            HStack(alignment: .top, spacing: 16) {
                Image(systemName: symbol)
                    .font(.title2)
                    .foregroundStyle(item.status.isChecked ? DepartPalette.teal : DepartPalette.slate)
                    .frame(minWidth: 28)
                    .padding(.top, 2)
                    .accessibilityHidden(true)
                VStack(alignment: .leading, spacing: 4) {
                    Text(item.name).font(.body.weight(.medium)).foregroundStyle(DepartPalette.ink)
                    Text(item.status.title).font(.subheadline)
                        .foregroundStyle(contrast == .increased ? DepartPalette.ink : DepartPalette.slate)
                    Text(item.source.title).font(.caption).foregroundStyle(DepartPalette.slate)
                }
                Spacer(minLength: 0)
            }
            .frame(maxWidth: .infinity, minHeight: 44, alignment: .leading)
            .padding(.vertical, 8)
            .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
        .accessibilityLabel(item.name)
        .accessibilityValue("\(item.status.title). \(item.source.title)")
        .accessibilityHint(item.status.isChecked ? "Double-tap to mark not checked." : "Double-tap to confirm manually.")
        .accessibilityAddTraits(item.status.isChecked ? [.isButton, .isSelected] : .isButton)
        .accessibilityIdentifier("check-item-\(item.name)")
    }
}

struct EvidenceSummary: View {
    let plan: DeparturePlan
    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            Text("\(plan.checkedCount) of \(plan.items.count) items checked")
                .font(.headline).foregroundStyle(DepartPalette.ink)
                .accessibilityIdentifier("checklist-progress")
            Text("\(plan.manuallyCheckedCount) confirmed by you, \(plan.visuallyCheckedCount) visually checked")
                .font(.subheadline).foregroundStyle(DepartPalette.slate)
            Text("Checking an item does not prove it is packed.")
                .font(.footnote).foregroundStyle(DepartPalette.slate)
        }
        .fixedSize(horizontal: false, vertical: true)
    }
}
