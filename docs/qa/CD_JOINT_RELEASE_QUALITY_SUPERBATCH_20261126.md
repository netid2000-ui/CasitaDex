# CasitaDex — joint ChatGPT / Claude release-quality superbatch

**Owner authorization:** November 26, 2026 (America/Chicago): all eight steps, including the Free cap correction; both platforms, Figma and GitHub. This supersedes the proposal-only status of [the joint recommendation](CD_BUILD5_CLAUDE_JOINT_RECOMMENDATION_20261126.md). No subscription, live purchase, production configuration, release merge, store publication or owner device wipe was performed. Claude provided the independent review and agreed with ChatGPT on the reconciled policy; native verification and code/design execution described below were performed by ChatGPT on the approved Mac mini only, not by Claude independently running the binaries.

**Baseline:** `9cddf31c1298fff7c4a87b26304bc498d4be12f4` (accepted Build 5 QA branch and joint consensus); fresh isolated worktree, no replacement of earlier owner-accepted installations. 
**Build 6 source:** `8013c33c7fe8c65833721a0afceb85dac7b5b7bc`, tree `3d7099fed5bc313fdd05f56b2ddb1d6da45bb229`.
**Build 7 source:** `4c6df816f237b63740229983b0c94c4870dc9861` (additional accessibility correction from Build 6 native testing, independent regression fixtures).
**Branch:** `work/cd-joint-release-quality-20261126`.
**Native QA application ID:** `com.designsbyfa.casitadex.platformqa`; deliberate isolated Free limit without a real store purchase, no fabricated Plus entitlement. The QA identity allows full-backup testing independently of production Free entitlement, which remains restricted. No backend/mandatory cloud account.
**Release disposition:** NO-GO pending hardware/store/privacy/scale gates below. Build 6 was built and installed on the Mac mini's iOS simulator and Android emulator, and installed in-place on connected physical Samsung. Build 7 was then built and installed on both virtual devices and physical Samsung; exact-source native evidence is appended below.

## 1. Historical upgrade and baseline regression — partial, with verified native continuity

- Android emulator and iOS simulator Build 5→6 installed over existing app data without reset. Native Find opened the prior synthetic FA Platform Filter 20x25x1 memory and prior photo viewer on both; individual JUnit and screenshots in build6 evidence.
- Physical Galaxy A16 5G previous QA Build 1→6 installed in place, existing synthetic memory reachable; no owner installation/data deleted.
- Prior native Build 4 synthetic full archive fixture is read through the compatible archive reader, original photo bytes matched, historical snapshot upgraded with injected interruption in initial SQL transaction, rollback and successful retry/reopen. The preserved fixture contains only synthetic QA data. Previous upgrade regression coverage remains green.
- Outstanding: historical populated native Build 3/4 database with drafts, linked reminders, and interrupted native process restart at each migration phase. Fixture-level rollback is not physical process interruption.

## 2. Accessibility and full journeys — partial, maximum-text defect corrected and native verified

- Build 6 Android emulator at system font scale 2.0, light and dark: count notice, Add name/Description, Cancel, Backup status reached; JUnit both passed. Original font and appearance restored after tests.
- Build 6 iOS at maximum Dynamic Type: Home reached after scroll-aware automation correction, but the Free limit notice pinned inside the sticky toolbar occupied the viewport and prevented navigation to the required Name field. The screenshot `ios-max-text-failure-small.png` is real evidence of a release-blocking defect, not a selector-only failure. Initial Add Memory selector issue was also corrected; failed receipts retained.
- Build 7 source places count, copy, Plus action and status into scrollable content; Cancel/Save remain pinned and stack when font scale >=1.7 or narrow width. Added a targeted structural regression ensuring the notice is not in the sticky toolbar. Figma already put notice inside content; updated toolbar/content labels to explicitly document largest-text stacking.
- Android TalkBack service was enabled and bound, scoped focus attempts made, then previous system accessibility settings restored. This proves the service was available, not full spoken traversal or activation. VoiceOver and TalkBack full real traversal, keyboard/return routes across all screens, bold text and physical accessibility remain release gates.
- Build 7 maximum text **passed all four native runs** (iOS maximum accessibility Dynamic Type and Android 2.0, both light and dark): scrollable notice, Name and Description, Cancel, Backup status. The iOS dark screenshot confirms the stacked toolbar and scrollable form. No broad redesign.

## 3. Storage pressure and retrieval scale — partial, measured

