import AVFoundation
import EventKit
import Observation
import UIKit
import UserNotifications

nonisolated enum ConnectionKind: String, CaseIterable, Identifiable {
    case calendar = "Calendar", camera = "Camera", notifications = "Notifications"
    var id: String { rawValue }
    var symbol: String {
        switch self { case .calendar: "calendar"; case .camera: "camera"; case .notifications: "bell" }
    }
}

nonisolated enum ConnectionAccess: Equatable {
    case unknown, notRequested, allowed, limited, denied, restricted, unavailable
    var title: String {
        switch self {
        case .unknown: "Checking…"
        case .notRequested: "Not enabled"
        case .allowed: "Enabled"
        case .limited: "Limited access"
        case .denied: "Access denied"
        case .restricted: "Restricted"
        case .unavailable: "Unavailable on this device"
        }
    }
    static func calendar(_ status: EKAuthorizationStatus) -> Self {
        switch status {
        case .notDetermined: .notRequested
        case .fullAccess, .authorized: .allowed
        case .writeOnly: .limited
        case .denied: .denied
        case .restricted: .restricted
        @unknown default: .unknown
        }
    }
    static func camera(_ status: AVAuthorizationStatus, available: Bool) -> Self {
        guard available else { return .unavailable }
        return switch status {
        case .notDetermined: .notRequested
        case .authorized: .allowed
        case .denied: .denied
        case .restricted: .restricted
        @unknown default: .unknown
        }
    }
    static func notifications(_ status: UNAuthorizationStatus) -> Self {
        switch status {
        case .notDetermined: .notRequested
        case .authorized: .allowed
        case .provisional, .ephemeral: .limited
        case .denied: .denied
        @unknown default: .unknown
        }
    }
}

struct CalendarPreviewEvent: Identifiable {
    let id: String
    let title: String
    let start: Date
    let allDay: Bool
}

@Observable final class ConnectionsService {
    private let eventStore = EKEventStore()
    private let notifications = UNUserNotificationCenter.current()
    private let testIdentifier = "depart.connection-test"
    var calendarAccess: ConnectionAccess = .unknown
    var cameraAccess: ConnectionAccess = .unknown
    var notificationAccess: ConnectionAccess = .unknown
    var events: [CalendarPreviewEvent] = []
    var busy = false
    var errorMessage: String?
    var testScheduled = false

    func access(for kind: ConnectionKind) -> ConnectionAccess {
        switch kind { case .calendar: calendarAccess; case .camera: cameraAccess; case .notifications: notificationAccess }
    }

    func refresh() async {
        calendarAccess = .calendar(EKEventStore.authorizationStatus(for: .event))
        cameraAccess = .camera(AVCaptureDevice.authorizationStatus(for: .video),
                               available: UIImagePickerController.isSourceTypeAvailable(.camera))
        notificationAccess = .notifications(await notifications.notificationSettings().authorizationStatus)
        testScheduled = await notifications.pendingNotificationRequests().contains { $0.identifier == testIdentifier }
        if calendarAccess != .allowed { events = [] }
    }

    func request(_ kind: ConnectionKind) async {
        guard !busy else { return }
        busy = true
        defer { busy = false }
        errorMessage = nil
        do {
            switch kind {
            case .calendar: _ = try await eventStore.requestFullAccessToEvents()
            case .camera: _ = await AVCaptureDevice.requestAccess(for: .video)
            case .notifications: _ = try await notifications.requestAuthorization(options: [.alert, .sound])
            }
        } catch { errorMessage = "Access couldn’t be requested. Try again or open iPhone Settings." }
        await refresh()
    }

    func loadEvents() {
        guard calendarAccess == .allowed else { events = []; return }
        let start = Date()
        let end = Calendar.current.date(byAdding: .day, value: 7, to: start) ?? start
        let predicate = eventStore.predicateForEvents(withStart: start, end: end, calendars: nil)
        events = eventStore.events(matching: predicate).sorted { $0.startDate < $1.startDate }.prefix(20).enumerated().map {
            CalendarPreviewEvent(id: "\($0.offset)-\($0.element.eventIdentifier ?? "event")",
                                 title: $0.element.title ?? "Untitled event", start: $0.element.startDate,
                                 allDay: $0.element.isAllDay)
        }
    }

    func scheduleTest() async {
        guard !busy else { return }
        busy = true
        defer { busy = false }
        await refresh()
        guard notificationAccess == .allowed || notificationAccess == .limited else {
            errorMessage = "Enable notifications first."; return
        }
        let content = UNMutableNotificationContent()
        content.title = "DEPART test reminder"
        content.body = "Your notification connection is working. This is a test, not a departure reminder."
        content.sound = .default
        let request = UNNotificationRequest(identifier: testIdentifier, content: content,
            trigger: UNTimeIntervalNotificationTrigger(timeInterval: 15, repeats: false))
        do { try await notifications.add(request); errorMessage = nil; testScheduled = true }
        catch { errorMessage = "The test reminder couldn’t be scheduled. Try again." }
    }

    func cancelTest() {
        notifications.removePendingNotificationRequests(withIdentifiers: [testIdentifier])
        notifications.removeDeliveredNotifications(withIdentifiers: [testIdentifier])
        testScheduled = false
    }
}
