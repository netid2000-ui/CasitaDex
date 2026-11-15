internal import Expo
import React
import ReactAppDependencyProvider

@main
class AppDelegate: ExpoAppDelegate, ExpoReactNativeFactoryProvider {
  var window: UIWindow?

  var reactNativeDelegate: ExpoReactNativeFactoryDelegate?
  var reactNativeFactory: RCTReactNativeFactory?

  public override func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    Timer.scheduledTimer(timeInterval: 1, target: self, selector: #selector(probeTree), userInfo: nil, repeats: true)
    let delegate = ReactNativeDelegate()
    let factory = ExpoReactNativeFactory(delegate: delegate)
    delegate.dependencyProvider = RCTAppDependencyProvider()

    reactNativeDelegate = delegate
    reactNativeFactory = factory

    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }

  var lastProbe = ""
  var probeStep=0
  var probeBusy=false
  var voiceOverTicks=0
  @objc func probeTree() {
    var labels:[String]=[]
    func visit(_ v:UIView){if let l=v.accessibilityLabel,!l.isEmpty{labels.append(String(describing:type(of:v))+":"+l)};v.subviews.forEach{visit($0)}}
    let windows=UIApplication.shared.windows + [self.window].compactMap{$0}
    windows.forEach{visit($0)}
    let actions=["Edit Location","Done editing Location","Edit Notes","Done editing Notes","Edit Reference","Done editing Reference"]
    if UIAccessibility.isVoiceOverRunning {voiceOverTicks+=1}
    if voiceOverTicks>=4 && UIAccessibility.isVoiceOverRunning && !probeBusy && probeStep<actions.count {
      func locate(_ v:UIView)->UIView?{if v.accessibilityLabel==actions[probeStep]{return v};for c in v.subviews{if let found=locate(c){return found}};return nil}
      if let target=windows.compactMap({locate($0)}).first {
        probeBusy=true
        var ancestor=target.superview
        while let current=ancestor {
          if let scroll=current as? UIScrollView {
            let rect=target.convert(target.bounds,to:scroll)
            let y=max(0,min(rect.midY-scroll.bounds.height/2,scroll.contentSize.height-scroll.bounds.height))
            scroll.setContentOffset(CGPoint(x:0,y:y),animated:false)
            break
          }
          ancestor=current.superview
        }
        let label=actions[probeStep],activated=target.accessibilityActivate()
        DispatchQueue.main.asyncAfter(deadline:.now()+3){
          let focused=UIAccessibility.focusedElement(using:nil) as? NSObject
          let row=label+" activated="+String(activated)+" focus="+(focused?.accessibilityLabel ?? "nil")+"\n"
          let file=FileManager.default.urls(for:.documentDirectory,in:.userDomainMask)[0].appendingPathComponent("in-place-activation.txt")
          if let h=try? FileHandle(forWritingTo:file){h.seekToEndOfFile();h.write(Data(row.utf8));try? h.close()}else{try? row.write(to:file,atomically:true,encoding:.utf8)}
          self.probeStep+=1;self.probeBusy=false
        }
      }
    }
    let value=labels.joined(separator:"\n")
    if value != lastProbe {
      lastProbe=value
      let url=FileManager.default.urls(for:.documentDirectory,in:.userDomainMask)[0].appendingPathComponent("live-accessibility-tree.txt")
      try? value.write(to:url,atomically:true,encoding:.utf8)
    }
  }
  // Linking API
  public override func application(
    _ app: UIApplication,
    open url: URL,
    options: [UIApplication.OpenURLOptionsKey: Any] = [:]
  ) -> Bool {
    return super.application(app, open: url, options: options) || RCTLinkingManager.application(app, open: url, options: options)
  }

  // Universal Links
  public override func application(
    _ application: UIApplication,
    continue userActivity: NSUserActivity,
    restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void
  ) -> Bool {
    let result = RCTLinkingManager.application(application, continue: userActivity, restorationHandler: restorationHandler)
    return super.application(application, continue: userActivity, restorationHandler: restorationHandler) || result
  }
}

class ReactNativeDelegate: ExpoReactNativeFactoryDelegate {
  // Extension point for config-plugins

  override func sourceURL(for bridge: RCTBridge) -> URL? {
    // needed to return the correct URL for expo-dev-client.
    bridge.bundleURL ?? bundleURL()
  }

  override func bundleURL() -> URL? {
    return Bundle.main.url(forResource: "main", withExtension: "jsbundle")
  }
}
