import XCTest
final class SettingsReturnTests:XCTestCase {
 @MainActor func testSettingsReturnAndDirectTabs(){
  continueAfterFailure=false
  let app=XCUIApplication(bundleIdentifier:"com.designsbyfa.casitadex.plusstoreqa");app.launch()
  func e(_ s:String)->XCUIElement {app.descendants(matching:.any).matching(identifier:s).firstMatch}
  func tap(_ s:String){let n=e(s);XCTAssertTrue(n.waitForExistence(timeout:10));for _ in 0..<15{if n.isHittable{break};app.swipeUp()};XCTAssertTrue(n.isHittable);n.tap()}
  func shot(_ s:String){let a=XCTAttachment(screenshot:app.screenshot());a.name=s;a.lifetime = .keepAlways;add(a)}
  tap("Home");tap("Settings");tap("Archived Memories");XCTAssertTrue(e("‹ Settings").waitForExistence(timeout:10));shot("archived-return");tap("‹ Settings");XCTAssertTrue(e("Archived Memories").waitForExistence(timeout:10));app.buttons["Reminders"].tap();XCTAssertTrue(e("‹ Settings").waitForExistence(timeout:10));shot("reminders-return");tap("Add Reminder ›");tap("Cancel");XCTAssertTrue(e("‹ Settings").waitForExistence(timeout:10));tap("‹ Settings");tap("Archived Memories");app.otherElements.matching(identifier:"Find").allElementsBoundByIndex.last!.tap();XCTAssertFalse(e("‹ Settings").exists);app.otherElements.matching(identifier:"Reminders").allElementsBoundByIndex.last!.tap();XCTAssertFalse(e("‹ Settings").exists);shot("direct-reminders-tab");tap("Home")
 }
}
