# Add Photo — visible Cancel correction

November 15, 2026. Built and tested exclusively on FA-MAC-DEV-01.
Branch: `work/cd-photo-source-cancel-20261115`. Source commit: `e196551`.
Baseline: search corrections and evidence through `a0b91e3`.

## Cause and correction

The previous Add Photo Alert supplied four actions. The installed React Native Android implementation slices the list to three, dropping Cancel. Replaced all four affected triggers in Add Memory, Add Photo Memory, and saved-memory Details/Edit with a shared themed modal.

Take Photo, Choose from Library and Browse Files remain available. A separate Cancel button stays outside the scrolling source list. Cancel and Android Back only close the chooser; they do not select a source, delete photos, discard the draft or navigate away. Existing source-selection callbacks and saved-memory logic are retained. The already-cancelable photo viewer source controls were not changed.

## Verification

- TypeScript and ESLint: PASS.
- Regression suite: 515 passed, 6 existing skips, 0 failed. The initial source-layout test expected inline source labels; it now follows the extracted chooser. Its initial failed log is retained.
- Android release QA build: PASS.
- Emulator: explicit Cancel, Android Back and 200% text Cancel all passed, with unchanged visible draft fields. Enlarged chooser screenshot reviewed; all four actions visible.
- Samsung: PASS: explicit Cancel, Android Back and Cancel at 200% text, with unchanged visible draft fields.
- Replacement installs preserved application storage. No uninstall, storage clearing, saved-memory edits or draft discard were performed. Original font scale restored.
- iOS native verification and Figma overlay reconciliation for this follow-up remain pending; neither is claimed complete. No production release or main merge.

## Installed identity

Package `com.designsbyfa.casitadex.refreshqa`, version 0.1.0 (1).
APK SHA-256: `30941bf880be47581fba564f6b856eed59dd675a9de8d450713d0385c331c54f`.
Installed APK hash matches on emulator and Samsung. This candidate supersedes the preceding search-correction APK and includes those accepted source changes.

[Evidence](evidence/photo-source-cancel-20261115/).
