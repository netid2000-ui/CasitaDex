import Foundation
import CryptoKit
// Usage: swift scripts/test-prepare-expo-sqlite.swift <prepared-reference-root> <new-fixture-parent>
// All writes are under a newly created fixture parent, never the reference.
let fm = FileManager.default
guard CommandLine.arguments.count == 3 else { fatalError("Expected reference root and new fixture parent") }
let reference = URL(fileURLWithPath: CommandLine.arguments[1]).standardizedFileURL
let parent = URL(fileURLWithPath: CommandLine.arguments[2]).standardizedFileURL
let script = URL(fileURLWithPath: fm.currentDirectoryPath).appendingPathComponent("scripts/prepare-expo-sqlite.swift")
guard !fm.fileExists(atPath: parent.path), parent.path != reference.path,
      !parent.path.hasPrefix(reference.path + "/") else { fatalError("Use a new external fixture parent") }
try fm.createDirectory(at: parent, withIntermediateDirectories: false)
let paths = ["package.json", "package-lock.json", "ios/Podfile", "ios/Podfile.properties.json",
 "ios/Podfile.lock", "ios/Pods/Manifest.lock", "ios/Pods/Pods.xcodeproj/project.pbxproj",
 "ios/CasitaDexDev.xcodeproj/project.pbxproj", "ios/Pods/Target Support Files/ExpoSQLite/ExpoSQLite-umbrella.h",
 "node_modules/expo-sqlite/package.json", "node_modules/expo-sqlite/ios/ExpoSQLite.podspec",
 "node_modules/expo-sqlite/vendor/sqlite3/sqlite3.c", "node_modules/expo-sqlite/vendor/sqlite3/sqlite3.h"]
