import Foundation
import StoreKit
@main struct ConfigurationTests {
 static func main() throws {
  let root=FileManager.default.temporaryDirectory.appendingPathComponent(UUID().uuidString)
  try FileManager.default.createDirectory(at:root,withIntermediateDirectories:true)
  defer {try? FileManager.default.removeItem(at:root)}
  func check(_ name:String,_ bundleID:String,_ product:String?,_ env:String?,_ expected:Bool) throws {
   let folder=root.appendingPathComponent(name+".bundle")
   try FileManager.default.createDirectory(at:folder,withIntermediateDirectories:true)
   var info:[String:Any] = ["CFBundleIdentifier":bundleID,"CFBundlePackageType":"BNDL"]
   info["CasitaDexPlusProductID"]=product;info["CasitaDexPlusStoreEnvironment"]=env
   try PropertyListSerialization.data(fromPropertyList:info,format:.xml,options:0).write(to:folder.appendingPathComponent("Info.plist"))
   guard let bundle=Bundle(path:folder.path) else {fatalError("Missing fixture bundle")}
   let configured=(try? PlusStoreReader.configured(bundle:bundle)) != nil
   precondition(configured == expected, name)
  }
  try check("missing","local.test.app",nil,nil,false)
  try check("empty","local.test.app","",AppStore.Environment.production.rawValue,false)
  try check("unknown","local.test.app","local.test.plus","unknown",false)
  try check("production","local.test.app","local.test.plus",AppStore.Environment.production.rawValue,true)
  try check("sandbox","local.test.app","local.test.plus",AppStore.Environment.sandbox.rawValue,true)
  try check("wrongqa","local.test.app","local.test.plus",AppStore.Environment.xcode.rawValue,false)
  #if DEBUG
  try check("isolatedqa","local.test.plusstoreqa","local.test.plus",AppStore.Environment.xcode.rawValue,true)
  #else
  try check("isolatedqa","local.test.plusstoreqa","local.test.plus",AppStore.Environment.xcode.rawValue,false)
  #endif
  func checkout(_ product:String,_ bundle:String,_ env:String,_ expected:Bool) {
   let reader=PlusStoreReader(policy:PlusTransactionPolicy(productID:product,bundleID:bundle,environment:env))
   let allowed:Bool
   do {try reader.requireLocalCheckout();allowed=true} catch {allowed=false}
   precondition(allowed == expected, "Checkout guard: " + product + " / " + env)
  }
  checkout("local.casitadex.plus.qa","local.test.plusstoreqa",AppStore.Environment.production.rawValue,false)
  checkout("local.casitadex.plus.qa","local.test.plusstoreqa",AppStore.Environment.sandbox.rawValue,false)
  checkout("other.product","local.test.plusstoreqa",AppStore.Environment.xcode.rawValue,false)
  checkout("local.casitadex.plus.qa","local.test.app",AppStore.Environment.xcode.rawValue,false)
  #if DEBUG
  checkout("local.casitadex.plus.qa","local.test.plusstoreqa",AppStore.Environment.xcode.rawValue,true)
  #else
  checkout("local.casitadex.plus.qa","local.test.plusstoreqa",AppStore.Environment.xcode.rawValue,false)
  #endif
  #if DEBUG
  checkout("com.designsbyfa.casitadex.plus","com.designsbyfa.casitadex",AppStore.Environment.sandbox.rawValue,true)
  #else
  checkout("com.designsbyfa.casitadex.plus","com.designsbyfa.casitadex",AppStore.Environment.sandbox.rawValue,false)
  #endif
  checkout("com.designsbyfa.casitadex.plus","com.designsbyfa.casitadex",AppStore.Environment.production.rawValue,false)
  checkout("com.designsbyfa.casitadex.plus","com.designsbyfa.casitadex.dev",AppStore.Environment.sandbox.rawValue,false)
  print("StoreKit configuration and checkout assertions passed")
 }
}
