const {withAppDelegate}=require('@expo/config-plugins');
/** iOS 27 requires ExpoAppSceneDelegate to create the RN window, not AppDelegate. */
module.exports=function withIosSceneFactory(config){
 return withAppDelegate(config,mod=>{
  if(mod.modResults.language!=='swift')throw Error('CasitaDex requires a Swift AppDelegate for scene lifecycle');
  let s=mod.modResults.contents;
  const original='class AppDelegate: ExpoAppDelegate {';
  const changed='class AppDelegate: ExpoAppDelegate, ExpoReactNativeFactoryProvider {';
  if(s.includes(original))s=s.replace(original,changed);
  else if(!s.includes(changed))throw Error('Unrecognized AppDelegate declaration: cannot apply scene lifecycle safely');
  const startup=/\s*window = UIWindow\(frame: UIScreen\.main\.bounds\)\s*factory\.startReactNative\(\s*withModuleName: "main",\s*in: window,\s*launchOptions: launchOptions\)/;
  if(startup.test(s))s=s.replace(startup,'\n    // ExpoAppSceneDelegate owns the scene window and starts React Native.');
  else if(!s.includes('ExpoAppSceneDelegate owns the scene window'))throw Error('Unexpected AppDelegate startup, refusing to change scene startup');
  mod.modResults.contents=s;
  return mod;
 });
};
