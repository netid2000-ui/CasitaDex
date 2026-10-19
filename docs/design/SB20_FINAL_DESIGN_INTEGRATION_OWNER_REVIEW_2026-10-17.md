# CasitaDex — SB-20 Final Design Integration Review v0.9
Date: 2026-10-17 | Designs by F&A
STATUS: OWNER APPROVED FINAL INTEGRATED DESIGN BASELINE; IMPLEMENTATION ON HOLD
Design ONLY. No source/schema edits, builds, commits, pushes, deployments, cloud or device actions authorized.

## 1. Owner-signed source baselines
Home v1.1 and cross-tab photo-only amendment; Find/Detail v0.9 plus photo-only clarification; Add v1.0; More v0.9. Cross-tab owner decision log approved photo-only Home 'Photo memory' cue. All four tab-level design signoffs remain in force. Project promise: Fewer features. Faster answers. Offline-first with user-owned local data; manual data export/restore free.

## 2. Navigation and content
Four tabs Home, Find, Add, More. Home GO/Search hands trimmed query to Find; blank goes default Find; Save a memory to Add; Recently saved See all to Find; due reminders See all to reminders-filtered Find. Find live local search, optional Space/Category filters, secondary verification/reminders/attachment filters, context preserved returning from Detail.
Add requires meaningful title plus saved answer OR photo, up to 5 new photo attachments, visible Take Photo and Import via Photos/files. One local recoverable draft. On Home max two recent compact cards: if answer exists, title plus saved answer; photo-only title plus literal 'Photo memory', no Home thumbnail. Find and Detail photo-only show real photo thumbnail/zoom and truthful cue, no OCR/fabricated answer. Add draft never appears in Find.
More groups: Memory management (Storage & Cleanup first), Data protection (full photo-inclusive Backup & Restore), Preferences & help.

## 3. Shared domain rules
Spaces optional 0/1 WHERE; Categories optional 0..many WHAT. Create/rename/delete labels without removing records. Legacy Buy/Fix/Find/Maintain contexts must survive mapped versioned migration.
Verification starts Unknown, Verified requires user-confirmed source; material answer changes reset Needs checking. Detail has compact summary and expandable inline Review; Home no checking queue.
Home reminds only due/overdue up to two, oldest overdue first; archive/deleted suppress reminders. Archive reversible, retains storage. Recently Deleted protects records/photos for 30 days then safe eventual purge eligibility, guarding clock changes. Duplicates suggestions only.
Adaptive storage checks usable device space AND operation write/temp/rollback headroom; pressure prompts mandatory check/review, never forced deletion. Full manual portable backup includes photo media, lifecycle state, user labels and one unfinished draft with staged photos. Text-only excludes photos. Restore previews replacement and draft conflict and requires explicit confirmation. No required cloud/account/paid service.

## 4. Findings and disposition
F1 Home photo-only compact recent card RESOLVED with owner Option A; Home amendment saved.
F2 Find photo-only fallback clarified; actual rendering/empty answer data engineering gate.
F3 Legacy contexts vs Categories requires safe migration.
F4 New backup format and draft/media restore requires versioning and rollback testing.
F5 Reminder suppression/reinstatement designed; durable state tests pending.
F6 Duplicate matching consistent advisory; thresholds and performance QA pending.
F7 Adaptive storage shared across Add, Find media, More and restoration; numerical margins/API QA pending.
F8 User-facing vocabulary: Memory, Photo, Answer, Space, Category; legacy internal terms allowed until safe migration.
F9 Stale 'pending signoff' statements in early files require docs-only cleanup; signed approval artifacts govern.

## 5. Acceptance coverage — NO TESTS EXECUTED
Offline/restart; Home GO and due reminders; Find filters, relevance, Detail return; Add 5 photos, photo-only, import failure, safe draft; verification transitions, archive/30-day trash, clock changes; full backup including draft/photo and conflict restore; storage pressure; TalkBack, large text, dark/light, phones, foldables. All engineering acceptance gates OPEN.

## 6. Implementation-readiness status and open gates
OWNER: all four tab designs and final cross-tab integration SIGNED OFF 2026-10-17; F1 clarification approved. Any additional material visual/policy amendments require explicit owner approval.
ENGINEERING: existing dirty tree baseline and recovery, data/SQLite and legacy taxonomy migrations, no-answer photo schema and index, media/draft staging and sharing, verification/reminder durable history, archive/30-day deletion purge clocks, adaptive storage thresholds and performance, versioned full backup+draft+photos, restore atomicity and draft conflicts, accessibility and real physical Android acceptance.
GOVERNANCE: final design integration approval, if given, is NOT code implementation authority. Owner must later separately authorize an isolated development super-batch with bounded scope, rollback, tests and acceptance evidence. Preserve existing uncommitted source and design files, no commits or deployments now.

## 7. Recommended next owner gate
Approve SB-20 integrated DESIGN baseline with engineering gates open, or request specific design amendments. Do NOT start application implementation until separate explicit authorization.

