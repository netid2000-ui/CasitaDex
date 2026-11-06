# Changelog

## November 6, 2026 - WORK-SB121 Android candidate preparation

- Build and verify the current staging Release Android QA artifact in an isolated external workspace/cache. No application-source change.
- Record complete no-Firebase release dependencies, QA signing, bundled source and 16 KiB packaging/ELF evidence.
- Preserve current simulator reminders and make the owner's virtual-testing-before-physical-testing gate explicit. Native acceptance is still pending.

## November 6, 2026 - WORK-SB121 readiness candidate

- Patch the supported development-only Zod advisory without changing runtime dependencies.
- Preserve declared iOS scene-support configuration during fresh native generation.
- Add expanded disclosure state, bounded foreground iOS status announcements, and photo escape/Reduce Motion support.
- Build the new candidate separately; leave the scheduled 09:00 reminder runtime untouched. Native VoiceOver, Figma parity and distribution gates remain open. See docs/qa/WORK_SB121_SECURITY_ACCESSIBILITY_READINESS.md.

## November 6, 2026 · WORK-SB121 follow-up

- Align seven supported Expo SDK 57 patch versions and rebuild/requalify the native graph; online Doctor now passes 21/21.
- Add official per-view XCTest accessibility evidence, with real cold-launch maximum-text geometry and explicit capture limits.
- Preserve exact linked-memory fixtures and a normal-clock 09:00 continuation handoff.
- Recheck native photo/persistence and full-backup preparation/share. Security, offline, complete accessibility and owner release gates remain open; see docs/qa/WORK_SB121_FOLLOWUP_QUALIFICATION.md.

## November 5–6, 2026 · WORK-SB120–121

- iOS local notification taps are retained until navigation is ready and open exact saved destinations; unsaved edit guards defer navigation.
- Preserve literal percent sequences and Unicode identities through Expo Router’s installed decode path, with regression tests against actual router code.
- Fix iOS full-backup/text export through verified private files and native sharing instead of Android-only storage access.
- Require local reminder pod, module and subscriber registration before iOS QA builds.
- Bounded native photo/backup/restore, notification and maximum-text evidence is documented. Release remains NO-GO; see docs/qa/WORK_SB120_121_EXECUTION.md.



## November 5, 2026 · WORK-SB105

- Android reminder notifications open their exact saved memory or standalone reminder, with a return to all reminders.
- Completing a recurring reminder that would fall into a DST gap preserves the occurrence and asks for a valid time.
- Verified current-source Android offline/readback, notification targets and completion; release remains NO-GO. See docs/qa/WORK_SB105_EXECUTION.md.
