# CasitaDex SB-20 — More Tab Research and Functional Design v0.1
2026-10-17 | Designs by F&A | OWNER REVIEW DRAFT, NOT APPROVED
DESIGN ONLY; no code/migrations/build/commit/push/cloud/device changes.
Prior signoffs: Home v1.1, Find/Detail v0.9, Add v1.0. Charter Amendments D-F: offline household memory, free access to personal data/manual full backup, no upgrade pressure. Cloud/paid convenience requires separate research and authorization.

## Observed current implementation
src/screens.tsx More contains: extra-large text, System/Light/Dark; Android full backup (answers and photos), backup check and destructive restore confirmation, previous-full-save recovery; text-only export/import/check/recovery; local-only privacy and support notes. Content is long and mixes preferences, backup and technical recovery. Text-only backup expressly omits photos. Archive, Recently Deleted, user-defined Categories, storage-pressure review, label management are approved design but not implemented.

## Proposed More purpose and hierarchy
More protects and manages memories without promoting an inventory.
Top: truthful local-storage message; never imply local-only equals backed up.
Memory management: Archived memories, Recently Deleted (30 days), Storage & Cleanup, Manage Spaces & Categories.
Data protection: Backup & Restore, with full photo+text backup prominent and text-only export clearly described.
Preferences & help: Appearance & Accessibility; Help & About.
Potential premium cloud convenience remains future OPTIONAL Settings only, not authorized for build or payment.

## Proposed functional areas
Archive: browse, search within archived items, review detail, select and restore; archive does not reclaim disk space.
Recently Deleted: 30-day recovery, item deletion date and remaining window, restore, explicit early permanent-delete confirmation; purge eligible expired items safely, with backup/media/date-jump safeguards.
Storage & Cleanup: distinguish app content, photos, trash, backups where measurable and actual device usable free storage; explain archive vs soft deletion vs physical byte reclamation; suggest large photos and duplicates, never force deletion. Mandatory review under real storage pressure; warning/critical numerical thresholds NOT YET APPROVED.
Manage Spaces & Categories: user-initiated rename/delete without deleting memories; report affected associations; unassigned is valid. Show how existing Buy/Fix/Find/Maintain contexts map after migration before destructive taxonomy changes.
Backup & Restore: prominently offer FULL photo+text export, with a verified completed-file status only after success; text-only labelled EXCLUDES PHOTOS. Restore must preview counts, source and differences, disclose replacement risk, check data hasn't changed, and preserve rollback where feasible. Manual export/restore remain free and local. No scheduled cloud/backups/account requirement.
Appearance & Accessibility: preserve extra-large/system font scaling, System/Light/Dark; TalkBack labels, no color-only meanings and reachable touch targets.
Help & About: app version, offline/privacy limitations, local is not backup, safe support/feedback, no passwords or alarm codes.

## Open owner decision 1
Pick landing-page hierarchy: A flat full list, B grouped Memory Management / Data Protection / Preferences & Help (RECOMMENDED), C compact shortcuts with secondary Settings. The group choice is pending and should not be marked approved.

## Acceptance proposal / gates
Every workflow works offline; keyboard/TalkBack/large fonts/foldable; absence of photos or archives does not show false states; free full-data export+verified restore; preview and confirmation on destructive action; 30-day recovery and no silent purge of active records; storage calculations honest; errors never claim success; backup and local storage statuses differentiated. No native QA tests run.
Engineering: archived/deleted schema and data migration, media reference cleanup, portable backup compatibility, capacity APIs, split routing/navigation, atomic restoration, clock jumps; cloud/paid scope remains unapproved. Preserve dirty worktree.

## Decision 1 APPROVED — More grouping
Owner selected B: Memory management; Data protection; Preferences & help. See SB20_MORE_OWNER_DECISIONS_2026-10-17.md. Internal subsections remain under functional design review, not yet approved.

