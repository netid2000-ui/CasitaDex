import Foundation

struct PlusTransactionPolicy {
  let productID: String
  let bundleID: String
  let environment: String

  func allows(product: String, bundle: String, environment: String,
              verified: Bool, nonConsumable: Bool, revoked: Bool, upgraded: Bool) -> Bool {
    verified && nonConsumable && !revoked && !upgraded && !productID.isEmpty && !bundleID.isEmpty
      && product == productID && bundle == bundleID && environment == self.environment
  }
}
