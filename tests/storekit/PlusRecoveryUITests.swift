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
