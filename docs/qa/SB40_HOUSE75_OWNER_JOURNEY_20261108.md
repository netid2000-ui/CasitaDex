# CasitaDex SB40 — 75-item household owner-journey report

## Result

**75 new fictional household memories were entered through the native SB40 app UI**, with exact title/description readback and no duplicates. They survived process termination/relaunch, alongside 90 unchanged baseline QA samples. Total collection: 165 memories. The initial six wrong-.dev-build records are in a separate app container and are excluded.

[75-item inventory](../../tests/fixtures/house75-sb40-20261108/house75-inventory.md). [Machine-readable verification](SB40_HOUSE75_VERIFICATION_20261108.json).

## Build and design authority

The owner reaffirmed SB40 as the agreed build. QA bundle `com.designsbyfa.casitadex.sb40qa`, executable SHA-256 `8ad89040f3a092c4a57b1d4bf7747a55e1afdd19cfa264f0b3fe136c02ba9b4d`. Test simulator `A4ED0D8B-C90A-4940-9B71-4F570D7DC597`, renamed CasitaDex SB40 Household75 QA. The original SB40 reference simulator remains separate. The physical iPhone was not modified.

The newer .dev source was the wrong basis for the previous CasitaDex full-app Figma map. Its 88 views are hidden and marked WITHDRAWN / WRONG SOURCE; both accompanying specs and the Git manifest are withdrawn. [Corrected SB40 Add/inline map](https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr?node-id=360-2) and [authority contract](https://www.figma.com/design/39uzN0SZX8nlmcGDcHdQhr?node-id=361-492) replace that Add-flow mapping. Owner primary references on page 44 and the separate monetization roadmap are preserved. Remaining SB40 secondary-page reconciliation is still required; do not claim the entire withdrawn map has been rebuilt.

Android's already-installed SB40 QA package was foregrounded without reinstalling or changing records. APK SHA-256 `01e40085176127b815b0870fabbd4d915f463acdea5d8d4e0eb830871467d3bf`. Native Add and Location inline editing were bounded-verified. The 75-item household run was iOS only.

## Method and scope

The list covers 15 areas: utilities/safety, kitchen appliances, pantry storage, bathrooms, laundry, primary bedroom, guest bedroom, living/dining, office, garage/workshop, garden/patio, finishes, seasonal/emergency storage, documents, and pets/hobbies.

All 75 records were created with normal UI typing and Save. No database insertion, seed button, bulk import, or direct store API created them. Read-only SQLite inspection corroborated each saved record. Locations were included in descriptions for all entries; one structured Location was separately edited and saved. The inventory's room/category grouping was a test plan, **not 75 completed structured Space/Category assignments**. No real household specifications, access codes, personal documents or customer data were used.

## Verified results

| Check | Result | Evidence boundary |
|---|---|---|
| 75 native Add → Save flows | PASS | Correct SB40 labels, sticky Save/Cancel, exact saved titles/descriptions; 75 unique new IDs |
| Baseline preservation | PASS | All 90 pre-existing synthetic records unchanged |
| Relaunch after entry | PASS | Entire saved snapshot identical after app process restart |
| Search → open → Return | PASS, 15/15 | One target per household area; correct full descriptions and query preserved on Return |
| Model/location keywords | PASS | RF-DEMO-02, pantry and grout returned relevant records |
| Saved Location edit | PASS | HVAC record structured Location saved as Hallway return grille |
| Cancel unsaved Location edit | PASS | Temporary edit was discarded; saved location unchanged |
| Photo library → attach → viewer → close | PASS, one synthetic photo | Native system picker, app-owned attachment, return to the associated memory |
| Photo persistence/integrity | PASS | All four current app media files matched declared byte counts and SHA-256; three baseline plus one new |
| Memory-origin reminder Save/link | PASS | Prefilled title/notes; stored exact originating memory ID |
| Reminder View Memory and Complete | PASS | Opened Coffee maker cleaning supplies; Upcoming 0 / Completed 1 afterward |
| Final relaunch after edits/photo/reminder | PASS | Memory snapshot and reminder rows unchanged after second restart |
| Unfinished draft | None | No leftover draft after final audit |
| Create-and-assign organization probe | NOT VERIFIED | Harness reached full edit/Create and select rather than anticipated direct Create and assign; canceled unsaved edit; no product defect inferred |
| Notification delivery / tap | NOT TESTED | Permission was granted only in the isolated QA simulator; the test reminder was completed, not used as a delivery test |
| Full Android, physical devices, maximum text, speech, backup/restore | NOT RUN by this scenario | Existing historical evidence remains separately attributed |

The test scripts and journals retain harness failures and corrections. Case-sensitive labels, keyboard focus/scroll synchronization, and the native photo privacy notice required harness adjustments. These are not presented as SB40 product failures.

## What worked well

1. **Sticky Save and Cancel:** reachable during scrolling; a substantial advantage over the wrong .dev form.
2. **Inline Add editing:** Location/Notes/Reference remain in the Add context; Space/Category choosers stay on the form. The normal Add and inline Location control were checked on both simulator platforms.
3. **Durable capture:** no missing descriptions, unexpected duplicate records, or loss of baseline data during sustained entry and relaunch.
4. **Retrieval and context:** exact titles, model numbers and location keywords worked; Back to Results preserved the search.
5. **Saved editing and Cancel:** the tested structured location persisted, and a canceled change did not leak into saved data.
6. **Photo/reminder association:** a new photo stayed attached to the intended memory; a linked reminder opened that exact memory and completed cleanly.

## What still needs work

### 1. Normalize common dimension formats

Observed on SB40:

| Query | Result |
|---|---|
| `20x25x1` | 0 results |
| `20 25 1` | Correct HVAC filter memory |
| `RF-DEMO-02` | Correct refrigerator filter memory |
| `where are the spare filters` | 0 results |

Normalize ordinary size separators such as x, × and spaces without corrupting model numbers. Improve hints/tolerance for everyday wording while preserving offline search. The plain-language result is a limitation, not evidence that an AI service is required.

### 2. Preserve memory context after saving its reminder

Creating a reminder from Memory Details saved and linked correctly, but Save landed on the Reminders list. The accepted return preference is to return to the originating memory. View Memory works, so the data link is sound; navigation still needs refinement.

### 3. Finish organization acceptance

Space/Category assignment across the household collection remains unverified. All 75 test records currently have no structured Space/Category assignment. Test inline selection, creation, rename/removal impact and canceled edits against SB40 before calling this area accepted. Do not confuse a harness route mismatch with a missing feature.

### 4. Reconcile source and Figma to SB40 before further implementation

The current Git development tree and its uncommitted .dev refinements are not the SB40 source baseline. The recovered SB40 workspace is not itself a Git checkout. Preserve both, establish a reviewable SB40 source checkpoint with artifact provenance, and reconcile remaining secondary screens without dropping existing inline/photo/reminder behavior.

### 5. Complete independent release gates

This bounded household run does not establish notification delivery/tap reliability, multi-photo limits/swipe/zoom, strict OS-offline behavior, backup/restore, full VoiceOver/TalkBack, maximum text/landscape, physical iPhone/Android acceptance, security disposition, native billing or signed store readiness. Release remains **NO-GO**.

## Invalidated wrong-build observation

The earlier complaint that Save was below the fold came from the wrong .dev build. **It is not an SB40 finding.** SB40's sticky actions were verified and should be preserved.

## Evidence and repeatability

Evidence is on the Mac mini external SSD under QA-Evidence/CasitaDex/sb40-house75-owner-journey-20261108. The JSON verification records exact counts and outcomes. Scripts are under scripts/qa with sb40-house75 names; they are device/artifact-bound acceptance scripts, not general CI tests. Replay only against an isolated SB40 QA container with matching artifact identity and reviewed initial state.

No source changes to the app, production deployment, live purchase, store submission, simulator wipe, original-data overwrite or physical-device modification occurred.

## Later bounded organization continuation

The [2026-11-08 organization continuation](SB40_HOUSE75_ORGANIZATION_CONTINUATION_20261108.md) subsequently verified native full-Edit Space/Category creation, selection, Save, Cancel, query return and cold-relaunch persistence on one of the existing 75 household memories. All 165 titles/descriptions and the other 164 memory objects remain unchanged. One household memory now has a structured Space/Category assignment; the other 74 remain unassigned. This supersedes only the earlier unverified creation/assignment probe, not the remaining organization or release gates.
