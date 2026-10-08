# CasitaDex continuation
Read PRODUCT_CHARTER.md → PROJECT_CONTINUATION_REQUIREMENTS_2026-10-07.md → CURRENT_PROJECT_STATUS.md → NATIVE_BATCH_REPORT.md → ADR-002_NATIVE_DURABILITY.md → RECOVERY_RUNBOOK.md.

Starting foundation: a774e98. Native durability implementation: 705bded. Corrected build source: 6b13117. The external CASITADEX_WORK_COMPLETION_HANDOFF.md records final commit/artifact status after evidence is committed.
Keep the four-tab prototype and neutral Space/Card model. Native uses SQLite; web preview uses its separate adapter. Do not revert the documented transactional migration or assume it has unrecorded physical/iOS acceptance.
Preserve no-Firebase, no-backend, unique identity and Production lock. Do not re-add expo-notifications without a local-only reminder decision: the removed package included Firebase Messaging natively.
No next major batch, cloud/store/paid/public action, Event Command change or SB-13 is authorized by this handoff. Return results to the owner in SB-12 Acceptance Status for review and next authorization.
