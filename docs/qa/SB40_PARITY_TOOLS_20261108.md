# SB40 local parity tooling — 2026-11-08

The free local stack is configured on the authoritative Mac mini and external SSD: Maestro CLI/Studio (existing installs), pinned Pixelmatch/pngjs (new isolated install), and Apple Accessibility Inspector (opened). Google Accessibility Scanner installation is blocked by the emulator Play Store sign-in screen. No credentials were entered, no cloud test service enabled, and no physical-device data changed.

The new guarded suite targets only `com.designsbyfa.casitadex.sb40qa`. Executable/bundle/APK and device/AVD fingerprints are pinned. Deliberately wrong hashes were rejected before UI execution on both platforms. Five historical `.dev` flows have been withdrawn from the active Maestro directory. The original SB40 reference artifacts are preserved separately from the patched QA builds.

Verified native captures on both platforms cover Home, Add Memory, and inline Location editing. Android additionally passed the shared create → find → linked reminder → originating Memory Details journey. Test memories are explicitly fictional and retained for review. Initial harness calibration failures are retained in results, not rewritten as passes. iOS initially failed a keyboard-dismiss step; the next attempt correctly refused an existing calibration draft. Finishing that exact synthetic draft and checking the revised iOS journey are recorded separately.

Visual checking compares each candidate to its own accepted platform reference, verifies screenshot hashes, rejects dimension mismatches, and produces diff images with explicit masks and a 0.1% maximum differing-pixel threshold. It never promotes a baseline automatically. See results.json for executed outcomes. A visual pass here covers only the three captured states; it is not complete Figma or release approval.

Apple Inspector availability is not an accessibility audit. VoiceOver/TalkBack, large text, full workflow coverage, and Event Command baseline calibration remain separate acceptance work. The independently known archive/recently-deleted cache defect is not resolved by this tooling setup.

Reproduction: scripts/parity/README.md. Machine-readable evidence: docs/qa/parity-20261108/results.json. Full raw logs and screenshots remain on the Mac SSD under QA-Evidence/Parity/CasitaDex.

Executed visual comparison: iOS Home, Add, and inline Location each passed the configured 0.1% threshold (0.05265% differing pixels each). Android reference capture was blocked by a native “System UI isn’t responding” dialog after cold boot, so Android visual comparison is NOT RUN; the guard verified the correct reference APK before this failure. Current QA emulator was restored afterward.

Final revised iOS shared journey: PASS (`shared-journey-v4-20261108`). The exact synthetic v2 draft was saved through native controls after accepting the system Open-link confirmation; no draft database edits or clearing were performed. Android shared journey v3 also PASS. Only the current household QA iOS simulator and current sb40_four_items Android emulator were left running; an unused iOS candidate was shut down without deletion.

## Google Play sign-in follow-up

Owner completed sign-in. Accessibility Scanner 2.5.1.896851528 was installed from the official Google LLC listing and opened on emulator-5554 / sb40_four_items. Its accessibility service and shortcut were configured. The sign-in blocker is resolved. First completed scan remains NOT RUN: scan-control verification is pending, and no accessibility pass is claimed. CasitaDex QA data and installed app were preserved.
