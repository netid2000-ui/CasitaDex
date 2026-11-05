# WORK-SB47 — CasitaDex screen/source audit and implementation tasks
Baseline: 582e3a934d8619413bb5b05d9e40022b465637d9. Machine: FA-MAC-DEV-01. Date: November 4, 2026 America/Chicago. Status: source inventory COMPLETE for syntactic controls; full design/native parity OPEN.

## Audit method and acceptance boundary

Read current route shells and primary screen handlers, generated TypeScript AST inventory across src, and preserved exact handler/validation/source references. WORK_SB47_SOURCE_CONTROLS.md is the per-control index; WORK_SB47_SOURCE_INVENTORY.json retains complete attributes, function validations/calls and route source hashes. This is static source evidence, not native acceptance. Dynamic repeated controls are one template row; labels and branches must be expanded with fixture data during native execution. Figma references below come from the November 4 reconciliation; parent WORK-SB47 live inventory supplies refreshed Figma evidence. No screenshot, contrast, focus order, gesture, performance, iOS/Android equivalence or delivery test passed by inference.

Each mapped screen requires empty/loading/error/offline, saving/saved/failed, disabled/selected, keyboard open, portrait/landscape, regular/XL, light/dark, VoiceOver/TalkBack acceptance. Mark unavailable states explicitly; do not invent implemented flows.

## Current screen and operation map

| Screen / state | Entry and return | Data / validation / failure | Source and Figma |
| --- | --- | --- | --- |
| Shell | Five tabs Home, Memories, Photos, Reminders, Find; guards dirty Detail edits | Guarded tab navigation; selected tab role; More accessed from secondary controls | src/app/_layout.tsx:14–66; src/eng-navigation.ts; Figma 62:122 / 69:108 / 69:463 |
| Home / draft prompt | Add Memory, Add Photo Memory, Add Reminder; Resume Draft; Delete Draft confirmation; View all reminders | Loads local snapshot and standalone reminders; creation disabled while existing draft; deletion only confirmed | src/eng-screens.tsx:69; Figma 248:2 / primary screen pages |
| Memories | Category filters, Show more, Add, open memory, Find, Settings; development-only fictional seed control | Local active memory list, 50 increments; seed explicitly synthetic, confirmation | src/eng-screens.tsx:171; Figma 62:122 |
| Find | Query, lifecycle, spaces/categories, more filters, clear/remove filters, select/bulk lifecycle, Previous/Next | Local index; filter resets page/selection; result open /card; findCache keeps query/filter/page/scroll; bulk confirmation | src/eng-screens.tsx:193; Figma 121:108 |
| Photos list / selected memory | Select photo memory; Back to photo memories; View, Replace, Remove and Add Photo | Saved media by memory; Add disabled at five; replace picker cancel keeps original; remove confirmation | src/eng-screens.tsx:100; Figma 257:98 / 257:112 |
| Photo modal | Open from Photos, Detail, draft; Close photo; Zoom in/out | Local zoom 1–4; horizontal/vertical scroll; modal hardware close | src/eng-screens.tsx:50; Figma 257:98 / 260:327 |
| Add Memory / Add Photo Memory / resume / duplicate / discard | /add and mode=photo; Save replaces with /card id; Keep draft and leave returns Home | 400ms draft checkpoint, flush on app background/unmount; duplicate review; title/answer/photo store validation; five photos; source/location/notes/date/taxonomy; Save errors retain draft; explicit discard | src/eng-screens.tsx:225; src/eng-store.ts; Figma 84:2 / 86:2 / 124:2 / 124:75 / 136:2 |
| Detail / Edit / Review / History / lifecycle | /card?id; Edit inline; Save returns Detail, Cancel clears edit; review source/confidence; archive/delete/restore | Revision checked store.updateMemory; edit source/answer needs reverification; dirty hardware/tab guard; taxonomy create/rename writes independently; history note required | src/eng-screens.tsx:338; Figma 257:2 / 257:25 / 257:48 / 257:73 |
| Linked reminder field / complete-reschedule | Detail/Edit due YYYY-MM-DD; complete/reminder nextDue | Memory-linked due field; store.completeReminder; native alert planning/delivery must be separately verified | src/eng-screens.tsx:353–378; src/eng-store.ts completeReminder and native reminder integration; Figma 90:180 / 86:103 |
| Standalone reminders / create-edit / manage | /reminders?mode=new; date/time pickers, recurrence, Save/Cancel; mark complete/incomplete; delete confirmation | Title required, 200 max; notes 4000; standalone native reminder API; failed operation keeps form; date/time native platform picker | src/eng-screens.tsx:129; src/standalone-reminders.native.ts; Figma 276:2 / 86:103 |
| Share preview / native sheet | Detail Share; select additional fields and photos; preview; open share sheet; Cancel | Name/answer default; optional fields/photos opt-in; metadata notice; platform share reports sheet opening, not recipient delivery | src/eng-screens.tsx:402; src/eng-domain.ts sharePreview; Figma 257:126 / 257:152 |
| More / Storage & Cleanup | More submenu / Back to More; archived/deleted route Find | Measure space; audit protected photo refs; duplicates advisory; permanent cleanup explicitly unavailable | src/eng-screens.tsx:421; Figma 65:16 / 90:548 |
| Spaces & Categories | More labels / Back | Create/rename; preview impact then confirm remove label; revision checks; memories/photos retained | src/eng-screens.tsx:409; Figma 90:346 |
| Backup & Restore / text review / conflict / recovery | More backup; file choose, review, explicit replacement confirmation; Cancel leaves current data | v4 full backup includes media/draft/reminders; token check stale review; text exclusion notice; draft conflict choice; previous save recovery separate confirmation | src/eng-screens.tsx:441; src/eng-backup.ts / reminder-restore-v4.ts; Figma 90:447 |
| Appearance & Accessibility / Help / Premium info | More section / Back | Large text toggle and system/light/dark preferences; help local-data disclosure; premium explicitly unavailable, no checkout | src/eng-screens.tsx:466–470; src/ui.tsx / state.tsx; Figma 90:269 / 90:637 |
| Load/error/recovery common | Page Retry/Recover and useEng status | Error status polite live region; busy prevents duplicate operations; buttons min 52x48; Field accessible label; Page handled keyboard taps | src/ui.tsx:74 / 120 / 177; src/eng-screens.tsx:24 |

