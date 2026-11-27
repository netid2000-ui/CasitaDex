# CasitaDex — joint ChatGPT / Claude release-quality superbatch

**Owner authorization:** November 26, 2026 (America/Chicago): all eight steps, including the Free cap correction; both platforms, Figma and GitHub. This supersedes the proposal-only status of [the joint recommendation](CD_BUILD5_CLAUDE_JOINT_RECOMMENDATION_20261126.md). No subscription, live purchase, production configuration, release merge, store publication or owner device wipe was performed. Claude provided the independent review and agreed with ChatGPT on the reconciled policy; native verification and code/design execution described below were performed by ChatGPT on the approved Mac mini only, not by Claude independently running the binaries.

**Baseline:** `9cddf31c1298fff7c4a87b26304bc498d4be12f4` (accepted Build 5 QA branch and joint consensus); fresh isolated worktree, no replacement of earlier owner-accepted installations. 
**Build 6 source:** `8013c33c7fe8c65833721a0afceb85dac7b5b7bc`, tree `3d7099fed5bc313fdd05f56b2ddb1d6da45bb229`.
**Build 7 source:** `4c6df816f237b63740229983b0c94c4870dc9861` (additional accessibility correction from Build 6 native testing, independent regression fixtures).
**Branch:** `work/cd-joint-release-quality-20261126`.
**Native QA application ID:** `com.designsbyfa.casitadex.platformqa`; deliberate isolated Free limit without a real store purchase, no fabricated Plus entitlement. The QA identity allows full-backup testing independently of production Free entitlement, which remains restricted. No backend/mandatory cloud account.
**Release disposition:** NO-GO pending hardware/store/privacy/scale gates below. Build 6 was built and installed on the Mac mini's iOS simulator and Android emulator, and installed in-place on connected physical Samsung. Build 7 native evidence is appended separately below.

## 1. Historical upgrade and baseline regression — partial, with verified native continuity

- Android emulator and iOS simulator Build 5→6 installed over existing app data without reset. Native Find opened the prior synthetic FA Platform Filter 20x25x1 memory and prior photo viewer on both; individual JUnit and screenshots in build6 evidence.
- Physical Galaxy A16 5G previous QA Build 1→6 installed in place, existing synthetic memory reachable; no owner installation/data deleted.
- Prior native Build 4 synthetic full archive fixture is read through the compatible archive reader, original photo bytes matched, historical snapshot upgraded with injected interruption in initial SQL transaction, rollback and successful retry/reopen. The preserved fixture contains only synthetic QA data. Previous upgrade regression coverage remains green.
- Outstanding: historical populated native Build 3/4 database with drafts, linked reminders, and interrupted native process restart at each migration phase. Fixture-level rollback is not physical process interruption.

## 2. Accessibility and full journeys — partial, defect corrected in source

- Build 6 Android emulator at system font scale 2.0, light and dark: count notice, Add name/Description, Cancel, Backup status reached; JUnit both passed. Original font and appearance restored after tests.
- Build 6 iOS at maximum Dynamic Type: Home reached after scroll-aware automation correction, but the Free limit notice pinned inside the sticky toolbar occupied the viewport and prevented navigation to the required Name field. The screenshot `ios-max-text-failure-small.png` is real evidence of a release-blocking defect, not a selector-only failure. Initial Add Memory selector issue was also corrected; failed receipts retained.
- Build 7 source places count, copy, Plus action and status into scrollable content; Cancel/Save remain pinned and stack when font scale >=1.7 or narrow width. Added a targeted structural regression ensuring the notice is not in the sticky toolbar. Figma already put notice inside content; updated toolbar/content labels to explicitly document largest-text stacking.
- Android TalkBack service was enabled and bound, scoped focus attempts made, then previous system accessibility settings restored. This proves the service was available, not full spoken traversal or activation. VoiceOver and TalkBack full real traversal, keyboard/return routes across all screens, bold text and physical accessibility remain release gates.
- Native regression for Build 7 noted below; no broad redesign.

## 3. Storage pressure and retrieval scale — partial, measured

- Inject zero available space for ordinary save and photo capture: preserve previous collection, draft and original photos, no orphan introduced; retry after capacity is restored. This is a bounded store/adapter fault injection on Mac, not a native device ENOSPC. No physical volume filled or owner data endangered.
- Mac Node synthetic metadata benchmark, not mobile UI or actual 10,000 photo byte files:
  - 100 memories / 200 photo metadata records: index 1 ms, query 1 ms, gallery list 4 ms, heap approximately 12 MB.
  - 5,000 memories / 10,000 photo metadata records: index 8 ms, query 4 ms, gallery list 3 ms, heap approximately 26 MB.
- Benchmarks are single-run timings, not a final mobile performance claim. Native cap fixture includes 21 memories (20 counted + 1 deleted), one original photo and one linked reminder; both platform native import review and restore proved. Native isolated device low-storage pressure, 50–100 real representative records, full 5,000 record scrolling/thumbnail latency, large archive at least 150 MB remain open.

## 4. Store safeguards and privacy — partial

- Prior entitlement regressions for Free, Plus, unknown, cancellation, refunds/revocations and retry remain green. Native Swift policy check passed eight assertions; debug and release StoreKit local configuration/checkout contract assertions passed. These are local policy/config tests, not actual sandbox purchases, reinstalls or real refund evidence.
- Checked dependency/source inventory, merged Android manifest and QA config. Android allowBackup=false; network, billings, notification and SDK permissions are listed in the inventory; app is local-first, not a guarantee of no network traffic. Built iOS QA application includes 12 privacy manifests; exported manifest data, required-reason API arrays, identity fields and permission purpose strings are in `ios-compiled-privacy.json`. Shipping production configuration and actual runtime network/disclosure verification remain pending. Do not publish App Store or Play data-safety statements from this QA inventory alone.
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
- Large 150 MB archive, provider failures/cancel, independent off-device recovery and physical iPhone still open. No automated cloud integration or misleading backup claim.

## 7. Native device verification — partial

| Device | Build 6 result |
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

## Final Build 7 native verification

Native Build 7 rebuild is in progress; this section will be updated with exact artifacts and results.

## Release decision

Owner approved this implementation superbatch, not production launch. Hold release until independent physical iPhone acceptance, real store sandbox tests and privacy disclosures, external large backup/restore, actual native low-storage/mobile-scale and full accessibility/notification lifecycle gates are completed. No blanket waiver of missing evidence. This report records what was actually tested and what was not.
