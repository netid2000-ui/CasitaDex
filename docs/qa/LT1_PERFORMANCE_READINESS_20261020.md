# LT1 Development and Emulator Readiness - 2026-10-20

Primary repository stays authoritative at C:\CasitaDex-Git on DESKTOP-FP0BMH2; LT1 is preferred for resource-intensive Android emulator and visual QA when practical. Preserve member app test data and do not overwrite repositories or backups.

## Live read-only verification
- LT1 online via AI Commander 1.6.0, Intel i5-1035G7 (4 cores/8 threads), Intel Iris Plus, RAM 15.6 GB, C free ~99.8 GB.
- Windows PATH does not contain Node; this does NOT mean LT1 lacks Node. Prior environment records confirm Node v24.19.0/npm11.17.0 in Ubuntu WSL under /home/fa-dev/tools, Linux Java21 and Android SDK. Remote WSL shell confirms tools need login-shell-aware path verification.
- Windows user-local SDK at C:\Users\temp\AppData\Local\Android\Sdk contains adb.exe, emulator.exe, sdkmanager.bat. Windows user-local Java JDK21 at C:\Users\temp\AppData\Local\Designs-by-FA\tools\jdk-21.0.12.1+1.
- Windows emulator -accel-check: WHPX(10.0.26200) installed and usable, status 0.
- LT1 Android emulator-5580 existing device ONLINE, sys.boot_completed=1, API35; AVD DesignsByFA_LT1_API35. DO NOT wipe or reinstall: existing acceptance fixtures protected.
- Primary desktop: i5-7500 4 cores/4 threads, Intel HD630, RAM 15.9 GB. LT1 has more threads and newer integrated graphics. Benchmark app responsiveness before declaring runtime speed superiority.

## Next performance gate
Perform controlled non-destructive wall-time/emulator cold-start and visual responsiveness checks on an explicitly disposable AVD, after checking CPU/RAM contention. Do not disrupt existing emulator-5580 data. Keep Expo EAS/iOS secondary DESKTOP-MB70M1T workflow available. No purchases, commits, pushes, deploys, protected device modifications or emulator reset in this check.

## 2026-10-20 live non-destructive comparison
- Both emulator-5580 instances independently report boot completed=1 and foreground Development package com.designsbyfa.casitadex.dev/.MainActivity. LT1 Android API35, primary API37, therefore not an apples-to-apples app benchmark.
- LT1 free system RAM 6.27-6.52 GB during checks, primary 2.17-2.21 GB. LT1 single running qemu emulator process ~1.35 GB working set, primary two emulator qemu processes ~0.90 and 1.04 GB; other primary processes active.
- One simple ADB getprop roundtrip: LT1 118 ms, primary 87 ms, dominated by command/ADB variability and different emulators. Do NOT use this to claim primary is faster or LT1 slower.
- LT1 Android Emulator acceleration previously verified WHPX installed and usable; Windows Node PATH incomplete but WSL user-local Node/Java/Android toolchain documented. No cold boot, APK install, data clearing, UI mutation, emulator stop, repository sync or device changes performed.
- Decision: prioritize LT1 for new disposable Android visual/performance runs because more free RAM and 8 CPU threads; require controlled same APK/API/AVD test before final machine speed ranking. Preserve current LT1 and primary emulator-5580 datasets.

## SB27 disposable LT1 Android 15 AVD checkpoint
- Confirmed local LT1 SDK system-images;android-35;google_apis;x86_64 installed, about 99.8 GB C: free. Created NEW AVD CasitaDex_SB27_Perf_Disposable_API35 with medium_phone profile via avdmanager. Did not reset/alter original DesignsByFA_LT1_API35.
- Launched disposable AVD separately on LT1 emulator-5582. Android boot_completed 1, API 35. Existing accepted LT1 emulator-5580 remained online.
- Four simple disposable ADB getprop samples: 459/457/348/323 ms; with both LT1 emulators running free system RAM observed around 3.03-3.54 GB. Not comparable to single-emulator primary samples; NOT a CasitaDex UI benchmark.
- Gracefully requested shutdown of only disposable emulator-5582; free LT1 RAM rose to ~6.7 GB. ADB list may briefly show 5582 until teardown finishes.
- No CasitaDex APK installed on disposable AVD, so launch/navigation performance acceptance remains OPEN; first benchmark should use the same approved Development APK with matching emulator image/configuration, avoid rebuilding or wiping accepted fixtures. No commits, deployments, source edits or owner-device changes.

