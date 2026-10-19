# CasitaDex SB-20 More — owner decisions
Design only. No app implementation or migration authorized.

## DECISION 1 APPROVED — Three grouped sections
Owner approved Option B. More landing page has three grouped areas: (1) Memory management — Archived memories, Recently Deleted, Storage & Cleanup, Manage Spaces & Categories; (2) Data protection — Backup & Restore; (3) Preferences & help — Appearance & Accessibility, Help & About. The current prototype features must remain available under suitable destinations, not removed. More v0.1 is not yet signed off. Detailed storage/delete/backup/prefs behaviors under design review; implementation HOLD.

## DECISION 2 APPROVED — Storage & Cleanup first
Owner approved Option B: within the grouped More > Memory management section, place Storage & Cleanup first, followed by Archived memories, Recently Deleted, and Manage Spaces & Categories. Normal healthy storage status remains calm and unobtrusive. Evidence-backed storage pressure triggers mandatory storage-health CHECK and cleanup REVIEW but never mandatory user deletion. Numerical warning/critical values are NOT yet approved. Archive and recoverable delete cannot be counted as bytes reclaimed. Detailed storage, backups and deletion safeguards remain under design review, with implementation fully ON HOLD.

## DECISION 3 APPROVED — Adaptive storage protection
Owner selected Option B: determine pressure from measured usable device capacity together with operation-specific projected final and temporary write requirements, incorporating tested warning/critical guardrails. Mandatory storage-health check and guided cleanup review under actual pressure; never forced user deletion. Measurements must be truthful, uncertainties disclosed, safe error handling if the free-space probe is unavailable. Fixed warning/critical numeric thresholds remain engineering/owner gate pending tests, not approved by this decision. No implementation authorized.

## DECISION 4 APPROVED — Full backups include unfinished draft
Owner selected Option B: full portable backups include the single recoverable unfinished Add draft and its successfully staged photos. Restore must detect conflicts with an unfinished draft already on the destination and offer an explicit, non-destructive choice. Never silently replace, drop or publish current or imported draft. Photo integrity, atomic staging, compatibility, low-space preflight and restoring across backup versions require engineering acceptance. Text-only exports must clearly disclose exclusions. This is design authorization ONLY; app implementation remains ON HOLD.
