import XCTest
import StoreKitTest

// Separate runner keeps the same StoreKit session alive while only the app restarts.
// Supervisor compares native transaction IDs/PIDs in app diagnostics before releasing each stage.
final class PlusRecoveryUITests: XCTestCase {
 @MainActor func testInterruptedDeliveryAcrossAppRestart() async throws {
  let url = try XCTUnwrap(Bundle(for: Self.self).url(forResource: "CasitaDexPlus", withExtension: "storekit"))
  let session = try SKTestSession(contentsOf: url)
  session.resetToDefaultState(); session.clearTransactions(); session.disableDialogs = true
  defer { session.clearTransactions(); session.resetToDefaultState() }
  let directory = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0]
  let stage = directory.appendingPathComponent("plus-recovery-stage.json")
  let advance = directory.appendingPathComponent("plus-recovery-advance.txt")
  if FileManager.default.fileExists(atPath: advance.path) { try FileManager.default.removeItem(at: advance) }
  func waitForSupervisor(_ expected: String) async throws {
   for _ in 0..<600 {
    if (try? String(contentsOf: advance, encoding: .utf8)) == expected { return }
    try await Task.sleep(nanoseconds: 500_000_000)
   }
   XCTFail("Supervisor did not validate " + expected)
   throw NSError(domain: "PlusRecoveryQA", code: 1)
  }
  func record(_ value: String, _ transaction: String) throws {
   let data = try JSONSerialization.data(withJSONObject: ["stage": value, "transaction": transaction])
   try data.write(to: stage, options: .atomic)
  }
  let app = XCUIApplication(bundleIdentifier: "com.designsbyfa.casitadex.plusstoreqa")
  app.launchEnvironment = ["CASITADEX_DEFER_DELIVERY_QA": "1"]
  app.launch()
  _ = try await session.buyProduct(identifier: "local.casitadex.plus.qa")
  let transaction = try XCTUnwrap(session.allTransactions().first)
  let transactionID = String(transaction.identifier)
  try record("seed", transactionID)
  print("PLUS UI RECOVERY: seed transaction " + transactionID)
  try await waitForSupervisor("seed-verified")
  app.terminate()
  XCTAssertEqual(app.state, .notRunning)
  app.launchEnvironment = [:]
  app.launch()
  try record("restarted", transactionID)
  try await waitForSupervisor("recovery-verified")
  XCTAssertEqual(session.allTransactions().count, 1)
  XCTAssertEqual(session.allTransactions().first?.identifier, transaction.identifier)
  try record("complete", transactionID)
  print("PLUS UI RECOVERY: same StoreKit session and transaction across app restart; supervisor validated native finishing")
 }
}

extension PlusRecoveryUITests {
 @MainActor func testPurchaseAndRestoreControls() async throws {
  let url = try XCTUnwrap(Bundle(for: Self.self).url(forResource: "CasitaDexPlus", withExtension: "storekit"))
  let session = try SKTestSession(contentsOf: url)
  session.resetToDefaultState(); session.clearTransactions(); session.disableDialogs = true
  defer { session.clearTransactions(); session.resetToDefaultState() }
  let app = XCUIApplication(bundleIdentifier: "com.designsbyfa.casitadex.plusstoreqa")
  app.launch()
  app.open(URL(string: "casitadex-plusstoreqa://plus")!)
  func expectLabel(_ id: String, _ contains: String) {
   let element = app.staticTexts[id]
   let predicate = NSPredicate(format: "exists == true AND label CONTAINS %@", contains)
   XCTAssertTrue(XCTWaiter.wait(for: [XCTNSPredicateExpectation(predicate: predicate, object: element)], timeout: 15) == .completed, id + " expected " + contains + " got " + element.label)
  }
  let purchase=app.buttons["plus-purchase"], restore=app.buttons["plus-restore"]
  XCTAssertTrue(purchase.waitForExistence(timeout: 15))
  expectLabel("plus-ownership", "Free plan")
  XCTAssertTrue(XCTWaiter.wait(for: [XCTNSPredicateExpectation(predicate: NSPredicate(format: "enabled == true"), object: purchase)], timeout: 15) == .completed)
  XCTAssertTrue(purchase.label.contains("$19.99"))
  restore.tap()
  expectLabel("plus-status", "No Plus purchase")
  purchase.tap()
  expectLabel("plus-ownership", "Verified Plus access")
  XCTAssertFalse(purchase.isEnabled)
  let shot = XCTAttachment(screenshot: app.screenshot());shot.name="Plus owned controls";shot.lifetime = .keepAlways;add(shot)
  restore.tap()
  expectLabel("plus-status", "Plus is active")
  let transaction=try XCTUnwrap(session.allTransactions().first)
  try session.refundTransaction(identifier: transaction.identifier)
  expectLabel("plus-ownership", "Free plan")
  expectLabel("plus-status", "no longer active")
  try await session.setSimulatedError(.generic(.userCancelled), forAPI: .purchase)
  purchase.tap()
  expectLabel("plus-status", "Unable to complete")
  expectLabel("plus-ownership", "Free plan")
  session.resetToDefaultState();session.disableDialogs=true;session.askToBuyEnabled=true
  purchase.tap()
  expectLabel("plus-status", "awaiting approval")
  expectLabel("plus-ownership", "Free plan")
  let pending=try XCTUnwrap(session.allTransactions().first(where: { $0.pendingAskToBuyConfirmation }))
  try session.approveAskToBuyTransaction(identifier: pending.identifier)
  expectLabel("plus-ownership", "Verified Plus access")
  let finalShot=XCTAttachment(screenshot:app.screenshot());finalShot.name="Plus approved controls";finalShot.lifetime = .keepAlways;add(finalShot)
  app.buttons["Back to Settings"].tap()
  XCTAssertTrue(app.staticTexts["Settings"].waitForExistence(timeout: 10))
  print("PLUS UI: free restore, purchase, owned restore, refund, error, pending approval, settings return PASS")
 }
}

