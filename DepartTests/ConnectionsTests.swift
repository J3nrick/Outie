import AVFoundation
import EventKit
import Testing
import UserNotifications
@testable import Depart

struct ConnectionsTests {
    @Test func calendarWriteOnlyDoesNotEnableReading() {
        #expect(ConnectionAccess.calendar(.writeOnly) == .limited)
        #expect(ConnectionAccess.calendar(.fullAccess) == .allowed)
        #expect(ConnectionAccess.calendar(.denied) == .denied)
        #expect(ConnectionAccess.calendar(.restricted) == .restricted)
    }
    @Test func cameraHardwareAvailabilityOverridesPermission() {
        #expect(ConnectionAccess.camera(.authorized, available: false) == .unavailable)
        #expect(ConnectionAccess.camera(.authorized, available: true) == .allowed)
        #expect(ConnectionAccess.camera(.denied, available: true) == .denied)
    }
    @Test func quietNotificationsAreNotReportedAsFullAuthorization() {
        #expect(ConnectionAccess.notifications(.provisional) == .limited)
        #expect(ConnectionAccess.notifications(.denied) == .denied)
        #expect(ConnectionAccess.notifications(.notDetermined) == .notRequested)
    }
}
