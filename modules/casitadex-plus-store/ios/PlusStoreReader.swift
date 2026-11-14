import Foundation
import StoreKit

@available(iOS 16.4, macOS 13.0, *)
struct PlusStoreReader {
  enum Failure: Error { case notConfigured, unverified, wrongIdentity, missingProduct }
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
