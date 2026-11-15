package com.designsbyfa.casitadex.refreshqa
import expo.modules.splashscreen.SplashScreenManager

import android.os.Build
import android.os.Bundle

import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

import expo.modules.ReactActivityDelegateWrapper

class MainActivity : ReactActivity() {
  private var probeStep=0
  private var probeBusy=false
  private var probeTicks=0
  private val probe=object:Runnable {
    override fun run(){
      val manager=getSystemService(ACCESSIBILITY_SERVICE) as android.view.accessibility.AccessibilityManager
      if(manager.isEnabled)probeTicks++
      val labels=listOf("Edit Location","Done editing Location","Edit Notes","Done editing Notes","Edit Reference","Done editing Reference")
      fun all(v:android.view.View):List<android.view.View>{
        val result=mutableListOf(v)
        if(v is android.view.ViewGroup)for(i in 0 until v.childCount)result.addAll(all(v.getChildAt(i)))
        return result
      }
      if(manager.isEnabled && probeTicks>=4 && !probeBusy && probeStep<labels.size){
        val label=labels[probeStep]
        val target=all(window.decorView).firstOrNull{it.contentDescription?.toString()?.startsWith(label)==true}
        if(target!=null){
          probeBusy=true
          var parent=target.parent
          while(parent is android.view.View){
            if(parent is android.widget.ScrollView){
              val t=IntArray(2);val p=IntArray(2);target.getLocationInWindow(t);parent.getLocationInWindow(p)
              parent.scrollTo(0,(parent.scrollY+t[1]-p[1]-parent.height/2).coerceAtLeast(0));break
            }
            parent=parent.parent
          }
          val activated=target.performAccessibilityAction(android.view.accessibility.AccessibilityNodeInfo.ACTION_CLICK,null)
          android.os.Handler(mainLooper).postDelayed({
            val focused=all(window.decorView).filter{it.isAccessibilityFocused}.joinToString("|"){it.contentDescription?.toString() ?: (it as? android.widget.TextView)?.text?.toString() ?: it.javaClass.simpleName}
            java.io.File(getExternalFilesDir(null),"activation-results.txt").appendText(label+" activated="+activated+" focus="+focused+"\n")
            probeStep++;probeBusy=false
          },3000)
        }
      }
      android.os.Handler(mainLooper).postDelayed(this,1000)
    }
  }
  override fun onCreate(savedInstanceState: Bundle?) {
    // Set the theme to AppTheme BEFORE onCreate to support
    // coloring the background, status bar, and navigation bar.
    // This is required for expo-splash-screen.
    // setTheme(R.style.AppTheme);
    // @generated begin expo-splashscreen - expo prebuild (DO NOT MODIFY) sync-f3ff59a738c56c9a6119210cb55f0b613eb8b6af
    SplashScreenManager.registerOnActivity(this)
    // @generated end expo-splashscreen
    super.onCreate(null)
    android.os.Handler(mainLooper).postDelayed(probe, 1000)
  }

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "main"

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate {
    return ReactActivityDelegateWrapper(
          this,
          BuildConfig.IS_NEW_ARCHITECTURE_ENABLED,
          object : DefaultReactActivityDelegate(
              this,
              mainComponentName,
              fabricEnabled
          ){})
  }

  /**
    * Align the back button behavior with Android S
    * where moving root activities to background instead of finishing activities.
    * @see <a href="https://developer.android.com/reference/android/app/Activity#onBackPressed()">onBackPressed</a>
    */
  override fun invokeDefaultOnBackPressed() {
      if (Build.VERSION.SDK_INT <= Build.VERSION_CODES.R) {
          if (!moveTaskToBack(false)) {
              // For non-root activities, use the default implementation to finish them.
              super.invokeDefaultOnBackPressed()
          }
          return
      }

      // Use the default back button implementation on Android S
      // because it's doing more than [Activity.moveTaskToBack] in fact.
      super.invokeDefaultOnBackPressed()
  }
}