## SB27 identical APK benchmark gate — 2026-10-20
- Primary candidate Development APK C:\cdr\a\android\app\build\outputs\apk\release\app-release.apk, SHA256 9D6D734A866A0ED55758CB7A7DED06FF16E09D17C7E9FAE4B51210470A8AA274, 45,059,275 bytes.
- AI Commander file transfer primary -> LT1 blocked by connector Pro transfer restriction; no paid upgrade. Scanned 26 existing LT1 APKs, none matches primary approved SHA256. An LT1 historic r9 candidate SHA256 F00D518F4537C87290D0242989A8DE9B24CEE00C35BB654E58115D055EDB3072 exists but is NOT build-identical; do not claim benchmark equivalence.
- Restarted ONLY disposable LT1 CasitaDex_SB27_Perf_Disposable_API35 emulator-5582; boot did not complete within 24-second polling; next ADB check timed out as LT1 became resource constrained. No APK installed and no owner data changed. Requested graceful shutdown by ADB `emu kill`; command reported OK. Original emulator-5580 not targeted.
- Identical-APK and actual CasitaDex launch/navigation performance comparison remain BLOCKED, not PASS. Before retry: use approved direct machine transfer with validated hash, reduce memory contention, boot only a disposable AVD if safe, then collect reproducible samples. No credentials, protected datasets, commits or deployments touched.

## 2026-10-20 FREE cross-machine transfer gate PASS
- Existing authenticated Tailscale tailnet already links primary desktop 100.82.199.91 and LT1 100.68.239.92; connectivity checked bidirectionally. No new firewall rules, credentials or public file shares.
- Primary sent APK via `C:\Program Files\Tailscale\tailscale.exe file cp C:\cdr\a\android\app\build\outputs\apk\release\app-release.apk lt1:`; command exit 0.
- LT1 received file automatically in C:\Users\temp\Downloads\app-release.apk (file get on LT1 returned no additional inbox files).
- LT1 independent SHA256 EXACT MATCH 9D6D734A866A0ED55758CB7A7DED06FF16E09D17C7E9FAE4B51210470A8AA274 and file length 45059275 bytes. Approved identical Development APK transfer PASS with no paid file connector.
- Reusable technique: Tailscale file cp <local-file> <tailnet-host>:; receiving Windows machine default Downloads or Tailscale inbox; check both then compare SHA256. For private builds, use existing authorized tailnet members, verify hash and avoid exposing public links.
- No APK installation, existing emulator mutation, repo changes, commits, push or deployment. Next: install this verified APK ONLY on LT1 disposable emulator with explicit independent device ID after boot and measure user flows without clearing accepted LT1 emulator-5580.

## 2026-10-20 identical APK disposable app launch QA
- Before run LT1 free RAM ~6.91 GB; accepted original emulator-5580 running. Verified transfer APK SHA256 9D6D734A866A0ED55758CB7A7DED06FF16E09D17C7E9FAE4B51210470A8AA274 again prior to install.
- Launched only newly created disposable LT1 Android API35 `CasitaDex_SB27_Perf_Disposable_API35`, target emulator-5582, headless SwiftShader, no snapshot saved. Boot completed and boot animation stopped.
- `adb -s emulator-5582 install -r` Success (50.9s); NO install on accepted emulator-5580 or physical device.
- First CasitaDex Development activity launch `am start -W` status TIMEOUT after WaitTime 14277ms; topResumedActivity was com.designsbyfa.casitadex.dev/.MainActivity. Repeated already-running start Status OK WaitTime 565ms (does not represent new launch).
- After `am force-stop` app and restart, `am start -W` again TIMEOUT WaitTime 13407ms, though topResumedActivity belonged to Development MainActivity. This does NOT qualify as acceptable app cold launch; visual content/navigation verification not achieved.
- Observed LT1 available system RAM ~3.58GB with two emulators running. Graceful disposable-only emulator-5582 kill returned OK. Accepted emulator-5580 remained boot_completed=1.
- Overall: verified cross-machine identical APK transfer and install PASS; cold launch timing FAIL/TIMEOUT in resource-constrained concurrent-emulator setup; app rendered content / Home navigation and comparative primary timings NOT VERIFIED. Before retest use one disposable emulator at a time with protected accepted emulator shutdown only after explicit data-preserving plan, gather profiler/logcat and controlled parallel primary API35 test. No repository/app data wipes, no commits/deploys.

