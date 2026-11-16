import XCTest
final class SearchLocationTests: XCTestCase {
 @MainActor func testSearchContextAndLocation() throws {
  let app=XCUIApplication(bundleIdentifier:"com.designsbyfa.casitadex.plusstoreqa")
  app.launch()
  func tap(_ label:String){let e=app.descendants(matching:.any).matching(identifier:label).firstMatch;XCTAssertTrue(e.waitForExistence(timeout:15),label);e.tap()}
  func capture(_ name:String){let a=XCTAttachment(screenshot:app.screenshot());a.name=name;a.lifetime = .keepAlways;add(a)}
  tap("Home");tap("Search Memories")
  let field=app.descendants(matching:.any).matching(identifier:"find-query").firstMatch
  XCTAssertTrue(field.waitForExistence(timeout:15))
  XCTAssertTrue((field.value as? String ?? "").isEmpty || (field.value as? String)=="Search memories…")
  field.tap();field.typeText("filter")
  if app.keyboards.buttons["search"].exists {app.keyboards.buttons["search"].tap()}
  capture("ios-search-entered")
  let result=app.buttons.matching(NSPredicate(format:"label BEGINSWITH 'Open ' AND label CONTAINS ' memory '")).firstMatch
  XCTAssertTrue(result.waitForExistence(timeout:15));result.tap()
  let back=app.buttons.matching(NSPredicate(format:"label BEGINSWITH 'Back' OR label BEGINSWITH '‹'")).firstMatch
  XCTAssertTrue(back.waitForExistence(timeout:10));back.tap()
  XCTAssertEqual(field.value as? String,"filter");capture("ios-return-query")
  tap("Home");tap("Find");XCTAssertTrue((field.value as? String ?? "").isEmpty || (field.value as? String)=="Search memories…")
  tap("Location  ▾");XCTAssertTrue(app.buttons["All"].waitForExistence(timeout:10));capture("ios-location-options");tap("All")
  tap("With photos only");capture("ios-photo-filter");tap("Home");tap("Find")
  capture("ios-fresh-find");tap("Home")
 }
 @MainActor func testLocationSelectionReturnAndClear() throws {
  let app=XCUIApplication(bundleIdentifier:"com.designsbyfa.casitadex.plusstoreqa");app.launch()
  func tap(_ label:String){let e=app.descendants(matching:.any).matching(identifier:label).firstMatch;XCTAssertTrue(e.waitForExistence(timeout:12),label);e.tap()}
  tap("Home");tap("Search Memories");tap("Location  ▾")
  let option=app.buttons.matching(NSPredicate(format:"label CONTAINS ' · '")).firstMatch
  XCTAssertTrue(option.waitForExistence(timeout:10));let label=option.label;option.tap()
  XCTAssertTrue(app.buttons[label+"  ▾"].waitForExistence(timeout:10))
  let result=app.buttons.matching(NSPredicate(format:"label BEGINSWITH 'Open ' AND label CONTAINS ' memory '")).firstMatch
  XCTAssertTrue(result.waitForExistence(timeout:10));result.tap();tap("‹ Results")
  XCTAssertTrue(app.buttons[label+"  ▾"].waitForExistence(timeout:10))
  let a=XCTAttachment(screenshot:app.screenshot());a.name="ios-location-restored";a.lifetime = .keepAlways;add(a)
  tap(label+"  ▾");tap("All");XCTAssertTrue(app.buttons["Location  ▾"].exists)
  tap("Home")
 }

