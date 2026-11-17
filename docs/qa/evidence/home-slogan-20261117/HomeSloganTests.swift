import XCTest
final class HomeSloganTests:XCTestCase {
 @MainActor func testHomeSlogan(){
  continueAfterFailure=false
  let app=XCUIApplication(bundleIdentifier:"com.designsbyfa.casitadex.plusstoreqa");app.launch()
  let home=app.otherElements.matching(identifier:"Home").allElementsBoundByIndex.last!
  XCTAssertTrue(home.waitForExistence(timeout:10));home.tap()
  let slogan=app.staticTexts.matching(identifier:"Your little home\nfor what you want to remember.").firstMatch
  XCTAssertTrue(slogan.waitForExistence(timeout:10))
  for _ in 0..<6 {if slogan.frame.maxY < home.frame.minY {break}; app.swipeUp()}
  XCTAssertGreaterThan(slogan.frame.height,0)
  XCTAssertLessThan(slogan.frame.maxY,home.frame.minY)
  let a=XCTAttachment(screenshot:app.screenshot());a.name="home-slogan";a.lifetime = .keepAlways;add(a)
 }
}
