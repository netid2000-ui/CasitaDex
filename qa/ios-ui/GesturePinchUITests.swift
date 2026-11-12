import XCTest

final class GesturePinchUITests: XCTestCase {
  @MainActor
  func testPhotoPinchOutAndIn() throws {
    let app = XCUIApplication(bundleIdentifier: "com.designsbyfa.casitadex.gestureqa")
    app.launch()
    let find = app.descendants(matching: .any).matching(identifier: "Find").firstMatch
    XCTAssertTrue(find.waitForExistence(timeout: 20), "QA Find tab required")
    find.tap()
    let memory = app.descendants(matching: .any)
      .matching(NSPredicate(format: "label CONTAINS %@", "Gesture QA Synthetic Brand Photo")).firstMatch
    XCTAssertTrue(memory.waitForExistence(timeout: 15), "Synthetic memory required")
    memory.tap()
    let open = app.descendants(matching: .any).matching(identifier: "Open photo 1 to zoom").firstMatch
    XCTAssertTrue(open.waitForExistence(timeout: 12), "Open photo viewer required")
    if !open.isHittable { app.swipeUp() }
    open.tap()
    func zoomValue() -> Double {
      let labels = app.staticTexts.allElementsBoundByIndex.map { $0.label }
      for text in labels {
        if text.hasPrefix("Zoom "), text.hasSuffix(" times") {
          let raw = text.replacingOccurrences(of: "Zoom ", with: "")
            .replacingOccurrences(of: " times", with: "")
          if let number = Double(raw) { return number }
        }
      }
      return -1
    }
    XCTAssertTrue(app.staticTexts["Zoom 1 times"].waitForExistence(timeout: 10), "Start zoom at 1x")
    let photo = app.images
      .matching(NSPredicate(format: "label CONTAINS %@", "Photo 1 of Gesture QA Synthetic Brand Photo")).firstMatch
    if !photo.waitForExistence(timeout: 10) {
      print("QA_VIEWER_ACCESSIBILITY_TREE_BEGIN\n" + app.debugDescription + "\nQA_VIEWER_ACCESSIBILITY_TREE_END")
    }
    XCTAssertTrue(photo.exists, "Photo image element required for genuine pinch")
    photo.pinch(withScale: 1.8, velocity: 0.7)
    let outward = zoomValue()
    print("GESTURE_NATIVE_IOS_PINCH_OUT_ZOOM=\(outward)")
    XCTAssertGreaterThan(outward, 1.05, "True iOS two-finger pinch-out should increase zoom")
    XCTAssertLessThanOrEqual(outward, 4.0)
    photo.pinch(withScale: 0.6, velocity: -0.7)
    let inward = zoomValue()
    print("GESTURE_NATIVE_IOS_PINCH_IN_ZOOM=\(inward)")
    XCTAssertLessThan(inward, outward, "Pinch-in should reduce zoom")
    XCTAssertGreaterThanOrEqual(inward, 1.0)
    XCTAssertTrue(app.buttons["Close photo"].exists, "Viewer must remain open")
  }
}
