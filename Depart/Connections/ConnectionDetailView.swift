import SwiftUI
import UIKit

struct ConnectionDetailView: View {
    let kind: ConnectionKind
    @Bindable var service: ConnectionsService
    @Environment(\.scenePhase) private var scenePhase
    @Environment(\.openURL) private var openURL
    @State private var showCamera = false
    @State private var photo: UIImage?
    private var access: ConnectionAccess { service.access(for: kind) }

    var body: some View {
        Form {
            Section {
                Label(access.title, systemImage: kind.symbol).font(.headline)
                Text(explanation).foregroundStyle(DepartPalette.slate)
                if access == .notRequested || (kind == .calendar && access == .limited) {
                    Button("Enable \(kind.rawValue)") { Task { await service.request(kind); service.loadEvents() } }
                        .disabled(service.busy)
                }
                Button("Open iPhone Settings") {
                    if let url = URL(string: UIApplication.openSettingsURLString) { openURL(url) }
                }
                Text("You can change or revoke access in iPhone Settings at any time.")
                    .font(.footnote).foregroundStyle(DepartPalette.slate)
            }
            switch kind {
            case .calendar:
                if access == .allowed {
                    Section("Next 7 days · up to 20 events") {
                        Button("Refresh events") { service.loadEvents() }
                        if service.events.isEmpty { Text("No upcoming events in your accessible calendars.") }
                        ForEach(service.events) { event in
                            VStack(alignment: .leading, spacing: 4) {
                                Text(event.title)
                                Text(event.start, format: event.allDay ? .dateTime.month().day() : .dateTime.month().day().hour().minute())
                                    .font(.subheadline).foregroundStyle(DepartPalette.slate)
                                if event.allDay { Text("All day").font(.caption) }
                            }
                        }
                    }
                }
            case .camera:
                if access == .allowed {
                    Section("Camera preview") {
                        Button("Open camera") { showCamera = true }
                        if let photo {
                            Image(uiImage: photo).resizable().scaledToFit().accessibilityLabel("Your captured preview")
                            Button("Discard photo", role: .destructive) { self.photo = nil }
                        }
                        Text("Preview only. Photos aren’t saved to Photos or your essentials. No item recognition runs.")
                            .font(.footnote).foregroundStyle(DepartPalette.slate)
                    }
                }
            case .notifications:
                if access == .allowed || access == .limited {
                    Section("Test your connection") {
                        Button("Send test in 15 seconds") { Task { await service.scheduleTest() } }
                            .disabled(service.busy)
                        if service.testScheduled {
                            Text("Test scheduled. Leave DEPART or lock your phone to see it. Focus and notification settings may silence alerts.")
                            Button("Cancel test", role: .destructive) { service.cancelTest() }
                        }
                        Text("Automatic departure reminders aren’t scheduled yet.")
                            .font(.footnote).foregroundStyle(DepartPalette.slate)
                    }
                }
            }
        }
        .scrollContentBackground(.hidden).background(DepartPalette.background)
        .navigationTitle(kind.rawValue)
        .task { await service.refresh(); if kind == .calendar { service.loadEvents() } }
        .onChange(of: scenePhase) { _, phase in
            if phase == .active { Task { await service.refresh(); if kind == .calendar { service.loadEvents() } } }
            if phase == .background { photo = nil }
        }
        .onDisappear { photo = nil }
        .sheet(isPresented: $showCamera) { CameraCapture { image in photo = image; showCamera = false }.ignoresSafeArea() }
        .alert("Connection needs attention", isPresented: Binding(get: { service.errorMessage != nil },
              set: { if !$0 { service.errorMessage = nil } })) {
            Button("OK") { service.errorMessage = nil }
        } message: { Text(service.errorMessage ?? "Try again.") }
    }

    private var explanation: String {
        switch kind {
        case .calendar: "View upcoming events from your iPhone calendars. DEPART reads events on this device; it does not edit them or generate preparation plans from them yet."
        case .camera: "Use your camera to preview a photo of an essential. Access is requested only when you enable it."
        case .notifications: "Allow local alerts from DEPART. You can send a test reminder to check delivery."
        }
    }
}

private struct CameraCapture: UIViewControllerRepresentable {
    let finished: (UIImage?) -> Void
    func makeCoordinator() -> Coordinator { Coordinator(finished: finished) }
    func makeUIViewController(context: Context) -> UIImagePickerController {
        let picker = UIImagePickerController()
        picker.sourceType = .camera
        picker.delegate = context.coordinator
        return picker
    }
    func updateUIViewController(_ controller: UIImagePickerController, context: Context) {}
    final class Coordinator: NSObject, UIImagePickerControllerDelegate, UINavigationControllerDelegate {
        let finished: (UIImage?) -> Void
        init(finished: @escaping (UIImage?) -> Void) { self.finished = finished }
        func imagePickerControllerDidCancel(_ picker: UIImagePickerController) { finished(nil) }
        func imagePickerController(_ picker: UIImagePickerController, didFinishPickingMediaWithInfo info: [UIImagePickerController.InfoKey: Any]) {
            finished(info[.originalImage] as? UIImage)
        }
    }
}