extension PlusRecoveryUITests {
 @MainActor func testMemoryLimitNotice() async throws {
  let url=try XCTUnwrap(Bundle(for:Self.self).url(forResource:"CasitaDexPlus",withExtension:"storekit"))
  let session=try SKTestSession(contentsOf:url)
  session.resetToDefaultState();session.clearTransactions();session.disableDialogs=true
  defer { session.clearTransactions();session.resetToDefaultState() }
  let app=XCUIApplication(bundleIdentifier:"com.designsbyfa.casitadex.plusstoreqa")
  app.launch();app.open(URL(string:"casitadex-plusstoreqa://add")!)
  let notice=app.staticTexts["memory-limit-notice"]
  XCTAssertTrue(notice.waitForExistence(timeout:15),"Existing QA collection must exceed free limit")
  let y=app.buttons["View CasitaDex Plus"].frame.minY
  app.swipeUp()
  XCTAssertEqual(app.buttons["View CasitaDex Plus"].frame.minY,y,accuracy:1)
  let shot=XCTAttachment(screenshot:app.screenshot());shot.name="Free memory limit fixed actions";shot.lifetime = .keepAlways;add(shot)
  app.buttons["View CasitaDex Plus"].tap()
  XCTAssertTrue(app.buttons["plus-purchase"].waitForExistence(timeout:10))
  _ = try await session.buyProduct(identifier:"local.casitadex.plus.qa")
  let ownership=app.staticTexts["plus-ownership"]
  XCTAssertTrue(XCTWaiter.wait(for:[XCTNSPredicateExpectation(predicate:NSPredicate(format:"label CONTAINS %@","Verified Plus access"),object:ownership)],timeout:15) == .completed)
  app.open(URL(string:"casitadex-plusstoreqa://add")!)
  XCTAssertTrue(app.buttons["Save"].waitForExistence(timeout:10))
  XCTAssertFalse(notice.exists)
  print("MEMORY LIMIT UI: existing collection preserved, fixed notice and upgrade route, verified Plus removes notice PASS")
 }
}

extension PlusRecoveryUITests {
 @MainActor func testNativeMemoryBoundary() async throws {
  continueAfterFailure=false
  let url=try XCTUnwrap(Bundle(for:Self.self).url(forResource:"CasitaDexPlus",withExtension:"storekit"))
  let session=try SKTestSession(contentsOf:url)
  session.resetToDefaultState();session.clearTransactions();session.disableDialogs=true
  defer { session.clearTransactions();session.resetToDefaultState() }
  let app=XCUIApplication(bundleIdentifier:"com.designsbyfa.casitadex.plusstoreqa")
  app.launch();app.open(URL(string:"casitadex-plusstoreqa://add")!)
  let save=app.buttons["Save"]
  XCTAssertTrue(save.waitForExistence(timeout:15));XCTAssertTrue(save.isEnabled);save.tap()
  XCTAssertTrue(app.buttons["Add Memory"].waitForExistence(timeout:15))
  app.open(URL(string:"casitadex-plusstoreqa://add")!)
  let notice=app.staticTexts["memory-limit-notice"]
  XCTAssertTrue(notice.waitForExistence(timeout:10));XCTAssertTrue(notice.label.contains("20 of 20"))
  let name=app.textViews["Memory name (Required)"]
  XCTAssertTrue(name.waitForExistence(timeout:10));name.tap();for character in "Boundary twenty first memory" { name.typeText(String(character));try await Task.sleep(nanoseconds:150_000_000) }
  XCTAssertEqual(name.value as? String,"Boundary twenty first memory");name.typeText("\n")
  let description=app.textViews["Description"]
  for _ in 0..<8 { if description.isHittable { break };app.scrollViews.firstMatch.swipeUp() }
  XCTAssertTrue(description.isHittable);description.tap();for character in "Preserve this native draft" { description.typeText(String(character));try await Task.sleep(nanoseconds:150_000_000) }
  XCTAssertEqual(description.value as? String,"Preserve this native draft")
  save.tap()
  let blocked=app.staticTexts.containing(NSPredicate(format:"label CONTAINS %@","Your free plan includes 20 saved memories")).firstMatch
  XCTAssertTrue(blocked.waitForExistence(timeout:10))
  let shot=XCTAttachment(screenshot:app.screenshot());shot.name="Twenty first native save blocked";shot.lifetime = .keepAlways;add(shot)
  app.terminate();app.launch();app.open(URL(string:"casitadex-plusstoreqa://add")!)
  XCTAssertTrue(name.waitForExistence(timeout:15));XCTAssertEqual(name.value as? String,"Boundary twenty first memory")
  XCTAssertTrue(notice.label.contains("20 of 20"))
  print("NATIVE BOUNDARY PASS: save twentieth, block twenty-first, draft survives cold restart")
 }
}

