# ADR-002 — Native structured storage and durability

Date: 2026-10-07. Status: implementation authorized for this bounded prototype batch; acceptance requires recorded tests. Starting source a774e98.

## Evidence and need
The existing repository writes the previous primary value to its recovery key without validating it. Corruption between load and save can overwrite a good recovery copy. Primary and recovery are separate writes. The import limit counts JavaScript characters while claiming bytes. The provider serializes UI saves but the persistence layer does not guarantee a transaction. This is insufficient evidence for complete V1 durability, media ownership, or concurrent changes.

## Decision before implementation
Use Expo SQLite on Android/iOS, with separate environment-specific database filenames and app package IDs. Store Spaces and Answer Cards as individual rows, enforce foreign keys, and keep each card's ordered history in its validated card document. Atomically replace a validated collection and its previous-save snapshot in one exclusive transaction. Use parameter bindings, WAL and synchronous FULL. Keep the portable version-1 JSON format and a 2,000,000 UTF-8-byte bound for this prototype. This is a bounded text-data architecture, not acceptance of the future media architecture.

Migrate existing AsyncStorage data only when the new database has no committed collection. Validate before writing; preserve legacy bytes unchanged. Commit a migration marker with the rows. Invalid legacy data blocks loading and requires explicit previous-save recovery. A failed migration remains retryable. Never silently recover or upgrade confidence. Serialize repository operations, including reads and recovery. Keep AsyncStorage for small reading preferences and the web prototype only; harden its recovery validation too.

## Alternatives and tradeoffs
Retaining one AsyncStorage blob avoids migration but has non-atomic primary/recovery changes and platform-specific size/read constraints. A file-only database would require implementing transaction and index behavior. SQLite supplies transactions without cloud service, account, recurring infrastructure cost, or network dependency. Expo SQLite adds a native library and native build/recovery support burden. Web SQLite is documented as alpha and needs WASM/cross-origin headers, so it is excluded from the browser preview in this batch.

## Privacy, failures, recovery
App-scoped local data is readable to sufficiently privileged device access and is not a credential vault or automatic backup. Disk-full, validation, schema-version, or transaction errors fail closed; UI must report failure and retain the visible last committed state. Corrupt primary rows must not replace valid recovery. Recovery itself is an explicit atomic action. Import previews counts before replacement. Uninstall/device loss can remove all app data; export remains user-controlled text. Native file-provider export, app-owned media files and cleanup, notification scheduling and notification reconciliation remain separate unimplemented V1 gates. Do not claim those passed.

## Acceptance specification
Test real SQLite reopen, transactional rollback after deletion and before commit, migration retry/idempotence, legacy preservation, corrupt-primary recovery protection, explicit recovery, Development/Staging isolation, Unicode byte bounds, referential integrity, concurrent calls, and representative HVAC/filter/paint/shutoff/appliance/service data. Then test the actual native application through save/edit/delete, force-stop, offline cold launch, import/export, due-date/history persistence and selective-share preview. Node SQLite evidence is a technical spike, not a substitute for Expo native/device evidence. Physical Android and iOS gates stay OPEN without their own results.

## Sources
- Expo SDK 57 SQLite: https://docs.expo.dev/versions/v57.0.0/sdk/sqlite/ (persistence, bound SQL, exclusive transactions, web alpha).
- Installed AsyncStorage 2.2.0 Android implementation, inspected locally.

## Related confirmed accessibility gaps
Implement persisted Extra-large text and Light / Dark / System preferences; automatic native appearance requires expo-system-ui. Preserve font scaling, readable contrasts, wrapping labels, 48+ touch targets, and no animation. Verify these changes with browser and available native evidence; do not infer TalkBack/VoiceOver acceptance from labels alone.
## Native dependency isolation correction (before removal)
Inspection of expo-notifications 57.0.22 android/build.gradle found implementation com.google.firebase:firebase-messaging:25.0.1 and a MESSAGING_EVENT service. CasitaDex has no implemented OS reminder scheduling or imports of this package. Remove the unused expo-notifications dependency so a local-only native build does not bundle that Firebase service. No Firebase project/configuration/resource existed. Preserve other starter dependencies unless evidence justifies changes. Future local notifications require a documented implementation that satisfies the strict no-Firebase boundary; do not re-add this package blindly. Validate the dependency tree and final merged manifest/runtime artifacts, not only JavaScript package names.

## Control contrast correction
Measured normal control borders against panels: Light 1.54:1 and Dark 2.84:1. Strengthen their palette values to #718377 (Light) and #819B8B (Dark), producing 4.03:1 and 4.20:1 respectively. Add a test that imports the actual palettes and checks text >=4.5:1 and control boundaries >=3:1, rather than testing detached hard-coded examples. Geometry and navigation do not change.

## Backup round-trip boundary correction
A compact stored collection can fit the 2,000,000-byte limit while its pretty-printed export exceeds that limit and cannot be restored. Export canonical compact validated JSON so every permitted saved collection fits the same import boundary. Add a near-limit round-trip regression whose pretty-printed equivalent is too large. This changes formatting only, not schema or user confirmation.
