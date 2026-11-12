import XCTest

final class GestureIntegrationUITests: XCTestCase {
 @MainActor func testSB40ApprovedPhotoNativePinch() throws {
  let app=XCUIApplication(bundleIdentifier:"com.designsbyfa.casitadex.sb40gestureqa")
  app.launch()
  let photos=app.descendants(matching:.any).matching(identifier:"Photos").firstMatch
  XCTAssertTrue(photos.waitForExistence(timeout:20))
  photos.tap()
  let card=app.descendants(matching:.any).matching(identifier:"View photo 1 of [SAMPLE] Appliance manuals full screen").firstMatch
  XCTAssertTrue(card.waitForExistence(timeout:15))
  card.tap()
  let out=app.buttons["Zoom photo out"]
  let inside=app.buttons["Zoom photo in"]
  XCTAssertTrue(out.waitForExistence(timeout:15))
  XCTAssertFalse(out.isEnabled,"Initially at 1x")
  XCTAssertTrue(inside.isEnabled)
  let image=app.images.matching(NSPredicate(format:"label CONTAINS %@", "Photo 1 of [SAMPLE] Appliance manuals")).firstMatch
  if !image.exists { print("PHOTO_ACCESSIBILITY_TREE\n"+app.debugDescription) }
  XCTAssertTrue(image.exists,"Actual accessible image is required")
  image.pinch(withScale:1.7,velocity:0.65)
  XCTAssertTrue(out.isEnabled,"Pinch outward must enable Zoom Out at above 1x")
  XCTAssertTrue(app.buttons["Close photo"].exists)
  image.pinch(withScale:0.25,velocity:-0.65)
  XCTAssertFalse(out.isEnabled,"Native pinch inward should return zoom to 1x lower bound")
  XCTAssertTrue(app.buttons["Reset photo zoom"].exists)
  app.buttons["Reset photo zoom"].tap()
  XCTAssertFalse(out.isEnabled,"Reset must remain at 1x")
  print("INTEGRATED_SB40_IOS_NATIVE_PINCH_OUT_IN_PASS")
 }

 @MainActor func testSB40PhotoViewerAccessibilityAudit() throws {
  let app = XCUIApplication(bundleIdentifier:"com.designsbyfa.casitadex.sb40gestureqa")
  app.launch()
  let photos=app.descendants(matching:.any).matching(identifier:"Photos").firstMatch
  XCTAssertTrue(photos.waitForExistence(timeout:20))
  photos.tap()
  let card=app.descendants(matching:.any).matching(identifier:"View photo 1 of [SAMPLE] Appliance manuals full screen").firstMatch
  XCTAssertTrue(card.waitForExistence(timeout:15))
  card.tap()
  XCTAssertTrue(app.buttons["Close photo"].waitForExistence(timeout:12))
  if #available(iOS 17.0, *) {
   try app.performAccessibilityAudit(for:[.sufficientElementDescription,.hitRegion,.textClipped])
  } else { throw XCTSkip("Native audit needs iOS 17 or newer") }
  print("IOS_SB40_VIEWER_NATIVE_ACCESSIBILITY_AUDIT_PASS")
 }
}
