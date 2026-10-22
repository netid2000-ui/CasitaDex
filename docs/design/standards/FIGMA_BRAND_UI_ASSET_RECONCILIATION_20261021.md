# CasitaDex — Figma Brand/UI Asset Reconciliation
Date: 2026-10-21 | Source: direct read-only Figma node inventory

## Authoritative Brand Master
https://www.figma.com/design/PGhz4VYfakXbLh5BFev1PH
Page `44:2` — 10 · UI icons — 24px masters:
- Home: `44:3` (editable SVG vector frame)
- Memories: `44:7` (editable SVG vector frame)
- Photos: `44:11` (editable SVG vector frame)
- Reminders: `44:16` (editable SVG vector frame)
- Find: `44:21` (editable SVG vector frame)
Page `2:2` — 02 · Vector Logo Masters:
- Primary full logo / light: `2:4`
- Reverse full logo / dark: `2:15`
- Icon-only / light: `2:26`
- Wordmark-only / light: `2:36`
Page `34:2` corrected vector icon marked QA CANDIDATE; page `35:2` size review marked candidate v2. Do not promote candidates without owner acceptance.

## Authoritative UI Master
https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr
- Approved governance text: `60:2` on page `26:2`.
- Existing Navigation/Five tabs schematic: `28:34` on page `28:2`.
- A.2 review baseline: page `27:2`.
- Apple authority page: `25:2`; Android authority page: `25:30`.
- Apple adaptation review page: `28:37`; Android adaptation review page: `28:264`.

## Corrective action
The redundant locally created component `58:16`, containing placeholder dots, was removed from UI Master. Original components and approved Brand Master assets were preserved.

## Remaining acceptance gates
[ ] Reuse exact Brand Master icon vectors in native navigation; verify identity/provenance and platform sizing.
[ ] Verify logo masters against the exact owner-approved corrected branding; distinguish candidates from approved assets.
[ ] Export approved Figma assets and compare app repository implementations; do not regenerate art.
[ ] Implement Apple and Android adaptations, test dark/light, accessibility and offline behavior on emulator/device.
[ ] Obtain owner visual acceptance; record screenshots, commits and hashes.

No application code changes or emulator acceptance are claimed by this audit.
