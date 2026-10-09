import SwiftUI

struct TodayView: View {
    @Bindable var viewModel: PreparationViewModel

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 24) {
                Text(Date.now, format: .dateTime.weekday(.wide).month(.wide).day())
                    .font(.subheadline).foregroundStyle(DepartPalette.slate)
                if viewModel.preferences.demoEnabled { DemoBadge() }
                if let plan = viewModel.nextPlan {
                    departurePanel(plan)
                    checklistPreview(plan)
                } else {
                    emptyState
                }
                Label("Your checklist stays on this iPhone", systemImage: "lock.shield")
                    .font(.footnote).foregroundStyle(DepartPalette.slate)
                    .padding(.top, 8)
            }
            .frame(maxWidth: 600, alignment: .leading)
            .padding(24)
            .frame(maxWidth: .infinity)
        }
        .background(DepartPalette.background)
        .safeAreaInset(edge: .bottom, spacing: 0) {
            if let plan = viewModel.nextPlan {
                NavigationLink(value: plan.id) {
                    Text("Check My Essentials")
                }
                .buttonStyle(DepartPrimaryButtonStyle())
                .accessibilityIdentifier("open-checklist")
                .frame(maxWidth: 600)
                .padding(.horizontal, 24)
                .padding(.vertical, 12)
                .frame(maxWidth: .infinity)
                .background(DepartPalette.background)
            }
        }
        .navigationTitle("Today")
        .navigationDestination(for: UUID.self) { identifier in
            if let plan = viewModel.nextPlan, plan.id == identifier {
                ChecklistView(plan: plan, viewModel: viewModel)
            }
        }
        .toolbarBackground(DepartPalette.background, for: .navigationBar)
    }

    private func departurePanel(_ plan: DeparturePlan) -> some View {
        VStack(alignment: .leading, spacing: 20) {
            Image(systemName: "door.left.hand.open")
                .font(.title).foregroundStyle(DepartPalette.teal).accessibilityHidden(true)
            VStack(alignment: .leading, spacing: 8) {
                if let departure = plan.recommendedDepartureDate {
                    Text("Leave at \(departure.formatted(date: .omitted, time: .shortened))")
                        .font(.largeTitle.weight(.semibold))
                } else {
                    Text("Departure time\nnot set")
                        .font(.largeTitle.weight(.semibold))
                }
                Text(plan.estimatedTravelMinutes.map { "Travel estimate: \($0) minutes, saved estimate" }
                     ?? "No travel estimate has been provided.")
                    .font(.subheadline).foregroundStyle(DepartPalette.slate)
            }
            Rectangle().fill(DepartPalette.teal.opacity(0.18)).frame(height: 1).accessibilityHidden(true)
            VStack(alignment: .leading, spacing: 8) {
                Text(plan.eventTitle).font(.title2.weight(.semibold))
                Label(plan.eventStartDate.formatted(.dateTime.month(.abbreviated).day().hour().minute()), systemImage: "calendar")
                Label(plan.destination ?? "No destination provided", systemImage: "mappin")
            }
            .font(.subheadline)
            .fixedSize(horizontal: false, vertical: true)
        }
        .foregroundStyle(DepartPalette.ink)
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(24)
        .background(DepartPalette.surface, in: RoundedRectangle(cornerRadius: 24))
        .accessibilityIdentifier("departure-panel")
    }

    private func checklistPreview(_ plan: DeparturePlan) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(plan.items.allSatisfy { $0.status.isChecked } && !plan.items.isEmpty ? "Items checked" : "Still to check")
                .font(.title3.weight(.semibold)).foregroundStyle(DepartPalette.ink)
            let unresolved = plan.orderedItems.filter { !$0.status.isChecked }
            ForEach(Array(unresolved.prefix(3))) { item in
                ChecklistItemRow(item: item) { viewModel.toggle(item) }
                Divider()
            }
            if unresolved.count > 3 {
                Text("\(unresolved.count - 3) more in your checklist")
                    .font(.subheadline).foregroundStyle(DepartPalette.slate)
            }
            EvidenceSummary(plan: plan).padding(.top, 8)
        }
    }

    private var emptyState: some View {
        VStack(alignment: .leading, spacing: 20) {
            Image(systemName: "door.left.hand.open")
                .font(.system(size: 44, weight: .light))
                .foregroundStyle(DepartPalette.teal).accessibilityHidden(true)
            Text("Your next departure,\nprepared.")
                .font(.largeTitle.weight(.semibold)).foregroundStyle(DepartPalette.ink)
            Text("No preparation plan yet.")
                .font(.headline).accessibilityIdentifier("normal-empty-state")
            Text(viewModel.scope == .demo
                 ? "This demo event has passed. Turn Demo Mode off and on in Settings to explore a new presentation."
                 : "Calendar connection isn’t available in this build. Explore a presentation checklist using an explicitly labeled demo.")
                .font(.body).foregroundStyle(DepartPalette.slate)
                .fixedSize(horizontal: false, vertical: true)
            if viewModel.scope == .personal {
                Button("Explore Demo Mode") { viewModel.setDemoEnabled(true) }
                    .buttonStyle(DepartPrimaryButtonStyle())
                    .accessibilityIdentifier("explore-demo")
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(.vertical, 24)
    }
}
