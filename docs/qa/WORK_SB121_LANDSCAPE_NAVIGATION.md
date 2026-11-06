# WORK-SB121: maximum-text landscape navigation candidate

2026-11-06 UTC. FA-MAC-DEV-01 only. **Source and browser proxy PASS; native acceptance PENDING; release NO-GO.**

## Verified defect and scope

Clean base `9e53d5bd14e4a96d63da9f7d9a6faee7a8073307`, authorized branch `work/cd-sb41-edit-targeting-20261104`. Official XCTest at maximum iOS text, dark landscape 874×402, exposed only navigation: safe-area width 750pt, four full-width tab rows, navigation height 382.3pt, and no page ScrollView/headline. This is not merely below-fold content. Original native evidence: `QA-Evidence/WORK-SB121/ios-current-journeys/native-a11y-9e53d5b-photos-max-landscape-native/`. The maximum portrait case independently passed and remains a regression requirement.

## Bounded correction

- Keep the exact approved Home / Photos / Reminders / Find destinations and ordering. Preserve owner warm editorial Home, original assets and icons, routes, guarded tab navigation and reminder-response handling.
- Replace percentage flex-basis and flex-wrap with explicit rows. The unchanged safe-width/font-scale threshold selects one row of four or two rows of two. Each row stretches to its actual parent safe width; its children share that width. Rotation cannot turn the wrapped layout into four independent full-width rows.
- Keep scalable labels without truncation, font caps, icon-only alternatives or gesture-only navigation. Labels stretch within each equal-width tab, allowing full multiline wrapping. Minimum target remains 55pt, with original active/pressed colors and top/bottom padding.
- No height cap, hidden overflow or forced page shrink workaround. Page retains its existing scroll container. Tall content may be below the fold, but must remain reachable in a nonzero usable viewport.
- No package, lockfile, Metro, Home, native build/project, simulator, notification, storage, network or authoritative checkout mutation by this worker. Source snapshot and all evidence are isolated on the external SSD.

## Verification

- PASS typecheck, lint, clean patch application check.
- PASS 22 focused tests including 13 new safe-width/font-scale/rotation/source-contract cases.
- PASS full test suite: 432 tests, 427 passed, 5 existing skips, zero failures.
- PASS web export and current-home-browser actual app journeys: exact four tabs/order, all Home actions, single accessible brand, Home Find and Settings, retained Browse, every tab route/selected state, native-only editor boundary and no page errors.
- PASS 8 geometry proxy cases from actual shell and navigation styles rendered by React Native Web. Window dimensions, safe insets and text metrics are controlled; the page is a deliberately long scrollable fixture, not native Home. Every tab is at least 44px, text is unclipped, safe areas hold, and the final content action scrolls fully into view.
  - Ordinary 402×874: one nav row, 707px content.
  - Ordinary 874×402 with 62px horizontal insets: one row, 311px content.
  - Narrow 320×568: two rows, 417px content.
  - Maximum 402×874 portrait, dark: two rows, 533px content.
  - Maximum 874×402 landscape, dark and light: two rows, 187px content.
  - Maximum 844×390 landscape: two rows, 174px content.
  - Maximum 568×320 landscape: two rows, 125px content.

Proxy text uses scale 3.571 as a conservative test value, not a captured iOS runtime fontScale. Browser geometry does not qualify native Yoga, Dynamic Type, VoiceOver or physical devices. Screenshots exist but were not independently pixel-reviewed because the authorized file-transfer tool denied transfer on this account. Numeric DOM checks and route interactions completed successfully. No transfer workaround was attempted.

## Design mapping and remaining acceptance

Existing reviewed Figma Home frames remain unchanged: Apple `39uzN0SZX8nlmcGDcHdQhr`, node `321:36`; Android node `321:163`. This is a structural correction to the previously documented two-by-two accessibility adaptation, not a new approved visual design.

Parent owns integration, native builds and both reserved iOS simulators. Required rebuilt native checks: actual maximum Dynamic Type 874×402 dark/light, two accessible rows with full labels and all four targets >=44pt, visible nonzero page viewport, scroll to and activate critical Home/Photos/Reminders/Find actions, portrait/landscape rotation both ways, selected states/guards, safe areas, no clipped labels. Repeat ordinary four-tab/Home baseline and maximum portrait regression. Manual VoiceOver, Android parity and final owner iPhone signoff remain open.

## Reproduce

Source environment: `. /Volumes/FA-Development/Designs-by-FA/Release-Gates/fa-qa-mac-env.sh`. Node v24.22.1. From the isolated source: `npm run typecheck`, `npm run lint`, `npm test`, and `CASITADEX_NAV_EVIDENCE=<evidence>/geometry node tests/primary-navigation-geometry.cjs`. Browser requires the already-installed Microsoft Edge/Playwright. No dependency install is needed.

Evidence root: `/Volumes/FA-Development/Designs-by-FA/QA-Evidence/WORK-SB121/landscape-navigation-9e53d5b/`. The immutable implementation patch is `landscape-navigation.patch`; the separate geometry-test/documentation patch is `landscape-navigation-evidence.patch`.
