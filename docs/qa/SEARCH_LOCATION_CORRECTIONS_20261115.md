# CasitaDex — Search and Location correction return

Date: November 15, 2026. Execution: FA-MAC-DEV-01 exclusively.
Baseline: `75398f0` on `work/cd-samsung-ui-corrections-20261115`.
Branch: `work/cd-search-location-corrections-20261115`.
Implementation commit: `3536a37`. Subsequent commits contain final evidence and this report.

## Implemented

- [x] Home Search Memories uses the shared outlined button, standard typography, padding, radius and chevron.
- [x] Home search and Find-tab entry explicitly start a fresh search with an empty query and `Search memories…` placeholder. Tapping the current Find tab also starts fresh.
- [x] Returning from Memory Details retains the active query, filters and page. Clearing query text retains selected filters.
- [x] Location filter reuses existing saved Location semantics: case-insensitive trimmed name plus Space identity. Choices are alphabetical, scoped to a selected Space, and show Space names when unscoped. All clears the selection. Changing to an incompatible Space clears Location.
- [x] Location combines with text, Space, Category and photo filters; filter changes reset pagination. Existing saved-memory data is not rewritten.
- [x] Find now consumes its paging props. Previous/Next and page counts work. An additional native check exposed the first result hiding behind sticky controls after Next; the final build corrects that scroll offset.
- [x] Responsive wrapping preserves Home → Photos → Reminders → Find. Legacy Edit corrections remain intact.

## Verification

| Layer | Actual result | Evidence |
|---|---|---|
| TypeScript | PASS | `typecheck-final.txt` |
| ESLint | PASS | `lint-final.txt` |
| Automated suite | 515 passed, 6 skipped, 0 failed; 521 total | `tests-final.txt` |
| Focused regression | Fresh/return context, exhaustive filter combinations, scoped duplicate Location names, alphabetical choices, page reset/clamp | `tests/find-search-location.test.mjs` |
| Android build | Final release QA APK built successfully | `android-build-final.txt` |
| Android emulator | Search, Location, combined filters, clear, paging, nav and Home/Find geometry passed in Light/Dark at 1.0/2.0 on first candidate. Final candidate passed query+photo context and Page 2 return with first result visibly below sticky filters. | `emulator-5554/`, `emulator-context-final.txt` |
| iOS build/install | Final isolated simulator app built and installed; installed JS bundle hash verified | `ios-build-final.txt`, `build-identity-final.json` |
| iOS targeted XCTest | Three distinct cases passed: fresh/query/detail/clear; selected Location/detail/All; final paging/detail/return. Initial invocation repeated its first case; that duplicate is not counted as independent coverage. | `ios-test-summary.json`, `ios-location-summary.json`, `ios-paging-summary.json` |
| Samsung installation | Final installed APK hash matches build | `samsung-install-final.txt`, `build-identity-final.json` |
| Samsung acceptance | PASS: 24 targeted checkpoints across search/navigation and Light/Dark at 1.0/2.0; query+photo and Page 2 detail-return checks passed. | final Samsung logs and device evidence |
| Owner acceptance | Pending physical iPhone and owner review | Not claimed by this batch |

The emulator four-way matrix was not unnecessarily repeated after the single scroll-offset fix. The final candidate was rebuilt on both platforms and the affected paging/context paths reverified. iOS checks are focused functional parity; this batch does not claim a complete iOS large-text/theme or physical-device acceptance sweep.

## Installed identities

Android package: `com.designsbyfa.casitadex.refreshqa`, version 0.1.0 (1).
Final APK SHA-256: `c59681bd4d5aed47d4ff376506bec7610baea4a217843bf26a93bf6359a499ae`.
Installed hash verified on emulator `emulator-5554` and Samsung `R5GL83X0K3N`.

First candidate SHA-256: `7297b2138bc0ed09cbae5e37f1d0ed56fff8cf227cd95aa6770d16fd7790a15e`. It is superseded by the final scroll-offset correction.

iOS simulator package: `com.designsbyfa.casitadex.plusstoreqa`, iPhone 18 Pro simulator `81FC3CCE-ACEB-4957-BE61-C9C653A4CE56`.
Final installed JS bundle SHA-256: `7893c87f4809adca4c6e98418df157296430c3fec77f3d75f7e68741a493c544`.
This is simulator installation, not an owner-accepted physical iPhone build.

## Figma reconciliation

[Approved CasitaDex design](https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr/?node-id=436-2).
Editable primary Light/Dark Home and Find frames were updated, preserving Cormorant Garamond/Inter, the approved palette and four-tab navigation.

| State | Light node | Dark node |
|---|---|---|
| Home | 429:2 | 950:2 |
| Fresh Find | 436:2 | 975:2 |
| Active query / Clear | 1563:11 | 1563:74 |
| Location picker | 1560:65 | 1560:135 |
| Selected Location | 1560:10 | 1560:80 |

Location All/selection, active-query Clear and result-return prototype context were reconciled. Primary screenshots were reviewed. Native emulator Home and enlarged Dark Find, final Samsung enlarged Home/Find/Location picker, plus iOS Find, were visually reviewed for the scoped controls; pixel-identical rendering across platforms is not claimed.

Remaining design discrepancy: older standalone Space/Category/photo-combination prototype variants retain their previous three-filter presentation. They were not broadly redesigned during this scoped correction. The primary Home/Find, active query and Location states are updated; full-file reconciliation is not claimed.

## Data preservation and diagnostic history

Original Samsung text memory, four-photo memory, saved Location and radio/font settings were recorded before installation. Final preservation result: PASS: original saved text, four-photo memory and saved Location retained after cold start. Font 1.0, System appearance and original airplane/Wi-Fi/mobile-data settings restored. App left on Home.
No app-data clearing, uninstall, saved-memory editing, household sharing, production writes, purchases, store submission or main merge occurred. Existing dirty worktrees were inspected and preserved. All implementation/build/test execution occurred on the Mac mini.

Initial harness failures were retained: an inherited Samsung screen cutoff missed emulator tabs, and an assumed Space had no Locations. Those were corrected harness assumptions. The separate page-return test found a real app defect and drove the final scroll fix. The Samsung Previous assertion initially failed because the harness tapped a pager node covered by sticky filters, toggling the photo filter. After revealing the pager, Previous passed; the remaining matrix resumed from that checkpoint without repeating completed search checks. Raw unsuccessful logs are diagnostic evidence, not passes.
The first Samsung install job was cancelled before completion was observed; later package metadata showed the intermediate candidate installed. Final install used replacement mode without data clearing. Google Play Protect asked to send this unknown QA app for scanning; the optional upload was declined, after which installation succeeded. No device security setting was disabled.

## Release decision and next batch

This batch does not establish store readiness. Remaining gates include owner physical iPhone acceptance; iOS large-text/theme coverage for this change; remaining Figma filter variants; and the prior sweep's separate manual TalkBack, camera/library import and store-purchase acceptance gates. Six existing automated skips remain recorded, not converted to passes: five require the external CASITADEX_SB24_ARCHIVE fixture, and one requires an isolated iOS release artifact absent from this source worktree. The tested iOS build is Debug.

Next super-batch: finish the remaining scoped Figma variants and native accessibility/parity gates, prepare the current candidate for owner iPhone review, and reconcile the release checklist with existing evidence. Begin household sharing only after these corrections and native acceptance are complete. No release or main merge is authorized by this report.

[Evidence directory](evidence/search-location-20261115/). [Acceptance scripts](../../scripts/search-location-20261115/README.md).
