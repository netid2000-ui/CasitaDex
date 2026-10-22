# CasitaDex — Privacy Disclosures (DRAFT / NOT APPROVED)
Date 2026-10-20. This is an internal review draft, NOT a public statement or store form. Owner-approved contact, effective date and public URL are missing. No blanket zero-transmission or zero-collection claim is authorized.

## Proposed plain-language summary
CasitaDex is designed to keep memories, attached photos, reminders and drafts locally on your device, including offline. You choose what to save, back up, restore, export or share. When you choose to share, CasitaDex prepares a local file and opens the device's share sheet. The app you select to receive that file may transmit or retain it under that app's own privacy practices. Exports and backups outside CasitaDex may remain available after deletion from CasitaDex.

## Policy content to verify before publication
- Stored categories: memories, photos, reminders, unfinished drafts, local app settings and exported backups; verify final binaries.
- Local storage: native database/files and user-selected Android folders; the inspected Development config has no cloud backend. Do not generalize that finding to a final release binary without verification.
- Permissions: Android file/photo picker and optional camera workflow; verify iOS and release permission prompts.
- Export/sharing: local ZIP via share sheet; receiving app or chosen remote storage has separate policies. Backups may include sensitive data.
- Retention/deletion: accurately distinguish archive, Recently Deleted, permanent deletion and independently exported files. Do not promise immediate purge without evidence.
- Third parties: React Native OkHttp QA listener caught only a known local probe during limited navigation; Expo native networking paths exist but were not directly reached by inspected app flows. App-wide SDK/UID attribution and iOS review are incomplete.
- Legal and age-related statements: review with owner before making regulatory, children's privacy or international rights claims.
- Mandatory placeholders: [OWNER-APPROVED SUPPORT CONTACT], [EFFECTIVE DATE], [PUBLIC PRIVACY POLICY URL], [OWNER SIGNOFF].

## Store disclosure decision sheet — no answers authorized
- Google Play Data safety: Do not submit 'No data collected' from the current tests. Validate every shipping SDK, user-directed transfers and privacy policy against current Google rules.
- Apple App Privacy: Do not claim 'No Data Collected' without final iOS SDK/privacy-manifest review. Public URL and support contact unresolved.
- In-app privacy information must be easy to find, screen-reader labeled and match published language; not verified.

## Gate checklist
[x] Native Android photo/backup/share source path inspection.
[x] Verified isolated OkHttp hook with local loopback probe.
[x] Repeat Android accessibility hierarchy at 130% font: five tabs and three Home create actions labeled.
[ ] Human spoken TalkBack reading order, announcements and action gestures.
[ ] Human visual review 130% and larger font in both appearance modes.
[ ] iOS VoiceOver and shipping iOS binary review.
[ ] Final shipping SDK/third-party transmission inventory.
[ ] Owner-approved support contact, effective date, policy URL and public content.
[ ] Store forms, signing and release authorization.

This document is nonrelease evidence. Do not publish or deploy.