extension PlusRecoveryUITests {
 @MainActor func testRapidDraftInput() async throws {
  continueAfterFailure=false
  let app=XCUIApplication(bundleIdentifier:"com.designsbyfa.casitadex.plusstoreqa")
  app.launch();app.open(URL(string:"casitadex-plusstoreqa://add")!)
  let name=app.textViews["Memory name (Required)"]
  XCTAssertTrue(name.waitForExistence(timeout:15))
  let expected="Boundary twenty first memory rapid typing 20x25x1"
  name.tap();name.typeText(expected)
  print("RAPID_INPUT immediate title: " + (name.value as? String ?? "nil"))
  let shot=XCTAttachment(screenshot:app.screenshot());shot.name="Rapid input immediate";shot.lifetime = .keepAlways;add(shot)
  XCTAssertEqual(name.value as? String,expected,"Burst typing must arrive intact before persistence")
  name.typeText("\n")
  let description=app.textViews["Description"]
  for _ in 0..<8 {if description.isHittable {break};app.scrollViews.firstMatch.swipeUp()}
  XCTAssertTrue(description.isHittable)
  let body="Garage shelf: filter size 20x25x1. Keep the replacement beside the water shutoff."
  description.tap();description.typeText(body)
  XCTAssertEqual(description.value as? String,body)
  app.buttons["Cancel"].tap()
  XCTAssertTrue(app.buttons["Add Memory"].waitForExistence(timeout:10))
  app.terminate();app.launch();app.open(URL(string:"casitadex-plusstoreqa://add")!)
  XCTAssertTrue(name.waitForExistence(timeout:15));XCTAssertEqual(name.value as? String,expected)
  for _ in 0..<8 {if description.isHittable {break};app.scrollViews.firstMatch.swipeUp()}
  XCTAssertEqual(description.value as? String,body)
  app.buttons["Save"].tap()
  XCTAssertTrue(app.buttons["Add Memory"].waitForExistence(timeout:10))
  app.open(URL(string:"casitadex-plusstoreqa://add")!)
  let notice=app.staticTexts["memory-limit-notice"]
  XCTAssertTrue(notice.waitForExistence(timeout:10));XCTAssertTrue(notice.label.contains("20 of 20"))
  print("RAPID_INPUT PASS: exact burst title and description, cold restart, then twentieth memory saved")
 }
}

