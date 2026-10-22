# SB25 storage policy decision — 2026-10-20
Status: OWNER DECISION REQUIRED; no new global numeric policy enabled.

## Verified Development evidence
- SDK57 Android Paths.availableDiskSpace uses File.freeSpace; legacy getFreeDiskStorageAsync uses StatFs.availableBlocksLong.
- On fresh disposable API37 emulator5582 at genuine ENOSPC, Paths reported 145625088 bytes while app-available storage was 0. The new conservative adapter returned 0 and denied a 4000000-byte write.
- Production Full v4 restore was denied at 0 app-available bytes for a 5040505-byte requirement. Exact previous state, restart, retry and repeated recovery passed.
- Healthy 1048576-byte temporary file was written, hashed/read back, then only that test file was removed. App-available samples: 4405047296 before, 4403765248 after write, 4404789248 after removal. Concurrent OS allocations mean these sample deltas are not a precise app-allocation benchmark.
- Protected logical bytes are deduplicated; owner groups can overlap. Missing references remain protected. Database, cache, filesystem allocation and unindexed files are excluded from photo-content totals.
- Current operation-specific guards remain conservative engineering estimates, including archive read-back copies, media staging, UTF-8 ENG/reminder snapshots and recovery/WAL headroom. Maximum-format peak-allocation and wider device/API calibration are not proven by these samples.

## Signed approval gate
docs/design/SB20_R4_STORAGE_METHODOLOGY_OWNER_SIGNOFF_2026-10-17.md explicitly requires separate owner approval for numerical warning/critical thresholds, reserves and hysteresis values after measured evidence.
docs/design/SB20_MORE_OWNER_DECISIONS_2026-10-17.md retains the engineering/owner gate for numerical pressure policy.
This assignment authorizes remediation and calibration; it does not supply separately approved global values. No universal warning/critical numbers are inferred from one emulator.

## Concrete decision requested
Recommended: accept operation-specific, measured app-available write protection as the current Development baseline; keep global warning/critical alerts disabled; authorize broader peak-allocation/device calibration as a later batch before adopting a global numeric/hysteresis policy.

This is an explicit scope/acceptance decision. Until the owner approves it, or the broader calibrated policy is implemented and approved, SB25 is BLOCKED at full acceptance. Do not quietly classify that deferred policy as complete.

Permanent purge, unknown-owner cleanup and trusted-clock deletion remain disabled. This proposal does not authorize any deletion, Staging/Production deployment, commit, push, merge or physical-device operation.

## Owner scope approval - 2026-10-20
Owner explicitly approved accepting verified operation-specific app-available storage protections as the SB25 Development baseline. Global warning/critical thresholds, reserves and hysteresis remain DISABLED and DEFERRED pending broader device/API and peak-allocation calibration and separate numeric-policy approval. Permanent purge, unknown-owner cleanup, trusted-clock deletion remain disabled. This is Development-scope acceptance only; no Production or physical-device acceptance implied.
SB25 status: PASS - approved limited Development scope; broader global policy deferred. SB26 may begin under existing charter and non-destructive Development restrictions.