 @MainActor func testPagingReturn() throws {
  let app=XCUIApplication(bundleIdentifier:"com.designsbyfa.casitadex.plusstoreqa");app.launch()
  func tap(_ label:String){let e=app.descendants(matching:.any).matching(identifier:label).firstMatch;XCTAssertTrue(e.waitForExistence(timeout:12),label);e.tap()}
  tap("Home");tap("Search Memories");app.buttons["Next"].firstMatch.tap()
  let result=app.buttons.matching(NSPredicate(format:"label BEGINSWITH 'Open ' AND label CONTAINS ' memory '")).firstMatch
  XCTAssertTrue(result.waitForExistence(timeout:10));XCTAssertTrue(result.isHittable)
  XCTAssertGreaterThanOrEqual(result.frame.minY,app.buttons["With photos only"].frame.maxY)
  result.tap();tap("‹ Results")
  XCTAssertTrue(app.staticTexts.matching(NSPredicate(format:"label BEGINSWITH 'Page 2 of'")).firstMatch.waitForExistence(timeout:10))
  let a=XCTAttachment(screenshot:app.screenshot());a.name="ios-page-two-restored";a.lifetime = .keepAlways;add(a)
  app.buttons["Previous"].firstMatch.tap();tap("Home")
 }

}

final class KeyboardFieldTests: XCTestCase {
 @MainActor func testCoreEntryFieldsStayAboveKeyboard() throws {
  continueAfterFailure=false
  let app=XCUIApplication(bundleIdentifier:"com.designsbyfa.casitadex.plusstoreqa");app.launch()
  func tap(_ label:String){
   let e=app.descendants(matching:.any).matching(identifier:label).firstMatch
   XCTAssertTrue(e.waitForExistence(timeout:12),label)
   for _ in 0..<12 {if e.isHittable {break};app.swipeUp()}
   e.tap()
  }
  func probe(_ label:String){
   let e=label=="Search memories" ? app.descendants(matching:.any).matching(identifier:"find-query").firstMatch : app.descendants(matching:.any).matching(NSPredicate(format:"(elementType == %d OR elementType == %d) AND label == %@",XCUIElement.ElementType.textField.rawValue,XCUIElement.ElementType.textView.rawValue,label)).firstMatch
   XCTAssertTrue(e.waitForExistence(timeout:10),label)
   for _ in 0..<12 {if e.isHittable {break};app.swipeUp()}
   let before=e.value as? String;e.tap()
   XCTAssertTrue(app.keyboards.firstMatch.waitForExistence(timeout:8),"Keyboard: "+label)
   let visible=NSPredicate{_,_ in e.frame.maxY <= app.keyboards.firstMatch.frame.minY && e.frame.minY>=0}
   expectation(for:visible,evaluatedWith:nil);waitForExpectations(timeout:5)
   XCTAssertEqual(e.value as? String,before)
   let shot=XCTAttachment(screenshot:app.screenshot());shot.name="keyboard-"+label;shot.lifetime = .keepAlways;add(shot)
   app.scrollViews.firstMatch.swipeDown()
  }
  tap("Home");tap("Add Memory")
  if app.buttons["Resume draft"].waitForExistence(timeout:2) {app.buttons["Resume draft"].tap()}
  probe("Memory name (Required)");probe("Description")
  tap("Edit Notes");probe("Notes");tap("Done editing Notes")
  tap("Edit Reference");probe("Reference");tap("Done editing Reference")
  tap("Choose Location");probe("Search locations");tap("Create new Location");probe("Location name");tap("Cancel");tap("Cancel")
  tap("Home");tap("Find");probe("Search memories")
  tap("Reminders");tap("Add Reminder ›");probe("Reminder title (Required)");tap("More options ▾");probe("Notes");tap("Cancel")
  tap("Home")
 }
}

