# Verified keyboard milestones — November 6, 2026

Subsequent bounded archive update: [the five opt-in cases passed with a fresh native bb235cd Android Full v4 export](SB121_CURRENT_NATIVE_ARCHIVE_20261106.md). The historical full-suite skips below are unchanged; actual app restore remains untested.

This publishes completed source/build milestones and the bounded Android keyboard acceptance below, **not full native acceptance or release approval**. Private QA receipts remain outside this repository. No device identifiers, personal data, raw logs or binaries are included.

## Reviewed source milestones

- d59bf8d684e564b1f4e6c036e3e0e53398eae9e0: Android-only fullscreen-keyboard prevention on shared Field. Independently reviewed. Full gate: **550 tests, 545 passed, 5 skipped, 0 failed**, typecheck and lint passed. Two expected baseline regression failures became passing checks.
- bb235cdf6f2bba63b1760038a379a2c09cdf32ab: native keyboard padding with current top safe-area offset and bounded action/content clipping. Independently reviewed. Full gate: **557 tests, 552 passed, 5 skipped, 0 failed**, typecheck and lint passed. Seven new component checks produced six expected baseline failures; focused candidate checks passed **45/45**.

The five skipped tests are opt-in real-archive cases: embedded-photo verification, corruption rejection, restore/recovery, nonmutating cancellation and stale reminder-review rejection. They were not executed in these gates. Historical archive results do not certify these artifacts.

## Exact Android artifacts

Non-debuggable Release ARM64 development-identity QA builds. Original QA signer, ZIP/ELF 16 KiB alignment, packaged OS-backup exclusions and no-Firebase runtime graph verified. Pre-Hermes JavaScript/maps and bytecode retained privately.

| Source | APK SHA-256 | Embedded Hermes SHA-256 |
| --- | --- | --- |
| 737eac13cfacae0086890f98f2197607244036d7 | d092403b7ec59382b63499f984675002b541482ff8e18ae12d200e08c52b814c | bcc97e1800fad09e333754c19d1596a4893c8b6df55f987c5ea13ff5e1b3d21d |
| d59bf8d684e564b1f4e6c036e3e0e53398eae9e0 | ed90485a89347db1b941f6bebc5dc49ae034ca3047ca98b4c3c49288fcf59b29 | 3d70084d348c572d1dec71dca0e9c186feec3e6248beb81ef1c95fc246258f82 |
| bb235cdf6f2bba63b1760038a379a2c09cdf32ab | 41518e7db8705aec54f66668831097f97e6a052234b34e4295477609fd5e4456 | aa26242793e755dc29301b08d31e2bf50bfaf74fb4a1c1be37ee01abfff7d1e1 |

737eac1 native lint: 0 errors, 41 warnings. Later builds reused it only after all 54 generated native files were byte-identical and native configuration/dependencies unchanged; they did not rerun full native lint.

Current isolated Android target: exact bb235cd APK installed and read back by hash. Prior APKs and a closed pre-upgrade rollback are preserved; same-signer upgrades retained the synthetic record.

## Exact iOS artifacts and installed baseline

Unsigned Release ARM64 iOS Simulator builds, not distribution-signed artifacts.

| Source | Executable SHA-256 | JavaScript SHA-256 | Checkpoint status |
| --- | --- | --- | --- |
| 737eac1 | d64f95d9338451b1fe9a0e6aa358efb7c71380d2bc192a5a2eb19b2e12a01016 | 731bdaac0f2424db56ba8561e4bbcd9dca4c01f7134aa9b2225b029904653e0a | Built and installed on current isolated acceptance target |
| d59bf8d | 83f19b99341362117d02a05a0b0a3ef3eb0f58bbcf041067295826436248c855 | 92b899af2b8043269c40adbd3f2b8560f2e4d8bd090770fc98a65fe6d8054fb8 | Built, not installed |
| bb235cd | Not built | Not built | Staged; compilation/install held through the protected reminder check after Android qualification |

Repository source therefore differs from installed iOS runtime. Source/mock checks do not certify an older installed runtime or an unbuilt candidate.

## Native results and remaining gates

On 737eac1, normal-size iOS Detail/Edit/Share journeys and automated native accessibility audits passed. Android verified current Home/four tabs, synthetic edit Cancel, save/relaunch persistence, fixed actions during content scrolling, separate-share defaults/privacy, reviewed text matching the actual OS sheet and cancellation without a recipient. This does not imply manual screen-reader acceptance.

Extreme-size testing found real issues: Android 737eac1 fullscreen extraction hid actions; d59bf8d stopped extraction but left the focused field beneath inline Gboard. iOS 737eac1 at system maximum plus app Large Text retained reachable independent actions but partially overlapped the focused field with the keyboard.

### bb235cd bounded Android keyboard acceptance: PASS

Completed at 14:54 UTC on the exact installed APK above, using Android API 35 and Gboard with system text at 200% and app Large Text off. Fresh pixels and native IME state verified the result.

- Inline IME remained non-fullscreen. Complete focused name/answer inputs and caret were visible above the keyboard in landscape; portrait refocus also passed.
- The same dirty editor retained its text through both rotation directions. Android may dismiss the keyboard during rotation; explicit refocus succeeded. Repeated keyboard hide/show passed.
- Independent action scrolling preserved the content position. Both viewports clipped their own contents correctly. The bounded action region deliberately scrolls at extreme sizes; all actions/header content are not promised simultaneously visible.
- Cancel from the open keyboard discarded the unsaved marker, verified by reopening the editor. Save from the open keyboard committed the exact replacement value to the same synthetic record.
- Force-stop/relaunch preserved the saved value and other synthetic fields. Font scale and portrait presentation were restored, with four-tab Home selected.

This closes the specific Android keyboard/rotation regression, not the whole native accessibility or release matrix. Older APKs, rollback data and failure evidence remain preserved. No external recipient, physical device, erase, uninstall or restore was used.

Still OPEN:
- Final-source iOS build/install and exact extreme text/keyboard/rotation retest after Android qualification.
- Broader manual accessibility, real-archive/restore and other release-matrix gates retain their separately recorded open/evidenced states.
- Physical testing remains conditional on required virtual gates. No physical acceptance, release merge, store submission or production deployment is claimed.

Publishing these verified milestones does not close the remaining gates above.
