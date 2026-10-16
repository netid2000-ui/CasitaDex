# SB-17 — Post-Windows-11-26H2 Secondary Android QA
Date: October 15–16, 2026 Central Time. Owner: Designs by F&A. Device: DESKTOP-MB70M1T. Status: PARTIAL — reproducible Android System UI startup ANR remains OPEN.

## Authorization and preservation
User reported completion of Windows 11 26H2 upgrade and authorized continuing SB-17 verification under prior CasitaDex super-batch controls. AI Commander secondary `aic-DESKTOP-MB70M1T` agent 1.6.0 ONLINE. Non-elevated, scoped commands only. No AVD wipe or reset, no Android reinstall, no package uninstall, no repo push or Production; original QA card/image preserved. Primary repo: `C:\CasitaDex-Git`, `prototype/bootstrap`. The owner's pre-existing `docs/RECOVERY_RUNBOOK.md` edit remains untouched.

## Windows and toolchain verification
- `Win32_OperatingSystem`: Windows 11 Pro, version `10.0.26300`, build `26300`; `HKLM CurrentVersion DisplayVersion=26H2`, UBR `9711`; host rebooted during Oct 15 26H2 install.
- NOTE: `HKLM ProductName` still reads `Windows 10 Pro` (compatibility-stale registry display name); OS Caption identifies Windows 11.
- SDK `C:\Users\Admin\AppData\Local\Android\Sdk`, ADB 37.0.1, Android Emulator 37.2.12.0. `emulator -accel-check`: `WHPX(10.0.26300) is installed and usable`. Android x86_64 Google APIs API35 image present.
- GPU: Intel HD Graphics 630; host ~11.9GiB total RAM, ~335GiB C: free, ~6.2GiB available RAM prelaunch.
- Preserved AVD `FA_Android35_SmokeTest`, Pixel 5 device profile, 1080×2340, density 440, guest 2GiB RAM, 2 CPU cores, `hw.gpu.enabled=no`, `showDeviceFrame=yes`. No AVD configuration edits.

## Post-upgrade controlled QA runs
1. Fresh emulator process started at **2026-10-15 23:55:39 CDT** with `-no-snapshot-load -no-snapshot-save` (no data wipe). Android `sys.boot_completed=1` at 23:57:25 (observed within about 106 seconds); `init.svc.bootanim=stopped`.
2. Existing `com.designsbyfa.casitadex.staging` installed. Offline/local record `QASecondary2026`, answer `EditVerified2026`, and `Attached image` verified through UIAutomator on Answer detail. Initial force-stop/relaunch `am start -W`: **1946ms**, PASS.
3. At Android `font_scale 1.3`, force-stop/relaunch **1188ms**, UIAutomator showed QA card and answer. Restored original `font_scale=1.0`. This checks semantic availability, **not yet independent screenshot/visual/ TalkBack accessibility acceptance**.
4. Enabled airplane mode temporarily using Android connectivity service. Two `am start -W` offline force-stop launches **3147ms** and **1757ms**, Status OK. Restored original airplane mode=0.
5. Performed non-wiping full ADB Android reboot at **2026-10-16 00:00:53 CDT**. `sys.boot_completed=1` by 00:02:33, but **System UI ANR** occurred (event log **00:02:20.587**, `am_anr` on `com.android.systemui/.SystemUIService`, waited **20026ms**). The `System UI isn't responding` dialog appeared in UIAutomator. Selected **Wait** (never Close app); returned to CasitaDex and original card/answer survived.
6. A/B graphics test: gracefully closed emulator via `adb emu kill`, then re-opened preserved AVD at **00:06:02** with temporary `-gpu auto`, keeping `-no-snapshot-load -no-snapshot-save`. Emulator selected **Google SwiftShader** OpenGL ES translator with WHPX. Boot flag 1 by **00:07:17**. App force-stop/launch **2682ms**, but System UI ANR recurred (event log **00:07:22.685**, `com.android.systemui/.SystemUIService`, waited **20020ms**). Also a SIM_STATE_CHANGED broadcast ANR in stock Messaging at 00:07:31. Selected Wait. QA card, exact answer and attached image all verified again.
7. Native QA result: no observed loss of SQLite answer or managed media; app cold launches generally 1–3 seconds once system is responsive; standalone Android SystemUI ANR is **reproducible after boot with both original graphics configuration and auto/SwiftShader override**. Neither Windows upgrade nor graphics override clears blocker.

## Analysis and risk boundaries
Android `sys.boot_completed=1` is NOT sufficient to declare the emulator healthy; a service timeout can occur after this flag. The `am_anr` event explicitly names Android System UI rather than CasitaDex. Host resource contention, Android image health, AVD GPU/CPU allocation and system service bugs remain competing hypotheses, not proven root causes. Graphical override improved neither this ANR nor reliability. Do **not** promote SB-17 to full PASS; retain earlier local data durability and Android API35/37 functional passes.

## Recommended bounded next steps
- Keep QA AVD and original saved records intact. Avoid repeated destructive resets or casual package changes.
- Independently profile Android boot CPU/memory and `com.android.systemui` service stall; compare with a **new disposable API35/36 emulator** (different AVD/profile, protected original untouched) and a current native Pixel/Samsung device if available.
- Consider a separate Pixel frame/skin visual-only AVD; device skins must not be treated as a fix for System UI ANR. Test graphics/CPU/RAM changes as controlled variants, one factor at a time, with snapshots/hash-backed recovery.
- Complete TalkBack, true 1.3/2.0x native font visual, long-run soak, low-memory-kill/recovery, disk-full/power interruption and Samsung Remote Test Lab in independent gates.
- Continue SB-18 approved household-memory UI baseline work separately; do not modify existing data storage or production gates.

## External primary reference
Android's documentation lists `-gpu auto`, `host`, `software`, and `swiftshader` graphics options and recommends Windows Hypervisor Platform on Windows: https://developer.android.com/studio/run/emulator-acceleration. Test results supersede any assumption that selecting a GPU mode necessarily resolves an ANR.

## Acceptance decision
**SB-17 remains PARTIALLY ACCEPTED.** Win11 26H2, SDK/AVD preservation, WHPX, local QA card/image durability, offline launches and font 1.3 semantic checks PASS. Full Android boot stability (ANR-free), root cause closure, true large-font visual/TalkBack acceptance and remaining lifecycle fault-injection gates OPEN.