final class UnifiedTaxonomyPickerTests: XCTestCase {
 @MainActor func testSharedPickersAndCategoryCancellation() throws {
  continueAfterFailure=false
  let app=XCUIApplication(bundleIdentifier:"com.designsbyfa.casitadex.plusstoreqa");app.launch()
  func button(_ label:String)->XCUIElement {app.descendants(matching:.any).matching(identifier:label).firstMatch}
  func tap(_ label:String){let e=button(label);XCTAssertTrue(e.waitForExistence(timeout:12),label);for _ in 0..<8 {if e.isHittable {break};app.swipeUp()};e.tap()}
  func capture(_ label:String){let a=XCTAttachment(screenshot:app.screenshot());a.name=label;a.lifetime = .keepAlways;add(a)}
  tap("Home");tap("Add Memory")
  if button("Resume draft").waitForExistence(timeout:2){tap("Resume draft")}
  tap("Cancel");tap("Home");tap("Find")
  let result=app.buttons.matching(NSPredicate(format:"label BEGINSWITH 'Open ' AND label CONTAINS ' memory '")).firstMatch
  XCTAssertTrue(result.waitForExistence(timeout:10));result.tap();tap("Edit memory")
  let original=button("Choose Categories").value as? String
  tap("Choose Categories");tap("None");tap("Cancel");XCTAssertEqual(button("Choose Categories").value as? String,original)
  tap("Choose Categories");tap("None")
  let options=app.buttons.allElementsBoundByIndex.filter{$0.isHittable}.map{$0.label}.filter{!["Cancel","Done","None","Create new Category"].contains($0)}
  XCTAssertGreaterThanOrEqual(options.count,2);app.buttons.matching(NSPredicate(format:"label == %@",options[0])).firstMatch.tap();app.buttons.matching(NSPredicate(format:"label == %@",options[1])).firstMatch.tap();tap("Done")
  let changed=button("Choose Categories").value as? String ?? ""
  XCTAssertTrue(changed.contains(options[0]));XCTAssertTrue(changed.contains(options[1]));capture("categories-selected")
  tap("Choose Categories");tap("None");tap("Cancel");XCTAssertEqual(button("Choose Categories").value as? String,changed)
  tap("Cancel");tap("Edit memory");XCTAssertEqual(button("Choose Categories").value as? String,original)
  tap("Cancel");tap("Home")
 }
}

final class UnifiedPickerKeyboardTests: XCTestCase {
 @MainActor func runProbe(_ label:String,_ noun:String,_ field:String,_ create:Bool) {
  continueAfterFailure=false
  let app=XCUIApplication(bundleIdentifier:"com.designsbyfa.casitadex.plusstoreqa");app.launch()
  func element(_ s:String)->XCUIElement{app.descendants(matching:.any).matching(identifier:s).firstMatch}
  func tap(_ s:String){let e=element(s);XCTAssertTrue(e.waitForExistence(timeout:10),s);for _ in 0..<8{if e.isHittable{break};app.swipeUp()};e.tap()}
  tap("Home");tap("Add Memory");if element("Resume draft").waitForExistence(timeout:1){tap("Resume draft")}
  tap("Choose "+label);if create{tap("Create new "+noun)}
  let e=app.descendants(matching:.any).matching(NSPredicate(format:"(elementType == %d OR elementType == %d) AND label == %@",XCUIElement.ElementType.textField.rawValue,XCUIElement.ElementType.textView.rawValue,field)).firstMatch
  XCTAssertTrue(e.waitForExistence(timeout:10));let original=e.value as? String;e.tap();XCTAssertTrue(app.keyboards.firstMatch.waitForExistence(timeout:8))
  let visible=NSPredicate{_,_ in e.frame.minY>=0 && e.frame.maxY<=app.keyboards.firstMatch.frame.minY}
  expectation(for:visible,evaluatedWith:nil);waitForExpectations(timeout:5);XCTAssertEqual(e.value as? String,original)
  let a=XCTAttachment(screenshot:app.screenshot());a.name="Large "+field;a.lifetime = .keepAlways;add(a);app.terminate()
 }
 @MainActor func testSpaceSearch(){runProbe("Space","Space","Search spaces",false)}
 @MainActor func testSpaceCreate(){runProbe("Space","Space","Space name",true)}
 @MainActor func testCategorySearch(){runProbe("Categories","Category","Search categories",false)}
 @MainActor func testCategoryCreate(){runProbe("Categories","Category","Category name",true)}
 @MainActor func testLocationSearch(){runProbe("Location","Location","Search locations",false)}
 @MainActor func testLocationCreate(){runProbe("Location","Location","Location name",true)}
}