## Controlled single-emulator isolation, 2026-10-20
- LT1 accepted emulator-5580 initially booted, normal `adb emu kill` requested with no wipe/reset; available system RAM rose to ~8.07 GB. Started only SB27 disposable emulator-5582, API35, headless SwiftShader; Android boot completed after extended boot, eventually with ~5.69 GB free RAM.
- Hash-verified identical Development APK had already been installed on disposable 5582 in previous run; `adb shell am force-stop` and `logcat -c` restricted to disposable; cold `am start -W` returned Status: timeout, WaitTime 14466 ms, MainActivity foreground, process PID 1619; ~5.16 GB free host RAM. Thus timeout REPRODUCES WITHOUT TWO EMULATORS; do not attribute only to host memory contention.
- Captured bounded startup logcat on LT1 at %LOCALAPPDATA%\Designs-by-FA\qa\lt1-launch-20261020\startup-logcat.txt. Simple searched terms FATAL EXCEPTION, ANR in, ReactNativeJS, Displayed, SQLiteException had no matches in last 1800 lines; NOT a full diagnostic exclusion.
- Shut down ONLY disposable emulator-5582 and restarted original DesignsByFA_LT1_API35 emulator-5580 normally. Confirmed emulator-5580 ONLINE and sys.boot_completed=1, free host RAM 6.5 GB. App data not cleared, accepted fixture content not separately re-inspected.
- Decision: app startup/first-draw or Android emulator rendering issue OPEN. Use filtered ActivityTaskManager/Choreographer/ReactNative/Expo logs, screenshot/first-frame check and comparable API35 primary run. No blanket performance PASS. No commits/pushes/deploys or physical-device work.

## Startup log attribution and GPU configuration audit
- Re-inspected LT1 `%LOCALAPPDATA%\Designs-by-FA\qa\lt1-launch-20261020\startup-logcat.txt` (2361 lines). The last record is at 19:06:55, covering Android OS boot activity. Zero lines mention CasitaDex package, ReactNativeJS or ExpoModulesCore. Therefore previous assertion that this log rules out app fatal errors must NOT be treated as app-specific proof.
- Android OS Choreographer showed 379 skipped frames at 19:06:54.270 in system UI process 871, NOT in CasitaDex process 1619. Does not establish a CasitaDex main-thread stall.
- Disposable LT1 API35 AVD config: hw.cpu.ncore=4, hw.ramSize=1536M, hw.gpu.enabled=no, hw.gpu.mode=auto; launched with software SwiftShader in previous test. These are plausible emulator rendering constraints but NOT proven root cause.
- Foreground activity reached and `am start -W` timed out at ~14s even single-emulator; actual first frame and navigation not measured. Pending focused app-PID-filtered logcat *after launch*, screenshot/SurfaceFlinger first frame, and disposable-only graphics A/B profile with host GPU if supported. Keep original accepted 5580 unchanged, no settings changed in this audit.

## 2026-10-20 drive-location hypothesis
- LT1 actual AVD paths are C:\Users\temp\.android\avd on internal healthy 256 GB NVMe HFM256GDGTNG-87A0A; accepted AVD ~5.93 GB, disposable ~3.74 GB. Primary AVD paths under E:\Designs-by-FA\Android\AVD on 6 TB WDC WD6003FZBX HDD; main Medium_Phone AVD ~14.49 GB, Pixel fold ~6.62 GB. Primary system C is a separate 256GB NVMe with only ~15GB free; do not relocate existing AVD there without capacity and integrity plan.
- Three short, mostly idle PhysicalDisk samples: LT1 C read latency ~0.29-0.40 milliseconds, queue length 0; primary E samples showed zero queued I/O and intermittent writes. These samples DO NOT characterize emulator cold-launch I/O under load.
- Drive speed is plausible contributor to primary AVD slowness, but cannot explain LT1 launch-timeout by itself since LT1 AVD is NVMe already. Next: correlated per-drive latency/active-time counters during disposable-only emulator boot and first-frame UI checks, with app PID logcat and matching APK, no protected AVD move/wipe.

## 2026-10-20 load-correlated NVMe and startup log evidence
- With accepted LT1 AVD stopped normally, booted ONLY disposable API35 via LT1 internal NVMe. Eight 1-second disk samples while starting: Avg. disk sec/read average 0.00093s (0.93ms), max 0.00607s (6.07ms); write average 0.00199s (1.99ms), max 0.00332s (3.32ms); disk throughput avg 4.61MB/s max 6.80MB/s. Samples limited to early boot, not all I/O; no evidence of sustained disk latency bottleneck.
- Disposable emulator booted successfully. ADB `am start -W` CasitaDex Development cold launch Status TIMEOUT, WaitTime 19918ms, MainActivity focus. Full logcat captured at LT1 `%LOCALAPPDATA%\Designs-by-FA\qa\lt1-launch-20261020\single-emulator-app-start-logcat.txt`, ~1,009,778 bytes (contains device telemetry; retain locally).
- App PID 1540 loads React Native/Hermes/Expo native modules from 19:16:05 onward, logcat `Choreographer: Skipped 114 frames` PID1540 at 19:16:07; `ReactNativeJS: Running "main"` at 19:16:16.584. Android also logs ANRs in com.android.systemui, com.google.android.gms.persistent, com.google.android.as while app starts, not equivalent to CasitaDex crash. These support contention/slow startup; first visible Home frame remains unmeasured.
- LT1 original accepted emulator-5580 restarted normally after disposable shutdown; boot_completed=1, its fixture state not cleared. No source, protected data, partitions, paid tools, commits or deployment modified.
- NEXT: analyze app startup trace and test GPU-enabled disposable AVD only; assess Android system service contention. For primary HDD performance use a load-correlated E: sample before attempting migration. Never claim SSD relocation fixes LT1 timeout.

