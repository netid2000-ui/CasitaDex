# CasitaDex preceding corrected iOS acceptance, 2026-11-06

This record remains attributed to 9e53d5b. Current a812 runtime results are in [the new native checkpoint](SB121_A812_NATIVE_CHECKPOINT.md).

## Exact preceding runtime
- Feature source: 9e53d5bd14e4a96d63da9f7d9a6faee7a8073307, work/cd-sb41-edit-targeting-20261104.
- Development-only unsigned Release arm64 iOS simulator application, built on the authorized Mac mini.
- Executable SHA256: 0fb367e7375f68d165558cfa0715f770f6fa3c0254839bee5bd3dea5c1b5339b.
- Hermes bundle SHA256: 9bdc2917cbfba6387f85c7e1779edc3c36e39f975d0254df18637fcf78c45fd8.
- Exact installed bytes verified. Source is pushed. GitHub connector returned no statuses and no pull-request workflow runs for this commit; this is not a CI pass.
- The approved Home / Photos / Reminders / Find visual baseline is preserved. The earlier linked-09:00 runtime is a separate frozen fixture, not this artifact.

## Verified on this preceding runtime
- Data-preserving upgrade retained two memories, five saved-photo hashes and the existing reminder.
- All seven draft/saved photo picker controls are disabled at five photos with a readable explanation. Native replacement Cancel preserved all five draft media identities and bytes.
- Real normal-clock notification delivery and visible-banner taps opened the exact unique standalone reminder from foreground, background and terminated states. Identities included literal percent escapes and Unicode. Native pending/delivered records, before/after screenshots and exact target assertions are retained. No host clock change, push simulation or direct route injection was used for delivery/tap acceptance.
- Maximum native text in portrait: all four tabs and Find a Memory / Add Memory / Add Photo Memory / Add Reminder / Settings were reachable in native bounds with >=44pt targets; the selected Home accessibility audit passed without suppressing findings. Existing draft and saved data/media were unchanged; display preferences restored.
- Photo-limit source regression: 419 total tests, 414 passed, five existing skips, no failures. TypeScript, ESLint and bounded publication secret scan passed.

## Previous corrected runtime evidence retained
Runtime 87cb5b12fac0e36642b070c9b4bc150f740218bc passed native photo selection/Cancel, five-photo persistence, viewer Next/Previous/Close and cold reopening. A Full v4 backup was actually saved to On My iPhone Files, not just displayed in a share sheet. Provider/cache bytes matched; parsed data and all five media hashes matched SQLite. Archive SHA256: 097f7a56ca5ddf7cf21ee53650032bafbc5e9ffe9ffc78f08e8109055d13b17b. Native archive review/Cancel, replacement restore, previous-state recovery and cold reminder persistence passed. Those checks remain attributed to 87cb5b1; they are not relabeled as 9e53 runtime tests.

## Test-harness findings
The initial native Home reachability attempt overshot a large button with fixed fast drags. Measured native ScrollView bounds and adaptive slow drags resolved the harness failure; no app-layout change or assertion suppression was needed. Initial notification harness expected an unescaped native identifier and omitted a foreground banner from the app-scoped accessibility tree. Correct encoded IDs, actual pixel inspection and a real banner tap resolved those harness errors. Failed attempts remain recorded and are not presented as product passes.

## Gates still open
Linked normal-clock 09:00 delivery/taps on the protected fixture; a verified maximum-text landscape navigation collapse and other native accessibility screens; manual VoiceOver/TalkBack; strict OS-wide iOS offline journeys; security remediation and current Android parity; physical testing after virtual completion; owner final iPhone signoff; signing/distribution and all release approvals. The app remains NO-GO for release. No production, store, purchase, host-network or physical-phone action was performed.

Private raw data, device identifiers, binaries and desktop captures are excluded from publication. Detailed evidence remains under the governed external-SSD QA directory.
