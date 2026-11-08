# CasitaDex current visual baseline and Android/iOS acceptance handoff

Date: 2026-11-08 UTC. **The owner-confirmed four-tab screenshots are the visual authority for this continuation.** Release remains NO-GO.

## Owner-confirmed interface

- Keep the approved bottom navigation exactly **Home, Photos, Reminders, Find**.
- The confirmed visual language is the calm, spacious cream/white/forest-green layout with the horizontal CasitaDex wordmark, restrained action cards, and Home actions **Find a Memory**, **Add Memory**, **Add Photo Memory**, **Add Reminder**.
- The owner-confirmed screenshots are the comparison baseline. Do not substitute five-tab builds, older review frames, or an isolated QA screen as a new design direction.
- The current SB40 simulator builds visibly match the confirmed Home composition and four-tab order on iOS and Android. This is a **bounded visual check**, not page-by-page acceptance: secondary routes and complete functional journeys were not retested in this run.

## Installed visual-check builds (Mac mini)

These are QA artifacts, not release builds. The two platform artifacts are from an isolated SB40 simulator workspace, not a single Git commit; keep their provenance separate from the authorized feature branch.

| Platform/device | Installed identity | Verified fingerprint | Bounded result |
| --- | --- | --- | --- |
| iOS simulator `AD06A0B7-D723-4EE9-829C-03508DD1107B` (CasitaDex SB38 iPhone) | `com.designsbyfa.casitadex.sb40qa`, version 0.1.0 (1) | executable SHA-256 `8ad89040f3a092c4a57b1d4bf7747a55e1afdd19cfa264f0b3fe136c02ba9b4d`; embedded JS SHA-256 `83326efc8d67c50748539becbe4f4f306e70efa233e8e3d44a5249260f9fb7aa` | Home and four-tab navigation visually present; no full route/workflow retest |
| Android emulator `emulator-5554` | `com.designsbyfa.casitadex.sb40qa`, version code 1 | installed APK SHA-256 `01e40085176127b815b0870fabbd4d915f463acdea5d8d4e0eb830871467d3bf` | Android QA seed startup failure fixed in isolated workspace by supplying fixture bytes directly; Home and four-tab navigation visibly present; no full route/workflow retest |

The isolated workspace is `/Volumes/FA-Development/Designs-by-FA/Development/CasitaDex/sb40-simulator-parity-20261108`; it is not a Git checkout. Its Home entry source SHA-256 is `ca7c2e900dc213525e00bc0ad3ba22f8b206171758c1dc751eefe3511917d0b0`. The asset-fixture correction is QA-startup-specific. Do not blindly port it into the authorized branch: that branch uses `src/app/index.tsx` re-exporting `EngHome`, not the isolated SB40 `FigmaNativeHome` entry implementation.

## Reuse this evidence; do not rerun without a gate reason

| Area | Existing exact-artifact evidence | Reuse limits / remaining work |
| --- | --- | --- |
| Source, design, navigation | `SB121_CURRENT_HOME_RECONCILIATION_MANIFEST.json`; `WORK_SB121_CURRENT_HOME_RECONCILIATION.md` | Source/tests establish the four-tab order and Home mapping. The Nov 8 SB40 check adds native Home visual confirmation. Neither proves all pages match screenshots. |
| Android restore | `SB121_ANDROID_NATIVE_RESTORE_OFFLINE_20261106.md` and its manifest | Actual native Full v4 restore passed on `bb235cdf…`; preserve its attribution. Do not repeat unless source/data/restore behavior changes or a defined release gate requires it. |
| Android preserving upgrade and strict OS-offline | Same report | Passed on exact `5dc930e…` APK `1d7ebf35cf1e90c5d0df8952bf4ad845bcdb8778c26ee6965fc7ef47e2a9706e`; state/media preserved and radio restoration verified. Not an SB40 build claim. |
| Android validation feedback | `SB121_ANDROID_7A3_VALIDATION_NATIVE_20261106.json` | Bounded normal/app-Large validation PASS on `7a3d78f…`; preserve exact attribution. No OS-maximum or complete accessibility claim. |
| Android newer native milestone | `SB121_CURRENT_8CC_NATIVE_MILESTONE_20261106.md` and current acceptance ledger | Current bounded 8cc upgrade/smoke/two-photo/relaunch outcomes are recorded. Historical bb235 restore and 5dc offline results stay separate. |
| iOS validation/accessibility | `SB121_IOS_7FA_VALIDATION_NATIVE_20261106.json`; `SB121_CURRENT_NATIVE_ACCEPTANCE_LEDGER_20261106.json` | Bounded validation and selected enlarged-text reachability passed on the recorded runtime. Broad practical readability, full VoiceOver/TalkBack speech traversal, and some maximum-size hold/refocus limits remain open. |
| iOS linked reminders | `SB121_LINKED_0900_MILESTONE_20261106.md` | Three linked alerts delivered and reached their intended records on exact `a8867c0…`; this does not establish every later runtime. A separate current C88 delivered fixture remains protected and its recovery tap is NOT_CONFIRMED; do not duplicate taps, reschedule, alter clock, or change C88 data. Coordinate one retry owner only if a specific current-build gate calls for it. |
| iOS import/previous-save recovery | `SB121_IOS_ISOLATED_IMPORT_RECOVERY_20261107.json` and `SB121_CURRENT_NATIVE_ACCEPTANCE_20261106.md` | Bounded PASS on isolated `c2cc335`; original `7fa012a` state and reminder preserved. Strict iOS offline and complete VoiceOver remain NOT_RUN. |
| iOS maximum backup feedback | `SB121_IOS_MAXIMUM_BACKUP_FEEDBACK_20261107.json` | Safe damaged-backup message is reachable by scrolling at maximum text on isolated candidate. This is not a complete accessibility or release pass. |

