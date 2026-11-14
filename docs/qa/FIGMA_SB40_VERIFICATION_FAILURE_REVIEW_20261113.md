# Backup/export failure screens prepared

Five direct-link design review states mapped to previously inspected SB40 d1a34cb source, src/eng-runtime.native.ts:
- 1217:2 iOS full backup verification failed (:105).
- 1217:39 Android backup verification failed (:136).
- 1217:76 Text export read-back failed (:176).
- 1217:113 Backup cleanup failed; incomplete file may remain (:139).
- 1217:150 iOS file sharing unavailable; memories unchanged (:108).

Cloned approved exception layout 1208:2, preserving exact runtime messages, outgoing actions, permanent export options and 91pt fixed Settings header. Created nodes 1217:2 through 1217:186. All five screenshots reviewed for layout/text fit; board 1006:17 updated. Owner approvals pending. Technical runtime wording is preserved for source reconciliation; these are not new native captures or failure injections.

No source edits, real backup/export operations, native tests or repeated photo tests. No artificial failure triggers added to the normal prototype flow.
