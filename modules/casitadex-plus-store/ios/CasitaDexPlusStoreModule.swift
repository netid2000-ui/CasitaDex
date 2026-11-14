import ExpoModulesCore
import StoreKit

public final class CasitaDexPlusStoreModule: Module {
  private var updates: Task<Void, Never>?

  public func definition() -> ModuleDefinition {
    Name("CasitaDexPlusStore")
    Events("entitlementsChanged")
    Function("isConfigured") { (try? PlusStoreReader.configured()) != nil }
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
          case .verified(let value): transaction = value
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
    AsyncFunction("finishDeliveredLocalTransactions") { () async throws -> Int in
      let reader = try PlusStoreReader.configured()
      try reader.requireLocalCheckout()
      #if DEBUG
      // Explicit local-test failure injection: never grants access or affects public builds.
      if ProcessInfo.processInfo.environment["CASITADEX_DEFER_DELIVERY_QA"] == "1" {
        throw PlusStoreReader.Failure.invalidTransaction
      }
      #endif
      let count = try await reader.finishDeliveredLocalTransactions()
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
