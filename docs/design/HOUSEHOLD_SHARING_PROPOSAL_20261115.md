# CasitaDex Household sharing — design and implementation contract
Date: 2026-11-15
Status: DESIGN PROPOSAL FOR OWNER REVIEW. No household backend, account, store product, purchase, invitation or production release was created.
Branch: work/cd-household-design-20261115
Baseline: 1e2f895e664a42db89fee3d9cdd33a92e6d49ee4
Execution authority for future builds/tests: FA-MAC-DEV-01.

## Review
[Figma proposal](https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr?node-id=1547-3)
[Light starting flow](https://www.figma.com/proto/39uzN0SZX8nlmcGDcHdQhr?node-id=1547-15&starting-point-node-id=1547%3A15)
[Dark starting flow](https://www.figma.com/proto/39uzN0SZX8nlmcGDcHdQhr?node-id=1547-1019&starting-point-node-id=1547%3A1019)
[Light scenario index](https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr?node-id=1550-768)
[Dark scenario index](https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr?node-id=1550-929)

The isolated proposal page contains 51 paired light/dark scenario frames (102 total), plus review indexes, an overview and three reusable action components. Existing release pages were not edited. Screens illustrate finite example states rather than a working database; names, counts and dates are fixtures. The contributor and viewer paths are isolated from owner management until the explicit personal/onboarding boundary.

Review sequence: start → account → plan → create → owner home → invitation; then contributor entry, viewer entry, share-a-copy, assigned reminder, offline conflict, version recovery, subscription lapse/export. Use the indexes for exceptional states.

## Product contract
One household subscription covers up to five people including its owner. Personal memories remain personal by default. Joining never uploads an existing personal library. Keep the accepted four-tab navigation and existing editorial style; integrate Household through Settings and a workspace selector in the established browsing flows. Reconcile exact integration points against the current accepted navigation before coding; this proposal does not replace the current app shell.

An existing personal memory is shared as an explicit COPY. The review identifies title, description, space, categories, location, notes/reference and selected photos. Warn about private details before confirmation. The personal original and shared copy subsequently diverge. Personal reminders are not copied automatically. Newly created household content must clearly show its household destination before Save.

Shared detail editing and photo viewing should reuse the accepted editor/viewer behavior (inline edit, required title, normalized search, managed taxonomy, pinch/double-tap zoom, return position). These full existing editors are integration dependencies, not newly rebuilt in this scenario prototype. Every save/cancel/notification returns to its originating memory and workspace.

### Permissions
| Capability | Owner | Contributor | Viewer |
| --- | --- | --- | --- |
| Read shared memories/downloaded photos | Yes | Yes | Yes |
| Add/edit shared memories and photos | Yes | Yes | No |
| Assign/complete shared reminders | Yes | Yes | No |
| Review memory history | Yes | Yes | No in first release |
| Restore older version/delete shared memory | Yes | No | No |
| Invite/revoke/change member roles | Yes | No | No |
| Manage household subscription | Yes, through purchasing account | No | No |
| Export available shared information | Yes | Yes | Yes |
| Read/edit personal library | Own library only | Own library only | Own library only |

Viewer means no shared mutations, not prevention of copying/screenshots. Export controls must be provided in the final viewer workspace; the proposal's general export scenario is reusable, while the current isolated viewer path focuses on reading. Leaving, account deletion and owner transfer require explicit production flows before launch. A sole owner cannot leave without transfer or household deletion; transferring administration must not silently transfer billing.

### Invitations
Email-bound, verified account, single-use token, seven-day expiry, revocable before acceptance. Owner plus joined members plus unexpired pending invitations consume the five seats. Atomic server checks handle simultaneous acceptance and expired reservations. A repeat acceptance is idempotent. Display full, expired/revoked, wrong-account and already-member outcomes. The current prototype combines invalid-invitation outcomes; implementation must distinguish actionable causes without exposing household information.

The native share sheet sends the prepared invitation only on user action. It is intentionally a non-live handoff in Figma. No actual invitations were sent. Joining members do not purchase a second subscription.

### Reminders and history
Only owner/contributors may receive assignments. Record assignee, actor, due instant, household timezone and occurrence ID. Queue local edits while offline; make clear that others receive them after sync. Completion and Undo must be idempotent and preserve assignee. Changes in permissions or membership unassign open tasks for owner review. Prevent duplicate notifications after retry/reconnection. Open the intended memory from foreground, background and terminated notification taps.

History records actor and server revision; restoring creates a new revision and retains the replaced one. Owner-only restore is enforced by the server. Final retention length is a launch decision tied to cost.

### Offline and removal
Read downloaded household data/photos offline. Unavailable photos need connection; show the missing count. Durable SQLite outbox records edits before reporting success. A sync indicator distinguishes local, uploading, synced, failed and conflict states. Do not promise that another member has received an offline update.

Same-field concurrent edits require review of both versions. Keep mine/other/both are explicit; keep both creates a second memory. Preserve history. Merge disjoint fields only where semantic validation permits. Concurrent delete/edit and photo-manifest conflicts require recovery decisions, never silent data loss.

Revocation blocks all NEW server reads/writes and upload acknowledgments immediately. A disconnected device can retain downloaded content until it reconnects; this limitation must be explained. Purge shared caches on confirmed revocation/account switch, isolate personal data, and quarantine unacknowledged local operations. Any recovery of quarantined work requires renewed authorization and explicit owner consent; it must not bypass revocation through export. Previously exported files and personal copies cannot be recalled.

### Subscription proposal
US price hypothesis: $39.99/year or $4.99/month, five people including owner. These are design proposal prices, not configured store prices, validated willingness-to-pay, or guaranteed profitable pricing. Localized store prices and renewal language must come from the store product, not hardcoded UI.

Personal Plus and Household are separate entitlements. Preserve existing lifetime/one-time Plus purchases. Household does not silently change personal limits. Current source has a 20-memory free cap; full backup/restore, photo text search and photo PDF are Plus-gated. Earlier discussion proposed a different free allowance. Resolve that policy separately before monetization rollout; no limit or entitlement code changed here.

After Household expires, stop new shared mutations/uploads/invitations; keep downloaded information readable/exportable and offer a personal copy. Do not delete personal data or lock it behind renewal. Publish an exact cloud-retention period and export deadline before launch; do not imply indefinite cloud storage. Grace, retry, refunds, restore, pending purchase and cross-device/account ownership need explicit states.

Price validation must include store fees/taxes, photo storage/egress, active household size, support and backup retention. Define storage quotas before selling. Measure invited-to-joined conversion, second-member activation, shared weekly activity, renewal and support cost without collecting memory text/photos as analytics.

## Source integration findings
- React Native/Expo with SQLite/local persistence and AsyncStorage; no existing household auth/cloud sync SDK was identified in the inspected package.
- src/eng-share.ts is existing file/ZIP export, not multiuser synchronization.
- src/eng-types.ts revision/draft conflicts describe local persistence/import, not server-authorized household conflicts.
- Reuse durable media coordinator/journal, reminder utilities and existing Plus entitlement boundaries; do not relabel these as completed cloud infrastructure.
- Theme: src/theme.ts, Inter and Cormorant Garamond; proposal reuses Figma variable collection 867:2, explicit Light/Dark modes, and approved 8px button shape.
- Design/source changes remain on a feature branch. Accepted release build and owner data remain untouched.

## Implementation boundaries
Choose a backend/auth provider only after a scoped technical spike evaluates authorization, transactions, offline sync, store verification, cost and operational recovery. No cloud provisioning is authorized by this document alone.

Logical entities:
- Household: id, owner, timezone, status, membership epoch, quota, retention deadline.
- Membership: household/account, role, joined/revoked timestamps, version.
- Invitation: household, normalized invited email, token hash, expiry, role, reservation, consumed/revoked state.
- SharedMemory: household, id, content, revision, taxonomy references, deleted marker, media manifest.
- Photo: household, memory, immutable object key, hash, size, processing state.
- Reminder: household/memory, assignee, due/timezone, occurrence, status, revision.
- Revision: base/new revision, actor, server time, operation ID, changes.
- Client outbox: account/household, operation ID, base revision, payload, attachment dependencies, retry state.
- Entitlement: purchaser account, store transaction reference, verified status, expiry/grace; never store raw credentials.

Server enforcement:
- Authenticate every request; authorize household and current role on every object, photo URL, subscription and recovery operation. Never trust client household IDs or role flags.
- Atomic invite capacity/acceptance; hashed expiring tokens, anti-replay, rate limits, no membership enumeration.
- Short-lived authorized media URLs; validate MIME, size, hash and ownership before attaching. Use transport/at-rest encryption without claiming end-to-end encryption.
- Idempotent operation IDs and compare-and-swap base revisions; server order, not device wall clocks.
- Upload blobs then atomically publish a validated manifest. Failed uploads cannot leave a visible memory referring to missing media. Clean abandoned objects by retention policy.
- Recheck permissions/entitlement at commit, including operations queued before removal/downgrade/lapse.
- Account/device cache isolation, secure credential storage, logs without personal content, deletion/export/audit procedures.

Sync sequence: commit local draft + durable outbox → upload dependent media → submit authorized revision operation → acknowledge server revision → update local snapshot and outbox atomically. Resume safely after process death at every boundary. Maintain pending work while unauthorized without exposing revoked shared caches.

Purchases: separate Household entitlement adapter; verify receipts/server notifications, bind purchaser account safely, handle sandbox pending/cancel/restore/refund/grace, reconcile iOS/Android member access. No local boolean unlock. Never require invitees to repurchase or double-charge a restoring owner.

## Staged delivery and acceptance
1. Owner review of this proposal, roles, copying semantics and price hypothesis. Finalize storage/retention and launch scope, plus direct integration of editors, viewer export, leave/delete/transfer and wrong-account states.
2. Feature-flagged domain model, migration and local outbox. Preserve personal data and existing Plus behavior. Migration/rollback proof before connecting any service.
3. Isolated non-production auth/membership/invites with negative authorization tests and seat races.
4. Shared memory/photo sync, history/conflict recovery, reminder assignment and revocation.
5. Sandbox subscriptions, lifecycle/export, privacy/account deletion, localized pricing and accessibility.
6. Automated + native simulator/emulator evidence on Mac mini → Samsung physical acceptance → owner's iPhone sign-off. Figma reconciliation and GitHub checkpoint at each stage.

Required acceptance cases:
- Personal library unchanged by join; no implicit photo upload. Share only selected items; source and copy remain independent.
- Cross-household reads/writes/media URLs denied. Viewer writes and contributor restore/member management denied through API, not only UI.
- Wrong account, expired/revoked/replayed invitation; two concurrent last-seat acceptances; duplicate accept and retry.
- Account switch with cached data; offline downgrade/removal; blocked old outbox; permitted owner-approved recovery.
- Offline edit/restart/reconnect; disjoint and same-field conflict; edit versus delete; interrupted media upload; duplicate operation acknowledgment.
- Reminder complete/undo/reassignment, timezone change, duplicate push, notification deep link in all app states.
- Purchase canceled/pending/restore/refund/grace/expired/renewed across devices; Plus retained; no second purchase for invitee.
- Export missing-photo manifest and cloud deadline; leave/transfer/delete semantics; data access after lapse and after revocation are distinct.
- Light/dark not interchanged, Dynamic Type, VoiceOver/TalkBack, contrast, tap targets, keyboard/save behavior and current editor/photo regressions.

## Verification completed for this design delivery
102 scenario frames are 390×844 with scrollable content and fixed top/footer actions; paired theme modes verified. Action targets exist and stay within theme. Button instances have at least 48px height. Contributor/viewer graph checks found no path to owner management before the personal/onboarding boundary. Eight native handoffs (four per theme) intentionally have no simulated action: invitation share (two roles), manage subscription, save/share export.

Representative screenshots visually inspected: light introduction, dark conflict and contributor history. Other frames received structural checks, not full native usability testing. Figma is a finite-state prototype: text fields, authentication, edits, actual media, system sheets and purchases are not functional. Some exceptional states are separate scenario entries.

No application runtime tests or builds were run for this documentation/design-only change. No production code changed. Do not interpret prototype graph checks as security tests or release acceptance.

See evidence/household-design-20261115/figma-manifest.json for frame IDs, created/mutated node IDs, action graph and geometry results.
