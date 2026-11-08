# Mac mini development storage migration — completed

Date: November 8, 2026 (America/Chicago)
Machine: FA-MAC-DEV-01
External volume: FA-Development, APFS
Status: COMPLETE

Internal free space increased from approximately **1.5 GiB at preflight to 101.3 GiB** at final verification. The external SSD retains approximately 1.2 TiB free. Free-space readings fluctuate with macOS swap and caches.

| Storage | New location |
|---|---|
| Gradle user storage | /Volumes/FA-Development/Designs-by-FA/Development-Storage/Gradle |
| npm cache | /Volumes/FA-Development/Designs-by-FA/Development-Storage/npm |
| Android AVD registry/original emulator | /Volumes/FA-Development/Designs-by-FA/Android/AVD |
| Xcode DerivedData | /Volumes/FA-Development/Designs-by-FA/Apple-Builds/DerivedData |
| iOS simulator device collection | /Volumes/FA-Development/Designs-by-FA/Apple-Builds/CoreSimulator/Devices |
| Large downloaded installers | /Volumes/FA-Development/Designs-by-FA/Backups/Installers/Downloads-20261108 |

Original paths are compatibility symlinks. Future Gradle/npm/Android storage is configured through user settings, a managed shell environment file and the current GUI-session environment. Xcode's custom DerivedData setting points to the SSD. Fresh login-shell readback passed. The original Android AVD and the SB40-fixes QA AVD are both registered; only the QA AVD was left running.

## Verification

- Full per-file SHA-256, file-size, mode, symlink and directory inventories were compared before switching paths.
- Internal duplicates were retired only after verified copies existed. The iOS internal duplicate remained until native boot/data checks passed.
- All **33 iOS simulator identities** were preserved.
- Accepted SB40 reference: boot/launch passed; executable and embedded bundle hashes unchanged; **90 memory records**, snapshot hash unchanged.
- Current SB40 household QA: boot/launch and native Home UI passed; executable and embedded bundle hashes unchanged; **166 memory records**, snapshot hash unchanged.
- Original Android emulator booted from the SSD; original SB40 APK SHA-256 remained 01e40085176127b815b0870fabbd4d915f463acdea5d8d4e0eb830871467d3bf.
- Current Android QA emulator booted through the central SSD registry; its APK SHA-256 remained b4f238cce6e005805673e91eba7827b9577b688b4a17fa9373205313fbc5da57.
- Gradle 9.3.1 launched successfully using the relocated cache and existing SSD JDK.
- npm cache, Xcode DerivedData, shell environment and filesystem-device checks passed.
- No simulator erase/reset, app replacement, physical-iPhone change or product-source modification was performed.

Full compilation and broad app regression tests were paused for this storage task and were not rerun. iOS native verification used simctl and the device agent; the previously missing Simulator.app GUI was not repaired here.

## Preservation and safeguards

Independent copies of both protected SB40 app/data pairs were verified under:

/Volumes/FA-Development/Designs-by-FA/Backups/Simulator-Acceptance-20261108

The accepted reference and current QA build remain distinct; no build was substituted for another. macOS, host Keychain and ordinary host application settings remain internally located.

The copier initially stopped on a compatibility-link inventory check; the original was restored, the check corrected, and the verified copy reused. iOS content hashes matched, but ditto dropped the sticky bit from 21 DocumentRevisions staging directories. Those exact directory permissions were restored before switching. All post-move checks passed.

Connecting the native UI agent temporarily foregrounded its runner. The app was explicitly brought forward afterward and its Home controls verified. The final evidence reflects the successful UI assertion, not the earlier focus timeout.

## Future operation

Keep FA-Development mounted for development. Existing internal-path references resolve to the SSD, and the heavy-storage settings target the SSD directly. No fallback copy was left internally to grow silently.

For recovery, pause emulator/simulator activity first. Use the verified SSD collection or protected SB40 backups; preserve device UUIDs and app/data pairs together. Do not erase a device or install a different app as a storage repair.

Detailed manifests, configuration backups, device inventories and native screenshots are retained at:

/Volumes/FA-Development/Designs-by-FA/QA-Evidence/MacMini/storage-migration-20261108

[Machine-readable completion summary](MACMINI_STORAGE_MIGRATION_20261108.json)
