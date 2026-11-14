# Plus backup feature access — November 14, 2026

## Changes
Verified shared ownership now guards full backup export, retained-backup sharing, restorable text backup review/save, backup selection and restore confirmation. Access is rechecked at confirmation. Free/unknown/checking states cannot enter these operations; a temporary verification error retains previously verified Plus access.

Enforcement is enabled only for the native local StoreKit QA identity. Existing development/accepted builds retain their behavior while checkout remains unavailable. Readable text reports, ordinary memory read/edit/search, and recovery of the previous local save remain outside this gate. This is an action-handler gate, not a security boundary against modified clients.

The backup screen explains Plus access. Corrected the old scrolling Back to More control to a sticky ‹ Settings button and moved backup feedback into the fixed control area.

## Validation
- 20 targeted tests PASS: backup gate, shared entitlement state and existing access/controller.
- Typecheck PASS. New gate/runtime lint PASS. Modified eng-screens.tsx has zero errors and the pre-existing unused openFullScreenPhoto warning; full zero-warning lint is not claimed.
- Native build 546266d53d617dc5 exit 0; installed only com.designsbyfa.casitadex.plusstoreqa on the isolated simulator.
- Native Free path: Choose backup to review displayed the Plus requirement without opening a picker; limited text backup review displayed the Plus requirement without opening review. No restore was performed.
- Header remained fixed while scrolling; captured native-gallery-evidence/plus-backup-free-gate.png and plus-text-backup-free-gate.png.
- Figma status board updated.

## Next
Native paid-path backup/restore acceptance after verified Plus; remaining Plus feature delivery; transaction finishing only after delivered access; broader checkout rollout remains disabled. No live purchases, accepted SB40 data changes or repeated photo acceptance.
