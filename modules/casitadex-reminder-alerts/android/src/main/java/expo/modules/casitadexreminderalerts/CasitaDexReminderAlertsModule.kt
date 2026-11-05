package expo.modules.casitadexreminderalerts

import android.Manifest
import android.app.AlarmManager
import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Build
import expo.modules.interfaces.permissions.Permissions
import expo.modules.kotlin.Promise
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import org.json.JSONObject

class CasitaDexReminderAlertsModule : Module() {
  private fun context() = requireNotNull(appContext.reactContext)

  override fun definition() = ModuleDefinition {
    Name("CasitaDexReminderAlerts")

    AsyncFunction("permission") { ReminderAlerts.permission(context()) }
    AsyncFunction("requestPermission") { promise: Promise ->
      val context = context()
      ReminderAlerts.optIn(context)
      if (Build.VERSION.SDK_INT >= 33) {
        Permissions.askForPermissionsWithPermissionsManager(
          appContext.permissions, promise, Manifest.permission.POST_NOTIFICATIONS
        )
      } else {
        promise.resolve(true)
      }
    }
    AsyncFunction("pending") { ReminderAlerts.pending(context()) }
    AsyncFunction("cancel") { identifiers: List<String> ->
      ReminderAlerts.cancel(context(), identifiers)
    }
    AsyncFunction("schedule") { identifier: String, kind: String, sourceId: String, at: Double ->
      ReminderAlerts.schedule(context(), identifier, kind, sourceId, at)
    }
  }
}

class ReminderAlertReceiver : BroadcastReceiver() {
  override fun onReceive(context: Context, intent: Intent) {
    when (intent.action) {
      Intent.ACTION_BOOT_COMPLETED -> ReminderAlerts.restore(context)
      ReminderAlerts.ALARM -> intent.data?.lastPathSegment?.let { ReminderAlerts.deliver(context, it) }
    }
  }
}

private object ReminderAlerts {
  const val ALARM = "casitadex.reminder.ALARM"
  private const val PREFIX = "casitadex:unified-reminder-v1:"
  private const val OPTED_IN = "opted-in"
  private const val CHANNEL = "casitadex-reminders"
  private const val TITLE = "CasitaDex reminder"

  private fun prefs(context: Context) =
    context.getSharedPreferences("casitadex-reminder-alerts", Context.MODE_PRIVATE)

  private fun notifications(context: Context) =
    context.getSystemService(NotificationManager::class.java)

  private fun alarms(context: Context) = context.getSystemService(AlarmManager::class.java)

  private fun alarm(context: Context, identifier: String, flags: Int): PendingIntent? {
    val intent = Intent(context, ReminderAlertReceiver::class.java)
      .setAction(ALARM)
      .setData(Uri.Builder().scheme("casitadex").authority("reminder").appendPath(identifier).build())
    return PendingIntent.getBroadcast(context, 0, intent, flags or PendingIntent.FLAG_IMMUTABLE)
  }

  private fun record(value: Any?): JSONObject? =
    (value as? String)?.let { runCatching { JSONObject(it) }.getOrNull() }

  fun permission(context: Context): String {
    if (!prefs(context).getBoolean(OPTED_IN, false)) return "undetermined"
    val manager = notifications(context)
    return if (manager.areNotificationsEnabled() &&
      (Build.VERSION.SDK_INT < 26 || manager.getNotificationChannel(CHANNEL)?.importance != NotificationManager.IMPORTANCE_NONE)
    ) "allowed" else "denied"
  }

  fun optIn(context: Context) {
    check(prefs(context).edit().putBoolean(OPTED_IN, true).commit())
    if (Build.VERSION.SDK_INT >= 26) {
      notifications(context).createNotificationChannel(
        NotificationChannel(CHANNEL, "Reminders", NotificationManager.IMPORTANCE_DEFAULT)
      )
    }
  }

