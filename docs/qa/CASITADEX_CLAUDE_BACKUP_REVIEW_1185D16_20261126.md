# Independent Claude review — CasitaDex Full v4 backup and recovery
Date: 2026-11-26 (America/Chicago)
Reviewer: Claude Sonnet 5.5, Free web interface. Reconciliation: ChatGPT.
Candidate: Mac mini `1185d16c776d30c4c4b64c63e9e9b4f0f4e3c7d3`, tree `4c90ce9bd546ca2e1d5f6c71cce2827057bc5b7d`, signed platform QA Build 4 (November 25 release evidence).
Design authority: current owner-approved SB40 lineage plus subsequent approved updates.
Scope: full backup & restore, linked and standalone reminders, recoverable previous save, draft conflict, staged media, cache lifecycle. Selected source summaries only were shared with Claude; no user memory records or credentials. No CasitaDex application source or native builds were changed in this review. Native owner acceptance remains pending.
Source provenance: Mac QA-Evidence/fa-expressive-contrast-20261125/FA_EXPRESSIVE_MATERIAL_APPEARANCE_20261125.md records the exact local candidate and verified source bundle (SHA-256 057d6bc710f4d7f4c5e21464c59c2b84bd7d5f9cb512fad3179ce7a668f93b66). Direct hosted source sync of that candidate was previously blocked; this report records findings against the pinned local source, not against main.

## Reconciled findings

| ID | Priority | Verified status and evidence | Recommendation |
| --- | --- | --- | --- |
| CD-IR-01 | HIGH | **Confirmed conditional API defect.** `src/eng-store.ts:449–454,480–483` hashes the ordered reminder rows; the empty set already returns a nonempty hash. Supplied stale token correctly rejects, but omission is accepted. `src/eng-screens.tsx:480,490` saves incoming and collection token before asynchronous reminder token completes, then passes undefined if absent. Synthetic SQLite observation confirms omitted token does not enforce comparison. Normal empty-set preview is protected; Claude's suggestion that zero reminders automatically yield a null token is false. | Make valid V4 reminder token required before staging/commit; capture collection and reminder preview together and update the UI state only after all tokens are available. Test token failure, missing token, reminder-only changes and cancel. |
| CD-IR-02 | HIGH | **Confirmed data integrity defect with synthetic runtime evidence.** `src/eng-store.ts:490–493,519–523` captures recovery rows without memory_id, although the table and live save/capture support it (`src/standalone-reminders.native.ts:23–37,59–63`; `src/reminder-restore-v4.ts:7`). A linked reminder returns with a null link following Full v4 restore and previous-save recovery in the in-memory SQLite fixture. | Preserve memoryId in both recovery captures; add all-fields round-trip, migration and repeated recovery tests. Do not declare physical device pass until verified. |
| CD-IR-03 | Covered | **Claude's conditional stale-generation claim is not supported on ordinary/legacy restore.** `src/eng-store.ts:128–145,155–166` transactionally clears stale V4 marker when advancing the previous collection or repairing; existing `tests/eng-v4-atomic.test.mjs` explicitly checks legacy invalidation. V4 writes even an empty reminder section. | Retain regression coverage. Consider corruption/pair generation audit only if evidence justifies it; no unnecessary format redesign. |
| CD-IR-04 | HIGH / test | **Confirmed separate snapshot acquisition, runtime effect not reproduced.** `eng-store.ts:409` obtains collection snapshot; `eng-runtime.native.ts:82–86` later reads reminder section in a separate call. Validity of linked memory IDs across those two instants is not established. | Design one consistent read snapshot, or detect concurrent changes and abort/retry; inject reminder and memory changes during snapshot. |
| CD-IR-05 | Medium | **Risk confirmed; destructive cleanup is intentionally disabled.** `eng-store.ts:410–426,537–565` retains and audits recovery/media-journal references; V4 staging phases do not reach a terminal commit state in the shown path. No evidence of deletion or corrupted current collection. | Introduce reviewed journal reconciliation, accounting, interruption test, and protected recovery ownership. Do not auto-delete user or recovery photos. |
| CD-IR-06 | Medium | **Confirmed cache lifecycle gap / platform questions.** `eng-runtime.native.ts:125–151` deletes Android read-back on normal finally; picker copy-to-cache has no explicit post-review disposal. iOS intentionally retains verified backup and offers reverified sharing (lines 89–119,199–214), not a confirmed off-device backup. | Add safe temporary-file cleanup lifetime and user-controlled retention management; verify iOS file-sharing/iCloud backup settings and provider/no-space behavior. Do not remove retained backups without user action. |
| CD-IR-07 | Medium | **Confirmed review detail gap.** `eng-store.ts:438–447,458–470` keep-current-draft can re-add missing space/category and delete an attempt entry; current preview shows incoming counts and draft choice, not those differences (`eng-screens.tsx:482–490`). Previous full state retains the earlier collection. | Explain added labels and conflict handling in review, test draft identity/taxonomy/previous recovery. |
| CD-IR-08 | Covered / verify | **Corrections to Claude's estimate claim:** `eng-runtime.native.ts:85–87` includes both header frames and 4 bytes per media; `eng-stream-v4.ts:8–17` and `reminder-backup-v4.ts:24–28` validate reminder size before writing. Device capacity is not provider quota. Existing mismatch text says review again. | Keep near-limit and low-space tests; verify SAF provider failure and cleanup on real devices rather than changing working size formula without evidence. |
| CD-IR-09 | Medium | **Additional ChatGPT finding.** `eng-screens.tsx:493–496` always describes recovery as Full v4 with standalone reminders, but confirm branches into ENG-only recovery if marker absent. An ordinary collection save or legacy restore clears the marker; current reminders would then remain unchanged. | Select accurate recovery description from current recoverable state, keep the explanatory text aligned with the actual operation. |

