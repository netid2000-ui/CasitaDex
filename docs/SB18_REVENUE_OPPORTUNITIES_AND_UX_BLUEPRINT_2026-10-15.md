# SB-18 — Revenue Opportunities, Entitlements, UX and Delivery Gates
Date: 2026-10-15. Working hypotheses, NOT feature authorization or final prices. Evidence: `SB18_MONETIZATION_MARKET_RESEARCH_2026-10-15.md`; charter Amendment D.

## Candidate hierarchy
P0=design space now; P1=future consumer test; P2=separate commercial/security decision; DROP=not strategically aligned.

| Candidate / monetization | User value | Priority | Main design and security risk |
|---|---|---|---|
| Complete lifetime | batch editing, advanced views, layouts, export templates | P0 | must not block core read/write, accessibility or data export |
| Encrypted BYOS automation | OneDrive/Drive verified scheduled backups and version history, annual/lifetime option | P0 | provider OAuth, key recovery, background constraints; manual backup stays free |
| Enhanced reports | polished contractor snapshot, service timeline, selective PDF | P0 | ordinary records/export remain free; consent and redaction required |
| Smart camera capture | OCR of label/serial/part number, human review of extracted facts | P0 | accuracy and offline model availability; camera/photo recording free |
| Maintenance Plus | advanced multi-interval routines, history, reminders and calendar export | P1 | basic reminders free, avoid recreating a task manager |
| Moving/organization | QR labels, offline box tags, print sheets, inventory views | P1 | no public QR link containing private household data |
| Space template packs | seasonal homes, workshop, storage, RV, appliance presets | P1 | home-first; packs must not force upfront home inventory |
| Household sharing/sync | multi-user, roles, conflict resolution, cross-device state | P1 | not same as backup; costly backend/security and key sharing |
| Home sale handoff | owner-selected package, redaction, household transfer report | P1 | privacy, consent, records retention, business liability |
| Emergency reference polish | print/laminated format and guided household checklist | P1 | actual emergency shutoff records and local access never paywalled |
| Premium visual presets | distinctive home themes, customization | P1 | contrast, large text, dark mode and reduced motion remain free |
| AI concierge/transcription | optional voice-to-text and document organization, usage charges | P2 | expense, consent, cloud content exposure, hallucinations; on-device fallback preferred |
| Realtor/inspector/organizer seats | professional gifting/bulk access and simple transfer | P2 | separate sales/support, entitlement/store policies, no sale of household data |
| Affiliate parts marketplace | inventory-linked shopping | DROP | conflict of interest, ads, loss of user trust and scope creep |
| Advertising or selling data | monetize attention/household signals | DROP | contrary to no-ads and privacy charter |

## Important exclusions from paywalls
Always free: reading, editing and finding answers offline; supported local camera/voice capture; accessibility; basic reminders; full manual portable export/restore including media; recovery after expiry; device privacy. No number-of-answers ransom, no paywall during disaster, no interruption of a user's urgent retrieval, no premium-only encryption of manual backups when supported.

## Economic model options to test, not adopt yet
A (recommended starting hypothesis): Free essentials + one lifetime Complete nonconsumable + optional BYOS auto-backup subscription for continuing maintenance.
B: Free essentials + a single modest annual Pro (simpler marketing, but subscribers may reject paying for offline functions).
C: Free essentials + individual task packs and optional BYOS plan (more choice, but entitlement complexity and "nickel-and-dime" impression).
D: Upfront paid download (simple cash flow but high acquisition friction and no free utility for prospective customers).
Initial default for mockups: A; allow B/C to be tested. Owner charter earlier proposes introductory Complete $14.99-$19.99, unvalidated. Research test bands: Complete $14.99/$24.99/$34.99 lifetime; optional BYOS $14.99/$29.99/$39.99 annual; task packs $4.99/$9.99/$14.99 one-time. These are *survey price cards* only, not plans or revenue promises.

## Packaging caution
Buying storage from Microsoft/Google is separate from paying F&A for backup automation. Do not sell "unlimited storage". Purchases on Apple and Google have independent entitlement systems. Family Sharing may apply to eligible Apple subscriptions and nonconsumables when correctly configured but is NOT automatic cross-platform household data sharing. Subscription expiration must never strand documents or deactivate a lifetime purchase.

