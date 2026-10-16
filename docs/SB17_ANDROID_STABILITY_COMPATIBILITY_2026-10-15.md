# SB-17 Android Stability and Compatibility — QA checkpoint
Date: October 15, 2026 Central. CasitaDex Staging only; no Production, Git push, Samsung physical device changes, shared Metro interruption or AVD data wipe.

## Two independent emulator baselines
Primary `DESKTOP-FP0BMH2`: Android API 37, resolution override 720x1600, density 320. Two cold launches after force-stop passed: `am start -W` Status ok, TotalTime 1614ms and 660ms. Android boot complete 1.
Independent QA `DESKTOP-MB70M1T`: Android 15, API 35, 1080x2340, density 440. Three offline cold launches after force-stop passed: Status ok, TotalTime 5174ms, 6032ms, 5899ms. ADB `am send-trim-memory ... RUNNING_CRITICAL` executed. Baseline PSS 133005KB, RSS 245388KB; after reboot PSS 111641KB, RSS 241956KB (snapshots only, not proof of no leaks). Wi-Fi/data restored.

## Reboot and data durability
Secondary emulator full reboot initiated with `adb reboot`, without wiping data. ADB temporarily offline and SystemServer slow: logcat `StartServices took to complete: 112396ms`, `SystemServer init took too long. uptimeMillis=201914`. Eventually Android `sys.boot_completed=1`, bootanimation stopped, MainActivity resumed. Actual CasitaDex detail displayed `QASecondary2026` / `EditVerified2026` and `Attached image`. Pass data durability, FAIL normal boot-performance acceptance.

## System UI and display-scale finding
On secondary, testing font_scale 1.3 (restored to original 1.0) produced the recurring Android `System UI isn't responding` dialog on app launch. The non-destructive `Wait` option returned focus to CasitaDex MainActivity and UIAutomator verified original answer remained. This is a **still-open System UI ANR**; root cause is NOT proven to be CasitaDex versus emulator/host contention. Full large-font readability was not accepted. No forced process kill or destructive AVD reset was used.

## Decision / unclosed SB-17 gates
PASS: two different API levels (35 and 37) and screen widths, offline force-stop/relaunch, non-destructive critical-memory trim command, image and card durability after full reboot, and no observed data loss after System UI error. Primary source regression suite 105 pass / 0 fail, unchanged code.
BLOCKED: ANR-free secondary full reboot and font-scale session; reproducible healthy boot time. Further gates: low-memory process kill, long-run soak/performance profiling, TalkBack, screen-reader/live large-font visuals, actual power-cut/storage-fault injection, and additional Android OS versions. **SB-17 is NOT fully accepted** until these are closed. Existing SB-14–16 features and independent QA remain accepted.

Repo primary: `C:\CasitaDex-Git` branch `prototype/bootstrap`. Preserve owner-modified dirty `docs/RECOVERY_RUNBOOK.md` and do not stage it. No new build needed because no app code was changed.

## Post Windows 11 26H2 retest — October 16, 2026

Secondary workstation now confirmed Windows 11 Pro 26H2 build 26300.9711; WHPX usable, SDK/AVD preserved. Initial AVD boot and app cold launches improved (1946ms initial, 1188ms font 1.3, 3147ms/1757ms offline). Original QA card, answer and photo remain intact. However a repeat non-wiping Android reboot triggered **com.android.systemui SystemUIService ANR** (20,026ms wait) and an independent cold AVD startup with temporary GPU auto/SwiftShader also triggered SystemUI ANR (20,020ms wait). Non-destructive Wait recovered the app and attachments in both cases. Full evidence and limits: `SB17_POST_WINDOWS_26H2_SECONDARY_QA_2026-10-16.md`. SB-17 remains **PARTIALLY ACCEPTED**; Windows 26H2 did not resolve the System UI ANR.
