# Duplicate-name and label-management safeguards

Mac-only verification on FA-MAC-DEV-01. Native work uses the disposable QA simulator; accepted SB40 and the original QA collection remain untouched. No completed photo acceptance is repeated.

## Existing safeguards checked

- Creation and rename reject case-insensitive duplicates after trimming leading/trailing whitespace.
- Empty, whitespace-only and over-200-character names are rejected.
- Renaming a label preserves its identity, memory links and draft links.
- Removal review is read-only and reports saved-memory/draft impact.
- A changed revision invalidates removal confirmation.
- Confirmed removal removes label references while retaining memories and the unfinished draft.

Four store-level tests pass, including exact snapshot preservation after rejected operations and preservation of the recovery snapshot after duplicate rejection. These tests use synthetic in-memory fixtures; no user label is removed.

Native tests check case/whitespace duplicate errors with typed input retained, Cancel returning to details, accurate removal review, and Cancel preserving the assignment through restart. Final results follow.

This is targeted safeguard verification, not broad input or release acceptance. Native label-name typing/rename and physical devices are not covered. Unicode normalization and internal-space equivalence are not part of the current duplicate policy.

## Final result

All four store tests and all four native tests passed. Native duplicate errors preserved the typed input, and removal review/Cancel preserved Space and Category assignments through restart. Independent SQLite verification confirms the entire QA payload is byte-for-byte unchanged: 19 saved memories plus the retained draft, labels and media. Original 90-memory QA payload hash also unchanged. No application source change was needed. Figma QA status reconciled at node 1006:17.

[Evidence](evidence/taxonomy-safeguards-20261114). Next: native Label name editing and rename acceptance, followed by remaining platform/physical qualification.
