# SB40 integrated QA checkpoint

Mac mini FA-MAC-DEV-01. Implementation c2742bd includes the verified Android compact draft editor and iOS combined-text viewer fix. Both installed packages use the retained SB40 native QA shells with exact-source Hermes bundles. TypeScript passed. Source suite recorded 433 passed, zero failed and six skipped.

- [x] iOS combined maximum system text and in-app Large Text. All 11 tested controls fully exposed in portrait and landscape. Settings and semantic data restored.
- [x] iOS draft photo add, replace and remove through the native picker and viewer. Used a temporary third photo. The original two draft photos, saved memories and original media hashes were preserved.
- [x] Android landscape draft entry at 2x text. Save, Cancel and photos reachable. Photo open and Close return to draft. Display settings restored.
- [x] Android cold offline draft resume and reconnect. Network settings restored.

Remaining: Android photo mutations, manual pinch, VoiceOver and TalkBack, full visual review, offline writes, restore/failure recovery, notification taps and release qualification.

Evidence on FA-Development: QA-Evidence/CasitaDex/sb40-integrated-qa-20261108. Figma QA note: https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr?node-id=392-33
