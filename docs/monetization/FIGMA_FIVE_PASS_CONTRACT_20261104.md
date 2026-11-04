# CasitaDex — five-pass implementation and Figma traceability
Date: 2026-11-04
Figma node: 293:2
Design authority: 39uzN0SZX8nlmcGDcHdQhr

## Pass 1 — Core workflow
Home, Find, Memory Details, Add/Edit, Save/Return, Photos/Zoom, Reminders/Notifications, Settings, Sharing and offline persistence.
## Pass 2 — Monetization
Optional additive premium only; existing memories, search, photos and reminders must remain usable. Product list and prices require explicit approval.
## Pass 3 — Purchase state machine
FREE -> PENDING -> VERIFIED -> ACTIVE; CANCELLED/FAILED/DEFERRED -> FREE; RESTORED -> VERIFIED; REVOKED/EXPIRED -> FREE. Never unlock from local UI alone.
## Pass 4 — Lifecycle
Store transaction must be verified by trusted backend, bound to product/account/event as applicable, revocable, restored and refreshed across devices. No deletion of user data after expiry/refund. Offline access requires bounded verified cache.
## Pass 5 — Native gates
Current clean Git SHA; iOS and Android native builds; accessibility and landscape; end-to-end Save/Reopen; sandbox purchase/restore/refund; signed release manifest. Mark all unexecuted checks NOT TESTED.

## Truthful implementation boundary
Figma frames specify intended behavior, not operational store billing. Store product IDs, actual billing SDK, trusted receipt validation, entitlement sync and sandbox tests are NOT VERIFIED. Do not enable a paywall or paid feature before verified backend and app-store configuration.
