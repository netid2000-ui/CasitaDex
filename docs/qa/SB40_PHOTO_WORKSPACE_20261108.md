# SB40 Photos workspace — checked checkpoint

November 8, 2026. Accepted baseline: owner SB40, four tabs and inline Add Memory editing. Implementation: 0de3731, 33439db, 7265e56, 2b2022f. Work performed on FA-MAC-DEV-01 with tools, backups and evidence on FA-Development.

## Implemented

- [x] Photos stays a visual workspace; Find remains the search workspace.
- [x] Larger cover thumbnails, clear memory titles/photo counts, Grid and Compact views.
- [x] Recently updated / Recently added; locally persisted view/sort choices.
- [x] Active saved photo memories grouped by their owning memory; unfinished photo draft is separate, with Resume.
- [x] Choose cover, Move earlier and Move later. Existing media order is authoritative; no competing cover field or schema migration.
- [x] Shared viewer from Photos and Memory Details: Previous/Next, View Memory, Zoom in/out, double-tap, pan, reset, Add/Replace/Remove, cover/order.
- [x] Camera, Library, Files and Cancel visible in the shared viewer source chooser. Existing five-photo cap retained.
- [x] Find “With photos” composes with search and lifecycle. No duplicate search or taxonomy filtering added to Photos.
- [x] Gallery returns to the selected memory after photo changes, including resorting.
- [x] Store rejects invalid/stale permutations and unavailable memories. Reordering preserves photo bytes and ownership and uses the existing durable snapshot/backup path.

## Verification

- [x] TypeScript and targeted lint passed.
- [x] Full source suite: **432 total; 426 passed; 0 failed; 6 skipped**.
- [x] Both native platforms: photo draft/resume/save, Grid/Compact, Add, cover/order, Replace and Remove plus their cancellation paths, associated Details viewer, relaunch preferences, and Find photo-filter composition.
- [x] Final QA-source 2b2022f installed on both platforms with data-preserving updates and identity hashes checked. See [build provenance](sb40-photo-workspace-20261108/build-provenance.json).
- [x] iOS explicit zoom changes 572,456 image-region pixels; reset restores the original region. Native Maestro double-tap changes 847,319 pixels; reset residual 0.
- [x] Android explicit zoom changes 482,295 pixels; double-tap changes 702,549; reset residual 0. Pan changes the enlarged image.
- [x] Final iOS and Android native source chooser exposes all four choices and Cancel.
- [x] Read-only iOS data audit: original **168 memories and their media metadata unchanged**. Total 169 after adding one clearly fictional photo QA memory; final fixture has two photos; draft null.
- [x] Original owner-reference artifacts preserved. iPhone and physical Samsung were not changed.
- [x] Figma secondary implementation spec reconciled at [376:1790](https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr?node-id=376-1790). Owner-reference visual masters were not overwritten or automatically promoted.

Native photo actions were exercised incrementally on the QA builds as fixes landed. Final zoom and source-picker reachability were rechecked after the final JS update. This is not a claim that every earlier mutation sequence was replayed wholesale on the last bundle.

The original iOS zoom implementation completed automation taps without enlarging the image. Raster comparison caught it; native RN touch handling plus accessible zoom buttons replaced it. The slow Mobilewright two-RPC double-tap did not trigger the timing threshold; native Maestro double-tap provides the passing iOS gesture evidence. Android's four-button native Alert hid Cancel, so the shared viewer uses explicit source controls. iOS modal safe-area placement was also corrected. Earlier failed runs are retained in raw evidence and are not reclassified as passes.

## Evidence and artifact scope

Evidence under this report contains selected screenshots, source test summary, identity/provenance, native journals and image-region comparison counts. Full raw evidence and backups remain on the external development SSD at QA-Evidence/CasitaDex/sb40-photo-workspace-20261108 and QA-Evidence/Parity/CasitaDex. Database files and APKs are not committed.

The QA artifacts embed production-mode Hermes exports in the preserved SB40 native QA shells, with local QA signatures. They are **not fresh native compiles, store builds, or replacements for the owner's accepted iPhone artifact**. No release merge, production deployment, store submission, purchase, or production Firebase write occurred.

## Remaining acceptance

- [ ] Manual two-finger pinch on iOS and Android; this Mobilewright driver rejects multi-touch injection. Source implements pinch, but this gesture is not certified by the automated run.
- [ ] Full large-text/landscape and VoiceOver/TalkBack acceptance of the changed surfaces.
- [ ] Physical Samsung acceptance, then owner iPhone sign-off.
- [ ] Owner review of the new Photos presentation; complete visual-frame promotion remains separate from the reconciled behavior spec.
- [ ] Store release gates remain in the broader release checklist. This checkpoint does not declare store readiness.

The unchanged five-photo limit is source-covered; this checkpoint did not freshly fill a native memory to five. The source chooser correction applies to the shared viewer; older Add Memory / Details add-photo entry points retain their existing picker behavior.


## Isolated viewer large-text source follow-up — November 8, 2026

**Source candidate only; native revalidation pending.** From authority base `35e411e`, branch `work/cd-sb40-viewer-large-text-20261108` isolates the reproduced draft-viewer layout failure. Actual maximum-text screenshots and 14-step scroll captures show a 74pt portrait / 78pt landscape controls region against 85–150pt controls. Close remains usable. This does not establish that every action is untappable or certify VoiceOver.

The candidate reflows at system fontScale × in-app text scale ≥1.5 or window height <600. Close stays pinned, the complete title/count moves into the controls scroller, full-width control rows retain intrinsic height, and the controls use two shares of available body height to the photo’s one (photo minimum 80pt). No font suppression or title truncation. Normal portrait composition, source selection, mutation guards, gestures/zoom, navigation and four tabs remain unchanged. Left/right safe-area protection now also applies in landscape.

TypeScript, web export and 437 tests (431 passed, six existing skips, zero failures) pass. Five new component regression cases cover text/height decisions, normal composition, retained navigation/zoom through rotation, five-photo cap and source choices/cancellation. Native primitives are mocked: these tests do not measure native labels. Aggregate lint retains the identical two baseline PanResponder hook-analysis errors and unchanged unused-function warning; Expo Doctor is 20/21 with eight patch-version mismatches. No dependency changes. Source and test Gitleaks scans report zero findings. The broad scan’s 11 inherited documentation metadata findings are recorded separately, not silently discarded.

The next acceptance action is measured portrait/landscape at maximum system text, separately with in-app large text, on a new disposable iOS simulator. Verify every complete control and source chooser can scroll into view, full title remains readable, Close/Return/Previous/Next/zoom still work, and normal portrait remains usable. Existing QA devices, original draft/media and owner-reference artifacts must remain untouched. Broader gesture, screen-reader, Android, physical and release gates remain open. The preserved photo report’s lesson applies: inspect actual pixels, not merely successful automation taps. No separate current lessons file was found in the bounded repository/governance search.

[Source manifest, input evidence hashes and check results](SB40_VIEWER_LARGE_TEXT_SOURCE_CANDIDATE_20261108.json). Native validation is coordinated separately; this appendix is not a new tracker or an acceptance promotion.