extension PlusRecoveryUITests {
 @MainActor func scrollTo(_ field:XCUIElement,in app:XCUIApplication) {
  for _ in 0..<18 {if field.isHittable {return};let scroll=app.scrollViews.firstMatch;scroll.coordinate(withNormalizedOffset:CGVector(dx:0.5,dy:0.7)).press(forDuration:0.05,thenDragTo:scroll.coordinate(withNormalizedOffset:CGVector(dx:0.5,dy:0.4)))}
  XCTAssertTrue(field.isHittable)
 }
 @MainActor func testRapidFindInput() async throws {
  continueAfterFailure=false
  let app=XCUIApplication(bundleIdentifier:"com.designsbyfa.casitadex.plusstoreqa")
  app.launch();app.open(URL(string:"casitadex-plusstoreqa://answers")!)
  let field=app.descendants(matching:.any).matching(identifier:"find-query").firstMatch
  XCTAssertTrue(field.waitForExistence(timeout:15));field.tap()
  let text="Boundary twenty first memory rapid typing 20x25x1"
  field.typeText(text);XCTAssertEqual(field.value as? String,text)
  field.typeText("\n");XCTAssertEqual(field.value as? String,text)
  XCTAssertTrue(app.staticTexts["1 memory found"].waitForExistence(timeout:10))
  let result=app.buttons.matching(NSPredicate(format:"label BEGINSWITH %@","Open regular memory ")).firstMatch
  scrollTo(result,in:app);result.tap()
  XCTAssertTrue(app.buttons["Edit memory"].waitForExistence(timeout:10));app.buttons["‹ Results"].tap()
  XCTAssertTrue(field.waitForExistence(timeout:10));XCTAssertEqual(field.value as? String,text)
  let shot=XCTAttachment(screenshot:app.screenshot());shot.name="Rapid Find query preserved";shot.lifetime = .keepAlways;add(shot)
  print("FIND_INPUT PASS: exact burst, submit, one matching result, details and return preserve query")
 }
 @MainActor func rapidEditField(_ label:String,_ prefix:String="") async throws {
  continueAfterFailure=false
  let identity=label=="Location" ? "rapid_edit_location" : label=="Reference" ? "rapid_edit_reference" : "rapid_edit_fixture"
  let app=XCUIApplication(bundleIdentifier:"com.designsbyfa.casitadex.plusstoreqa")
  let route=URL(string:"casitadex-plusstoreqa://card?id="+identity)!
  app.launch();app.open(route)
  let edit=app.buttons["Edit memory"];XCTAssertTrue(edit.waitForExistence(timeout:15))
  if label=="Location" {let inline=app.buttons["Edit Location"];scrollTo(inline,in:app);inline.tap()} else {edit.tap()}
  let field=label=="Memory name (Required)" ? app.textFields[label] : app.textViews[label]
  scrollTo(field,in:app);field.tap()
  if !prefix.isEmpty {field.typeText(String(repeating:XCUIKeyboardKey.delete.rawValue,count:prefix.count))}
  let text="Boundary rapid editing 20x25x1"
  field.typeText(text);XCTAssertEqual(field.value as? String,text);field.typeText("\n")
  app.buttons["Save & return to details"].tap();XCTAssertTrue(edit.waitForExistence(timeout:10))
  app.terminate();app.launch();app.open(route);XCTAssertTrue(edit.waitForExistence(timeout:15));edit.tap()
  scrollTo(field,in:app);XCTAssertEqual(field.value as? String,text)
  field.tap();field.typeText(" UNSAVED");app.buttons["Cancel"].tap()
  XCTAssertTrue(edit.waitForExistence(timeout:10));edit.tap();scrollTo(field,in:app);XCTAssertEqual(field.value as? String,text)
  app.buttons["Cancel"].tap()
  print("EDIT_INPUT PASS: "+label+" exact burst, save, cold restart and cancel rollback")
 }
 @MainActor func testRapidEditName() async throws {try await rapidEditField("Memory name (Required)","X")}
 @MainActor func testRapidEditLocation() async throws {try await rapidEditField("Location")}
 @MainActor func testRapidEditReference() async throws {try await rapidEditField("Reference")}
 @MainActor func testRapidInlineReference() async throws {
  continueAfterFailure=false
  let app=XCUIApplication(bundleIdentifier:"com.designsbyfa.casitadex.plusstoreqa")
  let route=URL(string:"casitadex-plusstoreqa://card?id=rapid_inline_reference")!
  app.launch();app.open(route);XCTAssertTrue(app.buttons["Edit memory"].waitForExistence(timeout:15))
  let edit=app.buttons.matching(identifier:"Edit ✎").element(boundBy:2)
  scrollTo(edit,in:app);edit.tap()
  let field=app.textViews["Reference"];scrollTo(field,in:app);field.tap()
  let text="Boundary inline reference 20x25x1"
  field.typeText(text);XCTAssertEqual(field.value as? String,text);field.typeText("\n")
  let save=app.buttons["Save reference"];scrollTo(save,in:app);save.tap()
  XCTAssertTrue(XCTWaiter.wait(for:[XCTNSPredicateExpectation(predicate:NSPredicate(format:"exists == false"),object:save)],timeout:10) == .completed)
  app.terminate();app.launch();app.open(route);XCTAssertTrue(app.buttons["Edit memory"].waitForExistence(timeout:15));scrollTo(edit,in:app);edit.tap();scrollTo(field,in:app)
  XCTAssertEqual(field.value as? String,text)
  print("INLINE_REFERENCE PASS: exact burst, inline save and cold restart")
 }
}