## Synthetic verification

Exact file under Mac QA-Evidence/cd-claude-review-20261126/synthetic-review-observations.mjs used in-memory SQLite and synthetic data only. Observed tests passed their **defect-observation** assertions; this does not mean the application defects are corrected.

- Linked previous-save reminder: before non-null valid memory ID; after V4 restore and recover, NULL. Confirmed.
- Omitted V4 reminder token: empty ordered set produced 64-character hash; a changed reminder set was rejected with a supplied stale hash; omission permitted restore. Confirmed API gap.
- Existing `eng-v4-atomic.test.mjs` plus `reminder-restore-v4.test.mjs`: 16/16 pass, including linked identity in insert, stale reviewed reminder hash, transaction rollback, legacy marker invalidation and older schema migration.
- No native UI, live Apple/Android notification, real household data, or device file-provider test performed for this pilot.

## Release recommendation
Prioritize CD-IR-02 and CD-IR-01 before treating Full v4 recovery as release-ready; then consistent snapshots and informative recovery copy. Claude's independent review is useful, but the source and synthetic verification—not its severity labels—determine what is confirmed. Existing backup integrity, explicit confirmation, read-back and transactional safeguards should be preserved. No correction to CasitaDex source is included in this review-only report.

## Raw Claude response (reconciled above; not authoritative)

# Independent review: CasitaDex Build 4 backup/restore (candidate 1185d16)

This is based only on the behavior you described. I haven't seen the code or run anything natively.

## Already well protected

- **Restore atomicity.** The reminder rows, both recovery slots and `eng_state_v2` change in one exclusive SQLite transaction, with a raw-payload comparison against the current collection. That is the right design.
- **Validation before commit.** Incoming data is validated, every media byte and hash is preflighted, and the reminder section is checked before any SQL runs. Nothing touches the collection until the transaction.
- **Backup verification.** Both platforms read back through the same reader that restore uses. They compare size, header hash, Full v4 and reminder JSON. An unverified iOS file is deleted, and Android attempts to delete a partial file and warns if cleanup fails.
- **Honest copy.** The share-is-not-proof-of-second-copy wording is accurate.
- **Cancel semantics.** Cancel clears the incoming data and changes nothing.
- **Existing tests.** The 170 MB stream, malformed size/free space, the SQL-before-validation order, linked `memoryId` writes and fault-injection rollback cover the main risks, though native coverage is unconfirmed.

## Findings (ranked)

### 1. HIGH: The reminder concurrency check is optional and skipped when the token is falsy
- **Evidence:** `restoreV4` checks `expectedReminderToken` only if truthy, and the UI passes `reminderRestoreToken ?? undefined`. That implies the token can be null or undefined, and an empty-string or zero-like token is falsy too. The token is also captured separately from `store.restoreToken()`.
- **Failure scenario:** The user opens review when they have zero standalone reminders (or the token function returns null), then adds reminders in another view or from a notification action. On confirm, the collection token matches, the reminder check is skipped, and the new reminders are replaced. The recovery slot may preserve them, but the user was told nothing changed since review.
- **Recommendation:**
  - Make the reminder token total. Use an explicit sentinel for the empty state, such as a hash of the empty ordered set.
  - Check `!== undefined` rather than truthiness, and require the token on the V4 path.
  - Capture both tokens in one serialized operation.
  - Fail closed with a "your data changed, review again" state.
