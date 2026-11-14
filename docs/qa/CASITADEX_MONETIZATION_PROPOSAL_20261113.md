# CasitaDex monetization research and implementation proposal
Date: 2026-11-13 (America/Chicago)
Status: Proposed model and price await owner decision. No real billing, store products, or charges enabled.

## Recommendation
Free: up to 50 memories. Plus: proposed US price $19.99 as a one-time non-consumable purchase.
Plus removes the plan-based memory-count cap. Device capacity and supported technical limits still apply.
No subscription, ads, photo-storage fees, mandatory app account, or household-data cloud service.
Local use remains offline; purchasing/restoring purchases needs store access.
Existing data access, editing, backup/restore, and basic export remain available on Free.
This is a pricing hypothesis, not validated willingness to pay. Competing one-time prices are lower; validate conversion and support economics before treating $19.99 as settled. One-time revenue must fund continued compatibility and support. A subscription could fund ongoing value later, but is not recommended for this initial local utility.

## Research checked this turn
- Home Contents: US App Store lists $5.99 unlock; free trial allows 25 items and one property. https://apps.apple.com/us/app/home-contents/id420151922
- HouseBook: US App Store lists $9.99 Premium plus separate item packs, including 500 items for $19.99. Cloud architecture differs from CasitaDex. https://apps.apple.com/us/app/housebook-home-inventory/id1489866496
- Sortly: business inventory subscription comparison; free 100-item tier, paid pricing and promotional terms change. https://www.sortly.com/pricing/
These observations support evaluating a one-time consumer upgrade; they do not establish CasitaDex demand or optimal pricing.
- Apple purchase guidance: https://developer.apple.com/in-app-purchase/
- Apple review guidelines: https://developer.apple.com/app-store/review/guidelines/
- Google integration and purchase lifecycle: https://developer.android.com/google/play/billing/integrate
- Google billing tests: https://developer.android.com/google/play/billing/test

## Figma evidence
File: https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr
- Plus proposal 1266:2
- Store checkout handoff 1266:11
- Restore purchases guidance 1266:20
Proposal screen visually reviewed. Fixed top navigation retained; content scrolls separately.
Buttons demonstrate navigation only. No purchase dialog, verified entitlement, real restore, or billing SDK runs in this prototype.
Owner's latest Yes approves prior isolated first-launch restore flow: chooser 1262:2, review 1262:12, confirm 1262:39, completion 1262:22. This records design approval only.

## Required product rules
- At the free cap, preserve the current draft and explain Plus; canceling purchase must not discard work.
- Proposed count is saved memories, including archived memories; standalone photos and reminders do not become separate paid quotas. Deleting a memory releases its count.
- Imported/restored data over the free cap remains readable, editable, and exportable; gate only creation of additional memories. Do not block recovery or encourage deleting data.
- Existing users must not lose access because a new limit is introduced. Review grandfathering before rollout.
- No paid photo cap or storage tiers. Removing current engineering limits is a separate prerequisite; Plus cannot truthfully promise unlimited storage.
- Show localized store-supplied price before checkout; prototype $19.99 is illustrative.
- Restore Purchases is distinct from Restore from Backup.
- Same-store restoration uses the purchasing account. Do not promise automatic Apple-to-Google entitlement transfer. Cross-platform household data transfer also requires its own compatibility verification.

## Native implementation scope
1. Confirm model, free threshold, price, and existing-user treatment; create unpublished store product configuration.
2. Add compatible native non-consumable StoreKit/Google Play Billing integration after checking installed Expo/React Native versions. No billing dependency selected yet.
3. Implement verified entitlement state, purchase and restore actions, localized price, loading, pending, canceled, failed, successful, offline, and no-purchases states.
4. On Android grant only PURCHASED transactions after verification and acknowledge successful non-consumables. A pending transaction grants nothing. Implement refund/revocation refresh; cached verified entitlement supports offline use.
5. Apple restoration follows current entitlement APIs; explicit restore action may synchronize with store. Avoid a forced store sign-in at every launch.
6. Never trust a backup JSON premium flag as proof of purchase. Backups transport household data, not billing authority.
7. Keep household data local. Google recommends a secure backend for stronger verification; client-only acknowledgement is documented. Evaluate platform verification and fraud tradeoffs explicitly; do not silently introduce an app cloud account or backend.
8. Wire Settings Plus entry, limit prompt, and entitlement-aware UI. Keep existing data and backups usable.
9. Test sandbox approval/decline/pending, duplicate purchase prevention, acknowledgement, restore/no purchase, process termination, relaunch, offline use, refund/revocation refresh, over-cap imports, and draft preservation. Builds/tests only on FA-MAC-DEV-01; physical owner sign-off retained.
10. Reconcile verified behavior and test evidence in Figma and Git. No production purchase, release, or store submission authorized by this proposal.

## Source inspection and boundaries
Read-only source inspected:
 /Volumes/FA-Development/Designs-by-FA/Development/CasitaDex/sb40-photo-gesture-integration-20261111
HEAD d1a34cb144501f590e8bdf09cd7666a057bf0539.
Package dependency search found no purchase/billing/revenue/iap dependency; targeted src search found no entitlement/restore purchases/premium/monetization implementation.
No source changed, native billing tested, or technical photo/storage capacity increased in this turn.
Continue the scalable photo-storage engineering requirement before making capacity promises.
Completed photo acceptance is retained; only change-specific regressions should be added.
