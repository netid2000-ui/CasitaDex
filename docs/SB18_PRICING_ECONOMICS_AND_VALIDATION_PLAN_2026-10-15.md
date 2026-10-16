# SB-18 — Pricing, Unit Economics and Validation Plan
Research status: hypotheses and illustrative math only; NO sampled CasitaDex demand, willingness-to-pay proof or sales. Base currency USD, 2026-10-15. No purchase/production approval.

## Candidate packaging to prototype
A. **Free + Complete lifetime + optional Cloud Care annual**: lifetime ownership for advanced local productivity; separately charge recurring for ongoing encrypted BYOS backup orchestration. Clear distinction between user-supplied provider quota and F&A paid service. Recommended initial packaging hypothesis.
B. **Free + annual all-in-one Pro**: fewer purchase decisions; risk that subscription-averse home users do not convert. Prototype as comparison.
C. **Free + modular one-time specialized packs + Cloud Care**: matches occasional use, increases complexity and perceived nickel-and-diming; keep packs optional and few.
No promise of lifetime cloud operations from a one-time fee without cost/runway underwriting. Evaluate a one-time service option only after obligations/support economics are quantified.

## Exploratory price cards — not set prices
Complete lifetime test $14.99 / $24.99 / $34.99; cloud convenience test $14.99 / $29.99 / $39.99 per YEAR; content packs test $4.99 / $9.99 / $14.99 ONE TIME. Current charter $14.99-$19.99 launch introductory hypothesis remains historical, not superseded by these research ranges. Quotes will be localized by stores and separated from OneDrive/Drive/iCloud charges.

## First-year gross cohort sensitivity, purely hypothetical
For 10,000 *installs* in one cohort, not total customers or MAU. Adoption percentages independently applied; some buyers can purchase multiple offerings. Gross before VAT/sales taxes, store commissions, refunds, churn, support, engineering, marketing, cloud services and reseller costs; subscription revenue assumes a full initial-year payment, not renewal.

| Hypothesis | Complete lifetime | Cloud Care annual | Pack one-time | Estimated first-year gross |
|---|---|---|---|---|
| Conservative | 2% at $19.99 | 0.5% at $24.99 | 1% at $7.99 | $6,047 |
| Base | 6% at $24.99 | 2% at $29.99 | 2% at $9.99 | $22,990 |
| Upside | 12% at $29.99 | 5% at $39.99 | 4% at $12.99 | $61,179 |

These are algebraic SENSITIVITIES, not predictions. They show why customer acquisition, conversion, retention, service costs and support matter more than adding many features. Paid conversion percentages, install growth and renewals are assumptions without evidence. Do not use these as investor forecasts or margins.

## Real cost and pricing gates
1. Acquisition: app-store discoverability, organic install-to-purchase, marketing and support, trademark/name clearance. No invented CAC.
2. Transaction: store fees, taxes/refunds, regional alternative billing. Apple Small Business Program offers 15% if eligible; Google Play has multiple pathways including 2026 Apps Experience with different rates. Do not assume one universal fee.
3. Operating: OAuth, mobile background scheduling, provider API quotas/outages, support, encryption/key recovery, receipt validation, crash QA and possibly backend for true household sync. BYOS means F&A need not finance each user's gigabytes but it does not eliminate service costs.
4. Retention: cloud subscription only justified by continued benefit; cancellation must preserve user access and backup restoration. Honest waiting/failed/verified states.
5. Purchases: cross-store portability is not automatic. Apple Family Sharing of purchases does NOT mean automatic household database sharing.

## Official business policy references
Apple review: https://developer.apple.com/app-store/review/guidelines/
Apple small business: https://developer.apple.com/app-store/small-business-program/
Google Play payments: https://support.google.com/googleplay/android-developer/answer/10281818
Google Play 2026 Apps Experience program: https://google.play/business/programs/appsexperience/
Apple family purchases: https://developer.apple.com/help/app-store-connect/configure-in-app-purchase-settings/turn-on-family-sharing-for-in-app-purchases/

## Human research and validation before engineering
Discovery: 10-12 moderated sessions across homeowner/renter, technical/nontechnical, older/large-text, cloud subscriber/non-subscriber and household collaborator. Start with open-ended jobs and current workarounds; avoid pitching a subscription before learning needs. Counterbalance A/B/C tier concepts. Ask respondents to explain Free manual backup versus paid automated encryption and separate OneDrive/Google charges.
Pricing: 10 interviews do not establish price elasticity. Larger opt-in survey (proposed 100+ relevant segmented replies) and future sandbox purchase tests only after research privacy and store gates. Do not fake live purchase buttons.
Core tasks: capture photo and voice; find exact model number; manual export; discover Premium without upsell pressure; compare plans; simulate cancellation/expiry and recover all original files.
Proposed acceptance: >=90% unassisted find/save task completion, 100% ability to retrieve/export prior data after expired paid plan, 100% clear understanding that the third-party cloud account has separate fees, and no blocked core action. Test at 1.3x-2x font scale, TalkBack/VoiceOver, airplane mode and payment cancellation; document denominators and uncertainties.
Sequence: research and provisional tiers -> owner UX approval -> store/legal/security feasibility -> separate entitlement ADR -> offline-first build and tests -> native QA -> explicit approval for spending, billing, release. Business professional programs require separate approval, not part of first consumer release.

## No-backtracking decisions to lock BEFORE SB-19 UI implementation
- [ ] Core rights / what can never be paywalled agreed and covered by QA.
- [ ] Names of entitlements chosen separately from storefront product IDs and marketing names.
- [ ] Lifetime Complete inclusions, expansion rights and policy for upgrades explained.
- [ ] Cloud Care entitlement defined (automation only, not GB/storage capacity); backup versus sync distinction proven comprehensible.
- [ ] Plan comparison, free-first onboarding, one unobtrusive context prompt, upgrade/restoration/expiration and cancellation screens accepted at small/large scale.
- [ ] Data model and export schema independent of paid status; refund/expiry does not break recovery.
- [ ] OneDrive/Drive/iCloud availability and respective permission model mapped; direct connection stays future gated.
- [ ] Encryption key/recovery path and provider disconnection data lifecycle documented before premium cloud implementation.
- [ ] iOS/Android purchase receipt validation, Family Sharing choice and cross-store entitlement strategy decided.
- [ ] Background auto-backup limits and real restore/readback independently verified before selling reliability promise.
- [ ] Report redaction/contractor handoff selects only intended data; no insurance reimbursement claims.
- [ ] Offline OCR and speech support capability-checked; fallback never requires paid online AI.
- [ ] Human task/pricing research completed and limitations recorded; no fake percentage confidence.
- [ ] Support/refund/cancellation obligations and ongoing gross-to-net economics estimated before cloud pricing.
- [ ] Privacy notice, platform billing, trademarks/name clearance, rollout, merchant tax and refund process reviewed before any commercial activation.
