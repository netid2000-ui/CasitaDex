# CasitaDex — SB-20 More Specification v0.9
Date: 2026-10-17 | Owner: Designs by F&A
STATUS: OWNER-APPROVED DESIGN BASELINE — SIGNED OFF, IMPLEMENTATION ON HOLD
Design only: no application code, migrations, builds, commits, pushes, deployments, stores, cloud, purchases or physical-device actions authorized.
Sources: PRODUCT_CHARTER.md (including Amendments D-F), SB-18 design baseline, signed Home v1.1, Find/Detail v0.9, Add v1.0, SB20_MORE_OWNER_DECISIONS_2026-10-17.md and SB20_MORE_SPEC_V0_1_RESEARCH_OWNER_REVIEW_2026-10-17.md.
Principle: Fewer features. Faster answers. More is the quiet home for managing, protecting and recovering memories, NOT an inventory-progress dashboard.

## 1. APPROVED decisions
D1: Three More groups: Memory management; Data protection; Preferences & help.
D2: Within Memory management, Storage & Cleanup first, then Archived memories, Recently Deleted, Manage Spaces & Categories.
D3: Adaptive storage protection combines measured usable device capacity and estimated final + temporary operation-specific write requirements. Mandatory health check and guided review during meaningful pressure, NEVER forced user deletion. Numeric warning/critical thresholds remain OPEN.
D4: Full portable backups INCLUDE the single recoverable unfinished Add draft and successfully staged photos. Restore must explicitly resolve a current-draft vs backup-draft conflict, without silently overwriting either.
Prior project approvals: 30-day Recently Deleted recovery; free manual portable full backup/restore and local core features; offline-first; no required account/cloud, no loss of photos due to optional labeling, and no premium obstacle to data recovery.

## 2. MORE landing page (approved hierarchy, proposed item behavior)
A short truthful local-data explanation (locally saved is NOT necessarily backed up).
MEMORY MANAGEMENT: Storage & Cleanup (first), Archived memories, Recently Deleted (30-day recovery), Manage Spaces & Categories.
DATA PROTECTION: Backup & Restore (full photo+text backup prominent; text-only export distinctly labelled).
PREFERENCES & HELP: Appearance & Accessibility; Help & About.
Use accessible list rows and 48dp targets, simple labels, meaningful empty states, system insets and no technical recovery controls exposed unintentionally on landing page. Normal storage summary stays quiet; only evidence-backed storage concern rises in prominence.

## 3. Storage & Cleanup — adaptive safety contract
Display app-owned storage and photo/media, draft/temporary/recoverable content where accurately measurable, plus DEVICE usable free bytes distinctly. Do not double count categories: some deleted photo bytes may overlap aggregate media. Unknown measurements show 'Unavailable' rather than fabricated numbers. Operation preflight estimates final output plus temporary/staging, hashing, journal and rollback overhead, accounting for OS usable capacity and tested safety margin.
Healthy: quiet information. Warning: reason and nonblocking guided review. Critical: required check and actionable storage review, but NEVER mandatory deletion. If large operation cannot be completed safely, stop that operation and preserve saved memories and last durable draft. Check before large photo imports, multi-photo saves, restores and backups that write to local storage; capacity may change after preflight, so recheck at actual write. Test state hysteresis to avoid notification loops.
Storage & Cleanup actions: review largest photos WITH attached memory, compare exact duplicate candidates without auto-removal, browse Recently Deleted with remaining recovery policy, review Archived for organization without implying space savings. Only confirmed physical cleanup yields 'space reclaimed'. Dismiss/revisit permitted; critical unsafe writes remain blocked until safe regardless of dismissed review.
Numeric warning/critical thresholds, response to unavailable API data, reserved margins and cadence: ENGINEERING + OWNER GATE OPEN.

## 4. Archive, Recently Deleted and organization
Archive hides a record from ordinary Find and active reminder obligations; retains answer, photos, notes, source, verification history and labels, with explicit Restore. No storage reclaimed merely by Archive.
Recently Deleted moves user-deleted record into recoverable state for 30 days, including photos and associations; show deletion date and remaining window only when trustworthy. Early irreversible permanent-delete requires confirmation describing photos and loss of recovery. After 30 days a record is ELIGIBLE for safe purge at later maintenance checkpoint, not a promise of instantaneous purge. Defend against clock jumps, imported backups, interrupted cleanup, shared references and failed media deletion. Never purge active or archived records on age alone. The record is hidden from everyday Find/reminders while deleted.
Manage Spaces & Categories: create, rename, select, and safely remove labels; show affected associations and never remove actual memories. Keep unassigned valid and reconcile legacy Buy/Fix/Find/Maintain taxonomy through tested migration.

