import ExpoModulesCore
import UserNotifications
import UIKit

public final class CasitaDexReminderAlertsModule: Module {
  fileprivate static let prefix = "casitadex:unified-reminder-v1:"

  public func definition() -> ModuleDefinition {
    Name("CasitaDexReminderAlerts")

    AsyncFunction("permission") { () async -> String in
      let settings = await UNUserNotificationCenter.current().notificationSettings()
      switch settings.authorizationStatus {
      case .authorized, .provisional, .ephemeral:
        return "allowed"
      case .notDetermined:
        return "undetermined"
      default:
        return "denied"
      }
    }

    AsyncFunction("requestPermission") { () async throws -> Bool in
      try await UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .sound])
    }

    AsyncFunction("pending") { () async -> [String: Any] in
      let requests = await UNUserNotificationCenter.current().pendingNotificationRequests()
      let owned = requests.filter { $0.identifier.hasPrefix(Self.prefix) }
      let reminders: [[String: Any]] = owned.compactMap { request in
        let data = request.content.userInfo
        guard let at = data["at"] as? Double,
              let sourceId = data["sourceId"] as? String,
              let kind = data["kind"] as? String else {
          return nil
        }
        return [
          "identifier": request.identifier, "at": at, "title": request.content.title,
          "sourceId": sourceId, "kind": kind
        ]
      }
      return [
        "reminders": reminders, "otherCount": requests.count - owned.count,
        "invalidOwned": owned.filter { $0.content.userInfo["at"] as? Double == nil
          || $0.content.userInfo["sourceId"] as? String == nil
          || $0.content.userInfo["kind"] as? String == nil }.map(\.identifier)
      ]
    }

    AsyncFunction("cancel") { (identifiers: [String]) in
      UNUserNotificationCenter.current().removePendingNotificationRequests(
        withIdentifiers: identifiers.filter { $0.hasPrefix(Self.prefix) }
      )
    }

    AsyncFunction("schedule") { (identifier: String, kind: String, sourceId: String, at: Double) async throws in
      guard identifier.hasPrefix(Self.prefix),
            kind == "memory" || kind == "standalone",
            at.isFinite else {
        throw ReminderAlertError.invalidRequest
      }
      let seconds = at / 1000 - Date().timeIntervalSince1970
      guard seconds > 0 else { return }

      let content = UNMutableNotificationContent()
      content.title = "CasitaDex reminder"
      content.body = "Open CasitaDex to review your reminders."
      content.sound = .default
      content.userInfo = ["at": at, "sourceId": sourceId, "kind": kind]
      let trigger = UNTimeIntervalNotificationTrigger(timeInterval: seconds, repeats: false)
      try await UNUserNotificationCenter.current().add(
        UNNotificationRequest(identifier: identifier, content: content, trigger: trigger)
      )
    }
  }

  private enum ReminderAlertError: Error {
    case invalidRequest
  }
}

// Expo instantiates subscribers at launch. Avoid displacing an existing app-wide delegate.
public final class CasitaDexReminderAlertsAppDelegateSubscriber: ExpoAppDelegateSubscriber {
  private let presentation = CasitaDexReminderPresentation()

  public func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    let center = UNUserNotificationCenter.current()
    if center.delegate == nil { center.delegate = presentation }
    return true
  }
}

private final class CasitaDexReminderPresentation: NSObject, UNUserNotificationCenterDelegate {
  func userNotificationCenter(
    _ center: UNUserNotificationCenter,
    willPresent notification: UNNotification,
    withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void
  ) {
    let isReminder = notification.request.identifier.hasPrefix(CasitaDexReminderAlertsModule.prefix)
    completionHandler(isReminder ? [.banner, .list, .sound] : [])
  }
}
