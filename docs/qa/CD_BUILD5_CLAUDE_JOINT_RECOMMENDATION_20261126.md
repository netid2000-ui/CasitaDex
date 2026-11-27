# CasitaDex Build 5 — joint ChatGPT/Claude recommendation

Date: November 26, 2026 (America/Chicago). Claude Sonnet 5.5 Medium, free plan, existing authenticated Safari session on FA-MAC-DEV-01 via AI Commander. After Claude's initial 13 recommendations, ChatGPT reconciled them against the exact Build 5 source and previous evidence, submitted the evidence clarification, challenged the remaining unsafe or redundant proposals, and reached explicit agreement with Claude. A previous upgrade prompt was dismissed; the free conversation then continued, with no purchase or subscription.

This is advisory and evidence reconciliation, not a fresh native test or authorization to change the product. Source baseline aa5304d300515cbeef9249a9f0ab919ee8553ed2; existing native QA evidence fa5f66ab1627587a263f7cd5113869061df500e4; [original 13-item review](CD_BUILD5_CLAUDE_PRODUCT_REVIEW_20261126.md); [Build 5 implementation and evidence](CD_CLAUDE_RECOVERY_BUILD5_20261126.md). Claude analyzed the summaries and source facts supplied by ChatGPT, not the actual live binary or repository.

## Important newly reconciled issue

Direct source inspection established that the Free limit is 20 **all retained saved memories**, including archived and recently deleted; unfinished drafts are excluded. `src/plus-memory-limit.ts` explicitly documents this and its error copy. `src/eng-store.ts` invokes the gate using `before.data.memories.length`. `src/eng-screens.tsx` indicates permanent cleanup is unavailable in Development and items are recoverable for at least 30 days. Therefore, in the current enforcement-enabled configuration, a user at 20 cannot create a replacement simply by moving one to Recently Deleted; even an empty active list can remain at the cap. This is a verified source-level policy consequence, not a freshly reproduced native defect.

The free plan does not otherwise lock users out of their data. Existing source tests cover cap crossing, saved-data preservation, revoked/refunded ownership, retry, cancellation and entitlement logic. `src/eng-screens.tsx` implements an ungated readable text report (not restorable; no photos) and individual active/archived memory sharing with selectable details and original photos. A new free full backup is not needed.

## Joint proposed product decision — owner approval required

| Rule | Joint proposal |
|---|---|
| Count | Free may save up to 20 active + archived memories; Recently Deleted and unfinished drafts do not count. Plus remains unlimited. |
| Delete | Moving a memory to Recently Deleted frees a slot; no data or original media silently removed. |
| Restore from Recently Deleted | With verified Free access, allow only when active + archived is at most 19 before restoration; verified Plus unrestricted. At cap, offer read-only view/share and instructions to free a slot or choose Plus; do not delete the item. |
| Legitimate over-cap | Refund, revocation or legitimate restored backup: retain existing data and read/edit/export access; no new save until below the cap or Plus verified. Restore from Recently Deleted still follows the free-slot rule. |
| Restore ambiguity | Archive/unarchive never changes count. Over-cap user may move items to Recently Deleted until a slot is available. At 19 restore one to reach 20. At 20/21 do not restore into active collection without verified Plus. |
| Data exit | Free text report and existing individual memory/selected-photo share remain available. Extend read-only sharing to Recently Deleted using existing controls and reviewed content. Both outputs clearly not restorable full backups. |
| Pricing | Preserve Free and Plus only; US$25.99 one-time Plus, full photo/draft/reminder backup, recovery and device transfer; no subscription or mandatory cloud account. |
| Retention | No automatic purge or default downsizing of originals; permanent deletion deferred separately. Truthful user-facing retention wording (remove internal Development wording), show protected trash storage and count. |

