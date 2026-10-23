# SB-28 Focus and Disabled Accessibility Audit — 2026-10-23

Live Figma branded CTA state board 190:54, twelve specimens inspected. Gold focus stroke RGB (.95,.65,.25) weight 3 on enabled fill: Light button contrast 4.84:1; Dark light-sage button contrast 1.43:1, FAIL non-text focus indicator 3:1 threshold against adjacent button color. Gold versus white panel 2.04:1; further focus boundary/context testing required.

Disabled literal gray background RGB (.53,.58,.55): Light cream label contrast 3.01:1, Dark deep-green label contrast 3.88:1. Disabled/inactive controls may be exempt from WCAG contrast requirements; usability and state differentiation still require review.

## Isolated remediation
Created review-only Figma board 192:54. Apple dark focus candidate 192:55 and Android dark focus candidate 192:57 cloned from approved A.2 review specimens, with 3-unit INSIDE stroke bound to semantic text/primary (VariableID:29:6), which resolves to light cream in Dark mode. IMPORTANT: cream against light-sage button may also lack 3:1 contrast; this is an exploratory candidate, not a passing remediation. Verify measured contrast before acceptance. No source CTA, platform authority screens or app code changed.

## Gates
Select tested focus color/placement with >=3:1 against adjacent colors, preserve visible keyboard focus, confirm dynamic type and effective hit areas on iOS/Android. Disabled readability and pressed feedback pending.