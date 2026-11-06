import Foundation
import CryptoKit

// Bounded restoration of the two files copied by ExpoSQLite 57.0.4's podspec.
// Default is read-only. Only --apply writes, and only to absent ios/sqlite3.c,h.
// Does not evaluate a podspec, run Ruby/CocoaPods, or change the dependency graph.
let fm = FileManager.default
// Run from the repository root. No machine-specific path is embedded.
let root = URL(fileURLWithPath: fm.currentDirectoryPath, isDirectory: true).standardizedFileURL
let apply = CommandLine.arguments.dropFirst() == ["--apply"]
struct Failure: Error, CustomStringConvertible { let description: String }
func require(_ condition: Bool, _ message: String) throws { if !condition { throw Failure(description: message) } }
// Refuse symlink ancestors and non-regular inputs before reading or writing.
// Existing CocoaPods header links are separately checked against their exact target.
func checkPath(_ relative: String, directory: Bool = false, allowMissing: Bool = false) throws {
  var cursor = root
  for component in relative.split(separator: "/") {
    cursor.appendPathComponent(String(component))
    do {
      let attributes = try fm.attributesOfItem(atPath: cursor.path)
      let expected: FileAttributeType = cursor.path == root.appendingPathComponent(relative).path && !directory ? .typeRegular : .typeDirectory
      try require(attributes[.type] as? FileAttributeType == expected, "Refusing unexpected file type: \(relative)")
    } catch let error as NSError where error.domain == NSCocoaErrorDomain && error.code == NSFileReadNoSuchFileError {
      try require(allowMissing && cursor.path == root.appendingPathComponent(relative).path, "Missing input: \(relative)")
    }
  }
}
func data(_ relative: String) throws -> Data {
  try checkPath(relative)
  return try Data(contentsOf: root.appendingPathComponent(relative))
}
func digest(_ value: Data) -> String { SHA256.hash(data: value).map { String(format: "%02x", $0) }.joined() }
func json(_ relative: String) throws -> [String: Any] {
  guard let object = try JSONSerialization.jsonObject(with: data(relative)) as? [String: Any] else { throw Failure(description: "Not a JSON object: \(relative)") }
  return object
}
let nativePins: [(String, String)] = [
  ("ios/Podfile.lock", "21dbc0697ad6a9511a3027529f8d9ef65d0fd414424b43d263cf043779a4a99a"),
  ("ios/Pods/Manifest.lock", "21dbc0697ad6a9511a3027529f8d9ef65d0fd414424b43d263cf043779a4a99a"),
  ("ios/Pods/Pods.xcodeproj/project.pbxproj", "d63fc12b77301317dd7d24f02c9be2ba25ce2463da4edc7da3506e4d3684d44a"),
  ("ios/CasitaDexDev.xcodeproj/project.pbxproj", "778dd265334b738eda0d163ae421268101acee77c5db1120a0192b73893d2f3e"),
  ("node_modules/expo-sqlite/ios/ExpoSQLite.podspec", "1c6e72b1a331a953e0a53948bf13e48924f9e7f4554aeedd8349798305d7c1b6")
]
let vendorPins: [(String, String)] = [
  ("sqlite3.c", "df16f4f2845488289d416e1d3b928c82ade5256564605b762daf0113fad394c5"),
  ("sqlite3.h", "0d247fd5e5e2fd602f427227bae7bf6349dd3322d6090d9751b21b5b3f51db62")
]
do {
  try require(CommandLine.arguments.count == 1 || apply, "Usage: swift prepare-expo-sqlite.swift [--apply]")
  try require(root.path == root.resolvingSymlinksInPath().path, "Repository root must not contain symlinks")
  try checkPath("node_modules/expo-sqlite/ios", directory: true)
  let package = try json("node_modules/expo-sqlite/package.json")
  try require(package["name"] as? String == "expo-sqlite" && package["version"] as? String == "57.0.4", "Expected installed expo-sqlite 57.0.4")
  let lock = try json("package-lock.json")
  let locked = (lock["packages"] as? [String: Any])?["node_modules/expo-sqlite"] as? [String: Any]
  try require(locked?["version"] as? String == "57.0.4", "Lockfile version mismatch")
  try require(locked?["integrity"] as? String == "sha512-3N/bnDx4+kWEC9GABxKPLe/6RHTZJR/7DNT5tz/cYi8f7emign3ooavXnJn0+JPBA0JhHmsdDPrmC+CtT86Jzg==", "Lockfile integrity mismatch")
  let properties = try json("ios/Podfile.properties.json")
  for key in ["expo.sqlite.useSQLCipher", "expo.sqlite.useLibSQL"] {
    try require(properties[key] == nil || properties[key] as? String == "false", "Plain SQLite required; unsupported property \(key)")
  }
  for (path, hash) in nativePins { try require(digest(try data(path)) == hash, "Pinned native input changed: \(path)") }
  let untouchedPaths = ["package.json", "package-lock.json", "ios/Podfile", "ios/Podfile.properties.json"] + nativePins.map { $0.0 }
  var before: [String: Data] = [:]
  for path in untouchedPaths { before[path] = try data(path) }
  let pbx = String(decoding: try data("ios/Pods/Pods.xcodeproj/project.pbxproj"), as: UTF8.self)
  try require(pbx.contains("sqlite3.c in Sources") && pbx.contains("sqlite3.h in Headers"), "Existing Pods source/header references missing")
  let umbrella = String(decoding: try data("ios/Pods/Target Support Files/ExpoSQLite/ExpoSQLite-umbrella.h"), as: UTF8.self)
  try require(umbrella.contains("#import \"sqlite3.h\""), "Existing umbrella SQLite import missing")
  let expectedHeader = root.appendingPathComponent("node_modules/expo-sqlite/ios/sqlite3.h").standardizedFileURL.path
  for visibility in ["Public", "Private"] {
    let link = root.appendingPathComponent("ios/Pods/Headers/\(visibility)/ExpoSQLite/sqlite3.h")
    let target = try fm.destinationOfSymbolicLink(atPath: link.path)
    let resolved = link.deletingLastPathComponent().appendingPathComponent(target).standardizedFileURL.path
    try require(resolved == expectedHeader, "Unexpected \(visibility) header symlink target: expected package header")
  }
  var prepared: [(URL, Data, String)] = []
  // Validate BOTH destinations before any write. Refuse all symlink destinations.
  for (file, hash) in vendorPins {
    let source = root.appendingPathComponent("node_modules/expo-sqlite/vendor/sqlite3/\(file)")
    let destination = root.appendingPathComponent("node_modules/expo-sqlite/ios/\(file)")
    try checkPath("node_modules/expo-sqlite/vendor/sqlite3/\(file)")
    try checkPath("node_modules/expo-sqlite/ios/\(file)", allowMissing: true)
    let bytes = try Data(contentsOf: source)
    try require(digest(bytes) == hash, "Vendor hash mismatch: \(file)")
    if let attributes = try? fm.attributesOfItem(atPath: destination.path) {
      try require(attributes[.type] as? FileAttributeType == .typeRegular, "Refusing non-regular destination: \(file)")
      try require(try Data(contentsOf: destination) == bytes, "Refusing different existing bytes: \(file)")
      print("ALREADY IDENTICAL: \(file) \(hash)")
    } else {
      prepared.append((destination, bytes, hash))
      print("MISSING: \(file) \(hash)")
    }
  }
  if apply {
    for (destination, bytes, _) in prepared {
      // withoutOverwriting makes a concurrent creation fail rather than overwrite.
      try bytes.write(to: destination, options: .withoutOverwriting)
    }
    for (file, hash) in vendorPins {
      try require(digest(try data("node_modules/expo-sqlite/ios/\(file)")) == hash, "Restored bytes mismatch: \(file)")
    }
    for visibility in ["Public", "Private"] {
      try require(digest(try Data(contentsOf: root.appendingPathComponent("ios/Pods/Headers/\(visibility)/ExpoSQLite/sqlite3.h"))) == vendorPins[1].1, "Pods header reference does not resolve to restored bytes")
    }
  }
  for path in untouchedPaths { try require(try data(path) == before[path], "Unexpected change to protected input: \(path)") }
  print(apply ? "PASS: official SQLite files restored; Pods references readable; native graph unchanged." : "PASS: read-only preflight. Run --apply to restore only the two missing official SQLite files.")
} catch {
  FileHandle.standardError.write(Data("FAIL: \(error)\n".utf8))
  exit(1)
}
