# CasitaDex SB-20 — Add Specification v1.0
2026-10-17 | Designs by F&A | OWNER-APPROVED DESIGN BASELINE — SIGNED OFF — IMPLEMENTATION ON HOLD
Fewer features. Faster answers.
Scope: local-first Add tab and links to signed-off Home v1.1 and Find/Answer Detail v0.9. This draft does NOT authorize source changes, migrations, build, commit, push or deployment.

## 1. Approved decisions
- Quick-save Add with title and optional expandable Organize and More details sections.
- Meaningful human-authored title required; content requirement = nonblank written answer OR at least one successfully staged photo, or both.
- Title first; Take Photo, Import Photo, and written answer grouped visibly together. Photos never hidden behind organization/details.
- Up to five photos per new memory; preserve existing records if migration encounters more than five.
- Import Photo supports both native device photo-library selection and browsing image files; Take Photo opens camera separately. Share-to-CasitaDex extension not in approved scope.
- One automatically locally recoverable unfinished draft; Continue/Discard on return, no silent overwrite.
- Optional user-created Space (zero/one primary), Categories (zero/many) and freeform precise location details, created in place without discarding text or photos.
- Duplicate suggestions are advisory, never silent merge/replace/delete.

## 2. Add hierarchy and validation
Title mandatory and searchable. Media actions prominent; written answer optional when photo attached. Organize expander: Space picker, Categories multi-select, in-place Create Space/Create Category, location detail. More details: notes, optional reminder and relevant evidence without forcing verification. New memory defaults verification to Unknown until explicitly user-confirmed through signed-off Detail workflow. Save button validates title plus answer/photo, prevents double submit and navigates to saved Detail only after durable commit. Photo-only search result shows an actual thumbnail and honest 'Photo memory' cue rather than fabricated answer text. Empty strings must remain compatible with old required-answer card data through versioned validation/migration.

## 3. Photo import, preview and integrity
Visible Take Photo and Import Photo. Import offers Photos and Browse image files with native pickers and least required permissions. Cancel preserves draft. Copy to app-controlled draft staging, validate actual file type/size, hash and associate; display thumbnail only after successful staging. Current native code supports JPEG/PNG/WebP and a 10 MB import limit; future accepted formats, size/quality settings need real Android test.
Thumbnail, enlarge/zoom, remove and replace; maintain orientation. Preserve label legibility, avoid untested destructive compression; strip unnecessary sharing metadata where feasible. Enforce five-photo count for new additions while preserving legacy extra photos. Check free space including working-copy overhead. Camera/picker denial or invalid media must offer a clear recoverable error. No automatic OCR, image-derived text or implied verification.

## 4. Draft autosave and recovery
One private local unfinished Add draft, never searchable until saved. Checkpoint after a short text pause and on lifecycle transitions where possible. Persist title, answer, Space, Categories, notes, and staged media references. Say 'Draft saved' only when write completes. Resume offers Continue/Discard; meaningful Discard requires confirmation. New Add must not silently replace a draft. Save clears draft only AFTER durable memory and media commit. Failed import/save retains prior durable draft. Handle interrupted capture, background, restart, inaccessible media and cleanup of orphan staging. Last keystroke cannot be guaranteed after abrupt power loss without successful checkpoint.

## 5. Duplicate review — proposed details
Check high-confidence candidate matches on Save to avoid interrupting typing. Exact normalized title+answer, matching significant model identifier with strong title overlap, or identical photo content fingerprint merits possible-duplicate alert. Similar title but different answer, or merely similar-looking photos, should not trigger definitive claims. Show View existing, Save anyway, Cancel; preserve Add draft when reviewing existing. Archived matches go to archive review; Recently Deleted matches to recoverable deletion view. Never merge, replace, restore or delete automatically. Bound ranking/search cost on large collections.

## 6. Storage, privacy, backup and deletion
Preflight photo import plus temporary working-copy bytes against actual usable device space, with safe failure. Mandatory storage-pressure guidance approved; numerical warning/critical thresholds OPEN. Archive and soft-delete do not equal freed bytes. Protect media associations and journal across interrupted commits. Saved and recoverable photos must participate in verified backup/restore; local save alone is not backup proof. Sharing photos requires explicit opt-in and unnecessary metadata minimization. Warn about passwords, alarm codes and other secrets. Approved 30-day deleted recovery covers associated photos; permanent deletion requires safe reference accounting and explicit confirmation.

## 7. Native acceptance matrix — NOT YET TESTED
- Save title+answer, title+photo and title+both; reject no title, reject title-only lacking answer/photo.
- Take photo, choose from library, browse image files, cancel/permission denial, unsupported formats and insufficient storage.
- Import one through five photos; sixth blocked clearly; legacy records over limit preserved. Preview/zoom tiny print, orientation, removal/replacement.
- Autosaved draft survives capture, background, navigation and restart to last durable checkpoint; Continue/Discard and failure recovery truthful.
- Optional in-place Spaces/Categories, no orphaned data on rename/delete, search integration; photo-only Find thumbnail.
- Exact duplicate candidate prompt with View, Save anyway, Cancel; no destructive automatic operations.
- Offline Android airplane mode, reboot, interrupted transaction, media journal/recovery, 30-day Deleted restore, verified photo backup/restore and low-space protection.
- TalkBack, text scaling, compact phone, landscape/foldable, dark/light, keyboard; no false claims of saved, verified or backed up status.
Every test remains OPEN until performed.

## 8. Open gates and governance
OWNER: Add v1.0 awaiting final design signoff. Exact image encoding, supported formats and file-size limits, duplicate sensitivity, draft autosave interval and storage warning/critical numbers remain engineering/owner review items.
ENGINEERING: Card schema compatibility with photo-only answers, versioned categories, Space IDs, draft/photo staging atomicity, media hash and lifecycle, native camera and Android photo/document pickers, backup/restore and memory-index performance; reconcile legacy Buy/Fix/Find/Maintain taxonomy without information loss.
This is a design specification only. Preserve existing dirty source working tree. No app code, schema migrations, builds, commits, pushes, cloud/production deployments or device changes authorized.

