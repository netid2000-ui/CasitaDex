# WORK-SB105 · Exact notification targets and safe recurrence

November 5, 2026 · FA-MAC-DEV-01 only · AI Commander · FA-Development external SSD.

**PARTIAL · Release NO-GO.** Started from clean authorized branch `work/cd-sb41-edit-targeting-20261104` at `4262059dbb45484951e59779bb164e98f695bd21`. Application commit `20a9393c5c89b046ee6397723a4938680a8ba947`.

## Working changes

Android notifications now retain the persisted source identity in package-local intent data. A linked reminder opens its exact Memory Details route; a standalone reminder opens only its matching reminder, with Show all reminders to return to the list. Different reminders no longer share one generic PendingIntent destination. Deleted or malformed targets fall back to the saved reminder list; no record is mutated by opening a link. Existing unsaved reminder editors remain intact.

Recurring completion now validates the next local date and time before the SQLite update. A daily or weekly 02:30 reminder advancing into a spring-forward gap shows actionable guidance and preserves the current occurrence. Editing to an existing wall time allows completion to proceed. The existing first-occurrence fall-back policy remains unchanged.

## Automated evidence

- TypeScript, ESLint and 25 focused reminder recurrence, notification projection, query parsing, draft, backup and restore tests passed. Job `5b0a18ae635c26da`, exit 0.
- One additional regression executes the native reminder persistence implementation against SQLite: rejected DST completion retains the exact row and emits no notification change; editing the time permits recurrence advancement; deletion removes the row. Job `08a99d5184d82ea1`, PASS.
- The installed query-string parser was exercised with spaces, Unicode, ampersands, literal percent escapes, slash/query/hash identifiers, repeated parameters and malformed percent encodings. This verifies bounded compatibility, not a vulnerability fix.
- Logs: `QA-Evidence/WORK-SB105/{typecheck,lint,focused-tests,sqlite-regression}.log`.

## Native provenance

Exact application source was archived into `QA-Evidence/WORK-SB105/android-current`. Gradle ARM64 development release-mode build passed in 1m17s, job `231a44cfb7fed793`. APK SHA-256 `e69f8c0a80a2a49d357e50f00438796909702feae39897d56eb93e7fc6f2bc68`. Lockfile SHA-256 `41f589351110c71dc95d05d90397dcdfd5091d30ed75fff8cb73ba76955fc30a`. Package `com.designsbyfa.casitadex.dev`; QA debug signing, not a store artifact.

Native tests used a new disposable Pixel 7 API35 AVD `fa_sb105_target_disposable_api35`, `emulator-5588`, and kept its synthetic data through retries. Existing app data and the historical reconciliation worktree were preserved. All builds, device work, files, Git and coordination ran exclusively on FA-MAC-DEV-01; no other host was dispatched.

| Actual check | Result and evidence |
| --- | --- |
| Linked memory Save and persisted reminder date; standalone Save and notification permission grant | PASS in `9298d9d95ab0f2fa`, with two native alarms. That job later failed its 09:25 delivery observation. |
| Exact SQLite title, note, date and time | PASS in `fcd75053fccbf042`; stopped app database plus WAL readback matched the synthetic fixture exactly. `android-target-resume/sqlite-exact-readback.json`. |
| Offline target route and force-stop/relaunch | PASS in `fcd75053fccbf042`; airplane mode and Wi-Fi disabled, exact standalone note retained. `offline-exact-target.png`. |
| Actual malformed and encoded missing deep links | Four PASS in `fcd75053fccbf042`: percent sign, incomplete UTF-8 escape, invalid hex escape and encoded missing identifier recovered to the saved reminders list without mutation. |
| Actual existing percent-encoded identifier | PASS in `107e55ae424e842f` and final `aed5beaeda11570d`; each UTF-8 byte of the persisted ID was percent-encoded and the exact reminder reopened. |
| Actual standalone notification delivery and target | PASS bounded step in `fcd75053fccbf042`: after the disposable clock advanced to 10:15, a real notification tap opened the exact standalone source. The job later failed a bare-title lookup for a linked control whose accessible name includes its date. |
| Show all reminders | PASS from saved UI hierarchy and final `aed5beaeda11570d`; linked and standalone rows return to the ordinary list. |
| Standalone completion and native cancellation | PASS in final `aed5beaeda11570d`: Mark Complete displayed Completed and reduced pending alarms to one remaining linked alarm. |
| Actual linked notification delivery and exact destination | PASS in final `aed5beaeda11570d`: notification tap opened Memory Details with `SB105 Linked Target` and exact answer `SB105 exact linked answer`. `android-linked-final/linked-readback.json`. |

Final native job `aed5beaeda11570d` exited 0 in 55 seconds. Earlier overall jobs remain FAILED: first attempt was covered by a disposable Pixel Launcher ANR; the retry observed no standalone notification at 09:25; the resumed run failed a label lookup after its passing standalone checks; the first linked continuation tapped a newly rescheduled standalone alert after a synthetic clock rewind. The final driver completed the standalone occurrence first and verified that only the linked alarm remained. No failed job is reported as an overall pass.

The tests advanced only the disposable AVD clock. Captured inexact windows were approximately 21m42s for the standalone alarm and one hour for the future linked alarm. Passing delivery at 10:15 is not a normal-clock punctuality guarantee. Current native DST-error UI, edited reschedule, permission Settings recovery and reboot-before-launch acceptance remain open.

QA signer SHA-256 `fac61745dc0903786fb9ede62a962b399f7348f0bb6f899b8332667591033b9c`; version 0.1.0 (1), target SDK36. Raw logs/screenshots/driver scripts remain on the external SSD under `QA-Evidence/WORK-SB105`. The committed `SB105_EVIDENCE_MANIFEST.json` records hashes without copying raw device databases into Git.

## Dependency and design boundaries

No decode-uri-component override was applied. Security-lane compatibility probes found that 0.3.0 remains vulnerable and 0.4.0, 0.4.1 and 0.5.1 break installed query-string7.1.3. Registry inspection shows expo-router57.0.29 retains query-string^7.1.3; router58.0.30 no longer lists it. Evaluate the supported SDK58/router58 migration together, then repeat native links and full compatibility acceptance. This is a candidate path, not a verified upgrade.

Reviewed [Expo Router SDK57 API](https://docs.expo.dev/versions/v57.0.0/sdk/router.md) for decoded local parameters and route updates. Existing Figma Reminders `39uzN0SZX8nlmcGDcHdQhr` node `276:3` and Details `257:2` / `257:25` remain design references. The new notification selection state needs canvas reconciliation and assistive acceptance.

## Open release gates

iOS notification response routing remains unimplemented/unverified; its current delegate presents foreground alerts only. Current iOS native acceptance is blocked by the shared toolchain issue. Permission Settings recovery, current-source edited reschedule and reboot-before-launch, native DST validation, photos/media/backup restore, VoiceOver/TalkBack, responsive states, dependency remediation, signed distribution and owner physical-iPhone acceptance remain open. No production actions, store submissions, purchases, billing changes or other-host jobs were performed.
