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

final class PhysicalNotificationTests: XCTestCase {
 @MainActor func testBackgroundNotificationTap() {runNotification(terminated:false)}
 @MainActor func testTerminatedNotificationTap() {runNotification(terminated:true)}
 @MainActor func runNotification(terminated:Bool) {
  continueAfterFailure=false
  let app=XCUIApplication(bundleIdentifier:"com.designsbyfa.casitadex.plusstoreqa");app.launch()
  func tap(_ s:String){let e=app.descendants(matching:.any).matching(identifier:s).firstMatch;XCTAssertTrue(e.waitForExistence(timeout:12),s);for _ in 0..<8{if e.isHittable{break};app.swipeUp()};e.tap()}
  let name="QA iPhone "+(terminated ? "terminated" : "background")+" 20261117 "+String(Int(Date().timeIntervalSince1970))
  tap("Home");tap("Reminders");tap("Add Reminder ›")
  let title=app.textViews.matching(identifier:"Reminder title (Required)").firstMatch;XCTAssertTrue(title.waitForExistence(timeout:10));title.tap();title.typeText(name);app.swipeDown()
  let clock=app.buttons.matching(NSPredicate(format:"label MATCHES %@","[0-9]{1,2}:[0-9]{2}.*[AP]M")).firstMatch;clock.tap()
  let target=Date().addingTimeInterval(120);let f=DateFormatter();f.locale=Locale(identifier:"en_US_POSIX");f.dateFormat="h";let hour=f.string(from:target);f.dateFormat="mm";let minute=f.string(from:target);f.dateFormat="a";let period=f.string(from:target)
  XCTAssertEqual(app.pickerWheels.count,3)
  for (index,value) in [(0,hour),(1,minute),(2,period)] {
   let wheel=app.pickerWheels.element(boundBy:index)
   for _ in 0..<4 {
    if (wheel.value as? String ?? "").hasPrefix(value){break}
    wheel.adjust(toPickerWheelValue:value)
    let e=expectation(description:"Settle notification time wheel");DispatchQueue.main.asyncAfter(deadline:.now()+1){e.fulfill()};wait(for:[e],timeout:3)
   }
   XCTAssertTrue((wheel.value as? String ?? "").hasPrefix(value),"Exact notification wheel value required")
  }
  tap("Done");XCTAssertTrue(clock.label.contains(hour+":"+minute));XCTAssertTrue(clock.label.contains(period))
  let schedule=XCTAttachment(screenshot:app.screenshot());schedule.name="Verified notification schedule before Save";schedule.lifetime = .keepAlways;add(schedule)
  tap("Save Reminder")
  let sb=XCUIApplication(bundleIdentifier:"com.apple.springboard")
  if sb.alerts.firstMatch.waitForExistence(timeout:3),sb.buttons["Allow"].exists{sb.buttons["Allow"].tap()}
  tap("Home")
  if terminated {app.terminate()} else {XCUIDevice.shared.press(.home)}
  let banner=sb.descendants(matching:.any).matching(NSPredicate(format:"label CONTAINS %@",name)).firstMatch
  XCTAssertTrue(banner.waitForExistence(timeout:150),"No observed lifecycle reminder banner; delivery/routing unverified")
  let a=XCTAttachment(screenshot:sb.screenshot());a.name="Lifecycle notification before tap";a.lifetime = .keepAlways;add(a);banner.tap()
  XCTAssertTrue(title.waitForExistence(timeout:15));XCTAssertEqual(title.value as? String,name)
  let b=XCTAttachment(screenshot:app.screenshot());b.name="Notification opened exact standalone reminder";b.lifetime = .keepAlways;add(b)
 }
}
