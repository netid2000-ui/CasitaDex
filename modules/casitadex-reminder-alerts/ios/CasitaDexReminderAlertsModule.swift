import ExpoModulesCore
import UserNotifications
import UIKit

public final class CasitaDexReminderAlertsModule: Module {
  fileprivate static let prefix = "casitadex:unified-reminder-v1:"

  public func definition() -> ModuleDefinition {
    Name("CasitaDexReminderAlerts")
    Events("onReminderResponse")
    OnStartObserving("onReminderResponse") {
      NotificationCenter.default.addObserver(self, selector: #selector(self.responseAvailable),
        name: ReminderResponseInbox.changed, object: nil)
    }
    OnStopObserving("onReminderResponse") {
      NotificationCenter.default.removeObserver(self, name: ReminderResponseInbox.changed, object: nil)
    }
    AsyncFunction("pendingResponse") { () -> [String: String]? in
      ReminderResponseInbox.peek()
    }
    AsyncFunction("acknowledgeResponse") { (token: String) in
      ReminderResponseInbox.acknowledge(token)
    }


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

  @objc private func responseAvailable(_ notification: Notification) {
    sendEvent("onReminderResponse", [:])
  }

  private enum ReminderAlertError: Error {
    case invalidRequest
  }
}

// The launch subscriber owns the delegate before JS exists. A locked inbox retains cold-start
// taps until the mounted router acknowledges them; events are only wakeups, never the source of truth.
private enum ReminderResponseInbox {
  static let changed = Notification.Name("CasitaDexReminderResponseAvailable")
  private static let lock = NSLock()
  private static var responses: [[String: String]] = []

  static func record(_ request: UNNotificationRequest) {
    let data = request.content.userInfo
    guard request.identifier.hasPrefix(CasitaDexReminderAlertsModule.prefix),
          let kind = data["kind"] as? String, ["memory", "standalone"].contains(kind),
          let sourceId = data["sourceId"] as? String, !sourceId.isEmpty,
          sourceId.utf16.count <= 512,
          !sourceId.unicodeScalars.contains(where: { $0.value < 32 || $0.value == 127 }) else { return }
    lock.lock()
    responses.append(["token": UUID().uuidString, "kind": kind, "sourceId": sourceId])
    lock.unlock()
    NotificationCenter.default.post(name: changed, object: nil)
  }

  static func peek() -> [String: String]? {
    lock.lock(); defer { lock.unlock() }
    return responses.first
  }

  static func acknowledge(_ token: String) {
    lock.lock(); defer { lock.unlock() }
    if responses.first?["token"] == token { responses.removeFirst() }
  }
}
public final class CasitaDexReminderAlertsAppDelegateSubscriber: ExpoAppDelegateSubscriber {
  private let presentation = CasitaDexReminderPresentation()

  public func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    let center = UNUserNotificationCenter.current()
    if center.delegate !== presentation {
      presentation.previous = center.delegate
      center.delegate = presentation
    }
    return true
  }
}

private final class CasitaDexReminderPresentation: NSObject, UNUserNotificationCenterDelegate {
  weak var previous: UNUserNotificationCenterDelegate?

  func userNotificationCenter(
    _ center: UNUserNotificationCenter,
    didReceive response: UNNotificationResponse,
    withCompletionHandler completionHandler: @escaping () -> Void
  ) {
    if response.notification.request.identifier.hasPrefix(CasitaDexReminderAlertsModule.prefix) {
      if response.actionIdentifier == UNNotificationDefaultActionIdentifier {
        ReminderResponseInbox.record(response.notification.request)
      }
      completionHandler()
    } else if let previous, previous.responds(to: #selector(UNUserNotificationCenterDelegate.userNotificationCenter(_:didReceive:withCompletionHandler:))) {
      previous.userNotificationCenter?(center, didReceive: response, withCompletionHandler: completionHandler)
    } else {
      completionHandler()
    }
  }

  func userNotificationCenter(
    _ center: UNUserNotificationCenter,
    willPresent notification: UNNotification,
    withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void
  ) {
    let isReminder = notification.request.identifier.hasPrefix(CasitaDexReminderAlertsModule.prefix)
    if isReminder {
      completionHandler([.banner, .list, .sound])
    } else if let previous, previous.responds(to: #selector(UNUserNotificationCenterDelegate.userNotificationCenter(_:willPresent:withCompletionHandler:))) {
      previous.userNotificationCenter?(center, willPresent: notification, withCompletionHandler: completionHandler)
    } else {
      completionHandler([])
    }
  }
}
