# Designs by F&A — CasitaDex Current Operating State

Approved 2026-10-22. MANDATORY read-before-act authority.

## Binding machine assignments
- DESKTOP-FP0BMH2: authoritative Git repository C:\CasitaDex-Git. NO Android compilation.
- LT1: Android APK build machine, using Ubuntu-24.04 on WSL2 (Linux Node/npm/Java/Android SDK). Preserve existing emulator QA data. Windows PATH checks do not establish WSL toolchain readiness.
- DESKTOP-MB70M1T: newest-build Android visual QA, emulator-5554.
- Samsung physical Android: install only with explicit approval.
- Emulator serial numbers are unique only within each host.

## Current approved work
- Figma Warm Editorial A.2 is the design authority for iOS and Android.
- Dedicated Memories, Photos, Reminders; clean Home with three creation actions.
- Build a verified staging APK in LT1 WSL2 from the current source commit and install on MB70M1T without clearing data. Existing LT1 SB-26 APK is not verified as current source.
- Verify Figma parity, buttons, navigation and Reminder unsaved-draft guard.
- Latest source checkpoint at creation: 159095e; always re-read Git HEAD.
- Primary C: was full after an incorrectly assigned build; no APK resulted.
- No production deploy or remote push authorized.

## Permanent stop rules
- Never substitute a different build machine without owner approval.
- Never delete caches, QA data, source, or existing app installations without approval.
- Stop if machine role, free disk, environment, or package identity is uncertain.
- Treat latest APK as verified only when source SHA and APK SHA-256 are recorded.

## Mandatory preflight (check before every action)
- [ ] Read this file, latest handoff, relevant charter and runbook.
- [ ] Confirm Git branch, clean/dirty status, commit, and existing work.
- [ ] Confirm host identity and approved machine assignment.
- [ ] Check free disk, SDK/JDK/Node, package ID and emulator serial.
- [ ] Verify staging-only scope, signing, preservation and no production deploy.
- [ ] Record build commit, APK hash, target, install time and QA evidence.
- [ ] Stop and request approval on contradiction, data risk or paid resources.
- [ ] Update operating state, registry, evidence, blocker and next step.

## Project evidence pointers
- Emulator/build inventory: docs/qa/ANDROID_EMULATOR_BUILD_REGISTRY.md
- Build script: scripts/build-android-staging-shortpath.ps1
- Figma governance and assets: docs/design/
- Test and QA evidence: docs/qa/

## Designs by F&A organization-wide standard
Every project must have a versioned CURRENT_OPERATING_STATE.md and mandatory execution preflight. Chat memory is not authoritative. Carry file path, revision, machine roles, gates and evidence in every handoff.