## Storage & Cleanup detailed proposal
Show app-owned data, photos, Recently Deleted bytes, drafts and known temporary/recovery storage where APIs permit accurate measurement, separately from reported usable DEVICE storage. No fabricated metrics; disclose if overlapping/estimated. Mandatory pressure check/review, no forced deletion; numerical thresholds and hysteresis open. Warn before media import, backup, restore and other large writes; protect drafts and current data on insufficient space. Large-photo and possible-duplicate review requires explicit user selection; only verified physical cleanup counts as reclaimed storage, not Archive or soft-delete.

## Archive and Recently Deleted detailed proposal
Two explicit destinations. Archive retains record and media, suppresses active Find/reminder obligations, supports review and Restore. Recently Deleted uses deletion date and 30-day recovery, shows remaining period if credible, allows Restore or early irreversible Delete with confirmation. Records past expiry become eligible for safe later purge, not instantly erased in foreground. Clock discontinuity/backup-restore anomalies must block risky purge, preserve usable recovery where possible. Photo/media and verification history retain record association through archive and recoverable delete. Never delete active/archived content automatically.

## Backup & Restore detailed proposal
Dedicated destination retains CURRENT native full backup with images, text-only export, check/preview, replace confirmation, previous-save recovery. Prominently label photo-inclusive full backup versus text-only EXCLUDES PHOTOS; no false independent-backup success. Preview record/photo counts and replacement impact. Reject invalid formats, inconsistent metadata and insufficient space safely; detect intervening local collection updates prior to confirm. Explicit decision needed whether unfinished single draft is included in portable full backup; do not silently imply coverage. Future provider-connected encrypted scheduled backup is separately gated and never a precondition for free manual full export or restore.

## Appearance & Help detailed proposal
Appearance/System-Light-Dark; preserve extra-large text and OS font scaling. Help & About includes local/offline limitations, version, privacy-safe support, backup explanations, and safe sharing guidance. No intrusive premium placement. Reader settings need durable save and screen-reader semantics, including high text scaling and dark/light verification.

## More acceptance and gates
Design-level requirements: grouped navigation retains all old tools, Archive and Recently Deleted actions reversible where specified, clock-change and photo reference protection, zero-record empty states, measurement uncertainty surfaced, pressure-check without forced deletion, backup preview/replace safety, offline and reboot persistence, TalkBack, large fonts, landscape and foldables. No implementation/QA has been performed. Open: numerical capacity thresholds; purge timing/error UX; backup inclusion of unfinished drafts; default More order and user education; native API migration. Owner decision pending on prioritization of Storage & Cleanup vs Archive/Recently Deleted as the first Memory management tile.

## Storage-first decision and adaptive thresholds — 2026-10-17
DECISION 2 APPROVED: Storage & Cleanup first in More > Memory management; then Archived, Recently Deleted, Manage Spaces & Categories.
PROPOSAL (not approved): storage health combines trustworthy Android usable-device-free-space readings, actual CasitaDex media/database consumption where measurable, and projected operation-specific temporary+final write headroom. Normal = quiet; warning = explain constraints and offer review; critical = required health check + visible guided cleanup review prior to risky large writes, without forcing user deletion. Invalid/stale/unavailable measurements must be disclosed; fail safely before dangerous writes without falsely claiming the whole device is full. Avoid oscillation across states via tested hysteresis. Do not approve a fixed GB/percentage number without device QA.
Cleanup review order: largest media (with associated memory context), exact duplicate candidates (review only), Recently Deleted eligible items (explicit permanent-delete choice while within 30 days), archived records for organization only. Archive and soft delete cannot be presented as freed bytes; report actual bytes reclaimed when verified after physical cleanup.

## Archive / trash review safeguards
Archive remains a reversible active-search exclusion with metadata/photos/historical verification untouched; suppress archived due reminders without falsifying completion. Recently Deleted retains 30-day user restoration; show deleted date and reliable remaining period, disclosure that expired items are eligible for later safe purge. Device time jumps, backup restoration and crashes cannot cause unsafe early physical deletion. Confirm irreversible deletion, handle shared/unreferenced images atomically, and show truthful storage outcome.

