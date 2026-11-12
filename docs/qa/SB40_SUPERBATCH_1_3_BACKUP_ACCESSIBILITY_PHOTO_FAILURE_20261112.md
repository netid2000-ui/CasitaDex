# CasitaDex SB40 — One Super-Batch: Backup Safety, Accessibility, Photo Failure Paths

**Date:** November 12, 2026 (America/Chicago)
**Authority:** FA-MAC-DEV-01 exclusively; external FA-Development SSD
**Source:** work/cd-sb40-photo-gesture-integration-20261111, starting HEAD b40e936af6865908b059bdc5f07d9625afd0bf44
**Native packages:** com.designsbyfa.casitadex.sb40gestureqa ONLY, isolated iOS simulator 879C620A-5318-4BDF-98B9-904EE635B053 and non-fold Android AVD emulator-5554.
**Release decision:** NO-GO. The owner-approved SB40 app, owner iPhone, physical Samsung, production data, release merges, and store submissions were NOT modified.

## A. Backup and recovery safety

- [x] **Previously completed on same current source revision:** Android rejected deliberately byte-corrupted Full v4 archive with Media SHA-256 mismatch before offering restore; QA collection preserved. Refer to prior report SB40_IOS_BACKUP_EXPORT_PRIVACY_ANDROID_CORRUPT_REJECTION_20261112.md (b40e936).
- [x] Android Full v4 verified synthetic QA archive unchanged on Mac SSD: isolated-sb40-full-v4-pre-restore.cdxe, 296,545 bytes, SHA-256 865099e19432674009a808e7d4fac4f5b5c1e9c50140caceff9d5d5924995aea.
- [x] **New changed-state test:** At Photo 1 of 5 in synthetic [SAMPLE] Appliance manuals, actual cover screenshot was green at RGB approximately (0.0347,0.6352,0.4240). Replaced just that QA photo using the real Android system photo picker, yielding a different copper image RGB approximately (0.8608,0.4671,0.2526).
- [x] Reopened the independently verified Full v4 archive through the Android native Documents picker. App review showed 90 memories / 7 saved photos / 0 draft photos; explicit Confirm replace yielded **Full collection restored and verified.**
- [x] Reopened the same photo in the restored QA app; Photo 1 of 5 Cover remained present and screenshot RGB returned exactly to **green** (0.0347,0.6352,0.4240). This establishes recovery of **different photo bytes/state**, not only a five-photo count.
- [x] Used Recover previous full save and explicit confirmation; app displayed **Previous full save recovered and verified.** Reopened same QA memory: Photo 1 of 5 Cover and RGB **copper** (0.8608,0.4671,0.2526). This establishes native two-direction prior-save recovery on synthetic Android data.
- [x] iOS: verified the latest b40e936 Full v4 export uses private app Documents, validates locally before sharing, and preserves hardened Info.plist (no broad UIFileSharingEnabled or LSSupportsOpeningDocumentsInPlace exposure). Existing native export evidence and verified private iOS archive in prior report.
- [x] iOS: copied one synthetic verified Full v4 archive only into isolated simulator On My iPhone local Files-provider storage. The native Files picker displayed the 297 KB copy. Cancel returned to CasitaDex showing **Backup selection canceled. Current data kept.**
- [ ] iOS external Files provider selection did **not** return a backup to the app after repeated tile taps. The independent provider copy was manually staged in the simulator for QA; it does not prove system share-sheet delivery.
- [ ] iOS Save to Files share-sheet option appeared but after selecting it no externally saved provider file could be verified; only a new verified **private** archive was observed. Do not mark actual external delivery, native iOS import, or previous-save recovery accepted.
- [ ] Native permission-denial, low-space interruption, and intentionally corrupted native iOS import remain unverified. Relevant source transaction tests are separate.

## B. Native accessibility

