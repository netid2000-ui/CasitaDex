# Dark draft and memory return paths — November 15, 2026

Continues 1ee30f4. Figma prototype-only checkpoint, current Warm Editorial page 398:2. Six-part sweep remains OPEN.

## Completed

- Eight dark storage entry points use the existing dark unfinished-draft flow and set an origin variable. Six Cancel controls across the base draft, expanded fields, Space and Category pickers preserve the exact storage origin. Six visible dark-to-light entry mismatches removed; two already-dark entry points gained exact returns. Save data and destination were retained.
- Storage-3 Hallway Edit, viewer, Share, and More now use matching dark flows. The four Hallway detail variants added in the previous checkpoint now also set their own origin. Added/restored conditional return handling across 46 existing controls, preserving the prior 1355:38 origin and earlier cases.
- Seven visible linked-reminder entry points set memory origin. Save and Cancel on both regular and expanded linked-reminder examples return to that memory. One additional direct theme mismatch removed.
- No new frames or visible layout changes in this checkpoint.

## Verification

First readback exposed a Figma serialization constraint: CONDITIONAL retains an IF/ELSE pair, not multiple conditioned blocks. Corrected to separate conditional actions with empty ELSE, matching existing file conventions, and restored the original Hallway origin case. Do not reuse the initial multi-block construction.

Final evaluation of persisted actions: 352 assertions, zero failures (draft 48; Hallway 276 including original origin; reminder 28). Evaluation follows matching IF/ELSE actions and requires exactly one navigation destination equal to the selected origin. This is scripted prototype-graph validation, not manual prototype clicks, native persistence testing, or release acceptance.

Visible direct dark-to-light mismatches decreased from 25 to 14. Eight additional historical links remain hidden by ancestors and are tracked separately.

## Remaining

Two storage-3 appliance photo links; two standalone reminder Value-entry links; four compact/sorted Photos links; six photo links in older PROPOSED storage examples. Exact node IDs are in dark-draft-memory-returns.json. Conditional appearance behavior, picker completeness, global collection filtering/navigation, older editor parity, native validation and final handoff remain part of the six-item sweep. No claim of full app/Figma parity.

Mac mini used for repository evidence. No source/build changes, repeated photo acceptance, physical-device writes, purchases, releases or submissions.
