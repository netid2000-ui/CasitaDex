# SB-29 Native Android Acceptance Evidence — 2026-10-23

Scope: isolated QA package com.designsbyfa.casitadex.sb29qa on emulator-5580. No physical device, production deployment, or main-repository changes.
Source branch: work/sb29-figma-first; focus-ring fix commit ee179db.
APK: E:\s29\android\app\build\outputs\apk\release\app-release.apk. Build job 26da7b39abfec7db exit 0.

## Verified native results
- Light enabled CTA bounds before/focused/blurred: [82,392][638,508] in all three states. Zero measured movement.
- Light focus-example CTA bounds: [82,556][638,672] in all three states.
- Keyboard Enter activates Light and Dark CTAs: tap counter 0→1→2. Tab skips disabled Light; disabled Light/Dark remain unfocused.
- At 320dp viewport (640x1422 px, density 320) and 200% font: all six CTA variants accessible with scrolling. Light enabled tap count 0→1, Dark enabled 1→2, Dark disabled leaves 2.
- Normal app-shell smoke: Home, Memories, Photos, Reminders, Find selected successfully. No new data_app_anr in checked dropbox history; earlier ANRs at 11:21:15 and 11:26:34 remain unexplained.
- Emulator overrides restored to 720x1600 and font scale 1.3.
- Screenshot captured on development machine: E:\s29\sb29-zero-shift-200.png (not visually reviewed).

## Open gates
- Compare native screenshots against authoritative Figma Apple/Android design and record visual review.
- Investigate historical normal-shell ANR root cause; current non-reproduction is not root-cause closure.
- No integrated production acceptance, physical Samsung install, push, or deploy authorized.

## Preservation
Existing untracked docs/design/SB29_FIGMA_FOUNDATION_VALIDATION_20261023.md was not modified or staged.
