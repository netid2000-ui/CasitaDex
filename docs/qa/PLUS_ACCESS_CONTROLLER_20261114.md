# Plus access and purchase-controller foundation — November 14, 2026

Approved offer read directly from Figma 1266:2: 20 free memories; Plus $19.99 once; remove plan memory limit, full photo backup/restore, migration, photo-text search, photo-rich PDF. Working data stays on phone. No subscription or photo-storage fees. Technical limits remain independent.

Implemented src/plus-access.ts and src/plus-purchase-controller.ts. Free reads/edits/search/basic text export and Restore Purchases remain allowed above the free count. New-save policy permits saved count 19 and requires Plus at 20. Backup/restore, photo-text search and photo PDF require Plus in the policy. Invalid counts fail safely. This policy is not yet wired into store mutations or UI.

Purchase controller serializes operations, exposes pending/canceled/error/unavailable/no-purchase/verified results, requires an adapter verification result after completed checkout or restore, and preserves last verified access on network errors. A verified free result can revoke access. Missing adapters cannot grant Plus. It accepts no memory/draft/backup data and performs no app-data writes.

Security boundary: the adapter interface is not receipt verification. Native store ownership/product/app/environment/revocation checks, transaction finishing/acknowledgement, durable verified cache and store product configuration are still required. Initial entitlement must come from a verified cache, never a backup flag. No backend/cloud app connection was introduced. No product ID was invented or store price configured.

Verification on FA-MAC-DEV-01: 8 executable tests PASS (limit boundary, existing access, Plus capabilities, unavailable adapter, unverified completion, restore without purchase, cancellation/pending, failed verification/retry, duplicate-operation prevention, invalid adapter results, snapshot isolation). TypeScript and changed-file ESLint PASS. No new native test or purchase claimed; prior photo acceptance untouched.

Next: native adapter plus durable verified entitlement handling and approved Plus screen wiring, then isolated StoreKit/Play testing. Do not enable the new free limit in production before purchase/restore paths are working and verified. No UI or running app was replaced in this checkpoint.
