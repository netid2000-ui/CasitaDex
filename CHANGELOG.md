# Changelog

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
