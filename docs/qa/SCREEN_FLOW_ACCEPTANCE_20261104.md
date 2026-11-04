# CasitaDex screen, action and workflow acceptance — 2026-11-04

## Verified baseline (Mac mini, Xcode 27.2, iOS 27 simulator)
- Commit f2db2c7: native simulator build exit 0; bundle com.designsbyfa.casitadex.dev installed and launched; UIKit process registered.
- Full `npm run qa:ci`: 338 tests, 333 passed, 5 skipped, 0 failed; typecheck, lint, Expo Doctor 21/21, web export passed.
- This is **not** end-to-end interactive acceptance. No tap-by-tap screen verification has been completed in this batch.

## Device acceptance matrix — all PENDING until evidenced
For every row verify normal path, cancellation/back, keyboard/save reachability, empty/error states, landscape, large text, VoiceOver/TalkBack, light/dark, offline persistence, and restart where applicable.

| Screen/route | Interactive actions and transitions to verify | iOS simulator | Android | Physical owner sign-off |
| --- | --- | --- | --- | --- |
| Home `/` | Navigation tabs, search/find entry, hero and return path | PENDING | PENDING | PENDING |
| Memories `/memories` | List, pagination, open details, edit, back, delete/cancel | PENDING | PENDING | PENDING |
| Add `/add` | Required title, all dropdowns, create-new, keyboard, save, cancel, persistence | PENDING | PENDING | PENDING |
| Card `/card` | Details, edit, share, photo viewer, reminder linkage, return | PENDING | PENDING | PENDING |
| Photos `/photos` | Add unattached/attached photo, thumbnail open, pinch zoom, next/previous, close, persistence | PENDING | PENDING | PENDING |
| Reminders `/reminders` | Date/time, linked/detached notification, completed/past state, save/cancel | PENDING | PENDING | PENDING |
| Find `/answers` | Query, empty results, photo results, keyboard dismiss, detail navigation | PENDING | PENDING | PENDING |
| More `/more` | Settings, appearance, backup/export/import, accessibility, navigation | PENDING | PENDING | PENDING |

## Acceptance protocol
1. Use a dedicated QA fixture and isolated simulator; preserve existing SB39 QA installation and user data.
2. Record each control's expected result, actual result, screenshot/video path, build SHA, simulator OS, and pass/fail in a follow-up evidence log.
3. Reproduce failures, add a regression test, fix and commit; rerun the affected path and whole QA suite.
4. Repeat high-risk save/return, linked reminders, photo viewer, offline restart and restore on Android and physical iPhone.
5. Do not mark device or store release PASS from build success, a static screenshot, or unit tests alone.
