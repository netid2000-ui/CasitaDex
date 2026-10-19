## October 19 UTC - ENG application gaps implemented; acceptance gates remain

The identified Home/Find/Add/Detail/More application gaps I01-I13 are implemented and integrated (26 code/test/package files). WSL: 271 PASS; primary Windows: 269 PASS / 2 expected symlink SKIP / 0 FAIL. Compilation, lint, web export and both Development Android builds pass. The 215-component native runtime has no Firebase. All 69 frozen source/config/package hashes match primary.

Native checks cover durable photo/draft fields, Review/edit guards, independent sharing consent, explicit restores, actual full/text exports with independent filesystem/SQLite reopen, and 0/500/5000 collection flows. Final data/draft/attempts exactly match the preserved three-record/five-photo-draft snapshot.

Full ENG/SB-20 RELEASE acceptance remains PARTIAL: numerical storage policy, trusted-clock permanent cleanup, remaining real native failure/platform/human acceptance and publication gates stay open. Existing emulator System UI reboot ANR remains open. Expo Doctor reports five pre-existing SDK patch mismatches (20/21 checks). No commit/push/merge/deploy/phone/cloud activation occurred.

Current ledger: [ENG_COMPLETION_CHANGE_TEST_LEDGER_2026-10-19.md](design/ENG_COMPLETION_CHANGE_TEST_LEDGER_2026-10-19.md). More -> Backup & Restore contains full, limited text and previous-save recovery tools. Storage & Cleanup is first under Memory management. Earlier entries below are historical and retain their original scope.

---

## October 19 UTC - ENG coverage correction: INCOMPLETE
Review of 37 design/integration records and the 236-case inventory found missing signed behavior. Nine disposable probes reproduced seven unmet requirements: answer/source verification reset, stale restore preview, draft notes, multiword search, default share privacy, and local-calendar dates. Two positive checks passed, including legacy seven-photo/two-Space portability.
Core native media/draft/full-backup evidence remains valid at its stated scope. Full ENG and SB-20 are NOT complete. Home/Find/Add/Detail/More conformance and consumer failure-path coverage also remain incomplete, beyond the existing platform/calibration/cleanup gates.
See docs/design/ENG_DOCUMENT_COVERAGE_AUDIT_2026-10-19.md and docs/qa/eng-coverage-audit-20261019/probes.json. This review changed documentation/evidence only; application/APK source unchanged. Prior completion wording below is superseded, historical evidence preserved.

## October 19, 2026 UTC - Full ENG Development integration verified
Full native ENG source is integrated into C:\CasitaDex-Git. Durable photo/camera drafts, photo-only save, canonical v2 data, taxonomy/lifecycle, protected media journals, full draft-inclusive backup, explicit draft conflicts and full previous-save recovery are live in Development.
236/236 WSL tests PASS; Windows 234 PASS/2 symlink SKIP/0 FAIL; TypeScript/lint PASS; x86_64 and ARM64 internal Release builds PASS; 214-component local-only graph has no Firebase.
Final installed LT1 Dev APK B22AF4E184AEF986EE9C3A885435C4D9ED5790C19198BA754C0DD3142F4D2978. ARM64 review APK prepared, not installed on phone.
21.8 MB native backup, all lifecycle/draft counts, both draft choices, cancellation, previous recovery, camera and process restart passed. Actual exported file also restored all fields/photos into a fresh SQLite/private filesystem and reopened successfully.
All APK source-manifest hashes match primary. HEAD remains b940ccc; dirty owner work preserved, no commit/push/merge/deploy. Full evidence and open gates: docs/design/FULL_ENG_NATIVE_ACCEPTANCE_2026-10-19.md.
PARTIAL broader acceptance remains: numerical storage calibration, permanent cleanup clock policy, physical/iOS/spoken accessibility/full-disk testing, existing emulator reboot ANR. Earlier text-slice/isolated-only entries below are historical.

## October 18, 2026 — Native ENG text-draft slice verified
PASS within Development-only scope: native Add now uses the tested ENG-D orchestrator with a real SQLite recoverable text draft and atomic/idempotent save. Incomplete-save guard, draft exclusion from Find, restart recovery, saved-memory persistence, consumed-draft removal and confirmed/cancelled discard passed on LT1 offline.
Reviewed eight-file contribution is integrated into primary working tree. All primary source hashes match the tested APK source manifest. Linux 209/209 PASS; primary Windows 207 PASS/2 symlink-privilege SKIP/0 FAIL; TypeScript/lint PASS.
Installed Dev APK SHA256 CC361BA6B6496BAD8E72203F19B92EBC6A44BE27361C5B780F20BE466E45F8F7, 48,151,883 bytes, debug-signed Release with embedded JS. Package com.designsbyfa.casitadex.dev coexists with preserved LT1 Staging.
Full ENG/SB-22 remain OPEN: photo drafts/camera/photo-only save, v2/category/lifecycle and Space creation, draft-inclusive portable backup, full accessibility, physical platforms and emulator reboot stability. Drafts are Development-only and must be saved as memories before current portable backup.
Evidence: docs/design/NATIVE_TEXT_DRAFT_ACCEPTANCE_2026-10-18.md. HEAD still b940ccc; pre-existing and new working-tree changes retained intentionally; no commit/push/merge/Production action.

