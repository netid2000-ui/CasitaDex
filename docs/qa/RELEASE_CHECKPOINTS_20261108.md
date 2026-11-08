# Release checkpoints — November 8, 2026

Execution: authoritative Mac mini and FA-Development SSD. CasitaDex baseline: owner-selected SB40. Source fix: 775cc7d plus b053c44. This is a progress record; unchecked acceptance is not a pass. No physical phone, production service, store submission or release merge was changed.

## Checkpoint 1 — parity tools: COMPLETE

- [x] Maestro local CLI and pinned Pixelmatch configured.
- [x] Wrong-artifact guards reject mismatched iOS bundles and Android APKs.
- [x] iOS Home/Add/inline Location reference comparison passed the configured threshold.
- [x] Android cold-boot blocker cleared by a stabilized retry; Home/Add/inline Location compare with zero differing pixels after documented masks.
- [x] Accessibility Scanner installed from official Google LLC Play Store listing; service and shortcut configured.
- [x] First Accessibility Scanner Home snapshot completed: six suggestions, comprising five unexposed-text candidates and one Settings touch-target candidate. These are findings to triage, not an accessibility pass. Hierarchy inspection interrupted scanner controls; operating the observed controls without hierarchy inspection produced the scan.
Full accessibility acceptance, including VoiceOver/TalkBack and triage of these six findings, remains under Checkpoint 3.

## Checkpoint 2 — archive/recovery navigation: COMPLETE

- [x] Confirmed old Settings handlers wrote a cache ignored by the active Find screen.
- [x] Settings sends an explicit lifecycle to the active Find route; results select only that lifecycle.
- [x] Active, Archived and Recently Deleted retain separate query/scroll contexts.
- [x] Recovery provides an explicit View archived memories action and retains View recently deleted memories.
- [x] TypeScript passed; targeted lint passed. Source suite: 426 total, 420 passed, zero failed, six skipped.
- [x] iOS SB40 QA shell received JavaScript-only update; all 168 memories survived installation unchanged.
- [x] Native iOS archive → Settings archive → restore → Recently Deleted → Settings recovery → restore → relaunch passed using one existing explicitly fictional QA record. The other 167 records, media metadata and draft remained unchanged.
- [x] Android QA AVD backed up with an APFS clone while stopped; matching-certificate APK installed with data-preserving update.
- [x] Android native archive → Settings archive → restore → Recently Deleted → Settings recovery → restore → relaunch passed with an existing explicitly fictional QA record. Guard verified the updated APK before UI execution.
- [x] Updated QA artifacts pass guarded Home/Add/inline Location capture and same-platform reference comparison. iOS: 0.03539% differing pixels per state within the 0.1% threshold; Android: zero differing pixels after documented masks. An intermediate Android comparison correctly requested review because the testing shortcut overlay was visible; disabling that overlay and recapturing resolved it without changing the masks.

Permanent deletion remains disabled in SB40. This checkpoint does not introduce irreversible cleanup. Original reference artifacts and the owner's iPhone remain unchanged. These are QA-shell JavaScript updates, not newly compiled/signed store candidates.

## Checkpoint 3 — remaining native acceptance

- [ ] Complete photo/gesture limits and media workflows.
- [ ] Complete full backup/restore and failure recovery.
- [ ] Verify OS-level offline persistence and reconnection.
- [ ] Verify notification taps in foreground, background and terminated states.
- [ ] Complete large-text, VoiceOver and TalkBack acceptance.

Existing passed evidence should be reused where applicable; unfinished cases stay unchecked.

## Checkpoint 4 — Figma

- [ ] Reconcile remaining visual states with accepted SB40 masters.
- [ ] Update archive/recovery route and control mapping for this fix.
- [ ] Clearly distinguish proposed monetization from implemented/accepted flows.

## Checkpoint 5 — Event Command

- [ ] Pin approved iOS/Android artifact identities.
- [ ] Add shared native parity journeys and close remaining release defects.

## Checkpoint 6 — physical devices

- [ ] Samsung acceptance after simulator/emulator gates pass.
- [ ] Owner's final iPhone sign-off.

## Checkpoint 7 — store candidates

- [ ] Monetization, sandbox purchases and restore-purchase acceptance.
- [ ] Privacy disclosures, screenshots, signing and release checklist.
- [ ] Explicit owner authorization for release merges/store submission.

Release status: NO-GO while release gates remain unchecked. Full raw native evidence resides under QA-Evidence/CasitaDex/sb40-lifecycle-checkpoint-20261108; selected provenance, journals and screenshots are committed with this report.

## Calibration and retained evidence

Native attempts that failed before final acceptance remain recorded in raw logs. iOS needed an explicit app foreground handoff and a reachable bottom-row bound. Android Back-based keyboard dismissal navigated Home when no soft keyboard was displayed; using Search submit resolved this without changing product behavior. The first Android lifecycle Maestro attempt remains FAIL; the v2 journey is PASS. An intermediate screenshot comparison with the Scanner shortcut visible remains REVIEW_REQUIRED; clean capture is PASS. No failed run was rewritten as a pass.

The Google scanner service/shortcut overlay is paused on the QA emulator for clean functional screenshots. Scanner remains installed, and its prior settings and six-suggestion result are preserved. Full accessibility acceptance is still open.
