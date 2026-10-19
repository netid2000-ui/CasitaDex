# CasitaDex acceptance and design refinement
Date: 2026-10-19. Scope: approved review/checkpoint, stabilization, synthetic scenarios, physical Android acceptance, storage/recovery evaluation and release preparation. User also requested a modern, sophisticated Android/iOS interface with broad appeal.

## Design direction and references
The original evergreen identity remains. Home now uses a compact typographic wordmark and restrained geometric house mark instead of the large illustrated landscape. Historical image assets remain for the prior Staging interface. This is an implementation candidate for human visual acceptance, not a claim that an unseen design was approved.

- Apple Human Interface Guidelines: https://developer.apple.com/design/human-interface-guidelines/
- Apple typography: https://developer.apple.com/design/human-interface-guidelines/typography
- Apple navigation/search: https://developer.apple.com/design/human-interface-guidelines/navigation-and-search
- Android layouts/navigation: https://developer.android.com/design/ui/mobile/guides/layout-and-content/layout-and-nav-patterns
- Android accessibility: https://developer.android.com/design/ui/mobile/guides/foundations/accessibility
- Expo maintenance method: https://docs.expo.dev/workflow/upgrading-expo-sdk-walkthrough/

These references inform familiar hierarchy, labeled navigation, system typography, scalable content, legibility and platform sheets. No third-party app artwork, proprietary icons or copied screen designs were introduced.

## Implementation
Semantic primary/on-primary/focus/separator colors support both light and dark appearance. Primary actions have the strongest emphasis, secondary actions are tonal, and list navigation is quieter. Original line icons replace platform-dependent Unicode navigation glyphs. All four tabs have equal, labeled targets and a clear selected state. Fields retain persistent labels with visible focus and disabled states. Page scrolling adjusts keyboard insets on supported platforms. Section titles follow the application's reading preference; native font scaling remains enabled.

The first decorative border choice failed the existing contrast regression and was corrected before acceptance. Decorative separators are separate from interactive boundaries. The current tests retain the original text/control contrast requirements.

## Synthetic scenario collection
The reusable generator creates 19 saved memories: 17 active, one archived and one recently deleted. It includes two Spaces, four Categories, exact equipment identifiers, Spanish/Japanese text, long instructions, unassigned records, overdue/today/future reminders, confidence states, one photo-only saved record and one unfinished photo draft with a partially typed reminder date.

The equipment image is explicitly labeled SYNTHETIC TEST LABEL. The dataset contains no real contact, household, credential, door/alarm code or personal photograph.

Generator: scripts/create-household-scenarios.mjs.
Fixture: tests/household-fixture.mjs.
Consumer scenarios: tests/household-scenarios.test.mjs.
Exported backups/APKs stay in the external QA directory, not Git. A receipt identifies the exact generated dataset.

## Review and preservation
The prior reviewed application and existing owner work were captured in commit be4ae76f6f215b2dcf1da64d3fbac15ac18ce1f1 on acceptance/eng-review-20261019. This is a combined recovery checkpoint; it does not attribute existing work to this session. The design/patch/scenario followup is separately reviewable against that commit.

Source/docs preservation: /home/fa-dev/projects/casitadex-acceptance-preservation-20261019.
Integration checks compare each target against that preserved source before copying. Current source equality initially covers 133 files across source, tests, scripts and configuration.
The existing internal Android signing certificate is unchanged.

## Current automated evidence
Linux: 275/275 tests passed. Windows: 273 passed, 2 expected symlink skips, 0 failed. TypeScript and lint passed. Expo Doctor now passes 21/21 after SDK-compatible patch alignment and explicit splash plugin configuration. Web export passed. iOS project generation passed without installing pods; no Apple compilation or native acceptance is implied.

## Release conditions
This document is complemented by native device evidence and final artifact receipts in docs/qa/acceptance-20261019.

The package audit reported 30 advisories (18 high, 12 moderate). Many follow build/toolchain dependency chains. Suggested automatic major-version fixes include core framework downgrades, so they were not applied. Runtime exposure and safe remediation require explicit release disposition; Doctor PASS is not security approval.

Storage measurement must distinguish app/destination capacity and actual peak temporary/rollback bytes. Existing operation-specific capacity checks remain active. A warning/critical/hysteresis policy cannot be called calibrated from a single emulator observation. Permanent cleanup stays disabled pending trusted-clock/reference policy and deletion evidence.

