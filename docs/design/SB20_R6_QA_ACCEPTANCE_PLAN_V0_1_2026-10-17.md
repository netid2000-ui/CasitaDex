# CasitaDex SB-20 — R6 QA and Native Acceptance Plan v0.1
Date 2026-10-17 | OWNER REVIEW DRAFT — NO TESTS RUN
Governing signed design and R0-R5 methodology approvals. R6 creates an evidence plan, NOT authority for source edits, test builds, emulator launch, device changes, migrations, cloud or deployment.

## Test pyramid and release principles
Layer 1: pure model, search, storage estimator, backup format, media journal, migration validators, lifecycle and reminder rules using deterministic synthetic fixtures.
Layer 2: SQLite file/media/draft fixture integration with forced write errors, partial promotion, same-ID retry, interrupted cutover and isolated restore. No owner's data.
Layer 3: Android emulator visual/offline usability and background/restart recovery; AFTER separate permission for execution. Existing Android physical offline PASS covers prior prototype only.
Layer 4: owner-observed Samsung physical Android acceptance after separate explicit permission and proven test-data safeguards; no silent removal of device data.
Existing future scripts: npm run typecheck, npm test, npm run lint, npm run doctor, npm run qa:ci; do not assume they cover SB-20 until new tests are added and executed under authorization.

## Independent functional groups
Q01 Home GO keyboard and blank, due reminders and photo-only 'Photo memory' card.
Q02 Find offline relevance/exact identifiers, optional Space/Category filters and return state.
Q03 Detail truthful verification/source/history, edits, share previews and media viewer.
Q04 Add title+answer OR photo, five-photo cap, staging failure, duplicate review and one durable draft.
Q05 Legacy migration: IDs, context, Spaces, original answers, verified evidence, media hashes retained.
Q06 Archive/30-day Deleted/restore, no premature purge/clock-jump and reminder suppression.
Q07 R4 adaptive storage checks, measured device/free bytes and interrupted unsafe-write safety.
Q08 R5 full backup with deleted/archive/draft media, old-format compatibility, restore rollback.

## Non-functional and accessibility coverage
Q09 TalkBack reading and selected tab semantics, 48dp targets, screen focus, real status text not just color, 130-200% font and large contrast.
Q10 phone/landscape/foldable/tablet, keyboard inset and photo zoom; no obstruction of Save or Find.
Q11 airplane mode, force-stop, restart, locale/timezone changes, and offline backup/export/restore.
Q12 memory integrity/performance on 0, 1, 500 and 5,000 records (bound by old backup limit, new performance budget TBD), multiple photos and repeated storage warnings.
Q13 corrupted/truncated/duplicate-ID media backup, unsupported future version, permission denial and path traversal fail closed without source mutation.
Q14 privacy: no unapproved sync, telemetry, secret exposure, photo-share implicit opt-in or false verification/backed-up claims.

## Evidence matrix and exit gates
Each scenario records fixture ID and prior hash manifest, environment/version, actual steps and outputs, expected vs actual results, persistence after restart, before/after data and photo hashes, time/capacity measurements if relevant, test logs/screenshots without real personal data, defect severity, rerun and owner acceptance. P0 source snapshot does not replace actual Android data backup.
No PASS without actual execution. Severity-1 data loss, undetected corruption, broken rollback, source-photo loss, false verification and mandatory deletion are NO-GO. Severity-2 key navigation, offline, accessibility and photo-only regressions block broad release pending owner disposition.
Required sequence after separate authorization: contract fixtures -> isolated SQLite/media migration -> emulator Android offline+visual -> restore interruption -> accessibility -> separately approved physical device owner signoff. Cross-platform iOS is not proven by Android acceptance and requires independent planning/authority if targeted.
Status: R6 prepared for owner review; no automated, emulator or physical tests executed.
