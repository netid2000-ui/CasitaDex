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