Physical testing uses isolated Development on the Samsung A16, with synthetic data. Staging was present before testing; Development was absent. Staging's APK identity is captured before/after. Do not overwrite Staging or claim its private data was exported when it was not.

Remaining release conditions include an Apple simulator/device build, spoken accessibility/human visual acceptance, real native interruption/full-disk coverage, storage policy and security disposition. No store publication, production/cloud activation or remote push is included in release preparation.

## Final candidate C: native acceptance and preservation
Both final Development APKs were built from the integrated candidate, signed with the existing internal debug certificate, hash checked, and installed: ARM64 on Samsung A16 (Android 16), x86_64 on emulator-5580 (Android 15). Exact sizes/hashes are in artifact-receipt-C.json. This is an internal acceptance candidate, not a store release.

The final Find layout keeps Space and Categories directly visible in horizontal native filter rows. Advanced filters remain under More filters. Exact model EDR4RXD1 returns one result; combining Rental Space returns zero; clearing filters retains the query and restores the result. Detail/Android Back retains Find context. Singular saved-memory counts were corrected.

Samsung acceptance covered synthetic import, process restart, saved photo display and 2x zoom, duplicate-photo confirmation, refusal of an incomplete reminder date without losing the draft, optional share metadata defaults, Categories-only preview, and an actual one-photo ZIP in the native share sheet. The share sheet was dismissed without choosing a recipient. Light and dark screenshots were visually inspected. A bounded Home check at 200% OS text size retained core actions and labeled tabs; this does not replace a full accessibility review. Font scale was restored to 1.0 and app appearance to System. Rotation and accessibility-service settings remain at their original values.

The generated 85,011,030-byte stress backup contains 19 records, five saved photos and a five-photo draft, including nine real 9,441,653-byte PNG images. Native restore and two full native exports passed. The 85,011,029-byte export passed independent filesystem/SQLite restore, close/reopen and every photo-hash check. Previous-full-save recovery then restored the smaller original synthetic household collection. Its final C native export independently matches all original data, draft and attempts exactly, with only the expected restore/checkpoint revision difference.

The emulator original collection (three records) and five-photo draft were preserved through final upgrade and reboot. Its 21,887,379-byte final native export independently matches the original golden backup's data, draft, attempts and all photo hashes. No ANR was recorded after that boot; the historical intermittent SystemUI ANR remains unresolved.

The Samsung Staging APK SHA-256 was verified unchanged before/after. Staging was not launched, replaced or uninstalled. Its private data was not inspected. Development remains installed with clearly synthetic review data.

## Capacity observations and limits
The first 600-sample trace covers restore review/cutover but ends during backup writing; it is incomplete for backup peak accounting. It must not be used as a full backup peak result.

The complete backup trace has 340 samples from 13:30:17.157Z to 13:32:16.234Z. Initial available capacity was 92,498,030,592 bytes; minimum 92,326,871,040; final 92,411,301,888. Observed peak decrease: 171,159,552 bytes; retained decrease: 86,728,704 bytes for an 85,011,029-byte export. This captures destination writing, verification and cleanup on one same-volume Samsung run and includes filesystem/OS activity. It supports temporary-copy accounting, not general warning/critical/hysteresis calibration. Operation guards remain active and permanent cleanup remains disabled.

## Audit disposition and handoff
Baseline and final lockfiles both report the same 30 advisories (18 high, 12 moderate), with no newly added advisory IDs. Framework-downgrading forced fixes were not applied. Security disposition remains a release gate.

The source build-input equality check covers 133 files. Two additional CLI-only QA utilities were added after the application build: create-photo-stress-scenario.mjs and verify-qa-backup-roundtrip.mjs. Both were executed successfully; they do not alter the embedded application.

All signed ENG design documents remain historical contracts. The earlier 37-document coverage ledger remains the detailed mapping; this report updates its implementation/evidence status without treating all ENG release conditions as closed. Remaining gates: Apple build/runtime and iOS export-adapter review, spoken accessibility and human visual/usability acceptance, tablet/foldable checks, real interruption/full-disk matrix, trusted-clock cleanup/storage-policy acceptance, historical emulator ANR investigation, and dependency security disposition. No further app changes or builds are required for this handoff.

Evidence index: docs/qa/acceptance-20261019/test-results-summary.json, artifact-receipt-C.json, three final independent roundtrip proofs, audit-comparison.json, capacity traces and native XML/screenshots. Raw APKs, backup archives and large images remain in the external acceptance QA directory and are excluded from Git.
