# CasitaDex — Governed super-batch roadmap
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