## 5. Backup & Restore — complete portable recovery
CURRENT code: Android native full-photo-plus-answers backup, text-only backups, file check/replace preview and previous-save recovery; preserve accessible capabilities. FUTURE v0.9 contract: full manual backup includes active, archived and recoverable deleted memories with true lifecycle metadata; attached photos and media integrity manifest; Spaces, Categories, locations, notes, source/verification history, durable reminders; and single unfinished Add draft plus successfully staged images (D4). Do not claim these new fields are already supported by existing file format. Version the backup schema and test old-version import without data loss.
Text-only export must explicitly say PHOTOS EXCLUDED and disclose any excluded draft imagery/media, history or lifecycle not supported by that export version. Full backup UI says 'Save full backup' prominently; no ads, cloud requirement, paid gate or automatic network action. Check destination output success and integrity before reporting 'Backup created'; separate a file being created from verified restorable content and off-device redundancy.

## 6. Restore workflow and draft conflict behavior
Select backup -> inspect format/schema, manifest/hash and honest included/excluded contents -> calculate target device write+rollback capacity -> preview active/archive/deleted/photo/draft counts and whether CURRENT collection is replaced -> require confirmation -> staged transactional restoration and verified media association -> report results only after completion.
When backup includes a draft and destination also contains an unfinished draft, do not silently choose. Proposed conflict choices: 'Keep current draft' (restore saved collection, preserve current draft), 'Use backup draft' (only after explicit review and safe protection/recovery of original draft), or 'Cancel restore'. Another non-destructive preservation strategy may be selected if engineering testing supports it; choice wording to be reviewed with owner. Never silently merge two drafts when Add design supports only one. Restore must not resurrect an expired/deleted item as active without its historical deletion state and clear semantics. Verify state did not change since preview and re-confirm if it did. On interruption maintain authoritative current/previous recoverable state; do not claim guaranteed atomic cross-filesystem transitions without test evidence.
Existing previous-save recovery remains reachable. Cloud-integrated premium backup convenience is outside implementation authority and must never limit free manual export or restore.

## 7. Preferences and Help
Appearance & Accessibility retains System/Light/Dark, extra-large text, native OS font scaling and durable user preferences; no color-only states. Accessible group headings, state changes, confirmations; 48dp touch targets for phone, landscape and foldable. Help & About: app version, offline/local privacy, backup limitations, safe sharing, non-sensitive support, and no implied encryption or automatic cloud backup. Future optional premium backup information remains a separate, unapproved integration gate and cannot block core data recovery.

## 8. Future acceptance — ALL OPEN, NOT YET TESTED
M1 Grouped More navigation retains existing functions and accessible focus.
M2 True Android app/device free-space measurements; disclose estimate/unavailable/overlaps; adaptive checks prevent unsafe write; no forced deletion or fictitious reclamation.
M3 Archive/Restore retain record, photos and verification; 30-day Recently Deleted, clock jumps, interrupted purge protect recoverable data.
M4 Full portable backup/verified restore includes active/archived/deleted, photos, Categories, source history, reminders AND staged draft/photos. Explicit limitations for text-only/legacy backups.
M5 Existing draft plus backup draft requires explicit non-destructive conflict resolution. Cancel/failure never silently overwrites.
M6 Low storage, corrupted/unsupported backup, stale preview and interrupted operations fail safely and report honestly.
M7 Offline/reboot, TalkBack, large font, dark/light, phone/landscape/foldable and owner usability review must be evidenced after implementation.

## 9. Open gates and governance
OWNER: More v0.9 consolidated spec SIGNED OFF on 2026-10-17; numerical storage warning/critical thresholds, exact restore conflict/retention messages, and any additional policy changes remain open. Approval of full-backup draft inclusion does not authorize cloud automation.
ENGINEERING: platform usable-storage APIs and operation-specific estimates/hysteresis; photos and SQLite accounting; lifecycle timestamps, 30-day purge/clock anomalies/media references; versioned backup format with complete draft and staged images; restore conflicts, interrupted rollback and atomicity; labels/context migration; accessibility/foldable QA. Legacy backups must never silently fabricate new data fields.
GOVERNANCE: design signoff does not authorize code, schema migration, build, commit, push, deployment, cloud, payments or physical-device actions. Preserve existing dirty worktree. After More signoff, complete SB-20 cross-tab consistency and a separate implementation-readiness gate before requesting implementation authority.


