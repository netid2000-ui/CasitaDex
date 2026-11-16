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
