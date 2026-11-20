import Foundation
import StoreKit

@available(iOS 16.4, macOS 13.0, *)
struct PlusStoreReader {
  enum Failure: Error { case notConfigured, unverified, wrongIdentity, missingProduct, checkoutDisabled, invalidTransaction }
  let policy: PlusTransactionPolicy

  static func configured(bundle: Bundle = .main) throws -> PlusStoreReader {
    guard let product = bundle.object(forInfoDictionaryKey: "CasitaDexPlusProductID") as? String,
          !product.isEmpty, let bundleID = bundle.bundleIdentifier,
          let environment = bundle.object(forInfoDictionaryKey: "CasitaDexPlusStoreEnvironment") as? String
    else { throw Failure.notConfigured }
    let allowed = [AppStore.Environment.production.rawValue, AppStore.Environment.sandbox.rawValue]
    if !allowed.contains(environment) {
      #if DEBUG
      guard environment == AppStore.Environment.xcode.rawValue,
            bundleID.hasSuffix(".plusstoreqa") else { throw Failure.notConfigured }
      #else
      throw Failure.notConfigured
      #endif
    }
    return PlusStoreReader(policy: PlusTransactionPolicy(productID: product, bundleID: bundleID, environment: environment))
  }

  var isAppleSandbox: Bool {
    policy.environment == AppStore.Environment.sandbox.rawValue &&
      policy.bundleID == "com.designsbyfa.casitadex" && policy.productID == "com.designsbyfa.casitadex.plus"
  }
  func requireLocalCheckout() throws {
    #if DEBUG
    if isAppleSandbox { return }
    guard policy.environment == AppStore.Environment.xcode.rawValue,
          policy.bundleID.hasSuffix(".plusstoreqa"),
          policy.productID == "local.casitadex.plus.qa" else { throw Failure.checkoutDisabled }
    #else
    throw Failure.checkoutDisabled
    #endif
  }

  func purchaseForLocalTesting() async throws -> String {
    try requireLocalCheckout()
    guard let product = try await Product.products(for: [policy.productID]).first,
          product.id == policy.productID, product.type == .nonConsumable
    else { throw Failure.missingProduct }
    if isAppleSandbox {
      guard case .verified(let app) = try await AppTransaction.shared,
            app.environment == .sandbox, app.bundleID == policy.bundleID else { throw Failure.wrongIdentity }
    }
    switch try await product.purchase() {
    case .userCancelled: return "cancelled"
    case .pending: return "pending"
    case .success(let result):
      guard case .verified(let transaction) = result else { throw Failure.unverified }
      guard policy.allows(product: transaction.productID, bundle: transaction.appBundleID,
                          environment: transaction.environment.rawValue, verified: true,
                          nonConsumable: transaction.productType == .nonConsumable,
                          revoked: transaction.revocationDate != nil, upgraded: transaction.isUpgraded)
      else { throw Failure.invalidTransaction }
      // Do not finish here: the app has not yet delivered Plus features.
      // StoreKit keeps the transaction unfinished for later delivery/recovery.
      return "completed"
    @unknown default: throw Failure.invalidTransaction
    }
  }

  // Called only after the shared JS state has enabled the qualified local Plus gates.
  // Re-enumeration also recovers transactions left unfinished by an earlier run.
  func finishDeliveredLocalTransactions(onFinish: ((UInt64) -> Void)? = nil) async throws -> Int {
    try requireLocalCheckout()
    guard try await verifiedEntitlement() == "plus" else { throw Failure.invalidTransaction }
    var finished = 0
    for await result in Transaction.unfinished {
      guard case .verified(let transaction) = result else { continue }
      guard policy.allows(product: transaction.productID, bundle: transaction.appBundleID,
                          environment: transaction.environment.rawValue, verified: true,
                          nonConsumable: transaction.productType == .nonConsumable,
                          revoked: transaction.revocationDate != nil, upgraded: transaction.isUpgraded)
      else { continue }
      await transaction.finish()
      onFinish?(transaction.id)
      finished += 1
    }
    return finished
  }

  func catalog() async throws -> [String: String] {
    guard let product = try await Product.products(for: [policy.productID]).first,
          product.id == policy.productID, product.type == .nonConsumable
    else { throw Failure.missingProduct }
    return ["productID": product.id, "displayName": product.displayName, "displayPrice": product.displayPrice]
  }

  func verifiedEntitlement() async throws -> String {
    var owned = false
    for await result in Transaction.currentEntitlements {
      switch result {
      case .unverified(let transaction, _):
        if transaction.productID == policy.productID { throw Failure.unverified }
      case .verified(let transaction):
        guard transaction.productID == policy.productID else { continue }
        guard transaction.appBundleID == policy.bundleID,
              transaction.environment.rawValue == policy.environment else { throw Failure.wrongIdentity }
        if policy.allows(product: transaction.productID, bundle: transaction.appBundleID,
                         environment: transaction.environment.rawValue, verified: true,
                         nonConsumable: transaction.productType == .nonConsumable,
                         revoked: transaction.revocationDate != nil, upgraded: transaction.isUpgraded) {
          owned = true
        }
      }
    }
    return owned ? "plus" : "free"
  }

  // Explicit Restore Purchases action only: AppStore.sync may request account authentication.
  func restore() async throws -> String {
    try await AppStore.sync()
    return try await verifiedEntitlement()
  }
}

// Keep verified deliveries received before JavaScript is ready. Ownership remains
// authoritative in StoreKit; this queue only retains handles for acknowledgement.
@available(iOS 16.4, macOS 13.0, *)
actor PlusDeliveryQueue {
  private var transactions: [UInt64: Transaction] = [:]
  private var finishing = false
  private var acknowledged: Set<UInt64> = []
  func stage(_ transaction: Transaction) { if !acknowledged.contains(transaction.id) { transactions[transaction.id] = transaction } }
  func finishDelivered(reader: PlusStoreReader, onFinish: ((UInt64) -> Void)? = nil) async throws -> Int {
    try reader.requireLocalCheckout()
    guard try await reader.verifiedEntitlement() == "plus" else { throw PlusStoreReader.Failure.invalidTransaction }
    guard !finishing else { return 0 }
    finishing = true
    defer { finishing = false }
    // Startup may expose owned nonconsumables without replaying an update or
    // returning them from unfinished. Obtain their verified transaction handles
    // directly after delivery. StoreKit finish is safe to acknowledge again;
    // deduplicate within this process, never use this set to grant ownership.
    for await result in Transaction.currentEntitlements {
      if case .verified(let transaction) = result,
         transaction.productID == reader.policy.productID,
         !acknowledged.contains(transaction.id) {
        transactions[transaction.id] = transaction
      }
    }
    var count = 0
    for (id, transaction) in transactions {
      guard reader.policy.allows(product: transaction.productID, bundle: transaction.appBundleID,
        environment: transaction.environment.rawValue, verified: true,
        nonConsumable: transaction.productType == .nonConsumable,
        revoked: transaction.revocationDate != nil, upgraded: transaction.isUpgraded) else {
        transactions.removeValue(forKey: id)
        continue
      }
      await transaction.finish()
      acknowledged.insert(id)
      transactions.removeValue(forKey: id)
      onFinish?(id)
      count += 1
    }
    // Catch transactions not delivered through the observer during this process.
    count += try await reader.finishDeliveredLocalTransactions(onFinish: onFinish)
    return count
  }
}
