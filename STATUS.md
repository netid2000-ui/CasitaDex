# CasitaDex — authoritative Mac integration status

November 5–6, 2026 · FA-MAC-DEV-01 exclusively · FA-Development external SSD · authorized branch `work/cd-sb41-edit-targeting-20261104`.

**WORK-SB120–121 · PARTIAL QUALIFICATION · Release NO-GO.** Current application source `b30c95148136373d7079902013e5389d11152c64` adds iOS notification response delivery/routing, verified iOS backup sharing, mandatory native-module integration verification, and literal-percent/Unicode notification identity preservation.

- Verified source gates: TypeScript, ESLint, 389 tests (384 pass, 5 skipped), current web export, native integration check, scoped secret scan and Release/arm64 simulator build.
- Native iOS: real normal-clock standalone notification exact targets passed foreground/background/terminated, plus dirty-edit preservation and Cancel-to-deferred-target; real Photos import, full-backup Save to Files and reviewed restore, restored media hashes, maximum-text Add/Save and persisted data passed bounded checks. Prior Android photo/backup/offline evidence remains preserved.
- Evidence: [SB120–121 execution](docs/qa/WORK_SB120_121_EXECUTION.md), [artifact manifest](docs/qa/SB120_121_EVIDENCE_MANIFEST.json), and prior [SB116–119 return report](https://github.com/netid2000-ui/event-command-by-fa/blob/94d19d40ee6af6e8953ed22af80ee1cccbf764aa/docs/qa/DESIGNS_BY_FA_WORK_SB116_119_RETURN_REPORT.md).
- Open release gates: real iOS linked-memory 09:00 notification lifecycle, permission recovery, strict iOS offline, full accessibility/responsive/Figma acceptance, online SDK patch alignment and dependency security, signed distribution and owner physical-iPhone signoff. Separate Android/in-app literal-percent routing is not newly accepted.
- Online Expo Doctor remains 20/21 because seven SDK patch versions differ from expected. Offline doctor success does not clear that gate.
- Next: close the report’s explicit native and owner acceptance gates, then qualify supported dependency updates separately.

No production changes, release merge, store submission, live purchase, other-host job or production Firebase write.