- Inject zero available space for ordinary save and photo capture: preserve previous collection, draft and original photos, no orphan introduced; retry after capacity is restored. This is a bounded store/adapter fault injection on Mac, not a native device ENOSPC. No physical volume filled or owner data endangered.
- Mac Node synthetic metadata benchmark, not mobile UI or actual 10,000 photo byte files:
  - 100 memories / 200 photo metadata records: index 1 ms, query 1 ms, gallery list 4 ms, heap approximately 12 MB.
  - 5,000 memories / 10,000 photo metadata records: index 8 ms, query 4 ms, gallery list 3 ms, heap approximately 26 MB.
- Benchmarks are single-run timings, not a final mobile performance claim. Native cap fixture includes 21 memories (20 counted + 1 deleted), one original photo and one linked reminder; both platform native import review and restore proved. Build 7 then restored 100 synthetic inventory records with 17 valid 9.45 MB original PNGs and one linked reminder on each native platform. Archive 160,737,379 bytes; both native retrieval tests passed, 100 results and photo viewer rendering. Android emulator snapshot after large-photo retrieval: TOTAL PSS 279,996 KB, RSS 248,876 KB, swap PSS 103,978 KB (single device/tool snapshot, not a performance guarantee). Native isolated device ENOSPC, representative real-household variety, 5,000-record UI scrolling/thumbnail latency and sustained performance remain open.

## 4. Store safeguards and privacy — partial

- Prior entitlement regressions for Free, Plus, unknown, cancellation, refunds/revocations and retry remain green. Native Swift policy check passed eight assertions; debug and release StoreKit local configuration/checkout contract assertions passed. These are local policy/config tests, not actual sandbox purchases, reinstalls or real refund evidence.
- Checked dependency/source inventory, merged Android manifest and QA config. Android allowBackup=false; network, billings, notification and SDK permissions are listed in the inventory; app is local-first, not a guarantee of no network traffic. Built iOS QA application includes 12 privacy manifests; exported manifest data, required-reason API arrays, identity fields and permission purpose strings are in `ios-compiled-privacy.json`. Build 7 Android emulator actual airplane mode enabled, Wi-Fi disabled (recorded 1/0), and native Find/Photo Viewer passed after in-place upgrade; settings restored. Shipping production configuration and actual runtime network/disclosure verification remain pending; offline success is not a zero-network claim. Do not publish App Store or Play data-safety statements from this QA inventory alone.
- Real Apple/Google sandbox purchase/restore/refund/revoke and offline/reinstall scenarios remain gates; QA identity intentionally does not purchase. No production purchase or submission.

## 5. Monetization correction and safe data exit — implemented, core cases tested

| Rule | Implementation / evidence |
|---|---|
| Free limit 20 | Active + archived saved memories count; Recently Deleted and unfinished drafts do not. Visible count and instructions. |
| 19→20 / 20 / 21 | Automated cap/restore/over-cap boundary tests, including bulk restore atomic rollback and verified Plus bypass. At cap both platform native tests showed blocking and read-only sharing; delete one→19, then restore→20 succeeded on both. |
| Over-cap/refund | Keep legitimate existing records editable/readable/exportable, even after downgrade or legitimate full backup restore. No further new save/restore into counted collection until below cap or verified Plus. |
| Archive | Counts just like active; unarchive does not free or consume another slot. |
| Trash | Recoverable; no automatic purge/downsizing or forced removal. Share screen available from read-only trash; includes name/description by default, selected original photo sharing supported through existing controls. No external contact/share dispatch was performed. |
| Free data exit | Existing readable text report and individual selected-photo share retained; neither is a restorable full backup. |
| Plus | Unlimited memories, full local photo/draft/reminder backup, recovery and transfer; US$25.99 one-time plan unchanged. No subscription or sharing tier. |

Native cap fixture was verified by hash, restored from real OS file pickers on both virtual devices, then tested. Source domain tests cover denied writes without deleting prior data, count rules, queued mutations, and over-cap restoration preservation. The Android and iOS test flow selector retries are separately retained; corrected native flows passed. No silent deletion, no automatic cloud sync. Actual store price/currency and purchase identity remain sandbox/store verification gates.
 
## 6. Honest backup status — implemented and native verified

