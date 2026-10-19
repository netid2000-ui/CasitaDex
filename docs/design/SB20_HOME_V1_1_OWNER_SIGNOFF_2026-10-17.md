# CasitaDex SB-20 — Home Functional and Visual Specification v1.1
Date: 2026-10-17. Owner: Designs by F&A.
Decision: OWNER DESIGN SIGN-OFF APPROVED. CODE IMPLEMENTATION ON HOLD.

## Product contract
Fewer features. Faster answers. Home opens the path to Find, Add, the two most recently saved memories, and due reminders. Home is not an inventory, verification queue, or settings dashboard.

## Owner-approved decisions
1. Find an answer first: unified search field and independent evergreen GO button inside one rounded control; GO and keyboard Search pass trimmed query to Find; blank opens unfiltered Find.
2. Retain original large house illustration/tagline; display as a large adaptive banner, preserve proportions and access to search, avoid redundant spoken branding.
3. Full-width raised sage Save a memory action opens Add directly.
4. Recently saved shows up to two softly raised, compact cards with title and answer only (no image, room, verification badge or date). Whole card opens Answer Detail; See all opens Find. New creation timestamp and stable legacy fallback require compatible design before implementation.
5. Only due-today and overdue Reminders on Home: show up to two, oldest overdue first; hide empty; See all opens reminders-filtered Find. Fact Needs checking stays in Find and Answer Detail. Durable reminder completion and rescheduling require explicit state-model design, not assumed implemented.
6. Four persistent icon-and-label destinations: Home, Find, Add, More. Highlight selected tab, screen-reader selected semantics, safe areas and 48dp minimum targets.

## Non-negotiable runtime and QA
Offline search and navigation; data durability; no fabricated backup verification; accessible dark/light, TalkBack and 130–200% text; safe keyboard, compact, landscape, tablet and foldable layouts. Protect drafts, imports, SQLite records and backups. Test zero/one/many memories; search/GO blank and populated; ordering of legacy restores; due/completed reminders; stale records and storage errors. Record real Android and representative human acceptance separately.

## Governance
This is a design sign-off, not native acceptance or authorization to modify source, migrate data, build, deploy, push Git, or enable cloud, paid services, account integrations or production. SB-20 Find, Add and More detailed design proceeds next. Keep implementation on hold pending later owner authorization. Previous outstanding SB-17 stability and foldable evidence gates remain open.

## Cross-tab owner-approved amendment — photo-only recent memories (2026-10-17)
The later approved Add v1.0 allows title plus photograph without a written answer. Bounded owner decision: on Home Recently saved, these photo-only records use compact human-authored title + literal 'Photo memory' cue (optional accessible icon) instead of unavailable written answer. Do NOT show thumbnails, categories, verification badges or fabricated image-derived text on Home. Existing text-answer cards remain title+answer. Maximum two recents, navigation and illustrated Home hierarchy unchanged. See SB20_CROSS_TAB_OWNER_DECISIONS_2026-10-17.md. DESIGN amendment only; runtime implementation stays on hold.
