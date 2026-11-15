# CasitaDex large-text review — November 14, 2026

Implemented on the approved SB40-derived feature branch, using the Mac mini only.

## Corrections

- Compact large-text headers omit the duplicated brand row and reduce heading size so fixed actions and scrolling content remain reachable.
- Reminders keeps Add Reminder fixed, moves its compact heading into the body, and uses horizontally scrollable filters without shrinking filter labels.
- Find filters scroll horizontally instead of consuming the viewport in wrapped rows.
- Normal-size navigation remains Home / Photos / Reminders / Find. Settings remains accessible from Home.

## Verified

- TypeScript and ESLint pass. Automated suite: 491 passed, 6 existing skips, 0 failures (497 total).
- iOS at accessibility-extra-extra-extra-large: scoped native test passed across Home, Find, Settings, Add, Details, reminder form and reminder list. Cancel, Edit memory, Add Reminder and the last reminder filter were reachable. Add was captured at the existing free-plan limit; this is not a full Add-form accessibility acceptance.
- Android at font scale 2.0: scoped controls passed in Light and Dark across the same routes, including horizontal access to Memory dates.
- Reviewed screenshots include iOS Find, Settings and Add limit state, plus Android dark Reminders. Evidence includes the original iOS Reminders crowding and final captures.
- iOS result: QA-Evidence/CasitaDex-Large-Text-r2-20261115.xcresult, one test, zero failures.
- Android packaging initially failed with a generic IncrementalSplitterRunnable error. Retry with stacktrace succeeded without source changes; cause remains undetermined.
- Original font settings restored: iOS large; Android 1.0. QA apps returned Home.
- Original iOS ENG payload SHA-256 unchanged: d6ba01f3dfa95a06097d58870a686f85bb2c3373ecc430e20602df3ac3bf93c0.
- Disposable iOS ENG payload SHA-256 unchanged: 829ae84e387b31d5c7585c026670a2d7a38b8bbb836daea0ce229d739a71bee8.

## Remaining acceptance

Manual VoiceOver/TalkBack focus order and announcements, broader accessibility review, and physical-device owner acceptance remain outstanding. These scoped checks do not establish full accessibility compliance or release readiness. Completed photo acceptance was not repeated. No production release, purchase or store submission occurred.

Evidence: [large-text captures and Android results](evidence/large-text-20261115/).
