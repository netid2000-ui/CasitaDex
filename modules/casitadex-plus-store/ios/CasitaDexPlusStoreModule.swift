import ExpoModulesCore

public final class CasitaDexPlusStoreModule: Module {
  public func definition() -> ModuleDefinition {
    Name("CasitaDexPlusStore")
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
    // No production checkout or transaction finishing is exposed.
  }
}
