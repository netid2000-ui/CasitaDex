# iOS a886 current native checkpoint
Source: a8867c06c7dd3ceab55bd1ac6705064a83de28f2. Unsigned arm64 iOS Simulator Release.
Evidence: QA-Evidence/WORK-SB121/ios-recovery-a8867c0/native.
Binary SHA256 a3af0f51c894a2ba9008aeea2bb37ba5ab585f0ad85653aa6b57ff1b0ce81133.
JS SHA256 48477d73eb54470bfce1563e4ca290535b0d846cefcfd5f3da8fe76858b172f4.
- PASS: same-ID preserving upgrade, exact installed artifacts and unchanged original memories/reminders/draft/photo bytes/preferences.
- PASS: separate transport-QA data and receipts preserved.
- PASS: ten canonical/encoded/missing navigation cases. Home/four tabs captured in both appearances.
- PASS: actual normal-clock process-terminated standalone notification opens exact target containing literal percent and Unicode; Home navigation and launcher do not replay stale notification.
- LIMITATION: external simctl deep links targeting a deliberately noncanonical synthetic ID did not resolve correctly in bounded encoding checks. Actual notification response passed. Not a demonstrated new regression; no parser changes made.
- PASS: approved synthetic-only identifier repair restores reminder backup schema validity, with all other fields unchanged.
- PREPARED, NOT DELIVERY PASS: three distinct current-build linked reminders are natively scheduled for November 6, 2026 09:00 America/Chicago (15:00 UTC). Exact IDs, pending request evidence and private continuation are retained outside source.
- Original five-photo draft retained; new fixture setup used canonical validated additive synthetic seeding, not UI creation.
- Current ordinary app terminated and simulator left booted. Historical runtime/device untouched. Do not install over this fixture before scheduled test.
- Remaining: actual 09:00 linked delivery/tap lifecycle acceptance, OS/radio-off validation, full physical-device qualification and owner iPhone signoff. No production/store approval; release remains NO-GO.
This records verified fixture preparation only; it is not scheduled-delivery acceptance or release approval.

Independent pixel review: visible portrait Home PASS in light/dark. Logo/date, heading, draft text and Resume/Delete Draft controls fit. Four tabs Home/Photos/Reminders/Find visible with Home selected. Below-viewport actions and enlarged-text coverage are not claimed by this screenshot review.

## Continuation requirements
Resume November 6, 2026 at 14:50 UTC / 08:50 CST. Read the private exact-current-build handoff under QA-Evidence/WORK-SB121/ios-recovery-a8867c0/native/CURRENT_0900_PRIVATE_HANDOFF.md on the authorized Mac. It contains verified current device/container/request identifiers and read-only preflight. Do not use the historical-device handoff as the target. Keep the current app terminated until normal 15:00 delivery. Verify all three linked requests and the fourth known standalone; correlate actual taps with Delivered identifier changes plus exact target. Distinguish simultaneous delivery state from later tap state. Do not change clocks, reschedule, inject pushes, reinstall, restore, delete or use the historical device as a fallback. Record ambiguity as unverified. Preserve all fixtures after testing.