extension PlusRecoveryUITests {
 @MainActor func rapidTaxonomy(_ kind:String) async throws {
  continueAfterFailure=false
  let app=XCUIApplication(bundleIdentifier:"com.designsbyfa.casitadex.plusstoreqa")
  let route=URL(string:"casitadex-plusstoreqa://card?id=rapid_edit_fixture")!
  app.launch();app.open(route)
  XCTAssertTrue(app.buttons["Edit memory"].waitForExistence(timeout:15))
  let edit=app.buttons.matching(identifier:"Edit ✎").element(boundBy:kind=="Space" ? 0 : 1)
  scrollTo(edit,in:app);edit.tap()
  let create=app.buttons["+ Create new "+kind+" ▾"];scrollTo(create,in:app);create.tap()
  let field=app.textViews["New "+kind+" name"];scrollTo(field,in:app);field.tap()
  let text="Boundary rapid "+kind+" 20x25x1"
  field.typeText(text);XCTAssertEqual(field.value as? String,text)
  field.typeText("\n")
  let save=app.buttons["Create and assign"];scrollTo(save,in:app);save.tap()
  XCTAssertTrue(app.staticTexts.containing(NSPredicate(format:"label CONTAINS %@",text)).firstMatch.waitForExistence(timeout:10))
  app.terminate();app.launch();app.open(route)
  XCTAssertTrue(app.staticTexts.containing(NSPredicate(format:"label CONTAINS %@",text)).firstMatch.waitForExistence(timeout:15))
  print("TAXONOMY_INPUT PASS: "+kind+" exact burst, assignment and cold restart")
 }
 @MainActor func testRapidSpaceInput() async throws {try await rapidTaxonomy("Space")}
 @MainActor func testRapidCategoryInput() async throws {try await rapidTaxonomy("Category")}
 @MainActor func testRapidReminderInput() async throws {
  continueAfterFailure=false
  let app=XCUIApplication(bundleIdentifier:"com.designsbyfa.casitadex.plusstoreqa")
  app.launch();app.open(URL(string:"casitadex-plusstoreqa://reminders-manage?mode=new")!)
  let field=app.textViews["Reminder title *"]
  XCTAssertTrue(field.waitForExistence(timeout:15));field.tap()
  let text="Boundary rapid reminder 20x25x1"
  field.typeText(text);XCTAssertEqual(field.value as? String,text);field.typeText("\n")
  app.buttons["More options ▾"].tap()
  let notes=app.textViews["Notes"];scrollTo(notes,in:app);notes.tap()
  let body="Garage filter replacement 20x25x1"
  notes.typeText(body);XCTAssertEqual(notes.value as? String,body)
  app.buttons["Save Reminder"].tap()
  XCTAssertTrue(app.buttons["Edit "+text].waitForExistence(timeout:15))
  app.terminate();app.launch();app.open(URL(string:"casitadex-plusstoreqa://reminders")!)
  XCTAssertTrue(app.buttons["Edit "+text].waitForExistence(timeout:15))
  app.buttons["Edit "+text].tap();XCTAssertTrue(field.waitForExistence(timeout:10));XCTAssertEqual(field.value as? String,text);scrollTo(notes,in:app);XCTAssertEqual(notes.value as? String,body)
  field.tap();field.typeText(" UNSAVED");app.buttons["Cancel"].tap();app.alerts.buttons["Discard changes"].tap()
  XCTAssertTrue(app.buttons["Edit "+text].waitForExistence(timeout:10))
  print("REMINDER_INPUT PASS: rapid title and notes, save and cold restart")
 }
}

extension PlusRecoveryUITests {
 @MainActor func testTaxonomyReminderPersistenceAndCancel() async throws {
  continueAfterFailure=false
  let app=XCUIApplication(bundleIdentifier:"com.designsbyfa.casitadex.plusstoreqa")
  app.launch();app.open(URL(string:"casitadex-plusstoreqa://card?id=rapid_edit_fixture")!)
  for kind in ["Space","Category"] {XCTAssertTrue(app.staticTexts.containing(NSPredicate(format:"label CONTAINS %@","Boundary rapid "+kind+" 20x25x1")).firstMatch.waitForExistence(timeout:15))}
  app.open(URL(string:"casitadex-plusstoreqa://reminders")!)
  let text="Boundary rapid reminder 20x25x1"
  let open=app.buttons["Edit "+text];XCTAssertTrue(open.waitForExistence(timeout:15));open.tap()
  let field=app.textViews["Reminder title *"],notes=app.textViews["Notes"]
  XCTAssertTrue(field.waitForExistence(timeout:10));XCTAssertEqual(field.value as? String,text)
  scrollTo(notes,in:app);XCTAssertEqual(notes.value as? String,"Garage filter replacement 20x25x1")
  app.buttons["Save Reminder"].tap()
  let spring=XCUIApplication(bundleIdentifier:"com.apple.springboard")
  let allow=spring.buttons["Allow"]
  if allow.waitForExistence(timeout:5) {allow.tap()}
  if app.alerts.buttons["Allow"].exists {app.alerts.buttons["Allow"].tap()}
  XCTAssertTrue(open.waitForExistence(timeout:20),app.debugDescription+spring.debugDescription)
  open.tap();XCTAssertTrue(field.waitForExistence(timeout:10));field.tap();field.typeText(" UNSAVED")
  // Cursor placement and insertion order in existing titles are a separately recorded open defect.
  XCTAssertNotEqual(field.value as? String,text,"Cancel check must begin with an actual unsaved change")
  app.buttons["Cancel"].tap();app.alerts.buttons["Discard changes"].tap()
  XCTAssertTrue(open.waitForExistence(timeout:10));open.tap();XCTAssertTrue(field.waitForExistence(timeout:10));XCTAssertEqual(field.value as? String,text)
  let shot=XCTAttachment(screenshot:app.screenshot());shot.name="Reminder title preserved after cancel";shot.lifetime = .keepAlways;add(shot)
  print("TAXONOMY_REMINDER PASS: both assignments survive restart; reminder exact title/notes, Save return and Cancel rollback")
 }
}

