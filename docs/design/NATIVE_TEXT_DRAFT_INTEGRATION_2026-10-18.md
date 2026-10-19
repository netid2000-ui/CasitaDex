# Native text-draft integration — October 18, 2026
Scope: first bounded SB-20 ENG runtime integration slice within ongoing SB-21/22/23 work. No new roadmap numbering or full-batch closure implied.
Owner requested proceeding with next super-batches and fewer checkpoints.
Isolated primary-machine source: /home/fa-dev/projects/casitadex-eng-native-20261018.
Original authority C:\CasitaDex-Git and LT1 Staging data remain protected.
Preservation: separate Git history bundle plus source-overlay.tar; SHA256 F9B3C19317E7FDF288C23B107AE77C8927719CA8306872A1A37136CBA99A9E8F. Independently restored byte equality across 264 files; Windows/POSIX file mode differences recorded.

## Implementation and evidence contract
Development-only native Add uses sqliteDraftStore and the previously tested ENG-D saveNativeDraft orchestrator.
One private text draft checkpoints after 400 ms of inactivity, on lifecycle exit when possible, on navigation cleanup and explicitly before Save/Leave.
Draft saved is shown only after successful checkpoint. Abrupt loss before a confirmed checkpoint may lose the last edits.
Returning to Add offers Continue or confirmed Discard. Drafts are excluded from saved/searchable cards.
Card insert, previous-save and media-recovery metadata, attempt mapping and draft consumption share one SQLite transaction. Replay is keyed by stable attempt and memory ID.
Invalid/stale/conflicting/new-version draft data fails closed. Existing saved data and media parent rows remain intact.
Drafts are enabled only for Development. Legacy text-only backup formats are unchanged; unfinished drafts must be saved as memories before portable backup. Draft-inclusive portable recovery is an OPEN acceptance gate.

## Scope still open
Native media draft staging/camera/photo-only Save; full v2 schema/category/lifecycle migration; unassigned-space semantics; in-place Space creation; draft-inclusive versioned backup; complete accessibility; physical Android/iOS; System UI reboot stability; all release/security gates.
This text-draft slice retains the existing v1 Context and Space model. Existing-space selection is supported when multiple spaces already exist.
No source integration into the authority is claimed until diff review and native acceptance.

## Nine-discipline review
PM: bounded slice and explicit dependencies; no full ENG/SB22 acceptance inferred.
Product: recover one useful unfinished fact without requiring setup.
Home systems: no changed domain or repair advice.
Architecture: native SQLite atomic metadata; serialize draft and collection work on one connection.
UX: clear draft/save states, Continue/Discard, confirmation and error recovery.
Accessibility: existing labeled controls/live status/large-text components; native and spoken tests still required.
Security: local-only, version/identity validation; no Node APIs in runtime binding, no cloud/keys/permissions expansion.
QA: real disposable SQLite reopen, rollback fault injection, replay, conflict and existing-media preservation tests; Android runtime is a separate gate.
Distribution: Development test artifact only; no Production/store/billing.

## Sources reviewed
React Native AppState: https://reactnative.dev/docs/appstate.html (reviewed 2026-10-18).
Expo SQLite: https://docs.expo.dev/versions/v58.0.0/sdk/sqlite/ (current reference reviewed; project remains installed Expo57, no SDK upgrade).
Existing project's explicit BEGIN IMMEDIATE/COMMIT/ROLLBACK wrapper is retained; native method/type compatibility checked against installed packages.
