# SB24/SB25 risk register and roadmap — 2026-10-20

SB24: PASS within Development data-protection acceptance.
SB25: BLOCKED at full acceptance pending the signed global storage-policy gate. Implemented safeguards and tested native behaviors pass at their stated scope.

Closed or mitigated:
- Production Full v4 interruptions: native process termination after reminder and ENG writes, and after commit; consistent restart and recovery verified.
- Genuine Android filesystem exhaustion: disposable emulator5582, actual ENOSPC and zero available bytes; original state retained, retry/recovery verified.
- Wrong free-space API: SDK57 free blocks included145625088 reserved bytes at ENOSPC. Conservative fresh app-available measurement now returns0.
- Restore/recovery capacity omitted reminder state: UTF-8 reminder and recovery bytes now included, with an in-transaction recheck.
- Rollback masking original error: transaction helper retains both errors and the original cause.
- Unsafe legacy Development deletion path: blocked before any database access; direct native-entry regression passed.
- Referenced media: active/archive/recently-deleted/draft/recovery/legacy/journal categories retained and deduplicated. Unknown or conflicting ownership fails closed. Permanent purge and automatic physical cleanup disabled.

Open acceptance/policy gates:
P01 BLOCKING SB25: signed R4 requires separate approval of numerical warning/critical/reserve/hysteresis policy. No universal values are approved or enabled.
P02 Required before universal policy: broader device/API and maximum-operation peak-allocation calibration. One API37 emulator and a1MiB sample do not establish universal thresholds. Existing operation estimates are conservative engineering guards.
P03 Release gates, not claimed here: physical Samsung acceptance, iOS, actual power loss, spoken TalkBack/human acceptance, full external SAF target-volume exhaustion.
P04 QA limitations: early full-disk harness JSON reports could not be written. Native logs and exact fresh-process state verification were retained; later coordinated-pressure tests produced passing JSON results after safe relief of the test filler. Earlier failed harness assertions are not counted as passes.
P05 Preserved owner work remains dirty/untracked. No commit, push, merge or deployment authorized.

Next:
1. Finish final Development artifact/UI evidence and return the report to the originating CasitaDex project conversation.
2. Owner reviews docs/qa/SB25_STORAGE_POLICY_DECISION_20261020.md: accept per-operation protection as the present Development baseline with global alerts deferred, or retain SB25 open for broader calibration and a separately approved global policy.
3. Only after SB25 acceptance/explicit scope decision, authorize SB26 Home/Find/Answer work. SB26 was not started in this assignment.