extension PlusRecoveryUITests {
 @MainActor func testReminderExistingTitleInsertion() async throws {
  continueAfterFailure=false
  let app=XCUIApplication(bundleIdentifier:"com.designsbyfa.casitadex.plusstoreqa")
  let original="Boundary rapid reminder 20x25x1"
  func locate(_ title:String)->XCUIElement {
   let row=app.buttons["Edit "+title]
   if !row.waitForExistence(timeout:2) {let overdue=app.buttons.containing(NSPredicate(format:"label BEGINSWITH %@","Overdue (")).firstMatch;if overdue.exists {overdue.tap()}}
   XCTAssertTrue(row.waitForExistence(timeout:10));return row
  }
  app.launch();app.open(URL(string:"casitadex-plusstoreqa://reminders")!)
  let open=locate(original);open.tap()
  let field=app.textViews["Reminder title *"];XCTAssertTrue(field.waitForExistence(timeout:10));XCTAssertEqual(field.value as? String,original)
  field.tap();field.typeText("INSERT ")
  let actual=try XCTUnwrap(field.value as? String)
  XCTAssertTrue(actual.contains("INSERT "),"Insertion order must remain intact: "+actual)
  XCTAssertEqual(actual.replacingOccurrences(of:"INSERT ",with:""),original)
  app.buttons["Save Reminder"].tap()
  _ = locate(actual)
  app.terminate();app.launch();app.open(URL(string:"casitadex-plusstoreqa://reminders")!)
  let saved=locate(actual);saved.tap()
  XCTAssertTrue(field.waitForExistence(timeout:10));XCTAssertEqual(field.value as? String,actual)
  field.tap();field.typeText("CANCEL ")
  let dirty=try XCTUnwrap(field.value as? String)
  XCTAssertTrue(dirty.contains("CANCEL "));XCTAssertEqual(dirty.replacingOccurrences(of:"CANCEL ",with:""),actual)
  app.buttons["Cancel"].tap();app.alerts.buttons["Discard changes"].tap()
  _ = locate(actual);saved.tap();XCTAssertTrue(field.waitForExistence(timeout:10));XCTAssertEqual(field.value as? String,actual)
  let shot=XCTAttachment(screenshot:app.screenshot());shot.name="Existing reminder insertion preserved";shot.lifetime = .keepAlways;add(shot)
  print("EXISTING_REMINDER PASS exact contiguous insertion, save/restart, second insertion and Cancel rollback: "+actual)
 }
}

extension PlusRecoveryUITests {
 @MainActor func testLinkedReminderPrefillAndReturn() async throws {
  continueAfterFailure=false
  let app=XCUIApplication(bundleIdentifier:"com.designsbyfa.casitadex.plusstoreqa")
  app.launch();app.open(URL(string:"casitadex-plusstoreqa://reminders-manage?mode=new&memoryId=rapid_edit_fixture")!)
  let field=app.textViews["Reminder title *"]
  XCTAssertTrue(field.waitForExistence(timeout:15))
  let expected="Review Boundary rapid editing 20x25x1"
  XCTAssertTrue(XCTWaiter.wait(for:[XCTNSPredicateExpectation(predicate:NSPredicate(format:"value == %@",expected),object:field)],timeout:10) == .completed)
  field.tap();field.typeText("LINKED ")
  let actual=try XCTUnwrap(field.value as? String);XCTAssertTrue(actual.contains("LINKED "));XCTAssertEqual(actual.replacingOccurrences(of:"LINKED ",with:""),expected)
  field.typeText("\n");XCTAssertEqual(field.value as? String,actual)
  app.buttons["Save Reminder"].tap()
  XCTAssertTrue(app.buttons["Edit memory"].waitForExistence(timeout:15))
  XCTAssertTrue(app.staticTexts["Boundary rapid editing 20x25x1"].exists)
  app.terminate();app.launch();app.open(URL(string:"casitadex-plusstoreqa://reminders")!)
  let row=app.buttons["Edit "+actual];XCTAssertTrue(row.waitForExistence(timeout:15));row.tap()
  XCTAssertTrue(field.waitForExistence(timeout:10));XCTAssertEqual(field.value as? String,actual)
  print("LINKED_REMINDER PASS asynchronous prefill, exact insertion, submit, save return to originating details, restart")
 }
}