# CasitaDex — Governed super-batch roadmap
## Approved UI baseline — October 15, 2026

Owner selected the existing SB-18 interactive household-memory concept as the native implementation baseline. Canonical acceptance record: `docs/design/SB18_OWNER_APPROVED_DESIGN_BASELINE_2026-10-15.md`; charter Amendment F. Preserve approved answer-first navigation, privacy, simplicity and no-ads/no-aggressive-upsell policy. SB-18 accessibility/user-study closure and SB-17 platform stability are still open. SB-19 implementation should be staged and tested; no paid cloud/account/payment/Production work is implied.
## Active design lane / status override — October 15, 2026

SB-18 interaction-design checkpoint: first visit, Home, Find, Answer, Add/photo/voice simulations, Spaces, Storage, and optional plan UX are prototyped in docs/design/SB18_household_memory_interactive_concept.html. The HTML browser walkthrough passes, with rendered mobile/desktop previews and a reproducible Playwright test. This is NOT native release acceptance or real voice/camera functionality. Next: owner design review, moderated usability research (including accessibility), final states and the SB-19 native UI migration plan; do not start paid cloud or store integrations.

Historical CD-SB-01 "ACTIVE" and October 11 Phase A wording below are retained as provenance, NOT current execution state. Latest Android accepted source is SB-14 to SB-16 at `ca40afc`; SB-17 has functional compatibility passes but System UI ANR / secondary boot performance OPEN. Current owner-approved SB-18 is professional UI/UX design and monetization discovery. Prototype proposals, price cards, provider APIs and tier plans are not implementation authorizations. Read current `CURRENT_PROJECT_STATUS.md`, `PRODUCT_CHARTER.md` Amendment D, SB-18 research/UX/economics docs before final screens; read SB-17 acceptance before claiming Android stable. Finish the SB-18 detailed screen designs, usability/price experiments, entitlement architecture and governance gates before SB-19 implementation. Reconcile the legacy CD-SB ordering at next formal roadmap revision; do not silently treat stale older stages as complete or skip iOS/physical acceptance.

## Latest checkpoint — October 11, 2026
Active: Android text-backup Phase A verification. Existing Staging APK checks,
41/41 tests, TypeScript and lint PASS. An existing two-card backup and safety copy
validate with matching hashes. No Android device is attached to ADB.
Native restore and installed-phone certificate checks remain OPEN.
See [BACKUP_PHASE_A_CHECKPOINT_2026-10-11.md](BACKUP_PHASE_A_CHECKPOINT_2026-10-11.md).
Earlier build-blocked/only-CD-SB-01-active statements below are historical.
Full Android accessibility, iOS and media-inclusive CD-SB-05 are not closed.


Date: 2026-10-07 · Owner: Designs by F&A · Status: APPROVED ROADMAP; ONLY CD-SB-01 ACTIVE
Baseline: `prototype/bootstrap` at `af1d12c` (native-durability completion). CasitaDex milestone names deliberately differ from Event Command SB-12 / SB-13.

## Leadership and review contract

Charter Amendment B makes the assistant Chief Product & Technology Lead. Before each super-batch, consider all nine disciplines, record applicable specialist risks and acceptance criteria, and distinguish verified observations from professional judgment. Charter-first governance, owner authority and return-to-originating-chat remain mandatory.

## Rules common to every super-batch

Charter/status/ADR review → current evidence → research → documented technical and UX decisions → implementation → static QA → automated tests → runtime and device/accessibility QA → correction/retest → status/runbook/evidence → local commit → return to originating chat. Every acceptance claim requires reproducible evidence. Preserve Development/Staging isolation, `backendMode=none`, no Firebase, no Production/cloud/store/paid activity, no account and no unauthorized expansion. Inability to access a device/tool is BLOCKED, not PASS. Each super-batch must leave the tree clean or document precisely why not.

