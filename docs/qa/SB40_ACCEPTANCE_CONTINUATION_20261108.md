# SB40 acceptance continuation — checkpoint 1

November 8, 2026. Execution exclusively on FA-MAC-DEV-01.local as franciscofranco. Existing checkout on FA-Development: Designs-by-FA/Development/CasitaDex/sb40-authority-source-20261108. Branch work/cd-sb40-authority-source-20261108. Engineering source revision **872266348dbed915d6d5056e6e67f9dc912e21bf**; installed QA implementation **2b2022f**, retained SB40 native shells, package com.designsbyfa.casitadex.sb40qa. No application implementation changed or new artifact installed in this checkpoint.

## Passed

- [x] Exact Mac, SSD and clean checkout verified before testing. No AGENTS.md or .agents/skills found in checkout or inspected SSD parent chain.
- [x] Current jobs checked: retained sb40_four_items emulator and unrelated Event Command Mobilewright service. Preserved both; no existing CasitaDex test duplicated. One CasitaDex iOS simulator booted.
- [x] Live iOS executable/bundle hashes and Android APK/AVD match the existing pinned manifest. iOS A4ED0D8B-C90A-4940-9B71-4F570D7DC597; Android emulator-5554 / sb40_four_items.
- [x] Final installed iOS and Android Photos preview: Grid/Compact and ordering controls complete successfully. Visual screenshot comparison NOT RUN.
- [x] Final iOS core regression: Home/Add/inline Location editing and cancel; fictional memory create/find; reminder Save returns to originating Memory Details; photo preview.
- [x] Final Android Home/Add/inline Location capture and cancel completed before the later journey failure.
- [x] Native iOS saved photo fixture filled from two to five through library UI; settled native hierarchy exposes Add Photo disabled at five. QA fixture retained with five photos.
- [x] Read-only iOS audit after cap: original 168 records and media metadata unchanged; draft null. New clearly fictional core-regression memory retained.

## Failed and unresolved

- [ ] **FAIL:** Android composite regression stopped at journey Description selector (index 1), after title entry and hideKeyboard. Failure hierarchy and subsequent read-only hierarchy show Home. Cause not established; do not classify as a product regression or harness-only failure yet. Later save/find/reminder journey steps NOT RUN. No automatic rerun or app reset performed.
- [ ] **FAIL retained:** Initial iOS five-photo assertion could not find Add Photo while picker dismissal was still captured. All three additions had already succeeded. Subsequent read-only settled verification passed at five with Add Photo disabled; no additions were retried.

## Skipped, blocked and not run

- Prior source suite: 426 passed / 6 skipped, retained as prior evidence; not rerun because application code unchanged. No new skipped-test claim.
- Manual pinch remains BLOCKED for this automation route: existing Mobilewright rejects multitouch injection; no human gesture certification obtained.
- Android native five-photo cap and draft cap: NOT RUN in this checkpoint.
- Large text, landscape and VoiceOver/TalkBack acceptance: NOT RUN.
- Full final photo mutation replay, broader offline/reconnect, backup/restore, notification-tap lifecycle and security qualification: NOT RUN.
- Physical Samsung, owner iPhone sign-off and store gates: PENDING separate authorization/availability. No readiness claim.

## Evidence and next checkpoint

Selected [machine reports and logs](sb40-continuation-20261108/), including failures, are committed alongside this report. Full screenshots, command traces and screen hierarchies remain on FA-Development under QA-Evidence/CasitaDex/sb40-continuation-20261108 and QA-Evidence/Parity/CasitaDex/sb40-continuation-20261108T2042-{ios,android}. No databases or owner content exported to this report.

**Next open checkpoint:** Triage Android journey navigation/Description failure using retained command trace and current draft state, without recreating an uncertain operation. Then native Android five-photo cap, draft cap, changed-surface accessibility/landscape and remaining final-bundle photo regression. Broader qualification follows.

No cloud builds/tests/checkouts, production access, deployment, release merge, store submission, purchase, physical-device alteration or destructive data operation occurred. Both test jobs have completed; no new acceptance job left running.