## Actionable discrepancies and acceptance tasks

| Task | Priority | Evidence / required change or decision | Acceptance |
| --- | --- | --- | --- |
| CD47-01 Edit actions | P1 | Figma fixed top Save/Cancel versus current end-of-form buttons; implement accepted placement with keyboard-safe scroll and safe areas | Exact-title regression rerun, all fields/Cancel, both platforms XL/landscape |
| CD47-02 Viewer navigation | P1 | PhotoViewer accepts one path; only Close/Zoom; no next/previous or swipe implementation in current modal | Implement approved gallery index/return contract; five-photo navigation and originating item preserved |
| CD47-03 Simplified creation | P1 | Current draft prompts/options, answer naming, organization button rows differ from accepted simplification/dropdowns; audit live Figma and reconcile | Approved Title/Description order, required labels and no redundant draft flow; durable draft recovery preserved |
| CD47-04 Home remnants | P1 | Home still renders reminder list; owner requested removing Home reminder list | Reconcile accepted Home and ensure Reminders entry remains accessible |
| CD47-05 Find paging | P1 | Current bottom-only Previous/Next 50; owner requested both ends with directional scroll | Implement accepted paging/scroll position and verify return-to-result context |
| CD47-06 Linked notifications | P0 | Linked due field and standalone API are distinct paths; date field/save is not delivery evidence | Trace scheduler on create/edit/archive/complete/restore, permission denial, actual due delivery and tap destination |
| CD47-07 Cancel and labels | P1 | Create/rename labels in Detail calls store before final memory Save; Cancel discards edit only | Specify and test that label library changes are independent, or stage until Save if contract requires no writes |
| CD47-08 Photo list semantics | P1 | Current list is photo memories with selected inline detail; verify unattached photo/library contract and text/thumbnail navigation against live authority | Both entry targets, unattached retention, viewer close and persistence |
| CD47-09 Native accessibility | P0 release | Shared labels/min targets exist; bottom nav text fixed 12, five tabs; no native focus/XL acceptance inferred | VoiceOver/TalkBack focus, dynamic type, landscape, full scroll, contrast and light/dark native evidence |
| CD47-10 Legacy inventory | P2 | src/screens.tsx remains large older surface while current routes export eng-screens | Keep legacy rows segregated; do not implement/accept from unreachable old screen accidentally |
| CD47-11 Stable selectors | P2 | Repeated labels/template controls rely on index or title | Add stable IDs only in scoped implementation; rerun affected flows without overwriting accepted tests |

No implementation performed in this source-audit lane. CD-SB41 bounded title persistence remains prior evidence only; other native gates remain OPEN.
