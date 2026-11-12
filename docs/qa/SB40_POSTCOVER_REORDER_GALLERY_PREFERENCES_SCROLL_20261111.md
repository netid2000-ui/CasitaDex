# CasitaDex SB40 — Post-Cover Reorder, Gallery Preferences & Scroll Return

**Date:** November 11, 2026 (America/Chicago)
**Host:** FA-MAC-DEV-01 (exclusive); external FA-Development SSD
**Source branch:** `work/cd-sb40-photo-gesture-integration-20261111` at `67712c42d986fa25215dc22fac6a56b2076a176a`
**Status:** **Scoped iOS/Android native acceptance PASS.** Full release **NO-GO**.

## Safety and package authority
- Builds tested only in isolated iOS simulator `879C620A-5318-4BDF-98B9-904EE635B053` and Android non-fold AVD `emulator-5554`.
- QA package: `com.designsbyfa.casitadex.sb40gestureqa`; accepted SB40 applications and owner devices NOT modified.
- Tests use the seeded `[SAMPLE] Appliance manuals` memory with five distinct synthetic QA photos; photos and app state remain within isolated QA app.
- No source changes during this cycle; no production writes, live purchases, store submission, release merges or physical-device installation.

## 1. Immediate Move Later following cover save

**iOS — PASS**
- Terminated and relaunched isolated app; Photos → sample viewer → photo 2 → Manage photos → **Use as cover photo** → **Photo 1 of 5 · Cover** → **Next photo** immediately → **Photo 2 of 5**.
- Then Manage photos → **Move photo later** → **Photo order saved.** → **Photo 3 of 5** → Previous → **Photo 2 of 5**.
- Full native Maestro flow exit 0: `postcover-reorder-ios-clean.log`. This closes the previously inconclusive reorder-after-cover assertion from the prior report.

**Android — PASS**
- Same isolated native flow via ADB and accessibility hierarchy, independently asserted on each selected photo counter.
- `android-postcover-then-reorder.log`: both `ANDROID_POSTCOVER_AND_IMMEDIATE_MOVE_LATER_PASS` and `ANDROID_MOVE_LATER_NAVIGATION_PASS`. Native runner exit 0.
- No additional changes to image media during preference or scroll tests.

## 2. Grid / Compact and sort preference persistence

**Android — PASS**
- Set **Compact photo view** and **Recently added**, queried accessibility `selected=true` for both.
- Force-stopped and relaunched isolated app; selected=true for both persisted.
- Restored **Grid** and **Recently updated**; confirmed Compact/Recently added selected=false.
- Evidence: `android-gallery-prefs-execution.log`, `android-gallery-prefs-result.log`.

**iOS — PASS**
- Set **Compact photo view** and **Recently added**, captured native accessibility attributes selected=true.
- Terminated and relaunched the app; returned to Photos; both still selected=true, Grid/Recently updated false.
- Evidence: `ios-pref-before.json`, `ios-pref-after.json`, `ios-pref-reopen.log`.

## 3. Large-text control reachability

**iOS — PASS**
- Temporarily set simulator Dynamic Type to `accessibility-large`, relaunched, opened Photos.
- Controls moved to the horizontal `Photo workspace actions` strip (measured bounds around y318–387 in native accessibility coordinates).
- A targeted swipe on the actual strip reached **Compact photo view** and **Recently added**. Earlier failed tests had swiped above the strip, so those are test-targeting failures, not proven app defects.
- Evidence: `ios-large-before-scroll.json`, `ios-large-corrected-strip.log`.
- Restored original simulator content size **large**.

**Android — PASS**
- Temporarily set `font_scale=1.5`; opened Photos and found Your Photos and action strip in native hierarchy.
- Horizontal scroll of controls reached **Recently added** and **Recently updated**.
- Evidence: `android-large-text-start.xml`, `android-large-text-scroll.xml`.
- Restored original Android font scale **1.0**.

This is a bounded reachability test, **not full VoiceOver/TalkBack or comprehensive large-text accessibility acceptance**.

## 4. Gallery scroll-position return from photo viewer

**Android — PASS**
- At 1.5× enlarged text, scrolled gallery vertically, recorded sample image tile bounds before opening viewer: `[74,1022][1007,1955]`.
- Opened viewer directly, closed back to Your Photos, waited for layout restoration; tile bounds unchanged: `[74,1022][1007,1955]`.
- **Vertical drift: 0 pixels.** Evidence: `android-gallery-anchor-result.log`, `android-gallery-scroll-anchor.py`.
- Font size restored in the script's `finally` block.

**iOS — PASS**
- At accessibility-large text, scrolled Photos and recorded **[SAMPLE] Extension cord** tile bounds before viewer open: `[28,663][374,1009]`.
- Opened viewer by screen coordinate, closed back to Your Photos, measured tile again: `[28,663][374,1009]`.
- **Vertical drift: 0 points.** Evidence: `ios-anchor-ext-before.json`, `ios-anchor-ext-after.json`, `ios-anchor-openclose.log`.
- Original content size `large` restored.

## Outstanding release gates
- Complete native VoiceOver and TalkBack traversal/announcements; verify app-level large-text and reduced-motion settings beyond control reachability.
- Full backup/restore, including photo recovery from previously saved snapshot, media failure/cancel flows and offline/relaunch durability.
- Figma visual comparison to owner-approved SB40 Page 47 and review Page 49; explicit owner signoff.
- After emulator/simulator completion, physical Samsung QA, then owner physical iPhone final acceptance.
- No owner-approved SB40 build promotion or release merge authorized.

**Conclusion:** Post-cover reorder, gallery selection persistence, large-text action reachability, and native gallery scroll return are verified on isolated SB40 integration. **CasitaDex release remains NO-GO.**
