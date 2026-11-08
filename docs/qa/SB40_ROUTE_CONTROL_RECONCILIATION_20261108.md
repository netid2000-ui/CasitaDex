# SB40 route and control reconciliation

Authority: owner-selected SB40. This register describes the recovered source at [773f1c5](https://github.com/netid2000-ui/CasitaDex/tree/773f1c5e9568f17ec6933f41ce408b72b554c23a). It replaces assumptions taken from the withdrawn .dev map. Source-mapped behavior is not fresh native acceptance or pixel-perfect visual approval.

## Source checkpoint

The recovered runtime source is now isolated on branch work/cd-sb40-authority-source-20261108. The newer worktree and its uncommitted edits remain preserved. TypeScript passes; historical tests: 419 total, 413 passed, zero failed, six skipped. Historical test document dependencies were restored. No functional fixes, native rebuild, package replacement, production action or physical-device mutation were included.

The checkpoint contains the recovered JavaScript/configuration/assets; generated native projects remain in the recovery workspace. Working-file hashes are recorded; Git normalizes some line endings. Native reproducibility remains to be demonstrated.

## Actual entry routes

| **Route** | **Actual component** | **Controls and transitions** |
|---|---|---|
| / | FigmaNativeHome / FigmaHome | Home commands route regular/photo capture to /add or /add?mode=photo; reminder command to /reminders-manage?mode=new&origin=home. Existing unfinished draft triggers Resume/discard decision. QA identity seeds synthetic baseline fixtures; do not ship this seeding configuration. |
| /add | EngAdd | Adding a Memory; sticky Cancel and Save; required name, Description, Space/Categories; Location, Notes, Reference inline Edit/Done; photos up to five. See corrected editable variants on this page. |
| /card?id=… | EngDetail | Sticky Results, Edit memory, More. Saved name/description/location/notes field edits enter full edit; Reference has its own Save reference/Cancel panel. Photos open /photo-viewer. |
| /answers | NativeFind / FigmaFind | Controlled Search memories; count, Browse memories/Search results, regular/photo memory result rows; open /card. Query/page/scroll preservation belongs to this wrapper. Previous/Next belong to wrapper, not unused EngFind. |
| /photos | NativePhotos / FigmaPhotos | Add Photo Memory; owning-memory title opens Details; each thumbnail has full-screen action; local viewer preserves gallery context. Do not substitute EngPhotos as this tab. |
| /reminders | NativeReminders / FigmaReminders | Add/edit, completion/restore, linked View Memory, delete confirmation, memory-due projections. Distinct from editor route below. |
| /more | NativeSettings / FigmaSettings | Eight entries: Appearance, Accessibility, Spaces & categories, Backup & restore, Privacy & storage, Privacy & security, About CasitaDex, Recently deleted. Each passes an action ID to /settings-manage. |
| /memories | NativeMemories / FigmaMemories | Secondary saved-memory list and count, open /card. Not a fifth tab. |
| /photo-viewer | FullScreenPhoto | Photo source parameters include saved memory or draft plus photo ID; pinch 1–4×, double tap zoom; collection index and previous/next actions; close to origin. Native multi-photo/zoom acceptance remains open. |
| /photos-manage | EngPhotos | Separate legacy management view; not gallery tab. Keep route distinct when reconciling retained controls and ownership. |
| /reminders-manage | EngReminders | New/edit reminder; sticky Cancel/Save Reminder; date and time system pickers; More options expands Repeat/Notes; linked return action. |
| /settings-manage?action=… | SettingsManage / EngMore | Action IDs select storage, labels, backup, preferences, privacy, help, recovery; Back to More resets management section. |
| /share-memory?id=… | EngShareMemory | Select optional metadata/photos, review preview, Share selected details, Memory details back, Cancel sharing; invokes system sharing. |
| /sb29-review | SB29Review | Isolated QA-only CTA review. Do not represent as a customer navigation destination. |

The actual bottom destinations in this recovered shell are Home, Photos, Reminders, Find. The secondary Memories route remains separate. Owner-reference screens remain preserved. If owner screenshots differ in labels, resolve against the accepted artifact rather than silently changing either.

## Saved memory states and actions

- Read: Memory name, Space, Categories, Description, Location, Notes, optional Reference, verification status and photos.
- Full edit: Cancel discards edit buffer; Save & return to details persists through revision-checked store update. Name required; Description, Location, Notes and Reference editable. Dirty text must be saved/cancelled before adding photos.
- Direct taxonomy panel: Select Space/Category, Create new, None and sorted label rows. Direct create uses Create and assign; changes persist to the saved record.
- Full-edit taxonomy panel: Choose, Select, Create new, None; create uses Create and select and assignment remains in edit buffer. Do not treat the direct and edit-buffer panels as the same operation.
- Reference-only panel: Edit, Reference input, Save reference, Cancel.
- Verification panel: Choose, Reference checked, Confirm Verified / Set status, Close. Merely opening a memory does not verify it.
- More: Remind me later → linked reminder editor; Share memory → selected-data share screen; Archive memory / Return to Active; Move to Recently Deleted with confirmation.
- Recently deleted details: Restore memory; retained photos; permanent cleanup unavailable in this QA build.
- History remains a separate details action; do not invent new draft/resume pages from the .dev map.

## Reminder editor contract

Required Reminder title *, Date, Time (AM / PM), optional More options with Once/Daily/Weekly/Monthly/Yearly and Notes. iOS inline/spinner picker has Done; Android uses its native picker. Past times show a warning. Similar item/date/time triggers Review reminder / Keep both.

Cancel leaves through a dirty-change confirmation when needed. Linked Return to Memory Details also protects unsaved changes.

**Observed gap:** Save currently returns Home for origin=home, otherwise Reminders; memoryId is correctly persisted, but linked Save does not return to originating Details. Expected owner behavior is return to Memory Details. Keep this issue explicit; do not mark it fixed in Figma.

The 75-item journey verified one linked reminder, View Memory, completion, and persistence. It did not verify scheduled notification delivery or notification-tap routing.

## Settings management contracts

| **Section** | **Source-mapped controls** | **Acceptance boundary** |
|---|---|---|
| Appearance / Accessibility | Large text; System, Light, Dark appearance; device text-size and screen-reader guidance | Actual maximum-size, VoiceOver/TalkBack and landscape checks remain open. |
| Spaces & categories | Existing label selection, name/create/rename controls, impact review, Confirm remove label only / Cancel label removal | Household organization probe was cancelled; no Space/Category assignment pass is claimed. |
| Privacy & storage | Measure device storage; Check photo integrity and protected owners; largest photos; duplicate advisory; Review unfinished draft and its photos | No automatic cleanup or permanent purge. Archive/delete do not reclaim photo bytes. |
| Privacy & security | Local storage explanation, user-initiated sharing/backups; Open backup protection | Full security/release review remains independent. |
| Recently deleted | View recently deleted memories → /answers | Verify the active Find wrapper actually applies requested lifecycle context. Old EngFind cache behavior alone is insufficient evidence. |
| Help / About | Local-data, backup, verification, archive and deletion guidance | Version/help wording is QA content, not release metadata. |

## Backup and restore controls

- Save full backup (with draft and photos): full v4 includes standalone reminders, active/archived/deleted records, taxonomy, draft and photos.
- Review limited text backup (photos excluded): omission summary; Confirm save limited text backup / Cancel text backup. Reject stale reviewed collection state.
- Save text report (no photos; not a backup): readable report, not a restorable backup.
- Choose backup to review: system picker; cancellation keeps data; summary distinguishes Full v4 reminders versus legacy archive.
- Existing draft conflict: Keep current draft / Use backed-up draft (previous state recoverable).
- Confirm replace with reviewed backup / Cancel restore: explicit review and stale-state token checks.
- Recover previous full save → Confirm full recovery / Cancel recovery.
- These controls are source-mapped. No restore was run against the owner’s data during this correction.

## Share and photo boundaries

Share includes name and description by default. Optional checkboxes: Location, Notes, Reference / source, Space, Categories, Verification, Reminder. Individual photos can be selected. Review what will be shared / Hide sharing preview toggles the actual selected data. Only selected photos are sent to the system; original photos may retain embedded metadata. Delivery is controlled by the destination app.

Photo source sheet: Take Photo, Choose from Library, Browse Files, Cancel. System permissions and picker cancellation remain separate states. The household journey verified one synthetic attachment, view and close; five-photo limits, full collection navigation and gesture handling still need native acceptance.

## Evidence and remaining work

[Household journey report](https://github.com/netid2000-ui/CasitaDex/blob/db129dee01acd63559929d7cbcfc59f9dbccfa3d/docs/qa/SB40_HOUSE75_OWNER_JOURNEY_20261108.md): 75 new records, 165 total including 90 baseline fixtures; 15 search/open/return cases; one structured Location edit; one photo and one linked completed reminder. No taxonomy assignments were made.

Open implementation issues: dimension-query normalization (20x25x1 versus spaced tokens), linked-reminder Save return context, and verify lifecycle-filter handoff to actual Find wrapper. Open reconciliation: remaining secondary editable visual states must be compared against SB40, not cloned from withdrawn page 45. Source route/control coverage does not certify visual parity.

No store submission, billing activation, release merge or production deployment is authorized by this register. Both source validation and native artifact acceptance remain required before promotion.

Figma register: https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr?node-id=367-492
