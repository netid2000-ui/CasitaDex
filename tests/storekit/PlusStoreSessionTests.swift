import XCTest
import StoreKit
import StoreKitTest

final class PlusStoreSessionTests: XCTestCase {
 enum TestFailure: Error { case entitlementTimeout, unexpectedOutcome }
 func expectEntitlement(_ value: String, _ reader: PlusStoreReader) async throws {
  for _ in 0..<50 {
   if try await reader.verifiedEntitlement() == value { return }
   try await Task.sleep(nanoseconds: 100_000_000)
  }
  XCTFail("Entitlement did not become " + value + " within 5 seconds")
  throw TestFailure.entitlementTimeout
 }
 func expectBridge(_ value: String) async throws {
  for _ in 0..<100 {
   if UserDefaults.standard.string(forKey: "CasitaDexPlusQABridgeState") == "ready:" + value { return }
   try await Task.sleep(nanoseconds: 100_000_000)
  }
  XCTFail("Actual JS bridge state did not become ready:" + value)
  throw TestFailure.entitlementTimeout
 }
 func testLocalPurchaseLifecycle() async throws {
  let url = try XCTUnwrap(Bundle(for: Self.self).url(forResource: "CasitaDexPlus", withExtension: "storekit"))
  let session = try SKTestSession(contentsOf: url)
  session.resetToDefaultState()
  session.disableDialogs = true
  session.clearTransactions()
  defer { session.clearTransactions(); session.resetToDefaultState() }
  // Harness observation only. Production observer/delivery/finish remains separate.
  let observer = Task { for await _ in Transaction.updates { if Task.isCancelled { break } } }
  defer { observer.cancel() }
  let reader = try PlusStoreReader.configured()
  try await expectBridge("free")
  let catalog = try await reader.catalog()
  XCTAssertEqual(catalog["productID"], "local.casitadex.plus.qa")
  try await expectEntitlement("free", reader)
  let purchase = try await reader.purchaseForLocalTesting()
  XCTAssertEqual(purchase, "completed")
  guard purchase == "completed" else { throw TestFailure.unexpectedOutcome }
  try await expectEntitlement("plus", reader)
  let restored = try await reader.restore()
  XCTAssertEqual(restored, "plus")
  guard restored == "plus" else { throw TestFailure.unexpectedOutcome }
  let transaction = try XCTUnwrap(session.allTransactions().first)
  try session.refundTransaction(identifier: transaction.identifier)
  try await expectEntitlement("free", reader)
  print("STOREKIT: catalog, free, completed, owned, restore, refund PASS")

  session.clearTransactions()
  try await expectEntitlement("free", reader)
  session.askToBuyEnabled = true
  let pending = try await reader.purchaseForLocalTesting()
  XCTAssertEqual(pending, "pending")
  guard pending == "pending" else { throw TestFailure.unexpectedOutcome }
  try await expectEntitlement("free", reader)
  let request = try XCTUnwrap(session.allTransactions().first)
  try session.approveAskToBuyTransaction(identifier: request.identifier)
  try await expectEntitlement("plus", reader)
  try await expectBridge("plus")
  try session.refundTransaction(identifier: request.identifier)
  try await expectEntitlement("free", reader)
  try await expectBridge("free")
  print("STOREKIT BRIDGE: actual JS received delayed approval and refund PASS")
  print("STOREKIT: pending, no premature unlock, approval PASS")

  session.clearTransactions()
  try await expectEntitlement("free", reader)
  session.askToBuyEnabled = false
  try await session.setSimulatedError(.generic(.userCancelled), forAPI: .purchase)
  // This SDK returns an unknown error for the injected cancellation. Verify fail-closed;
  // a real user-cancelled purchase-sheet outcome must be accepted separately.
  do {
   let result = try await reader.purchaseForLocalTesting()
   XCTAssertEqual(result, "cancelled")
  } catch {
   print("STOREKIT: injected cancellation surfaced as error: \(error)")
  }
  try await expectEntitlement("free", reader)
  print("STOREKIT: injected error does not unlock PASS; sheet cancellation pending")
 }
}

// Run explicitly with TEST_RUNNER_CASITADEX_INTERACTIVE_STOREKIT_QA=1.
final class PlusStoreSheetTests: XCTestCase {
 @MainActor func testUserCancellation() async throws {
  guard ProcessInfo.processInfo.environment["CASITADEX_INTERACTIVE_STOREKIT_QA"] == "1" else {
   throw XCTSkip("Interactive local purchase-sheet cancellation requires explicit opt-in")
  }
  let url = try XCTUnwrap(Bundle(for: Self.self).url(forResource: "CasitaDexPlus", withExtension: "storekit"))
  let session = try SKTestSession(contentsOf: url)
  session.resetToDefaultState(); session.clearTransactions(); session.disableDialogs = false
  defer { session.clearTransactions(); session.resetToDefaultState() }
  let reader = try PlusStoreReader.configured()
  // Let the hosted app finish displaying its scene before presenting StoreKit UI.
  try await Task.sleep(nanoseconds: 3_000_000_000)
  print("STOREKIT SHEET: awaiting user cancellation")
  let result = try await reader.purchaseForLocalTesting()
  XCTAssertEqual(result, "cancelled")
  let access = try await reader.verifiedEntitlement()
  XCTAssertEqual(access, "free")
  print("STOREKIT SHEET: result=\(result), entitlement=\(access)")
 }
}

// Explicit interactive QA: real local StoreKit ownership, no entitlement override.
final class PlusBackupAccessTests: XCTestCase {
 func testOwnedBackupExport() async throws {
  guard ProcessInfo.processInfo.environment["CASITADEX_INTERACTIVE_STOREKIT_QA"] == "1" else {
   throw XCTSkip("Requires interactive isolated backup export QA")
  }
  let url = try XCTUnwrap(Bundle(for: Self.self).url(forResource: "CasitaDexPlus", withExtension: "storekit"))
  let session = try SKTestSession(contentsOf: url)
  session.resetToDefaultState(); session.clearTransactions(); session.disableDialogs = true
  defer { session.clearTransactions(); session.resetToDefaultState() }
  let reader = try PlusStoreReader.configured()
  try reader.requireLocalCheckout()
  let documents = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0]
  func archives() throws -> Set<URL> {
   Set(try FileManager.default.contentsOfDirectory(at: documents, includingPropertiesForKeys: nil).filter {
    $0.lastPathComponent.hasPrefix("CasitaDex-full-") && $0.pathExtension == "cdxe"
   })
  }
  let before = try archives()
  _ = try await session.buyProduct(identifier: "local.casitadex.plus.qa")
  let access = try await reader.verifiedEntitlement()
  XCTAssertEqual(access, "plus")
  print("PLUS BACKUP: local ownership active; awaiting UI full backup")
  for _ in 0..<600 {
   let added = try archives().subtracting(before)
   if let archive = added.first {
    // Allow the streaming writer to complete, then verify nonempty retained output.
    try await Task.sleep(nanoseconds: 3_000_000_000)
    let bytes = try Data(contentsOf: archive)
    XCTAssertGreaterThan(bytes.count, 100)
    XCTAssertEqual(UserDefaults.standard.string(forKey: "CasitaDexPlusQABridgeState"), "ready:plus")
    print("PLUS BACKUP: UI created \(archive.lastPathComponent), \(bytes.count) bytes; native archive-content validation remains in app")
    return
   }
   try await Task.sleep(nanoseconds: 500_000_000)
  }
  XCTFail("No new full backup produced through the UI within five minutes")
 }
}
