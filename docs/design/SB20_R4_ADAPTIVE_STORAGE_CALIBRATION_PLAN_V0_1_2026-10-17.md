# CasitaDex SB-20 — R4 Adaptive Storage Calibration Plan v0.1
2026-10-17 | DESIGN RESEARCH / OWNER REVIEW — NOT IMPLEMENTED
Inputs: signed More v0.9 Decision 3 adaptive capacity protection, signed integrated SB-20 baseline and approved R3 planning. No actual Android capacity probe, app operation, data write, migration, build or physical device tests performed.

## Contract and dimensions
Compare measured usable device storage with estimated final writes PLUS peak temporary/staging/rollback/journal bytes for each operation. Never assume a fixed percentage alone is safe. Distinguish app-owned media bytes, records/cache/temp, device-wide usable bytes and reserved OS safety margin. Unknown measurements must show Unavailable and lead to safe retry or denial of risky operation, not invented figures.
Operations require separate estimates: Add up to five photos; camera or gallery import copy/hash; autosave draft; Save record+promote photos; full backup creation to local destination; restore import with prior-state rollback; purge physical media only when safely unreferenced. Account for bytes needed concurrently, not just eventual output.
Storage pressure states: healthy (quiet), warning (explain and offer review), critical (require capacity check and guided review). No compelled user deletion. Block a specific unsafe write if capacity genuinely insufficient even when user dismisses guidance. Archive and soft-delete NEVER count as reclaimed bytes. Success and freed-space claims require verified post-operation data.

## Proposed calibration protocol (no numeric thresholds approved)
1. Device/API matrix: Android versions and supported emulator sizes; distinguish capacity API usable-by-app vs physical device-wide free space. Observe app internal files, media and destination volume for exported backups. Avoid equating app quota with device storage.
2. Per-operation budgets: benchmark input byte sizes, peak staging, decoded image memory, journaling and recovery snapshots; instrument actual peak file use, latency and failure outcomes. Keep separate cost models for photo import, Save, backup and restore.
3. Warning/critical thresholds: derive tested minima and conservative reserve from real evidence (absolute bytes and/or adaptive percentage only as appropriate). Document confidence intervals and device-dependent headroom. Owner must approve explicit numerical policy after testing, before runtime enforcement.
4. Hysteresis: prevent repeated warnings on tiny available-space changes; do not suppress a genuine unsafe write. Recheck immediately before and during a multi-step write because free space can change.
5. Failure response: preserve last durable draft and original collection; no automatic irreversible deletion; show actionable cleanup review and estimated requirements; return to interrupted task when space is safe.
6. Reporting: never double count media embedded in totals; explain inaccessible API results and no true byte reclamation from Archive/Recently Deleted.

## Future tests and acceptance (not performed)
S01 healthy low-content device remains quiet; user can view storage on demand.
S02 pressure from five large photos warns/blocks only unsafe operation, preserves draft/photos.
S03 backups with photos and draft, low-space export location and write failures preserve source and no fake success.
S04 restore tests peak new data plus old rollback snapshot and interrupted rollback.
S05 unpredictable capacity changes after preflight, missing API, and invalid media-size estimates fail conservatively.
S06 sustained pressure plus hysteresis stops alert storms, does not enable unsafe writes.
S07 physical deletion only after unreferenced media verified; archive/soft delete report zero reclaimed bytes.
S08 font scaling/TalkBack and dark/light convey state with words, not color alone.

## Gate disposition
R4 is a specification for benchmark/data collection, not proof thresholds are valid. Exact numeric warning/critical triggers, conservative free-space reserve, supported measurement APIs and performance thresholds remain engineering+owner decisions. Do not run calibration on an owner device until separately authorized. Current status: R3 approved PLAN, R4 draft ready for review, all implementation on hold.
