# CasitaDex SB40 draft editor native checkpoint

Mac mini FA-MAC-DEV-01, November 8, 2026. Source implementation 1c6edad, packaged as a Hermes update to the retained SB40 Android QA shell, installed on emulator-5554. This is focused QA acceptance. Release remains NO-GO.

- [x] Exact-source package identified by compactDraftHeader and scrollActions before Hermes compilation. Candidate APK hash matched the installed APK.
- [x] At font scale 2.0 in landscape, Resume Draft opens the compact header and scrollable editor. All five thumbnails and Save/Cancel are reachable. Open photo and Close return to the draft.
- [x] Cold app start with no active default network resumes the retained five-photo draft. The draft remains visible after network restoration. Original emulator display and network settings were restored.
- [x] Figma accessibility review note updated with verified behavior and remaining gates: https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr?node-id=392-33
- [ ] Save/Cancel mutations, complete photo mutation matrix, manual pinch, screen readers and final combined-build acceptance.
- [ ] iOS viewer b28ce68 maximum text in landscape and Return to Draft from the test entry path. Live text resizing and normal zoom/navigation passed in separate isolated iOS QA.
- [ ] Broader offline writes, full restore/failure recovery, notification taps in all lifecycle states, and Figma visual reconciliation.

An initial package lacked the candidate source markers and reproduced the old zero-height editor. A separate export cache plus an unminified source marker check corrected packaging. An initial follow-up harness assumed the editor stayed open after the display profile change. Resuming the retained draft explicitly corrected the test setup. Both unsuccessful attempts are retained on the SSD.

Local evidence: QA-Evidence/CasitaDex/sb40-compact-draft-editor-20261108/candidate-1c6edad-verified. No draft Save or Discard was executed in these checks.
