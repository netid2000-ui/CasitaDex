# CasitaDex — authoritative Mac integration status

November 5, 2026 · FA-MAC-DEV-01 exclusively · FA-Development external SSD · authorized branch `work/cd-sb41-edit-targeting-20261104`.

**WORK-SB105 · PARTIAL · Release NO-GO.** Application source `20a9393c5c89b046ee6397723a4938680a8ba947` adds exact Android notification destinations and rejects recurrence into nonexistent DST times before persistence.

- Verified: TypeScript, ESLint, 25 focused tests and one SQLite persistence regression. Current-source Android QA APK built; exact standalone SQLite readback, offline force-stop/relaunch, encoded/malformed links, actual standalone and linked notification taps, Show all, completion and native alarm cancellation passed bounded checks. Final isolated linked job `aed5beaeda11570d` exited0.
- Evidence: [SB105 execution](docs/qa/WORK_SB105_EXECUTION.md), [functional matrix](docs/qa/WORK_SB73_EXECUTION.md), [artifact manifest](docs/qa/SB105_EVIDENCE_MANIFEST.json). Earlier driver failures and clock-advanced limits remain explicit.
- Open: iOS response routing and native recovery; reminder edit/reschedule, native DST validation, Settings permission recovery, reboot-before-launch and normal-clock delivery; complete media and backup/restore; Figma selection-state reconciliation, VoiceOver/TalkBack/responsive acceptance; vulnerable dependency parent migration; signed distribution and owner physical-iPhone acceptance.
- Next: Finish current-source reminder lifecycle and household media/backup journeys, implement iOS exact target response once toolchain qualifies, evaluate supported SDK58/router58 dependency migration in isolation.

No production changes, store submissions, live purchases, or other-host jobs.
