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
