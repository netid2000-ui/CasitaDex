# SB-19 — Native Household Memory UI, Phase A
Date: October 16, 2026 CT. Owner: Designs by F&A. Status: implementation milestone; Android native acceptance pending.

## Governing owner decision
Charter v0.7 Amendment F / approved SB-18 interactive prototype: answer-first household memory; warm, legible design; Home/Find/Add/More; no inventory wizard or aggressive upsell; local records stay owned and accessible without an account.

## Code changed
- `src/app/_layout.tsx`: accessible four-tab **bottom** navigation with separate Android safe areas, 55px+ tab targets, icon+text labels and proper selected state. It replaces former top navigation.
- `src/theme.ts` / `src/ui.tsx`: refined light neutral/sage/evergreen palette, readable heading weights, 3:1+ control-boundary contrast, original dark mode and optional 200% text; existing inputs/actions retained.
- `src/screens.tsx`: Home search and quick memory capture CTA, recent answer cards, relevant Needs checking; Find answer-first search, optional Spaces browsing and Refine results modes preserving Buy/Fix/Find/Maintain, privacy-reviewed Share selected; answer cards improved. Repaired 15 preexisting corrupted UI display strings.
- Routes `src/app/index.tsx` and `src/app/answers.tsx` now use Home and FindHome. SQLite schema, local media, backups, verification, deletion and recovery code NOT changed.
- Browser tests updated for accessible tab semantics, visual labels and safe temporary test folders; regression coverage remains intact.

## Verified automated checks
TypeScript: PASS. ESLint: PASS. Development web export: PASS. Functional browser journey: PASS (18 checks). Accessibility: PASS (320px, 200% text, reduced motion, sharing). Appearance: PASS (light/dark/system). Browser durability: PASS (six realistic records, restart, edit, maintenance, delete, selective sharing, restore, offline retrieval). Node unit suite: 105 PASS / 0 fail. These are browser/source acceptance, NOT physical Android/iOS or human usability testing.

## Native and release gates remain open
No tracked `android` native project exists in the source checkout, so an isolated Staging APK build/installation is NEXT; do not misrepresent web acceptance as native. Secondary clean Pixel 8 Android 15 AVD has not had CasitaDex APK installed yet, and known `com.android.systemui` cold-boot ANRs persist intermittently on both original and clean device. Original Pixel 5 QA data/images must not be wiped. Independently test on 1.3/2.0 native font, TalkBack, offline creation/edit/search/reboot and iOS after Staging build.

Camera shooting, voice recorder, transcript, OCR, automatic BYOS, subscriptions and account connections are NOT implemented. Existing gallery attachment and manual complete backup/restore remain. An optional premium concept must not be displayed as purchasable.

## Native build resource plan
Primary Windows C: has ~16 GiB free, E: has ample capacity. Generate Staging Android only in an **isolated nonproduction worktree on E:** using local Java/SDK/Node toolchain, with Gradle caches on E:, without running `expo prebuild` against the authoritative C: project or modifying other apps. Do not publish or push. Generated APK for internal test only. If build is blocked by toolchain or credentials, document exact blocker without altering production.

## Next UI increments
Polish Add/Answer/More screens against approved SB-18 baseline, design clear camera/voice permission and local-media storage states, and retain accessible free recovery. Then native QA, moderated research and SB-17 separate stability acceptance.