Claude initially preferred blocking trash restoration to prevent repeatedly deleting, creating and restoring to bypass the cap. ChatGPT accepted that narrower compromise only with read-only data access/sharing from trash, protection of legitimate existing over-cap data and no silent deletion. Claude explicitly responded **"Agreed. This resolves the disagreement."** It clarified acceptance at 19, 20 and 21, including delete-down-to-19 then restore; unarchiving does not change count; share/report cannot become a restore path.

The approved original cap rule is not silently changed. Proposed changes require owner's product approval; if declined, document current count/retention and exact behavior instead.

## Agreed execution plan — evidence first, minimum changes

| Sequence | Work that can start on Mac mini without physical devices | Evidence / completion criteria |
|---|---|---|
| 1 | Exact Build 5 provenance, fixtures and baseline regression; historical populated upgrade and interruption/restart | Preserve accepted installs; synthetic older DB and backup fixtures, photos/drafts/linked reminders and prior-save slots retained, incompatible version wording; no data loss. |
| 2 | Accessibility and full journeys on iOS simulator/Android emulator | Maximum text/bold, both themes, Add/Find/Photos/detail/delete/recovery/semantic labels; complete keyboard/navigation, screen-reader traversal/activation; exact-version evidence, limitations separated. Fix newly observed problems only. |
| 3 | Low-storage everyday capture and retrieval scale | Isolated disposable Android storage pressure and iOS bounded failure simulation; preserve draft and original data, no half-write. Synthetic 50–100 representative records then 5,000 memories/10,000 photos where practical; record real timings/memory/scrolling, tune only after measurement. |
| 4 | Store safeguards and privacy | Reuse existing entitlement regressions and local StoreKit config. Validate available sandbox stores; verify permissions and shipping dependency/manifest/data-flow inventory, legitimate billing/network traffic; no unverified 'no data collected' claim. Review actual disclosures before publishing. |
| 5 | Free count and readable sharing, if owner approves | Test active/archive/recently deleted/draft counts; save at 19/20/21; free/Plus/unknown/refund/revocation states; delete/restore/cancel, over-cap legitimate existing access, no permanent deletion or media loss; source/Figma light/dark reconciliation and native parity. |
| 6 | Honest backup status, small UX improvements | Show 'last verified local backup' only following successful local verification, not share-sheet opening or external delivery. Optional gentle prompt/copy after testing, no automatic cloud sync. Validate existing first-memory prompt, share/report and free/Plus explanation. |

## Physical and release gates (not waived by device absence)

- Test full native backup external delivery, particularly iPhone Files; verify a large synthetic archive (target at least 150 MB), cancellation, backgrounding, provider failure handling, off-device copy and recovery in an isolated QA install/second device. Never wipe owner's installation.
- Samsung physical Android acceptance when available; owner iPhone final acceptance after simulator/emulator. A second Android vendor gives useful extra coverage but is not needed to begin emulator work.
- Real store sandbox purchase and restore, refund/revocation, offline/reinstall; no live purchase or store submission. Local StoreKit simulation is not actual store proof.
- Actual reminders and intended destination when tapped, permission denial, reboot, timezone/DST and after restore; test supported platform behavior, disclose Android force-stop / OEM limitations; don't promise delivery through unsupported states.
- Real VoiceOver/TalkBack and physical accessibility, shipping privacy statements, final build verification; signed release remains NO-GO until owner acceptance and release-critical evidence.

Claude and ChatGPT agree that lack of hardware is deferred verification, **not permission to ship**.

## Preserve product identity

Keep Home, Photos, Reminders, Find and the calm Figma authority; offline-first, no mandatory account, existing full restore review/cancel, original photos and protected data. No fifth tab, unnecessary AI capabilities, subscription, automated cloud sync, sharing tier or automatic destructive cleanup. After release, usability-test existing first-memory experience with users and tune based on benchmarks, rather than adding speculative complexity.

## Status

Collaborative review COMPLETE, consensus reached. No app/Figma edits, fresh build, test execution, physical-device changes, purchases or production changes in this collaboration. No new cost. Record the owner decision and subsequent test evidence in GitHub before any implementation/release claim.
