# SB-18 — Consumer UX Research and Design Brief
Date: October 15, 2026. Owner: Designs by F&A. Status: discovery draft; no final UI approved.

## Charter-aligned design goal
ART + FUNCTION + EXPERIENCE WITHOUT GIMMICKS. Save once, find in seconds, remember automatically. Fewer features, faster answers. The V1 is home-first and local-first; no mandatory account, online service or upload. Optimize answer retrieval per app opening rather than time in app.

## Provisional audiences (research hypotheses, not interview findings)
- Homeowner repairing/replacing parts: needs filter sizes, model numbers, paint codes, shutoff locations quickly.
- Busy organizer/family: needs to remember where an item is, preferably with a photo.
- Older user: readable type, explicit action labels, optional speech instead of required typing.
- New household member: find information without learning a complex taxonomy.

## Product opportunities
Sortly publicly emphasizes visual inventory, folder hierarchy, QR/barcode and item properties (https://www.sortly.com/solutions/home-inventory-software/). CasitaDex should test differentiation through *answer-first retrieval* rather than comprehensive stocktaking. Compare Centriq and HomeZada before any competitive superiority claim.

## Proposed navigation
Home | Find | Add | Spaces | More. Home: prominent search, Add, recent answers, Needs attention, optional pins. Find: local query with forgiving empty results and filters only as needed. Answer detail: key fact topmost, location, contextual photo/audio, edit, source/confidence, last updated. Add: small title/answer form plus Camera, Photos and Voice, with extra fields collapsed. Spaces: room/system browse without mandatory categorization. More: backups, privacy, appearance, accessibility, help.

## Capture and retrieval prototypes
Camera: Add > Take photo > context-specific permission > preview/retake > note the useful fact > Save offline. Store in app-owned private media. No implied OCR.
Photo library: Add > Choose photo > preview > answer > Save; denial must not block typed answers.
Voice: Add > Record note > context-specific microphone permission > recording timer/stop > playback/re-record/delete > save audio offline with card label. Audio attachment is different from transcription. No silent uploads or promise of offline transcription without a verified on-device engine. Searchable title works without transcription.
Find: query `air filter` > critical dimensions and location visible in results > photo/audio optional. No network required.
Backup: distinguish text-only export from media-inclusive export, with preview, integrity validation and previous-data recovery.

## UX and accessibility bars
- Android touch targets at least 48dp, clear spacing, Dynamic Type and 1.3x+ text test, adequate contrast, color not sole signal.
- Camera/microphone permissions on explicit use with clear reason, denial fallback.
- Announce recording state and saved confirmation to screen readers; no essential hidden gestures.
- Capture initiated within two actions from Home. Key answer accessible without multiple navigation layers.
- Preserve drafts across interruptions where possible; explain media-export encryption limitations.

## Research and acceptance plan
Conduct 6–8 task-based moderated sessions, at least two with large-type/assistive needs. This is a proposed research sample, not completed research. Measure retrieval success/time, tap count, capture drop-off, permission understanding, and recovery success. Compare search-first vs category-first and photo-first vs text-first prototypes.
Deliver: architecture, flows, wireframes, high-fidelity Home/Find/Add/Answer/Spaces/More, camera/audio states, error/empty/offline states, contrast and type tokens, foldable and small-screen layouts, prototype research script and owner approval before SB-19 build.
Sources: https://support.google.com/accessibility/android/answer/7101858 ; https://developer.apple.com/design/human-interface-guidelines/privacy/ ; https://www.sortly.com/solutions/home-inventory-software/ .

## Owner decision: optional premium BYOS (2026-10-15)
Design a calm, clear Storage & Backup screen with local-only as default, provider choice (OneDrive, Google Drive, iCloud Drive/Files where OS-supported), backup scope/media estimation, local versus online status, last VERIFIED backup, retention/recovery controls, permission consent and graceful disconnection. In mockups clearly distinguish Free manual full export and recovery from Premium automated encrypted cloud convenience. Never call an upload a completed backup without integrity verification, or represent provider disk capacity as included in an F&A purchase.

Before pricing or engineering approval, test comprehension of third-party cloud account fees, willingness to pay, lifetime-purchase versus subscription concerns, opt-out and offline usage, recovery after premium cancellation, and screen-reader states. Full detail: `SB18_BYOS_STORAGE_MONETIZATION_DECISION_2026-10-15.md`; governing charter Amendment D. Cloud integration remains out of authorized current V1 implementation.

## Monetization-ready design workstream (October 15, 2026)
Research-based discovery—not release or pricing authorization—now covers lifetime Complete, optional Cloud Care BYOS, selected-data PDF reports, camera OCR, advanced maintenance, moving/QR labels, household sync, handoff, and professional distribution. Before high-fidelity visual sign-off, design entitlement/expiry/cancellation screens and contextual upgrade moments without blocking offline access, free camera/voice, accessibility, or full data export. Separate backup from cross-device sync. Implement no hidden purchase checks in core data model. Research matrix: `SB18_MONETIZATION_MARKET_RESEARCH_2026-10-15.md`; prioritization and UX: `SB18_REVENUE_OPPORTUNITIES_AND_UX_BLUEPRINT_2026-10-15.md`; exploratory economics: `SB18_PRICING_ECONOMICS_AND_VALIDATION_PLAN_2026-10-15.md`.
