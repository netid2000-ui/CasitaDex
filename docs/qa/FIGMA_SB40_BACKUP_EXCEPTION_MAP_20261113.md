# Backup/export exception mapping — first review state

Read-only source evidence from accepted SB40 worktree d1a34cb.

| Case | Source | Figma status |
| --- | --- | --- |
| Collection changes after limited-backup review | eng-screens.tsx:478 checks restore token before write; throws Collection changed. Review the text backup again. | New review state 1208:2 |
| Full backup directory choice canceled | eng-runtime.native.ts:122 keeps memories/draft | Pending design mapping |
| Text export directory choice canceled | eng-runtime.native.ts:174 returns Text export canceled | Pending design mapping |
| Backup selection canceled | eng-screens.tsx:481 clears incoming selection and keeps current data | Pending design mapping |
| Restore canceled | eng-screens.tsx:492 keeps collection/draft | Pending design mapping |
| Full backup read-back verification fails | eng-runtime.native.ts:105,136 | Pending design mapping |
| Backup cleanup fails | eng-runtime.native.ts:139 warns incomplete file may remain | Pending design mapping |
| Text export read-back fails | eng-runtime.native.ts:176-177 deletes output then throws | Pending design mapping |
| iOS sharing unavailable | eng-runtime.native.ts:108 | Pending design mapping |

Existing current-page text scan found no matching collection-changed, text export canceled, or read-back failure messages. This does not establish absence elsewhere in the file.

Created 1208:2 by cloning approved permanent-export layout 875:106, with status 1208:38 using exact source message. Existing export controls/reactions and 91pt persistent Settings navigation retained; 557pt body inside vertical viewport. All created IDs 1208:2 through 1208:38. Figma board 1006:17 updated. Structural evidence and screenshot reviewed. State is a source-mapped design proposal, not a capture or native test; owner approval pending. Preview entry is direct link, not an artificially introduced production error trigger.

No source edits, real exports, native tests or repeated photo testing.