| Order | Super-batch | Required outcomes and acceptance evidence | Depends on / stop gate |
| --- | --- | --- | --- |
| **CD-SB-01 ACTIVE** | **Native Build Recovery + Repository Durability** | Reproduce exact SDK/toolchain/Windows path issue; use one genuinely short **physical** checkout and consistent paths for source, NDK/CMake, Gradle cache and generated outputs; preserve original clean baseline; produce locally test-signed **non-Production** Staging APK or document blocker with full command/error; verify APK's resolved dependency/manifest has no Firebase; rerun TypeScript, lint, tests, audit/Doctor, update runbook. Verify source archive/bundle and prepare safe off-device private Git recovery route without publishing. | No cloud build or public remote fallback without distinct approval. No APK means Android runtime acceptance stays OPEN. |
| **CD-SB-02** | **Android Native Lifecycle & Accessibility** | Install APK on emulator then physical device when available; six realistic cards, create/search/edit/delete, previous-save recovery, migration, offline cold-start, process kill/relaunch, backup/share; Light/Dark/System, Android scaling, TalkBack spoken navigation, focus/touch/clipping and reduced-motion; attach logs/screenshots, device/build identifiers and failures. | Requires successful CD-SB-01 APK. Simulator/emulator results never replace physical-device gate. |
| **CD-SB-03** | **iOS Native Lifecycle & Accessibility** | Build with real Xcode/Mac capacity; verify Development/Staging identifiers, save/migration/restart/offline, VoiceOver, Dynamic Type, appearance, Reduce Motion, share flow, safe area and large text; record build/device evidence. | No Mac/Xcode means NOT RUN; no false iOS acceptance. No App Store submission. |
| **CD-SB-04** | **App-Owned Media + Data Integrity** | Implement scoped local photos/files and stable references, transactional metadata, delete/orphan cleanup, controlled schema upgrades and migration, offline/device-loss messaging; regression evidence for failure and recovery. | Requires documented V1 storage ADR and native tests; no Firebase/cloud storage. |
| **CD-SB-05** | **Portable Backup, Import & Selective Sharing** | Versioned user-controlled export/import including media; review preview, destination file providers (Apple Files/iCloud, Google Drive, OneDrive as user-selected providers only), integrity/malformed/cancel/partial-failure tests; export is not managed sync. | Needs CD-SB-04 data/media format, physical platform evidence. |
| **CD-SB-06** | **Local Reminders Without Firebase** | Evaluate notification options and native dependency graph before selecting; implement device-local permission/schedule/edit/cancel/reconcile and restart/timezone behaviors; fail-safe delivery and accessibility checks; no Firebase messaging. | No library with disallowed messaging dependencies; release any hidden dependency before testing. |
| **CD-SB-07** | **Find-it-in-Seconds Usability & UX Polish** | First-run single fact, context modes BUY/FIX/FIND/MAINTAIN/SHARE, trust state and fast answer; unassisted human comparison with Notes/Photos/paper, confusion points, measured retrieval distributions without stopwatch guarantees; aging-eye and color-blind-safe audit; iterate only on evidence. | Core functionality complete. Preserve Today/Answers/Add/More and simplicity. |
| **CD-SB-08** | **Security, Compatibility & Release-Candidate Audit** | Resolve runtime `decode-uri-component` advisory safely and classify remaining audit roots; Expo Doctor online schema, offline/low-storage/corruption/purchase-state security, exact multi-platform acceptance matrix, recovery drill, privacy disclosure, no-Firebase native graph and cost review. Complete monetization/willingness-to-pay research without launching payments. | Every prerequisite native and media/reminder gate must have evidence. RC ≠ Production permission. |
| **CD-SB-09** | **Owner-Gated Distribution Readiness** | Evaluate legal/name clearance, listing/privacy/accessibility materials and store-test plan; optional staged distribution only after explicit owner authorization. | **STOP** before Production, EAS paid/cloud builds, app-store submission, public announcement or commercial billing. |

## Immediate CD-SB-01 working specification

**Evidence baseline:** Work returned implementation `705bded`, correction `6b13117`, documentation `af1d12c`. At the handoff: 26/26 Node tests, browser 18+6+8+3, Android 210-component no-Firebase graph PASS. Android APK BLOCKED: long native gesture-handler CMake object path and R:/C: generated-root mismatch. iOS and physical devices NOT RUN. Dependency URL-decoder fix and Expo Doctor online validation OPEN.

**Subtasks:** (A) immutable checkpoint and status verification; (B) build-system path/toolchain analysis with exact log; (C) short physical root and clean generated native build; (D) APK inspection and emulator smoke when available; (E) rerun checks and record diagnostic differences; (F) private source recovery preparation with no secrets; (G) runbook/acceptance matrix/commits. Do not brute-force global Windows settings or silently accept a new build service.

**Completion condition:** A reproducible Staging APK with its hash, artifact identity and native dependency scan; or an honest BLOCKED report with precise cause and a bounded remediation proposal. A failed build cannot be called complete Android acceptance.

## Return checkpoint format

Report: starting/final commit, files changed, commands/tools, pass/fail/blocked/not-run, Windows/Android/iOS platform evidence, security and dependency changes, backup status, release-boundary statement and exact next owner decision. Work handed to another environment must return to **the originating CasitaDex chat**.
