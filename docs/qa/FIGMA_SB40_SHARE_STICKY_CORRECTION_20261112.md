# Share Memory sticky header correction
Owner identified missed persistent top actions on Share Memory.
Corrected all eight dark sharing and preview states: 1079:64,211,270,329,751,810,880,1309.
Header outside independent scrolling body; solid background, divider and safe-area inset.
Live Safari on 1079:64: Share and Memory details stayed at the same y coordinates while content scrolled to bottom.
Standing rule recorded in Figma: every page with top actions keeps them persistent; verify before future owner review.
This correction retains Share Memory approval and leaves More Memory Actions pending.
No native photo tests, source or build changes.