final class ReminderControlReviewTests: XCTestCase {
 @MainActor func testDateAndTimePresentation() {
  continueAfterFailure=true
  let app=XCUIApplication(bundleIdentifier:"com.designsbyfa.casitadex.plusstoreqa");app.launch()
  func tap(_ s:String){let e=app.descendants(matching:.any).matching(identifier:s).firstMatch;XCTAssertTrue(e.waitForExistence(timeout:12),s);for _ in 0..<8{if e.isHittable{break};app.swipeUp()};e.tap()}
  func capture(_ s:String){let a=XCTAttachment(screenshot:app.screenshot());a.name=s;a.lifetime = .keepAlways;add(a)}
  tap("Home");tap("Reminders");capture("Reminders list");tap("Add Reminder ›");capture("Add Reminder")
  let date=app.buttons.matching(NSPredicate(format:"label MATCHES %@", "[0-9]{4}-[0-9]{2}-[0-9]{2}")).firstMatch
  let time=app.buttons.matching(NSPredicate(format:"label MATCHES %@", "[0-9]{1,2}:[0-9]{2}.*[AP]M")).firstMatch
  for (kind,control) in [("date",date),("time",time)]{
   XCTAssertTrue(control.waitForExistence(timeout:10));let label=control.label
   for _ in 0..<8{if control.isHittable{break};app.swipeUp()};control.tap()
   XCTAssertTrue(app.staticTexts["Choose a "+kind].waitForExistence(timeout:10))
   let picker=app.datePickers.firstMatch;XCTAssertTrue(picker.waitForExistence(timeout:5))
   let done=app.buttons["Done"];XCTAssertTrue(done.exists);XCTAssertTrue(done.isHittable)
   capture("Reminder "+kind+" picker")
   XCTAssertGreaterThanOrEqual(picker.frame.minX,0);XCTAssertLessThanOrEqual(picker.frame.maxX,app.frame.maxX);XCTAssertLessThanOrEqual(done.frame.maxY,app.frame.maxY)
   done.tap();XCTAssertEqual(control.label,label)
  }
  tap("Cancel");tap("Home")
 }
}

