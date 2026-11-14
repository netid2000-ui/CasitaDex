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
  print("7 StoreKit configuration assertions passed")
 }
}
