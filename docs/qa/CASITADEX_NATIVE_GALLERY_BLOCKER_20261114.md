# Native gallery verification preparation and blocker
Date:2026-11-14
Source:1f00b67a07db7115bbf1aa472d050fe2bf6b759c
Machine:FA-MAC-DEV-01

## Prepared
Created a separate simulator-only app from installed SB40gestureQA native shell; generated current JavaScript/assets with expo export:embed --dev false, then ad-hoc signed the copy.
Identity:com.designsbyfa.casitadex.pluswindowqa; display CasitaDex Plus Window QA.
Original com.designsbyfa.casitadex.sb40gestureqa app and its data were not modified.
Installed and launched on booted879C620A-5318-4BDF-98B9-904EE635B053. Maestro native accessibility hierarchy returned the new QA identity and Home content.
This is a current-JS simulator harness using an existing native shell, not a full Xcode release rebuild.

## Blockers
AI Commander desktop screenshot request reported Share Screen OFF. No desktop screenshot obtained.
Opening Simulator failed: /Applications/Xcode.app/Contents/Developer/Applications/Simulator.app does not exist, though simctl works and device is booted. Spotlight and bounded searches of Applications and development tool/build locations found no Simulator.app.
Honor owner requirement to keep simulator visible: paused visible acceptance here.
Maestro Java environment recovered by using existing /opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home.
No scrolling, sticky-action, viewer-return, image memory or native large-backup acceptance PASS claimed. No existing photo acceptance suite repeated.
Hierarchy also exposes Home/Photos/Reminders/Find tabs; this needs reconciliation with the remembered Home/Find/Photos/Settings requirement before any claim of full baseline parity. No navigation changed in this checkpoint.

## Resume
Enable AI Commander Share Screen, recover/open visible Simulator from a complete Xcode installation, then run targeted gallery scrolling and viewer-return checks on this separate identity.
No production release, user-data changes or purchase activity.
Figma checkpoint1006:17 records BLOCKED status.

Embedded bundle SHA256: e2a57bfe68a1ca16afbdaeaca59c5649670731375d996e69533413cd345938f8
