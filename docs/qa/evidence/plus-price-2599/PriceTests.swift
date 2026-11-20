import XCTest
import StoreKitTest
final class PriceTests:XCTestCase {
 let app=XCUIApplication(bundleIdentifier:"com.designsbyfa.casitadex.plusstoreqa")
 @MainActor func open(_ route:String){app.open(URL(string:"casitadex-plusstoreqa://"+route)!)}
 @MainActor func button(_ label:String)->XCUIElement { app.buttons[label].firstMatch }
 @MainActor func testUpgradeAndBackup() async throws {
  continueAfterFailure=false
  let session=try SKTestSession(contentsOf:XCTUnwrap(Bundle(for:Self.self).url(forResource:"CasitaDexPlus",withExtension:"storekit")))
  session.resetToDefaultState();session.clearTransactions();session.disableDialogs=true
  app.launch();open("add");let save=button("Save");XCTAssertTrue(save.waitForExistence(timeout:12));save.tap()
  let limit=app.staticTexts.containing(NSPredicate(format:"label CONTAINS %@", "Your free plan includes 20 saved memories")).firstMatch
  XCTAssertTrue(limit.waitForExistence(timeout:10))
  open("plus");let buy=button("plus-purchase");let ready=NSPredicate(format:"enabled == true AND label CONTAINS %@", "$25.99")
  XCTAssertEqual(XCTWaiter.wait(for:[XCTNSPredicateExpectation(predicate:ready,object:buy)],timeout:15),.completed)
  buy.tap();let owned=app.staticTexts["plus-ownership"];XCTAssertEqual(XCTWaiter.wait(for:[XCTNSPredicateExpectation(predicate:NSPredicate(format:"label CONTAINS %@", "Verified Plus"),object:owned)],timeout:15),.completed)
  open("add");XCTAssertTrue(save.waitForExistence(timeout:10));save.tap()
  XCTAssertTrue(button("Add Memory").waitForExistence(timeout:10))
  open("settings-manage?action=backup");let full=button("Save full backup (with draft and photos)")
  XCTAssertTrue(full.waitForExistence(timeout:10));full.tap()
  try await Task.sleep(nanoseconds:3_000_000_000)
 }
}
extension PriceTests {
 @MainActor func testRecoverImportedArchive() async throws {
  continueAfterFailure=false
  let session=try SKTestSession(contentsOf:XCTUnwrap(Bundle(for:Self.self).url(forResource:"CasitaDexPlus",withExtension:"storekit")))
  session.resetToDefaultState();session.clearTransactions();session.disableDialogs=true
  _ = try await session.buyProduct(identifier:"local.casitadex.plus.qa")
  app.launch();open("settings-manage?action=backup")
  let choose=button("Choose backup to review")
  XCTAssertTrue(choose.waitForExistence(timeout:10))
  for _ in 0..<4 {if choose.isHittable {break};app.swipeUp()}
  choose.tap();try await Task.sleep(nanoseconds:7_000_000_000)
  let file=app.descendants(matching:.any).matching(NSPredicate(format:"label BEGINSWITH %@", "QACollection")).firstMatch
  for _ in 0..<4 {
    if file.waitForExistence(timeout:2){break}
    let local=app.descendants(matching:.any).matching(NSPredicate(format:"label BEGINSWITH %@", "On My iPhone")).firstMatch
    if local.exists {local.tap();continue}
    if app.buttons["Browse"].exists {app.buttons["Browse"].firstMatch.tap();continue}
    if app.buttons["Locations"].exists {app.buttons["Locations"].tap();continue}
    print(app.debugDescription);try await Task.sleep(nanoseconds:5_000_000_000)
  }
  XCTAssertTrue(file.exists,app.debugDescription);file.tap()
  let confirm=button("Confirm replace with reviewed backup")
  XCTAssertTrue(confirm.waitForExistence(timeout:15),app.debugDescription)
  for _ in 0..<6 {if confirm.isHittable {break};app.swipeUp()}
  confirm.tap()
  try await Task.sleep(nanoseconds:2_000_000_000)
 }
}