  @Synchronized
  fun pending(context: Context): Map<String, Any> {
    val reminders = mutableListOf<Map<String, Any>>()
    val invalidOwned = mutableListOf<String>()
    for ((identifier, value) in prefs(context).all) {
      if (!identifier.startsWith(PREFIX)) continue
      val item = record(value)
      val at = item?.optLong("at", 0L) ?: 0L
      if (item == null || at <= 0 || !item.has("kind") || !item.has("sourceId") ||
        alarm(context, identifier, PendingIntent.FLAG_NO_CREATE) == null
      ) {
        invalidOwned.add(identifier)
        continue
      }
      reminders.add(mapOf(
        "identifier" to identifier, "title" to TITLE, "at" to at.toDouble(),
        "kind" to item.getString("kind"), "sourceId" to item.getString("sourceId")
      ))
    }
    return mapOf("reminders" to reminders, "invalidOwned" to invalidOwned, "otherCount" to 0)
  }

  @Synchronized
  fun cancel(context: Context, identifiers: List<String>) {
    val owned = identifiers.filter { it.startsWith(PREFIX) }
    val edit = prefs(context).edit()
    owned.forEach { edit.remove(it) }
    check(edit.commit())
    for (identifier in owned) {
      alarm(context, identifier, PendingIntent.FLAG_NO_CREATE)?.let {
        alarms(context).cancel(it)
        it.cancel()
      }
      notifications(context).cancel(identifier, 0)
    }
  }

  @Synchronized
  fun schedule(context: Context, identifier: String, kind: String, sourceId: String, at: Double) {
    require(identifier.startsWith(PREFIX) && kind in setOf("memory", "standalone") && at.isFinite())
    if (permission(context) != "allowed" || at <= System.currentTimeMillis()) return
    val item = JSONObject().put("kind", kind).put("sourceId", sourceId).put("at", at.toLong())
    check(prefs(context).edit().putString(identifier, item.toString()).commit())
    try {
      arm(context, identifier, at.toLong())
    } catch (error: RuntimeException) {
      cancel(context, listOf(identifier))
      throw error
    }
  }

  private fun arm(context: Context, identifier: String, at: Long) {
    val operation = requireNotNull(alarm(context, identifier, PendingIntent.FLAG_UPDATE_CURRENT))
    alarms(context).setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, at, operation)
  }

  @Synchronized
  fun restore(context: Context) {
    if (permission(context) != "allowed") return
    for ((identifier, value) in prefs(context).all) {
      if (!identifier.startsWith(PREFIX)) continue
      val at = record(value)?.optLong("at", 0L) ?: 0L
      if (at > System.currentTimeMillis()) arm(context, identifier, at)
      else cancel(context, listOf(identifier))
    }
  }

  @Synchronized
  fun deliver(context: Context, identifier: String) {
    if (!identifier.startsWith(PREFIX)) return
    val store = prefs(context)
    val at = record(store.all[identifier])?.optLong("at", 0L) ?: return
    if (at <= 0 || at > System.currentTimeMillis() || !store.edit().remove(identifier).commit()) return
    alarm(context, identifier, PendingIntent.FLAG_NO_CREATE)?.cancel()
    if (permission(context) != "allowed") return
    @Suppress("DEPRECATION")
    val builder = if (Build.VERSION.SDK_INT >= 26) Notification.Builder(context, CHANNEL)
      else Notification.Builder(context).setDefaults(Notification.DEFAULT_SOUND)
    val notification = builder.setSmallIcon(android.R.drawable.ic_popup_reminder)
      .setContentTitle(TITLE)
      .setContentText("Open CasitaDex to review your reminders.")
      .setVisibility(Notification.VISIBILITY_PRIVATE)
      .setAutoCancel(true)
    context.packageManager.getLaunchIntentForPackage(context.packageName)?.let { launch ->
      notification.setContentIntent(PendingIntent.getActivity(
        context, 0, launch, PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
      ))
    }
    notifications(context).notify(identifier, 0, notification.build())
  }
}
