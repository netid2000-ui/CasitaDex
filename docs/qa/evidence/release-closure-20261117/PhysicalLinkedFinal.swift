import XCTest
final class PhysicalLinkedNotificationTests: XCTestCase {

 @MainActor func testLinkedTerminatedNotificationTap() {runNotification(terminated:true)}
 @MainActor func runNotification(terminated:Bool) {
  continueAfterFailure=false
  let app=XCUIApplication(bundleIdentifier:"com.designsbyfa.casitadex.plusstoreqa");app.launch()
  func tap(_ s:String){let e=app.descendants(matching:.any).matching(identifier:s).firstMatch;XCTAssertTrue(e.waitForExistence(timeout:12),s);for _ in 0..<8{if e.isHittable{break};app.swipeUp()};e.tap()}
  let name="QA linked 20261117 "+String(Int(Date().timeIntervalSince1970))
  tap("Home");tap("Find")
  let result=app.buttons.matching(NSPredicate(format:"label BEGINSWITH 'Open ' AND label CONTAINS '[SAMPLE]' AND label CONTAINS ' memory '")).firstMatch
  XCTAssertTrue(result.waitForExistence(timeout:12));let originalTitle=result.label.components(separatedBy:" memory ").dropFirst().joined(separator:" memory ");result.tap()
  XCTAssertTrue(app.buttons["Edit memory"].waitForExistence(timeout:10));tap("More ···");tap("Remind me later")
  let title=app.textViews.matching(identifier:"Reminder title (Required)").firstMatch;XCTAssertTrue(title.waitForExistence(timeout:10));title.tap();title.typeText(" — "+name);app.swipeDown()
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
  XCTAssertTrue(app.buttons["Edit memory"].waitForExistence(timeout:15));XCTAssertTrue(app.descendants(matching:.any).matching(identifier:originalTitle).firstMatch.exists)
  let b=XCTAttachment(screenshot:app.screenshot());b.name="Notification opened originating memory";b.lifetime = .keepAlways;add(b)
 }
}
