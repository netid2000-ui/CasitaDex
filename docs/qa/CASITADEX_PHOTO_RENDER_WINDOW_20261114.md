# Photo image rendering window
2026-11-14 / FA-MAC-DEV-01
Branch work/cd-plus-backup-safety-20261114

## Implemented
Active Photos screen passes its measured viewport height and scroll offset into FigmaPhotos.
The gallery measures card positions and heights, batches layout updates per animation frame, and mounts Image elements only within the visible viewport plus one viewport above/below. Until layout is known it mounts the first12 images.
All card geometry, accessible photo buttons, titles and action destinations remain mounted. Existing sticky controls and viewer-return code remain intact.
Layout snapshots used during render are React state; mutable measurement refs are accessed only in events/animation callbacks. Scheduled layout callbacks canceled on unmount.
This is image windowing, not full card virtualization or thumbnail creation. Native image caches may retain decoded resources after unmount; process-memory reduction is not yet measured.

## Verification
Executable transpiled component harness with1000 items:
-12 startup Image elements
-no more than20 Image elements for the600px deep-scroll fixture
-all1000 photo actions retained and tapped item800 maps to its photo
-first photo rendered again after returning to top
-all1001 layout containers retained
Window helper covers overscan, unusually tall cards, jumps and invalid/unknown measurements.
Harness uses mocked React/native primitives, not a native renderer.
Final full suite453 total:447pass,6skip,0fail.
TypeScript PASS, changed-file ESLint zero warnings PASS, diff whitespace PASS.
React hooks review caught render-time ref access; corrected to state snapshots and reran checks.
Figma checkpoint board1006:17 updated with scope and acceptance boundaries.

## Remaining acceptance
Targeted native rapid scrolling, large text, rotation, changed sort, viewer close/return to tapped photo, and measured decode/cache memory usage.
No device build deployed, no completed owner photo acceptance repeated.
Original full-size files are still decoded for mounted previews. Thumbnail generation/cache and full card virtualization remain follow-up work.
