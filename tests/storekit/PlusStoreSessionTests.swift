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