- **Regression tests:**
  - Choose a V4 file with no local reminders, add one, then confirm. Expect rejection and no change.
  - Run the same sequence with a token function that returns null, `""` and a rejected promise.
  - Mutate a reminder between the two token captures.

### 2. HIGH: The previous-reminder recovery mapping omits `memory_id`
- **Evidence:** The row type and the `saved.rows` mapping list `id`, `title`, `notes`, `dueDate`, `dueTime`, `repeat`, `anchorDay`, `completed`, `createdAt`, `updatedAt`. There is no `memory_id`, although the table migrates that column and `replaceReminderRowsInTransaction` supports linked `memoryId`. `recoverV4` uses the same mapping.
- **Failure scenario:** The user restores, then recovers the previous save. Reminders that were linked to memories come back unlinked, or come back linked to nothing. That is silent data loss in exactly the path meant to be the safety net.
- **Caveat:** If linked reminders live only in the collection payload and never in this table, the impact shrinks. Your goals say "standalone/linked reminders" and the table supports `memoryId`, so I'd treat it as real until disproved.
- **Recommendation:**
  - Select `memory_id` in the previous-reminder query, map it to `memoryId`, and cover it in the recovery format.
  - Add a round-trip test over every column so a future column can't be forgotten.
  - Version the recovery payload so older `eng_reminder_recovery_v4` rows are handled deliberately.
- **Regression tests:**
  - Seed linked and standalone reminders, restore V4, recover, then deep-equal the rows including `memoryId`.
  - Do the same with a migrated pre-`memory_id` table.

### 3. HIGH (conditional on omitted code): Recovery slots aren't bound as a pair
- **Evidence:** `hasV4Recovery` only checks whether the `eng_reminder_recovery_v4` row exists. The behavior of ordinary commit and legacy restore was omitted.
- **Failure scenario:** The user does a V4 restore, so both slots are written. Later they do a legacy V3 restore, which writes only `eng_recovery_v2`. The stale reminder-recovery row still exists, so the app offers V4 recovery. `recoverV4` then swaps the new previous collection with reminders from a different restore generation.
- **Related case:** If the previous state had zero reminders and no row is written, recovery may restore the old collection and keep the incoming reminders.
- **Recommendation:**
  - Give each recovery write a generation or recovery id stored in both slots.
  - Make `hasV4Recovery` verify that the ids match and the payload parses.
  - On legacy restore and ordinary commit, either clear or version the reminder slot.
  - Always write the reminder slot on V4 restore, even when it is empty.
- **Regression tests:**
  - V4 restore, then legacy restore, then check what recovery offers and does.
  - V4 restore twice.
  - Recovery when the prior reminders were empty.
  - A corrupted reminder-recovery row.

### 4. HIGH to MEDIUM: Backup captures the collection and the reminders non-atomically
- **Evidence:** `snapshotStandaloneRemindersForBackup()` is obtained separately from `source.snapshot`. The header hash and read-back verification prove the file matches what was written, not that the two halves came from the same moment.
- **Failure scenario:** The user completes or deletes a reminder, or a notification handler writes, between the two calls. The backup is internally consistent but reflects two points in time. Linked reminders can then point at memories that are absent from, or newer than, the collection snapshot, and verification reports success.
- **Recommendation:** Take both snapshots inside the same serialization or read transaction as store mutations. Failing that, record the collection and reminder tokens before and after, and retry or abort if either changed.
- **Regression tests:** Inject a reminder mutation between the two snapshot calls. Inject a memory delete while a linked reminder exists.

### 5. MEDIUM: Staged restore artifacts have no described lifecycle on failure, cancel or crash
- **Evidence:** `stageRestore` writes a durable `restore-pending` journal, then stages bytes and marks `restore-staged`. Confirm then runs `restoreV4`. If `restoreV4` is rejected (stale token, capacity, validation) or the app dies in between, nothing described cleans the staged files or reconciles the journal.
- **Risks:**
  - Orphaned media consuming space and counted again by the capacity check.
  - Reconciliation at startup that deletes files a just-committed restore references.
  - Reconciliation that keeps files that were never committed.
- **Recommendation:** Define the journal state machine, including a terminal `committed` or `aborted` state. Reconcile on launch against the database state, not just the journal. Clean up on every `restoreV4` failure path.
- **Regression tests:** Kill the process at each journal transition, including after the SQL commit but before the journal update. Check file state after a rejected `restoreV4`.

