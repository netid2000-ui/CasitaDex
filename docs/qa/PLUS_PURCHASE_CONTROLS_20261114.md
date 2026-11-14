# Plus purchase controls — 2026-11-14

The isolated iOS QA Plus screen now connects purchase and Restore Purchases to the existing verified entitlement controller. It obtains the local product price from StoreKit, prevents duplicate requests, disables purchase while owned, and shows pending/error/ownership changes inline. Settings, purchase, restore and status remain outside the scrolling content. Public checkout remains disabled.

## Verification

- Mac mini FA-MAC-DEV-01 only; isolated com.designsbyfa.casitadex.plusstoreqa, iPhone 18 Pro simulator, iOS 27.0.
- Final native UI run PlusPurchaseUI-r2: 1 test, 0 failures. Covered free restore with no purchase, purchase, restore while owned, refund, store failure, pending approval, approval entitlement update, and return to Settings.
- TypeScript, targeted ESLint and git diff whitespace checks passed.
- Existing adapter/controller focused run: 5 passing tests.
- Final status implementation uses the shared entitlement subscription; r2 verifies this final version.
- Fixed header is established by layout structure; scroll-position assertion was not run.
- Xcode recorded a QoS priority-inversion runtime warning; no test failure.

## Evidence

[Native result summary](evidence/plus-purchase-controls-20261114/summary.json)

[Owned controls](evidence/plus-purchase-controls-20261114/owned.png) · [Approved controls](evidence/plus-purchase-controls-20261114/approved.png)

Raw xcresult: /Volumes/FA-Development/Designs-by-FA/QA-Evidence/CasitaDex-Plus-Window-20261114/PlusPurchaseUI-r2.xcresult

Figma status board reconciled: https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr/?node-id=1006-17

## Boundaries and next work

Accepted SB40 untouched. Completed photo acceptance was not repeated. Only local StoreKit test transactions were used; no live purchases or store submission. Free 20-memory enforcement, complete Plus feature delivery, real store products, Android purchase parity and physical acceptance remain unfinished. This is not a release-ready monetization claim.
