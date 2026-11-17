import XCTest
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
  let b=XCTAttachment(screenshot:app.screenshot());b.name="Notification opened exact standalone reminder";b.lifetime = .keepAlways;add(b);tap("Cancel");tap("Home")
 }
}
