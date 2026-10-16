# CasitaDex — SB-18 Interactive Design Review
October 15, 2026 | Designs by F&A | Concept only, not final accepted UI.

## Open on the primary Windows workstation
Double-click: C:\CasitaDex-Git\docs\design\SB18_household_memory_interactive_concept.html
No login, server or internet is needed. The sample household records are fictitious. New prototype entries disappear after closing the page. Camera, microphone, cloud, backup, and purchases do NOT actually operate.

## Screens
First visit (one useful answer, no inventory wizard); Home (search and save); Find and Spaces (answer-first search); Answer (large useful fact, context, illustration and trust); Add (write/photo/voice interaction concepts); More and Storage & Backup (honest on-device status and free manual export versus optional future Cloud Care); optional Complete information (not a store). The desktop sidebar opens every screen.

## Screenshots
SB18_mobile_first_visit.png, SB18_mobile_home.png, SB18_mobile_answer.png, SB18_mobile_photo.png, SB18_mobile_voice.png, SB18_mobile_storage.png, SB18_mobile_zoom_130pct.png, SB18_desktop_review.png.

## Reproduce browser QA
At C:\CasitaDex-Git run: node docs\design\verify-sb18-prototype.mjs
Playwright/Chrome tested First visit, Home, Find, answer search/detail, simulated photo/voice, sample save, More, Storage and Complete, JavaScript errors, mobile overflow at 360/390px and simulated 130% browser zoom. Browser zoom is not equivalent to OS Dynamic Type.

## Review questions
Is the exact answer the strongest element? Is finding/saving obvious? Does four-tab Home/Find/Add/More improve simplicity while Spaces remains accessible through Find? Do capture permission and offline states feel honest? Is pricing absent from first-run and the answer? Can a user tell Free manual export from premium backup automation and from third-party cloud capacity?

## Known gates
No human research, final signoff, native camera capture or voice recorder, cloud integration, payment, actual backup storage screen, TalkBack/VoiceOver or Android/iOS screen acceptance. SB-17 secondary emulator System UI ANR remains open. Preserve owner's uncommitted RECOVERY_RUNBOOK.md. Four vs five tabs remains a human-test decision; no native feature was modified. See SB18_HOUSEHOLD_MEMORY_UX_SYSTEM_2026-10-15.md, SB18_FIELD_RESEARCH_PROTOCOL_2026-10-15.md and SB18_NATIVE_IMPLEMENTATION_READINESS_2026-10-15.md.