final class PhysicalReminderWorkflowTests: XCTestCase {
 @MainActor func testChangedPickerValuesAndDiscard() {
  continueAfterFailure=false
  let app=XCUIApplication(bundleIdentifier:"com.designsbyfa.casitadex.plusstoreqa");app.launch()
  func tap(_ s:String){let e=app.descendants(matching:.any).matching(identifier:s).firstMatch;XCTAssertTrue(e.waitForExistence(timeout:12),s);for _ in 0..<8{if e.isHittable{break};app.swipeUp()};e.tap()}
  tap("Home");tap("Reminders");tap("Add Reminder ›")
  let date=app.buttons.matching(NSPredicate(format:"label MATCHES %@","[0-9]{4}-[0-9]{2}-[0-9]{2}")).firstMatch
  let oldDate=date.label;date.tap()
  let day=app.datePickers.firstMatch.buttons.matching(NSPredicate(format:"label CONTAINS '28'")).firstMatch
  XCTAssertTrue(day.waitForExistence(timeout:8));day.tap();tap("Done")
  XCTAssertNotEqual(date.label,oldDate);XCTAssertTrue(date.label.hasSuffix("-28"))
  let clock=app.buttons.matching(NSPredicate(format:"label MATCHES %@","[0-9]{1,2}:[0-9]{2}.*[AP]M")).firstMatch
  let oldTime=clock.label;clock.tap();let wheel=app.pickerWheels.element(boundBy:1)
  XCTAssertTrue(wheel.waitForExistence(timeout:8));let value=(wheel.value as? String ?? "").contains("49") ? "48" : "49";for _ in 0..<4 {
   wheel.adjust(toPickerWheelValue:value)
   let settling=expectation(description:"Wait for wheel animation");DispatchQueue.main.asyncAfter(deadline:.now()+1){settling.fulfill()};wait(for:[settling],timeout:3)
   print("Minute wheel after adjustment: "+String(describing:wheel.value))
   if (wheel.value as? String ?? "").hasPrefix(value){break}
  }
  let settled=expectation(for:NSPredicate(format:"value BEGINSWITH %@",value),evaluatedWith:wheel);wait(for:[settled],timeout:8)
  let settling=expectation(description:"Native picker change reaches editor");DispatchQueue.main.asyncAfter(deadline:.now()+1){settling.fulfill()};wait(for:[settling],timeout:3)
  let pick=XCTAttachment(screenshot:app.screenshot());pick.name="Exact minute selection before Done";pick.lifetime = .keepAlways;add(pick)
  tap("Done");XCTAssertNotEqual(clock.label,oldTime);XCTAssertTrue(clock.label.contains(":"+value),"Editor must retain the exact chosen minute: "+clock.label)
  let a=XCTAttachment(screenshot:app.screenshot());a.name="Changed date and time retained in draft";a.lifetime = .keepAlways;add(a)
  tap("Cancel");XCTAssertTrue(app.alerts["Discard reminder changes?"].waitForExistence(timeout:5));tap("Discard changes");tap("Home")
 }
 @MainActor func testLinkedReminderSaveReturnsToDetails() {
  continueAfterFailure=false
  let app=XCUIApplication(bundleIdentifier:"com.designsbyfa.casitadex.plusstoreqa");app.launch()
  func tap(_ s:String){let e=app.descendants(matching:.any).matching(identifier:s).firstMatch;XCTAssertTrue(e.waitForExistence(timeout:12),s);for _ in 0..<8{if e.isHittable{break};app.swipeUp()};e.tap()}
  tap("Home");tap("Find")
  let result=app.buttons.matching(NSPredicate(format:"label BEGINSWITH 'Open ' AND label CONTAINS '[SAMPLE]' AND label CONTAINS ' memory '")).firstMatch
  XCTAssertTrue(result.waitForExistence(timeout:12));let originalLabel=result.label;result.tap()
  XCTAssertTrue(app.buttons["Edit memory"].waitForExistence(timeout:10));tap("More ···");tap("Remind me later")
  let title=app.textViews.matching(identifier:"Reminder title (Required)").firstMatch
  XCTAssertTrue(title.waitForExistence(timeout:10));title.tap();title.typeText(" — QA iPhone save-return 20261116")
  app.swipeDown();tap("Save Reminder")
  let springboard=XCUIApplication(bundleIdentifier:"com.apple.springboard")
  if springboard.alerts.firstMatch.waitForExistence(timeout:3),springboard.buttons["Allow"].exists{springboard.buttons["Allow"].tap()}
  XCTAssertTrue(app.buttons["Edit memory"].waitForExistence(timeout:15));XCTAssertTrue(app.buttons["‹ Results"].exists)
  let a=XCTAttachment(screenshot:app.screenshot());a.name="Linked reminder saved and returned to Memory Details: "+originalLabel;a.lifetime = .keepAlways;add(a)
  tap("Home")
 }
}

