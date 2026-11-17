# Settings return controls — November 17, 2026

Owner requested the same Settings return action on Archived Memories and Reminders as other Settings options. All implementation/build/native checks run on FA-MAC-DEV-01. Baseline bf64b52; feature branch work/cd-settings-return-20261117; source commits 378df82 and b6b2f7b.

## Change
- Settings links explicitly pass origin=settings to Archived Memories and Reminders.
- Both destinations show the shared horizontal-line `‹ Settings` action, returning to /more.
- Reminder Add/Edit carries the origin; unlinked Save and Cancel retain the Settings return path. Linked Save still returns to its original memory, and Home-origin flows retain Home.
- Bottom Find and Reminders tab entries explicitly clear Settings origin, preventing a stale return action on ordinary tab visits.
- Existing archive/search context and approved Home → Photos → Reminders → Find navigation remain unchanged.

## Automated
TypeScript PASS, full ESLint PASS, 539 tests passed, 1 skipped, 0 failed (540 total). Added a focused destination regression covering Settings origin and linked-memory precedence. The remaining skip requires the historical SB38 artifact.

## Native evidence
Android emulator: PASS in light/normal and dark/200% text. Both return actions, reminder editor Cancel, and direct tab origin reset passed. Original emulator font/night settings restored.
iOS simulator: PASS, 1 native test / 0 failures in light/normal configuration.
Physical iPhone: signed QA update installed in place; PASS, 1 native test / 0 failures using existing dark/normal settings. Screenshots are attached. This is automated native verification, not owner acceptance.
Samsung: PASS in light/normal and dark/200% text, both Settings returns, reminder Cancel and direct tab origin reset. Updated in place; installed APK hash on Samsung and emulator matches the build hash below. Original Samsung font 1.0 and dark mode restored. Optional Play Protect upload was declined; device protection settings unchanged. Screenshots visually reviewed on all four targets; return controls are readable and unclipped.
The final native tests navigate and cancel; actual Save routing is covered by focused unit tests rather than creating extra saved reminders.

### Build identity
Android package `com.designsbyfa.casitadex.refreshqa`, APK SHA-256 `ceac56911b8d550f1b4c0b4c584dbf3e2569f03d8bb160f379893b3312a90ca2`.
iOS QA bundle `com.designsbyfa.casitadex.plusstoreqa`; physical main.jsbundle SHA-256 `67e370d93659d36deb02c6b44229e9b40bddf767d8c925544916cf86bed4ea49`. Strict codesign verification passed. Final builds use source b6b2f7b.

### Harness failures retained
Initial Android run passed normal text but selected the bottom Reminders tab instead of the offscreen Settings button at 200%; fixed by matching the button role.
iOS r2 similarly selected the tab; r3 selected the Find heading instead of its tab; r4 failed harness compilation because XCUIElementQuery has no lastMatch. Corrected role/index selectors in r5 passed. Earlier failed runs remain failures and logs are retained.

 Android release, iOS simulator and signed physical iPhone QA builds succeeded. The initial iOS harness was a physical-only runner and could not install on the simulator; rerun uses the established simulator runner. This was a test-harness setup failure, not an app test pass or product defect.

## Scope
This changes navigation behavior using the already approved Settings return control; no Figma visual redesign. Existing QA identities are updated in place, with no uninstall/data-clear. Native checks navigate and cancel only; no memory/reminder saves, taxonomy changes or deletion. No main merge or store submission.
