# SB40 photo controls review changes

Implemented and tested exclusively on FA-MAC-DEV-01 using the existing SSD checkout and branch work/cd-sb40-authority-source-20261108. Application source and installed JavaScript: **c5eb43d**. Package: com.designsbyfa.casitadex.sb40qa. Existing retained SB40 native QA shells; not a fresh native compile or store build. Prior artifacts remain retained separately.

- [x] Find uses a distinct bordered, filled button labeled **With photos only**, with selected state and check mark. Filtering behavior unchanged.
- [x] Photos Add Photo Memory, Grid/Compact and ordering controls stay fixed above the scrollable gallery.
- [x] Toolbar uses two compact rows at standard phone text size, tighter padding and gaps, with 48-point minimum touch targets and wrapping for larger text.
- [x] TypeScript and targeted lint passed; source suite: 426 passed, 0 failed, 6 skipped.
- [x] iOS and Android native UI: gallery moves while all five toolbar control bounds remain unchanged; view/sort actions work; new Find button label and selection toggling pass.
- [x] Installed bundle/APK hashes checked against generated artifacts and recorded in the [target manifest](sb40-sticky-controls-20261108/targets.json). iOS native executable remains unchanged. QA parity pins updated intentionally for this new implementation.
- [x] iOS complete saved snapshot equals pre-update backup. No memory/photo mutation performed by focused checks.
- [ ] BLOCKED: Android before/after private snapshot audit. run-as reports `package not debuggable`; output files named .tar contain denial text, not valid backups. No access bypass attempted. The Android data-preserving install -r completed successfully, but full snapshot equality is not verified.
- [ ] Full large-text/landscape/screen-reader checks, manual pinch, prior Android core journey failure triage, broader offline/backup/notification/security checks and physical/store gates remain open. These focused checks do not certify release readiness.

Initial iOS UI run failed to locate the Photos tab by label. The existing pinned native tab coordinate was used on the subsequent run, which passed. Raw failure screenshot remains on the SSD. No product implementation change was needed for that harness issue.

[Selected screenshots, checks and evidence](sb40-sticky-controls-20261108/). Full artifacts, prior app/data copies and raw logs remain under QA-Evidence/CasitaDex/sb40-sticky-controls-20261108 on FA-Development. No owner-reference/physical artifacts altered. No production access or release action performed.

Next checkpoint: review this presentation, then resume outstanding Android journey triage and photo acceptance gates. Figma reconciliation of this refinement remains open; no owner-reference master was overwritten.

Provenance correction: the retained native code was unchanged, but re-signing changed the signed executable hash. See [independent signature reconciliation and subsequent QA pins](SB40_RESPONSIVE_PHOTOS_ACCEPTANCE_20261108.md).
