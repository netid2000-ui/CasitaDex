# SB-29 Live Figma Android Home Discrepancy Review — 2026-10-24
Authority: Figma UI file 39uzN0SZX8nlmcGDcHdQhr, Android Home node 28:265 (live metadata and design context inspected).
Figma frame name: Android · Home · NEEDS MATERIAL 3 VALIDATION. This is a candidate, not approved implementation.

## Verified design details
- Frame: 410 x 884, warm page #F7F2E8.
- Header: 370 x 81 at (20,56); actual original PNG absent, explicitly placeholder at 28:269.
- Heading: 'The details that matter.' 25px; eyebrow 'YOUR PERSONAL REFERENCE'; supporting line 'A calmer place to keep useful things.'
- Three shared action cards: 370 x 78, dark green #1E4635, radius 17, vertical positions 290/384/478.
- Upcoming reminder heading and one sample reminder card; bottom five-tab nav 86px tall with Home highlighted.

## Candidate code gaps (NOT ACCEPTED)
- FigmaHome currently uses 'What would you like to remember?' rather than verified Figma heading/eyebrow/supporting line.
- No shared brand header, original approved logo asset, or persistent five-tab navigation in candidate.
- ReminderPreview lacks the observed white card/accent rule/View all navigation styling and semantics.
- Current Home uses generic spacing rather than platform-specific frame composition; device-size and text scaling unverified.
- Draft messaging is owner-required but not shown in this particular Figma candidate; must be reconciled in Figma before final visual acceptance.
- Figma node is explicitly marked NEEDS MATERIAL 3 VALIDATION and the logo slot awaits original PNG.

## Gate
Do not claim visual match, material validation, owner approval, or production readiness. Preserve Figma as design authority; resolve candidate discrepancies in Figma before promoting live routes. Apple Home and remaining pages still require live frame review.