### 6. MEDIUM: Privacy and storage lifecycle of full-size copies
- **Evidence:**
  - `copyToCacheDirectory:true` makes a full copy of the picked file.
  - The Android read-back is a full copy in cache.
  - The iOS verified file stays in app-private Documents after a share failure, and apparently after success too.
- **Risks:**
  - The picked cache copy has no described deletion on cancel, confirm or error.
  - Android read-back files are orphaned if the process is killed mid-verify.
  - Documents may be exposed through iCloud device backup or file sharing, depending on configuration.
  - Unencrypted copies of private photos and memories accumulate.
- **Recommendation:**
  - Delete the picked cache copy on cancel, success and failure.
  - Sweep stale read-back and cache copies at launch.
  - State clearly where the retained iOS file is.
  - Offer deletion of the local file after share, or exclude it from backup (`isExcludedFromBackup`).
  - Check whether Documents is user-visible.
- **Regression tests:** Enumerate the cache and Documents directories after each cancel, success and failure path, and after a kill during verify.

### 7. MEDIUM: Keep-current-draft silently alters the restored data
- **Evidence:** Keeping the draft re-adds missing spaces and categories, which means the restored taxonomy is no longer the backup's. It also deletes a "conflicting attempt".
- **Failure scenario:** The preview shows counts from the backup, but the result differs from the preview. The user doesn't know what was deleted or added.
- **Recommendation:**
  - Show the pending additions and deletions in the review step before the choice is committed.
  - Confirm the previous-save slot contains the pre-restore draft and attempt.
  - Name the "conflicting attempt" in plain language.
- **Regression tests:** Draft referencing an absent space or category, draft colliding with an incoming attempt, and recover after both.

### 8. MEDIUM to LOW: Preflight accuracy and misleading outcomes
- **Capacity estimate.** The estimate is 20 + JSON + media bytes, and it must be an upper bound. It should include the reminder frame, per-media headers and hashes, and anything V4 adds on top of V3.
- **Android destination space.** `requireNativeCapacity` checks app storage, but the SAF destination can be another volume or a cloud provider, and its free space isn't checked. Failure then arrives mid-write, after the data was read and the temp work done.
- **Write-side limits.** Confirm the reminder-frame limit is enforced before writing, not only discovered at verification, so the user never creates an unrestorable archive.
- **Stale-token messaging.** A token mismatch is a normal outcome, not an error, and the UI should say "your data changed, review again".
- **Regression tests:**
  - Near-limit reminder counts.
  - Estimate versus actual bytes across media-heavy and reminder-heavy collections.
  - A destination with less free space than the app volume.
  - The stale-token message path.

## Unknowns (not assessed, and worth confirming)

- **Media retention for previous-save recovery.** Does restore or any garbage collection remove photos that exist only in the previous snapshot? `recoverV4` "verifies target", so recovery should fail loudly if files are gone. The better outcome is that previous-snapshot media is retained until the next restore. This is the highest-value test of the unknowns: restore a backup lacking photo A, force a cleanup pass, then recover.
- **Ordinary commit behavior.** Does any normal write overwrite or clear `eng_recovery_v2` or `eng_reminder_recovery_v4`? This decides finding 3.
- **Origin of `reminderRestoreToken`.** Is it a content hash with deterministic ordering, a row count, or a timestamp? Weak tokens miss edits that don't change the count.
- **Linked reminder storage.** Where do linked reminders live, the SQL table, the collection payload, or both? This sets the real impact of finding 2.
- **Native test coverage.** Whether the 170 MB, free-space and fault-injection tests run on device and emulator or only in Jest with mocks.
- **iOS Documents exposure.** Whether the iOS file-sharing and backup-exclusion Info.plist settings apply.
- **Platform behavior.** SAF provider differences (Drive, OneDrive, SD), iOS background suspension during share, low-memory kills during the 170 MB stream, and the picker's failure behavior with low cache space.

## Suggested priority for the next build

1. Fix finding 1 (a small change) and add its tests.
2. Fix finding 2 and add the all-columns round-trip test.
3. Resolve the finding 3 unknowns and add recovery pair-binding, which is a format change best done before Build 4 ships.
4. Make backup snapshotting atomic (finding 4).
5. Specify the staged-artifact lifecycle and the cache cleanup rules (findings 5 and 6), then verify with kill-point tests on real devices.
