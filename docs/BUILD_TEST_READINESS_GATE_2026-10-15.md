# CasitaDex Android/iOS test build readiness gate - 2026-10-15
Authority: Product Charter v0.4 Amendment C. Owner permits preparation, not Production or unapproved cloud build.

## Current baseline
prototype/bootstrap after 4241b0e. 85/85 automated tests, typecheck and lint PASS. Earlier local Android Staging APK exists at E:\cdx\a\android\app\build\outputs\apk\release\app-release.apk, but predates CD-SB-04 media implementation and is NOT evidence for new media features. iOS project identity is configured; actual Xcode/Mac build NOT RUN. Existing dirty recovery runbook must remain preserved.

## Gate A: Build for Android core regression
New locally signed staging APK permitted only from isolated committed snapshot with reviewed config and native dependency graph; preserve installed data, do not install without owner/device readiness. Confirm staging package ID, signing cert, SHA256, no Firebase runtime. Existing prior APK may be used for OLD text-only backup tests, not new media acceptance.

## Gate B: Build for integrated attachment acceptance
Require real native picker, SHA-256 digest adapter, staging+SQLite+journal through app UI, offline attach/view/delete, safe card deletion/recovery and read-only start-up reconciliation, tested incomplete/promoted/committed states, media-inclusive backup boundary made explicit. No silent loss or auto-orphan deletion. Run tests, lint, typecheck, web export, native Android build; then physical Android airplane-mode and restart checks. Until then, media build NOT READY.

## Gate C: iOS Test build
Requires macOS/Xcode-capable build host or separately owner-approved cloud build and Apple signing credentials; verify staging bundle com.designsbyfa.casitadex.staging, app-owned files, permissions, no Firebase messaging, local SQLite, VoiceOver/Dynamic Type, share and restore boundaries. No Xcode evidence yet. An iOS binary cannot be built on Windows-only local toolchain.

## Remaining super-batch dependencies
SB-04 native integration and offline media acceptance precede SB-05 media-inclusive export/restore; SB-06 local reminders must prove no Firebase native graph; SB-07 accessibility + retrieval study; SB-08 security advisory and complete RC matrix; SB-09 owner-gated distribution. Never equate source test PASS with release readiness. Report exact first test-build gate when achieved.