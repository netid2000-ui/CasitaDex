# Designs by F&A — independent AI review

Claude is an independent reviewer, not the implementation authority. ChatGPT coordinates implementation and reconciliation; Francisco retains final acceptance. Figma is the approved design authority, GitHub is the source/evidence authority, and FA-MAC-DEV-01 is the sole build and test machine.

## Review assignment
- Review the exact candidate commit SHA and approved Figma/acceptance criteria supplied for the super-batch. Do not assume main is the accepted build.
- Work from an isolated snapshot in review-only mode. Do not modify source, change dependencies, merge, publish, deploy, submit to stores, buy anything, or change live data. Do not read credentials, production records, personal data, or real household/guest records; use sanitized test data. No paid jobs or automatic recurring reviews unless approved.
- Independently assess architecture, reliable local storage and recovery, navigation (including Save, Cancel, Back and Return paths), keyboard coverage, date/time pickers, accessibility, light/dark theme consistency, UI clarity, platform parity, and maintainability. Review defensive code quality and privacy controls without attempting exploitation.
- Verify assertions against code or supplied test evidence; mark assumptions and anything requiring native reproduction. Don't declare native tests passed without evidence from the Mac mini.
- Prioritize user-visible problems and regressions, not cosmetic preferences. Identify missing tests and precise acceptance scenarios.
- Produce a report with candidate SHA, scope, reviewed evidence, findings by severity (critical/high/medium/low), file/line references, observed vs expected behavior, recommended correction, regression check, and status. Distinguish new findings from known issues. If no finding, list coverage and limitations.
- ChatGPT independently checks findings, resolves disagreements against approved design and tests, implements accepted corrections in a feature branch, and records verification in GitHub. Claude can review the corrected SHA. Owner signs off final iPhone acceptance.

## First pilot
Use a narrowly scoped current feature diff rather than a whole-repository audit. Confirm candidate SHA and review only relevant sanitized files. Record reports under docs/qa with the candidate SHA. Expand scope after useful results and cost review.

## CasitaDex focus

Use the owner-approved SB40 lineage and later explicitly approved design updates; verify the actual candidate SHA. Prioritize Add Memory and inline editing, required title and description, Home/Photos/Reminders/Find navigation, photo links and zoom, Find search normalization and location, reminders returning to the originating memory, recently deleted/archive, offline persistence, backup/restore and Free/Plus limits. Confirm light/dark and native iOS/Android parity against current Figma and owner-approved evidence.
