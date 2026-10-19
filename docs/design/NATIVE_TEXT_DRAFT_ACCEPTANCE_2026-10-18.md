# CasitaDex — Native ENG integration acceptance
Date: October 18, 2026 (America/Chicago)
Result: PASS for the bounded Development-only native text-draft slice. Full SB-20 ENG and SB-22 acceptance remain open.

## Outcome
The previously isolated ENG-D saveNativeDraft orchestrator now runs through the real native Add flow and SQLite persistence. The reviewed eight-file contribution was integrated into C:\CasitaDex-Git only after preservation, tests and LT1 native checks.
All primary source hashes match the frozen source manifest for the installed APK. This closes the source/build parity gap for this slice; it does not establish integration of every ENG module.

Implemented:
- One recoverable private text draft, excluded from saved/searchable memories.
- Checkpoints after a short typing pause and best-effort lifecycle/navigation flush; truthful saved status after persistence succeeds.
- Continue and confirmed Discard, with cancellation retaining the draft.
- A single SQLite transaction for card insertion, recovery metadata, save-attempt mapping and draft consumption.
- Stable attempt IDs prevent duplicate saves and support recovery after uncertain acknowledgement.
- Strict draft version/field/identity/checkpoint checks and preservation of existing media parents.
- Two pre-existing Home JSX whitespace nodes corrected.
- Development-only capability; Staging keeps its existing Add behavior.

## Source and artifact identity
Authority: C:\CasitaDex-Git, branch prototype/bootstrap.
HEAD remains b940ccc5d605f35df6ac0aa31e7c2842a8694953; implementation is in the working tree, not that commit alone.
Isolated build: /home/fa-dev/projects/casitadex-eng-native-20261018.
Preservation: /home/fa-dev/projects/casitadex-eng-native-preservation-20261018, history bundle plus source-overlay.tar.
Overlay SHA256: F9B3C19317E7FDF288C23B107AE77C8927719CA8306872A1A37136CBA99A9E8F.
Independent byte-for-byte restoration verified for 264 files. Windows/POSIX mode differences were recorded separately.

APK: CasitaDex-Dev-native-draft-20261018.apk
Package: com.designsbyfa.casitadex.dev, version 0.1.0, x86_64.
SHA256: CC361BA6B6496BAD8E72203F19B92EBC6A44BE27361C5B780F20BE466E45F8F7
Size: 48,151,883 bytes.
Signer verified: Android Debug, certificate SHA256 FAC61745DC0903786FB9EDE62A962B399F7348F0BB6F899B8332667591033B9C.
Embedded JavaScript present; no Metro server was required.
APK bytes matched on primary, after private Taildrop transfer to LT1, and in the emulator's installed base.apk.
Final source manifest: isolated docs/qa/native-draft/final-source-sha256.txt.

## Verification
| Check | Result |
|---|---|
| Linux regression suite | 209 passed, 0 failed, 0 skipped |
| Primary Windows regression suite after integration | 207 passed, 0 failed, 2 symlink-privilege skips |
| TypeScript and ESLint, isolated and primary | PASS |
| New real SQLite reopen, rollback, replay and corruption/conflict tests | 9/9 PASS |
| Final native JSX whitespace scan | 0 detected issues |
| Resolved release runtime dependency graph | 203 components; no Firebase artifacts |
| Android assembleRelease, including retained Android lint | PASS |
| Package, signer, embedded JS and frozen-source checks | PASS |
| LT1 offline cold process launch | PASS, airplane mode 1 |
| Incomplete title-only draft checkpoint | PASS; saved status shown |
| Incomplete memory-save guard | PASS; no saved memory created |
| Draft excluded from Find | PASS; 0 saved answers before commit |
| Draft recovery after force-stop/relaunch | PASS; exact title and Continue prompt |
| Native memory save | PASS; answer green_storage_drawer, location hall_closet, confidence Unknown |
| Saved answer after offline process restart | PASS |
| Consumed draft absent on return to Add | PASS |
| Discard cancellation and confirmation | PASS; saved memory retained; exactly 1 saved answer afterward |
| Recent bounded Dev-process fatal/text-error scan | No matching error found; not a general stability guarantee |

Fixture: ENG_NATIVE_DRAFT_QA. Disposable discard fixture: ENG_DISCARD_QA.
LT1 evidence: C:\Users\temp\AppData\Local\Designs-by-FA\qa\native-draft-20261018.
XML records include incomplete-save-guard, draft-resume-after-restart, native-saved-memory, native-answer-after-restart, consumed-draft-absent, confirmed-discard, and one-saved-answer-after-discard.
Sampled native Find layout visually reviewed. Full accessibility and spoken navigation were not accepted.

## Build recovery and operations
Initial native build failed in Android lint from a 384 MB JVM metaspace limit. Retried with process-local 1 GB metaspace and one Gradle worker; no lint detector or release check was disabled. Native build passed.
An aapt output-to-head pipeline then exited 141 after successful compilation. Package/signature/source verification was rerun without that pipeline and completed with exit 0.
Jobs: eaada6917f2dde5b initial build; dc77fee62bc2728c successful Gradle build plus output-filter exit; f0b5aacddea6fcbf complete artifact verification/copy; c82638bca4a27c95 primary integration checks.
Controls are under primary LOCALAPPDATA Designs-by-FA/docs. Existing private Tailscale Taildrop was verified with a harmless marker and SHA256 before APK transfer. No listener or public port was added.

## Scope and remaining gates
Unfinished drafts currently remain local and are not included in portable backups. The Development UI explains that a draft must first be saved as a memory. Draft-inclusive portable backup remains a release-blocking product acceptance gate.
Still open: staged photo drafts/camera/photo-only save; full v2 schema, category and lifecycle integration; unassigned-space semantics and in-place Space creation; draft-inclusive backup/restore; complete large-text and TalkBack acceptance; physical Android and iOS; low-storage/power-loss injection; emulator reboot stability.
The earlier System UI reboot stall remains open. This batch used process restarts; it did not close AVD cold-boot stability.
The legacy v1 Context and Space model is retained in this slice. Existing-space selection is implemented when multiple spaces exist, but multi-space native acceptance was not run here.
Next bounded integration: native photo-draft staging and versioned draft-inclusive backup, with rollback and legacy-media preservation tested together.

## Preservation and boundaries
Original LT1 Staging installation was not updated or cleared. The three prior 313/505/3267-byte backups retained their recorded SHA256 values.
No physical phone changes, Windows restart, AVD wipe, credential/security-policy change, Git push/merge, cloud, payment or Production/store action.
No commit was created: the primary working tree intentionally retains pre-existing owner work plus the reviewed integration. The preserved baseline, contribution archive and manifests document this exception.
Primary remains authoritative. Member repositories were not synchronized.
Apply all nine charter disciplines; scope, architecture, UX, accessibility, privacy, QA, release and recovery decisions are recorded in docs/design/NATIVE_TEXT_DRAFT_INTEGRATION_2026-10-18.md.