final class PhysicalNotificationTests: XCTestCase {
 @MainActor func testForegroundNotificationTap() {
  continueAfterFailure=false
  let app=XCUIApplication(bundleIdentifier:"com.designsbyfa.casitadex.plusstoreqa");app.launch()
  func tap(_ s:String){let e=app.descendants(matching:.any).matching(identifier:s).firstMatch;XCTAssertTrue(e.waitForExistence(timeout:12),s);for _ in 0..<8{if e.isHittable{break};app.swipeUp()};e.tap()}
  let name="QA iPhone foreground notification 20261116"
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
  let banner=sb.descendants(matching:.any).matching(NSPredicate(format:"label CONTAINS %@",name)).firstMatch
  XCTAssertTrue(banner.waitForExistence(timeout:150),"No observed foreground reminder banner; delivery/routing unverified")
  let a=XCTAttachment(screenshot:sb.screenshot());a.name="Foreground notification before tap";a.lifetime = .keepAlways;add(a);banner.tap()
  XCTAssertTrue(title.waitForExistence(timeout:15));XCTAssertEqual(title.value as? String,name)
  let b=XCTAttachment(screenshot:app.screenshot());b.name="Notification opened exact standalone reminder";b.lifetime = .keepAlways;add(b);tap("Cancel");tap("Home")
 }
}

final class PhysicalNotificationLifecycleTests: XCTestCase {
 @MainActor func testBackgroundStandalone(){runNotification("background",linked:false)}
 @MainActor func testTerminatedStandalone(){runNotification("terminated",linked:false)}
 @MainActor func testLinkedMemoryForeground(){runNotification("foreground",linked:true)}
 @MainActor private func runNotification(_ lifecycle:String,linked:Bool) {
  continueAfterFailure=false
  let app=XCUIApplication(bundleIdentifier:"com.designsbyfa.casitadex.plusstoreqa");app.launch()
  func tap(_ s:String){let e=app.descendants(matching:.any).matching(identifier:s).firstMatch;XCTAssertTrue(e.waitForExistence(timeout:12),s);for _ in 0..<8{if e.isHittable{break};app.swipeUp()};e.tap()}
  let name="QA lifecycle "+lifecycle+(linked ? " linked" : " standalone")+" 20261116"
  tap("Home")
  if linked {
   tap("Find");let result=app.buttons.matching(NSPredicate(format:"label BEGINSWITH 'Open ' AND label CONTAINS '[SAMPLE] Coffee filters'")).firstMatch
   XCTAssertTrue(result.waitForExistence(timeout:12));result.tap();tap("More ···");tap("Remind me later")
  } else {tap("Reminders");tap("Add Reminder ›")}
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
  if lifecycle=="background" {
   XCUIDevice.shared.press(.home)
   let background=expectation(for:NSPredicate{_,_ in app.state == .runningBackground || app.state == .runningBackgroundSuspended},evaluatedWith:nil)
   wait(for:[background],timeout:10)
  }
  if lifecycle=="terminated" {app.terminate();XCTAssertEqual(app.state,.notRunning)}
  let banner=sb.descendants(matching:.any).matching(NSPredicate(format:"label CONTAINS %@",name)).firstMatch
  XCTAssertTrue(banner.waitForExistence(timeout:150),"No observed foreground reminder banner; delivery/routing unverified")
  let a=XCTAttachment(screenshot:sb.screenshot());a.name="Foreground notification before tap";a.lifetime = .keepAlways;add(a);banner.tap()
  XCTAssertTrue(app.wait(for:.runningForeground,timeout:15))
  if linked {
   XCTAssertTrue(app.buttons["Edit memory"].waitForExistence(timeout:15))
   XCTAssertTrue(app.staticTexts["[SAMPLE] Coffee filters"].waitForExistence(timeout:10))
  } else {XCTAssertTrue(title.waitForExistence(timeout:15));XCTAssertEqual(title.value as? String,name)}
  let bannerSettled=expectation(description:"Notification animation settles before editor navigation");DispatchQueue.main.asyncAfter(deadline:.now()+6){bannerSettled.fulfill()};wait(for:[bannerSettled],timeout:8)
  let b=XCTAttachment(screenshot:app.screenshot());b.name="Notification destination "+lifecycle+(linked ? " linked Coffee filters" : " standalone");b.lifetime = .keepAlways;add(b)
  if !linked{tap("Cancel")};tap("Home")
 }
}
