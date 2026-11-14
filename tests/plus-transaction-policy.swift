import Foundation
@main struct PolicyTests {
 static func main() {
  let p=PlusTransactionPolicy(productID:"local.test.plus",bundleID:"local.test.app",environment:"Xcode")
  func allowed(_ product:String="local.test.plus",_ bundle:String="local.test.app",_ environment:String="Xcode",_ verified:Bool=true,_ nonConsumable:Bool=true,_ revoked:Bool=false,_ upgraded:Bool=false)->Bool {
   p.allows(product:product,bundle:bundle,environment:environment,verified:verified,nonConsumable:nonConsumable,revoked:revoked,upgraded:upgraded)
  }
  precondition(allowed())
  precondition(!allowed("other.product"))
  precondition(!allowed("local.test.plus","other.app"))
  precondition(!allowed("local.test.plus","local.test.app","Production"))
  precondition(!allowed("local.test.plus","local.test.app","Xcode",false))
  precondition(!allowed("local.test.plus","local.test.app","Xcode",true,false))
  precondition(!allowed("local.test.plus","local.test.app","Xcode",true,true,true))
  precondition(!allowed("local.test.plus","local.test.app","Xcode",true,true,false,true))
  print("8 native policy assertions passed")
 }
}
