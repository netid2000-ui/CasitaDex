# SB-28 Branded CTA State Matrix — 2026-10-23

Figma UI master 39uzN0SZX8nlmcGDcHdQhr, Resource Intake page 143:2. Created isolated state review board 190:54, screenshot rendered successfully. Twelve A.2 CTA review-variant clones, each 366x49, labeled `Add Photo Memory`:

| Platform | Light Enabled / Focused / Disabled | Dark Enabled / Focused / Disabled |
| --- | --- | --- |
| Apple | 190:56 / 190:58 / 190:60 | 190:63 / 190:65 / 190:67 |
| Android | 190:70 / 190:72 / 190:74 | 190:77 / 190:79 / 190:81 |

Cloned from existing isolated semantic CTA review component set 141:2. Enabled/focused fills remain semantically bound; disabled fills remain literal. This is a design-state matrix, not evidence of functioning app interaction, focus rings or actual hitboxes. No approved A.2 source CTA, Apple/Android authority page, native library, or app code changed.

## Acceptance gates
Visual inspection against Warm Editorial A.2; quantify disabled-state usability and focus-ring visibility; test pressed state, text scaling/overflow, 44pt Apple and 48dp Android hit targets, VoiceOver/TalkBack, and native offline behavior. State clones are review-only pending owner acceptance and SB29 implementation mapping.