let original = try Dictionary(uniqueKeysWithValues: paths.map { ($0, try Data(contentsOf: reference.appendingPathComponent($0))) })
func write(_ root: URL, _ path: String, _ bytes: Data) throws {
 let target = root.appendingPathComponent(path)
 try fm.createDirectory(at: target.deletingLastPathComponent(), withIntermediateDirectories: true)
 try bytes.write(to: target)
}
func fixture(_ name: String) throws -> URL {
 let root = parent.appendingPathComponent(name)
 for path in paths { try write(root, path, original[path]!) }
 for visibility in ["Public", "Private"] {
   let link = root.appendingPathComponent("ios/Pods/Headers/\(visibility)/ExpoSQLite/sqlite3.h")
   try fm.createDirectory(at: link.deletingLastPathComponent(), withIntermediateDirectories: true)
   try fm.createSymbolicLink(atPath: link.path, withDestinationPath: "../../../../../node_modules/expo-sqlite/ios/sqlite3.h")
 }
 return root
}
var checks = 0
func run(_ root: URL, _ arguments: [String], success: Bool) throws {
 let p = Process()
 p.executableURL = URL(fileURLWithPath: "/usr/bin/swift")
 p.arguments = [script.path] + arguments
 p.currentDirectoryURL = root
 let log = root.appendingPathComponent("run-\(checks).log")
 fm.createFile(atPath: log.path, contents: nil)
 let handle = try FileHandle(forWritingTo: log)
 p.standardOutput = handle; p.standardError = handle
 try p.run(); p.waitUntilExit(); try handle.close()
 guard (p.terminationStatus == 0) == success else {
   print(try String(contentsOf: log, encoding: .utf8)); fatalError("Unexpected result: \(root.lastPathComponent)")
 }
 checks += 1
 print("PASS \(checks): \(root.lastPathComponent) \(arguments.joined(separator: " ")) expected \(success ? "success" : "refusal")")
}
func absent(_ root: URL) {
 for file in ["sqlite3.c", "sqlite3.h"] {
  precondition(!fm.fileExists(atPath: root.appendingPathComponent("node_modules/expo-sqlite/ios/\(file)").path))
 }
}
let clean = try fixture("clean")
try run(clean, [], success: true); absent(clean)
try run(clean, ["--apply"], success: true)
try run(clean, ["--apply"], success: true)
for path in paths { let actual = try Data(contentsOf: clean.appendingPathComponent(path)); precondition(actual == original[path]) }
let invalid = try fixture("invalid-arguments")
try run(invalid, ["--force"], success: false); absent(invalid)
for (name, path, bytes) in [
 ("version", "node_modules/expo-sqlite/package.json", Data(#"{"name":"expo-sqlite","version":"57.0.5"}"#.utf8)),
 ("integrity", "package-lock.json", Data(#"{"packages":{"node_modules/expo-sqlite":{"version":"57.0.4","integrity":"wrong"}}}"#.utf8)),
 ("vendor", "node_modules/expo-sqlite/vendor/sqlite3/sqlite3.h", Data("wrong".utf8)),
 ("podspec", "node_modules/expo-sqlite/ios/ExpoSQLite.podspec", Data("wrong".utf8)),
 ("graph", "ios/Pods/Manifest.lock", Data("wrong".utf8)),
 ("cipher", "ios/Podfile.properties.json", Data(#"{"expo.sqlite.useSQLCipher":"true"}"#.utf8)),
 ("libsql", "ios/Podfile.properties.json", Data(#"{"expo.sqlite.useLibSQL":"true"}"#.utf8))
] {
 let root = try fixture(name); try write(root, path, bytes)
 try run(root, ["--apply"], success: false); absent(root)
}
let conflict = try fixture("header-conflict")
try write(conflict, "node_modules/expo-sqlite/ios/sqlite3.h", Data("conflict".utf8))
try run(conflict, ["--apply"], success: false)
precondition(!fm.fileExists(atPath: conflict.appendingPathComponent("node_modules/expo-sqlite/ios/sqlite3.c").path))
for (name, target) in [("symlink-existing", "../vendor/sqlite3/sqlite3.h"), ("symlink-dangling", "absent.h")] {
 let root = try fixture(name)
 try fm.createSymbolicLink(atPath: root.appendingPathComponent("node_modules/expo-sqlite/ios/sqlite3.h").path, withDestinationPath: target)
 try run(root, ["--apply"], success: false)
 precondition(!fm.fileExists(atPath: root.appendingPathComponent("node_modules/expo-sqlite/ios/sqlite3.c").path))
}
for (name, relative) in [("ios-parent-link", "node_modules/expo-sqlite/ios"),
                        ("vendor-parent-link", "node_modules/expo-sqlite/vendor/sqlite3"),
                        ("vendor-file-link", "node_modules/expo-sqlite/vendor/sqlite3/sqlite3.h")] {
 let root = try fixture(name)
 let target = root.appendingPathComponent(relative)
 let preserved = target.deletingLastPathComponent().appendingPathComponent(target.lastPathComponent + "-preserved")
 try fm.moveItem(at: target, to: preserved)
 try fm.createSymbolicLink(atPath: target.path, withDestinationPath: preserved.lastPathComponent)
 try run(root, ["--apply"], success: false); absent(root)
}
let wrongLink = try fixture("wrong-pods-link")
let link = wrongLink.appendingPathComponent("ios/Pods/Headers/Public/ExpoSQLite/sqlite3.h")
try fm.moveItem(at: link, to: link.deletingLastPathComponent().appendingPathComponent("original-link"))
try fm.createSymbolicLink(atPath: link.path, withDestinationPath: "wrong.h")
try run(wrongLink, ["--apply"], success: false); absent(wrongLink)
let partial = try fixture("partial-recovery")
try write(partial, "node_modules/expo-sqlite/ios/sqlite3.c", original["node_modules/expo-sqlite/vendor/sqlite3/sqlite3.c"]!)
try run(partial, ["--apply"], success: true)
for path in paths { let actual = try Data(contentsOf: reference.appendingPathComponent(path)); precondition(actual == original[path]) }
print("PASS: \(checks) scenarios; protected reference inputs unchanged. Fixtures retained.")