- [x] Confirmed Android TalkBack is installed. Temporarily enabled **com.google.android.marvin.talkback/.TalkBackService** on the isolated Android emulator; dumpsys accessibility showed TalkBack bound with FEEDBACK_SPOKEN, FEEDBACK_HAPTIC and FEEDBACK_AUDIBLE. Sent basic keyboard focus/navigation inputs.
- [x] Restored original emulator settings afterward: accessibility_enabled=0, enabled_accessibility_services=null, font_scale=1.0. iOS simulator content size restored/retained at large.
- [x] Prior native label/disabled-state audit on the SB40 viewer established all eight Android clickable elements labeled and iOS Close, Previous/Next, Reset/Zoom, Manage Photos exposed with correct initial state.
- [x] **New genuine iOS XCTest accessibility audit:** Temporary QA-only Xcode target method testSB40PhotoViewerAccessibilityAudit launches isolated app, opens approved Your Photos → sample photo viewer, then performs Apple XCUIAccessibilityAudit for sufficientElementDescription, hitRegion and textClipped (iOS 17+). Actual Xcode run **TEST SUCCEEDED**, test passed (11.312 s), result bundle ios-accessibility-audit-guarded.xcresult.
- [x] Committed reusable updated QA-only Swift test source under qa/ios-ui/SB40GestureIntegrationUITests.swift; accepted source app code and original Xcode project were not altered by the audit.
- [ ] **Full spoken VoiceOver and TalkBack acceptance is NOT complete.** Binding TalkBack does not prove focus announcements, rotor/screen-reader gesture traversal, order, or speech quality. iOS native audit is valuable but not a substitute for spoken operation.
- [ ] Native TalkBack log included an Android AccessibilityService bindInput/unbindInput diagnostic; speech itself was not captured or assessed.

## C. Photo picker cancellation and failure paths

- [x] iOS real native viewer: Manage photos → Replace this photo → Cancel source menu returned to Photo 1 of 5 Cover. Then Replace → Choose from Library → native system picker Cancel returned to Photo 1 of 5 Cover.
- [x] Android real native viewer: Replace this photo → Cancel source menu preserved Photo 1 of 5 Cover. Replace → Choose from Library → Android system picker BACK returned to Photo 1 of 5 Cover. Both native outcomes completed in isolated QA app.
- [x] Created disposable invalid file SB40-QA-INVALID-IMAGE.jpg (2,087 bytes, not a JPEG) inside emulator Documents. Used Manage photos → Replace → Browse Files → selected this document.
- [x] App rejected the malformed bytes, displayed **Choose a JPEG, PNG or WebP up to 10 MB**. Existing Photo 1 of 5 Cover remained present, and screenshot RGB remained **copper** (0.8608,0.4671,0.2526); no replacement of saved photo bytes.
- [ ] Similar malformed-photo selection through native iOS Files provider, camera permission denial, corrupt-but-signature-valid payload, 10 MB upper-limit negative path, and missing-media viewer rendering/retry still require separate native tests.

## Source and artifact checks

- [x] Current branch source TypeScript PASS, targeted changed-source ESLint PASS, git diff --check PASS.
- [x] npm test: **438 total / 432 passed / 0 failed / 6 skipped**, run after prior iOS backup-export fix b40e936.
- [x] No user or production photos, DB files, local Full v4 archives, malformed fixtures, screenshot PNGs, private archive checksums or Xcode result bundles pushed into Git; all retained locally in QA evidence.
- [x] All app identities confirmed sb40gestureqa; only QA fixture files and reusable QA test/report committed.
- [ ] Figma owner-approved SB40 comparison, physical Samsung, owner iPhone acceptance, and store-release approval remain separate governance gates.

## Reproducible evidence (Mac mini private SSD)

All under /Volumes/FA-Development/Designs-by-FA/QA-Evidence/CasitaDex/SB40-GestureIntegration-1ec4b7f/:
- Android native changed-state screenshots: android-changedstate-backup-before.png, android-changedstate-photo-purple.png (despite filename, the selected image was **copper**), android-changedstate-after-restore-correct.png, android-changedstate-after-previous-recovery.png, and corresponding native XML views.
- Android invalid image: SB40-QA-INVALID-IMAGE.jpg, android-bad-image-scrolled.xml, android-bad-image-before-scroll.png.
- Native picker cancellations: ios-picker-cancel-scroll.log, ios-cancel-backup-import.log, and android-photo-source-and-picker-cancel.py with successful stdout.
- iOS Files-provider investigation: ios-external-archive-picker-ui.json, ios-external-tile-after.json, ios-save-to-files-share-menu.json, ios-save-to-files-destination-ui.json. Source private verified archive from prior checkpoint unchanged.
- iOS native Apple accessibility audit: ios-accessibility-audit-guarded.log and ios-accessibility-audit-guarded.xcresult.
- Source: sb40-superbatch123-source-tests.log, sb40-superbatch123-typecheck.log, sb40-superbatch123-lint.log.
- TalkBack binding evidence: android-talkback-enabled-events.log plus command output; original settings confirmed restored.

## Release and next action

**The three requested areas were executed together, with significant native PASS results.** Two release-critical items still remain OPEN: full iOS external Files copy/import/restore acceptance and **spoken** screen-reader traversal. Also complete the remaining camera/permission and media-error negatives before release. Preserve the accepted SB40 owner app and never promote this isolated feature branch without explicit review.

**CasitaDex release status: NO-GO.**