extension PlusRecoveryUITests {
 @MainActor func remainingTaxonomy(_ category:Bool,_ draft:Bool) async throws {
  continueAfterFailure=false
  let app=XCUIApplication(bundleIdentifier:"com.designsbyfa.casitadex.plusstoreqa")
  let route=URL(string:draft ? "casitadex-plusstoreqa://add" : "casitadex-plusstoreqa://card?id=rapid_edit_fixture")!
  app.launch();app.open(route)
  if draft {XCTAssertTrue(app.buttons["Save"].waitForExistence(timeout:15))} else {XCTAssertTrue(app.buttons["Edit memory"].waitForExistence(timeout:15));app.buttons["Edit memory"].tap()}
  let choose=app.buttons.matching(identifier:"Choose ▾").element(boundBy:category ? 1 : 0);scrollTo(choose,in:app);choose.tap()
  let kind=category ? (draft ? "Category" : "Categories") : "Space"
  let create=app.buttons["+ Create new "+kind+" ▾"];scrollTo(create,in:app);create.tap()
  let label=draft ? (category ? "New Category name" : "New Space name") : (category ? "New category name" : "New space name")
  let field=app.textViews[label];scrollTo(field,in:app);field.tap()
  let text=(draft ? "Draft" : "Edit")+" rapid "+(category ? "Category" : "Space")+" 20x25x1"
  field.typeText(text);XCTAssertEqual(field.value as? String,text);field.typeText("\n")
  let assign=app.buttons[draft ? "Create and assign" : "Create and select"];scrollTo(assign,in:app);assign.tap()
  app.buttons[draft ? "Cancel" : "Save & return to details"].tap()
  if draft {XCTAssertTrue(app.buttons["Add Memory"].waitForExistence(timeout:10))} else {XCTAssertTrue(app.buttons["Edit memory"].waitForExistence(timeout:10))}
  app.terminate();app.launch();app.open(route)
  let value=app.staticTexts.containing(NSPredicate(format:"label CONTAINS %@",text)).firstMatch
  XCTAssertTrue(value.waitForExistence(timeout:15))
  if !draft {
   app.buttons["Edit memory"].tap();scrollTo(choose,in:app);choose.tap()
   let select=app.buttons["Select "+kind+" ▾"];scrollTo(select,in:app);select.tap()
   let none=app.buttons["None"];scrollTo(none,in:app);none.tap()
   app.buttons["Cancel"].tap();XCTAssertTrue(app.buttons["Edit memory"].waitForExistence(timeout:10));XCTAssertTrue(value.exists)
  }
  print("REMAINING_TAXONOMY PASS "+text+" create, assignment, persistence and "+(draft ? "draft retained on Cancel" : "Cancel rolls back selection"))
 }
 @MainActor func testAddSpaceInput() async throws {try await remainingTaxonomy(false,true)}
 @MainActor func testAddCategoryInput() async throws {try await remainingTaxonomy(true,true)}
 @MainActor func testFullEditSpaceInput() async throws {try await remainingTaxonomy(false,false)}
 @MainActor func testFullEditCategoryInput() async throws {try await remainingTaxonomy(true,false)}
}

extension PlusRecoveryUITests {
 @MainActor func testReminderRouteHeadings() async throws {
  continueAfterFailure=false
  let app=XCUIApplication(bundleIdentifier:"com.designsbyfa.casitadex.plusstoreqa")
  app.launch();app.open(URL(string:"casitadex-plusstoreqa://reminders-manage?mode=new")!)
  XCTAssertTrue(app.staticTexts["Adding a Reminder"].waitForExistence(timeout:15));XCTAssertFalse(app.staticTexts["Editing a Reminder"].exists)
  app.open(URL(string:"casitadex-plusstoreqa://reminders-manage?id=r_mwgtiw73_fpe8npbq")!)
  XCTAssertTrue(app.staticTexts["Editing a Reminder"].waitForExistence(timeout:15));XCTAssertFalse(app.staticTexts["Adding a Reminder"].exists)
  let save=app.buttons["Save Reminder"],cancel=app.buttons["Cancel"]
  XCTAssertTrue(save.waitForExistence(timeout:10));let y=save.frame.minY;app.swipeUp();XCTAssertEqual(save.frame.minY,y,accuracy:1);XCTAssertTrue(cancel.isHittable)
  let shot=XCTAttachment(screenshot:app.screenshot());shot.name="Editing reminder heading and fixed actions";shot.lifetime = .keepAlways;add(shot)
  app.open(URL(string:"casitadex-plusstoreqa://reminders-manage")!)
  XCTAssertTrue(app.staticTexts["Your Reminders"].waitForExistence(timeout:15))
  print("REMINDER_HEADINGS PASS create/edit/manage routes and fixed editor actions")
 }
}

