# CasitaDex SB-20 — Find & Answer Detail Specification v0.9
2026-10-17 | Designs by F&A | OWNER-APPROVED DESIGN BASELINE — SIGNED OFF, IMPLEMENTATION ON HOLD
Implementation, schema migration, build, commit, push and deploy ON HOLD.
Sources: owner-approved Home v1.1; SB-18 baseline; SB-20 Find decision log.
Principle: Fewer features. Faster answers.

## 1. Approved design contract
- Offline Find searches as typed; Home GO hands Find the trimmed query.
- Spaces are optional primary locations (0/1 per record). Categories are optional subjects (0/many). Both are user-created as needed; neither is required to save or search.
- Find cards show the SAVED ANSWER prominently; title smaller; optional Space, one Category and truthful Needs checking cue. Card tap opens Answer Detail.
- Weighted deterministic local ranking gives priority to exact/strong title and answer matches; supports multiword/prefix matching and cautious normalization, honest no-result recovery, no fabricated answers.
- Cleanup: Edit, Archive, Delete, Restore, bulk selection and non-destructive duplicate suggestions. Archived memories excluded from default search but retained.
- Recently Deleted: 30-day recoverability, then eligible for disclosed safe purge. Explicit confirmation for earlier permanent deletion.
- REQUIRED storage-health check and cleanup review at app/device storage pressure. No forced user deletion. Warning/critical thresholds NOT approved.
- Find exposes Spaces and Categories directly, secondary Verification/Reminders/Attachments under More filters.
- Detail shows compact truthful verification summary (status, existing source, last verified date when known). Review EXPANDS INLINE for source, controls and history.

## 2. Proposed Find mechanics for owner review
Default = active memories. Search saved title, answer, location, notes and approved organization labels. Stable tie-breakers. Do not equate distinct model numbers. Space filters All, one, Unassigned; Categories All, multiple or Unassigned. Multiple Categories match ANY; combine with Space and query using AND. Removable active chips; Clear filters preserves query. More: Verification, overdue/today/future Reminders, Has attachments. Home Reminders See all opens due-filtered Find; Recently saved See all opens active collection. Returning from Detail restores query/filter/scroll when possible. Archive and Recently Deleted have explicit separate views. No-match recovery: retry phrase, clear filters, browse, save a memory.

## 3. Answer Detail screen — proposed layout
A. Back button and overflow menu.
B. Memory title/question, then full SAVED ANSWER prominently and selectable.
C. Owner-approved COMPACT verification summary immediately below answer: status (Verified, Needs checking, Unknown), source and last verified date only if known; Review button.
D. Optional Space and all Categories, location details, notes, attached photos/media and due reminder.
E. Visible Edit and Share; overflow Archive/Delete. Restoring happens from Archive or Recently Deleted view.
F. Review expands INLINE and preserves scroll/focus context; exposes current source, source type/note, explicit status actions and history. Collapsing does not silently save edits.
G. Hide empty metadata instead of inserting fictional source, date or photos. Clearly label demo content.

## 4. Verification contract
Verified means the USER intentionally confirmed the answer against an identified source, not independent CasitaDex certification. Source description required to mark Verified; source type and note optional. Unknown is unverified, Needs checking requires review but answer stays readable. Substantial answer edit resets to Needs checking and clears current verified date while preserving prior events. Changing source requires reconfirmation. Metadata-only editing does not change factual confidence; browsing never updates status.
History includes actual source confirmations, edits and status changes chronologically; legacy records may have gaps that must not be fabricated. Existing source shown/prefilled in Review. Persist successful changes before UI claims success; failed save retains draft. Verification states use text and accessible semantics, not color alone.

## 5. Edit, share and removal — proposed rules
Edit title, answer, Space, Categories, notes and supported metadata. Save atomically when possible; cancel/route changes cannot silently lose draft. Create/rename labels in Add/Edit without losing input. Removing a label must never delete a record. Share requires an explicit preview, defaults to title and answer; location, notes, source, categories and photos separately opt-in.
Archive hides from active Find but retains full data and storage. Delete moves to Recently Deleted, is hidden from active Find and reminders, recoverable for 30 days. Earlier permanent delete requires explicit confirmation. Before permanent purge handle media references, interrupted cleanup, clock jumps and backup restores. Bulk select identifies affected count before confirmation. Duplicates are suggestions only. Neither archive nor soft deletion claims freed bytes.

## 6. Storage safeguard — approved intent, thresholds open
At meaningful app/device pressure, REQUIRED storage-health check and actionable review from More > Storage & Cleanup. Show honest app versus device storage metrics. Never force user deletion or silently purge active/archived content. Large photo imports and restores must check write capacity and fail safely. Warning/critical numbers and exact timing remain pending owner and engineering validation.

## 7. Native acceptance matrix — required, NOT YET RUN
- Search: instant/offline, case and multiword queries, exact model numbers, relevance benchmarks, prefix handling, stable ties, no-result recovery, no fabricated answers.
- Find: optional Space/Category, on-demand creation and safe rename/delete; correct filters, removable chips, reminder deep link; restore query, filter and scroll; Archive/Deleted exclusion.
- Detail: full long answers, optional metadata, media, genuine prefilled source; inline expandable Review preserving focus and draft.
- Verification: all status transitions, source required for Verified, material answer edits invalidate, history fidelity, failed-save handling.
- Edit/share: preserve unsaved changes, safe writes, exact explicit share preview and attachment opt-in.
- Lifecycle: archive, 30-day recovery, expiration, bulk confirmation, interrupted delete, device clock shifts, media, backup/restore.
- Storage: trigger thresholds/metrics tested on Android, incomplete-write protection, no forced user deletion.
- QA: airplane mode, reboot, TalkBack, 130–200% text, light/dark, phone/landscape/foldable and owner usability acceptance.
All evidence gates remain OPEN until tested.

## 8. Open decisions and gates before implementation
Owner signoff of consolidated Find/Detail draft is APPROVED; engineering gates remain OPEN. Numerical storage warning/critical triggers remain OPEN. Exact review wording, verification history schema, selective share behavior and retention UX should be confirmed as part of final review.
Engineering gates: multi-category migration and stable IDs, old data/legacy search compatibility, handling existing Buy/Fix/Find/Maintain contexts without confusing them with Categories, archive/deleted timestamps, clock changes, references to media, 30-day purge safety, backup format/restore compatibility, search index benchmarks, Android storage capacity APIs, accessibility and native QA.
Implementation code, schema changes, builds, commits, pushes and Production/cloud work are NOT authorized by this draft. Preserve existing dirty files. Home v1.1 remains independently signed off.

