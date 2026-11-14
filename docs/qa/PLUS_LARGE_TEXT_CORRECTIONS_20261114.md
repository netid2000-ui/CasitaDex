# Large-text corrections — November 14, 2026

Completed the two targeted findings from aa81e4c in the isolated iOS QA app.

## Changes

Page heading/description and Photos summary/card labels now recreate their native Text node when system fontScale changes. This forces fresh native text measurement while preserving gallery/card/controller state. This is a scoped workaround for the observed stale measurement after a live system-size change, not a proven upstream root cause.

Viewer Previous/Next and zoom buttons stack at accessibility sizes or with the in-app large-text preference, preventing narrow columns and mid-word wrapping. The action scroll area adapts to 42% of window height (minimum 180 points), keeps a visible photo area, and retains fixed Close. Reset zoom is visible in the initial enlarged action area; lower controls remain reachable by scrolling.

## Verification

Mac mini FA-MAC-DEV-01 only; visible Device Hub simulator 879C620A-5318-4BDF-98B9-904EE635B053, iOS 27.0. Existing separate com.designsbyfa.casitadex.pluswindowqa app with 200 synthetic memories. Updated JS/assets bundled into a copy of the existing SB40 native shell; no native dependency change or full Xcode rebuild.

- TypeScript noEmit: PASS.
- ESLint for all three changed TSX files: PASS.
- Existing targeted photo/viewer/large/navigation tests: 32 PASS, 0 FAIL.
- Live system text-size change from large to accessibility-extra-large while Photos remained mounted: heading and instructions wrap correctly without restarting.
- Enlarged viewer: Previous and Next display whole labels on separate rows; Reset zoom visible; scrolling reveals both zoom buttons and Manage photos, with Close remaining fixed.
- Close returns to gallery. Live reduction to original large setting reflows correctly; setting read back as large.

Evidence: native-gallery-evidence/fixed-live-large-text.png, fixed-large-viewer-top.png, fixed-large-viewer-scroll.png, fixed-restored-text.png. Original app/user data unchanged. Prior photo gesture/edit acceptance not repeated. This closes these two observed defects for the tested simulator size, not full accessibility/physical-device acceptance or navigation parity. Long-title/extreme-size/landscape coverage remains outside this targeted check.
