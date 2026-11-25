# CasitaDex — research-informed super-batch execution

November 25, 2026 — actual Mac mini QA and GitHub verification continuing the 2,200-source professional research standard.

- GitHub governance access recovered through authorized Mac Git; seven governance files committed at 28527db and independently read back.
- Java 17.0.21, ADB 37.0.1, Maestro 2.12.0 verified; reusable scripts/fa-mac-env.sh committed. No new paid tools.
- Source 7fd2e142a4d372bb311f92b370f43b237e774130: TypeScript PASS, lint PASS, 547 tests, 546 passed, one skipped (isolated simulator release artifact absent), zero failures.
- Installed iOS QA, Android emulator, and Samsung navigation smoke all PASS: Home, Photos, Reminders, Find, Settings, Backup & restore entry, return to Settings and Home. Earlier failed automation attempts remain in local QA evidence: accessible Grid label, system Home ambiguity, explicit Settings Back to Home. Corrected selectors rerun.
- Android emulator lacked the recallqa package. Copied existing QA APK from Samsung, verified package ID, ARM64 ABI and hash, installed into the empty emulator slot. No owner data copied. Simulator QA and Samsung APK identity recorded, not silently substituted; exact original binary/source association not independently established.
- Synthetic household fixture on emulator: create filter memory, save, search exact title, open description and return to results PASS (45s). No owner data changed.
- Live Figma reference mapping refreshed for all 12 workflow groups. Older Find review frames lacked the approved Active, Archived and Recently deleted control row. Created six editable review copies, preserving original frames.

| Find state | Light | Dark |
|---|---|---|
| Active | [1669:623](https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr/?node-id=1669-623) | [1669:688](https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr/?node-id=1669-688) |
| Archived empty | [1669:787](https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr/?node-id=1669-787) | [1669:913](https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr/?node-id=1669-913) |
| Recently deleted empty | [1669:850](https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr/?node-id=1669-850) | [1669:976](https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr/?node-id=1669-976) |

Visual readback verified representative light/dark frames and selected/empty states. Explicit REVIEW status retained; no unapproved baseline replacement. Photos and backup navigation matched live design structure. Full pixel parity and every-control, large-text and spoken accessibility remain separate.

[Machine-readable receipt](RESEARCH_SUPERBATCH_RECEIPT_20261125.json) · [Updated workflow matrix](research-informed-workflow-matrix.json).

Release NO-GO: owner physical iPhone, fresh full backup round trip, store sandbox and full current-native workflow acceptance remain open. No live purchase or store submission.
