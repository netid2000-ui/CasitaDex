# Figma SB40 super-batch 1–4 — November 12, 2026

Scope: theme navigation; category/create-new behavior; photo-state reconciliation with completed native evidence; restore/recovery journeys. No native photo tests repeated. Owner design approval remains pending.

## 1. Theme navigation — bounded corrections complete; wider audit open
Corrected dark Compact and Sort Home/Reminders/Find routes:
- 1000:351 and 1000:425 -> 950:2
- 1000:359 and 1000:433 -> 975:119
- 1000:363 and 1000:437 -> 975:2
Existing restore confirmation frames 888:2 and 888:31 already had dark fills. Added Dark to their names; they were false positives in a name-only theme scan. Retained all legitimate conditional Settings return branches. Other deep links (filter results, storage previews, label management, reminder detail and some photo-detail actions) still need state-equivalent theme audit; do not claim page-wide completion.

## 2. Category/create-new — prototype logic corrected
Reproduced with actual Figma action expressions: Appliances + Maintenance selection -> Create new category reset summary to None but retained checkmarks; Cancel returned inconsistent state. Also found Create new Space clearing the chosen Space before Cancel.
Removed only SET_VARIABLE entry resets from 987:127 and 987:55. Existing navigation, Save and Cancel actions preserved.
Static interpreter executed actual SET_VARIABLE, VARIABLE_ALIAS, EQUALS and CONDITIONAL actions, preferring reaction.actions over duplicated legacy reaction.action.
- 32 category combinations x four assertions (selection, create/cancel preservation, Save union with Warranties, Done route) = 128 PASS.
- Garage -> create Space -> Cancel retains Garage; Save selects Office = 2 PASS.
- No actual Figma variable defaults changed by the evaluator; state lived in a script-local object.
This is action-logic verification, not browser interaction, native persistence, or free-form text-entry acceptance.

## 3. Photo evidence — reconciled, no retesting
Retained Figma evidence board 1018:134 and completed iOS/Android results from 2e8be95, 1f5a4fd, 93a79f8, 7199487, 67712c4, e201d3f and d1a34cb. See FIGMA_SB40_NATIVE_PHOTO_EVIDENCE_RECONCILIATION_20261112.md. No photo-test reruns, image replacement, simulator interaction or app source changes. Prototype examples remain distinct from the native acceptance evidence.

## 4. Restore/recovery — route contract and visual checks
11 PASS:
- 875:67 -> 875:138; 875:69 -> 875:153.
- 875:149 -> 888:2; 875:164 -> 888:31.
- Cancel 888:21 -> 875:138; Cancel 888:50 -> 875:153.
- Confirm 888:25 -> 875:274; Confirm 888:54 -> 875:290.
- Recovery confirm 875:184 -> 875:222; completion return 875:223 -> 875:2.
- Recovery Cancel 875:180 closes overlay; original entry 875:25 opens it as OVERLAY.
Rendered both restore confirmations: readable text, dark backdrop, explicit current/backed-up draft distinction, Cancel and Confirm visible. Rendered category selector and final review board; no clipped board text.
These are configured route/visual checks, not executed browser journeys or new native restore acceptance. Android native changed-photo recovery remains PASS; current-branch iOS external delivery/restore remains unverified.

## Results and remaining gate
141 action checks PASS: 128 category + 2 Space + 11 restore/recovery. Six theme links corrected. Existing review board 1006:2 updated with precise scope.
- https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr?node-id=1006-2
- https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr?node-id=1018-134

Broader theme audit and genuine browser prototype journeys remain open. Do not present this bounded super-batch as final approval of all Page 49 flows. Accepted SB40, owner devices, app source and production unchanged. Mac mini used for Git evidence only. No release authorization implied.