extension PlusRecoveryUITests {
 @MainActor func duplicateTaxonomy(_ category:Bool) async throws {
  continueAfterFailure=false
  let app=XCUIApplication(bundleIdentifier:"com.designsbyfa.casitadex.plusstoreqa")
  app.launch();app.open(URL(string:"casitadex-plusstoreqa://card?id=rapid_edit_fixture")!)
  XCTAssertTrue(app.buttons["Edit memory"].waitForExistence(timeout:15));app.buttons["Edit memory"].tap()
  let choose=app.buttons.matching(identifier:"Choose ▾").element(boundBy:category ? 1 : 0);scrollTo(choose,in:app);choose.tap()
  let create=app.buttons[category ? "+ Create new Categories ▾" : "+ Create new Space ▾"];scrollTo(create,in:app);create.tap()
  let field=app.textViews[category ? "New category name" : "New space name"];scrollTo(field,in:app);field.tap()
  let text=category ? "  EDIT RAPID CATEGORY 20X25X1  " : "  EDIT RAPID SPACE 20X25X1  "
  field.typeText(text);XCTAssertEqual(field.value as? String,text);field.typeText("\n")
  let assign=app.buttons["Create and select"];scrollTo(assign,in:app);assign.tap()
  let error=app.staticTexts.containing(NSPredicate(format:"label CONTAINS %@","That name already exists")).firstMatch
  XCTAssertTrue(error.waitForExistence(timeout:10));XCTAssertEqual(field.value as? String,text)
  app.buttons["Cancel"].tap();XCTAssertTrue(app.buttons["Edit memory"].waitForExistence(timeout:10))
  print("DUPLICATE_NATIVE PASS "+(category ? "Category" : "Space")+" case/whitespace duplicate rejected; input retained; Cancel returns")
 }
 @MainActor func testDuplicateSpaceRefused() async throws {try await duplicateTaxonomy(false)}
 @MainActor func testDuplicateCategoryRefused() async throws {try await duplicateTaxonomy(true)}
 @MainActor func labelRemovalCancel(_ category:Bool) async throws {
  continueAfterFailure=false
  let app=XCUIApplication(bundleIdentifier:"com.designsbyfa.casitadex.plusstoreqa")
  app.launch();app.open(URL(string:"casitadex-plusstoreqa://settings-manage?action=labels")!)
  XCTAssertTrue(app.staticTexts["Manage Spaces and Categories"].waitForExistence(timeout:15))
  if category {app.buttons["Categories"].tap()}
  let name=category ? "Edit rapid Category 20x25x1" : "Edit rapid Space 20x25x1"
  let label=app.buttons[name];scrollTo(label,in:app);label.tap()
  let review=app.buttons["Review label removal"];scrollTo(review,in:app);review.tap()
  let impact=app.staticTexts.containing(NSPredicate(format:"label CONTAINS %@","Remove “"+name+"” from 1 saved memories and no draft?")).firstMatch
  XCTAssertTrue(impact.waitForExistence(timeout:10));scrollTo(impact,in:app)
  let cancel=app.buttons["Cancel label removal"];scrollTo(cancel,in:app);cancel.tap()
  XCTAssertFalse(app.buttons["Confirm remove label only"].exists)
  app.terminate();app.launch();app.open(URL(string:"casitadex-plusstoreqa://card?id=rapid_edit_fixture")!)
  XCTAssertTrue(app.staticTexts.containing(NSPredicate(format:"label CONTAINS %@",name)).firstMatch.waitForExistence(timeout:15))
  print("REMOVAL_CANCEL PASS "+name+" accurate impact, explicit confirmation, Cancel preserves assignment after restart")
 }
 @MainActor func testSpaceRemovalCancel() async throws {try await labelRemovalCancel(false)}
 @MainActor func testCategoryRemovalCancel() async throws {try await labelRemovalCancel(true)}
}

extension PlusRecoveryUITests {
 @MainActor func renameLabel(_ category:Bool,_ draft:Bool) async throws {
  continueAfterFailure=false
  let app=XCUIApplication(bundleIdentifier:"com.designsbyfa.casitadex.plusstoreqa")
  let route=URL(string:"casitadex-plusstoreqa://settings-manage?action=labels")!
  let original=(draft ? "Draft" : "Edit")+" rapid "+(category ? "Category" : "Space")+" 20x25x1"
  app.launch();app.open(route)
  XCTAssertTrue(app.staticTexts["Manage Spaces and Categories"].waitForExistence(timeout:15))
  if category {app.buttons["Categories"].tap()}
  let label=app.buttons[original];scrollTo(label,in:app);label.tap()
  let field=app.textFields["Label name"];scrollTo(field,in:app);XCTAssertEqual(field.value as? String,original);field.tap();field.typeText("RENAMED ")
  let inserted=try XCTUnwrap(field.value as? String);XCTAssertTrue(inserted.contains("RENAMED "),inserted);XCTAssertEqual(inserted.replacingOccurrences(of:"RENAMED ",with:""),original)
  let renamed=inserted.trimmingCharacters(in:.whitespacesAndNewlines)
  field.typeText("\n")
  let save=app.buttons["Rename selected label"];scrollTo(save,in:app);save.tap()
  XCTAssertTrue(app.buttons[renamed].waitForExistence(timeout:10));XCTAssertFalse(app.buttons[original].exists)
  app.terminate();app.launch();app.open(route)
  XCTAssertTrue(app.staticTexts["Manage Spaces and Categories"].waitForExistence(timeout:15));if category {app.buttons["Categories"].tap()}
  let updated=app.buttons[renamed];scrollTo(updated,in:app);updated.tap();scrollTo(field,in:app);XCTAssertEqual(field.value as? String,renamed)
  app.open(URL(string:draft ? "casitadex-plusstoreqa://add" : "casitadex-plusstoreqa://card?id=rapid_edit_fixture")!)
  XCTAssertTrue(app.staticTexts.containing(NSPredicate(format:"label CONTAINS %@",renamed)).firstMatch.waitForExistence(timeout:15))
  print("LABEL_RENAME PASS exact insertion, rename/restart, retained "+(draft ? "draft" : "memory")+" assignment: "+renamed)
  app.terminate()
 }
 @MainActor func testRenameSpaceLabels() async throws {try await renameLabel(false,false);try await renameLabel(false,true)}
 @MainActor func testRenameCategoryLabels() async throws {try await renameLabel(true,false);try await renameLabel(true,true)}
}