## 2026-10-20 LT1 graphics A/B acceptance checkpoint
- Temporarily stopped accepted LT1 emulator-5580 via normal ADB `emu kill`, preserved its on-disk AVD. Launched ONLY disposable API35 emulator-5582 using runtime `-gpu host`, headless (no persistent config change), after boot_completed=1.
- Verified exact earlier transferred Development APK remained installed on disposable AVD. `adb am force-stop` then `am start -W` returned Status OK, LaunchState COLD, TotalTime 9536ms, WaitTime 9545ms. Second independent force-stop + cold launch Status OK, TotalTime 9144ms, WaitTime 9224ms. Prior SwiftShader/software-rendered isolated runs timed out ~14-20s. Supports graphics path as likely performance factor but initial render still ~9s and environment variation remains.
- `uiautomator dump` successful on disposable, ~18148-character accessibility hierarchy; contains Add Memory, Add Photo, Add Reminder, Memories, Photos, Reminders, Find. Confirms actual CasitaDex Home UI is exposed. Not visual screenshot or full accessibility auditory verification.
- Gracefully stopped disposable emulator-5582, restarted accepted LT1 `DesignsByFA_LT1_API35` emulator-5580; boot_completed=1 confirmed. Accepted fixture contents not modified; no source changes, permanent AVD settings changes, wipes, commits, pushes or deploys.
- Recommendation: use `-gpu host` on supported LT1 GPU for disposable QA, compare screenshot and graphics/fallback behavior, then perform instrumented navigation and frame metrics. Do not infer all startup issues fixed or claim production launch pass.

## 2026-10-20 reusable disposable GPU QA launcher
- Created LT1-only script `%LOCALAPPDATA%\Designs-by-FA\qa\lt1-launch-20261020\Start-Disposable-GpuQA.ps1`; Windows PowerShell parse validated.
- Launcher checks LT1 SDK, exact disposable AVD, port=5582, refuses if accepted emulator-5580 running or disposable port in use; starts disposable with `-gpu host -no-window -no-audio -no-snapshot-save`. Does NOT install APK, alter AVD settings, stop accepted emulator, or modify any source/fixture.
- Tested safety guard while accepted emulator-5580 running: expected refusal `Accepted emulator is running. Stop it manually only after preserving work.` Accepted emulator still responsive; no QA AVD started.
- Existing prior software-rendered app PID logs: libreactnative.so loaded 19:16:06.356, 114 app frames skipped at 19:16:07.372, libexpo-modules-core.so 19:16:10.083, ReactNativeJS Running main 19:16:16.584. This is native/JS initialization evidence, not yet a CPU profile. The host-GPU A/B has 9.54s and 9.14s successful cold launches.
- Future profiling: collect app PID logcat, Android FrameMetrics/JankStats or Perfetto trace in disposable run with host GPU; check first-frame and navigation timing; preserve accepted LT1 emulator and isolate staging. No commits/push/deploy.

## 2026-10-20 GPU first-frame profiling follow-up
- LT1-only Start-Disposable-GpuQA.ps1 safety guard initially refused while accepted 5580 was still transitioning offline; after confirmed full disconnect it launched disposable 5582 with host GPU, preserving original AVD.
- Disposable Android API35 boot_completed=1. Existing hash-verified Dev APK cold `am start -W`: Status OK, LaunchState COLD, TotalTime 10628ms, WaitTime 10933ms; ActivityTaskManager `Displayed com.designsbyfa.casitadex.dev/.MainActivity +10s628ms` confirms Android reported first activity display. `uiautomator dump`: Add Memory present, supporting visible Home content.
- Initial gfxinfo: 5 frames rendered, 3 janky (60%); frame percentiles 50th 600ms, 90th/95th/99th 800ms. Very small sample, NOT statistically representative. App PID skipped 46 and 36 frames in selected logs; system-ui PID skipped 219 etc. First-screen delay ~10.6s, further optimization required.
- Raw LT1 logcat `%LOCALAPPDATA%\Designs-by-FA\qa\lt1-launch-20261020\gpu-host-firstframe-logcat.txt` retained locally. Closed ONLY disposable emulator and restarted accepted LT1 5580, boot_completed=1; no protected data changes. No source changes, commits, push, deployments.
- Next: isolate native startup versus JS work with instrumented trace in disposable and profile repeat navigation only after ensuring source and fixtures preserved; avoid inferring app is fast merely because launch returned OK.
