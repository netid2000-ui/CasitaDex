import ExpoModulesCore
import StoreKit

public final class CasitaDexPlusStoreModule: Module {
  private var updates: Task<Void, Never>?
  private let deliveryQueue = PlusDeliveryQueue()

  public func definition() -> ModuleDefinition {
    Name("CasitaDexPlusStore")
    Events("entitlementsChanged")
    Function("isConfigured") { (try? PlusStoreReader.configured()) != nil }
    Function("isAppleSandbox") { (try? PlusStoreReader.configured().isAppleSandbox) == true }
    Function("isLocalTesting") { () -> Bool in
      guard let reader = try? PlusStoreReader.configured() else { return false }
      do { try reader.requireLocalCheckout(); return true } catch { return false }
    }
    #if DEBUG
    // Test evidence only; never read as an entitlement or used to authorize access.
    Function("recordLocalQAState") { (status: String, entitlement: String) in
      guard let reader = try? PlusStoreReader.configured() else { return }
      guard (try? reader.requireLocalCheckout()) != nil else { return }
      UserDefaults.standard.set(status + ":" + entitlement, forKey: "CasitaDexPlusQABridgeState")
      UserDefaults.standard.set(ProcessInfo.processInfo.processIdentifier, forKey: "CasitaDexPlusQABridgePID")
    }
    #endif
    OnCreate { [weak self] in
      guard let self, let reader = try? PlusStoreReader.configured() else { return }
      self.updates = Task { [weak self] in
        for await result in StoreKit.Transaction.updates {
          guard !Task.isCancelled else { break }
          let transaction: StoreKit.Transaction
          switch result {
          case .verified(let value):
            transaction = value
            if value.productID == reader.policy.productID { await self?.deliveryQueue.stage(value) }
          case .unverified(let value, _): transaction = value
          }
          guard transaction.productID == reader.policy.productID else { continue }
          // Signal only. JavaScript must re-query verified current entitlements.
          self?.sendEvent("entitlementsChanged", [:])
        }
      }
    }
    OnDestroy { [weak self] in self?.updates?.cancel(); self?.updates = nil }
    AsyncFunction("catalog") { () async throws -> [String: String] in
      try await PlusStoreReader.configured().catalog()
    }
    AsyncFunction("verifiedEntitlement") { () async throws -> String in
      try await PlusStoreReader.configured().verifiedEntitlement()
    }
    AsyncFunction("restore") { () async throws -> String in
      try await PlusStoreReader.configured().restore()
    }
    AsyncFunction("purchaseForLocalTesting") { () async throws -> String in
      try await PlusStoreReader.configured().purchaseForLocalTesting()
    }
    AsyncFunction("finishDeliveredLocalTransactions") { [weak self] () async throws -> Int in
      guard let self else { throw PlusStoreReader.Failure.notConfigured }
      let reader = try PlusStoreReader.configured()
      try reader.requireLocalCheckout()
      #if DEBUG
      // Explicit local-test failure injection: never grants access or affects public builds.
      if ProcessInfo.processInfo.environment["CASITADEX_DEFER_DELIVERY_QA"] == "1" {
        var pending: [String] = []
        for await result in StoreKit.Transaction.unfinished {
          if case .verified(let transaction) = result,
             reader.policy.allows(product: transaction.productID, bundle: transaction.appBundleID,
               environment: transaction.environment.rawValue, verified: true,
               nonConsumable: transaction.productType == .nonConsumable,
               revoked: transaction.revocationDate != nil, upgraded: transaction.isUpgraded) {
            pending.append(String(transaction.id))
          }
        }
        UserDefaults.standard.set(pending, forKey: "CasitaDexPlusQADeferredIDs")
        UserDefaults.standard.set(ProcessInfo.processInfo.processIdentifier, forKey: "CasitaDexPlusQADeferredPID")
        throw PlusStoreReader.Failure.invalidTransaction
      }
      #endif
      let count = try await self.deliveryQueue.finishDelivered(reader: reader) { id in
        #if DEBUG
        let defaults = UserDefaults.standard
        let pid = Int(ProcessInfo.processInfo.processIdentifier)
        var ids = defaults.integer(forKey: "CasitaDexPlusQAFinishPID") == pid
          ? defaults.stringArray(forKey: "CasitaDexPlusQAFinishedIDs") ?? [] : []
        ids.append(String(id))
        defaults.set(ids, forKey: "CasitaDexPlusQAFinishedIDs")
        defaults.set(pid, forKey: "CasitaDexPlusQAFinishPID")
        #endif
      }
      #if DEBUG
      if count > 0 {
        UserDefaults.standard.set(ProcessInfo.processInfo.processIdentifier, forKey: "CasitaDexPlusQAFinishPID")
        UserDefaults.standard.set(count, forKey: "CasitaDexPlusQAFinishCount")
      }
      #endif
      return count
    }
    // Production checkout and production transaction finishing remain disabled.
  }
}