- Persist last verified local backup date only after successful local archive readback; iOS share sheet opening, dismissal or external delivery are not treated as proof of destination. No fabricated external-delivery status; Android verified provider readback.
- iOS simulator native local archive and save/share sheet exercised; timestamp displayed. External copy/readback in actual iPhone Files not verified.
- Physical Samsung QA local-folder backup to a dedicated synthetic QA folder, verified and pulled 720-byte v4 full archive: SHA256 `65ed4e43a24979e03efc32bd26d116a15e11e3b61125df163299205eb136ea3f`, one synthetic memory, no photos/reminders at time of backup. Native picker review and restore succeeded with original memory preserved. Screenshots recorded. Per-owner local data model retained.
- Build 7: Android emulator exported a 160,737,380-byte v4 backup to dedicated native Documents folder, app verified it, copied to Mac, then independently streamed/verified every original hash, 100 memories and linked reminder. The same exported file was copied to physical Samsung, reviewed, restored, and actual photo/reminder verified. Samsung pre-test synthetic state (1 memory and 1 reminder) first separately backed up/verified then restored at the end. Android folder cancellation returned honest canceled status with unchanged verification timestamp and retained 100 results; initial Back only navigated up one folder, corrected using successive Back and JUnit readback. iOS simulator created 160,737,380-byte private verified backup; independently verified all 17 photo hashes, 100 memories and linked reminder; Save to Files action returned to app but a second external file could not be confirmed. Native iPhone Files destination and provider failure/backgrounding remain open. The 170 MB file-backed streaming/independent database restore domain regression also passed. No automated cloud integration or misleading backup claim.

## 7. Native device verification — partial

| Device | Build 6 result (Build 7 exact final evidence below) |
|---|---|
| iOS simulator (Mac mini) | Native Release simulator compilation succeeded; Build 5 upgrade, import, 20/19 count, blocked trash and read-only sharing, restore, local-backup status; maximum-text failure fixed in Build 7 source. |
| Android emulator (Mac mini) | Native release APK compiled; same upgrade/cap/import/restore; maximum font light/dark passed. |
| Samsung Galaxy A16 5G | In-place QA upgrade, exact app-scoped Home/Photos/Reminders/Find navigation, count and Cancel, real local-folder verified backup/readback and restore. Native physical notification scheduled 22:35 CST Nov 26; Android granted a +2m45s inexact window. At 22:38 observed actual delivered QA notification while app was backgrounded; tapping exact title CD6%20Synthetic%20Reminder opened its Edit Reminder with date/time. Do not claim exact-to-minute alerts. |
| Owner iPhone | Not available via connected-device service. Physical beta, Files archive, lifecycle reminder behavior and final owner acceptance NOT tested or waived. |

Physical Samsung automation initial Maestro runs targeted system Home; package-filtered UI verification corrected that harness issue and passed app navigation. Synthetic notification title contains literal %20 due to ADB text entry; delivery and destination matched exactly. Receipt intentionally excludes unrelated notification data. Permission denial, reboot, timezone/DST, repeat and restore reminders in full native lifecycle still require separate evidence; no force-stop promise.

## 8. Figma reconciliation and evidence — reconciled changed scope

Authoritative [Figma master](https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr/CasitaDex?node-id=398-2) only. Accepted launch plan board [355:3](https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr/CasitaDex?node-id=355-3); plan copy IDs 355:11, 355:12, 355:13, 355:34, 355:38.
- Add 19/20 variants both themes: 1688:861, 1688:911, 1688:961, 1688:1011. Count is within scrollable form; persistent Cancel/Save only, stack at largest text.
- Restore-at-cap light/dark: 1688:1061, 1688:1070; read-only trash Share: 1493:65, 1493:160, 1688:1088, 1688:1090.
- Verified backup timestamp both themes: 1689:861, 1689:891; backup entry/copy IDs 487:102, 875:6, 1686:90, 1686:122, 1632:1491, 1632:1521.
- Privacy/storage count 1434:26, 1434:42; trash/Find copy 523:45, 1003:37, 636:160, 575:17, 636:202, 1086:245; share copy 478:11, 1079:74.
- Visual render receipts for dark at-cap, light blocked, dark verified backup and launch board in evidence. Do not claim a fresh pixel-by-pixel reconciliation of all untouched flows. Accepted Home, Photos, Reminders, Find order unchanged.

## Evidence index

- [Build 6 native JUnit, screenshots, build identities, privacy inventories and sanitized physical reminder receipt](evidence/cd-joint-release-quality-20261126/build6/). Each report reflects the exact build indicated; prior failure receipts preserved.
- [Reproducible native flow slices](../../.maestro/joint-release-20261126/); several native picker and confirmation flows intentionally start from previously prepared QA state.
- [Synthetic historical migration / storage / scale / accessibility regression](../../tests/cd-joint-release-quality.test.mjs). [Cap fixture generator](../../scripts/cd-build6-fixture.mjs).
- Raw build logs, complete non-published native evidence, generated artifacts, and QA working storage on authoritative external FA-Development SSD, QA-Evidence/cd-joint-release-quality-20261126.
- Build 6 baseline 565 tests total, 564 pass, 0 fail, 1 existing skip; extended domain 568 total, 567 pass, 0 fail, 1 existing skip; Build 7 source 569 total, 568 pass, 0 fail, 1 existing skip; typecheck/lint passed prior to native rebuild. Generated symlink caused an intermediate typecheck heap failure; removing the task-created redundant symlink restored clean typecheck with no source relaxation.