## UX architecture: prevent retrofits
- Central `entitlement` service uses stable capability names (`complete.batch_tools`, `complete.advanced_reports`, `cloud.auto_backup`, `cloud.version_history`, `household.sync`, `pack.moving`), not plan-string checks scattered through screens. Provide `free`, `owned`, `eligible_trial`, `expired`, `unavailable_offline`, `restore_pending` states. All optional features must degrade gracefully.
- Record/media schema remains plan-neutral: a paid export template or camera OCR enriches existing answer cards, never encodes ownership in the stored data. Data migrations independent of paid status. Purchase state/cache lives separately and is reconciled with store receipts when online.
- Main navigation stays Home, Find, Add, Spaces, More (design proposal). Do NOT insert Store as a primary tab, full-screen paywall on onboarding, or persistent upgrade badges. Show pricing only when user deliberately explores an enhanced feature or Settings > Upgrade.
- More > Storage & Backup: local usage, quota, user provider, offline state, last **verified** backup, retained versions, manual export (Free), Premium automation settings, disconnect, key recovery and ownership. Name everything plainly.
- More > Enhance CasitaDex: transparent comparison with lifetime versus ongoing charges, service/provider requirements, tax/renewal disclosures, Restore purchases, Manage subscription and cancellation path.
- Answer detail > Share: basic plain-text/selected card export always Free; premium formatting/templates offered non-blockingly before rendering the enhanced report. User selects what to reveal.
- Camera/voice Add: baseline capture must be Free and not interrupted by purchase prompts. Optional OCR assisted entry may have an advanced paid batch workflow, but no loss of manual entry; no unapproved cloud AI.
- Households: use a later Invite flow that explains which data will be shared, what remains offline, consent and entitlement roles. Do NOT represent Apple Family Sharing purchase entitlement as a household data-sync implementation.
- Cancellation: make no local data inaccessible; stop new automatic backup jobs only after clear disclosure, preserve previously exported backup files (subject to user's provider), explain restore procedure and any expired cloud credentials.

## Dark-pattern/acceptance red lines
No subscription countdowns, hidden close buttons, false urgency, prechecked addons, intentional confusing cancellation, spammy upsells, or premium placement above the answer. All quotes must disclose billing frequency, provider-storage not included, online/offline implications, and restore rights. Premium cards must be navigable with large text/TalkBack/VoiceOver. The first saved answer must succeed without purchasing or registering.

## Technical feasibility and app-store policies (official public docs reviewed 2026-10-15)
- Apple App Review 3.1.1: paid app features generally use IAP except permitted exceptions; 3.1.2: auto-renewing subscriptions need ongoing value. Google Play's digital-functionality/cloud-service payments policy also applies; regional alternative-billing and fees may change.
- Apple Family Sharing may support eligible nonconsumables/subscriptions with correct configuration. Purchase sharing is NOT household-data sharing. Google Play one-time products and subscriptions are distinct. Test refunds, subscription expiration, offline entitlement cache, and store purchase restores.
- Android ML Kit bundled OCR and Apple Vision recognize text locally; bundled models affect APK size, downloaded models may be unavailable offline. Always ask user to confirm extracted facts.
- Offline speech-to-text support depends on device and locale. Android SpeechRecognizer.isOnDeviceRecognitionAvailable and iOS SFSpeechRecognizer.supportsOnDeviceRecognition are necessary capability checks; preserve raw audio independently of any transcript.
- Microsoft Graph offers limited OneDrive Files.ReadWrite.AppFolder scope; files count against user quota and users can delete them. Google Drive appDataFolder is hidden, so carefully choose visible export vs app-owned backup. Large transfers should use resumable upload, not current 20MB in-memory export.
- Encryption must be authenticated with independent, recoverable user-managed keys; do not claim zero-knowledge without explicit security review. Sync is distinct from backup and demands conflict resolution, revisions, tombstones and household revocation.
- No OAuth, billing, cloud, F&A backend, AI service, Production, spending or store activation is authorized yet. These remain separate security and owner gates.

### Technical primary sources
- App Store review: https://developer.apple.com/app-store/review/guidelines/
- Google Play billing: https://support.google.com/googleplay/android-developer/answer/10281818
- Apple Family Sharing: https://developer.apple.com/help/app-store-connect/configure-in-app-purchase-settings/turn-on-family-sharing-for-in-app-purchases/
- Google one-time products: https://developer.android.com/google/play/billing/one-time-products
- Bundled/unbundled ML Kit: https://developers.google.com/ml-kit/tips/installation-paths
- Apple Vision OCR: https://developer.apple.com/documentation/vision/recognizing-text-in-images
- Android speech: https://developer.android.com/reference/android/speech/SpeechRecognizer
- iOS speech: https://developer.apple.com/documentation/speech/sfspeechrecognizer/supportsondevicerecognition
- OneDrive app folder: https://learn.microsoft.com/graph/onedrive-sharepoint-appfolder
- Google Drive appDataFolder: https://developers.google.com/workspace/drive/api/guides/appdata
- Resumable transfers: https://learn.microsoft.com/graph/api/driveitem-createuploadsession and https://developers.google.com/workspace/drive/api/guides/manage-uploads

## Working ranking (relative hypotheses, not measured financial returns)
Criteria: expected household usefulness, willingness to pay, differentiation, user trust, build/support cost, offline feasibility. H/M/L are qualitative leadership judgment, not study findings.
| Rank | Concept | Value | Revenue potential | Delivery risk | Discovery confidence |
|---|---|---|---|---|---|
| 1 | Complete lifetime local productivity | High | Medium | Low-Medium | Medium: multiple one-time inventory offerings |
| 2 | Verified encrypted BYOS Cloud Care | High | Medium-High recurring | High | Medium: backup need validated, paid BYOS demand untested |
| 3 | Contractor/selected-card premium reports | High | Medium one-time | Medium | Medium: home inventory/export precedents |
| 4 | Smart capture: assisted OCR/batch tagging | High | Medium one-time | Medium | Medium: ML APIs exist, accuracy to test |
| 5 | Advanced maintenance/history workflows | Medium-High | Medium | Medium | Medium: Tody/HomeZada validate category, not CasitaDex demand |
| 6 | Moving + QR/label pack | Medium-High occasional | Medium | Medium | Low-Medium: niche competitors |
| 7 | Live family sync + access roles | High for multi-user | High recurring | Very high | Medium: competitors charge, security must be solved |
| 8 | Home handoff / partner licenses | High for occasional/partner users | Potentially high B2B | Very high | Low: no partners or signed demand |
| 9 | Cloud AI assistant | Uncertain | Uncertain | Very high | Low: high trust/usage and hallucination cost |
| 10 | Themes alone | Modest | Low | Low | Low: enhancement, not primary paid reason |

## Recommended screen-specific monetization placements
Home: NO paywall or subscription content; users get their answer promptly. Add: primary photo/voice/text free and always offline. Find: free local results and labels; advanced batch tools offered in an optional overflow menu. Answer: free basic sharing, an unobtrusive enhanced export option for Complete. Spaces: optional premium templates and moving organizer, not a forced setup. More: an easily found Storage & Backup card, with separate Free manual backup and paid verified automation. Settings/Help: optional Compare plans, Restore purchases, Manage subscription, provider disconnect and recovery. Avoid more than ONE context-specific paid invitation per user task.

## Suggested phased release order — not implementation consent
**Launch candidate:** fully functional offline Free + one-time Complete local productivity upgrade, if human pricing research supports paid conversion and release gates close. No automatic cloud billing in V1 by default; manual export/restore remains free.
**Next candidate:** Cloud Care BYOS encrypted verified scheduled backup after security/key management, OAuth, background-reliability and purchase-cancellation QA. Marketing must disclose third-party storage/account fees.
**Optional expansion:** enhanced reporting, moving/QR and advanced maintenance packs based on actual repeat usage; avoid launching a catalog of upsells at once.
**Separate later business:** real multi-user sync with concurrency and encryption, professional handoffs/gifting and optional AI, each subject to independent commercial/legal/security review.

## Design frozen-in architectural seams, NOT frozen feature set
Define durable card/media IDs, opaque attachments and source provenance; plan-neutral import/export; a typed capability map and feature discovery; redaction-aware share/export; templates as optional content data rather than hard-coded screen forks; background backup task status separate from local save status; subscription/offline grace handling and refunds; semantic typography and remote-config-free fallback states. Do not add OAuth credentials, payments SDK or new native dependencies during this research-only batch.
