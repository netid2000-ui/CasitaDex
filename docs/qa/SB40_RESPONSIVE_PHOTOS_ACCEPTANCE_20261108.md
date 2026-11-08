# SB40 responsive Photos acceptance checkpoint

November 8, 2026. Exclusive execution on FA-MAC-DEV-01.local, existing FA-Development checkout and work/cd-sb40-authority-source-20261108. Starting source **8e2e4d5**. New application implementation and installed JS: **0bddc8f5d284aeb4fcef15ee1687e5aa141e38c4** (includes d27852c). Retained SB40 native QA shells; no fresh native compile/store build. Pinned QA package com.designsbyfa.casitadex.sb40qa; iOS A4ED0D8B-C90A-4940-9B71-4F570D7DC597, Android emulator-5554 / sb40_four_items.

## Fixed

- [x] Android landscape on c5eb43d left only 33 physical pixels of gallery viewport below the three rows of fixed shell/controls. Preserved failure report/screenshot.
- [x] Photos controls now use one fixed, horizontally scrolling action row on short screens or large-text settings. Standard portrait retains the compact two-row arrangement. Find retains the With photos only button.
- [x] At maximum iOS text size, button labels exceeded screen width. Action button widths now respect screen width and labels wrap. All actions retain accessible touch heights.
- [x] Pinch/zoom implementation was not removed or changed by these layout fixes. Prior double-tap/buttons/pan/reset evidence remains historical evidence; manual pinch verification stays open.

## Verified on final implementation

- [x] TypeScript and targeted lint passed. Final source suite: **426 passed, 0 failed, 6 skipped** (432 total).
- [x] Final installed iOS executable/bundle and Android APK/AVD identity guards pass. [Final provenance manifest](sb40-responsive-acceptance-20261108/final-targets.json).
- [x] iOS landscape: all five toolbar controls fit, touch heights meet 44pt iOS target; gallery scroll changes photo position; photo opens and closes through native controls.
- [x] iOS maximum accessibility text size: all five controls can be fully exposed through horizontal scrolling; labels wrap; gallery scrolls and photo opens/closes. With photos only also remains in screen bounds and toggles correctly.
- [x] Android font scale 2.0: all five controls can be fully exposed through horizontal scrolling; scrollable gallery/photo region remains available. Bounds/reachability verification only, not a full TalkBack or visual audit.
- [x] Android landscape: gallery viewport improves from 33px to 175px; vertical scrolling exposes the cover thumbnails; all five toolbar controls remain available. Bounds/reachability verification only.
- [x] Display settings restored: iOS content size large / portrait; Android font_scale 1.0, accelerometer_rotation 1, user_rotation 0. Tracked Android check completed exit 0.
- [x] iOS complete saved snapshot and standalone-reminder rows unchanged across this work.
- [x] Android native full-v4 export matches the last verified export exactly for saved snapshot and reminders: 96 memories, 8 saved photos, no draft. Every photo payload passes size/SHA-256 checks. No run-as or privilege bypass used.

## Identity correction

Initial iOS identity guard correctly blocked testing because the c5eb43d packaging step re-signed the retained shell but left its previous signed-executable pin. The installed executable exactly matched that packaging stage. On evidence copies only, removing signatures from old and current executables produced identical complete bytes (SHA-256 592b41b9624e8cf7a78721a5d4bd03a23b326dfdbafd8152f5292c68c01d7cce). Only after this independent reconciliation was the pin corrected. Original installed/reference artifacts were not modified by the signature comparison. Later updates record both signed-executable and bundle hashes after each install. The prior sticky-controls report's statement that the native executable was unchanged referred to retained native code, but its signed-file hash did change; this corrects that provenance statement.

## Retained failures and limits

Earlier failed/intermediate runs remain on the SSD. Test calibration required actual screenshot dimensions after iOS rotation (driver screenSize returns natural portrait dimensions), iOS 44pt minimum target criterion, avoiding bottom-navigation coordinates, shorter gallery swipes at maximum text, and smaller horizontal swipes to expose entire buttons. A bounded Android run timed out; settings were explicitly restored before the completed tracked run. Intermediate clipped-button geometry is not promoted as full reachability acceptance.

The landscape gallery remains short because the accepted shell header and bottom navigation stay visible. Focused usability now passes, but this is not complete landscape/accessibility certification. Combined maximum-text-plus-landscape, in-app large mode, full visual review, VoiceOver/TalkBack and all viewer controls in those configurations remain open.

## Next open checkpoint

- [ ] Native **draft** five-photo cap (saved-memory caps previously passed on both platforms).
- [ ] Remaining final-bundle photo mutation regression, full accessibility/landscape qualification.
- [ ] Manual two-finger pinch: implemented, manual verification open; current automation injection route unsupported.
- [ ] Broader offline/reconnect, actual restore, notification-tap lifecycle and security qualification.
- [ ] Physical Samsung, owner iPhone sign-off and store gates remain pending separate authorization/availability.

[Selected evidence and screenshots](sb40-responsive-acceptance-20261108/). Full artifacts, failing attempts, backups and private snapshots remain on FA-Development at QA-Evidence/CasitaDex/sb40-responsive-acceptance-20261108. No databases or full backups committed. No production, purchase, deployment, merge or store action. Release status remains **NO-GO**.