The ledger currently labels the work a verified partial milestone and release **NO-GO**. Historical tests remain tied to their original builds; never roll results forward based only on source similarity or a matching branch name.

## Live devices and safe cleanup rule

Inventory at 2026-11-08 UTC:

- Booted iOS CasitaDex: `AD06A0B7-D723-4EE9-829C-03508DD1107B`; keep available for the current visual reference.
- Booted iOS Event Command: `B7308CC8-3494-42A9-9099-FF82FC9DEAD6`; `com.designsbyfa.eventcommand` is foregrounded. Do not repurpose it during CasitaDex work.
- Booted Android emulator: `emulator-5554`; `com.designsbyfa.casitadex.sb40qa` is foregrounded. Other installed QA package IDs are not evidence of running processes; do not uninstall them to reduce simulator clutter.
- Protected C88 notification device `C88DEF5E-63F3-426C-9B50-8CF131C3C58F` is currently **Shutdown**; its delivered fixture and data must remain untouched.
- Many named historical simulators are already **Shutdown**. A shutdown device is a retained simulator record/data image, not a running “dead” process. It uses no active simulator runtime; it may use disk. Keep it until its evidence/data retention need is reviewed.
- One Mobilewright Event Command QA job is still listed as running against disposable device `90F8D88C-BBF1-45FA-AF79-476A3134475B`, although that simulator is shutdown. Do not stop shared Mobilewright services. Check its owner/job state before reusing that device.
- The physical Samsung is connected and has the CasitaDex Development app foregrounded. Leave it untouched until required simulator gates are complete.

For an unused **booted** device, graceful `simctl shutdown <UDID>` / emulator shutdown releases runtime resources and preserves app data. Do not use `simctl erase`, delete simulator records, uninstall apps, reset app containers, or clear app data as “cleanup.” Only remove a retained simulator after its owner confirms it is disposable and its evidence/data is backed up or no longer needed.

## Authorized source checkpoint and next actions

- Authorized worktree: `/Volumes/FA-Development/Designs-by-FA/Development/CasitaDex/app`, branch `work/cd-sb41-edit-targeting-20261104`, source HEAD `d6c415223f2cc4cb269e7a3d2a862071a67485d3` at inspection; worktree was clean before this handoff.
- Do not replace the owner-confirmed screenshots with a different navigation or Home concept.
- First reconcile the screenshot baseline against each approved Figma master and current installed iOS/Android screens. Record page-by-page gaps; do not retest already attributed functional workflows.
- Continue only unproven/changed gates: exact current-branch native build provenance, secondary-page visual/interaction comparison, unresolved current iOS reminder route, strict iOS offline, practical screen-reader/accessibility acceptance, dependency/security disposition, signing and release qualification.
- Maintain one heavy native build lane on FA-MAC-DEV-01. Preserve app data, report exact source/artifact fingerprints, and keep release NO-GO until remaining gates pass.
