import XCTest
final class EditorialAcceptanceTests: XCTestCase {
 @MainActor func testApprovedHomeAndControls() throws {
  continueAfterFailure=false
  let app=XCUIApplication(bundleIdentifier:"com.designsbyfa.casitadex.plusstoreqa");app.launch()
  func e(_ label:String)->XCUIElement {app.descendants(matching:.any).matching(identifier:label).firstMatch}
  func tap(_ label:String){let n=e(label);XCTAssertTrue(n.waitForExistence(timeout:10),label);for _ in 0..<24 {if n.isHittable {break};if n.frame.minY < app.scrollViews.firstMatch.frame.minY+40 {app.scrollViews.firstMatch.coordinate(withNormalizedOffset:CGVector(dx:0.01,dy:0.2)).press(forDuration:0.05,thenDragTo:app.scrollViews.firstMatch.coordinate(withNormalizedOffset:CGVector(dx:0.01,dy:0.8)))} else {app.scrollViews.firstMatch.coordinate(withNormalizedOffset:CGVector(dx:0.01,dy:0.8)).press(forDuration:0.05,thenDragTo:app.scrollViews.firstMatch.coordinate(withNormalizedOffset:CGVector(dx:0.01,dy:0.2)))}};if !n.isHittable {print(app.debugDescription)};XCTAssertTrue(n.isHittable,label);n.tap()}
  func shot(_ name:String){let a=XCTAttachment(screenshot:app.screenshot());a.name=name;a.lifetime = .keepAlways;add(a)}
  tap("Home");XCTAssertTrue(e("Search Memories").waitForExistence(timeout:10));let caption=e("A place for everything you want to remember.");for _ in 0..<12 {if caption.isHittable {break};app.scrollViews.firstMatch.coordinate(withNormalizedOffset:CGVector(dx:0.01,dy:0.8)).press(forDuration:0.05,thenDragTo:app.scrollViews.firstMatch.coordinate(withNormalizedOffset:CGVector(dx:0.01,dy:0.2)))};if !caption.isHittable {print(app.debugDescription)};XCTAssertTrue(caption.isHittable);shot("home-hero")
  for name in ["Home","Photos","Reminders","Find"]{XCTAssertTrue(e(name).exists)}
  tap("Find");shot("find-action-lines");tap("Home");tap("Add Memory");if e("Resume draft").waitForExistence(timeout:2){tap("Resume draft")}
  for label in ["Choose Space","Choose Categories","Choose Location"]{tap(label);XCTAssertTrue(e("Cancel").waitForExistence(timeout:5));shot(label);tap("Cancel")}
  tap("+ Add Photo");for label in ["Take Photo","Choose from Library","Browse Files","Cancel"]{let n=e(label);XCTAssertTrue(n.waitForExistence(timeout:5));XCTAssertTrue(n.isHittable);XCTAssertGreaterThanOrEqual(n.frame.height,44);XCTAssertGreaterThanOrEqual(n.frame.minX,0);XCTAssertLessThanOrEqual(n.frame.maxX,app.frame.maxX)};shot("photo-source-lines");tap("Cancel");XCTAssertFalse(e("Choose from Library").exists);tap("Home")
 }
}
final class EditorialReminderPickerTests:XCTestCase {
 @MainActor func testDateAndTimePresentation() throws {
  continueAfterFailure=false
  let app=XCUIApplication(bundleIdentifier:"com.designsbyfa.casitadex.plusstoreqa");app.launch()
  func tap(_ n:XCUIElement){XCTAssertTrue(n.waitForExistence(timeout:10));for _ in 0..<20{if n.isHittable{break};if n.frame.minY < app.scrollViews.firstMatch.frame.minY+40 {app.scrollViews.firstMatch.coordinate(withNormalizedOffset:CGVector(dx:0.01,dy:0.2)).press(forDuration:0.05,thenDragTo:app.scrollViews.firstMatch.coordinate(withNormalizedOffset:CGVector(dx:0.01,dy:0.8)))} else {app.scrollViews.firstMatch.coordinate(withNormalizedOffset:CGVector(dx:0.01,dy:0.8)).press(forDuration:0.05,thenDragTo:app.scrollViews.firstMatch.coordinate(withNormalizedOffset:CGVector(dx:0.01,dy:0.2)))}};if !n.isHittable {print(app.debugDescription)};XCTAssertTrue(n.isHittable);n.tap()}
  func shot(_ name:String){let a=XCTAttachment(screenshot:app.screenshot());a.name=name;a.lifetime = .keepAlways;add(a)}
  tap(app.descendants(matching:.any).matching(identifier:"Home").firstMatch);tap(app.buttons["Add Reminder"])
  let date=app.buttons.matching(NSPredicate(format:"label MATCHES %@","[0-9]{4}-[0-9]{2}-[0-9]{2}")).firstMatch;tap(date)
  XCTAssertTrue(app.datePickers.firstMatch.waitForExistence(timeout:5));shot("native-date-picker");tap(app.buttons["Done"])
  let time=app.buttons.matching(NSPredicate(format:"label MATCHES %@","[0-9]+:[0-9]+.*[AP]M")).firstMatch;tap(time)
  XCTAssertTrue(app.datePickers.firstMatch.waitForExistence(timeout:5));shot("native-time-picker");tap(app.buttons["Done"]);tap(app.buttons["Cancel"])
 }
}
final class EditorialCustomActionsTests:XCTestCase {
 @MainActor func testPhotosAndReminderActions() throws {
  continueAfterFailure=false
  let app=XCUIApplication(bundleIdentifier:"com.designsbyfa.casitadex.plusstoreqa");app.launch()
  func e(_ label:String)->XCUIElement {app.descendants(matching:.any).matching(identifier:label).firstMatch}
  func tap(_ label:String){let n=e(label);XCTAssertTrue(n.waitForExistence(timeout:10));XCTAssertTrue(n.isHittable);n.tap()}
  func shot(_ name:String){let a=XCTAttachment(screenshot:app.screenshot());a.name=name;a.lifetime = .keepAlways;add(a)}
  tap("Photos");tap("Compact photo view");tap("Grid photo view");shot("photos-final-lines");tap("Sort photos");tap("Cancel");tap("Reminders");shot("reminders-final-lines");tap("Home")
 }
}
