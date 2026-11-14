# Targeted native large-text gallery checkpoint — November 14, 2026

Status: PARTIAL PASS; accessibility corrections remain open.

Mac mini FA-MAC-DEV-01 only. Visible Device Hub iOS 27.0 simulator 879C620A-5318-4BDF-98B9-904EE635B053. Isolated com.designsbyfa.casitadex.pluswindowqa, JS source 1f00b67; existing SB40 native shell, 200 synthetic photo memories. Original app/data unchanged.

Verified by desktop interaction at accessibility-extra-large:
- After relaunch, Photos heading and instructions wrap correctly and gallery uses one column.
- Fixed action strip stays above scrolling gallery; horizontal swipe reveals Compact and sort controls.
- Sample photo loads and opens the correctly titled viewer.
- Close returns to the same visible gallery position (before/return screenshots).

Open defects:
- Changing system text size while Photos is already mounted leaves heading and instructions clipped. Relaunch corrects it; cause not yet established.
- At this size the viewer Previous label wraps inside a word and Reset zoom is partly below the visible bottom edge. Close remains visible and functional. No full large-text acceptance claimed.

Original simulator content_size restored to large and read back successfully; isolated QA app relaunched. Completed photo gesture/edit acceptance was not repeated. No source changes or new automated pass claimed. Evidence: native-gallery-evidence/large-text-*.png. Next: fix live text-size reflow and viewer control layout, then targeted recheck. Existing navigation parity discrepancy remains open.
