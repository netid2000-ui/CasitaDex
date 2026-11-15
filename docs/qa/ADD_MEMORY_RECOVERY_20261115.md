# Add Memory native recovery — 2026-11-15

Follow-up to d934bc5 on work/cd-plus-backup-safety-20261114. Mac mini only.

## Finding and correction
Rapid iOS typing into Add Memory Location and Reference dropped characters with the default input. Add optional fields now receive the same iosTextView feature-gated handling already used by Edit Memory. Parent checkpoint/save logic is unchanged. This is scoped to the existing Plus-enabled iOS build configuration; other configurations are not newly qualified here.

## Android
Disposable com.designsbyfa.casitadex.refreshqa installation replaced because the emulator lacked update staging space. Accepted packages and physical phones untouched.
Light/dark captures reviewed; fixed Save/Cancel coordinates identical in top/lower evidence.
All five entered fields survived Cancel and a process restart. Save returned Home; Find after another restart showed exactly one synthetic result. Reopening Edit verified all five persisted values exactly. Returned Home with System appearance.
An initial UIAutomator dump exited 137. Continued from the existing draft, without repeating input or photo acceptance.

## iOS test development
First run failed to open an optional field while dismissing the keyboard; added an explicit wait/retry for the expanded field. Second run then exposed actual dropped characters, so it is a failure, not acceptance evidence. Third run preserved the entered string but the test had inserted it before pre-existing text; corrected the test to use Select All replacement. Fourth run checks the corrected input path and exact post-restart values.
Save's expected destination is Home. Test expectation corrected to match the existing behavior.

## Automated
TypeScript, ESLint PASS; 491 tests PASS, 6 existing SKIP, 0 FAIL.

## Scope
No photo import, zoom or gesture acceptance repeated. No store actions or owner-device changes.
Evidence: evidence/add-android-20261115. Final native outcomes recorded below.

## Verified persistence
Android: all five saved fields re-opened and matched after restart; results.json records PASS.
iOS r4: every exact-value recovery assertion passed and Save committed. The final Home text selector failed because Home does not expose that title as the expected StaticText. This XCTest run remains FAILED; it is not represented as a fully passing run.
Independent read-only SQLite verification: exactly one matching memory, all five values exact, draft null, 20 synthetic memories total. See ios-saved-record.json.
Original QA database SHA remains unchanged. Disposable iOS fixture count increased from 19 to 20 as intended.

The final Home assertion now targets the Add Memory button. A separate saved-record UI readback follows; no second memory is created.

Readback harness: first attempt queried the Edit name field as TextView, while that field is TextField. Corrected to resolve either native input type. No product change resulted from this selector correction.
Remaining scope: Details and Reminders visual parity, production configuration qualification, physical-device acceptance. Earlier failed test attempts are retained and explicitly separated from final evidence.

## Final checkpoint
iOS saved-record readback r2 PASS: 1 XCTest, 0 failures; all five fields match after process restart. Evidence bundle: /Volumes/FA-Development/Designs-by-FA/QA-Evidence/CasitaDex-Add-Saved-r2-20261115.xcresult (job 658fafc67969f558).
Android visual themes, fixed actions, Cancel/restart draft recovery, Save and saved-field readback PASS.
No complete rerun of the corrected end-to-end iOS creation test is claimed: exact draft recovery assertions, SQLite commit verification and the passing independent saved-readback test establish the scoped result.
