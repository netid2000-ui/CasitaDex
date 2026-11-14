# Approved CasitaDex Plus value package
Date: 2026-11-14
Owner: "I agree. I approve. We need to make the plus worth the value"
Supersedes the 2026-11-13 proposal's 50-memory Free tier and free backup/restore.

## Approved offer
Free: 20 memories with photos, ordinary search, editing, and basic text export.
Plus: US target $19.99 one-time non-consumable; removes plan-based memory-count cap, includes full photo-inclusive backup/restore, phone migration, on-device photo-text search, and photo-rich PDF reports.
No subscription, advertising, paid photo-storage tiers, app cloud account, or household-data sync.
Working data remains local. Cloud is only an optional user-selected backup file destination.
Store purchase/restore can require network. Same-store purchase restoration must be available before data restoration, without repurchase. Do not promise cross-store entitlements.
Existing data remains accessible/editable. Preserve drafts at limits and canceled purchases. Technical capacity is not unlimited.
Receipts/manual attachments and maintenance history follow the initial package. QR labels are later exploration.

## Value acceptance criteria (pending implementation)
- Photo-text search: index supported photos on device; normalize filter/model strings such as 20x25x1; return the originating memory/photo; maintain index after edit/delete/restore. Explain unreadable text and allow manual metadata. No photo uploads for recognition. Assess both platforms, model delivery, offline behavior and performance before sales claims.
- Photo-rich PDFs: export selected memories, room or category, including legible photos and relevant labels/details; user preview and native share/save; test long content, large text, page breaks and bounded-memory generation.
- Backup/restore: include referenced photo files and relevant memory metadata; validate integrity, preserve existing data on failure, report progress/space requirements and provide successful completion evidence. Restore Purchases accessible independently of data restore. A share-sheet dismissal is not evidence a cloud file saved.
- Migration: verify supported platform combinations, references and counts after import; local reminder rescheduling/permission handled explicitly; original phone data not deleted.
- Entitlement: localized store price, verified purchase, pending/cancel/failure/no-purchases states, offline cached entitlement, acknowledgement and revocation handling. No trusted premium flag from backup.
- Scalable media: prior small media/backup caps remain engineering blockers; no "unlimited storage" claim.
- Existing users: resolve grandfathering before rollout; never apply new limits by deleting or hiding existing data.

## Design evidence
https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr?node-id=1266-2
Updated Plus frame 1266:2, copy1266:10 and checkpoint board1006:17.
Existing header/scroll structure retained. Screenshot reviewed: text and controls fit; existing Inter and Cormorant Garamond styling retained.
Checkout and Restore Purchases routing remains illustrative. Preview explicitly labels functionality planned.

## Execution order
1. Implement and verify scalable local media plus full backup/restore prerequisites.
2. Feasibility spike for native offline OCR and PDF generation using the current SB40 source.
3. Implement feature gating and store entitlement lifecycle; configure unpublished sandbox products.
4. Verify the paid value paths on Mac mini simulators/emulators, then Samsung and owner iPhone sign-off.
5. Reconcile Figma, source and evidence before enabling sales claims.
Completed photo acceptance remains accepted. Only targeted regressions for changed storage/index/export paths are appropriate.

## Completion boundary
This checkpoint records owner approval and updates design/requirements only.
No native billing, OCR, PDF feature implementation or tests were performed in this checkpoint.
No production release, purchase, store submission, or price publication.