## Backup / restore safety requirements
Primary action: full portable backup of supported memory text, photo attachments, labels, statuses and lifecycle data. Text-only export explicitly EXCLUDES photos; ensure legacy backup types cannot masquerade as full backup. Verify container/checksum/schema and successful destination write before 'Backup complete', but never imply off-device or restore-tested automatically. Backup and Restore screen distinguishes export, inspect, replace and previous-save recovery. Restore has preflight capacity, source and count preview, explicit replace-vs-current warning, state-change recheck before confirmation, recoverable rollback, no silent merge or corruption. Archive/Deleted/draft coverage must be explicitly specified and QA-tested; unresolved decision whether portable full backup includes active unfinished draft. No cloud or paid gate to manual full export/restore.

## Decision 3 for owner (still open)
Choose storage pressure detection: A static GB/% thresholds; B adaptive device-free-space PLUS projected operation write headroom, verified with real Android measurements (recommended); C user-configurable thresholds. Regardless of choice, mandatory pressure check and guided review (not deletion) remain approved. Exact numerical values, stale-measurement fallback, check cadence and background OS constraints require follow-up engineering acceptance.

## Decision 3 APPROVED — adaptive storage protection
Owner approved Operation-aware adaptive capacity checks: trustworthy device free-space measurements plus expected output, temporary copies and restore rollback headroom. Healthy stays quiet, warning guides review, critical requires storage-health check and visible cleanup review but never forces user deletion. Unsafe large writes fail safely, preserving saved memories/draft. Numerical thresholds, headroom constants, retry and hysteresis need Android measurements and explicit later approval.

## Full-backup completeness proposal (still under review)
Full portable backup should include active and archived memories, 30-day recoverable deleted records WITH status/deletion timestamps, photos with integrity references, Spaces/Categories, notes/locations, verification history and reminders. Exactly which backup version supports these schema additions is an engineering compatibility gate. Do not claim current prototype already exports draft/archived state or custom Categories.
Text-only export prominently omits photos (and any other unsupported content). Full backup completion means destination write and integrity check succeeded, NOT independently verified restore/off-device copy. Backup may be stored in user-chosen local/provider destinations through OS document picker, but this is not automatic cloud integration.
Unfinished single-draft inclusion remains OPEN: recommended full backup include it in distinctly marked optional draft payload, with restore conflict preview and explicit choices; exclude from text-only if photo staging cannot be represented losslessly. No silent replacement of current device draft.

## Restore workflow, safety and 30-day retention proposal
Select file -> verify format/schema/integrity/media manifest -> measure projected staging/rollback capacity -> preview active/archive/deleted record counts and photo totals -> explain that current collection might be replaced -> confirm -> prepare rollback/staged transaction -> atomic logical transition -> verify resulting associations. If validation, capacity or writing fails, preserve current collection or clearly offer previous-save recovery; avoid false 'restored' notices. Detect changes made since backup preview, require recheck. Unsupported future schema must fail non-destructively.
Recently Deleted: 30-day recovery measured from truthful durable deletion event; restore or explicit early permanent-delete; auto-purge only after safe eligible window, with clock-jump defensive handling, atomic photo cleanup and visible status. Backups can carry deletion state; importing an old backup does NOT bypass current deletion safeguards without user review. Never purge archived or active records by age.
Potential draft conflict during restore: if full backup includes an unfinished draft and device already has one, preview Resume existing / Replace with backed-up draft / Skip imported draft; never silently overwrite. Decision whether to INCLUDE drafts in full portable backup is pending owner approval.

## Acceptance and remaining gates — NO TESTS EXECUTED
Storage: actual device free bytes, app/photo/temp consumption, predicted write headroom, unavailable capacity probe, failed import and atomic recovery, warning noise.
Cleanup: large-media and possible duplicate suggestions non-destructive, archive/restoration, 30-day Recently Deleted, clock changes, interrupted purge and media references.
Backup: full vs text-only content disclosure, backup output integrity, off-device/manual destination, media and labels inclusion, backup-version migration, conflict previews, interrupted restore and rollback.
Draft: optional portable payload and conflict handling await owner decision.
Usability: offline, restart, TalkBack, large fonts, dark/light, phone/landscape/foldable. Existing prototype functionality must remain reachable. Numeric thresholds remain unapproved.
Governance: design review only; implementation/schema/build/commit/push/deploy/device operations ON HOLD.
