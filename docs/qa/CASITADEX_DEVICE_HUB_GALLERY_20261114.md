# Visible native gallery check through Device Hub
Date:2026-11-14
Source tested:1f00b67
Machine:FA-MAC-DEV-01
Simulator:879C620A-5318-4BDF-98B9-904EE635B053 / iOS27.0
App:com.designsbyfa.casitadex.pluswindowqa

## Blocker correction
Device Hub displays the booted simulator directly. Double-clicking CasitaDex FigmaFirst Isolated QA opened a visible live device window.
The earlier claim that Simulator.app was required was too narrow. Screen sharing is enabled; visible verification can continue through Device Hub.

## Fixture and results
Separate QA app only: existing database backed up outside repository before adding197 synthetic sample-photo memories, for200 photos total.
Candidate snapshot passed validateEngSnapshot before writing isolated QA SQLite state. Existing accepted SB40 app/data untouched.
Visible desktop actions through Device Hub:
- Photos displayed200 photo memories.
- Repeated scrolling passed initial image window; visible later-card photos loaded.
- Add Photo Memory, Grid/Compact and sort actions stayed fixed.
- Opened Gallery013; viewer title and image matched.
- Closed viewer; Gallery013 and surrounding cards returned to the same visible positions.
- Switched Compact; gallery returned to top with photos visible.
Evidence: gallery013-before.png, gallery013-viewer.png, gallery013-return.png, compact-top.png in adjacent native-gallery-evidence directory.

## Automated result
Maestro job18feaf2811c4d895 FAILED at initial200-photo assertion: reported Photos tap completion but screen stayed Home.
No automatic PASS claimed. Direct desktop input navigated successfully; resulting visible checks above were manually operated by agent.
The Maestro flow is retained as a failing automation attempt for diagnosis, not a passing test.

## Boundaries
Current JS/assets in existing compatible SB40 native shell with separate QA identity; not a full native rebuild or store candidate.
No process-memory, frame-time,1000-native-photo, physical-device, rotation, large-text or native large-backup acceptance claimed.
Existing photo zoom/edit acceptance not repeated.
Navigation baseline discrepancy remains separately recorded; no navigation changes made.
Figma board1006:17 reconciled.
