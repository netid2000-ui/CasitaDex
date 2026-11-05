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

## Browser smoke triage — 2026-11-04
- Original `tests/browser-smoke.cjs` timed out waiting for `Explore example home`; this label belongs to the legacy `src/screens.tsx` example UI, not the current Expo Router `src/app/index.tsx` which renders `EngHome`.
- Current-home browser test `tests/current-home-browser.cjs` passed: Add Memory, Add Photo Memory, Add Reminder visible; mobile width fits; no page errors.
- `npm run test:browser` now targets current home; `npm run test:browser:legacy` retains the older scenario for historical comparison. This does **not** establish full current workflow coverage.
- Next: implement deterministic interactions for create/edit/save/return, photo viewer, reminders, search and settings; run on native simulator and Android with evidence.

## Current four-tab browser navigation — 2026-11-04
- Added automated click-through for Home, Photos, Reminders and Find, verifying route URL, selected state, horizontal fit, and no runtime page errors. All four pass against the locally served current web export.
- Initial attempt incorrectly expected a fifth Memories tab; current approved UI exposes four bottom tabs. The browser role query also returned no tabs, so tests use explicit `[role=tab][aria-label]` selectors and verify `aria-selected`.
- These are browser checks only; native touch, screen-reader behavior and CRUD remain pending.

## Create/edit browser boundary — 2026-11-04
- Attempted browser Add -> title -> answer -> Save -> Details -> Edit -> Save test. Browser `/add` intentionally renders `Full ENG requires the native Development app`, with no editor input fields. The test failed waiting for the title textbox; this is a platform capability boundary, **not evidence of a native Save defect**.
- Replaced the invalid web CRUD assertion with a passing check that Add navigation opens `/add` and correctly displays the native-only gate.
- Native create/edit/save/return and persistence remain PENDING. They require native simulator interaction tooling and screenshots before sign-off.

## Maestro native iOS acceptance — 2026-11-04
- Installed Maestro CLI 2.12.1 discovered at `~/.maestro/bin/maestro`; requires `JAVA_HOME=/opt/homebrew/opt/openjdk@21` and Java 21 in PATH.
- `.maestro/casitadex-native-smoke.yaml` PASS (exit 0) on isolated iOS 27.0 simulator: launch, Home, three primary actions, Add Memory tap and Add screen.
- `.maestro/casitadex-native-create.yaml` FAIL (exit 1): title and answer input commands, keyboard dismissal, Save button scroll and tap completed; expected answer did not appear. Post-failure UI hierarchy remained on Add screen with message `Add a name and either an answer or a photo`. Evidence: `~/.maestro/tests/2026-11-04_153230/casitadex-native-create/` and `/tmp/casitadex-maestro-create-20261104.log` on Mac mini.
- **Open defect / investigation:** determine whether native input events failed to persist to the draft, a draft checkpoint race occurred, or the save attempt validated empty fields. Do not claim save/edit acceptance until reproduced, fixed and rerun.

## Native input diagnostic follow-up — 2026-11-04
- Reconnected AI Commander Mac mini successfully (agent 1.6.4); previous remote execution blockage cleared.
- Ran `.maestro/casitadex-native-input-diagnostic.yaml` to assert the title field before typing. The Add Memory tap command completed but the title-field assertion failed. Maestro hierarchy at `~/.maestro/tests/2026-11-04_153748/` showed the **Home** screen, not Add. This introduces an intermittent or state-dependent navigation concern; the initial native smoke had successfully reached Add.
- No reset/clear-data was performed. Preserve the existing isolated simulator data and investigate navigation guards, draft restoration, and app initialization before treating text input as root cause.

## Draft-aware Maestro rerun — 2026-11-04
- Source inspection: Home deliberately disables Add Memory when `e.snapshot.draft` exists and instead shows Resume Draft. The earlier navigation failure is consistent with this state, not proof of a navigation regression.
- Updated `.maestro/casitadex-native-input-diagnostic.yaml` to branch on Resume Draft and Continue Editing without deleting data. Reached the native title input, entered text, and captured a screenshot.
- Exact-text assertion still failed; the captured accessibility hierarchy lists the title input under its accessibility label but does not expose the entered string as an accessibility text/value. This does not by itself prove text input was lost. Need inspect screenshot and persisted draft state or add testable native field identifiers before diagnosing Save.
- Latest Maestro evidence: `~/.maestro/tests/2026-11-04_155105/`; job log `/tmp/casitadex-title-input-b.log`. Native create/save remains PENDING.

## CD-SB41 — Native create/save recovery PASS (2026-11-04)
- Xcode simulator rebuild PASS, job `02b85744fe853690`, exit 0; installed on isolated iOS simulator, `simctl install` exit 0.
- Initial post-rebuild Maestro title assertion failed because tapping the visible label did not focus the actual input. Hierarchy showed separate label `[20,273][382,295]` and TextInput `[21,304][381,354]` bounds. Changing the tap to the input area yielded PASS, job `aca15f8c5f5779b8`, exit 0.
- Draft-aware create test now handles Resume Draft -> Continue Editing, targets the actual title and answer TextInputs, saves and asserts the answer on the resulting screen. PASS, job `a8418399b4867ca5`, exit 0; log `/tmp/casitadex-sb41-create-save-c.log`.
- This closes the native create/save subgate only. Edit/save/return/relaunch persistence still pending, as do Android parity and owner physical iPhone sign-off.

## CD-SB41 — Detail/Edit/Save navigation smoke (2026-11-04)
- Native simulator was shutdown between sessions; rebooted the isolated QA simulator without wiping data.
- Saved memory persists after app relaunch. The actual saved title is `Native input diagnosticMaestro QA memory 20261104 20261104` (the draft was resumed and typing appended), and the saved answer is `Maestro native answer`.
- `.maestro/casitadex-native-edit-return.yaml` uses the saved-memory accessibility label, opens Details, asserts answer, scrolls to Edit memory, opens editor, locates Save changes, saves without modifications, and asserts the original answer. PASS: job `7e5177295ffc7c4a`, exit 0, log `/tmp/casitadex-sb41-edit-existing.log`.
- This verifies relaunch persistence and edit screen/navigation smoke, **not** actual edited-field persistence; that subgate remains OPEN. Need input targeting and a changed-value assertion after relaunch.

## CD-SB41 edited-title persistence attempt — unresolved
- Mac mini isolated iOS simulator was booted. Maestro `.maestro/casitadex-native-edit-persist.yaml` entered a replacement title and tapped Save changes; the next answer assertion FAILED (job `73fdf6bd271c8ec2`, log `/tmp/casitadex-sb41-edit-persist-b.log`).
- Failure hierarchy still showed the edit form and Save changes, rather than Details. This may be a validation failure or incorrect input targeting. Do not mark edited-field persistence PASS.
- Follow-up: inspect field accessibility values and error status immediately after Save, replace percentage-coordinate tapping with a stable input testID, then rerun including stop/launch and persisted-value assertions. Preserve QA data.
