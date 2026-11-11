# CasitaDex Figma SB40 — super-batch 01–06 (2026-11-11)

Status: IMPLEMENTED REVIEW CANDIDATES / NOT OWNER APPROVED / NATIVE NOT TESTED.
Authority: owner accepted SB40 screenshots Page 44 (347:2) and corrected SB40 inline Edit Page 47 (360:2). Page 45 (351:2) remains WITHDRAWN. New Page 49 designs are REVIEW only.
Figma: https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr?node-id=398-2
Owner review board: https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr?node-id=1006-2
Execution: Figma plugin via connected tools; Mac mini AI Commander for status and durable evidence. No native source code or accepted binaries touched.

## CP1 Empty photo draft, Space/Category
PASS (design and link checks): Added dark selected Space examples for None (1000:7), Garage (1000:55), Hallway (1000:103), Kitchen (1000:151), while reusing Office (994:2) and Warranties (994:49) examples. Repaired option destinations and created Category Done state 1005:2 with category variable bound to visible field. Home 950:19 and Photos 975:79 Add Photo entry reset 14 inherited Space/Category selection/marker variables before navigating to 975:217.
OPEN: actual prototype execution of combined multi-category toggles and create-new return; native data persistence and picker behavior not tested.

## CP2 Dark navigation
PASS (bounded): Dark Find filters 1000:199 and 1000:212. Dark Add Memory photo source and 3 inline-editor overlays 1000:249, 1000:271, 1000:280, 1000:289. Dark Photos Compact 1000:298 and Sort 1000:368, with consistent entry/navigation. Memory Details dark photo-source overlay 1000:225.
OPEN: separate scoped scan still finds 83 links from 29 dark frames to destination names without Dark; some are intentional theme or historical flows, not automatically defects. Avoid mass retargeting without state-equivalence audit.

## CP3 Photos / Memory Details
PASS (Figma route contract): dark gallery Hallway 975:84 -> dark Memory Details 1001:2 -> dark three-photo viewer 1001:54 / 1001:87 / 1001:120, zoom 1001:153, Manage review 1001:186. Close returns to Details, Details Back returns to dark Photos.
OPEN: photo Cover/Remove/Reorder and nested Manage paths still have inherited light workflow destinations; real photo changes, persistence and accessibility remain unverified in native app.

## CP4 Reminders
PASS (review UI): existing dark standalone form 975:264, dark date/time 986:44/986:53, expanded Repeat/Notes 986:85, dark linked reminder from Photos 1002:2 / expanded 1002:42. Linked Cancel/Save examples return to their initiating Memory Details 1001:2. Save here means prototype routing, NOT native persistence.
OPEN: notification deep links, repeat/date edits, actual Save validation and native scheduling.

## CP5 Settings, backup and recovery
PASS (bounded Figma routing): dark Settings destination normal text 1003:2 / 1003:34 / 1003:90 / 1003:146; large text 1003:157 / 1003:188 / 1003:240 / 1003:292. Rewired 64 controls across 16 dark normal/collapsed Settings frames. Eight destination Back controls use true BACK navigation to preserve caller.
REUSED: earlier completed dark Restore draft-choice review and Cancel behavior; no duplicate rebuild.
OPEN: complete native backup/restore, privacy and storage flow acceptance; other historical dark-to-light links beyond these destinations.

## CP6 Visual system and accessibility
PASS (design corrections): inspected screenshots of dark Compact/Sort, viewer, dark Settings large text, dark picker and reminder options. Recolored 59 low-contrast icon vectors in new gallery/viewer and 44 icon vectors plus 2 clipped filter chips across Settings review variants. The previously truncated 'With photos only' text now fits and screenshot was visually checked. New review board 1006:2 is editable and visually checked.
OPEN: semantic component instance reuse / Code Connect, platform touch target checks, full typography/contrast audit, dynamic type and native screen readers. Prior page 49 inventory had 0 component instances; new designs do not establish library parity.

## Final Figma structure check
26 sampled frames resolved (26/26). Verified key Space/Category reset routes (14 reset actions each), category Done, Photos -> Details -> Viewer, linked Reminders, dark Settings destinations, and all 8 new BACK actions.

## Status and next gate
Figma SUPER-BATCH CHANGES SAVED; DESIGN APPROVAL NOT YET REQUESTED as if complete. Correct remaining unintended cross-theme and deep state routes; run genuine browser prototype scenario tests; reconcile with SB40 accepted design; prepare owner acceptance screenshots. No native build/test implied. No production, deletion, Git merges, stores or paid actions.
