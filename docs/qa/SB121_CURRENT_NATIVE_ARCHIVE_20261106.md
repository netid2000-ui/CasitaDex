**Historical checkpoint.** Historical bb235 native export plus five isolated engine cases. Later actual native restore is separate; these test results and limits are not rewritten. [Current summary](SB121_CURRENT_8CC_NATIVE_MILESTONE_20261106.md) · [Central ledger](SB121_CURRENT_NATIVE_ACCEPTANCE_LEDGER_20261106.json).

# Current native Full v4 archive acceptance

November 6, 2026, 15:14 UTC test run. **VERIFIED PASS: 5 tests, 5 passed, 0 failed, 0 skipped.** This closes the five opt-in real-archive cases for the current Android runtime and tested engine source. It is not native app restore acceptance or release approval. Release remains **NO-GO**.

## Exact provenance

- Runtime source: `bb235cdf6f2bba63b1760038a379a2c09cdf32ab`.
- Android artifact: non-debuggable Release ARM64 development-identity QA APK, SHA-256 `41518e7db8705aec54f66668831097f97e6a052234b34e4295477609fd5e4456`. Installed APK read-back matched. Android API 35 isolated virtual target only.
- Test checkout: `2a3b0f31ae1884f623aa507c4c75ba5257413b8f`, branch `work/cd-sb41-edit-targeting-20261104`. Its only difference from runtime source was the prior keyboard milestone document. Engine/test/dependency inputs were unchanged.
- Node `v24.22.1`, `CASITADEX_SB24_ARCHIVE` set to the fresh native export copy, `node --test --test-concurrency=1 tests/sb24-real-archive.test.mjs`, exit 0.
- Fresh native archive: Full v4, 3,241 bytes, SHA-256 `6df86b906edee3cc42679dfbcea3550ccafc518a4bd5ef9c89e57b6e31b52dc3`.
- Dependency lock SHA-256: `7767f310cb183d9e2de29deed82d79ee7cd9a08dd29bddf5a979474fe7c856c7`.

No build or application-source change was needed. This was a focused five-test execution, not a rerun of the earlier 557-case suite. Historical skipped results remain historical.

## Native export and photo coverage

An initial native Full v4 export established the preserved baseline: one saved synthetic memory, no draft, no photo and no standalone reminder. Only then were one synthetic standalone reminder and one unfinished draft with one synthetic PNG added through the native UI. No existing draft was replaced.

**PASS:** native Browse image files opened Android DocumentsUI, the selected PNG became one draft photo, the native viewer rendered the expected image, and Close returned to the retained draft. A fresh native Save full backup used Android's Storage Access Framework and a scoped local Documents folder. The app reported the Full v4 backup saved and verified. This Android flow did not open a share sheet or send anything to an external recipient.

The native archive was copied read-only to external QA evidence. It contains one saved memory, one unfinished draft, one draft photo and one standalone reminder. Every embedded photo byte matched the synthetic input. The saved collection data is deep-equal to the initial native backup, including existing memory metadata. Device original and Mac copy hashes remained identical before/after copying and after testing; the baseline archive also remained unchanged.

A force-stop/relaunch retained the draft title, attached photo count and standalone reminder. Home was left selected, with the draft available through Resume Draft. No reset, uninstall, deletion or app collection restore occurred. Notification permission was unchanged.

## Five independent results

1. **PASS:** Full v4 opens and verifies every embedded photo byte, with reminder and unfinished-draft prerequisites present.
2. **PASS:** one-byte photo corruption in a separate Buffer is rejected without changing the source archive.
3. **PASS:** restore and recovery of both data domains in disposable SQLite.
4. **PASS:** cancellation leaves disposable SQLite data, schema and media unchanged.
5. **PASS:** stale reminder review is rejected without disposable-state mutations.

The test and fixture were reviewed before execution. The archive is opened with `readFileSync`; corruption is applied to `Buffer.from(original)`. Restore/recovery/cancellation/stale-review cases use `DatabaseSync(':memory:')` and a Map for photo bytes. They do not connect to or restore the actual app collection.

## Explicit limits and remaining gates

- No actual native app import, replace-collection restore or previous-save recovery was performed.
- No camera capture, photo-library picker, replace/remove, multi-photo, pinch-zoom or wider photo-limit matrix was exercised in this bounded run.
- No native backup-cancel or corruption-preview UI acceptance is claimed from engine tests.
- Restart readback confirms the displayed draft title/photo count and reminder; archive byte verification is separately evidenced above.
- No iOS, physical-device, network-state, manual screen-reader, production or store acceptance is implied. All separately recorded open gates remain open.

## Evidence and privacy

Private evidence is retained under `QA-Evidence/WORK-SB121/android-real-archive-bb235cd-20261106/`, outside Git. It includes native screenshots/XML, initial and final native archives, source/input fingerprints, test output/exit, preservation assertions and restart readback. Public records omit fixture identifiers, personal/device identifiers, raw data, logs and binaries.

- Qualification receipt SHA-256: `a2369c8df1be60fe3cdeb1696082faef062daf80a6462878b3fef64f7da11a13`.
- Frozen 69-file evidence manifest SHA-256: `38f15a3ef830e9a3a20193862b883c37f4572e4cb322cbb95ba3c030b277cdc4`.
- The manifest is a point-in-time record before documentation publication; later publication receipts are separate.

Harness corrections were non-product issues: file selection required the observed native content description, Node chose the spec reporter rather than TAP, and Home correctly required Resume Draft instead of disabled Add Memory. They did not alter the five test results or require destructive actions.