## Final Build 7 native verification — exact correction tested

Source commit 4c6df816f237b63740229983b0c94c4870dc9861; Android APK SHA256 d773a57877bc44fb3346d285a081b800d7531f1988fe9f9c03c54dd7da6d3d62; iOS installed executable SHA256 39eba7ed476992a92ae94d1f8a5e87f98fc2aaa71dd5101f71341c271cd07c85; JS bundle SHA256 ca2c43f4e4be6fc1d322662584655d911d699009af42b488a402ddfb6be80372. Both native compilation statuses zero. Prebuild initially cleared Android local.properties; re-applied the known SDK location and rebuilt successfully. No source workaround or production flag changes. All installed version 7 in separate QA identity; no clearState or owner-device wipe. iOS simulator booted and tested through actual simulator native controls, but the Simulator desktop app bundle was not available to bring its window forward; do not claim the desktop window was visible.

| Verification | Result |
|---|---|
| Android emulator font scale 2.0 light and dark | Both PASS (26 s each) |
| iOS simulator accessibility-extra-extra-extra-large light and dark | Both PASS (1m 2s each), forms reachable after scrolling, sticky actions stacked |
| Android real airplane mode, Wi-Fi disabled | PASS native Find and photo viewer; settings restored |
| Android 100 memories / 17 valid originals / 160 MB native fixture | PASS import, 100-result search, actual photo decode (25 s import, 24 s retrieval) |
| iOS 100 memories / 17 valid originals / 160 MB native fixture | PASS native import (31 s) and retrieval (23 s); initial native Files text selector selected wrong/ineffective target; coordinate scoped to observed file fixed harness. |
| Android native large backup export | PASS native folder save + app verification + independent exported file verification on Mac (all 17 original hashes, linked reminder) |
| Android native large backup cancel | PASS after exiting folder picker fully; preserved timestamp and 100 results |
| iOS large local backup | PASS native private verified archive, 160,737,380 bytes, independent Mac readback of all hashes and linked reminder. Save to Files action passed but external destination not confirmed; remains NO-GO. |
| Physical Samsung version 7 | PASS in-place upgrade preserved existing QA memory and overdue reminder. Physical restored off-device 160 MB Android-emulator export; 100 results, Photo 1 of 1 and linked reminder visible. Original synthetic 1-memory/1-reminder state backed up before transfer, fully restored and rechecked afterward. |
| Physical owner iPhone | Unavailable from Mac connected-device service; NOT tested. |

Fixture archive SHA256 11953e25fce02917fbd8b0354b99ae08b8343fd6c5a70176f86273a8b4398d2e; Android native exported archive SHA256 8445ab1899f32c90f0298fcac2ef0a62e2af6ed2616341a9816d52aa6d632c66; iOS private native archive SHA256 72aa60fce2a805bcd09653f95ffc015e285581a417b7281fd22b5da2cd18f058. Original media SHA256 90d47c47bde9e990a41ddee0b198deae694d43f4c72e4ff0fdec4742261242a1 for each of the 17 synthetic valid PNG copies; no actual personal data. Do not publish large binary fixtures or raw native logs. Evidence includes [Build 7 report artifacts](evidence/cd-joint-release-quality-20261126/build7/), [large fixture generator](../../scripts/cd-build7-large-fixture.mjs), and [export validator](../../scripts/cd-verify-synthetic-large-backup.mjs). The exact application source was not changed by adding QA-only scripts and evidence after the builds.

### Remaining release gates

1. Real owner iPhone acceptance and external Files copy/readback, real StoreKit/Play sandbox purchase/restore/refund/offline/reinstall.
2. Full VoiceOver/TalkBack activation/traversal, bold, keyboard/navigation sweep, physical accessibility, native reminder reboot/timezone/DST/denial/restore lifecycle.
3. Native disposable ENOSPC capture, provider interruption/backgrounding, complete historical native migration/restart and 5,000-record/10,000-photo UI scale on lower-resource devices.
4. Shipping binary privacy/data-safety disclosures backed by runtime traffic and actual entitlement configuration, not QA settings.

Final status: approved monetization and honest backup changes implemented and tested; Figma reconciled for changed scope; both native QA platforms and Samsung verified at Build 7. Physical iPhone, store, privacy and remaining release gates still open. No release merge or live store action.

## Release decision

Owner approved this implementation superbatch, not production launch. Hold release until independent physical iPhone acceptance, real store sandbox tests and privacy disclosures, physical iPhone external Files backup, native low-storage/full-scale and full accessibility/notification lifecycle gates are completed. No blanket waiver of missing evidence. This report records what was actually tested and what was not.
