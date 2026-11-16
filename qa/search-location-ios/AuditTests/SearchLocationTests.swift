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
