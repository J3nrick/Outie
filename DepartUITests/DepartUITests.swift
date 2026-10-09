import XCTest

nonisolated final class DepartUITests: XCTestCase {
    @MainActor private func app(accessibility: Bool = false) -> XCUIApplication {
        let app = XCUIApplication()
        app.launchArguments = ["-ui-testing-store", UUID().uuidString]
        if accessibility { app.launchArguments.append("-ui-testing-accessibility") }
        app.launch()
        return app
    }

    @MainActor private func reveal(_ element: XCUIElement, in app: XCUIApplication) {
        for _ in 0..<12 {
            if element.exists && element.isHittable {
                let midpoint = element.frame.midY
                if midpoint > app.frame.minY + 130 && midpoint < app.frame.maxY - 110 { return }
                if midpoint <= app.frame.minY + 130 {
                    app.swipeDown()
                    continue
                }
            }
            app.swipeUp()
        }
        XCTAssertTrue(element.isHittable, "Expected control to be reachable by scrolling")
    }

    @MainActor private func capture(_ name: String, app: XCUIApplication) {
        let attachment = XCTAttachment(screenshot: app.screenshot())
        attachment.name = name
        attachment.lifetime = .keepAlways
        add(attachment)
    }

    @MainActor func testChecklistEditsSurviveRelaunchAndDemoStaysSeparate() {
        let app = app()
        XCTAssertTrue(app.staticTexts["normal-empty-state"].waitForExistence(timeout: 10))
        capture("Today-empty", app: app)
        app.buttons["explore-demo"].tap()
        XCTAssertTrue(app.staticTexts["demo-badge"].waitForExistence(timeout: 5))
        capture("Today-demo", app: app)
        reveal(app.buttons["open-checklist"], in: app)
        app.buttons["open-checklist"].tap()
        let companyID = app.buttons["check-item-Company ID"]
        XCTAssertTrue(companyID.waitForExistence(timeout: 5))
        reveal(companyID, in: app)
        XCTAssertEqual(companyID.label, "Company ID")
        XCTAssertTrue((companyID.value as? String)?.contains("Not checked") == true)
        companyID.tap()
        XCTAssertTrue((companyID.value as? String)?.contains("Confirmed by you") == true)
        capture("Checklist-manual", app: app)

        app.buttons["add-item"].tap()
        XCTAssertFalse(app.buttons["save-item"].isEnabled)
        app.textFields["item-name-field"].tap()
        app.textFields["item-name-field"].typeText("Printed agenda")
        app.buttons["save-item"].tap()
        reveal(app.buttons["check-item-Printed agenda"], in: app)
        XCTAssertTrue(app.buttons["check-item-Printed agenda"].exists)

        app.terminate()
        app.launch()
        reveal(app.buttons["open-checklist"], in: app)
        app.buttons["open-checklist"].tap()
        reveal(companyID, in: app)
        XCTAssertTrue((companyID.value as? String)?.contains("Confirmed by you") == true)
        reveal(app.buttons["check-item-Printed agenda"], in: app)
        app.buttons["check-item-Printed agenda"].swipeLeft()
        app.buttons["Remove"].tap()
        XCTAssertFalse(app.buttons["check-item-Printed agenda"].exists)
        app.terminate()
        app.launch()
        reveal(app.buttons["open-checklist"], in: app)
        app.buttons["open-checklist"].tap()
        XCTAssertFalse(app.buttons["check-item-Printed agenda"].exists)
        reveal(companyID, in: app)
        companyID.tap()
        XCTAssertTrue((companyID.value as? String)?.contains("Not checked") == true)

        app.tabBars.buttons["Essentials"].tap()
        XCTAssertTrue(app.staticTexts["Company ID"].waitForExistence(timeout: 5))
        app.tabBars.buttons["Settings"].tap()
        let demoToggle = app.switches["demo-mode-toggle"]
        XCTAssertEqual(demoToggle.value as? String, "1")
        demoToggle.coordinate(withNormalizedOffset: CGVector(dx: 0.9, dy: 0.5)).tap()
        XCTAssertEqual(demoToggle.value as? String, "0")
        app.tabBars.buttons["Essentials"].tap()
        XCTAssertTrue(app.otherElements["essentials-empty-state"].exists || app.staticTexts["A place for your essentials"].exists)
        app.tabBars.buttons["Today"].tap()
        XCTAssertTrue(app.staticTexts["normal-empty-state"].waitForExistence(timeout: 5))
        XCTAssertFalse(app.buttons["open-checklist"].exists)
    }

    @MainActor func testSettingsReflectModelStatusAndPersistPreferences() {
        let app = app()
        app.tabBars.buttons["Settings"].tap()
        let stepper = app.steppers["arrival-buffer"]
        XCTAssertTrue(stepper.waitForExistence(timeout: 5))
        app.buttons["arrival-buffer-Increment"].tap()
        reveal(app.buttons["refresh-model-status"], in: app)
        app.buttons["refresh-model-status"].tap()
        XCTAssertTrue(app.staticTexts["model-status"].exists)
        capture("Settings-model-status", app: app)
        app.terminate()
        app.launch()
        app.tabBars.buttons["Settings"].tap()
        XCTAssertEqual(app.buttons["arrival-buffer-Increment"].value as? String, "20")
    }

    @MainActor func testLargeTextReducedMotionAndAccessibilityLabels() {
        let app = app(accessibility: true)
        reveal(app.buttons["explore-demo"], in: app)
        app.buttons["explore-demo"].tap()
        capture("Today-large-text", app: app)
        reveal(app.buttons["open-checklist"], in: app)
        app.buttons["open-checklist"].tap()
        let companyID = app.buttons["check-item-Company ID"]
        reveal(companyID, in: app)
        XCTAssertEqual(companyID.label, "Company ID")
        companyID.tap()
        XCTAssertTrue((companyID.value as? String)?.contains("Confirmed by you") == true)
        capture("Checklist-large-text", app: app)
        app.buttons["add-item"].tap()
        let name = "Printed presentation materials and supporting documents for the entire client meeting"
        app.textFields["item-name-field"].tap()
        app.textFields["item-name-field"].typeText(name)
        app.buttons["save-item"].tap()
        let longItem = app.buttons["check-item-\(name)"]
        reveal(longItem, in: app)
        longItem.tap()
        XCTAssertTrue((longItem.value as? String)?.contains("Confirmed by you") == true)
        capture("Checklist-long-item-large-text", app: app)
    }
    @MainActor func testConnectionsNavigateWithoutRequestingPermissions() {
        let app = app()
        app.tabBars.buttons["Settings"].tap()
        for title in ["Calendar", "Camera", "Notifications"] {
            let row = app.buttons["connection-\(title.lowercased())"]
            reveal(row, in: app)
            row.tap()
            XCTAssertTrue(app.navigationBars[title].waitForExistence(timeout: 5))
            XCTAssertTrue(app.buttons["Open iPhone Settings"].exists)
            capture("Connection-\(title)", app: app)
            app.navigationBars.buttons.firstMatch.tap()
        }
    }

}
